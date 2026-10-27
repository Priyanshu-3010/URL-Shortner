
const test = require("node:test");
const assert = require("node:assert/strict");

const URLModel = require("../models/url");
const {
    handleGenerateNewShortURL,
} = require("../controllers/url");

function createMockResponse() {
    const res = {
        statusCode: 200,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        },

        getHeader() {
            return undefined;
        },
    };

    return res;
}

function createMockRequest(body = {}) {
    return {
        body,
        user: { _id: "test-user-id" },
        protocol: "http",
        get(name) {
            return name.toLowerCase() === "host"
                ? "localhost:8001"
                : undefined;
        },
    };
}

test("valid URL should create a short URL", async (t) => {
    const originalFindOne = URLModel.findOne;
    const originalCreate = URLModel.create;

    t.after(() => {
        URLModel.findOne = originalFindOne;
        URLModel.create = originalCreate;
    });

    URLModel.findOne = async () => null;

    URLModel.create = async (data) => ({
        ...data,
    });

    const req = createMockRequest({
        url: "https://example.com",
        customAlias: "my-site",
    });

    const res = createMockResponse();

    await handleGenerateNewShortURL(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.id, "my-site");
    assert.equal(
        res.body.shortURL,
        "http://localhost:8001/my-site"
    );
});

test("missing URL should return 400", async (t) => {
    const originalFindOne = URLModel.findOne;

    t.after(() => {
        URLModel.findOne = originalFindOne;
    });

    const req = createMockRequest({});
    const res = createMockResponse();

    await handleGenerateNewShortURL(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.error, "URL is required");
    assert.equal(URLModel.findOne, originalFindOne);
});

test("invalid URL should return 400", async (t) => {
    const originalFindOne = URLModel.findOne;

    t.after(() => {
        URLModel.findOne = originalFindOne;
    });

    const req = createMockRequest({
        url: "not-a-valid-url",
    });

    const res = createMockResponse();

    await handleGenerateNewShortURL(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.error, "Invalid URL format");
});

test("invalid custom alias should return 400", async (t) => {
    const originalFindOne = URLModel.findOne;

    t.after(() => {
        URLModel.findOne = originalFindOne;
    });

    const req = createMockRequest({
        url: "https://example.com",
        customAlias: "ab",
    });

    const res = createMockResponse();

    await handleGenerateNewShortURL(req, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /Custom alias must be/);
});

test("existing alias should return 409", async (t) => {
    const originalFindOne = URLModel.findOne;

    t.after(() => {
        URLModel.findOne = originalFindOne;
    });

    URLModel.findOne = async () => ({
        shortId: "my-site",
    });

    const req = createMockRequest({
        url: "https://example.com",
        customAlias: "my-site",
    });

    const res = createMockResponse();

    await handleGenerateNewShortURL(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(
        res.body.error,
        "This short URL is already taken"
    );
});
