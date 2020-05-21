import { Router } from 'express';
import Group, { findBy, deleteGroup, findAll } from '../models/group';
import User, {
  createUser,
  UserAttributes,
  findBy as findUserBy,
} from '../models/user';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const user: any = req.user;
    const group: any = await user.createGroup({
      name: req.body.name,
      creator: user.id,
    });
    return res.status(201).send(group);
  } catch (error) {
    console.log(error);

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

router.get('/', async (req, res) => {
  try {
    const user: UserAttributes = req.user as UserAttributes;
    const groups = await user.getGroups({ include: [{ all: true }] });
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post('/:id/users', async ({ params, body }, res) => {
  try {
    const group: any = await Group.findOne({
      where: { id: params.id },
      include: [{ all: true }],
    });
    // check for existing user with email
    let user = await findUserBy({ email: body.email });

    if (!user) {
      // invite user
      const userToAdd = body;
      userToAdd.activated = false;
      userToAdd.password = 'invalidatePassword';

      user = await createUser(userToAdd);
    }
    await group.addUsers(user);
    await group.reload();
    return res.status(201).json(group);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const groupRouter = router;
export default router;
