import * as path from "path";
import * as vscode from "vscode";

import { DAYS, MONTHS, SYNTAX } from "./constants";
import { Config, FileInfo, HeaderGenerator as HeaderGenerators } from "./types";

export const GENERATORS: HeaderGenerators = {
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

function generatePost2017Header(fileInfo: FileInfo, _config: Config, date: Date): string {
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
function getTabType(editor: vscode.TextEditor): string {
    const tabSize = (editor.options.tabSize ?? 4) as number;
    return editor.options.insertSpaces ? " ".repeat(tabSize) : "\t";
}

// Generates a class with user-specified indentation style.
// If indentAccessSpecifiers is true (default) : "public", "protected" and "private" keywords will have an indentation of one tab.
// if set to false : they won't be indented at all.
export function appendClass(editContent: string, className: string, fileInfo: FileInfo, config: Config): string {
    const tab: string = getTabType(fileInfo.editor);
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
    const map = {
        "cpp": "hpp",
        "C": "H",
        "cc": "hh",
        "cxx": "hxx",
    };

    const headerFileName = path.basename(fileInfo.fileName)
        .replace("." + fileInfo.ext, "." + map[fileInfo.ext as keyof typeof map]);

    editContent = editContent.concat(
        `#include "${headerFileName}"`, fileInfo.eol,
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

export function appendHaskellModule(editContent: string, fileInfo: FileInfo): string {
    return editContent.concat(
        `module ${path.basename(fileInfo.fileName).slice(0, -(fileInfo.ext.length + 1))} () where`, fileInfo.eol,
        fileInfo.eol,
    );
}
