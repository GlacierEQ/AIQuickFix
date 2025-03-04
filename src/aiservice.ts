import * as vscode from 'vscode';
import axios from 'axios';

export async function getAiFix(
  diagnosticMessage: string,
  codeContext: string
): Promise<string> {
  try {
    const config = vscode.workspace.getConfiguration('haselerdev.aiquickfix');
    const modelEndpoint = config.get<string>('modelEndpoint');
    const modelName = config.get<string>('modelName');
    const systemPrompt = config.get<string>('systemPrompt');
    const problemPrefix = config.get<string>('problemPrefix');
    const problemCodePrefix = config.get<string>('problemCodePrefix');
    const promptSuffix = config.get<string>('promptSuffix');
    const maxTokens = config.get<number>('maxTokens');
    const temperature = config.get<number>('temperature');

    if (!modelEndpoint) {
      throw new Error(
        'Model endpoint is not set. Please set it in the extension settings.'
      );
    }

    // Use different formats depending on which model provider is used
    // This example uses Ollama API format
    const prompt = `${systemPrompt}\n\n${problemPrefix}${diagnosticMessage}\n\n${problemCodePrefix}${codeContext}${promptSuffix}`;
    
    const response = await axios.post(modelEndpoint, {
      model: modelName,
      prompt: prompt,
      stream: false,
      max_tokens: maxTokens,
      temperature: temperature
    });

    if (response.status !== 200) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Different model providers have different response formats
    // Adjust this based on your model provider's response structure
    const fixedCode = response.data.response;

    if (!fixedCode || fixedCode === 'I can\'t fix this problem') {
      throw new Error('AI model was unable to provide a suitable fix.');
    }

    return fixedCode;
  } catch (error) {
    console.error('Error getting AI fix:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while getting AI fix');
  }
}
