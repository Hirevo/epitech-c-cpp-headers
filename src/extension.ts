import * as vscode from "vscode";

import { configureSettings } from "./config";

import { runAddHeader } from "./commands/add_header";
import { handleUpdateHeader } from "./handlers/update_header";

export async function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration("epitech-c-cpp-headers");

    const isRequiredFieldMissing = config.username === null || config.login === null || config.headerType === null;
    if (config.prompt === true && isRequiredFieldMissing) {
        const response = await vscode.window.showInformationMessage(
            "Do you want to quickly set up EPITECH headers ?",
            "Yes",
            "No",
        );
        if (response === "Yes") {
            configureSettings(config);
        }
    }

    const disposables = [
        vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', () => {
            runAddHeader();
        }),
        vscode.commands.registerCommand('epitech-c-cpp-headers.setConfig', () => {
            const config = vscode.workspace.getConfiguration("epitech-c-cpp-headers");
            configureSettings(config, true);
        }),
    ];

    context.subscriptions.push(...disposables);

    vscode.workspace.onWillSaveTextDocument(ev => ev.waitUntil(handleUpdateHeader(ev)));
}

export function deactivate() {
}
