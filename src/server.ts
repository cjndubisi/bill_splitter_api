import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
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
