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

Bill.belongsTo(User, {
  as: 'Payer',
  foreignKey: {
    name: 'payerId',
    allowNull: false,
  },
  constraints: true,
});
Group.hasMany(Bill, { onDelete: 'cascade' });
// creates table bill_participant for data access; bill.participants()
// TODO: Future Request, Split bill unevenly.
Bill.belongsToMany(User, { through: 'bill_particiants', as: 'participants' });
