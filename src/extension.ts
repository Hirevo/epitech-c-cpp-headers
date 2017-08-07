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
        commentStart = { c: "/*", cpp: "//", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "/*", "C#": "/*", ObjectiveC: "/*" },
        commentMid = { c: "**", cpp: "//", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "**", "C#": "**", ObjectiveC: "**" },
        commentEnd = { c: "*/", cpp: "//", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "*/", "C#": "*/", ObjectiveC: "*/" }

    let eols = ["", "\n", "\r\n"]

    let supported = {
        "c": "c",
        "h": "c",
        "cpp": "cpp",
        "hpp": "cpp",
        "cc": "cpp",
        "hh": "cpp",
        "C": "cpp",
        "H": "cpp",
        "cxx": "cpp",
        "hxx": "cpp",
        "c++": "cpp",
        "h++": "cpp",
        "Makefile": "Makefile",
        "py": "Python",
        "sh": "Shell",
        "tex": "LaTeX",
        "java": "Java",
        "cs": "C#",
        "m": "ObjectiveC"
    }

    const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let disposables = [
        vscode.commands.registerCommand('epitech-c-cpp-headers.addHeader', async () => {

            let date = new Date()

            let editor = vscode.window.activeTextEditor
            let document = editor.document
            let fileName = document.fileName
            let uri = document.uri
            let eol = eols[document.eol]
            let ext = path.basename(fileName).split(".").reverse()[0];

            if (Object.keys(supported).indexOf(ext) == -1) {
                vscode.window.showErrorMessage("The currently opened file isn't a supported file.")
                return
            }

            let langId = supported[ext]

            let projName: string | undefined = await vscode.window.showInputBox({ prompt: "Type project name: " })
            if (projName === undefined)
                return

            let config = vscode.workspace.getConfiguration("epitech-c-cpp-headers")
            let username: string = (config.username === null) ? os.userInfo().username : config.username
            let login: string = (config.login === null) ? "" : config.login

            let editContent = ""

            editContent = editContent.concat(commentStart[langId], eol)
            editContent = editContent.concat(commentMid[langId], " ", path.basename(fileName), headerFor, projName, headerIn, path.dirname(fileName), eol)
            editContent = editContent.concat(commentMid[langId], eol)
            editContent = editContent.concat(commentMid[langId], " ", headerMadeBy, username, eol)
            editContent = editContent.concat(commentMid[langId], " ", headerLogin, headerLoginBeg, login, headerLoginMid, domaineName, headerLoginEnd, eol)
            editContent = editContent.concat(commentMid[langId], eol)
            editContent = editContent.concat(commentMid[langId], " ", headerStarted, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, eol)
            editContent = editContent.concat(commentMid[langId], " ", headerLast, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, eol)
            editContent = editContent.concat(commentEnd[langId], eol, eol)

            let isEmptyHeaderFile = (document.getText() == '' && ext.match(/^h|hpp|H|hh$/))

            if (isEmptyHeaderFile) {
                let id = path.basename(fileName).replace('.', '_').concat("_").toLocaleUpperCase()
                editContent = editContent.concat("#ifndef ", id, eol, "# define ", id, eol, eol, eol, eol, "#endif /* !", id, " */", eol)
            }

            let edit = new vscode.WorkspaceEdit()
            edit.set(uri, [vscode.TextEdit.insert(new vscode.Position(0, 0), editContent)])
            vscode.workspace.applyEdit(edit)

            if (isEmptyHeaderFile) {
                let pos = new vscode.Position(13, 0)
                editor.selection = new vscode.Selection(pos, pos)
            }
        }),
        vscode.commands.registerCommand('epitech-c-cpp-headers.setConfig', () => {
            configureSettings(vscode.workspace.getConfiguration("epitech-c-cpp-headers"), true)
        })
    ]

    context.subscriptions.push(...disposables)

    vscode.workspace.onWillSaveTextDocument((ev) => {
        ev.waitUntil(new Promise((resolve, reject) => {
            let langId = path.basename(ev.document.fileName).split(".").reverse()[0];

            if (Object.keys(supported).indexOf(langId) == -1)
                resolve()

            langId = supported[langId]

            let date = new Date()
            let username = vscode.workspace.getConfiguration("epitech-c-cpp-headers").username
            username = (username === null) ? os.userInfo().username : username
            let file = ev.document.getText()
            let regex = new RegExp(`(${escapeRegExpString(commentMid[langId])} ${escapeRegExpString(headerLast)})(.*)(${eols[ev.document.eol]})`)
            let match = regex.exec(file)
            if (match.length == 0)
                resolve();
            let TextEdit = new vscode.TextEdit(new vscode.Range(ev.document.positionAt(match.index), ev.document.positionAt(match.index + match[0].length)), commentMid[langId].concat(" ", headerLast, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, eols[ev.document.eol]))
            resolve([TextEdit])
        }))
    })
}

export function deactivate() {
}