// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("ladies");

// Create a new document in the collection.
db.getCollection("admins").insertOne({
  name: "Mahadi hasan",
  phone: "01315631667",
  email: "mahadi.dev@outlook.com",
  password: "624234",
});
