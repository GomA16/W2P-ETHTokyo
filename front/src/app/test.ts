import { blake2s } from "@noble/hashes/blake2";
import { keccak_256 } from "@noble/hashes/sha3";
import { hexToBytes , bytesToHex} from "@noble/hashes/utils";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir, ecdsa_secp256k1_verify } from '@noir-lang/noir_js';
import  testCircuit from "../circuits/testCircuit/target/testCircuit.json";
import * as secp from '@noble/secp256k1';
import { ethers } from 'ethers';


function numberToUint8Array (num: number): Uint8Array {
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
    
    console.log("\nwallet address\n", wallet.signingKey.publicKey);
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
    
    console.log("wallet address", wallet.signingKey.publicKey);
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
    const { witness } = await noir.execute({
        x: Array.from(numberToUint8Array(1)),
        y: [
            Array.from(numberToUint8Array(1)),
            Array.from(numberToUint8Array(2)),
            Array.from(numberToUint8Array(3))
        ]
    });
    const proof = await backend.generateProof(witness);
    console.log("proof:", proof);
    console.log("proof.proof: ", proof.proof)
    const isValid = await backend.verifyProof(proof);
    console.log("proof is", isValid);

}

import Alice from "./test-data/Alice.json";
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

async function main () {
    // await genHash();
    await testProof();
    // await genSignature();
    // await testEthersECDSA();
    // await testEthersECDSA();
    // await genKeccak();
    // await genPi1PrivateInput();
}


main()