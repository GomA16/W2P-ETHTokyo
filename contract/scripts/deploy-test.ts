import { ethers } from "hardhat";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from "./circuit/target/circuit.json";
import { BytesLike } from "ethers";
import { bytesToHex } from "@noble/hashes/utils";
import circuitProofData from "./circuitProof.json";

async function main() {
    try {
        const [deployer, alice, bob, cindy] = await ethers.getSigners();

        const deployTestFactory = await ethers.getContractFactory("DeployTest");
        const deployTestContract = await deployTestFactory.deploy();
        const deployTest = await deployTestContract.waitForDeployment();
                
        const noir = new Noir(circuit as any);
        const backend = new UltraHonkBackend(circuit.bytecode, {threads: 1});
        const { witness } = await noir.execute({ x: "2", y: "1" })
        const proof = await backend.generateProof(witness,{ keccak: true });

        console.log("proof.proof", proof.proof);
        // console.log("poof.publicInput", proof.publicInputs);
        const isValid = await backend.verifyProof(proof);
        console.log("isValid:", isValid);

        const proofBytes = "0x" + bytesToHex(proof.proof);
        const proofInputs = proof.publicInputs;
        const proofBytesFromJson = circuitProofData.proofHex;
        const proofInputsFromJson = circuitProofData.proofInputs;

        console.log("proofBytes",  proofBytes.length);
        console.log("proofInputs", proofInputs);
        console.log("proofBytesFromJson",  proofBytesFromJson.length);
        console.log("proofInputsFromJson", proofInputsFromJson);

        if (proofBytes === proofBytesFromJson) {
            console.log("same proof string");
        } else {
            console.log("differnet proof");
        }

        let flag = true
        for (let i = 0; i < proofInputs.length; i++) {
            if (proofInputs[i] === proofInputsFromJson[i]) {
                flag = true;
            } else {
                flag = false;
                break;
            }
        }
        if (flag) {
            console.log("same proof input");
        } else {
            console.log("different input")
        }

        let tx = await deployTest.connect(alice).authedIncr(proofBytesFromJson, proofInputsFromJson);
        await tx.wait()
        let counter = await deployTest.showCounter();
        console.log("\n\n***\n\ncounter:", counter);


        tx = await deployTest.connect(alice).authedIncr(proofBytes, proofInputs);
        await tx.wait()
        counter = await deployTest.showCounter();
        console.log("\n\n***\n\ncounter:", counter);

        // console.log("counter:",deployTest.counter);

        // let tx = await deployTest.connect(alice).incr();
        // await tx.wait();
        // const counter = await deployTest.showCounter();
        // console.log("\n\n***\n\ncounter:", counter);

        // tx = await deployTest.connect(bob).decr();
        // await tx.wait();
        // console.log("counter:", deployTest.counter);

        // tx = await deployTest.connect(cindy).incr();
        // await tx.wait();
        // console.log("counter:", deployTest.counter);
    } catch (e) {
        console.log("error:\n", e);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });