const express = require("express");
const app = express();
const {
  getTopics,
  getArticleById,
} = require("../controllers/nc_news_controller");

//app.use(express.json())

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//////////////////////////////////////////

app.all("*", (req, res) => {
  res.status(404).send({ msg: "This route does not exist" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
