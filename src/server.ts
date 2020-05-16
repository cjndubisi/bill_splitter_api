import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { userRouter, groupRouter } from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

const router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'Root Page' });
});

// routes
app.use('/v1', router);
app.use('/v1/users', userRouter);
app.use('/v1/groups', groupRouter);

app.get('/*', function (req, res) {
  res.status(400).json({ message: 'Bad Request' });
});

export default app;
