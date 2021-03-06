import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { userRouter, groupRouter, billRouter } from './router';
import morgan from 'morgan';
import cors from 'cors'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(morgan('combined'));
app.use(cors())

const router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'Root Page' });
});

// routes
app.use('/v1', router);
app.use('/v1/users', userRouter);
app.use(
  '/v1/bills',
  passport.authenticate('jwt', { session: false }),
  billRouter
);
app.use(
  '/v1/groups',
  passport.authenticate('jwt', { session: false }),
  groupRouter
);

app.get('/*', function (req, res) {
  res.status(400).json({ message: 'Bad Request' });
});

export default app;
