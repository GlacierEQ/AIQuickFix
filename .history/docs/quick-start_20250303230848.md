# AIQuickFix Quick Start Guide

Get up and running with AIQuickFix in 5 minutes.

## Prerequisites

- VS Code
- 16GB+ RAM (for running code models)
- 5GB+ free disk space (for model storage)

## Step 1: Install Ollama

Ollama is the easiest way to run open-source AI models locally.

- **Windows**: Download from [Ollama.ai](https://ollama.ai)
- **macOS**: Download from [Ollama.ai](https://ollama.ai) or `brew install ollama`
- **Linux**: Follow the instructions at [Ollama.ai](https://ollama.ai)

## Step 2: Pull a Code Model

Open your terminal and run:

```bash
# Pull the CodeLlama 7B model (good balance of speed and performance)
ollama pull codellama:7b
```

Or choose another model from our [Models Guide](./models.md).

## Step 3: Start the Model Server

```bash
# Start Ollama server
ollama serve
```

This will start the server at http://localhost:11434, which is the default endpoint in AIQuickFix settings.

## Step 4: Install AIQuickFix Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "AIQuickFix"
4. Click "Install"

## Step 5: Verify Settings

1. Open VS Code settings (Ctrl+,)
2. Search for "AIQuickFix"
3. Verify these settings:
   - Model Endpoint: `http://localhost:11434/api/generate`
   - Model Name: `codellama:7b`

## Step 6: Start Using It!

1. Open a file with code errors (or create one with an error)
2. When you see a red squiggly line, hover over it
3. Click on the "lightbulb" icon that appears
4. Select the AI-suggested fix

## Troubleshooting

- **Model not responding**: Make sure Ollama is running (`ollama serve`)
- **Slow responses**: Try a smaller model or increase your GPU allocation
- **Extension not detecting issues**: Make sure your linter/analyzer is enabled

Enjoy using AIQuickFix with fully local, open-source AI models!
