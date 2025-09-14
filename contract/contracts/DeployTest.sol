// SPDX-License-Identifier: Apache-2.0

pragma solidity >=0.8.21;

import {HonkVerifier} from "./Verifier.sol";

contract DeployTest {
    uint256 public counter;
    HonkVerifier verifier = new HonkVerifier();

    constructor() {
        counter = 0;
    }

    function showCounter() external view returns (uint256) {
        return counter;
    }

    event Incremented(address indexed _address);

    function incr() external {
        counter += 1;
        emit Incremented(msg.sender);
    }

    function authedIncr(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external {
        require(verifier.verify(_proof, _publicInputs), "not allowed");
        counter += 1;
    }

    event Decremented(address indexed _address);

    function decr() external {
        require(counter > 0, "counter must be positive");
        counter -= 1;
        emit Decremented(msg.sender);
    }
}
