"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blake2_1 = require("@noble/hashes/blake2");
var sha3_1 = require("@noble/hashes/sha3");
var utils_1 = require("@noble/hashes/utils");
var bb_js_1 = require("@aztec/bb.js");
var noir_js_1 = require("@noir-lang/noir_js");
var testCircuit_json_1 = __importDefault(require("../circuits/testCircuit/target/testCircuit.json"));
var secp = __importStar(require("@noble/secp256k1"));
var ethers_1 = require("ethers");
function numberToUint8Array(num) {
    var buffer = new ArrayBuffer(32);
    var view = new DataView(buffer);
    view.setUint32(0, num, false);
    var uint8Array = new Uint8Array(buffer);
    return uint8Array;
}
function testEthersECDSA() {
    return __awaiter(this, void 0, void 0, function () {
        var secretKey, privateKey, wallet, message, signature, recoveredAddress, sig, rBytes, sBytes, signatureForNoir, publicKey, xBytes, yBytes, hex_sig, noir_message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secretKey = new Uint8Array([
                        207, 107, 198, 151, 157, 173, 219, 249,
                        170, 39, 52, 113, 62, 145, 28, 162,
                        67, 80, 76, 0, 147, 93, 232, 127,
                        233, 67, 235, 14, 191, 6, 184, 48
                    ]);
                    privateKey = "0x" + (0, utils_1.bytesToHex)(secretKey);
                    console.log("private key:", privateKey);
                    wallet = new ethers_1.ethers.Wallet(privateKey);
                    message = "hello ethers";
                    return [4 /*yield*/, wallet.signMessage(message)];
                case 1:
                    signature = _a.sent();
                    console.log("Signature:", signature);
                    recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
                    console.log("Recovered Address:", recoveredAddress);
                    console.log("Is signature valid?", recoveredAddress === wallet.address); // -> true
                    sig = ethers_1.ethers.Signature.from(signature);
                    console.log('Parsed r:', sig.r);
                    console.log('Parsed s:', sig.s);
                    console.log('Parsed v:', sig.v);
                    rBytes = ethers_1.ethers.getBytes(sig.r);
                    sBytes = ethers_1.ethers.getBytes(sig.s);
                    signatureForNoir = new Uint8Array(__spreadArray(__spreadArray([], __read(rBytes), false), __read(sBytes), false));
                    console.log("wallet address", wallet.signingKey.publicKey);
                    publicKey = (0, utils_1.hexToBytes)(wallet.signingKey.publicKey.slice(2));
                    console.log("publicKey", publicKey);
                    xBytes = publicKey.slice(1, 33);
                    console.log("xBytes", xBytes);
                    yBytes = publicKey.slice(33, 65);
                    console.log("yBytes", yBytes);
                    hex_sig = (0, utils_1.hexToBytes)(signature.slice(2));
                    console.log("hex_sig", hex_sig);
                    noir_message = (0, utils_1.hexToBytes)(ethers_1.ethers.hashMessage(message).slice(2));
                    console.log("noir_message", noir_message);
                    console.log("noirjs verify:", (0, noir_js_1.ecdsa_secp256k1_verify)(noir_message, xBytes, yBytes, signatureForNoir));
                    return [2 /*return*/];
            }
        });
    });
}
function genSignature() {
    return __awaiter(this, void 0, void 0, function () {
        var secretKey, publicKey, xBytes, yBytes, st, msg, sig, isValid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secretKey = new Uint8Array([
                        207, 107, 198, 151, 157, 173, 219, 249,
                        170, 39, 52, 113, 62, 145, 28, 162,
                        67, 80, 76, 0, 147, 93, 232, 127,
                        233, 67, 235, 14, 191, 6, 184, 48
                    ]);
                    publicKey = secp.getPublicKey(secretKey, false);
                    console.log("sk:", secretKey);
                    console.log("pk:", publicKey);
                    xBytes = publicKey.slice(1, 33);
                    yBytes = publicKey.slice(33, 65);
                    console.log("x:", Array.from(xBytes).map(function (byte) { return byte.toString(); }));
                    console.log("y:", Array.from(yBytes).map(function (byte) { return byte.toString(); }));
                    st = 'abc';
                    msg = (0, sha3_1.keccak_256)(new TextEncoder().encode(st));
                    console.log("msg: ", Array.from(msg).map(function (byte) { return byte.toString(); }));
                    return [4 /*yield*/, secp.signAsync(msg, secretKey)];
                case 1:
                    sig = _a.sent();
                    console.log("sig: ", Array.from(sig).map(function (byte) { return byte.toString(); }));
                    return [4 /*yield*/, secp.verifyAsync(sig, msg, publicKey)];
                case 2:
                    isValid = _a.sent();
                    console.log("isValid: ", isValid);
                    return [2 /*return*/];
            }
        });
    });
}
function genHash() {
    return __awaiter(this, void 0, void 0, function () {
        var x, y;
        return __generator(this, function (_a) {
            x = numberToUint8Array(123456);
            console.log("x:", x);
            y = (0, blake2_1.blake2s)(x);
            console.log("y", y);
            return [2 /*return*/];
        });
    });
}
function testProof() {
    return __awaiter(this, void 0, void 0, function () {
        var noir, backend, witness, proof;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    noir = new noir_js_1.Noir(testCircuit_json_1.default);
                    backend = new bb_js_1.UltraHonkBackend(testCircuit_json_1.default.bytecode);
                    return [4 /*yield*/, noir.execute({ x: [
                                0, 1, 226, 64, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0, 0, 0, 0, 0,
                                0, 0, 0, 0, 0
                            ],
                            y: [
                                38, 188, 186, 60, 72, 102, 135, 156,
                                46, 114, 41, 157, 252, 41, 153, 112,
                                93, 130, 209, 199, 144, 8, 39, 44,
                                31, 86, 104, 212, 162, 20, 237, 81
                            ] })];
                case 1:
                    witness = (_a.sent()).witness;
                    return [4 /*yield*/, backend.generateProof(witness)];
                case 2:
                    proof = _a.sent();
                    console.log("proof:", proof);
                    console.log("proof.proof: ", proof.proof);
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // await genHash();
                // await testProof();
                // await genSignature();
                return [4 /*yield*/, testEthersECDSA()];
                case 1:
                    // await genHash();
                    // await testProof();
                    // await genSignature();
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
