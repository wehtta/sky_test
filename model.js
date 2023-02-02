const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 创建数据库连接
const conn = mongoose.createConnection('mongodb://localhost:27017/graphql',{ useNewUrlParser: true, useUnifiedTopology: true });

conn.on('open', () => console.log('db connection succeeded.'));
conn.on('error', (error) => console.log(error));

const StoreSchema = new Schema({
  name: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  type: 'string', // store type
  description: 'string',
  geo: 'object',
});
const StoreModel = conn.model('Store', StoreSchema);

const PinSchema = new Schema({
  name: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  lease_type: 'string',
  usage_type: 'string', 
  description: 'string',
  geo: 'object',
});
const PinModel = conn.model('Pin', PinSchema);

const userSchema = new Schema({
  firstname: 'string',
  lastname: 'string',
  email: 'string',
  phone:  'string',
  password: 'string',
  organization: 'string',
  description: 'string'
});
const UserModel = conn.model('User', userSchema);

// favored store records
const FavoredStoreSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Favored pin records
const FavoredPinSchema = new Schema({
  pin: {
    type: Schema.Types.ObjectId,
    ref: 'Pin'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const FavoredStoreModel = conn.model('FavoredStore', FavoredStoreSchema);
const FavoredPinModel = conn.model('FavoredPin', FavoredPinSchema);

module.exports = {
  StoreModel,
  PinModel,
  FavoredPinModel,
  FavoredStoreModel,
  UserModel
}
