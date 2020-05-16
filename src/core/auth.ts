import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { createUser, findBy } from '../models/user';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const name = req.body.name;
      if (!(name && password && email)) {
        return done(null, false, { message: 'Bad Request' });
      }
      try {
        const name = req.body.name;
        const user = await createUser({ email, password, name });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

var opts = {} as StrategyOptions;
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
