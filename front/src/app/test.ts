import { blake2s } from "@noble/hashes/blake2";
import { keccak_256 } from "@noble/hashes/sha3";
import { hexToBytes , bytesToHex} from "@noble/hashes/utils";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir, ecdsa_secp256k1_verify } from '@noir-lang/noir_js';
import  testCircuit from "../circuits/testCircuit/target/testCircuit.json";
import * as secp from '@noble/secp256k1';
import { ethers } from 'ethers';


function numberToUint8Array (num: number) {
    const buffer = new ArrayBuffer(32);
    const view = new DataView(buffer);
    view.setUint32(0, num, false);
    const uint8Array = new Uint8Array(buffer)
    return uint8Array;
}

async function testEthersECDSA() {
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


async function main () {
    // await genHash();
    // await testProof();
    // await genSignature();
    await testEthersECDSA();
}

main()