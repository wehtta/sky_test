const Koa = require('koa');
// const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');
const Router = require('koa-router');
const cors = require('koa2-cors'); // 解决跨域
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const jwt = require('jwt-simple');

const myGraphQLSchema = require('./schema');

const app = new Koa();
const router = new Router();
const PORT = 4000;

app.use(logger());
app.use(bodyparser());

app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true // 允许跨域 携带cookie
}));


// app.use(mount('/graphql', graphqlHTTP({
//   schema: myGraphQLSchema,
//   graphiql: true // 开启graphiql可视化操作ide
// })));

router.all('/graphql', graphqlHTTP({
  schema: myGraphQLSchema,
  graphiql: true
}));

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`)
});
