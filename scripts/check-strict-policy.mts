import ts from 'typescript';

const host={...ts.sys,onUnRecoverableConfigFileDiagnostic:(diagnostic:ts.Diagnostic)=>{
 throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText,'\n'));
}};
const required=[
 'strict','noUncheckedIndexedAccess','exactOptionalPropertyTypes','noPropertyAccessFromIndexSignature',
 'useUnknownInCatchVariables','noUnusedLocals','noUnusedParameters','noImplicitReturns',
 'noImplicitOverride','noEmit','verbatimModuleSyntax',
] as const;
for(const config of ['tsconfig.json','tsconfig.tools.json','tsconfig.browser.json']){
 const parsed=ts.getParsedCommandLineOfConfigFile(config,{},host);
 if(!parsed||parsed.errors.length)throw new Error('Could not parse '+config);
 if(required.some(flag=>parsed.options[flag]!==true)||parsed.options.skipLibCheck!==false){
  throw new Error('Required strict settings missing in '+config);
 }
 for(const file of parsed.fileNames){
  const text=ts.sys.readFile(file);
  if(!text)continue;
  if(/@ts-(?:ignore|expect-error|nocheck)\b/.test(text))throw new Error('Suppressed type error in '+file);
  const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
  function check(node:ts.Node){
   if(node.kind===ts.SyntaxKind.AnyKeyword)throw new Error('Explicit any in '+file);
   ts.forEachChild(node,check);
  }
  check(source);
 }
}
