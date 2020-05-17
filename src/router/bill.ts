import { Router } from 'express';
import User, { UserAttributes } from '../models/user';
import Bill, { BillAttributes } from '../models/bill';
import { findBy } from '../models/group';
const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, groupId, payerId, amount, otherUsers } = req.body;
    const groups = await (req.user as UserAttributes).getGroups();
    const toGroup = groups.find((group) => group.id === groupId);
    let participants =
      otherUsers || (await toGroup.getUsers()).map((user: User) => user.id);

    const billInfo = {
      name,
      amount,
      groupId,
      payerId,
    };
    const bill = (await Bill.create(billInfo)) as Bill & BillAttributes;
    await bill.setParticipants(participants);
    await bill.reload({ include: [{ all: true }] });

    return res.status(201).json(bill);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {});

router.get('/:id', async (req, res) => {});

export const billRouter = router;
export default router;
