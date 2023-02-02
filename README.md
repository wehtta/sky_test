## 技术栈
- server:  koa2 + graphql + koa-graphql + mongoose

## 数据库部分

通过graphiql演示需要做数据持久化，使用的 `mongodb` 数据库。

地理位置信息，距离比较通过使用mongodb内置的GeoJson相关API实现。

进入当前的工程目录，运行mongo镜像，相关mock数据直接使用data中的数据。

```bash
cd sky_test
docker pull mongo
docker run -p 27017:27017 - v $PWD/data:/data/db mongo

```

## 后端部分

```bash
npm run start
```

访问 **http://localhost:4000/graphql** 看到数据库操作playground界面。可进行相关的query操作

## Query & Mutation
getStoreList
```graphql
{
  getStoreList(input: [101.15, 39.22, 10000]) {
    id,
    name,
    description,
    geo {type, coordinates},
    favoredUsers{user}
  }
}
```

getPinList
```graphql
{
  getPinList(input: [74.25, 40.40, 10000]) {
    id,
    name,
    description,
    geo {type, coordinates}
  }
}
```

FavorStore
```graphql
mutation {
  favorStore(store_id: "63db4c7858c939c210bb1f9b",user_id:"63db47cdf9274abb5edad92f") {
    store
    user
  }
}

```



