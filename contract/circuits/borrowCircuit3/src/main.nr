use keccak256::keccak256;

fn increment_bytes32(input: [u8;32]) -> [u8;32] {
    let mut out: [u8;32] = input;
    let mut carry: u8 = 1;

    for i in 0..32 {
        let sum: u16 = input[i] as u16 + carry as u16;
        out[i] = (sum & 0xFF) as u8;
        carry = if sum > 0xFF { 1 } else { 0 };
    }

    out
}

fn main(
    state_k_next: pub [u8;32],
    loanid_k_next: pub [u8;32],
    eth_amt: [u8;32],
    baseid: [u8;32],
    repaid_k: [u8;32],
    unpaid_k: [u8;32],
    k: [u8;32],
) {
    let k_next = increment_bytes32(k);

    // loanid_{k+1} = keccak256(baseid || k_next)
    let mut loanid_input: [u8;64] = [0;64];
    for i in 0..32 { loanid_input[i] = baseid[i]; }
    for i in 0..32 { loanid_input[32 + i] = k_next[i]; }
    let expected_loanid = keccak256(loanid_input, 64u32);
    assert(loanid_k_next == expected_loanid);

    // repaid_{k+1} = repaid_k
    let repaid_k_next = repaid_k;

    // unpaid_{k+1} = keccak256(unpaid_k || loanid_{k+1} || eth_amt)
    let mut unpaid_input: [u8;96] = [0;96];
    for i in 0..32 { unpaid_input[i] = unpaid_k[i]; }
    for i in 0..32 { unpaid_input[32 + i] = loanid_k_next[i]; }
    for i in 0..32 { unpaid_input[64 + i] = eth_amt[i]; }
    let unpaid_k_next = keccak256(unpaid_input, 96u32);

    // state_{k+1} = keccak256(baseid || repaid_{k+1} || unpaid_{k+1} || k_next)
    let mut state_input: [u8;128] = [0;128];
    for i in 0..32 { state_input[i] = baseid[i]; }
    for i in 0..32 { state_input[32 + i] = repaid_k_next[i]; }
    for i in 0..32 { state_input[64 + i] = unpaid_k_next[i]; }
    for i in 0..32 { state_input[96 + i] = k_next[i]; }
    let expected_state = keccak256(state_input, 128u32);

    assert(state_k_next == expected_state);
}
