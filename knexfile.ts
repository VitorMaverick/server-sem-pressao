import path from 'path';

module.exports = {
    client: 'mysql2',
  connection: {
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'myapp_test'
  },

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,
};