const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 创建数据库连接
const conn = mongoose.createConnection('mongodb://localhost:27017/graphql',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true   });

conn.on('open', () => console.log('db connection succeeded.'));
conn.on('error', (error) => console.log(error));

const StoreSchema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state:{ type: String, required: true },
  zip:  { type: String, required: true },
  type: { type: String, required: true }, // store type
  description:  { type: String },
  geo: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      default: undefined,
      required: true
    }
  }
});
StoreSchema.index({geo: '2dsphere'});

const StoreModel = conn.model('Store', StoreSchema);

const PinSchema = new Schema({
  name:  { type: String, required: true },
  city:  { type: String, required: true },
  state: { type: String, required: true },
  zip:  { type: String, required: true },
  lease_type: { type: String, required: true },
  usage_type: { type: String, required: true }, 
  description:  { type: String },
  geo: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      default: undefined,
      required: true,
    }
  }
});
PinSchema.index({geo: '2dsphere'});
const PinModel = conn.model('Pin', PinSchema);

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  description:  { type: String }
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
