export interface Evm {
  assembly: string;
  bytecode: ByteCode;
  deployedBytecode: any;
  gasEstimates: any;
  legacyAssembly: any;
  methodIdentifiers: any;
}

export interface ByteCode {
  functionDebugData: any;
  generatedSources: any[];
  linkReferences: any;
  object: string;
  opcodes: string;
  sourceMap: string;
}
