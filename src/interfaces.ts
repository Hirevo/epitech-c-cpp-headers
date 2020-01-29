import * as vscode from "vscode";

export interface FileInfo {
    fileName: string;
    projName: string;
    description?: string;
    langId: string;
    ext: string;
    eol: string;
    editor: vscode.TextEditor;
    document: vscode.TextDocument;
    uri: vscode.Uri;
}

export interface Config {
    handle: vscode.WorkspaceConfiguration;
    username: string;
    login: string;
    headerType: string;
    usePragmaOnce: boolean;
    autoGenerateClasses: boolean;
    indentedAccessSpecifier: boolean;
}

export interface HeaderGenerator {
    [name: string]: (fileInfo: FileInfo, config: Config, date: Date) => string;
}