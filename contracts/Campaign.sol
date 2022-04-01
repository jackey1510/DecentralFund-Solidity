// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

contract CampaignFactory {
    address[] public deployedCampaign;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaign.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaign;
    }

}

contract Campaign {
    struct Request{
        string description;
        uint valueInWei;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvedContributors;
    }

    address public manager ;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint public approversCount;

    constructor(uint minimum, address creator){
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable fullfilContributeAmount {
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string calldata description, 
        uint valueInWei, 
        address recipient
    ) public managerOnly {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.valueInWei = valueInWei;
        newRequest.recipient = recipient;
        newRequest.approvalCount = 0;
        newRequest.complete = false;

    }

    function approveRequest(uint index) public isApprover isNotVoted(requests[index]) {
        Request storage request = requests[index];
        request.approvedContributors[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public payable managerOnly {
        Request storage request = requests[index];

        require(!request.complete && request.approvalCount >= approversCount / 2);

        payable(request.recipient).transfer(request.valueInWei);

        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }


    modifier fullfilContributeAmount() {
        require(msg.value >= minimumContribution);
        _;
    }

    modifier managerOnly() {
        require(msg.sender == address(manager));
        _;
    }

    modifier isApprover() {
        require(approvers[msg.sender]);
        _;
    }

    modifier isNotVoted(Request storage request){
        require(!request.approvedContributors[msg.sender]);
        _;
    }

}
