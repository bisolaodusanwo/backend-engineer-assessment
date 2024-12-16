const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
require("dotenv").config();
jest.setTimeout(30000);

let token;
let userId;

beforeAll(async () => {
  try {
    const res = await request(app).post("/api/auth/login").send({
      email: "luke@example.com",
      password: "password1369",
    });

    console.log("Login Response:", res.body);

    if (!res.body.token) throw new Error("Login failed: Token not received");

    token = res.body.token;
    userId = jwt.decode(token).id;
    console.log("Admin Token:", token);
  } catch (error) {
    console.error("Setup Error in beforeAll:", error.message);
  }
});

it("should allow access with a valid token", async () => {
  const res = await request(app)
    .get("/api/test/protected")
    .set("Authorization", `Bearer ${token}`);

  console.log("Protected Route Response:", res.body);

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Protected route accessed");
  expect(res.body.user).toHaveProperty("id", userId);
  expect(res.body.user).toHaveProperty("isAdmin", true);
});

it("should deny access without a token", async () => {
  const res = await request(app).get("/api/test/protected");

  console.log("Unauthorized Response:", res.body);

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe("Token not found, authorization denied");
});

it("should deny access with an invalid token", async () => {
  const invalidToken = "invalid.token.value";

  const res = await request(app)
    .get("/api/test/protected")
    .set("Authorization", `Bearer ${invalidToken}`);

  console.log("Invalid Token Response:", res.body);

  expect(res.statusCode).toBe(403);
  expect(res.body.message).toBe("Token verification failed, access denied");
});
