// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("ladies");

// Create a new document in the collection.
db.getCollection("products").insertOne({
  name: "TEST PRODUCT 2",
  sku: "SKU111",
  variants: [
    {
      color: "green",
      img: "file:///home/hasan/Pictures/447972469_873992341439541_1969385802011836728_n.jpg",
      size: "2XL",
      quantity: 20,
      price: 18,
      sellerPrice: 130,
    },
    {
      color: "red",
      img: "/home/hasan/Pictures/ahmed-WoxetsqTJCY-unsplash.jpg",
      size: "XL",
      quantity: 100,
      price: 299,
      sellerPrice: 120,
    },
  ],
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  videoId: "https://www.youtube.com/watch?v=86u4ysdfi34",
  status: "IN-STOCK",
  reviews: [],
  featured: false,
  sellCount: 0,
  additionalInformation: [],
});
