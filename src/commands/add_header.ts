import * as path from "path";
import * as vscode from "vscode";

import { FileInfo, isSupportedExtension } from "../types";
import { EXTENSION_TO_LANGUAGE, LINE_TERMINATORS, SYNTAX } from "../constants";
import { loadConfig } from "../config";
import { GENERATORS, appendClass, appendConstructorDestructor, appendHaskellModule, appendIfndef } from "../generators";
import { isUpper } from "../utils";

// Asks the user about the project name to use, or defaults to using the current workspace's name.
//
// A return of `undefined` signals a cancellation request.
async function promptProjectName(): Promise<string | undefined> {
    const projectName = await vscode.window.showInputBox({
        prompt: "Type project name: ",
        placeHolder: "Leave empty to generate one based on workspace name...",
    });

    if (projectName === undefined) {
        vscode.window.showInformationMessage("Operation canceled !");
        return undefined;
    }

    if (projectName.length === 0) {
        if (vscode.workspace.name == undefined) {
            vscode.window.showErrorMessage("Unable to resolve the workspace name.");
            return undefined;
        }
        return vscode.workspace.name;
    }

    return projectName;
}

// Prompts the user about the file description to use, or default the file's stem name.
//
// A return of `undefined` signals a cancellation request.
async function promptFileDescription(fileInfo: FileInfo): Promise<string | undefined> {
    const description = await vscode.window.showInputBox({
        prompt: "Type file description: ",
        placeHolder: "Leave empty to generate one based on filename...",
    });

    if (description === undefined) {
        vscode.window.showInformationMessage("Operation canceled !");
        return undefined;
    }

    if (description.length === 0) {
        const basename = path.basename(fileInfo.fileName);
        const result = /^(.*)\.(.+)$/.exec(basename);
        return result?.[1] ?? basename;
    }

    return description;
}

// Prompts the user about the header guard's name to use, or defaults to one based on the file's name.
//
// A return of `undefined` signals a cancellation request.
async function promptHeaderGuardName(baseName: string): Promise<string | undefined> {
    const headerGuardName = await vscode.window.showInputBox({
        prompt: "Type header guard's name: ",
        placeHolder: "Leave empty to generate one based on filename...",
        validateInput: name => {
            const results = /([^A-Za-z0-9_])/.exec(name);
            if (!results) {
                return undefined;
            } else {
                return `'${results[0]}' isn't valid.
                    Only alphanumeric characters and '_' are allowed in header guards.
                    Please try again with a valid name or leave empty to generate one based on the filename.`;
            }
        },
    });

    if (headerGuardName === undefined) {
        vscode.window.showInformationMessage("Operation canceled !");
        return undefined;
    }

    if (headerGuardName.length === 0) {
        return baseName
            .replace(/[^A-Za-z0-9]/g, "_")
            .concat("_")
            .toLocaleUpperCase();
    }

    return headerGuardName;
}

export async function runAddHeader() {
    const date = new Date();
    const fileInfo = {} as FileInfo;

    const editor = vscode.window.activeTextEditor;
    if (editor == undefined) {
        vscode.window.showErrorMessage("There is not a currently active editor.");
        return;
    }

    fileInfo.editor = editor;
    fileInfo.document = fileInfo.editor.document;
    fileInfo.fileName = fileInfo.document.fileName;
    fileInfo.uri = fileInfo.document.uri;
    fileInfo.eol = LINE_TERMINATORS[fileInfo.document.eol];

    const extension = path.basename(fileInfo.fileName).split(".").reverse()[0];
    if (!isSupportedExtension(extension)) {
        vscode.window.showErrorMessage("The currently opened file (" + extension + ") isn't a supported file.");
        return;
    }

    fileInfo.ext = extension;
    fileInfo.langId = EXTENSION_TO_LANGUAGE[fileInfo.ext];

    const projectName = await promptProjectName();
    if (projectName === undefined) return;
    fileInfo.projName = projectName;

    const config = loadConfig();

    if (config.headerType == "post2017") {
        const description = await promptFileDescription(fileInfo);
        if (description === undefined) return;
        fileInfo.description = description;
    }

    let editContent = GENERATORS[config.headerType](fileInfo, config, date);
    let offsetY = SYNTAX[config.headerType].offsetHeaderFile;
    let offsetX = 0;

    const isEmptyHeaderFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^(?:h|hpp|H|hh|hxx)$/));
    const isEmptySourceFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^(?:c|cpp|C|cc|cxx)$/));

    if (isEmptyHeaderFile) {
        const baseName = path.basename(fileInfo.fileName);
        const className = baseName.slice(0, -(fileInfo.ext.length + 1));
        let headerGuardName: string | undefined = undefined;
        if (config.usePragmaOnce) {
            editContent = editContent.concat("#pragma once", fileInfo.eol, fileInfo.eol);
        } else {
            headerGuardName = await promptHeaderGuardName(baseName);
            if (headerGuardName === undefined) return;
            editContent = appendIfndef(editContent, headerGuardName, fileInfo, config);
        }
        if (config.autoGenerateClasses && fileInfo.langId == "C++" && isUpper(className[0])) {
            editContent = appendClass(editContent, className, fileInfo, config);
            offsetY += 3 + Number(config.usePragmaOnce == false);
            offsetX = 0;
        }
        if (!config.usePragmaOnce) {
            editContent = editContent.concat(fileInfo.eol, "#endif /* !", headerGuardName!, " */", fileInfo.eol);
        }
    }

    if (isEmptySourceFile) {
        const className = path.basename(fileInfo.fileName).slice(0, -(fileInfo.ext.length + 1));
        if (config.autoGenerateClasses && fileInfo.langId == "C++" && isUpper(className[0])) {
            editContent = appendConstructorDestructor(editContent, className, fileInfo);
        }
        if (config.autoGenerateModules && fileInfo.langId == "Haskell") {
            editContent = appendHaskellModule(editContent,fileInfo);
        }
    }

    const edit = new vscode.WorkspaceEdit();
    edit.set(fileInfo.uri, [vscode.TextEdit.insert(new vscode.Position(0, 0), editContent)]);
    vscode.workspace.applyEdit(edit);

    if (isEmptyHeaderFile) {
        const pos = new vscode.Position(offsetY, offsetX);
        fileInfo.editor.selection = new vscode.Selection(pos, pos);
    }
}