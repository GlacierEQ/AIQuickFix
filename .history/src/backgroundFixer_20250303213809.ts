import * as vscode from 'vscode';
import { getGptFix } from './openaiservice';

export class BackgroundFixer {
    private fileWatcher: vscode.FileSystemWatcher;
    private processingQueue: Array<string> = [];

    constructor() {
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.ts');
        this.fileWatcher.onDidChange(this.handleFileChange.bind(this));
    }

    private async handleFileChange(uri: vscode.Uri) {
        const document = await vscode.workspace.openTextDocument(uri);
        const code = document.getText();
        const issues = this.scanForIssues(code);
        if (issues.length > 0) {
            await this.repairIssues(issues, code);
        }
    }

    private scanForIssues(code: string): Array<string> {
        // Implement logic to scan the code for issues
        // Return an array of issues found
        return []; // Placeholder for actual issue detection logic
    }

    private async repairIssues(issues: Array<string>, code: string) {
        for (const issue of issues) {
            const fix = await getGptFix(issue, code);
            // Implement logic to apply the fix to the code
        }
    }
}

export class BackgroundFixer {
    private fileWatcher: vscode.FileSystemWatcher;
    private processingQueue: Array<{document: vscode.TextDocument, diagnostic: vscode.Diagnostic}> = [];
    private isProcessing = false;
    private rateLimit = 1000; // 1 second between fixes
    private lastFixTime = 0;

    constructor() {
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
        this.initializeWatchers();
    }

    private initializeWatchers() {
        // Watch for document changes
        vscode.workspace.onDidChangeTextDocument(event => {
            this.handleDocumentChange(event.document);
        });

        // Watch for file saves
        this.fileWatcher.onDidChange(uri => {
            vscode.workspace.openTextDocument(uri).then(document => {
                this.handleDocumentChange(document);
            });
        });
    }

    private async handleDocumentChange(document: vscode.TextDocument) {
        const config = vscode.workspace.getConfiguration('haselerdev.aiquickfix');
        if (!config.get('backgroundFix.enabled', false)) return;

        const diagnostics = await vscode.languages.getDiagnostics(document.uri);
        const relevantDiagnostics = diagnostics.filter(d => 
            d.severity === vscode.DiagnosticSeverity.Error || 
            d.severity === vscode.DiagnosticSeverity.Warning
        );

        for (const diagnostic of relevantDiagnostics) {
            this.processingQueue.push({document, diagnostic});
        }

        this.processQueue();
    }

    private async processQueue() {
        if (this.isProcessing || this.processingQueue.length === 0) return;

        this.isProcessing = true;
        const currentTime = Date.now();
        const timeSinceLastFix = currentTime - this.lastFixTime;

        if (timeSinceLastFix < this.rateLimit) {
            await new Promise(resolve => setTimeout(resolve, this.rateLimit - timeSinceLastFix));
        }

        const {document, diagnostic} = this.processingQueue.shift()!;
        this.lastFixTime = Date.now();

        try {
            const problem = diagnostic.message;
            const problemCode = document.getText(diagnostic.range);
            const fix = await getGptFix(problem, problemCode); // Updated to use only two arguments

            if (fix) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document === document) {
                    await editor.edit(editBuilder => {
                        editBuilder.replace(diagnostic.range, fix);
                    });
                }
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Background fix failed: ${error}`);
        } finally {
            this.isProcessing = false;
            this.processQueue();
        }
    }

    public dispose() {
        this.fileWatcher.dispose();
    }
}
