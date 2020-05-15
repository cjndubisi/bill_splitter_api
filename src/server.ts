import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { findBy } from './models/user';

dotenv.config();

interface OPTS {
  jwtFromRequest: any;
  secretOrKey: string;
  issuer: string;
  audience: string;
}
var opts = {} as OPTS;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'com.bill_splitsiwe';
opts.audience = 'com.codementor.bill_splitwise';

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await findBy({ id: jwt_payload.id });
      if (user) {
        return done(null, user);
      }
      done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

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

app.get('/*', function (req, res) {
  res.status(400).json({ message: 'Bad Request' });
});

export default app;
