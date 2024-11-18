use sqlite;
fn main() {
    let connection = sqlite::open(":memory:").unwrap();
    let query = "select * from ed";
    for row in connection.prepare(query).unwrap()
    {
        println!("yo we got rowssssss {:?}", row);
    }
}
