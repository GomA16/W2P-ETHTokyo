import { blake2s } from "@noble/hashes/blake2.js";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import  testCircuit from "../circuits/testCircuit/target/testCircuit.json" with {type: "json"};

function numberToUint8Array (num) {
    const buffer = new ArrayBuffer(32);
    const view = new DataView(buffer);
    view.setUint32(0, num, false);
    const uint8Array = new Uint8Array(buffer)
    return uint8Array;
}

async function genHash () {
    const x = numberToUint8Array(123456);
    console.log("x:",x);
    const y = blake2s(x);
    console.log("y",y)
}

async function testProof () {
    const noir = new Noir(testCircuit);
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
    await testProof();
}

main()