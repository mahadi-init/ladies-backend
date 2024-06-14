// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("ladies");

// Create a new document in the collection.
db.getCollection("users").insertOne({
  name: "Mahadi Hasan",
  phone: "01315631667",
  address: "Dhanmondi, Dhaka 1213",
});
