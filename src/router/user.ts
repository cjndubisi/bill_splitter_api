import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
require('./../core/auth');

const router = Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.status(201).json({ user: req.user, message: 'Signup Successful' });
  }
);

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('Unable to authenticate');
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }
        const payload = { _id: user.id, email: user.email };
        const token = jwt.sign({ user: payload }, process.env.JWT_SECRET);
        res.json({ user, token, message: 'Signup Successful' });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export const userRouter = router;
export default router;
