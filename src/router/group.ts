import { Router } from 'express';
import { findBy, createGroup, deleteGroup } from '../models/group';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const group = await createGroup({ name: req.body.name });
    return res.status(201).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {    
    const group: any = await findBy({ id: req.params.id });
    group.name = req.body.name;

    await group.save();
    await group.reload();
    return res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await findBy({ id: req.params.id });
    return res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteGroup({ id: req.params.id });
    return res.status(200).send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const groupRouter = router;
export default router;
