const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
require("dotenv").config();

jest.setTimeout(30000);

let token;
let productId;

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully:");

    const res = await request(app).post("/api/auth/login").send({
      email: "luke@example.com",
      password: "password1369",
    });

    token = res.body.token;
    if (!token) throw new Error("Admin login failed. Token not received.");
    console.log("Admin Token:", token);
  } catch (error) {
    console.error("Setup Error:", error.message);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Protected route accessed");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("isAdmin", true);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
});

describe("Product Tests", () => {
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Laptop",
        price: 1000,
        description: "Unit testing product",
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1681702156223-ea59bfbf1065?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGFwdG9wfGVufDB8fDB8fHww",
        category: "Gadgets",
        countInStock: 10,
        rating: 4.5,
        numReviews: 0,
      });

    console.log("Create Product Response:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    productId = res.body._id;
  });

  it("should fetch all products", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Laptop",
        price: 1000,
        description: "Unit testing product",
        imageUrl: "https://example.com/laptop.jpg",
        category: "Gadgets",
        countInStock: 10,
        rating: 4.5,
        numReviews: 0,
      });

    console.log("Create Product Response:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    productId = res.body._id;
  });

  it("should delete a product", async () => {
    if (!productId) {
      console.error("No productId available for deletion test");
      return;
    }

    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    console.log("Delete Product Response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product deleted successfully");
  });
});
