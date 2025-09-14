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
    SCAddr: pub [u8;32],
    NF_state_k_next_next: pub [u8;32],  // NF_state_{k+2}
    baseid: [u8;32],
    k_next: [u8;32],
) {
    let k_next_next = increment_bytes32(k_next);

    // state_{k+2} = keccak256(baseid || SCAddr || k+2)
    let mut state_input: [u8;96] = [0;96];
    for i in 0..32 { state_input[i] = baseid[i]; }
    for i in 0..32 { state_input[32 + i] = SCAddr[i]; }
    for i in 0..32 { state_input[64 + i] = k_next_next[i]; }

    let expected_state = keccak256(state_input, 96u32);

    assert(NF_state_k_next_next == expected_state);
}
