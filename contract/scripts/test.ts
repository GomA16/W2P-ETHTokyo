import { blake2s } from "@noble/hashes/blake2";
import { keccak_256 } from "@noble/hashes/sha3";
import { hexToBytes , bytesToHex } from "@noble/hashes/utils";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir, ecdsa_secp256k1_verify } from '@noir-lang/noir_js';
import  testCircuit from "./circuits/testCircuit/target/testCircuit.json";
import * as secp from '@noble/secp256k1';
import { ethers, zeroPadBytes, zeroPadValue } from 'ethers';
import Alice from "../test-data/alice.json";
import Bob from "../test-data/bob.json";


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

function bigintToHex(num: bigint): string {
  // 1. bigintを16進数文字列に変換 ( "0x" は含まない)
  let hex = num.toString(16);

  // 2. 文字列の長さが奇数の場合、先頭に"0"を付けて偶数にする
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }

  // 3. ethers.zeroPadValue は '0x' プレフィックスを必要とする
  const fullHex = '0x' + hex;

  // 4. 指定されたバイト長になるように、さらに先頭をゼロパディングする
  return ethers.zeroPadValue(fullHex, 32);
}
async function testEthersECDSA() {
       const secretKey = new Uint8Array([
        207, 107, 198, 151, 157, 173, 219, 249,
        170, 39, 52, 113, 62, 145, 28, 162,
        67, 80, 76, 0, 147, 93, 232, 127,
        233, 67, 235, 14, 191, 6, 184, 48
    ]);
    const privateKey = "0x"+bytesToHex(secretKey);
    // console.log("private key:", privateKey);
    const wallet = new ethers.Wallet(privateKey);

    const message = JSON.stringify( {
    "name": "Alice",
    "my_number" : "551551",
    "income" : "50000",
    "years_of_service" : "8",
    "c_s" : "0xa3b06691be5a1fbda2d6fccad608d4963a9ec070cdfbb13721c1f4e437b0aa39"
    }
);
    const signature = await wallet.signMessage(message);
    console.log("Signature:", signature);

  // 署名を検証
//     const recoveredAddress = ethers.verifyMessage(message, signature);
//     console.log("Recovered Address:", recoveredAddress);
//     console.log("Is signature valid?", recoveredAddress === wallet.address); // -> true



//     const sig = ethers.Signature.from(signature);
  
//   console.log('Parsed r:', sig.r);
//   console.log('Parsed s:', sig.s);
//   console.log('Parsed v:', sig.v);

//   // 3. Noir回路など、64バイトの署名を期待する関数に渡す準備
//   // r (32バイト) と s (32バイト) を連結する
//   const rBytes = ethers.getBytes(sig.r);
//   const sBytes = ethers.getBytes(sig.s);
//     const signatureForNoir = new Uint8Array([...rBytes, ...sBytes]);
    // console.log("signatureFOrNoir", signatureForNoir);
    
    console.log("\nverifying key\n", wallet.signingKey.publicKey);
    // const publicKey = hexToBytes(wallet.signingKey.publicKey.slice(2));
    // // console.log("publicKey", publicKey);
    // const xBytes = publicKey.slice(1, 33); // 1バイト目から32バイト分
    // console.log("xBytes", xBytes);
    // const yBytes = publicKey.slice(33, 65);
    // console.log("yBytes", yBytes);
    // const hex_sig = hexToBytes(signature.slice(2))
    // console.log("hex_sig", hex_sig)
    // const noir_message = hexToBytes(ethers.hashMessage(message).slice(2));
    // console.log("noir_message", noir_message);
    // console.log("noirjs verify:", ecdsa_secp256k1_verify(noir_message, xBytes, yBytes, signatureForNoir));

}

async function genEthersECDSA() {
       const secretKey = new Uint8Array([
        207, 107, 198, 151, 157, 173, 219, 249,
        170, 39, 52, 113, 62, 145, 28, 162,
        67, 80, 76, 0, 147, 93, 232, 127,
        233, 67, 235, 14, 191, 6, 184, 48
    ]);
    const privateKey = "0x"+bytesToHex(secretKey);
    console.log("private key:", privateKey);
    const wallet = new ethers.Wallet(privateKey);

    const message = "hello ethers";
    const signature = await wallet.signMessage(message);
    console.log("Signature:", signature);

  // 署名を検証
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log("Recovered Address:", recoveredAddress);
    console.log("Is signature valid?", recoveredAddress === wallet.address); // -> true



    const sig = ethers.Signature.from(signature);
  
  console.log('Parsed r:', sig.r);
  console.log('Parsed s:', sig.s);
  console.log('Parsed v:', sig.v);

  // 3. Noir回路など、64バイトの署名を期待する関数に渡す準備
  // r (32バイト) と s (32バイト) を連結する
  const rBytes = ethers.getBytes(sig.r);
  const sBytes = ethers.getBytes(sig.s);
    const signatureForNoir = new Uint8Array([...rBytes, ...sBytes]);
    console.log("signatureFOrNoir", signatureForNoir);
    
    console.log("verifying key", wallet.signingKey.publicKey);
    const publicKey = hexToBytes(wallet.signingKey.publicKey.slice(2));
    console.log("publicKey", publicKey);
    const xBytes = publicKey.slice(1, 33); // 1バイト目から32バイト分
    console.log("xBytes", xBytes);
    const yBytes = publicKey.slice(33, 65);
    console.log("yBytes", yBytes);
    const hex_sig = hexToBytes(signature.slice(2))
    console.log("hex_sig", hex_sig)
    const noir_message = hexToBytes(ethers.hashMessage(message).slice(2));
    console.log("noir_message", noir_message);
    console.log("noirjs verify:", ecdsa_secp256k1_verify(noir_message, xBytes, yBytes, signatureForNoir));
}

async function genSignature() {
    // const secretKey = secp.utils.randomSecretKey();
    // const publicKey = secp.getPublicKey(secretKey,false);
    const secretKey = new Uint8Array([
        207, 107, 198, 151, 157, 173, 219, 249,
        170, 39, 52, 113, 62, 145, 28, 162,
        67, 80, 76, 0, 147, 93, 232, 127,
        233, 67, 235, 14, 191, 6, 184, 48
    ]);
    const publicKey = secp.getPublicKey(secretKey,false);

    console.log("sk:", secretKey);
    console.log("pk:", publicKey);
    // const point = secp.Point.fromHex(publicKey)
    // const uncompressedPublicKeyBytes = point.toRawBytes(false);
    const xBytes = publicKey.slice(1, 33); // 1バイト目から32バイト分
    const yBytes = publicKey.slice(33, 65);
    console.log("x:", Array.from(xBytes).map(byte => byte.toString()));
    console.log("y:", Array.from(yBytes).map(byte => byte.toString()));
    const st = 'abc'
    const msg = keccak_256(new TextEncoder().encode(st))
    console.log("msg: ", Array.from(msg).map(byte => byte.toString()));
    const sig = await secp.signAsync(msg, secretKey);
    console.log("sig: ", Array.from(sig).map(byte => byte.toString()));
    const isValid = await secp.verifyAsync(sig, msg, publicKey);
    console.log("isValid: ", isValid);
}

async function genHash () {
    const x = numberToUint8Array(123456);
    console.log("x:",x);
    const y = blake2s(x);
    console.log("y",y)
}

async function genKeccak () {
    const x = numberToUint8Array(123456);
    console.log("x:",x);
    const y = keccak_256(x);
    console.log("y","0x"+bytesToHex(y))
}

async function testProof () {
    const noir = new Noir(testCircuit as any);
    const backend = new UltraHonkBackend(testCircuit.bytecode);
    const {witness} = await noir.execute({x : [
  0, 1, 226, 64, 0, 0, 0, 0, 0,
  0, 0,   0,  0, 0, 0, 0, 0, 0,
  0, 0,   0,  0, 0, 0, 0, 0, 0,
  0, 0,   0,  0, 0
],
y: [
  38, 188, 186,  60,  72, 102, 135, 156,
  46, 114,  41, 157, 252,  41, 153, 112,
  93, 130, 209, 199, 144,   8,  39,  44,
  31,  86, 104, 212, 162,  20, 237,  81
]});
    const proof = await backend.generateProof(witness);
    console.log("proof:", proof);
    console.log("proof.proof: ", proof.proof)

}

import * as fs from 'fs';
import * as path from 'path';

async function genPi1PrivateInput() { 
    const name = stringToUint8Array(Alice.message.name);
    const s = numberToUint8Array(123456);
    const baseId = keccak_256(new Uint8Array([...name, ...s]));
    const repaid_k = numberToUint8Array(5);
    const unpaid_k = [];
    for (let i = 0; i < 32; i++) {
        unpaid_k.push([numberToUint8Array(0), numberToUint8Array(0)]);
    }
    const k = numberToUint8Array(1);
    let prv = new Uint8Array([...baseId, ...repaid_k]);
    for (let i = 0; i < 32; i++) {
        prv = new Uint8Array([...prv, ...unpaid_k[i][0]]);
        prv = new Uint8Array([...prv, ...unpaid_k[i][1]]);
    }
    prv = new Uint8Array([...prv, ...k]);
    console.log("private input:\n", prv);
    const state_1 = keccak_256(prv);
    console.log("state_k", state_1);
    const loan_state = [];
    loan_state.push(state_1);
    for (let i = 0; i < 32; i++) {
        loan_state.push(numberToUint8Array(0));
    }
    console.log("loans_state\n", loan_state);
    
    // 3. 保存先のファイルパスを定義
    const filePath = path.join(__dirname, 'output.json');

    try {
    // 4. ファイルに同期的に書き込む
    fs.writeFileSync(filePath, loan_state.toString(), 'utf-8');
    console.log('File written successfully to:', filePath);
    } catch (error) {
    console.error('Error writing file:', error);
    }
}

async function test() {
    const num = 1000;
    const bi = BigInt(1000);
    const numU8 = numberToUint8Array(num);
    const biU8 = stringToUint8Array(bi.toString(16));
    console.log("nu", bi.toString(16))
}

import borrowCircuit from "../circuits/borrow/target/borrow.json";
import { bigint } from "hardhat/internal/core/params/argumentTypes";

async function testBorrowCircuit() {
    //  // --- For borrowCircuit1 ---
    // loan_state:pub [[u8;32];32],
    // baseid: [u8;32],
    // repaid_k: [u8;32],
    // unpaid_k: [UnpaiedEntry;32],
    // k: [u8;32],
    // // --- For borrowCircuit2 ---
    // loan_expired:pub [[u8;32]; 32],
    // eth_amt:pub u64,
    // work_years: u64,
    // income: u64,
    // // --- For borrowCircuit3 ---
    // state_k_next:pub [u8;32],
    // loanid_k_next:pub [u8;32],
    // eth_amt_bytes32:pub [u8;32],
    // // --- For borrowCircuit4 ---
    // SCAddr:pub [u8;32],
    // NF_state_k1:pub [u8;32],    
    const noir = new Noir(borrowCircuit as any);
    const backend = new UltraHonkBackend(borrowCircuit.bytecode);

    let loanState: Uint8Array[] = [];
    for (let i = 0; i < 32; i++) { loanState.push(numberToUint8Array(0)) }
    let loanExpired: Uint8Array[] = [];
    for (let i = 0; i < 32; i++) { loanExpired.push(numberToUint8Array(0)) }

    class LendingInfo {
        public s: number;
        public baseId: Uint8Array;
        public repaid: number = 0;
        public unpaid: Uint8Array[][] = [];
        public income: number;
        public workYears: number;
        public k: number = 0;
        // public address: HardhatEthersSigner;
        public scAddr: string;
        public loanId: Uint8Array = numberToUint8Array(0);
        public state: Uint8Array;
        public ethCap: bigint;

        constructor(name: string, s: number, scAddr: string, income: number, workyears: number) {
            this.income = income;
            this.workYears = workyears;
            this.ethCap = BigInt(income) * (BigInt(workyears) + BigInt(55)) * BigInt(10000000000000000)/ BigInt(300000);
            this.s = s;
            this.baseId = keccak_256(new Uint8Array([...stringToUint8Array(name), ...numberToUint8Array(141421356)]));
            let tmp: Uint8Array = new Uint8Array([...numberToUint8Array(0), ...numberToUint8Array(0)]);
            for (let i = 0; i < 32; i++) {
                this.unpaid.push([numberToUint8Array(0), numberToUint8Array(0)]);
                if (i > 0) tmp = new Uint8Array([...tmp, ...numberToUint8Array(0), ...numberToUint8Array(0)]);
            }
            // this.address = address;
            this.scAddr = zeroPadValue(scAddr,32);
            this.state = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(this.k)]));
        }

        public async lend(amount: bigint) {
            console.log(amount.toString(16));
            console.log(hexToBytes(bigintToHex(amount).slice(2)))
            
            // console.log(this.address.address, "info\n", this);
            // console.
            const kNext = this.k + 1;
            const loanIdNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.k)]));
            const nfState = keccak_256(new Uint8Array([...this.baseId, ...hexToBytes(zeroPadValue(this.scAddr, 32).slice(2)), ...numberToUint8Array(this.k)]));
            for (let i = 0; i < 32; i++) {
                if (
                    bytesToHex(this.unpaid[i][0]) === bytesToHex(numberToUint8Array(0)) &&
                    bytesToHex(this.unpaid[i][1]) === bytesToHex(numberToUint8Array(0))
                ) {
                    this.unpaid[i][0] = loanIdNext;
                    this.unpaid[i][1] = hexToBytes(bigintToHex(amount).slice(2));
                }
            }
            let tmp = new Uint8Array([...this.unpaid[0][1], ...this.unpaid[0][1]]);
            for (let i = 1; i < 32; i++) { tmp = new Uint8Array([...tmp, ...this.unpaid[i][0], ...this.unpaid[i][1]]); }
            const stateNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(kNext)]));


            // const beforeBalance = await ethers.provider.getBala/nce(this.address.address);
    //  // --- For borrowCircuit1 ---
    // loan_state:pub [[u8;32];32],
    // baseid: [u8;32],
    // repaid_k: [u8;32],
    // unpaid_k: [UnpaiedEntry;32],
    // k: [u8;32],
    // // --- For borrowCircuit2 ---
    // loan_expired:pub [[u8;32]; 32],
    // eth_amt:pub u64,
    // work_years: u64,
    // income: u64,
    // // --- For borrowCircuit3 ---
    // state_k_next:pub [u8;32],
    // loanid_k_next:pub [u8;32],
    // eth_amt_bytes32:pub [u8;32],
    // // --- For borrowCircuit4 ---
            // SCAddr:pub [u8;32],
            // NF_state_k1:pub [u8;32],
            console.log(hexToBytes(zeroPadValue(this.scAddr, 32).slice(2)))
            console.log("going To proving process")
            const { witness } = await noir.execute({
                NF_state_k1: Array.from(nfState),
                SCAddr: Array.from(hexToBytes(zeroPadValue(this.scAddr, 32).slice(2))),
                baseid: Array.from(this.baseId),
                eth_amt: amount.toString(),
                eth_amt_bytes32: Array.from(hexToBytes(bigintToHex(amount).slice(2))),
                income: this.income,
                k: Array.from(numberToUint8Array(this.k)),
                loan_expired: loanExpired.map(u8 => Array.from(u8)),
                loan_state: loanState.map(u8 => Array.from(u8)),
                loanid_k_next: Array.from(numberToUint8Array(kNext)),
                repaid_k: Array.from(numberToUint8Array(this.repaid)),
                state_k_next: Array.from(stateNext),
                unpaid_k: this.unpaid.map(tuple => tuple.map(u8 => Array.from(u8))),
                work_years: this.workYears,
            });
            console.log("circuit executed");
            const proof = await backend.generateProof(witness, { keccak: true });
            console.log("proof generated")
            const isValid = await backend.verifyProof(proof);
            console.log("proof is ", isValid);

            
            for (let i = 0; i < 32; i++){
                if (bytesToHex(loanState[i]) === bytesToHex(numberToUint8Array(0))) {
                    loanState[i] = stateNext;
                    break;
                }
            }
            this.ethCap -= amount;
            this.k = kNext;
            this.state = stateNext;
            this.loanId = loanIdNext;
        }
        
        public async repay(amount: bigint) {
            const kNext = this.k + 1;
            const loanIdNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.k)]));
            const nfState = keccak_256(new Uint8Array([...this.baseId, ...hexToBytes(this.scAddr), ...numberToUint8Array(this.k)]));
            for (let i = 0; i < 32; i++) {
                if (
                    bytesToHex(this.unpaid[i][0]) === bytesToHex(numberToUint8Array(0)) &&
                    bytesToHex(this.unpaid[i][1]) === bytesToHex(numberToUint8Array(0))
                ) {
                    this.unpaid[i][0] = loanIdNext;
                    this.unpaid[i][1] = hexToBytes(bigintToHex(amount));
                }
            }
            let tmp = new Uint8Array([...this.unpaid[0][1], ...this.unpaid[0][1]]);
            for (let i = 1; i < 32; i++) { tmp = new Uint8Array([...tmp, ...this.unpaid[i][0], ...this.unpaid[i][1]]); }
            const stateNext = keccak_256(new Uint8Array([...this.baseId, ...numberToUint8Array(this.repaid), ...tmp, ...numberToUint8Array(kNext)]));

            this.ethCap += amount;
            this.k = kNext;
            this.state = stateNext;
            this.loanId = loanIdNext;

            // レシートがnullでないことを確認 (TypeScriptの型安全のため)
            
        }
    }
    const scAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const auroraInfo = new LendingInfo(Alice.message.name, 141421356, scAddr, Alice.message.income, Alice.message.years_of_service);
    const almondInfo = new LendingInfo(Alice.message.name, 141421356,  scAddr, Alice.message.income, Alice.message.years_of_service);
    const bananaInfo = new LendingInfo(Bob.message.name, 17320508, scAddr, Bob.message.income, Bob.message.years_of_service)

    await auroraInfo.lend(BigInt(15));
}


async function main () {
    // await genHash();
    // await testProof();
    // await genSignature();
    // await testEthersECDSA();
    // await genKeccak();
    // await genPi1PrivateInput();
    // test();
    await testBorrowCircuit();
}


main()