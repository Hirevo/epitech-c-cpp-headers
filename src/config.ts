import * as os from "os";
import * as vscode from "vscode";
import * as z from "zod";

import { Config } from "./types";

async function configureUsername(config: vscode.WorkspaceConfiguration, force: boolean) {
    if (config.username === null || force) {
        const resp = await vscode.window.showInputBox({ prompt: "Type EPITECH username: " });
        if (resp !== undefined) {
            config.update("username", resp, true);
        }
    }
}

async function configureLogin(config: vscode.WorkspaceConfiguration, force: boolean) {
    if (config.login === null || force) {
        const resp = await vscode.window.showInputBox({ prompt: "Type EPITECH login: " });
        if (resp !== undefined) {
            config.update("login", resp, true);
        }
    }
}

async function configureHeaderFormat(config: vscode.WorkspaceConfiguration) {
    const resp = await vscode.window.showQuickPick(
        ["Post 2017", "Pre 2017"],
        { placeHolder: "Select the header format to use:" },
    );
    if (resp !== undefined) {
        config.update("headerType", resp.replace(/\s+/g, '').toLowerCase(), true);
    }
}

async function configureHeaderGuardKind(config: vscode.WorkspaceConfiguration) {
    const resp = await vscode.window.showInformationMessage(
        "Which header guard do you want to use ?",
        "#ifndef/#endif",
        "#pragma once",
    );
    if (resp !== undefined) {
        config.update("usePragmaOnce", resp == "#pragma once", true);
    }
}

async function configureClassGeneration(config: vscode.WorkspaceConfiguration) {
    const resp = await vscode.window.showInformationMessage(
        "Do you want automatic C++ class generation ?",
        "Yes",
        "No",
    );
    if (resp !== undefined) {
        config.update("autoGenerateClasses", resp == "Yes", true);
    }
    if (resp == "Yes") {
        const indentResp = await vscode.window.showInformationMessage(
            "Do you want public, protected and private keywords to be indented ?",
            "Yes",
            "No",
        );
        if (indentResp !== undefined) {
            config.update("indentAccessSpecifiers", indentResp == "Yes", true);
        }
    }
}

async function configureModulesGeneration(config: vscode.WorkspaceConfiguration) {
    const resp = await vscode.window.showInformationMessage(
        "Do you want automatic Haskell module generation ?",
        "Yes",
        "No",
    );
    if (resp !== undefined) {
        config.update("autoGenerateModules", resp == "Yes", true);
    }
}

export async function configureSettings(config: vscode.WorkspaceConfiguration, force = false) {
    await configureUsername(config, force);
    await configureLogin(config, force);
    await configureHeaderFormat(config);
    await configureHeaderGuardKind(config);
    await configureClassGeneration(config);
    await configureModulesGeneration(config);
    vscode.window.showInformationMessage("EPITECH headers have been successfully configured !");
}

export function loadConfig(): Config {
    const handle = vscode.workspace.getConfiguration("epitech-c-cpp-headers");

    const config = z.object({
        username: z.string().default(() => os.userInfo().username),
        login: z.string().default(""),
        headerType: z.enum(["pre2017", "post2017"]).default("post2017"),
        usePragmaOnce: z.boolean().default(false),
        autoGenerateClasses: z.boolean().default(true),
        indentAccessSpecifiers: z.boolean().default(true),
        autoGenerateModules: z.boolean().default(true),
    }).parse(handle);

    return { ...config, handle };
}
