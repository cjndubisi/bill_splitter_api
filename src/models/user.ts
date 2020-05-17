import db from '../db';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import Group from './group';

export default class User extends Sequelize.Model {
  id!: number;
  name!: string;
  password!: string;
  email!: string;
  activated!: boolean;

  verifyPassword = async (password: string) => {
    return await bcrypt.compare(password, this.password);
  };
}
User.init(
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 4,
      },
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'user',
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);
User.belongsToMany(Group, { through: 'usergroups', onDelete: 'cascade' });
Group.belongsToMany(User, { through: 'usergroups', onDelete: 'cascade' });

interface IUser {
  name: string;
  email: string;
  password: string;
}

export const createUser = async ({ name, email, password }: IUser) => {
  const hash = await bcrypt.hash(password, 10);
  return await User.create({ name, email, password: hash });
};
export const findBy = async (obj: any) => {
  return await User.findOne({ where: obj });
};
