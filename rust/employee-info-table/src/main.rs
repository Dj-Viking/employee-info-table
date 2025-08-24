use sqlite;

fn main() {
  let connection = sqlite::open("test.db").unwrap();
	println!("yooo");
	// init_db(&connection);
  // insert_dept(&connection);
  read_dept(&connection);
}

fn read_dept(connection: &sqlite::Connection) {
  let query = "select * from departments";
  for row in connection.prepare(query).unwrap() {
    println!("row {:?}", row);
  }
}
fn insert_dept(connection: &sqlite::Connection) {
  let query = "insert into departments (name) values ('hello')";
  connection.prepare(query).unwrap();
}
