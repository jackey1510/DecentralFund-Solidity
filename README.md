# DecentralFund-solidity

A smart contract for decentralized crowdfunding

The smart contract allow user to create a decentralized crowdfunding campaign.

The manager can create "Request" to transfer money from the campaign.

The contributors can vote to approve/decline the Request, which can help prevent rigged/poorly managed campaign.

## Contracts

Campaign Contract: the contract enables users to interact with the campaign.
Campaign Factory Contract: the contract which allows user to create a new campaign and deploy the Campaign Contract.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MNEMONIC` Your wallet mnemonic, required for deploying contract

`WEB3_PROVIDER_URL` URL of Web 3 provider e.g. Infura

## Run Locally

Install dependencies

```bash
  yarn
```

Compile the ts files to js

```bash
  yarn build
```

Compile Solidity

```bash
  yarn build
```

Test Solidity

```bash
  yarn test
```

Deploy Contract

```bash
  yarn deploy
```
