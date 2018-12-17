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
          <el-menu-item index="2">我发起的公告</el-menu-item>
          <el-menu-item index="3">我认领的物品</el-menu-item>
        </el-menu>

        <div class="userinfo">
          <span class="username">{{user_id}}</span>
          <el-popover trigger="hover" width="50">
            <div style="text-align: center">
              <el-button type="text" @click="centerDialogVisible = true">
                <div v-if="user_id==0">登陆</div>
                <div v-else>注销</div>
              </el-button>
            </div>
            <img src="./img/avatar.png" class="avatar" slot="reference">
          </el-popover>
        </div>

        <div class="search">
          <i class="el-icon-search"></i>
        </div>
        <el-button
          type="primary"
          style="float: right;padding:22px;margin-right :20px"
          @click="addnoticeDialogVisible=true"
        >添加公告</el-button>
        <el-dialog title="添加公告" :visible.sync="addnoticeDialogVisible" width="30%" center>
          <el-form ref="form" :model="add_notice_info" label-width="80px">
            <el-form-item label="物品名称">
              <el-input v-model="add_notice_info.item_name"></el-input>
            </el-form-item>
            <el-form-item label="物品描述">
              <el-input v-model="add_notice_info.item_info"></el-input>
            </el-form-item>
            <el-form-item label="丢失位置">
              <el-input v-model="add_notice_info.lost_location"></el-input>
            </el-form-item>
            <el-button type="primary" @click="add_notice">提交</el-button>
            <el-button @click="addnoticeDialogVisible=false">取消</el-button>
          </el-form>
        </el-dialog>
      </el-header>

      <el-main class="main" v-if="activeIndex==1">
        <el-row>
          <el-col :span="6">
            <div class="nav">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="list">
              <ul>
                <div v-if="notice.length">
                  <el-container v-for="(item,index) in notice" :key="item.id" class="listitem">
                    <el-aside width="150px">
                      <!--v-bind="{src:item.link}"-->
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container>
                      <el-header>
                        <h1 class="name">{{item.item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt">{{ item.item_description }}</div>
                        <div class="button">
                          <el-button
                            v-if="item.status==0"
                            style="color:#2c3e50"
                            @click="askfor_click(index)"
                          >认领</el-button>
                          <el-button v-else disabled>已认领</el-button>
                        </div>
                      </el-main>
                    </el-container>
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateList">更新列表</el-button>
                </div>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-main v-else-if="activeIndex==2" class="main">
        <el-row>
          <el-col :span="6">
            <div class="nav">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="list">
              <ul>
                <div v-if="application.length">
                  <el-container v-for="(item,index) in application" :key="item.id" class="listitem">
                    <el-aside width="150px">
                      <!--v-bind="{src:item.link}"-->
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container>
                      <el-header>
                        <h1 class="name">{{item.item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt" v-if="item.status==0">申请中...</div>
                        <div class="txt" v-else-if="item.status==1">已接受</div>
                        <div class="txt" v-else-if="item.status==2">被拒绝</div>
                        <div class="txt" v-else-if="item.status==3">公告被取消</div>
                        <div class="txt" v-else-if="item.status==4">申请已过期</div>
                        <div class="txt" v-if="user_id==item.applicant_id">申请的</div>
                        <div class="txt" v-else>发起的</div>
                        <div class="button">
                          <el-button @click="application_click(index)">查看</el-button>
                        </div>
                      </el-main>
                    </el-container>
                    <el-dialog
                      title="申请信息"
                      :visible.sync="applicationDialogVisible"
                      width="30%"
                      center
                    >
                      <div v-if="cur_item_id!=notice_infomation.item_id">
                        <i class="el-icon-loading"></i>
                        <div>获取申请信息中...</div>
                      </div>
                      <div v-else>
                        <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
                        <div>物品名称：{{notice_infomation.item_name}}</div>
                        <div>物品描述：{{notice_infomation.item_info}}</div>
                        <div>丢失位置：{{notice_infomation.lost_location}}</div>
                        <div>发布时间：{{notice_infomation.time}}</div>
                        <el-button type="primary" @click="askfor(index)">xxx</el-button>
                        <el-button @click="applicationDialogVisible=false">取消</el-button>
                      </div>
                    </el-dialog>
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateApplication">更新列表</el-button>
                </div>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-main v-else-if="activeIndex==3" class="main">
        <el-row>
          <el-col :span="6">
            <div class="nav">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="list">
              <ul>
                <div v-if="claim.length">
                  <el-container v-for="(item,index) in claim" :key="item.id" class="listitem">
                    <el-aside width="150px">
                      <!--v-bind="{src:item.link}"-->
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container>
                      <el-header>
                        <h1 class="name">{{item.item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt" v-if="item.status==0">申请中...</div>
                        <div class="txt" v-else-if="item.status==1">已接受</div>
                        <div class="txt" v-else-if="item.status==2">被拒绝</div>
                        <div class="txt" v-else-if="item.status==3">公告被取消</div>
                        <div class="txt" v-else-if="item.status==4">申请已过期</div>
                        <div class="txt" v-if="user_id==item.applicant_id">申请的</div>
                        <div class="txt" v-else>发起的</div>
                        <div class="button">
                          <el-button @click="claimDialogVisible=true">查看</el-button>
                        </div>
                      </el-main>
                    </el-container>
                    <el-dialog title="认领信息" :visible.sync="claimDialogVisible" width="30%" center>
                      <div v-if="cur_claim_id!=claim.item_id">
                        <i class="el-icon-loading"></i>
                        <div>获取认领信息中...</div>
                      </div>
                      <div v-else>
                        <el-steps :space="200" :active="1" finish-status="success">
                          <el-step title="已完成"></el-step>
                          <el-step title="进行中"></el-step>
                          <el-step title="步骤 3"></el-step>
                        </el-steps>
                        <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
                        <div>物品名称：{{notice_infomation.item_name}}</div>
                        <div>物品描述：{{notice_infomation.item_info}}</div>
                        <div>丢失位置：{{notice_infomation.lost_location}}</div>
                        <div>发布时间：{{notice_infomation.time}}</div>
                        <el-button type="primary" @click="askfor(index)">xxx</el-button>
                        <el-button @click="claimDialogVisible=false">取消</el-button>
                      </div>
                    </el-dialog>
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateApplication">更新列表</el-button>
                </div>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <el-dialog title="登陆" :visible.sync="centerDialogVisible" width="30%" center>
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
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
  padding: 0px;
}

.container .header {
  background: #545c64;
  line-height: 60px;
  height: 60px;
  padding: 0px;
}
.container .header .title {
  float: left;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  width: 230px;
  border-right-width: 2px;
  border-right-style: solid;
  border-color: #e6fffd;
}
.container .header .menu {
  float: left;
  height: 60px;
  width: auto;
  margin-left: 20px;
}
.container .header .search {
  float: right;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo {
  float: right;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo .avatar {
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

.container .main {
  padding: 0 0 0 0;
  margin-top: 30px;
}
.container .main .nav {
  width: 100%;
  background: #2c3e50;
}
.container .main .list {
  overflow: hidden;
  color: #2c3e50;
}
.container .main .list .listitem {
  padding-bottom: 10px;
  border-bottom: 1px;
  border-bottom: #2c3e50;
  border-bottom-style: solid;
}
.container .main .list ul {
  margin: 0px;
  padding: 0px;
}
.container .main .list .name {
  font-size: 22px;
  float: left;
  width: auto;
}
.container .main .list .img {
  height: 120px;
}
.container .main .list .description {
  color: #2c3e50;
  width: 100%;
}
.container .main .list .description .txt {
  float: left;
  color: #2c3e50;
}
.container .main .list .description .button {
  float: right;
}
</style>
<script >
export default {
  data() {
    return {
      data: [
        {
          label: "类别",
          children: [
            {
              label: "手机"
            }
          ]
        },
        {
          label: "地点",
          children: [
            {
              label: "学校",
              children: [
                {
                  label: "华理"
                },
                {
                  label: "其他"
                }
              ]
            },
            {
              label: "地铁",
              children: [
                {
                  label: "1 号线"
                },
                {
                  label: "2 号线"
                }
              ]
            }
          ]
        },
        {
          label: "时间",
          children: [
            {
              label: "一周内"
            },
            {
              label: "一月内"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      notice: [
        { notice_id: 1, item_name: "手机", status: 0, item_id: 0 }
        //      {notice_id:2, item_name: '不知道啥玩意儿', status: 0,item_id:1 },
      ],
      application: [
        {
          application_seq: 0,
          applicant_id: 1,
          notice_id: 2,
          status: 0,
          item_id: 2,
          item_name: "asdf"
        }
      ],
      claim: [
        {
          application_seq: 0,
          applicant_id: 1,
          notice_id: 2,
          status: 0,
          item_id: 2,
          item_name: "hrth"
        }
      ],
      ws: null,
      centerDialogVisible: false,
      noticeDialogVisible: false,
      applicationDialogVisible: false,
      addnoticeDialogVisible: false,
      claimDialogVisible: false,
      form: {
        type: 1,
        username: "",
        password: ""
      },
      user_id: 0,
      notice_infomation: {
        item_name: "bzd",
        time: "2018-8-8",
        item_info: "xxxx",
        lost_location: "test",
        item_id: 0
      },
      add_notice_info: {
        item_name: "",
        item_info: "",
        lost_location: ""
      },
      cur_item_id: -1,
      cur_application_id: -1,
      cur_notice_id: -1,
      activeIndex: "1"
    };
  },

  created() {
    this.initWS();
  },
  destroyed: function() {
    this.closeWS();
  },
  methods: {
    handleNodeClick(data) {
      // eslint-disable-next-line
      console.log(data);
    },
    handleSelect(key) {
      this.activeIndex = key;
      if (key == 1) {
        this.updateList();
      } else if (key == 2) {
        this.updateApplication();
      }
    },
    notification(msg) {
      this.$notify({
        title: "消息",
        message: msg,
        offset: 100
      });
    },
    initWS() {
      if (this.ws == null || this.ws.readyState != WebSocket.OPEN) {
        this.ws = new WebSocket("ws://118.25.27.241:9981");
      }
      this.ws.onopen = this.ws_onopen;
      this.ws.onerror = this.ws_onerror;
      this.ws.onmessage = this.ws_onmessage;
      this.ws.onclose = this.ws_onclose;
    },
    closeWS() {
      this.ws_onclose();
    },
    ws_onopen() {
      this.$notify({
        title: "成功",
        message: "连接已建立",
        type: "success",
        offset: 100
      });
    },
    ws_onerror() {
      this.$notify.error({
        title: "错误",
        message: "连接发生错误",
        offset: 100
      });
    },
    ws_onmessage(e) {
      this.$notify({
        title: "收到消息",
        message: e.data
      });
      var result = JSON.parse(e.data);
      if (result.type == 1) {
        if (result.code == 1) {
          this.notification("登陆成功: user_id " + result.user_id);
          this.centerDialogVisible = false;
          this.user_id = result.user_id;
          this.$message({
            message: "登陆成功",
            type: "success"
          });
        } else {
          this.notification("登陆失败: " + result.content);
          this.$message.error(result.content);
        }
      } else if (result.type == 3) {
        if (result.code == 11) {
          this.cur_item_id = result.item_id;
          this.notice_information = {};
          this.notice_infomation["item_id"] = result.item_id;
          this.notice_infomation["item_name"] = result.item_name;
          this.notice_infomation["item_info"] = result.item_info;
          this.notice_infomation["lost_location"] = result.lost_location;
          this.notice_infomation["time"] = "2018-8-8";
        }
      } else if (result.type == 11) {
        if (result.code == 11) {
          this.addnoticeDialogVisible = false;
          this.$message({
            message: "发布成功",
            type: "success"
          });
        } else if (result.code == 12) {
          this.notice = [];
          for (var i1 = 0; i1 < result.notice_info.length; i1++) {
            var obj1 = result.notice_info[i1];
            var tmp1 = {};
            tmp1["notice_id"] = obj1[0];
            tmp1["item_name"] = obj1[1];
            tmp1["status"] = obj1[2];
            tmp1["item_id"] = obj1[3];
            this.notice.push(tmp1);
          }
        } else if (result.code == 13) {
          this.$message({
            message: "已发起申请",
            type: "success",
            offset: 100
          });
          this.noticeDialogVisible = false;
        } else if (result.code == 14) {
          this.application = [];
          for (var i = 0; i < result.application_info.length; i++) {
            var obj = result.application_info[i];
            var tmp = {};
            tmp["application_seq"] = obj[0];
            tmp["applicant_id"] = obj[1];
            tmp["notice_id"] = obj[2];
            tmp["status"] = obj[3];
            tmp["item_id"] = obj[4];
            tmp["item_name"] = obj[5];
            this.application.push(tmp);
          }
        }
      }
    },
    ws_onclose() {
      this.$notify.error({
        title: "错误",
        message: "连接关闭",
        offset: 100
      });
    },
    login() {
      var content = JSON.stringify(this.form, null, 0);
      this.ws.send(content);
      this.$notify({
        title: "发送消息",
        message: content,
        offset: 100
      });
    },
    updateList() {
      var request = { type: 11, code: 2 };
      this.ws.send(JSON.stringify(request, null, 0));
      this.$notify({
        title: "发送消息",
        message: JSON.stringify(request, null, 0),
        offset: 100
      });
    },
    updateApplication() {
      var request = { type: 11, code: 4 };
      this.ws.send(JSON.stringify(request, null, 0));
      this.$notify({
        title: "发送消息",
        message: JSON.stringify(request, null, 0),
        offset: 100
      });
    },
    askfor() {
      var request = {
        type: 11,
        code: 3,
        notice_id: this.cur_notice_id
      };
      this.ws.send(JSON.stringify(request, null, 0));
    },
    askfor_click(index) {
      this.noticeDialogVisible = true;
      var tmp = this.notice[index];
      console.log(index);
      this.cur_notice_id = tmp["notice_id"];
      var request = {
        type: 3,
        code: 1,
        item_id: tmp["item_id"]
      };
      this.ws.send(JSON.stringify(request, null, 0));
    },
    application_click(index) {
      this.applicationDialogVisible = true;
      var tmp = this.application[index];
      var request = {
        type: 3,
        code: 1,
        item_id: tmp["item_id"]
      };
      this.ws.send(JSON.stringify(request, null, 0));
    },
    add_notice() {
      var request = {
        type: 11,
        code: 1,
        item_name: this.add_notice_info.item_name,
        item_info: this.add_notice_info.item_info,
        lost_location: this.add_notice_info.lost_location
      };
      this.ws.send(JSON.stringify(request, null, 0));
    }
  }
};
</script>