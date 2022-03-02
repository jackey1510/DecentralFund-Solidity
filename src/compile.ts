// compile code will go here
import {
  ensureDirSync,
  outputJSONSync,
  readFileSync,
  removeSync,
} from "fs-extra";
import { resolve } from "path";
import solc from "solc";

const buildPath = resolve(__dirname, "../../build");

removeSync(buildPath);

const filename = "Campaign.sol";
const contractPath = resolve(__dirname, "../../contracts", filename);
const source = readFileSync(contractPath, "utf-8");

const input = JSON.stringify({
  language: "Solidity",
  sources: {
    [filename]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
});

const compiled = JSON.parse(solc.compile(input)).contracts[filename];

ensureDirSync(buildPath);

for (let contract in compiled) {
  outputJSONSync(resolve(buildPath, contract + ".json"), compiled[contract]);
}
