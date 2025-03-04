import * as vscode from "vscode";
import { getGptFix } from "./openaiservice";
import { BackgroundFixer } from "./backgroundFixer";

export class OpenAIFixActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

    async provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext): Promise<vscode.CodeAction[]> {
        const diagnostics = context.diagnostics;
        if (!diagnostics || diagnostics.length === 0) { return []; }

        const config = vscode.workspace.getConfiguration("haselerdev.aiquickfix");
        const apiKey = config.get<string>("apiKey");

        if (!apiKey) {
            vscode.window.showErrorMessage("Please set your API key in settings", { modal: false }, { title: "Open Settings" })
                .then((selection: { title: string } | undefined) => {
                    if (selection?.title === "Open Settings") {
                        vscode.commands.executeCommand("haselerdev.aiquickfix.openSettings");
                    }
                });
            return [];
        }
        const actions: vscode.CodeAction[] = [];
        diagnostics.forEach(diagnostic => {
            const action = new vscode.CodeAction(`AI QuickFix: "${diagnostic.message}"`, vscode.CodeActionKind.QuickFix);
            action.command = {
                title: "Request Fix using Open Source AI",
                command: "gptAIProblemFixerCommand",
                arguments: [document, diagnostic.range],
            };
            actions.push(action);
        });
        return actions;
    }
}

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
