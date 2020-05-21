import { Router, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { logger } from '../logger';

const router = Router();

const login = (
  req: Express.Request,
  res: any,
  { message, user }: { message: string; user: any }
) => {
  req.login(user, { session: false }, async (error) => {
    if (error) {
      logger.error(error, user, 'will return 400');
      return res.status(400).json({ message: error.message });
    }
    const payload = { _id: user.id, email: user.email };
    const token = jwt.sign({ user: payload }, process.env.JWT_SECRET);
    res.json({
      user,
      token,
      message,
    });
  });
};

router.post('/signup', async (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        logger.info(err, user, 'will throw error');
        throw err;
      }
      return login(req, res, { user, message: 'Signup Successful' });
    } catch (error) {
      logger.error(error);
      let message = 'Bad Request';
      if (error?.errors) {
        message = error.errors.map((error: any) => error.message)[0];
      }
      logger.info(error, message);
      return res.status(400).json({ message });
    }
  })(req, res, next);
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        logger.info(err, user, 'Unable to authenticate');
        throw new Error('Unable to authenticate');
      }
      return login(req, res, { user, message: 'Login Successful' });
    } catch (error) {
      logger.info(error, 'Invalid email and password');
      return res.status(401).json({ message: 'Invalid email and password' });
    }
  })(req, res, next);
});

export const userRouter = router;
export default router;
