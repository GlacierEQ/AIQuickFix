# Code Models for AIQuickFix

AIQuickFix is designed to work with various code-specialized open source AI models. Here's information about the supported models and their strengths.

## Default Model

By default, AIQuickFix is configured to use **CodeLlama 7B** through the Ollama API. This model offers a good balance between quality and performance on consumer hardware.

## Recommended Models

### CodeLlama Family

[CodeLlama](https://github.com/facebookresearch/codellama) is a collection of large language models built on top of Llama 2 and fine-tuned for programming tasks.

- **CodeLlama 7B**: Good for most code fixing tasks, runs on consumer hardware with 16GB+ RAM
- **CodeLlama 13B**: Better quality suggestions, requires more powerful hardware
- **CodeLlama 34B**: Highest quality in the family, requires high-end hardware

```bash
# Install via Ollama
ollama pull codellama:7b
ollama pull codellama:13b
ollama pull codellama:34b
```

### WizardCoder

[WizardCoder](https://github.com/nlpxucan/WizardLM) is fine-tuned from Starcoder using evol-instruct to specifically handle coding tasks.

- **WizardCoder 15B**: Excellent at understanding complex code structures and fixing bugs

```bash
# Install via Ollama
ollama pull wizardcoder
```

### StarCoder

[StarCoder](https://github.com/bigcode-project/starcoder) was trained on a large corpus of permissively licensed code from GitHub.

- **StarCoder 15B**: Good at completing code and fixing issues across many languages

```bash
# Install via Ollama
ollama pull starcoder
```

### Other Options

- **SantaCoder**: Smaller model trained on Python, Java, and JavaScript
- **DeepseekCoder**: Advanced code models available in various sizes

## Model Selection Guide

| Model | Size | Speed | Quality | Hardware Requirements |
|-------|------|-------|---------|----------------------|
| CodeLlama 7B | 7B | Fast | Good | 16GB RAM |
| WizardCoder | 15B | Medium | Very Good | 24GB RAM |
| StarCoder | 15B | Medium | Very Good | 24GB RAM |
| CodeLlama 13B | 13B | Medium | Better | 32GB RAM |
| CodeLlama 34B | 34B | Slow | Best | 64GB+ RAM |

## Configuration

To change the model used by AIQuickFix:

1. Open VS Code settings
2. Search for "AIQuickFix.modelName"
3. Enter the name of your preferred model (e.g., "codellama:7b", "wizardcoder", "starcoder")

Note: Make sure you've pulled the model using your model server (e.g., Ollama) before configuring AIQuickFix to use it.
