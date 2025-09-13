import { ethers } from "hardhat";
import { hexToBytes } from "@noble/hashes/utils";
import { BytesLike } from "ethers";
import  proofData  from "./proof.json";

async function main (){
    const proofBytes: BytesLike = proofData.proofHex;
    const proofInputs: BytesLike[] = proofData.proofInput;
    
    const w2pFactory = await ethers.getContractFactory("W2P");
    const w2p = await w2pFactory.deploy();
    await w2p.waitForDeployment();
    const tx = await w2p.check(proofBytes, proofInputs);
    console.log("proof is", tx ? "valid": "invalid");
    // const honkFactory = await ethers.getContractFactory("TestCircuitHonkVerifier");
    // const honkVerifier = await honkFactory.deploy();
    // await honkVerifier.waitForDeployment()

    // const tx = await honkVerifier.verify(proofBytes
    //     ,proofInputs
    // );
    // console.log("proof is", tx ? "valid": "invalid");
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });