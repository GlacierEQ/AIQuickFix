import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { activate, OpenAIFixActionProvider } from "../../extension";
import { getGptFix as realGetGptFix } from "../../openaiservice";
import { OpenAI } from "openai";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  let extensionContext: vscode.ExtensionContext;
  suiteSetup(async () => {
    await vscode.extensions
      .getExtension("haselerdev.aiquickfix")
      ?.activate();
    extensionContext = (global as any).testExtensionContext;
  });

  test("Test Extension Activation", async () => {
    const extension = vscode.extensions.getExtension(
      "haselerdev.aiquickfix"
    );

    assert.ok(extension, "Extension should be present");
    assert.strictEqual(extension.isActive, true, "Extension should be active");
  });

  test("Test OpenAIFixActionProvider class instance", () => {
    const provider = new OpenAIFixActionProvider();

    assert.ok(provider, "Instance should be created");
    assert.ok(
      provider instanceof OpenAIFixActionProvider,
      "Instance should be of type OpenAIFixActionProvider"
    );
  });

  test("Test Updating and Retrieving Model Setting", async () => {
    const initialValue = getSetting("model");
    await updateSetting("model","test model");
    const updatedValue = getSetting("model");
  
    assert.strictEqual(
      updatedValue,
      "test model",
      "Model setting should be updated"
    );
  
    await updateSetting("model",initialValue as string);
  });

test("Test Retrieving and Updating API Key Setting", async () => {
  const initialValue = getSetting("apiKey");
  await updateSetting("apiKey","test apiKey");
  const updatedValue = getSetting("apiKey");

  assert.strictEqual(
    updatedValue,
    "test apiKey",
    "apiKey setting should be updated"
  );

  await updateSetting("apiKey",initialValue as string);
});

// Helper function to stub the createChatCompletion method with a specified response
function stubCreateChatCompletionWithResponse(response: any): SinonStub {
  return sinon.stub(OpenAI.prototype, "createChatCompletion").resolves(response);
}

// Refactored Test GPT AI Problem Fixer command execution
test("Test GPT AI Problem Fixer command execution", async () => {

  const createChatCompletionStub = stubCreateChatCompletionWithResponse(mockedResponse);

  // Set a dummy API key so the check for a blank key doesn't fail
  await updateSetting("apiKey", "test-dummy-api-key");

  // Create a document with code and diagnostic (mock)
  const editor = await createTextDocumentWithContent("function test() { console.log('Hello'); }");

  // Mock range and diagnostics
  const range = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(1, 0)
  );

  // Execute the GPT AI Problem Fixer command
  await executeGptAiProblemFixerCommand(editor, range);

  // Ensure the text after execution contains the returned fix
  assert.strictEqual(
    editor.document.getText(),
    "function fixedTest() {}",
    "The document should be updated with the returned fix"
  );

  // Restore the original getGptFix function
  createChatCompletionStub.restore();
});


 test("Test Error Handling for the GPT AI Problem Fixer command execution", async () => {
   // Stub the createChatCompletion() method to reject with an error
   const createChatCompletionStub = sinon.stub(
     OpenAI.prototype,
     "createChatCompletion"
   ).rejects(new Error("Some API error occurred"));
 
   // Set a dummy API key so the check for a blank key doesn't fail
   await vscode.workspace.getConfiguration("haselerdev.aiquickfix").update(
     "apiKey",
     "test-dummy-api-key",
     vscode.ConfigurationTarget.Global
   );
 
   // Create a document with code and diagnostic (mock)
   const doc = await vscode.workspace.openTextDocument({
     content: "function test() { console.log('Hello'); }",  // Create a document with code and diagnostic (mock)
     language: "javascript",{
   });",
   const editor = await vscode.window.showTextDocument(doc);
 
   // Mock range and diagnosticsst editor = await vscode.window.showTextDocument(doc);
   const range = new vscode.Range(
     new vscode.Position(0, 0),  // Mock range and diagnostics
     new vscode.Position(1, 0)e(
   );
   const diagnostics: vscode.Diagnostic[] = [
     new vscode.Diagnostic(range, "Sample Error"),
   ];nst diagnostics: vscode.Diagnostic[] = [
 or"),
   try {
     // Execute the GPT AI Problem Fixer command
     await vscode.commands.executeCommand(  try {
       "gptAIProblemFixerCommand",Execute the GPT AI Problem Fixer command
       doc,
       range
     );
   } catch (error) {e
    const err = error as Error; // Add this line to assert the error type
     assert.strictEqual(tch (error) {
       err.message,r as Error; // Add this line to assert the error type
       "Some API error occurred",
       "The command should throw an error from the API call"
     );ror occurred",
   }an error from the API call"
 
   // Restore the original createChatCompletion function
   createChatCompletionStub.restore();
 });  // Restore the original createChatCompletion function

test("Test Handling of Empty or Invalid API Key", async () => {
  await updateSetting("apiKey", "");
test("Test Handling of Empty or Invalid API Key", async () => {
  const editor = await createTextDocumentWithContent("function test() { console.log('Hello'); }");

  const range = new vscode.Range(  const editor = await createTextDocumentWithContent("function test() { console.log('Hello'); }");
    new vscode.Position(0, 0),
    new vscode.Position(1, 0)  const range = new vscode.Range(
  );

  try {
    // Execute the GPT AI Problem Fixer command
    await executeGptAiProblemFixerCommand(editor, range);  try {
  } catch (error) {Execute the GPT AI Problem Fixer command
    const err = error as Error;r, range);
    assert.strictEqual(
      err.message,or as Error;
      "API key is not set. Please set it in the extension settings.",
      "The command should throw an error when the API key is empty"
    );not set. Please set it in the extension settings.",
  }
});

 
 test("Test Absence of Appropriate Fix from GPT AI", async () => {
   const createChatCompletionStub = sinon.stub( 
     OpenAI.prototype,test("Test Absence of Appropriate Fix from GPT AI", async () => {
     "createChatCompletion"
   );
 tion"
   // Mock the createChatCompletion() method with no useful choices
   createChatCompletionStub.resolves({
     data: {  // Mock the createChatCompletion() method with no useful choices
       id: "test",
       object: "test",
       created: Date.now(),test",
       model: "gpt-3.5-turbo",st",
       choices: [],ow(),
     },o",
     status: 200,
     headers: {},
     statusText: "test",atus: 200,
     config: {},
   });"test",
 
   await updateSetting("apiKey", "test");
 
   const editor = await createTextDocumentWithContent("function test() { console.log('Hello'); }");  await updateSetting("apiKey", "test");

   const range = new vscode.Range(  const editor = await createTextDocumentWithContent("function test() { console.log('Hello'); }");
     new vscode.Position(0, 0),
     new vscode.Position(1, 0)   const range = new vscode.Range(
   );
 
   try {
    await executeGptAiProblemFixerCommand(editor, range);
   } catch (error) {  try {
     const err = error as Error;t executeGptAiProblemFixerCommand(editor, range);
     assert.strictEqual(
       err.message,or as Error;
       "GPT AI was unable to provide a suitable fix.",
       "The command should throw an error when no appropriate fix is found"
     );unable to provide a suitable fix.",
   }opriate fix is found"
 
   createChatCompletionStub.restore();
 });
  createChatCompletionStub.restore();
 // Grouped Helper Functions
 async function updateSetting(key: string, value: string) {
   await vscode.workspace.getConfiguration("haselerdev.aiquickfix").update(async function updateSetting(key: string, value: string) {
     key,ickfix").update(
     value,
     vscode.ConfigurationTarget.Globale,
   );.ConfigurationTarget.Global
 }


// Helper function to get the model setting value
function getSetting(key: string) {// Helper function to get the model setting value
  return vscode.workspace
    .getConfiguration("haselerdev.aiquickfix")
    .get(key);selerdev.aiquickfix")
}

 
 async function createTextDocumentWithContent(content: string): Promise<vscode.TextEditor> { 
   const doc = await vscode.workspace.openTextDocument({async function createTextDocumentWithContent(content: string): Promise<vscode.TextEditor> {
     content: content,
     language: "javascript",
   });ript",
   return await vscode.window.showTextDocument(doc);
 }urn await vscode.window.showTextDocument(doc);
 
 async function executeGptAiProblemFixerCommand(editor: vscode.TextEditor, range: vscode.Range): Promise<void> {
   return await vscode.commands.executeCommand(async function executeGptAiProblemFixerCommand(editor: vscode.TextEditor, range: vscode.Range): Promise<void> {
     "gptAIProblemFixerCommand",
     editor.document,
     range
   );
 }

 const mockedResponse = {
  data: { const mockedResponse = {
    id: "test",
    object: "test",test",
    created: Date.now(),st",
    model: "gpt-3.5-turbo",ow(),
    choices: [o",
      {
        message: {
          role: "assistant", message: {
          content: "function fixedTest() {}",ssistant",
        }, fixedTest() {}",
      },
    ],
  },
  status: 200,
  headers: {},atus: 200,
  statusText: "test",
  config: {},"test",
};
 
});
);
