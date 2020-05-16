import { Router } from 'express';
import { findBy, createGroup } from '../models/group';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const group = await createGroup({ name: req.body.name });
    return res.status(201).json(group);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

export const groupRouter = router;
export default router;
