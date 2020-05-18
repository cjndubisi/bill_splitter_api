import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.PG_URL,
  {
    logging: process.env.NODE_ENV === 'development',
  }
);
export default {
  sequelize,
};
