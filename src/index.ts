import dotenv from 'dotenv';
dotenv.config();
import app from './server';
import db from './db';
var port = process.env.PORT || 8080;

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Successfully started server at port ${port}`);
  });
});
