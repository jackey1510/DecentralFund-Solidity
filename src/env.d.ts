interface Window {
  ethereum: any;
  web3: any;
}

declare module "solc" {
  function compile(input: string): string;
}
