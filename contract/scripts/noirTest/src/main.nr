fn main() {
    let x: [[u8;2];3] = [[1,2],[3,4],[5,6]];
    let mut y = x[0];
    println(y);
    for i in 1..x.len() {
        let tmp = y.concat(x[i]);
        y = tmp;
    }
    println(y);
}


