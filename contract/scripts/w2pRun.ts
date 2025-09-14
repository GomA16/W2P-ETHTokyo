import { ethers } from "hardhat";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from "./circuit/target/circuit.json";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import circuitProofData from "./circuitProof.json";
import Alice from "../test-data/alice.json";
import Bob from "../test-data/bob.json";
import { keccak_256 } from "@noble/hashes/sha3";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { getBytes, zeroPadValue } from "ethers";


const alice_S = 141421356;
const bob_S = 17320508;

function numberToUint8Array (num: number) {
    const buffer = new ArrayBuffer(32);
    const view = new DataView(buffer);
    view.setUint32(0, num, false);
    const uint8Array = new Uint8Array(buffer)
    return uint8Array;
}
function stringToUint8Array(input: string): Uint8Array {
  const encodedString = new TextEncoder().encode(input);
  const result = new Uint8Array(32);
  result.set(encodedString.slice(0, 32));
  return result;
}



async function main() {
    const [deployer, lender, almond, aurora, banana] = await ethers.getSigners();
    const w2pFactory = await ethers.getContractFactory("W2P");
    const w2p = await w2pFactory.deploy();
    await w2p.waitForDeployment();
    const scAddr = await w2p.getAddress();

    let tx = await w2p.connect(lender).deposit({ value: ethers.parseEther("10.0") });
    await tx.wait();

    class LendingInfo {
        public s: number;
        public baseId: Uint8Array;
        public repaid: number = 0;
        public unpaid: Uint8Array[][] = [];
        public k: number = 0;
        public address: HardhatEthersSigner;
        public scAddr: string;
        public loanId: Uint8Array = numberToUint8Array(0);
        public state: Uint8Array;
        public ethCap: bigint;

        constructor(name: string, s: number, address: HardhatEthersSigner, scAddr: string, income: number, workyears: number) {
            this.ethCap = BigInt(income) * (BigInt(workyears) + 55n) * 10000000000000000n/ 300000n;
            this.s = s;
            this.baseId = keccak_256(new Uint8Array([...stringToUint8Array(name), ...numberToUint8Array(141421356)]));
            let tmp: Uint8Array = new Uint8Array([...numberToUint8Array(0), ...numberToUint8Array(0)]);
            for (let i = 0; i < 32; i++) {
                this.unpaid.push([numberToUint8Array(0), numberToUint8Array(0)]);
                if (i > 0) tmp = new Uint8Array([...tmp, ...numberToUint8Array(0), ...numberToUint8Array(0)]);
            }
            this.address = address;
            this.scAddr = scAddr;
            this.state = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(this.k)]));
        }

        public async lend(amount: bigint) {
            console.log(this.address.address, "info\n", this);
            // console.
            const kNext = this.k + 1;
            const loanIdNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.k)]));
            const nfState = keccak_256(new Uint8Array([...this.baseId, ...stringToUint8Array(this.scAddr), ...numberToUint8Array(this.k)]));
            for (let i = 0; i < 32; i++) {
                if (
                    bytesToHex(this.unpaid[i][0]) === bytesToHex(numberToUint8Array(0)) &&
                    bytesToHex(this.unpaid[i][1]) === bytesToHex(numberToUint8Array(0))
                ) {
                    this.unpaid[i][0] = loanIdNext;
                    this.unpaid[i][1] = stringToUint8Array("0x"+amount.toString(16));
                }
            }
            let tmp = new Uint8Array([...this.unpaid[0][1], ...this.unpaid[0][1]]);
            for (let i = 1; i < 32; i++) { tmp = new Uint8Array([...tmp, ...this.unpaid[i][0], ...this.unpaid[i][1]]); }
            const stateNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(kNext)]));



            const beforeBalance = await ethers.provider.getBalance(this.address.address);
            console.log("\n\nbefore balance: ", beforeBalance);
            let lendTx = await w2p.connect(this.address).lend(amount
                , "0x" + bytesToHex(stateNext)
                , "0x" + bytesToHex(nfState)
                , "0x" + bytesToHex(loanIdNext)
            );
            const receipt = await lendTx.wait();

            this.ethCap -= amount;
            this.k = kNext;
            this.state = stateNext;
            this.loanId = loanIdNext;
            // レシートがnullでないことを確認 (TypeScriptの型安全のため)
            if (!receipt) {
                console.error("Transaction failed, no receipt");
                return;
            }

            // 3. レシートからガス情報を取得
            const gasUsed = receipt.gasUsed;
            const gasPrice = receipt.gasPrice; // or effectiveGasPrice for more precision

            console.log(`Gas Used: ${gasUsed.toString()}`);
            console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);
            // 4. 合計ガス代を計算
            const gasCostInWei = gasUsed * gasPrice;
            console.log("gasCostInWei: ", gasCostInWei);
            const afterBalance = await ethers.provider.getBalance(aurora.address);
            console.log("after balance: ", afterBalance);
            const borrowedWei = (afterBalance + gasCostInWei) - beforeBalance;

            console.log("borowedWei", borrowedWei);
            console.log(this.address.address, "info\n", this);
        }
        
        public async repay(amount: bigint) {
            const kNext = this.k + 1;
            const loanIdNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.k)]));
            const nfState = keccak_256(new Uint8Array([...this.baseId, ...stringToUint8Array(this.scAddr), ...numberToUint8Array(this.k)]));
            for (let i = 0; i < 32; i++) {
                if (
                    bytesToHex(this.unpaid[i][0]) === bytesToHex(numberToUint8Array(0)) &&
                    bytesToHex(this.unpaid[i][1]) === bytesToHex(numberToUint8Array(0))
                ) {
                    this.unpaid[i][0] = loanIdNext;
                    this.unpaid[i][1] = stringToUint8Array("0x"+amount.toString(16));
                }
            }
            let tmp = new Uint8Array([...this.unpaid[0][1], ...this.unpaid[0][1]]);
            for (let i = 1; i < 32; i++) { tmp = new Uint8Array([...tmp, ...this.unpaid[i][0], ...this.unpaid[i][1]]); }
            const stateNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(kNext)]));

            const beforeBalance = await ethers.provider.getBalance(this.address.address);
            console.log("\n\nbefore balance: ", beforeBalance);
            let repayTx = await w2p.connect(this.address).repay(stateNext, nfState, { value: amount });
            
            const receipt = await repayTx.wait();
            this.ethCap += amount;
            this.k = kNext;
            this.state = stateNext;
            this.loanId = loanIdNext;

            // レシートがnullでないことを確認 (TypeScriptの型安全のため)
            if (!receipt) {
                console.error("Transaction failed, no receipt");
                return;
            }

            // 3. レシートからガス情報を取得
            const gasUsed = receipt.gasUsed;
            const gasPrice = receipt.gasPrice; // or effectiveGasPrice for more precision

            console.log(`Gas Used: ${gasUsed.toString()}`);
            console.log(`Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);
            // 4. 合計ガス代を計算
            const gasCostInWei = gasUsed * gasPrice;
            console.log("gasCostInWei: ", gasCostInWei);
            const afterBalance = await ethers.provider.getBalance(aurora.address);
            console.log("after balance: ", afterBalance);
            const repaidWei = beforeBalance - (afterBalance + gasCostInWei);

            console.log("repaidWei", repaidWei);
            console.log(this.address.address, "info\n", this);
        }
    }
    const auroraInfo = new LendingInfo(Alice.message.name, 141421356, aurora, scAddr, Alice.message.income, Alice.message.years_of_service);
    const almondInfo = new LendingInfo(Alice.message.name, 141421356, almond, scAddr, Alice.message.income, Alice.message.years_of_service);
    const bananaInfo = new LendingInfo(Bob.message.name, 17320508, banana, scAddr, Bob.message.income, Bob.message.years_of_service)


     await auroraInfo.lend(BigInt(100000000000000000n));
    await auroraInfo.repay(BigInt(100000000000000000n));
    
    
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });