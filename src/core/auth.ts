import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import User, { createUser, findBy } from '../models/user';
import bcrypt from 'bcrypt';
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
    async (req, emailField, password, done) => {
      const name = req.body.name;
      const email = emailField.toLowerCase();

      if (!(name && password && email)) {
        return done(null, false, { message: 'Bad Request' });
      }
      try {
        let user: User = null;
        const hash = await bcrypt.hash(password, 10);

        user = await User.findOne({
          where: { email: email.toLowerCase(), activated: false },
          include: [{ all: true }],
        });

        if (!user) {
          user = await createUser({ email, password, name });
          return done(null, user);
        }
        // update user to new email and activate account
        // TODO; Email activation
        user.password = hash;
        user.activated = true;
        await user.save();

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await findBy({ email, activated: true });
        const invalid = { message: 'Invalid email and password' };
        if (!user) {
          return done(null, false, invalid);
        }
        const valid = await user.verifyPassword(password);
        if (!valid) {
          return done(null, false, invalid);
        }
        req.user = user;
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        done(error);
      }
    }
  )
);

var opts = {} as StrategyOptions;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await findBy({ id: jwt_payload.user._id });
      if (user) {
        return done(null, user);
      }
      done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);
