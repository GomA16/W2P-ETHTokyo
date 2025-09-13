import { ethers } from "hardhat";
import { hexToBytes } from "@noble/hashes/utils";
import { BytesLike } from "ethers";
import  proofData  from "./proof.json";

async function main (){
    const honkFactory = await ethers.getContractFactory("HonkVerifier");
    const honkVerifier = await honkFactory.deploy();
    await honkVerifier.waitForDeployment()

    const proofBytes: BytesLike = proofData.proofHex;
    const proofInputs: BytesLike[] = proofData.proofInput ;
    const tx = await honkVerifier.verify(proofBytes
        ,proofInputs
    );
    console.log("proof is", tx ? "valid": "invalid");
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });