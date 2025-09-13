fn main(x: [u8;32], y: pub [u8;32]) {
    assert(std::hash::blake2s(x) == y);
}
