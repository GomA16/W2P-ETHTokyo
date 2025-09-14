// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.8.21;

import {TestCircuitHonkVerifier} from "./TestCircuitVerifier.sol";

contract W2P {
    // zkいらない部分を先に書いとく

    uint256 public pooledETH;

    mapping(address => uint256) public depositInfo;

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

    bytes32[32] loanState;
    uint256 loanStateIndex;
    bytes32[32] loanExpired;
    uint256 loanExpiredIndex;
    bytes32[32] nfStatesList;
    uint256 nfStateIndex;
    uint256 step;

    function incrStep() external {
        step++;
    }

    struct LoanInfo {
        bytes32 id;
        uint256 date;
        bool alive;
    }

    LoanInfo[] LoanList;

    TestCircuitHonkVerifier verifier;

    constructor() {
        verifier = new TestCircuitHonkVerifier();
        loanStateIndex = 0;
        loanExpiredIndex = 0;
        nfStateIndex = 0;
        step = 0;
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

    event Lend(address indexed _address, uint256 _amount);

    function lend(
        uint256 _amount,
        bytes32 nextState,
        bytes32 nextNFState,
        bytes32 nextLoanId
    ) external payable {
        // loanStateとloanExpiredを送る
        // 証明を検証する
        // msg.senderにethcapを送る
        loanState[loanStateIndex++] = nextState;
        nfStatesList[nfStateIndex++] = nextNFState;
        LoanList.push(LoanInfo({id: nextLoanId, date: step, alive: false}));
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Failed to send Ether");
        pooledETH -= _amount;
        step++;
        emit Lend(msg.sender, _amount);
    }

    function repay(bytes32 nextState, bytes32 nextNFState) external payable {
        // loanStateを送る
        // 証明を検証する
        loanState[loanStateIndex++] = nextState;
        nfStatesList[nfStateIndex++] = nextNFState;
        pooledETH += msg.value;
        step++;
    }

    function checkExpire() external {
        for (uint i = 0; i < loanState.length; i++) {
            if (step - LoanList[i].date > 3 && LoanList[i].alive) {
                loanExpired[loanExpiredIndex++] = LoanList[i].id;
                LoanList[i].alive = false;
            }
        }
    }
}
