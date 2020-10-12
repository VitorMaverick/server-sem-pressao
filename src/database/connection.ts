import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'mysql2',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'myapp_test'
  },
  useNullAsDefault: true,
});

export default db;
