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

describe("GET /api/topics", () => {
  test("status:200 responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(1);
        expect(topics).toBeInstanceOf(Array);
      });
  });
  test("array of topics should have objects with keys of 'slug' and 'description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("ERROR HANDLING", () => {
  test("status:404, responds with an error when passed a route that does not exist", () => {
    return request(app)
      .get("/api/ttooppiiccss")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This route does not exist");
      });
  });
});

//test all endpoints for errors

describe("GET /api/articles/:article_id", () => {
  test("status:200 responds with the correct article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});
