import { CallOptions, Contract, SendOptions } from "web3-eth-contract";
import { TransactionReceipt } from "web3-core";

interface SendMethod {
  send(options?: SendOptions): Promise<TransactionReceipt>;
}

interface CallMethod<T = any> {
  call(options?: CallOptions): Promise<T>;
}

export class Request {
  description: string;
  valueInWei: string;
  recipient: string;
  complete: boolean;
  approvalCount: string;
}

export class CampaignSummary {
  // minimumContribution: number;
  0: number;
  // balance: number;
  1: string;
  // requestCount: number;
  2: number;
  // approversCount: number;
  3: number;
  // manager: string;
  4: string;
}

export class CampaignContract extends Contract {
  methods: {
    manager(): CallMethod<string>;
    contribute(): SendMethod;
    createRequest(
      description: string,
      wei: number | string,
      recipient: string
    ): SendMethod;
    approveRequest(index: number): SendMethod;
    finalizeRequest(index: number): SendMethod;
    minimumContribution(): CallMethod<number>;
    approversCount(): CallMethod<number>;
    requests(index: number): CallMethod<Request>;
    approvers(address: string): CallMethod<boolean>;
    getSummary(): CallMethod<CampaignSummary>;
    getRequestCount(): CallMethod<number>;
  };
}

export class CampaignFactoryContract extends Contract {
  methods: {
    createCampaign(minimum: number): SendMethod;
    getDeployedCampaigns(): CallMethod<string[]>;
  };
}
