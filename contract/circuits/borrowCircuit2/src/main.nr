fn has_intersection_ids(a: [[u8;32]; 32], b: [[u8;32]; 32]) -> bool {
    let mut hit = false;
    for i in 0..a.len() {
        for j in 0..b.len() {
            if a[i] == b[j] { hit = true; }
        }
    }
    hit
}

fn main(
    loan_expired:pub [[u8;32]; 32],
    eth_amt:pub u64,
    work_years: u64,
    income: u64,
    unpaid_loan_ids: [[u8;32]; 32],
) {
    let intersect = has_intersection_ids(unpaid_loan_ids, loan_expired);
    let flag = !intersect;

    let eth_cap_u64 = if flag {
        let wy = work_years;
        let inc = income;
        // Credit_score = income * 0.001 * (work_year + 55)
        let credit_score = (inc * (wy + 55u64)) / 1000u64;
        // Eth_cap = Credit_score / 300
        credit_score / 300u64
    } else {
        0u64
    };

    assert(eth_cap_u64 >= eth_amt);
}
