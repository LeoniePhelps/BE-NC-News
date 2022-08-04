const {
  selectTopics,
  selectArticleById,
  updateArticleVotesById,
  selectUsers,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
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

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then(() => {
      return selectCommentsByArticleId(articleId);
    })
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const insertComment = req.body;
  insertCommentByArticleId(articleId, insertComment)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};
