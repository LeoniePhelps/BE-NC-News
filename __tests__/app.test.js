const app = require("../app/app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const jestSorted = require("jest-sorted");

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
  test("status:200 array of topics should have correct object keys", () => {
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
  test("status:404 responds with an error when requested route does not exist", () => {
    return request(app)
      .get("/api/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This route does not exist");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status:200 responds with requested article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article_id).toBe(1);
        expect(body.title).toEqual(expect.any(String));
        expect(body.topic).toEqual(expect.any(String));
        expect(body.author).toEqual(expect.any(String));
        expect(body.body).toEqual(expect.any(String));
        expect(body.created_at).toEqual(expect.any(String));
        expect(body.votes).toEqual(expect.any(Number));
      });
  });
  test("status:404 responds with an error when requested article does not exist", () => {
    return request(app)
      .get("/api/articles/99999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This article does not exist");
      });
  });
  test("status:400 responds with an error when request is an invalid input", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status:200 responds with comment count as a property of the requested article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comment_count).toBe(11);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200 should update the votes property of an article by increasing the votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.votes).toBe(101);
      });
  });
  test("status:200 should respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(1);
        expect(body.title).toEqual(expect.any(String));
        expect(body.topic).toEqual(expect.any(String));
        expect(body.author).toEqual(expect.any(String));
        expect(body.body).toEqual(expect.any(String));
        expect(body.created_at).toEqual(expect.any(String));
        expect(body.votes).toEqual(expect.any(Number));
      });
  });
  test("status:200 should update the votes property of an article by decreasing the votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(1);
        expect(body.votes).toBe(0);
      });
  });
  test("status:400 responds with an error when request is missing required fields", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("status:400 responds with an error when request violates schema", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "notNumber" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("status:200 responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        expect(users).toBeInstanceOf(Array);
      });
  });
  test("status:200 array of users should have correct object keys", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200 responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(1);
        expect(articles).toBeInstanceOf(Array);
      });
  });
  test("status:200 responds with articles sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("status:200 array of articles should have correct object keys", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

