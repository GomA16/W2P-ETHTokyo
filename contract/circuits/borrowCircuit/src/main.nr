use keccak256::keccak256;

fn current_state(private: [u8;], loan_state: pub [[u8;32];32]) -> bool{
    let mut unpaidConcat:[u8;32*32];
    for i in 0..32 {
        for ii in 0..32 {
            unpaidConcat = unpaid_k[i][j];
        }
    }
    const current = keccak256(baseid.concat(repaid_k.concat(unpaidConcat.cooncat(k))));
    const flag = false;
    for i in 0..loan_state.len() {
        if (current == loan_state[i]) {flag = true;}
    }
    assert(flag);
    retrun flag;
}

fn main(baseid: [u8;32], repaid_k: [u8;32], unpaid_k: [[u8;32];32], k: [u8;32], loan_state: pub [[u8;32];32]) {
    assert(current_state(baseid, repaid_k, unpaid_k, k, loan_state));
}
