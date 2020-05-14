const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();


router.get('/', function (req, res) {
  res.json({ message: 'Root Page' });
});

// routes
app.use('/v1', router);

app.get('/*', function(req, res) {
  res.status(400).json({ message: 'Bad Request' });
});

app.listen(port, () => {
  console.log(`Successfully started server at port ${port}`)
});
