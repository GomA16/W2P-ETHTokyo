use keccak256::keccak256;

struct UnpaiedEntry {
    unpaied_loan_id: [u8;32],
    unpaied_amt: [u8;32],
}

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
    state_k_next: pub [u8;32],
    loanid_k_next: pub [u8;32],
    eth_amt: [u8;32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [UnpaiedEntry;32],
    k: [u8;32],
) {
    let k_next = inc_be_bytes32(k);

    // loanid_{k+1} = keccak256(baseid || k_next)
    let mut loanid_input: [u8;64] = [0;64];
    for i in 0..32 { loanid_input[i] = baseid[i]; }
    for i in 0..32 { loanid_input[32 + i] = k_next[i]; }
    let expected_loanid = keccak256(loanid_input, 64u32);
    assert(loanid_k_next == expected_loanid);

    // repaid_{k+1} = repaid_k
    let repaid_k_next = repaid_k;

    let mut unpaid_k_next: [UnpaiedEntry;32] = unpaid_k;
    let mut inserted = false;
    for t in 0..unpaid_k_next.len() {
        let is_empty = (unpaid_k_next[t].unpaied_loan_id == [0u8;32]);
        if is_empty & (!inserted) {
            unpaid_k_next[t] = UnpaiedEntry {
                unpaied_loan_id: loanid_k_next,
                unpaied_amt: eth_amt,
            };
            inserted = true;
        }
    }
    assert(inserted);

    // state_{k+1} = H(baseid || repaid_{k+1} || id0||amt0 || ... || id31||amt31 || k_next)
    let mut preimage: [u8;2144] = [0u8;2144];

    // baseid || repaid_{k+1}
    for i in 0..32 { preimage[i]      = baseid[i]; }
    for i in 0..32 { preimage[32 + i] = repaid_k_next[i]; }

    let mut offset = 64;
    for t in 0..unpaid_k_next.len() {
        for j in 0..32 { preimage[offset + j] = unpaid_k_next[t].unpaied_loan_id[j]; }
        offset = offset + 32;
        for j in 0..32 { preimage[offset + j] = unpaid_k_next[t].unpaied_amt[j]; }
        offset = offset + 32;
    }

    // || k_next
    for i in 0..32 { preimage[offset + i] = k_next[i]; }

    let expected_state = keccak256(preimage, preimage.len());

    assert(state_k_next == expected_state);
}
