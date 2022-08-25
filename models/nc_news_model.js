const db = require("../db/connection");
const { reduceRight } = require("../db/data/test-data/articles");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query(
      "SELECT articles.*, CAST(COUNT(comment_id) AS INT) comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id",
      [articleId]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "This article does not exist",
        });
      }
      return article;
    });
};

exports.updateArticleVotesById = (articleId, updateVotes) => {
  if (updateVotes === undefined) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $2 WHERE article_id=$1 RETURNING *;",
      [articleId, updateVotes]
    )
    .then((res) => {
      return res.rows[0];
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = (sortBy = "created_at", order = "DESC", topic) => {
  if (!["DESC", "ASC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order" });
  }
  if (topic && !["mitch", "cats", "paper", "football", "coding", "cooking"].includes(topic)) {
    return Promise.reject({ status: 404, msg: "Invalid topic" });
  }
  if (
    !["article_id", "title", "topic", "author", "created_at", "votes"].includes(
      sortBy
    )
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort by" });
  }

  const queryValues = [];
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryStr += `WHERE articles.topic =$1`;
    queryValues.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 200, msg: "No articles" });
    }
    return rows;
  });
};

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      "SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id=$1",
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 200, msg: "No comments" });
      }
      return rows;
    });
};

exports.insertCommentByArticleId = (articleId, insertComment) => {
  return db
    .query(
      "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
      [insertComment.body, insertComment.username, articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.removeCommentById = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1;", [commentId])
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "This comment does not exist",
        });
      }
    });
};
