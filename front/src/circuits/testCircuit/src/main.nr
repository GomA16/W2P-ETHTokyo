fn main(x: [u8;32], y: pub [[[u8;32];2];3]) {
    let mut flag = false;
    for i in 0..y.len(){
        if(x == y[i][0]) {flag = true;}
    }
    assert(flag)
}
