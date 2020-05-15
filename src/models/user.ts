import db from '../db';
import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Sequelize.Model {}
User.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: 'user',
  }
);
interface IUser {
  name: string;
  password: string;
}

export const createUser = async ({ name, password }: IUser) => {
  const hash = await bcrypt.hash(password, 10);
  return await User.create({ name, hash });
};
export const findBy = async (obj: any) => {
  return await User.findOne({ where: obj });
};
