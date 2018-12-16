<template>
<div id="app">
    <el-container class="container">
        <el-header class="header">

          <div class="title">失物招领</div>
         
          <el-menu
  :default-active="activeIndex"
  class="el-menu-demo menu"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b" 
  >
  <el-menu-item index="1">首页</el-menu-item>
  <el-menu-item index="2">申请列表</el-menu-item>

</el-menu>


          <div class="userinfo">
            <span class="username" >{{user_id}}</span>
            <el-popover trigger="hover" width="50">
            <div style= "text-align: center">
  <el-button type="text" @click="centerDialogVisible = true" >
    <div v-if="user_id==0">登陆</div><div v-else>注销</div>
  </el-button>
            </div>
            <img src="./img/avatar.png" class="avatar" slot="reference">
            </el-popover>
          </div>

          <div class="search">
            <i class="el-icon-search"></i>
          </div>

      </el-header>
        <el-main class="main" v-if="activeIndex==1">
          <el-row >
            <el-col :span="6"><div class="nav"><el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree></div></el-col>
            <el-col :span="18">
              <div class="list">
                <ul>


  <div v-if="items.length">
<el-container v-for="(item,index) in items" :key="item.id" class="listitem" >
  <el-aside width="150px">
    <!--v-bind="{src:item.link}"-->
    <img class="img" src="./img/avatar.png"></el-aside>
  <el-container>
    <el-header ><h1 class="name">{{item.item_name}}</h1></el-header>
    <el-main class="description"><div class="txt">{{ item.item_description }}</div>
    <div class="button">
    <el-button v-if="item.status==0" style="color:#2c3e50" @click="askfor_click(index)">认领</el-button>
    <el-button v-else disabled>已认领</el-button>
    </div>
    </el-main>
  </el-container>
  <el-dialog
  title="公告信息"
  :visible.sync="noticeDialogVisible"
  width="30%"
  center>
  <div v-if="cur_item_id!=notice_infomation.item_id">
    <i class="el-icon-loading"></i><div>获取物品信息中...</div>
    </div><div v-else>
  <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
  <div>物品名称：{{notice_infomation.item_name}}</div>
  <div>物品描述：{{notice_infomation.item_info}}</div>
  <div>丢失位置：{{notice_infomation.lost_location}}</div>
  <div>发布时间：{{notice_infomation.time}}</div>
      <el-button type="primary" @click="askfor(index)">认领</el-button>
    <el-button @click="noticeDialogVisible=false">取消</el-button></div>
</el-dialog>
</el-container>
  </div><div v-else><el-button @click="updateList" >更新列表
  </el-button></div>
    
</ul>
              </div>
            </el-col>
          </el-row>
        </el-main><el-main v-else-if="activeIndex==2" class="main"></el-main>

<el-dialog
  title="登陆"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="用户名">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="login">登陆</el-button>
    <el-button @click="centerDialogVisible=false">取消</el-button>
  </el-form-item>
  </el-form>
</el-dialog>



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
    background: #545c64;
    line-height: 60px;
    height: 60px;
    padding: 0px;
  }
  .container .header .title{
      float: left;
      color: #ffffff;
      font-size: 22px;
      height: 60px;
      width: 230px;
          border-right-width: 2px;
    border-right-style: solid;
    border-color: #e6fffd;
  }
    .container .header .menu{
      float: left;
      height: 60px;
      width: auto;
      margin-left: 20px;
  }
    .container .header .search{
      float: right;
      color: #ffffff;
      font-size: 22px;
      height: 60px;
      padding-right: 20px;
  }
    .container .header .userinfo{
      float: right;
      color: #ffffff;
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
        margin-top: 30px;
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
      //{notice_id:1, item_name: '手机', status: 1,item_id:0 },
      //      {notice_id:2, item_name: '不知道啥玩意儿', status: 0,item_id:1 },
        ],
        ws: null,
        centerDialogVisible: false,
        noticeDialogVisible:false,
        form: {
          type:1,
          username: '',
          password: '',
        },
        user_id:0,
        notice_infomation:{
          item_name:'bzd',
          time:"2018-8-8",
          item_info:"xxxx",
          lost_location:"test",
          item_id:0
        },
        cur_item_id:-1,
        activeIndex: '1'
      }
    },
    
    created(){
      this.initWS();
    },
    destroyed:function(){
      this.closeWS();
    },
    methods: {
      handleNodeClick(data) {
        // eslint-disable-next-line
        console.log(data);
      },handleSelect(key) {
        this.activeIndex=key;
      },
      notification(msg){
          this.$notify({
          title: '消息',
          message: msg,
        });
      },
      initWS(){
        if(this.ws==null|| this.ws.readyState!=WebSocket.OPEN){
          this.ws=new WebSocket("ws://118.25.27.241:9981");
        }
        this.ws.onopen=this.ws_onopen;
        this.ws.onerror=this.ws_onerror;
        this.ws.onmessage=this.ws_onmessage;
        this.ws.onclose=this.ws_onclose;
      },
      closeWS(){
        this.ws_onclose();
      },
      ws_onopen(){
        this.$notify({
          title: '成功',
          message: '连接已建立',
          type:'success'
        });
      },
      ws_onerror(){
        this.$notify.error({
          title: '错误',
          message: '连接发生错误',
        });
      },
      ws_onmessage(e){
        this.$notify({
          title: '收到消息',
          message: e.data,
        });
        var result=JSON.parse(e.data)
        if(result.type == 1){
          if(result.code == 1) {
            this.notification("登陆成功: user_id "+result.user_id)
            this.centerDialogVisible=false
            this.user_id=result.user_id
            this.$message({
          message: '登陆成功',
          type: 'success'
        });
          }else{
            this.notification("登陆失败: "+result.content)
             this.$message.error(result.content);
          }
        }else if(result.type==3){
          if(result.code==11){
            this.cur_item_id=result.item_id
            this.notice_information={}
            this.notice_infomation["item_id"]=result.item_id
            this.notice_infomation["item_name"]=result.item_name
            this.notice_infomation["item_info"]=result.item_info
            this.notice_infomation["lost_location"]=result.lost_location
            this.notice_infomation["time"]="2018-8-8"
          }
        }
        else if(result.type==11){
          if(result.code==12){
            this.items = []
            for(var i=0;i<result.notice_info.length;i++){
              var obj=result.notice_info[i]
              var tmp={}
              tmp["notice_id"]=obj[0]
              tmp["item_name"]=obj[1]
              tmp["status"]=obj[2]
              tmp["item_id"]=obj[3]
              this.items.push(tmp)
            }
          }else if(result.code==13){
            this.$message({
              message:'已发起申请',
              type:'success'
            });
            this.noticeDialogVisible=false
          }
        }
      },
      ws_onclose(){
        this.$notify.error({
          title: '错误',
          message: '连接关闭',
        });
      },login(){
        var content = JSON.stringify(this.form,null,0)
        this.ws.send(content)
        this.$notify({
          title: '发送消息',
          message: content,
        });
      },updateList(){
        var request={'type':11, 'code':2,};
        this.ws.send(JSON.stringify(request,null,0))
        this.$notify({
          title: '发送消息',
          message: JSON.stringify(request,null,0),
          duration: 0
        });
      },askfor(index){
        var notice_id=this.items[index]["notice_id"]
        var request={
          'type':11,
          'code':3,
          'notice_id':notice_id
        }
        this.ws.send(JSON.stringify(request,null,0))
      },askfor_click(index){
        this.noticeDialogVisible=true
        var tmp=this.items[index]
        var request={
          'type':3,
          'code':1,
          'item_id': tmp["item_id"]
        }
        this.ws.send(JSON.stringify(request,null,0))

      }
    }
};

</script>