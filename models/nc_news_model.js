const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [articleId])
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
