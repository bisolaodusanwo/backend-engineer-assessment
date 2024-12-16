const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
require("dotenv").config();

jest.setTimeout(30000);

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected:", process.env.MONGO_URI);
  } catch (error) {
    console.error("Database Connection Error:", error.message);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Authentication Test", () => {
  it("should register a new user", async () => {
    const uniqueEmail = `abiz${Date.now()}@example.com`;
    const res = await request(app).post("/api/auth/register").send({
      name: "Abiz",
      email: uniqueEmail,
      password: "password123",
    });

    console.log("Register User Response:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("name", "Abiz");
    expect(res.body).toHaveProperty("email", uniqueEmail);
  });

  it("should not allow duplicate registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Abiz",
      email: "abiz@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abiz@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("name", "Abiz");
    expect(res.body).toHaveProperty("email", "abiz@example.com");
  });

  it("should not login with incorrect credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "abiz@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("should not login with non-existing email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
