const express = require("express");
const app = express();
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const {
  getTopics,
  getArticleById,
  patchArticleVotesById,
  getUsers,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("../controllers/nc_news_controller");

app.use(express.json());

////////////////// ENDPOINTS //////////////////

app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotesById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

////////////////// ERROR HANDLING //////////////////

app.all("*", (req, res) => {
  res.status(404).send({ msg: "This route does not exist" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
