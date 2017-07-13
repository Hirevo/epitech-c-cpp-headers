'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as escapeRegExpString from "escape-string-regexp"

async function configureSettings(config: vscode.WorkspaceConfiguration, force = false) {
    if (config.username === null || force) {
        var resp = await vscode.window.showInputBox({ prompt: "Type EPITECH username: " })
        if (resp !== undefined)
            config.update("username", resp, true)
    }
    if (config.login === null || force) {
        var resp = await vscode.window.showInputBox({ prompt: "Type EPITECH login: " })
        if (resp !== undefined)
            config.update("login", resp, true)
    }
    vscode.window.showInformationMessage("EPITECH Headers have been successfully configured !")
}

export function activate(context: vscode.ExtensionContext) {

    let extConfig = vscode.workspace.getConfiguration("epitech-c-cpp-headers")

    if (extConfig.prompt === true && (extConfig.username === null || extConfig.login === null))
        vscode.window.showInformationMessage("Do you want to quickly set up EPITECH headers ?", "Yes", "No").then((resp) => {
            if (resp === "Yes")
                configureSettings(extConfig)
        })

    let headerMadeBy = "Made by ",
        headerLogin = "Login   ",
        headerLoginBeg = "<",
        headerLoginMid = "",
        headerLoginEnd = ">",
        headerStarted = "Started on  ",
        headerLast = "Last update ",
        headerFor = " for ",
        headerIn = " in ",
        domaineName = "",
        commentStart = { c: "/*", cpp: "//", Makefile: "##" },
        commentMid = { c: "**", cpp: "//", Makefile: "##" },
        commentEnd = { c: "*/", cpp: "//", Makefile: "##" }

    let supported = {
        "c": "c",
        "h": "c",
        "cpp": "cpp",
        "hpp": "cpp",
        "Makefile": "Makefile"
    }

    const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let disposables = [
        vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', async () => {

            let date = new Date()

            let fileName = vscode.window.activeTextEditor.document.fileName
            let langId = path.basename(fileName).split(".").reverse()[0];

            if (Object.keys(supported).indexOf(langId) == -1) {
                vscode.window.showErrorMessage("The currently opened file isn't a supported file.")
                return
            }

            langId = supported[langId]

            let projName: string | undefined = await vscode.window.showInputBox({ prompt: "Type project name: " })
            if (projName === undefined)
                return

            let config = vscode.workspace.getConfiguration("epitech-c-cpp-headers")
            let username: string = (config.username === null) ? os.userInfo().username : config.username
            let login: string = (config.login === null) ? "" : config.login

            let header = ""

            header = header.concat(commentStart[langId], os.EOL)
            header = header.concat(commentMid[langId], " ", path.basename(fileName), headerFor, projName, headerIn, path.dirname(fileName), os.EOL)
            header = header.concat(commentMid[langId], os.EOL)
            header = header.concat(commentMid[langId], " ", headerMadeBy, username, os.EOL)
            header = header.concat(commentMid[langId], " ", headerLogin, headerLoginBeg, login, headerLoginMid, domaineName, headerLoginEnd, os.EOL)
            header = header.concat(commentMid[langId], os.EOL)
            header = header.concat(commentMid[langId], " ", headerStarted, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, os.EOL)
            header = header.concat(commentMid[langId], " ", headerLast, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, os.EOL)
            header = header.concat(commentEnd[langId], os.EOL, os.EOL)

            let text = (await fs.readFile(fileName)).toString()
            text = header + text

            fs.writeFile(fileName, text)
        }),
        vscode.commands.registerCommand('epitech-c-cpp-headers.setConfig', () => {
            configureSettings(vscode.workspace.getConfiguration("epitech-c-cpp-headers"), true)
        })
    ]

    context.subscriptions.push(...disposables)

    vscode.workspace.onDidSaveTextDocument(async (ev) => {
        let langId = path.basename(ev.fileName).split(".").reverse()[0];

        if (Object.keys(supported).indexOf(langId) == -1)
            return

        langId = supported[langId]

        let date = new Date()
        let username = vscode.workspace.getConfiguration("epitech-c-cpp-headers").username
        username = (username === null) ? os.userInfo().username : username
        let text = (await fs.readFile(ev.fileName)).toString()
        text = text.replace(new RegExp(`(${escapeRegExpString(commentMid[langId])} ${escapeRegExpString(headerLast)})(.*)(${os.EOL})`), commentMid[langId].concat(" ", headerLast, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, os.EOL))
        fs.writeFile(ev.fileName, text)
    })
}

export function deactivate() {
}