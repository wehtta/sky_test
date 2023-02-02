const graphql = require('graphql');
const { StoreModel, FavoredStoreModel, PinModel, FavoredPinModel, UserModel } = require('./model');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
}  = graphql;

// location point, (longitude, latitude)
const Point = new GraphQLObjectType({
  name: 'Point',
  fields: () =>({
    type: {type: GraphQLString},
    coordinates: {type: new GraphQLList(GraphQLFloat)}
  })
});

const FavoredStore = new GraphQLObjectType({
  name: 'FavoredStore',
  fields: () =>({
    store: {type: GraphQLString},
    user: {type: GraphQLString}
  })
});

const FavoredPin = new GraphQLObjectType({
  name: 'FavoredPin',
  fields: () =>({
    pin: {type: GraphQLString},
    user: {type: GraphQLString}
  })
});

const Store = new GraphQLObjectType({
  name: 'Store',
  fields: ()=> ({
    id: { type: GraphQLString},
    name: { type: GraphQLString},
    city: { type: GraphQLString},
    state: { type: GraphQLString},
    zip: { type: GraphQLString},
    type: { type: GraphQLString}, // store 类型
    description: { type: GraphQLString},
    geo: {type: Point},  //地理位置信息
    favoredUsers: {
      type: new GraphQLList(FavoredStore),
      async resolve(parent) {
        const result = await FavoredStoreModel.find({ store: parent.id});
        return result;
      }
    }
  })
});

const Pin = new GraphQLObjectType({
  name: 'Pin',
  fields: ()=> ({
    id: { type: GraphQLString},
    name: { type: GraphQLString},
    city: { type: GraphQLString},
    state: { type: GraphQLString},
    zip: { type: GraphQLString},
    lease_type: { type: GraphQLString}, // lease type
    usage_type: { type: GraphQLString}, // usage_type
    description: { type: GraphQLString},
    geo: {type: Point},  //地理位置信息
    favoredUsers: {
      type: new GraphQLList(FavoredPin),
      async resolve(parent) {
        const result = await FavoredPinModel.find({ pin: parent.id});
        return result;
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getStoreList: {
      type: new GraphQLList(Store),
      args: {
        input: {type: new GraphQLList(GraphQLFloat)}
      }, 
      async resolve(parent, args) {
        const loc = [args.input[0], args.input[1]];
        const radius = args.input[2];

        const result = await StoreModel.find({geo: 
          {$near:
            { $geometry:
              {   
                type: "Point",
                coordinates: loc
              },
              $maxDistance : radius
            }
          }
        });
        return result;
      }
    },
    
    getStore: {
      type: Store,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        const result = await StoreModel.findById(args.id)
        return result
      }
    },
    getPinList: {
      type: new GraphQLList(Pin),
      args: {
        input: {type: new GraphQLList(GraphQLFloat)}
      }, 
      async resolve(parent, args) {
        const loc = [args.input[0], args.input[1]];
        const radius = args.input[2];

        const result = await PinModel.find({geo: 
          {$near:
            { $geometry:
              {   
                type: "Point",
                coordinates: loc
              },
              $maxDistance : radius
            }
          }
        });
        return result;
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    favorStore: {
      type: FavoredStore,
      args: {
        store_id: { type: new GraphQLNonNull(GraphQLString) },
        user_id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args){
        const storeId = args.store_id;
        const userId = args.user_id;

        const result = await FavoredStoreModel.create({store: storeId, user: userId})
        return result;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
