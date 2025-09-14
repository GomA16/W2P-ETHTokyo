use keccak256::keccak256;

fn main(private: [u8;2144], loan_state:pub [[u8;32];32]){
    let current = keccak256(private, private.len());
    let mut flag = false;
    for i in 0..loan_state.len() {
        if (current == loan_state[i]) {flag = true;}
    }
    assert(flag);
}
