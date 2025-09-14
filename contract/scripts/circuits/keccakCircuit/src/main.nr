use keccak256::keccak256;

fn main(x: [u8;32], y: [u8;32]) {
    assert(keccak256(x, x.len()) == y);
}

