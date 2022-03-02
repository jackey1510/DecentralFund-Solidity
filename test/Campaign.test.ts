import {
  CampaignFactoryContract,
  CampaignContract,
  Request,
} from "../src/types/CampaignContract";
import assert from "assert";
import ganache from "ganache";
import Web3 from "web3";
import compiledFactory from "../build/CampaignFactory.json";
import compiledCampaign from "../build/Campaign.json";

const web3 = new Web3(ganache.provider({ quiet: true }) as any);

let accounts: string[];
let factory: CampaignFactoryContract;
let campaignAddress: string;
let campaign: CampaignContract;
let contributor: string;
let receiver: string;
let creator: string;

const minimumContribution = 100;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi as any)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 10000000 });

  await factory.methods
    .createCampaign(minimumContribution)
    .send({ from: accounts[0], gas: 10000000 });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = new web3.eth.Contract(
    compiledCampaign.abi as any,
    campaignAddress
  );
  contributor = accounts[2];
  receiver = accounts[1];
  creator = accounts[0];
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute and make as approvers", async () => {
    await contribute(200);
    const [isContributor, approversCount] = await Promise.all([
      campaign.methods.approvers(contributor).call(),
      campaign.methods.approversCount().call(),
    ]);
    assert.equal(true, isContributor);
    assert.equal(1, approversCount);
  });

  it("requires a minimum contribution", async () => {
    await assert.rejects(contribute(10));
  });

  it("allows the manager to make a payment request", async () => {
    await createRequest(1000);
    const expected: Request = {
      description: "buy",
      valueInWei: "1000",
      recipient: receiver,
      complete: false,
      approvalCount: "0",
    };
    const {
      description,
      valueInWei,
      recipient,
      complete,
      approvalCount,
    } = await campaign.methods.requests(0).call();
    assert.deepEqual(
      { description, valueInWei, recipient, complete, approvalCount },
      expected
    );
  });

  it("process requests", async () => {
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    const ether = web3.utils.toWei("2");
    await contribute(ether);
    await createRequest(ether);
    await campaign.methods
      .approveRequest(0)
      .send({ from: contributor, gas: 10000000 });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: creator, gas: 10000000 });

    const balance = await web3.eth.getBalance(accounts[1]);
    assert.ok(Number(balance) > Number(initialBalance));
  });
  async function createRequest(value: number | string) {
    await campaign.methods
      .createRequest("buy", value, receiver)
      .send({ from: creator, gas: 10000000 });
  }

  async function contribute(value: number | string) {
    await campaign.methods.contribute().send({ value, from: contributor });
  }
});
