import path from 'path';

module.exports = {
    client: 'mysql2',
    connection: {
        host : 'us-cdbr-east-02.cleardb.com',
        user : 'b4fc740d798815',
        password : '91cced2d',
        database : 'heroku_9e4600faf962f49'
      },

    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,
};