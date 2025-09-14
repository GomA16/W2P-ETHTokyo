use keccak256::keccak256;

fn inc_be_bytes32(x: [u8;32]) -> [u8;32] {
    let mut out = x;
    let mut carry: u8 = 1u8;

    for r in 0..32 {
        let idx = 31 - r;
        let sum: u32 = (out[idx] as u32) + (carry as u32);
        out[idx] = (sum & 255u32) as u8;
        carry = (sum >> 8) as u8; // 0 or 1
    }
    out
}

fn main(
    SCAddr:pub [u8;32],
    NF_state_k1:pub [u8;32],
    baseid: [u8;32],
    k: [u8;32],
) {
    let k_plus_1 = inc_be_bytes32(k);

    // baseid || SCAddr || (k+1)
    let mut preimage: [u8;96] = [0u8;96];
    for i in 0..32 { preimage[i]        = baseid[i]; }
    for i in 0..32 { preimage[32 + i]   = SCAddr[i]; }
    for i in 0..32 { preimage[64 + i]   = k_plus_1[i]; }

    // H(baseid, SCAddr, k+1)
    let h = keccak256(preimage, preimage.len());

    // NF_state_{k+1} == H(baseid, SCAddr, k+1)
    assert(h == NF_state_k1);
}
