const dotenv = require("dotenv");
const dateTime = require("./dateTime");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getPost = async (req, res) => {
  const params = {
    TableName: process.env.aws_post_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.getPostsByAuthorID = async (req, res) => {
  const author_id = req.params.author_id;
  // console.log(author_id);
  const params = {
    TableName: process.env.aws_post_table_name,
    FilterExpression: "post_author_id = :id",
    ExpressionAttributeValues: {
      ":id": author_id,
    },
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.addPost = async (req, res) => {
  const post_id = uuidv4();
  const second = new Date();
  const post_date = dateTime.getTime(second);
  const item = {
    second: second.getTime(),
    post_id: post_id,
    ...req.body,
    post_date: post_date.toString(),
  };
  console.log(item.second);
  const params = {
    TableName: process.env.aws_post_table_name,
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

exports.deletePost = async (req, res) => {
  const post_id = req.params.post_id;
  console.log(post_id);
  const params = {
    TableName: process.env.aws_post_table_name,
    Key: {
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
