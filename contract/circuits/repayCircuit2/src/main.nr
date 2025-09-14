use keccak256::keccak256;

struct UnpaiedEntry {
    unpaied_loan_id: [u8;32],
    unpaied_amt: [u8;32],
}

fn inc_be_bytes32(x: [u8;32]) -> [u8;32] {
    let mut out = x;
    let mut carry: u16 = 1;
    for r in 0..32 {
        let idx = 31 - r;
        let sum: u16 = (out[idx] as u16) + carry;
        out[idx] = (sum & 255u16) as u8;
        carry = sum >> 8; // 0 or 1
    }
    out
}

fn add_be_bytes32(a: [u8;32], b: [u8;32]) -> [u8;32] {
    let mut out = [0u8;32];
    let mut carry: u16 = 0;
    for r in 0..32 {
        let idx = 31 - r;
        let sum: u16 = (a[idx] as u16) + (b[idx] as u16) + carry;
        out[idx] = (sum & 255u16) as u8;
        carry = sum >> 8; // 0 or 1
    }
    out // mod 2^256
}

fn sub_be_bytes32_noborrow(a: [u8;32], b: [u8;32]) -> [u8;32] {
    let mut gt = false;
    let mut lt = false;
    for i in 0..32 {
        if (!gt) & (!lt) {
            if a[i] > b[i] { gt = true; }
            if a[i] < b[i] { lt = true; }
        }
    }
    assert(!lt);

    let mut out = [0u8;32];
    let mut borrow: i16 = 0;
    for r in 0..32 {
        let idx = 31 - r;
        let ai: i16 = a[idx] as i16;
        let bi: i16 = (b[idx] as i16) + borrow;
        if ai >= bi {
            out[idx] = (ai - bi) as u8;
            borrow = 0;
        } else {
            out[idx] = (ai + 256 - bi) as u8;
            borrow = 1;
        }
    }
    out
}

fn is_zero_bytes32(x: [u8;32]) -> bool {
    let mut zero = true;
    for i in 0..32 { zero = zero & (x[i] == 0u8); }
    zero
}

fn main(
    state_k2:pub [u8;32],
    repay_amt:pub [u8;32],
    baseid: [u8;32],
    repaid_k1: [u8;32],
    unpaied_k1: [UnpaiedEntry; 32],
    k1: [u8;32],
    loan_id: [u8;32],
) {
    // repaid_k2 = repaid_k1 + repay_amt
    let repaid_k2 = add_be_bytes32(repaid_k1, repay_amt);

    let mut unpaied_k2: [UnpaiedEntry; 32] = unpaied_k1;
    let mut found = false;
    let mut applied = false;

    for t in 0..unpaied_k1.len() {
        let is_target = (unpaied_k1[t].unpaied_loan_id == loan_id);
        if is_target & (!applied) {
            found = true;
            let owed_old = unpaied_k1[t].unpaied_amt;
            let owed_new = sub_be_bytes32_noborrow(owed_old, repay_amt);

            if is_zero_bytes32(owed_new) {
                unpaied_k2[t] = UnpaiedEntry { unpaied_loan_id: [0u8;32], unpaied_amt: [0u8;32] };
            } else {
                let mut updated = unpaied_k1[t];
                updated.unpaied_amt = owed_new;
                unpaied_k2[t] = updated;
            }
            applied = true;
        } else {
            unpaied_k2[t] = unpaied_k1[t];
        }
    }

    assert(found);

    // k2 = k1 + 1
    let k2 = inc_be_bytes32(k1);

    let mut preimage: [u8;2144] = [0u8;2144];

    // baseid
    for i in 0..32 { preimage[i] = baseid[i]; }
    // repaid_k2
    for i in 0..32 { preimage[32 + i] = repaid_k2[i]; }
    // unpaied_k2
    let mut offset = 64;
    for t in 0..unpaied_k2.len() {
        for j in 0..32 { preimage[offset + j]     = unpaied_k2[t].unpaied_loan_id[j]; }
        offset = offset + 32;
        for j in 0..32 { preimage[offset + j]     = unpaied_k2[t].unpaied_amt[j]; }
        offset = offset + 32;
    }
    // k2
    for i in 0..32 { preimage[offset + i] = k2[i]; }

    let computed = keccak256(preimage, preimage.len());
    assert(computed == state_k2);
}
