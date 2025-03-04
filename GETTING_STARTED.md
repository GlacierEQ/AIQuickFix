# Getting Started with AIQuickFix

## Setup Your Open Source AI Model

1. **Install an Open Source AI Model Server**

   AIQuickFix works with various open source model servers. We recommend:
   
   - [Ollama](https://ollama.ai/) - Easy-to-use interface for running open source models locally
   - [LocalAI](https://github.com/go-skynet/LocalAI) - Self-hosted API compatible with OpenAI

2. **Install Code-focused Models**

   For best results, use a code-specialized model:
   
   ```bash
   # If using Ollama:
   ollama pull codeellama:7b   # CodeLlama 7B parameter model
   ollama pull wizardcoder     # WizardCoder model
   ollama pull starcoder       # StarCoder model
   ```

3. **Configure AIQuickFix**

   - Open VS Code settings
   - Search for "AIQuickFix"
   - Set the `modelEndpoint` to your model server's API endpoint (default: http://localhost:11434/api/generate for Ollama)
   - Set the `modelName` to your preferred model

## Development Workflow

1. **Setup the environment**
   ```bash
   npm install
   npm run prepare
   ```

2. **Start development mode**
   ```bash
   npm run dev
   ```
   This will watch for file changes and automatically compile TypeScript.

3. **Test the extension**
   ```bash
   npm test
   ```

4. **Package the extension**
   ```bash
   npm run package
   ```

## Key Scripts

- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint to check code quality
- `npm run version:patch` - Bump the version (patch) and push changes
- `npm run publish-extension` - Publish to VS Code Marketplace

## Releasing

1. Create a new version:
   ```bash
   npm run version:patch  # or minor/major
   ```

2. The GitHub Actions workflow will automatically:
   - Run tests
   - Build the extension
   - Create a GitHub release
   - Publish to VS Code Marketplace (if configured)

Happy coding! 🚀
