import * as path from "path";
import * as vscode from "vscode";
import * as escapeRegExpString from "escape-string-regexp";

import { loadConfig } from "../config";
import { isSupportedExtension } from "../types";
import { DAYS, EXTENSION_TO_LANGUAGE, LINE_TERMINATORS, MONTHS, SYNTAX } from "../constants";

export async function handleUpdateHeader(ev: vscode.TextDocumentWillSaveEvent): Promise<vscode.TextEdit[] | undefined> {
    const config = loadConfig();

    if (config.headerType !== "pre2017") {
        return;
    }

    const extension = path.basename(ev.document.fileName).split(".").reverse()[0];
    if (!isSupportedExtension(extension)) {
        return;
    }

    const langId = EXTENSION_TO_LANGUAGE[extension];

    const date = new Date();
    const file = ev.document.getText();

    const regex = new RegExp(`(${escapeRegExpString(SYNTAX.commentMid[langId])} ${escapeRegExpString(SYNTAX.pre2017.headerLast)})(.*)(${LINE_TERMINATORS[ev.document.eol]})`);
    const match = regex.exec(file);
    if (match === null || match.length == 0) {
        return;
    }

    const editContent = SYNTAX.commentMid[langId]
        .concat(" ", SYNTAX.pre2017.headerLast, DAYS[date.getDay()], " ", MONTHS[date.getMonth()], " ", date.getDate().toString(), " ", date.toLocaleTimeString(), " ", date.getFullYear().toString(), " ", config.username, LINE_TERMINATORS[ev.document.eol]);
    const TextEdit = new vscode.TextEdit(
        new vscode.Range(
            ev.document.positionAt(match.index),
            ev.document.positionAt(match.index + match[0].length)
        ),
        editContent,
    );
    return [TextEdit];
}
