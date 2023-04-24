const express = require("express");
const postController = require("../controller/postController");
const commentController = require("../controller/commentController");

const router = express.Router();

router.get("/", postController.getPost);
router.delete("/:post_id", postController.deletePost);
router.post("/", postController.addPost);

router.get("/comments/:post_id", commentController.getComment);
router.post("/comments/:post_id", commentController.addComment);
router.delete(
  "/comments/:post_id/:comment_id",
  commentController.deleteComment
);

module.exports = router;
