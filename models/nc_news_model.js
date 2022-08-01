const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.selectTopicById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [articleId])
    .then(({ rows }) => {
      return rows[0];
    });
};
