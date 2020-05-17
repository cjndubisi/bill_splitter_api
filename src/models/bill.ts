import db from '../db';
import Sequelize from 'sequelize';
import User from './user';
import Group from './group';

export type BillAttributes = {
  setPayer: (payer: any) => Promise<any>;
  setParticipants: (users: any[]) => Promise<any>;
};

export default class Bill extends Sequelize.Model {
  id!: number;
}
Bill.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.REAL,
      allowNull: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'bill',
  }
);
export class Participant extends Sequelize.Model {}
Participant.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'participant',
  }
);
// creates bill.payerId
Bill.belongsTo(User, { as: 'Payer', foreignKey: 'payerId', constraints: true });
Bill.belongsTo(Group, { constraints: true });
// creates table bill_participant for data access; bill.participants()
// TODO: Future Request, Split bill unevenly.

Bill.hasMany(Participant);
Bill.belongsToMany(User, { through: { model: Participant, unique: false } });
Bill.belongsToMany(Group, { through: { model: Participant, unique: false } });
