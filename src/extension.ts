'use strict';

import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { Config, FileInfo, HeaderGenerator } from "./interfaces";
import { Days, Months, Eols, SupportedLanguages, Syntax } from "./constants";
import { generate, updateHeader, appendIfndef, appendClass, appendConstructorDestructor } from "./generators";
import { loadConfig, configureSettings } from "./config";
import { isUpper } from "./misc";

export function activate(context: vscode.ExtensionContext) {

    const extConfig = vscode.workspace.getConfiguration("epitech-c-cpp-headers")

    if (extConfig.prompt === true && (extConfig.username === null || extConfig.login === null || extConfig.headerType === null))
        vscode.window.showInformationMessage("Do you want to quickly set up EPITECH headers ?", "Yes", "No").then((resp) => {
            if (resp === "Yes")
                configureSettings(extConfig)
        })

    const disposables = [
        vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', async () => {

            const date = new Date()

            const fileInfo = {} as FileInfo

            fileInfo.editor = vscode.window.activeTextEditor
            fileInfo.document = fileInfo.editor.document
            fileInfo.fileName = fileInfo.document.fileName
            fileInfo.uri = fileInfo.document.uri
            fileInfo.eol = Eols[fileInfo.document.eol]
            fileInfo.ext = path.basename(fileInfo.fileName).split(".").reverse()[0]

            if (Object.keys(SupportedLanguages).indexOf(fileInfo.ext) == -1) {
                vscode.window.showErrorMessage("The currently opened file isn't a supported file.")
                return
            }

            fileInfo.langId = SupportedLanguages[fileInfo.ext]

            fileInfo.projName = await vscode.window.showInputBox({ prompt: "Type project name: ", placeHolder: "Leave empty to use workspace name..." })
            if (fileInfo.projName === undefined) {
                return
            } else if (fileInfo.projName === '') {
                fileInfo.projName = vscode.workspace.name;
            }

            const config = loadConfig();

            if (config.headerType == "post2017") {
                fileInfo.description = await vscode.window.showInputBox({ prompt: "Type project description: ", placeHolder: "Leave empty to use filename..." })
                if (fileInfo.description === undefined) {
                    fileInfo.description = "";
                } else if (fileInfo.description === '') {
                    fileInfo.description = fileInfo.fileName.split('/').reverse()[0].replace(fileInfo.ext, '').slice(0, -1);
                }
            }

            let editContent = generate[config.headerType](fileInfo, config, date)
            let offsetY = Syntax[config.headerType].offsetHeaderFile;
            let offsetX = 0;

            const isEmptyHeaderFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^h|hpp|H|hh$/))
            const isEmptySourceFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^c|cpp|C|cc$/))

            if (isEmptyHeaderFile) {
                const name = path.basename(fileInfo.fileName).replace('.', '_').replace("-", "_").concat("_")
                const id = name.toLocaleUpperCase()
                const className = path.basename(fileInfo.fileName).substr(0, name.length - fileInfo.ext.length - 2)
                if (config.usePragmaOnce)
                    editContent = editContent.concat("#pragma once", fileInfo.eol, fileInfo.eol)
                else
                    editContent = appendIfndef(editContent, id, fileInfo, config);
                if (config.autoGenerateClasses && fileInfo.langId == "cpp" && isUpper(className[0])) {
                    editContent = appendClass(editContent, className, fileInfo);
                    offsetY += 6;
                    offsetX = 2;
                }
                if (!config.usePragmaOnce)
                    editContent = editContent.concat(fileInfo.eol, fileInfo.eol, "#endif /* !", id, " */", fileInfo.eol)
            }

            if (isEmptySourceFile) {
                const name = path.basename(fileInfo.fileName).replace('.', '_').replace("-", "_").concat("_")
                const id = name.toLocaleUpperCase()
                const className = path.basename(fileInfo.fileName).substr(0, name.length - fileInfo.ext.length - 2)
                if (config.autoGenerateClasses && fileInfo.langId == "cpp" && isUpper(className[0]))
                    editContent = appendConstructorDestructor(editContent, className, fileInfo);
            }

            const edit = new vscode.WorkspaceEdit()
            edit.set(fileInfo.uri, [vscode.TextEdit.insert(new vscode.Position(0, 0), editContent)])
            vscode.workspace.applyEdit(edit)

            if (isEmptyHeaderFile) {
                const pos = new vscode.Position(offsetY, offsetX)
                fileInfo.editor.selection = new vscode.Selection(pos, pos)
            }
        }),
        vscode.commands.registerCommand('epitech-c-cpp-headers.setConfig', () => {
            configureSettings(vscode.workspace.getConfiguration("epitech-c-cpp-headers"), true)
        })
    ]

    context.subscriptions.push(...disposables)

    vscode.workspace.onWillSaveTextDocument((ev) => ev.waitUntil(updateHeader(ev)))
}

export function deactivate() {
}