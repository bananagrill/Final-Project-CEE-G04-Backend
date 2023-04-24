const dotenv = require("dotenv");
const dateTime = require("./dateTime");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getComment = async (req, res) => {
  const p_id = req.params.post_id;
  console.log(p_id);
  const params = {
    TableName: process.env.aws_comment_table_name,
    // ExpressionAttributeValues: {
    //   ":p_id": { S: p_id },
    // },
    // FilterExpression: "post_id = :p_id",
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addComment = async (req, res) => {
  const comment_id = uuidv4();
  const comment_date = dateTime.getTime();
  const post_id = req.params.post_id;
  const comment_like = 0;
  const comment_dislike = 0;
  console.log(comment_date);
  const item = {
    comment_id: comment_id,
    post_id: post_id,
    ...req.body,
    comment_date: comment_date,
    comment_dislike: comment_dislike,
    comment_like: comment_like,
  };
  const params = {
    TableName: process.env.aws_comment_table_name,
    Item: item,
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.deleteComment = async (req, res) => {
  const comment_id = req.params.comment_id;
  console.log(comment_id);
  const post_id = req.params.post_id;
  console.log(post_id);
  const params = {
    TableName: process.env.aws_comment_table_name,
    Key: {
      comment_id: comment_id,
      post_id: post_id,
    },
  };
  try {
    const data = await docClient.send(new DeleteCommand(params));
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
