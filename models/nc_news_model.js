const db = require("../db/connection");

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

exports.selectArticles = (sortBy = "created_at") => {
  const validSortBy = ["created_at"];
  if (validSortBy.includes(sortBy)) {
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sortBy} DESC;`
      )
      .then(({ rows }) => {
        return rows;
      });
  }
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
