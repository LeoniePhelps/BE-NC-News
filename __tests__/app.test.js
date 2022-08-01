const app = require("../app/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("status:200 responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
        });
    });
    test("array of topics should have objects with keys of 'slug' and 'description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(Object.keys(topics[0])).toEqual(["slug", "description"]);
        });
    });
  });
});

describe("status:404", () => {
  test("status:404, responds with an error when passed a route that does not exist", () => {
    return request(app)
      .get("/api/ttooppiiccss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
