// deploy code will go here
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import { abi, evm } from "../build/CampaignFactory.json";

import { config } from "dotenv";

config();

const { MNEMONIC, WEB3_PROVIDER_URL } = process.env;

if (!MNEMONIC || !WEB3_PROVIDER_URL)
  throw Error("Please add mnemonic and provider URL to .env");

const provider = new HDWalletProvider({
  mnemonic: MNEMONIC,
  url: WEB3_PROVIDER_URL,
});
const web3 = new Web3(provider);

async function deploy() {
  const accounts = await web3.eth.getAccounts();
  console.log(`Attempting to deploy from account ${accounts[0]}`);

  const contract = await new web3.eth.Contract(abi as any)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ gas: 5000000, from: accounts[0] });

  console.log(`Contract deployed to ${contract.options.address}`);
  provider.engine.stop();
}

deploy();
