import * as path from "path";
import * as vscode from "vscode";
import { configureSettings, loadConfig } from "./config";
import { EOLS, SUPPORTED_LANGUAGES, SYNTAX } from "./constants";
import { appendClass, appendConstructorDestructor, appendIfndef, generate, updateHeader } from "./generators";
import { FileInfo } from "./interfaces";
import { isUpper } from "./misc";

export function activate(context: vscode.ExtensionContext) {
    const extConfig = vscode.workspace.getConfiguration("epitech-c-cpp-headers");

    if (extConfig.prompt === true && (extConfig.username === null || extConfig.login === null || extConfig.headerType === null)) {
        (async () => {
            const resp = await vscode.window.showInformationMessage(
                "Do you want to quickly set up EPITECH headers ?",
                "Yes",
                "No",
            );
            if (resp === "Yes") {
                configureSettings(extConfig);
            }
        })();
    }

    const disposables = [
        vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', async () => {
            const date = new Date();
            const fileInfo = {} as FileInfo;

            fileInfo.editor = vscode.window.activeTextEditor;
            fileInfo.document = fileInfo.editor.document;
            fileInfo.fileName = fileInfo.document.fileName;
            fileInfo.uri = fileInfo.document.uri;
            fileInfo.eol = EOLS[fileInfo.document.eol];
            fileInfo.ext = path.basename(fileInfo.fileName).split(".").reverse()[0];

            if (!(fileInfo.ext in SUPPORTED_LANGUAGES)) {
                vscode.window.showErrorMessage("The currently opened file isn't a supported file.");
                return;
            }

            fileInfo.langId = SUPPORTED_LANGUAGES[fileInfo.ext];

            fileInfo.projName = await vscode.window.showInputBox({
                prompt: "Type project name: ",
                placeHolder: "Leave empty to generate one based on workspace name...",
            });
            if (fileInfo.projName === undefined) {
                vscode.window.showInformationMessage("Operation canceled !");
                return;
            } else if (fileInfo.projName === '') {
                fileInfo.projName = vscode.workspace.name;
            }

            const config = loadConfig();

            if (config.headerType == "post2017") {
                fileInfo.description = await vscode.window.showInputBox({
                    prompt: "Type project description: ",
                    placeHolder: "Leave empty to generate one based on filename...",
                });
                if (fileInfo.description === undefined) {
                    vscode.window.showInformationMessage("Operation canceled !");
                    return;
                } else if (fileInfo.description === '') {
                    const basename = path.basename(fileInfo.fileName);
                    if (/^[^\.]+\..+$/.test(basename)) {
                        fileInfo.description = basename.slice(0, -(fileInfo.ext.length + 1));
                    } else {
                        fileInfo.description = basename;
                    }
                }
            }

            let editContent = generate[config.headerType](fileInfo, config, date);
            let offsetY = SYNTAX[config.headerType].offsetHeaderFile;
            let offsetX = 0;

            const isEmptyHeaderFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^(?:h|hpp|H|hh)$/));
            const isEmptySourceFile = (fileInfo.document.getText() == '' && fileInfo.ext.match(/^(?:c|cpp|C|cc)$/));

            if (isEmptyHeaderFile) {
                const base = path.basename(fileInfo.fileName);
                const className = base.substr(0, base.length - fileInfo.ext.length - 1);
                let name: string | undefined = undefined;
                if (config.usePragmaOnce) {
                    editContent = editContent.concat("#pragma once", fileInfo.eol, fileInfo.eol);
                } else {
                    name = await vscode.window.showInputBox({
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
                    if (name === undefined) {
                        vscode.window.showInformationMessage("Operation canceled !");
                        return;
                    }
                    name = name || base.replace(/[^A-Za-z0-9]/g, "_").concat("_").toLocaleUpperCase();
                    editContent = appendIfndef(editContent, name, fileInfo, config);
                }
                if (config.autoGenerateClasses && fileInfo.langId == "cpp" && isUpper(className[0])) {
                    editContent = appendClass(editContent, className, fileInfo);
                    offsetY += 3 + Number(config.usePragmaOnce == false);
                    offsetX = 0;
                }
                if (!config.usePragmaOnce) {
                    editContent = editContent.concat(fileInfo.eol, "#endif /* !", name, " */", fileInfo.eol);
                }
            }

            if (isEmptySourceFile) {
                const name = path.basename(fileInfo.fileName).replace(/[^A-Za-z0-9]/g, "_").concat("_");
                const className = path.basename(fileInfo.fileName).substr(0, name.length - fileInfo.ext.length - 2);
                if (config.autoGenerateClasses && fileInfo.langId == "cpp" && isUpper(className[0])) {
                    editContent = appendConstructorDestructor(editContent, className, fileInfo);
                }
            }

            const edit = new vscode.WorkspaceEdit();
            edit.set(fileInfo.uri, [vscode.TextEdit.insert(new vscode.Position(0, 0), editContent)]);
            vscode.workspace.applyEdit(edit);

            if (isEmptyHeaderFile) {
                const pos = new vscode.Position(offsetY, offsetX);
                fileInfo.editor.selection = new vscode.Selection(pos, pos);
            }
        }),
        vscode.commands.registerCommand('epitech-c-cpp-headers.setConfig', () => {
            configureSettings(vscode.workspace.getConfiguration("epitech-c-cpp-headers"), true);
        }),
    ];

    context.subscriptions.push(...disposables);

    vscode.workspace.onWillSaveTextDocument(ev => ev.waitUntil(updateHeader(ev)));
}

export function deactivate() {
}
