import * as vscode from "vscode";
import { pipeline } from "transformers";

// Cleaned formatting and removed extra whitespace
export async function getGptFix(problem: string, problemCode: string): Promise<string> {
  try {
    const codeFixer = pipeline("text2text-generation", "microsoft/CodeBERT");
    const input = `Fix the following code issue: ${problem}\nCode:\n${problemCode}`;
    const response = await codeFixer(input);
    const solution = response[0].generated_text;

    // Prepare the input for the model
    const input = `Fix the following code issue: ${problem}\nCode:\n${problemCode}`;

    // Generate the fix using the model
    const response = await codeFixer(input);
    const solution = response[0].generated_text;

    if (!solution || solution.includes("I can't fix this problem")) {
      vscode.window.showErrorMessage(
        "Sorry, the model says it can't fix this problem automatically."
      );
      return "";
    }

    return solution;
  } catch (error) {
    vscode.window.showErrorMessage("An error occurred: " + error);
    throw error;
  }
}
