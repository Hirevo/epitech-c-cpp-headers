import * as vscode from "vscode";
import * as os from "os";
import { Config } from "./interfaces";

export async function configureSettings(config: vscode.WorkspaceConfiguration, force = false) {
    if (config.username === null || force) {
        const resp = await vscode.window.showInputBox({ prompt: "Type EPITECH username: " });
        if (resp !== undefined)
            config.update("username", resp, true);
    }
    if (config.login === null || force) {
        const resp = await vscode.window.showInputBox({ prompt: "Type EPITECH login: " });
        if (resp !== undefined)
            config.update("login", resp, true);
    }
    {
        const resp = await vscode.window.showQuickPick(["Pre 2017", "Post 2017"], { placeHolder: "Select the header format to use:" });
        config.update("headerType", resp.replace(/\s+/g, '').toLowerCase(), true);
    }
    {
        const resp = await vscode.window.showInformationMessage("Which header guard do you want to use ?", "#ifndef", "#pragma once");
        if (resp !== undefined)
            config.update("usePragmaOnce", resp == "#pragma once", true);
    }
    {
        const resp = await vscode.window.showInformationMessage("Do you want automatic C++ class generation ?", "Yes", "No");
        if (resp !== undefined)
            config.update("autoGenerateClasses", resp == "Yes", true);
    }
    vscode.window.showInformationMessage("EPITECH Headers have been successfully configured !");
}

export function loadConfig() {
    const config = {} as Config;

    config.handle = vscode.workspace.getConfiguration("epitech-c-cpp-headers");
    config.username = (config.handle.username === null) ? os.userInfo().username : config.handle.username;
    config.login = (config.handle.login === null) ? "" : config.handle.login;
    config.headerType = config.handle.headerType || "post2017";
    config.usePragmaOnce = config.handle.usePragmaOnce || false;
    config.autoGenerateClasses = config.handle.autoGenerateClasses || true;
    return config;
}
