import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import * as escapeRegExpString from "escape-string-regexp";
import { DAYS, EOLS, MONTHS, SUPPORTED_LANGUAGES, SYNTAX } from "./constants";
import { Config, FileInfo, HeaderGenerator } from "./interfaces";

export const generate: HeaderGenerator = {
    pre2017: generatePre2017Header,
    post2017: generatePost2017Header
};

function generatePre2017Header(fileInfo: FileInfo, config: Config, date: Date): string {
    const editContent = "";

    return editContent
        .concat(
            SYNTAX.commentStart[fileInfo.langId], fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], " ", path.basename(fileInfo.fileName), SYNTAX.pre2017.headerFor, fileInfo.projName, SYNTAX.pre2017.headerIn, path.dirname(fileInfo.fileName), fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], " ", SYNTAX.pre2017.headerMadeBy, config.username, fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], " ", SYNTAX.pre2017.headerLogin, SYNTAX.pre2017.headerLoginBeg, config.login, SYNTAX.pre2017.headerLoginMid, SYNTAX.pre2017.domaineName, SYNTAX.pre2017.headerLoginEnd, fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], " ", SYNTAX.pre2017.headerStarted, DAYS[date.getDay() - 1], " ", MONTHS[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", config.username, fileInfo.eol,
            SYNTAX.commentMid[fileInfo.langId], " ", SYNTAX.pre2017.headerLast, DAYS[date.getDay() - 1], " ", MONTHS[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", config.username, fileInfo.eol,
            SYNTAX.commentEnd[fileInfo.langId], fileInfo.eol, fileInfo.eol,
        );
}

function generatePost2017Header(fileInfo: FileInfo, config: Config, date: Date): string {
    const editContent = "";

    return editContent.concat(
        SYNTAX.commentStart[fileInfo.langId], fileInfo.eol,
        SYNTAX.commentMid[fileInfo.langId], " ", "EPITECH PROJECT, ", date.getFullYear().toString(), fileInfo.eol,
        SYNTAX.commentMid[fileInfo.langId], " ", fileInfo.projName, fileInfo.eol,
        SYNTAX.commentMid[fileInfo.langId], " ", "File description:", fileInfo.eol,
        SYNTAX.commentMid[fileInfo.langId], " ", fileInfo.description as string, fileInfo.eol,
        SYNTAX.commentEnd[fileInfo.langId], fileInfo.eol, fileInfo.eol,
    );
}

// getTabType() generates a tab string based on the user's editors settings.
// If the insertSpaces setting is false : it will just return a '\t'.
// If it's set to true : it will check the tabSize setting and return a string of that length and made of whitespaces.
function getTabType(): string {
    const editor = vscode.window.activeTextEditor;
    const tabSize: number = (editor.options.tabSize as number);
    let tab: string = "";

    if (!editor) {
        tab = "\t";
        return tab;
    }
    if (editor.options.insertSpaces) {
        if (tabSize)
            tab += " ".repeat(tabSize);
        else
            tab = "    ";
    }
    else
        tab = "\t";
    return tab;
}

// Generates a class with user-specified indentation style.
// If indentAccessSpecifiers is true (default) : "public", "protected" and "private" keywords will have an indentation of one tab.
// if set to false : they won't be indented at all.
export function appendClass(editContent: string, className: string, fileInfo: FileInfo, config: Config): string {
    const tab: string = getTabType();
    const indent: number = (config.indentAccessSpecifiers) ? 1 : 0;

    return editContent.concat(
        `class ${className} {`, fileInfo.eol,
        tab.repeat(indent), 'public:', fileInfo.eol,
        tab.repeat(indent + 1), `${className}();`, fileInfo.eol,
        tab.repeat(indent + 1), `~${className}();`, fileInfo.eol,
        fileInfo.eol,
        tab.repeat(indent), 'protected:', fileInfo.eol,
        tab.repeat(indent), 'private:', fileInfo.eol,
        '};', fileInfo.eol,
    );
}

export function appendIfndef(editContent: string, id: string, fileInfo: FileInfo, config: Config): string {
    return editContent.concat(
        `#ifndef ${id}`, fileInfo.eol,
        `${SYNTAX[config.headerType].preProcessorStyle}define ${id}`, fileInfo.eol,
        fileInfo.eol,
    );
}

export function appendConstructorDestructor(editContent: string, className: string, fileInfo: FileInfo): string {
    const map = { "cpp": "hpp", "C": "H", "cc": "hh" };

    editContent = editContent.concat(
        `#include "${path.basename(fileInfo.fileName).replace("." + fileInfo.ext, "." + map[fileInfo.ext])}"`, fileInfo.eol,
        fileInfo.eol,
        `${className}::${className}()`, fileInfo.eol,
        '{', fileInfo.eol,
        '}', fileInfo.eol,
        fileInfo.eol,
        `${className}::~${className}()`, fileInfo.eol,
        "{", fileInfo.eol,
        "}", fileInfo.eol,
    );
    return editContent;
}

export async function updateHeader(ev: vscode.TextDocumentWillSaveEvent): Promise<vscode.TextEdit[] | undefined> {
    const config = vscode.workspace.getConfiguration("epitech-c-cpp-headers");

    if (config.headerType == "post2017")
        return;

    let langId = path.basename(ev.document.fileName).split(".").reverse()[0];

    if (!(langId in SUPPORTED_LANGUAGES))
        return;

    langId = SUPPORTED_LANGUAGES[langId];

    const date = new Date();
    let username = vscode.workspace.getConfiguration("epitech-c-cpp-headers").username;
    username = (username === null) ? os.userInfo().username : username;
    const file = ev.document.getText();
    const regex = new RegExp(`(${escapeRegExpString(SYNTAX.commentMid[langId])} ${escapeRegExpString(SYNTAX.pre2017.headerLast)})(.*)(${EOLS[ev.document.eol]})`);
    const match = regex.exec(file);
    if (match.length == 0)
        return;
    const editContent = SYNTAX.commentMid[langId]
        .concat(" ", SYNTAX.pre2017.headerLast, DAYS[date.getDay()], " ", MONTHS[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", username, EOLS[ev.document.eol]);
    const TextEdit = new vscode.TextEdit(
        new vscode.Range(
            ev.document.positionAt(match.index),
            ev.document.positionAt(match.index + match[0].length)
        ),
        editContent,
    );
    return [TextEdit];
}
