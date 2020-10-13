import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'mysql2',
  connection: {
    host : 'us-cdbr-east-02.cleardb.com',
    user : 'b4fc740d798815',
    password : '91cced2d',
    database : 'heroku_9e4600faf962f49'
  },
  useNullAsDefault: true,
});

export default db;
