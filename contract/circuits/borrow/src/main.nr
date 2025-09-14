use keccak256::keccak256;

//----- define unpaied pair --
struct UnpaiedEntry {
    unpaied_loan_id: [u8;32],
    unpaied_amt: [u8;32],
}

//----- utility functions -----
fn has_intersection_ids(a: [[u8;32]; 32], b: [[u8;32]; 32]) -> bool {
    let mut hit = false;
    for i in 0..a.len() {
        for j in 0..b.len() {
            if a[i] == b[j] { hit = true; }
        }
    }
    hit
}
fn extract_unpaid_loan_ids(unpaid_k: [UnpaiedEntry;32]) -> [[u8;32];32] {
    let mut ids: [[u8;32];32] = [[0u8;32];32];
    for i in 0..unpaid_k.len() {
        ids[i] = unpaid_k[i].unpaied_loan_id;
    }
    ids
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

//----- borrowCircuit1 -----
fn borrowCircuit1(
    loan_state: [[u8;32];32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [UnpaiedEntry;32],
    k: [u8;32],
) -> bool {
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
    borrow1
}

// ----- borrowCircuit2 -----
fn borrowCircuit2(
    loan_expired: [[u8;32]; 32],
    eth_amt: u64,
    work_years: u64,
    income: u64,
    unpaid_k: [UnpaiedEntry;32],
) -> bool {
    let unpaid_loan_ids = extract_unpaid_loan_ids(unpaid_k);
    let intersect = has_intersection_ids(unpaid_loan_ids, loan_expired);
    let flag = !intersect;

    let eth_cap_u64 = if flag {
        let wy = work_years;
        let inc = income;
        let credit_score = (inc * (wy + 55u64)) / 1000u64; // income*0.001*(work_year+55)
        credit_score / 300u64
    } else {
        0u64
    };

    eth_cap_u64 >= eth_amt
}

// ----- borrowCircuit3 -----
fn borrowCircuit3(
    state_k_next: [u8;32],
    loanid_k_next: [u8;32],
    eth_amt_bytes32: [u8;32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [UnpaiedEntry;32],
    k: [u8;32],
) -> bool {
    // k_next
    let k_next = inc_be_bytes32(k);

    let mut loanid_preimage: [u8;64] = [0u8;64];
    for i in 0..32 { loanid_preimage[i]      = baseid[i]; }
    for i in 0..32 { loanid_preimage[32 + i] = k_next[i]; }
    let expected_loanid = keccak256(loanid_preimage, loanid_preimage.len());
    let loanid_ok = (loanid_k_next == expected_loanid);

    // repaid_{k+1} = repaid_k
    let repaid_k_next = repaid_k;

    let mut unpaid_k_next: [UnpaiedEntry;32] = unpaid_k;
    let mut inserted = false;
    for t in 0..unpaid_k_next.len() {
        let is_empty = (unpaid_k_next[t].unpaied_loan_id == [0u8;32]);
        if is_empty & (!inserted) {
            unpaid_k_next[t] = UnpaiedEntry {
                unpaied_loan_id: loanid_k_next,
                unpaied_amt: eth_amt_bytes32,
            };
            inserted = true;
        }
    }

    let mut preimage: [u8;2144] = [0u8;2144];
    for i in 0..32 { preimage[i]      = baseid[i]; }
    for i in 0..32 { preimage[32 + i] = repaid_k_next[i]; }

    let mut offset = 64;
    for t in 0..unpaid_k_next.len() {
        for j in 0..32 { preimage[offset + j] = unpaid_k_next[t].unpaied_loan_id[j]; }
        offset = offset + 32;
        for j in 0..32 { preimage[offset + j] = unpaid_k_next[t].unpaied_amt[j]; }
        offset = offset + 32;
    }
    for i in 0..32 { preimage[offset + i] = k_next[i]; }

    let expected_state = keccak256(preimage, preimage.len());
    let state_ok = (state_k_next == expected_state);

    loanid_ok & inserted & state_ok
}

// ----- borrowCircuit4 -----
fn borrowCircuit4(
    SCAddr: [u8;32],
    NF_state_k1: [u8;32],
    baseid: [u8;32],
    k: [u8;32],
) -> bool {
    let k_plus_1 = inc_be_bytes32(k);

    // baseid || SCAddr || (k+1)
    let mut preimage: [u8;96] = [0u8;96];
    for i in 0..32 { preimage[i]        = baseid[i]; }
    for i in 0..32 { preimage[32 + i]   = SCAddr[i]; }
    for i in 0..32 { preimage[64 + i]   = k_plus_1[i]; }

    let h = keccak256(preimage, preimage.len());
    h == NF_state_k1
}


// ------ Main Function -----
fn main(
    // --- For borrowCircuit1 ---
    loan_state:pub [[u8;32];32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [UnpaiedEntry;32],
    k: [u8;32],
    // --- For borrowCircuit2 ---
    loan_expired:pub [[u8;32]; 32],
    eth_amt:pub u64,
    work_years: u64,
    income: u64,
    // --- For borrowCircuit3 ---
    state_k_next:pub [u8;32],
    loanid_k_next:pub [u8;32],
    eth_amt_bytes32:pub [u8;32],
    // --- For borrowCircuit4 ---
    SCAddr:pub [u8;32],
    NF_state_k1:pub [u8;32],
) {
    let ok1 = borrowCircuit1(loan_state, baseid, repaid_k, unpaid_k, k);
    let ok2 = borrowCircuit2(loan_expired, eth_amt, work_years, income, unpaid_k);
    let ok3 = borrowCircuit3(state_k_next, loanid_k_next, eth_amt_bytes32, baseid, repaid_k, unpaid_k, k);
    let ok4 = borrowCircuit4(SCAddr, NF_state_k1, baseid, k);

    assert(ok1);
    assert(ok2);
    assert(ok3);
    assert(ok4);
}