
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../app");

test("GET /login should return 200", async () => {
    const response = await request(app).get("/login");

    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /html/);
});

test("GET /signup should return 200", async () => {
    const response = await request(app).get("/signup");

    assert.equal(response.status, 200);
    assert.match(response.headers["content-type"], /html/);
});
