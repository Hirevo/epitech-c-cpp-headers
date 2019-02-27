import * as vscode from "vscode";
import * as os from "os";
import * as path from "path";
import * as escapeRegExpString from "escape-string-regexp";
import { HeaderGenerator, FileInfo, Config } from "./interfaces";
import { Syntax, Days, Months, SupportedLanguages, Eols } from "./constants";

export const generate: HeaderGenerator = {
    pre2017: generatePre2017Header,
    post2017: generatePost2017Header
}

function generatePre2017Header(fileInfo: FileInfo, config: Config, date: Date) {
    let editContent = ""

    editContent = editContent.concat(Syntax.commentStart[fileInfo.langId], fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", path.basename(fileInfo.fileName), Syntax.pre2017.headerFor, fileInfo.projName, Syntax.pre2017.headerIn, path.dirname(fileInfo.fileName), fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", Syntax.pre2017.headerMadeBy, config.username, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", Syntax.pre2017.headerLogin, Syntax.pre2017.headerLoginBeg, config.login, Syntax.pre2017.headerLoginMid, Syntax.pre2017.domaineName, Syntax.pre2017.headerLoginEnd, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", Syntax.pre2017.headerStarted, Days[date.getDay() - 1], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", config.username, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", Syntax.pre2017.headerLast, Days[date.getDay() - 1], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", config.username, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentEnd[fileInfo.langId], fileInfo.eol, fileInfo.eol)

    return editContent
}

function generatePost2017Header(fileInfo: FileInfo, config: Config, date: Date) {
    let editContent = ""

    editContent = editContent.concat(Syntax.commentStart[fileInfo.langId], fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", "EPITECH PROJECT, ", date.getFullYear().toString(), fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", fileInfo.projName, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", "File description:", fileInfo.eol)
    editContent = editContent.concat(Syntax.commentMid[fileInfo.langId], " ", fileInfo.description as string, fileInfo.eol)
    editContent = editContent.concat(Syntax.commentEnd[fileInfo.langId], fileInfo.eol, fileInfo.eol)

    return editContent
}

export function appendClass(editContent: string, className: string, fileInfo: FileInfo) {
    editContent = editContent.concat("class ", className, " {", fileInfo.eol)
    editContent = editContent.concat("\tpublic:", fileInfo.eol, "\t\t", className, "();", fileInfo.eol, "\t\t~", className, "();", fileInfo.eol, fileInfo.eol, "\tprotected:", fileInfo.eol, "\tprivate:", fileInfo.eol)
    editContent = editContent.concat("};", fileInfo.eol)
    return editContent;
}

export function appendIfndef(editContent: string, id: string, fileInfo: FileInfo, config: Config) {
    return editContent.concat("#ifndef ", id, fileInfo.eol, Syntax[config.headerType].preProcessorStyle, "define ", id, fileInfo.eol, fileInfo.eol);
}

export function appendConstructorDestructor(editContent: string, className: string, fileInfo: FileInfo) {
    const map = { "cpp": "hpp", "C": "H", "cc": "hh" };

    editContent = editContent.concat("#include \"", path.basename(fileInfo.fileName).replace("." + fileInfo.ext, "." + map[fileInfo.ext]), "\"", fileInfo.eol);
    editContent = editContent.concat(fileInfo.eol, className, "::", className, "()", fileInfo.eol);
    editContent = editContent.concat("{", fileInfo.eol, "}", fileInfo.eol);
    editContent = editContent.concat(fileInfo.eol, className, "::~", className, "()", fileInfo.eol);
    editContent = editContent.concat("{", fileInfo.eol, "}", fileInfo.eol);
    return editContent;
}

export function updateHeader(ev: vscode.TextDocumentWillSaveEvent): Promise<vscode.TextEdit[] | undefined> {
    return new Promise((resolve, reject) => {
        const config = vscode.workspace.getConfiguration("epitech-c-cpp-headers");

        if (config.headerType == "post2017")
            resolve();

        let langId = path.basename(ev.document.fileName).split(".").reverse()[0];

        if (Object.keys(SupportedLanguages).indexOf(langId) == -1)
            resolve();

        langId = SupportedLanguages[langId];

        const date = new Date();
        let username = vscode.workspace.getConfiguration("epitech-c-cpp-headers").username;
        username = (username === null) ? os.userInfo().username : username;
        const file = ev.document.getText();
        const regex = new RegExp(`(${escapeRegExpString(Syntax.commentMid[langId])} ${escapeRegExpString(Syntax.pre2017.headerLast)})(.*)(${Eols[ev.document.eol]})`);
        const match = regex.exec(file);
        if (match.length == 0)
            resolve();
        const TextEdit = new vscode.TextEdit(new vscode.Range(ev.document.positionAt(match.index), ev.document.positionAt(match.index + match[0].length)), Syntax.commentMid[langId].concat(" ", Syntax.pre2017.headerLast, Days[date.getDay()], " ", Months[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, Eols[ev.document.eol]));
        resolve([TextEdit]);
    });
}
