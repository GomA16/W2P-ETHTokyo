// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.8.21;

import {TestCircuitHonkVerifier} from "./TestCircuitVerifier.sol";

contract W2P {
    // zkいらない部分を先に書いとく

    uint256 public pooledETH;

    mapping(address => uint256) public depositInfo;

    struct LoanInfo {
        uint id;
        address borroweAddress;
        uint256 borrowedETH;
        uint256 repayLimit;
    }
    mapping(address => LoanInfo[]) LoanList;

    event Deposit(address indexed from, uint256 value);

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        pooledETH += msg.value;
        depositInfo[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    event Withdraw(address indexed from, uint256 value);

    function withdraw(uint256 _amount) external payable {
        require(_amount > 0, "Withdraw amount must be greater than zero");
        require(
            _amount <= depositInfo[msg.sender],
            "Trying to withdraw more than you deposited"
        );

        pooledETH -= _amount;
        depositInfo[msg.sender] -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Failed to send Ether");
        emit Withdraw(msg.sender, _amount);
    }

    // ここから先がzk必要な部分

    TestCircuitHonkVerifier verifier;

    constructor() {
        verifier = new TestCircuitHonkVerifier();
    }

    event ZKProofPassed(address indexed userAddress, bool isValid);

    function check(
        bytes calldata _proofHex,
        bytes32[] calldata _proofInput
    ) external returns (bool) {
        bool isValid = verifier.verify(_proofHex, _proofInput);
        emit ZKProofPassed(msg.sender, isValid);
        return isValid;
    }

    function lend() external payable {}

    function repay() external payable {}
}
