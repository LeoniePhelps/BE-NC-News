const {
  selectTopics,
  selectArticleById,
  updateArticleVotesById,
} = require("../models/nc_news_model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

exports.patchArticleVotesById = (req, res, next) => {
  const articleId = req.params.article_id;
  const updateVotes = req.body.inc_votes;
  updateArticleVotesById(articleId, updateVotes)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};
