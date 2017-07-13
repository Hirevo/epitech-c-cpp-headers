'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as os from 'os'
import * as path from 'path'

export function activate(context: vscode.ExtensionContext) {

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

    let disposable = vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', async () => {

        let date = new Date()

        let fileName = vscode.window.activeTextEditor.document.fileName
        let langId = path.basename(fileName).split(".").reverse()[0];

        if (Object.keys(supported).indexOf(langId) == -1) {
            vscode.window.showErrorMessage("The currently opened file isn't a supported file.")
            return
        }

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
    })

    context.subscriptions.push(disposable)

    vscode.workspace.onDidSaveTextDocument(async (ev) => {
        if (ev.fileName.endsWith(".c") || ev.fileName.endsWith(".cpp") || ev.fileName.endsWith(".h") || ev.fileName.endsWith(".hpp")) {
            let date = new Date()
            let username = vscode.workspace.getConfiguration("epitech-c-cpp-headers").username
            username = (username === null) ? os.userInfo().username : username
            let text = (await fs.readFile(ev.fileName)).toString()
            text = text.replace(new RegExp(`(${headerLast})(.*)(${os.EOL})`), headerLast.concat(Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, os.EOL))
            fs.writeFile(ev.fileName, text)
        }
    })
}

export function deactivate() {
}