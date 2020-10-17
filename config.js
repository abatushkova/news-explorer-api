const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const mongoDB = 'mongodb://localhost:27017/mydb';

module.exports = {
  JWT_SECRET,
  mongoDB,
};
