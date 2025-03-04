import * as vscode from "vscode";
import { getGptFix } from "./openaiservice";
import { BackgroundFixer } from "./backgroundFixer";

export function activate(context: vscode.ExtensionContext) {
    const backgroundFixer = new BackgroundFixer();
    context.subscriptions.push(backgroundFixer);
    
    // Register commands
    let disposable = vscode.commands.registerCommand('extension.scanAndRepair', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const code = document.getText();
            const issues = backgroundFixer.scanForIssues(code);
            if (issues.length > 0) {
                await backgroundFixer.repairIssues(issues, code);
            } else {
                vscode.window.showInformationMessage('No issues found to repair.');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    // Clean up resources if needed
}
