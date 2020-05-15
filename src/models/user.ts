import db from '../db';
import Sequelize from 'sequelize';

const User = db.sequelize.define(
  'user',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {}
);

export const createUser = () => {};
export const getUser = () => {};
