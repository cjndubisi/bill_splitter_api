import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {}));

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
