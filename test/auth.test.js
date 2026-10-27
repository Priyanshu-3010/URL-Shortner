
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../app");

test("GET /url/analytics/nonexistent without login should redirect to login", async () => {
    const response = await request(app)
        .get("/url/analytics/nonexistent");

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "/login");
});

test("POST /url without login should redirect to login", async () => {
    const response = await request(app)
        .post("/url")
        .send({ url: "https://example.com" });

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "/login");
});

test("DELETE /url/nonexistent without login should redirect to login", async () => {
    const response = await request(app)
        .delete("/url/nonexistent");

    assert.equal(response.status, 302);
    assert.equal(response.headers.location, "/login");
});
