import express from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const sequelize = new Sequelize(process.env.PG_URL);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

var router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'Root Page' });
});

// routes
app.use('/v1', router);

app.get('/*', function (req, res) {
  res.status(400).json({ message: 'Bad Request' });
});

export default app;
