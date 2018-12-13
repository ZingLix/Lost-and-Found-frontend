<template>
<div id="app">
    <el-container class="container">
        <el-header class="header">
          <div class="title">失物招领</div>
          <div class="userinfo">
            <span class="username">username</span>
            <img src="./img/avatar.png" class="avatar">
          </div>
          <div class="search">
            <i class="el-icon-search"></i>
          </div>
        </el-header>
        <el-main class="main">
          <el-row >

            <el-col :span="6"><div class="nav"><el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree></div></el-col>
            <el-col :span="18">
              <div class="list">
                <ul>


<el-container v-for="item in items" :key="item.id" class="listitem">
  <el-aside width="150px"><img v-bind="{src:item.link}"  class="img"></el-aside>
  <el-container>
    <el-header ><h1 class="name">{{item.item_name}}</h1></el-header>
    <el-main class="description"><div class="txt">{{ item.item_description }}</div><el-button class="button">认领</el-button>

    </el-main>
  </el-container>
</el-container>

    
</ul>
              </div>
            </el-col>
          </el-row>
        </el-main>
    </el-container>

</div>
</template>>
  

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
  padding: 0px;
 }

  .container .header{
    background: #fff;
    line-height: 60px;
    height: 60px;
    padding: 0px;
  }
  .container .header .title{
      float: left;
      color: rgb(0, 140, 255);
      font-size: 22px;
      height: 60px;
      width: 230px;
          border-right-width: 1px;
    border-right-style: solid;
    border-color: #e6fffd;
  }
    .container .header .search{
      float: right;
      color: rgb(0, 0, 0);
      font-size: 22px;
      height: 60px;
      padding-right: 20px;
  }
    .container .header .userinfo{
      float: right;
      color: rgb(0, 0, 0);
      font-size: 22px;
      height: 60px;
      padding-right: 20px;
  }
  .container .header .userinfo .avatar{
      float: right;
      color: #fff;
      height: 40px;
      width: 40px;
      border-radius: 20px;
      margin: 10px 0 10px 10px;
  }
  .el-main {
    background-color: rgb(255, 255, 255);
    color: rgb(255, 255, 255);
    align-self: center;
    width: 1140px;

  }

  .container .main{
        padding: 0 0 0 0 ;

  }
  .container .main .nav{
    width: 100%;
    background: #2c3e50;

  }
  .container .main .list{
    overflow: hidden;
    color:#2c3e50;

  }
  .container .main .list .listitem{
    padding-bottom: 10px;
    border-bottom: 1px;
    border-bottom: #2c3e50;
    border-bottom-style: solid;
  }
    .container .main .list ul{
    margin: 0px;
    padding: 0px;

  }
  .container .main .list .name{
    font-size: 22px;
    float: left;
    width: auto;
  }
  .container .main .list .img{
    height: 120px;
  }
  .container .main .list .description{
    color:#2c3e50;
    width: 100%;
  }
  .container .main .list .description .txt{
    float: left;
    color:#2c3e50;
  }
    .container .main .list .description .button{
    float: right;;
    color:#2c3e50;
  }
</style>
<script >
  export default {
    data() {
      return {
        data: [
          {
          label: '类别',
          children: [{
            label: '手机',
            }]
          },
          {
          label: '地点',
          children: [{
            label: '学校',
            children: [{
              label: '华理'
            },{
              label: '其他'
            }]
          }, {
            label: '地铁',
            children: [{
              label: '1 号线'
            },{
              label: '2 号线'
            }]
          }]
        }, {
          label: '时间',
          children: [{
            label: '一周内',
          }, {
            label: '一月内',
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        items: [
      {id:1,link:"./img/avatar.3c2e934b.png", item_name: '手机',item_description:'111' },
      {id:2,link:"./img/avatar.3c2e934b.png", item_name: '学生证',item_description:'222' }
        ]
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
};
var ws = new WebSocket("ws://118.25.27.241:9981");
console.log(ws.readyState); 
ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};
</script>