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
var testCircuit_json_1 = __importDefault(require("./circuits/testCircuit/target/testCircuit.json"));
var secp = __importStar(require("@noble/secp256k1"));
var ethers_1 = require("ethers");
var alice_json_1 = __importDefault(require("../test-data/alice.json"));
var bob_json_1 = __importDefault(require("../test-data/bob.json"));
function numberToUint8Array(num) {
    var buffer = new ArrayBuffer(32);
    var view = new DataView(buffer);
    view.setUint32(0, num, false);
    var uint8Array = new Uint8Array(buffer);
    return uint8Array;
}
function stringToUint8Array(input) {
    var encodedString = new TextEncoder().encode(input);
    var result = new Uint8Array(32);
    result.set(encodedString.slice(0, 32));
    return result;
}
function bigintToHex(num) {
    // 1. bigintを16進数文字列に変換 ( "0x" は含まない)
    var hex = num.toString(16);
    // 2. 文字列の長さが奇数の場合、先頭に"0"を付けて偶数にする
    if (hex.length % 2 !== 0) {
        hex = '0' + hex;
    }
    // 3. ethers.zeroPadValue は '0x' プレフィックスを必要とする
    var fullHex = '0x' + hex;
    // 4. 指定されたバイト長になるように、さらに先頭をゼロパディングする
    return ethers_1.ethers.zeroPadValue(fullHex, 32);
}
function testEthersECDSA() {
    return __awaiter(this, void 0, void 0, function () {
        var secretKey, privateKey, wallet, message, signature;
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
                    wallet = new ethers_1.ethers.Wallet(privateKey);
                    message = JSON.stringify({
                        "name": "Alice",
                        "my_number": "551551",
                        "income": "50000",
                        "years_of_service": "8",
                        "c_s": "0xa3b06691be5a1fbda2d6fccad608d4963a9ec070cdfbb13721c1f4e437b0aa39"
                    });
                    return [4 /*yield*/, wallet.signMessage(message)];
                case 1:
                    signature = _a.sent();
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
                    return [2 /*return*/];
            }
        });
    });
}
function genEthersECDSA() {
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
                    console.log("signatureFOrNoir", signatureForNoir);
                    console.log("verifying key", wallet.signingKey.publicKey);
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
function genKeccak() {
    return __awaiter(this, void 0, void 0, function () {
        var x, y;
        return __generator(this, function (_a) {
            x = numberToUint8Array(123456);
            console.log("x:", x);
            y = (0, sha3_1.keccak_256)(x);
            console.log("y", "0x" + (0, utils_1.bytesToHex)(y));
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
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function genPi1PrivateInput() {
    return __awaiter(this, void 0, void 0, function () {
        var name, s, baseId, repaid_k, unpaid_k, i, k, prv, i, state_1, loan_state, i, filePath;
        return __generator(this, function (_a) {
            name = stringToUint8Array(alice_json_1.default.message.name);
            s = numberToUint8Array(123456);
            baseId = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray([], __read(name), false), __read(s), false)));
            repaid_k = numberToUint8Array(5);
            unpaid_k = [];
            for (i = 0; i < 32; i++) {
                unpaid_k.push([numberToUint8Array(0), numberToUint8Array(0)]);
            }
            k = numberToUint8Array(1);
            prv = new Uint8Array(__spreadArray(__spreadArray([], __read(baseId), false), __read(repaid_k), false));
            for (i = 0; i < 32; i++) {
                prv = new Uint8Array(__spreadArray(__spreadArray([], __read(prv), false), __read(unpaid_k[i][0]), false));
                prv = new Uint8Array(__spreadArray(__spreadArray([], __read(prv), false), __read(unpaid_k[i][1]), false));
            }
            prv = new Uint8Array(__spreadArray(__spreadArray([], __read(prv), false), __read(k), false));
            console.log("private input:\n", prv);
            state_1 = (0, sha3_1.keccak_256)(prv);
            console.log("state_k", state_1);
            loan_state = [];
            loan_state.push(state_1);
            for (i = 0; i < 32; i++) {
                loan_state.push(numberToUint8Array(0));
            }
            console.log("loans_state\n", loan_state);
            filePath = path.join(__dirname, 'output.json');
            try {
                // 4. ファイルに同期的に書き込む
                fs.writeFileSync(filePath, loan_state.toString(), 'utf-8');
                console.log('File written successfully to:', filePath);
            }
            catch (error) {
                console.error('Error writing file:', error);
            }
            return [2 /*return*/];
        });
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var num, bi, numU8, biU8;
        return __generator(this, function (_a) {
            num = 1000;
            bi = BigInt(1000);
            numU8 = numberToUint8Array(num);
            biU8 = stringToUint8Array(bi.toString(16));
            console.log("nu", bi.toString(16));
            return [2 /*return*/];
        });
    });
}
var borrow_json_1 = __importDefault(require("../circuits/borrow/target/borrow.json"));
function testBorrowCircuit() {
    return __awaiter(this, void 0, void 0, function () {
        var noir, backend, loanState, i, loanExpired, i, LendingInfo, scAddr, auroraInfo, almondInfo, bananaInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    noir = new noir_js_1.Noir(borrow_json_1.default);
                    backend = new bb_js_1.UltraHonkBackend(borrow_json_1.default.bytecode);
                    loanState = [];
                    for (i = 0; i < 32; i++) {
                        loanState.push(numberToUint8Array(0));
                    }
                    loanExpired = [];
                    for (i = 0; i < 32; i++) {
                        loanExpired.push(numberToUint8Array(0));
                    }
                    LendingInfo = /** @class */ (function () {
                        function LendingInfo(name, s, scAddr, income, workyears) {
                            this.repaid = 0;
                            this.unpaid = [];
                            this.k = 0;
                            this.loanId = numberToUint8Array(0);
                            this.income = income;
                            this.workYears = workyears;
                            this.ethCap = BigInt(income) * (BigInt(workyears) + BigInt(55)) * BigInt(10000000000000000) / BigInt(300000);
                            this.s = s;
                            this.baseId = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray([], __read(stringToUint8Array(name)), false), __read(numberToUint8Array(141421356)), false)));
                            var tmp = new Uint8Array(__spreadArray(__spreadArray([], __read(numberToUint8Array(0)), false), __read(numberToUint8Array(0)), false));
                            for (var i = 0; i < 32; i++) {
                                this.unpaid.push([numberToUint8Array(0), numberToUint8Array(0)]);
                                if (i > 0)
                                    tmp = new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(tmp), false), __read(numberToUint8Array(0)), false), __read(numberToUint8Array(0)), false));
                            }
                            // this.address = address;
                            this.scAddr = (0, ethers_1.zeroPadValue)(scAddr, 32);
                            this.state = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseId), false), __read(numberToUint8Array(this.repaid)), false), __read(tmp), false), __read(numberToUint8Array(this.k)), false)));
                        }
                        LendingInfo.prototype.lend = function (amount) {
                            return __awaiter(this, void 0, void 0, function () {
                                var kNext, loanIdNext, nfState, i, tmp, i, stateNext, witness, proof, isValid, i;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log(amount.toString(16));
                                            console.log((0, utils_1.hexToBytes)(bigintToHex(amount).slice(2)));
                                            kNext = this.k + 1;
                                            loanIdNext = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray([], __read(this.baseId), false), __read(numberToUint8Array(this.k)), false)));
                                            nfState = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseId), false), __read((0, utils_1.hexToBytes)((0, ethers_1.zeroPadValue)(this.scAddr, 32).slice(2))), false), __read(numberToUint8Array(this.k)), false)));
                                            for (i = 0; i < 32; i++) {
                                                if ((0, utils_1.bytesToHex)(this.unpaid[i][0]) === (0, utils_1.bytesToHex)(numberToUint8Array(0)) &&
                                                    (0, utils_1.bytesToHex)(this.unpaid[i][1]) === (0, utils_1.bytesToHex)(numberToUint8Array(0))) {
                                                    this.unpaid[i][0] = loanIdNext;
                                                    this.unpaid[i][1] = (0, utils_1.hexToBytes)(bigintToHex(amount).slice(2));
                                                }
                                            }
                                            tmp = new Uint8Array(__spreadArray(__spreadArray([], __read(this.unpaid[0][1]), false), __read(this.unpaid[0][1]), false));
                                            for (i = 1; i < 32; i++) {
                                                tmp = new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(tmp), false), __read(this.unpaid[i][0]), false), __read(this.unpaid[i][1]), false));
                                            }
                                            stateNext = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseId), false), __read(numberToUint8Array(this.repaid)), false), __read(tmp), false), __read(numberToUint8Array(kNext)), false)));
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
                                            console.log((0, utils_1.hexToBytes)((0, ethers_1.zeroPadValue)(this.scAddr, 32).slice(2)));
                                            console.log("going To proving process");
                                            return [4 /*yield*/, noir.execute({
                                                    NF_state_k1: Array.from(nfState),
                                                    SCAddr: Array.from((0, utils_1.hexToBytes)((0, ethers_1.zeroPadValue)(this.scAddr, 32).slice(2))),
                                                    baseid: Array.from(this.baseId),
                                                    eth_amt: amount.toString(),
                                                    eth_amt_bytes32: Array.from((0, utils_1.hexToBytes)(bigintToHex(amount).slice(2))),
                                                    income: this.income,
                                                    k: Array.from(numberToUint8Array(this.k)),
                                                    loan_expired: loanExpired.map(function (u8) { return Array.from(u8); }),
                                                    loan_state: loanState.map(function (u8) { return Array.from(u8); }),
                                                    loanid_k_next: Array.from(numberToUint8Array(kNext)),
                                                    repaid_k: Array.from(numberToUint8Array(this.repaid)),
                                                    state_k_next: Array.from(stateNext),
                                                    unpaid_k: this.unpaid.map(function (tuple) { return tuple.map(function (u8) { return Array.from(u8); }); }),
                                                    work_years: this.workYears,
                                                })];
                                        case 1:
                                            witness = (_a.sent()).witness;
                                            console.log("circuit executed");
                                            return [4 /*yield*/, backend.generateProof(witness, { keccak: true })];
                                        case 2:
                                            proof = _a.sent();
                                            console.log("proof generated");
                                            return [4 /*yield*/, backend.verifyProof(proof)];
                                        case 3:
                                            isValid = _a.sent();
                                            console.log("proof is ", isValid);
                                            for (i = 0; i < 32; i++) {
                                                if ((0, utils_1.bytesToHex)(loanState[i]) === (0, utils_1.bytesToHex)(numberToUint8Array(0))) {
                                                    loanState[i] = stateNext;
                                                    break;
                                                }
                                            }
                                            this.ethCap -= amount;
                                            this.k = kNext;
                                            this.state = stateNext;
                                            this.loanId = loanIdNext;
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        };
                        LendingInfo.prototype.repay = function (amount) {
                            return __awaiter(this, void 0, void 0, function () {
                                var kNext, loanIdNext, nfState, i, tmp, i, stateNext;
                                return __generator(this, function (_a) {
                                    kNext = this.k + 1;
                                    loanIdNext = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray([], __read(this.baseId), false), __read(numberToUint8Array(this.k)), false)));
                                    nfState = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseId), false), __read((0, utils_1.hexToBytes)(this.scAddr)), false), __read(numberToUint8Array(this.k)), false)));
                                    for (i = 0; i < 32; i++) {
                                        if ((0, utils_1.bytesToHex)(this.unpaid[i][0]) === (0, utils_1.bytesToHex)(numberToUint8Array(0)) &&
                                            (0, utils_1.bytesToHex)(this.unpaid[i][1]) === (0, utils_1.bytesToHex)(numberToUint8Array(0))) {
                                            this.unpaid[i][0] = loanIdNext;
                                            this.unpaid[i][1] = (0, utils_1.hexToBytes)(bigintToHex(amount));
                                        }
                                    }
                                    tmp = new Uint8Array(__spreadArray(__spreadArray([], __read(this.unpaid[0][1]), false), __read(this.unpaid[0][1]), false));
                                    for (i = 1; i < 32; i++) {
                                        tmp = new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(tmp), false), __read(this.unpaid[i][0]), false), __read(this.unpaid[i][1]), false));
                                    }
                                    stateNext = (0, sha3_1.keccak_256)(new Uint8Array(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseId), false), __read(numberToUint8Array(this.repaid)), false), __read(tmp), false), __read(numberToUint8Array(kNext)), false)));
                                    this.ethCap += amount;
                                    this.k = kNext;
                                    this.state = stateNext;
                                    this.loanId = loanIdNext;
                                    return [2 /*return*/];
                                });
                            });
                        };
                        return LendingInfo;
                    }());
                    scAddr = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
                    auroraInfo = new LendingInfo(alice_json_1.default.message.name, 141421356, scAddr, alice_json_1.default.message.income, alice_json_1.default.message.years_of_service);
                    almondInfo = new LendingInfo(alice_json_1.default.message.name, 141421356, scAddr, alice_json_1.default.message.income, alice_json_1.default.message.years_of_service);
                    bananaInfo = new LendingInfo(bob_json_1.default.message.name, 17320508, scAddr, bob_json_1.default.message.income, bob_json_1.default.message.years_of_service);
                    return [4 /*yield*/, auroraInfo.lend(BigInt(15))];
                case 1:
                    _a.sent();
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
                // await testEthersECDSA();
                // await genKeccak();
                // await genPi1PrivateInput();
                // test();
                return [4 /*yield*/, testBorrowCircuit()];
                case 1:
                    // await genHash();
                    // await testProof();
                    // await genSignature();
                    // await testEthersECDSA();
                    // await genKeccak();
                    // await genPi1PrivateInput();
                    // test();
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
