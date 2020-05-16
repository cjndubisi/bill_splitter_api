import { Router } from 'express';
import passport from 'passport';
require('./../core/auth');

const router = Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.status(201).json({ user: req.user, message: 'Signup Successful' });
  }
);

export const userRouter = router;
export default router;
