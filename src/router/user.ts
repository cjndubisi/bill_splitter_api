import { Router } from 'express';
import { createUser } from '../models/user';
const router = Router();

router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!(name && password && email)) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  try {
    const created = await createUser({ name, email, password });
    const user: any = created.toJSON();
    delete user['password'];

    res.status(201).json({ user, message: 'Succesfully logged' });
  } catch (err) {
    console.log();

    res.status(400).json({ message: err.message });
  }
});

export const userRouter = router;
export default router;
