import * as vscode from "vscode";

import { EXTENSION_TO_LANGUAGE } from "./constants";

export type SupportedExtensions = keyof typeof EXTENSION_TO_LANGUAGE;
export type SupportedLanguages = typeof EXTENSION_TO_LANGUAGE[SupportedExtensions];
export type CommentSyntaxConstants = { [ext in SupportedLanguages]: string };

export type FileInfo = {
    fileName: string;
    projName: string;
    description?: string;
    langId: SupportedLanguages;
    ext: SupportedExtensions;
    eol: string;
    editor: vscode.TextEditor;
    document: vscode.TextDocument;
    uri: vscode.Uri;
};

export type Config = {
    handle: vscode.WorkspaceConfiguration;
    username: string;
    login: string;
    headerType: "pre2017" | "post2017";
    usePragmaOnce: boolean;
    autoGenerateClasses: boolean;
    indentAccessSpecifiers: boolean;
};

export type HeaderGenerator = {
    [name: string]: (fileInfo: FileInfo, config: Config, date: Date) => string;
};

export function isSupportedExtension(extension: string): extension is SupportedExtensions {
    return extension in EXTENSION_TO_LANGUAGE;
}

export type SyntaxConstants = {
    pre2017: {
        headerMadeBy: string,
        headerLogin: string,
        headerLoginBeg: string,
        headerLoginMid: string,
        headerLoginEnd: string,
        headerStarted: string,
        headerLast: string,
        headerFor: string,
        headerIn: string,
        domaineName: string,
        offsetHeaderFile: number,
        preProcessorStyle: string,
    },
    post2017: {
        offsetHeaderFile: number,
        preProcessorStyle: string,
    },
    commentStart: CommentSyntaxConstants,
    commentMid: CommentSyntaxConstants,
    commentEnd: CommentSyntaxConstants,
};
