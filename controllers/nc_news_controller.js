const { selectTopics, selectTopicById } = require("../models/nc_news_model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectTopicById(articleId).then((article) => {
    res.status(200).send(article);
  });
};
