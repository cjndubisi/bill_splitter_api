import { Router, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const login = (
  req: Express.Request,
  res: any,
  next: NextFunction,
  { message, user }: { message: string; user: any }
) => {
  req.login(user, { session: false }, async (error) => {
    if (error) {
      return next(error);
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
        return res.status(401).json({ message: 'Bad Request' });
      }
      return login(req, res, next, { user, message: 'Signup Successful' });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('Unable to authenticate');
        return next(error);
      }
      return login(req, res, next, { user, message: 'Login Successful' });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export const userRouter = router;
export default router;
