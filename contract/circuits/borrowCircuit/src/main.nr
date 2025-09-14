use keccak256::keccak256;

struct UnpaiedEntry {
    unpaied_loan_id: [u8;32],
    unpaied_amt: [u8;32],
}

fn main(
    loan_state:pub [[u8;32];32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [UnpaiedEntry;32],
    k: [u8;32],
) {
    let mut preimage: [u8;2144] = [0u8;2144];

    // baseid || repaid_k
    for i in 0..32 { preimage[i]      = baseid[i]; }
    for i in 0..32 { preimage[32 + i] = repaid_k[i]; }

    // || id[0] || amt[0] || ... || id[31] || amt[31]
    let mut offset = 64;
    for t in 0..unpaid_k.len() {
        for j in 0..32 { preimage[offset + j]      = unpaid_k[t].unpaied_loan_id[j]; }
        offset = offset + 32;
        for j in 0..32 { preimage[offset + j]      = unpaid_k[t].unpaied_amt[j]; }
        offset = offset + 32;
    }
    for i in 0..32 { preimage[offset + i] = k[i]; }

    let state_k = keccak256(preimage, preimage.len());

    let mut borrow1 = false;
    for i in 0..loan_state.len() {
        if (state_k == loan_state[i]) { borrow1 = true; }
    }
    assert(borrow1);
}
