import { blake2s } from "@noble/hashes/blake2";

function numberToUint8Array (num: number) {
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

async function main () {
    await genHash();
}

main()