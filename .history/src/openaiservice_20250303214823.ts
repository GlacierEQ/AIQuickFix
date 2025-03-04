import * as vscode from "vscode";
import { pipeline } from "transformers";

// Function to interact with the AI service and get a fix for the problem
export async function getGptFix(problem: string, problemCode: string): Promise<string> {
    try {
        const codeFixer = pipeline("text2text-generation", "microsoft/CodeBERT");
        const input = `Fix the following code issue: ${problem}\nCode:\n${problemCode}`;
        const response = await codeFixer(input);
        const solution = response[0].generated_text;

        if (!solution || solution.includes("I can't fix this problem")) {
            vscode.window.showErrorMessage("Sorry, the model says it can't fix this problem automatically.");
            return "";
        }
        return solution;
    } catch (error) {
        vscode.window.showErrorMessage("An error occurred: " + error);
        throw error;
    }
}
