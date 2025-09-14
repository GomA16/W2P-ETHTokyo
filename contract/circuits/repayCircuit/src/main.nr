use keccak256::keccak256;

struct UnpaiedEntry {
    unpaied_loan_id: [u8;32],
    unpaied_amt: [u8;32],
}

fn main(
    loan_state:pub [[u8;32]; 32],
    baseid: [u8;32],
    repaid_k1: [u8;32],
    unpaied_k1: [UnpaiedEntry; 32],
    k1: [u8;32],
) {
    let mut preimage: [u8;2144] = [0u8;2144];

    for i in 0..32 { preimage[i] = baseid[i]; }
    for i in 0..32 { preimage[32 + i] = repaid_k1[i]; }

    let mut offset = 64;
    for t in 0..unpaied_k1.len() {
        for j in 0..32 {
            preimage[offset + j] = unpaied_k1[t].unpaied_loan_id[j];
        }
        offset = offset + 32;
        for j in 0..32 {
            preimage[offset + j] = unpaied_k1[t].unpaied_amt[j];
        }
        offset = offset + 32;
    }

    for i in 0..32 { preimage[offset + i] = k1[i]; }

    let state_k1 = keccak256(preimage, preimage.len());

    let mut flag = false;
    for i in 0..loan_state.len() {
        if state_k1 == loan_state[i] { flag = true; }
    }
    assert(flag);
}
