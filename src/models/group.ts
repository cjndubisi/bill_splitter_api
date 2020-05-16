import db from '../db';
import Sequelize from 'sequelize';

class Group extends Sequelize.Model {}

Group.init(
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
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'group',
  }
);

export const createGroup = async ({ name }: { name: string }) => {
  return await Group.create({ name });
};

export const findBy = async (obj: any) => {
  return await Group.findOne({ where: obj });
};
