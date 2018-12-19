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
              <el-button type="text" @click="loginDialogVisible = true">
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
                <div v-if="notice_list.length">
                  <el-container
                    v-for="(notice_id,index) in notice_list"
                    :key="notice_id"
                    class="listitem"
                  >
                    <el-aside width="150px">
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container
                      v-loading="(notice[notice_id]=={})||(item[notice[notice_id].item_id]=={})"
                    >
                      <el-header>
                        <h1 class="name">{{item[notice[notice_id].item_id].item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt">{{item[notice[notice_id].item_id].item_info }}描述</div>
                        <div class="button">
                          <el-button
                            v-if="notice[notice_id].status==0"
                            style="color:#2c3e50"
                            @click="notice_dialog_open(index)"
                          >认领</el-button>
                          <el-button v-else-if="notice[notice_id].status==1" disabled>已认领</el-button>
                          <el-button v-else-if="notice[notice_id].status==3" disabled>被取消</el-button>
                          <el-button v-else-if="notice[notice_id].status==4" disabled>过期</el-button>
                          <el-button v-else disabled>未知状态</el-button>
                        </div>
                      </el-main>
                    </el-container>
                    <!-- <el-container v-else>
                      <div v-loading="true"></div>
                    </el-container>-->
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateNoticeList">更新列表</el-button>
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
                <div v-if="my_notice_list.length">
                  <el-container
                    v-for="(notice_id,index) in my_notice_list"
                    :key="notice_id"
                    class="listitem"
                  >
                    <el-aside width="150px">
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container>
                      <el-header>
                        <h1 class="name">{{item[notice[notice_id].item_id].item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt" v-if="notice[notice_id].status==0">申请中...</div>
                        <div class="txt" v-else-if="notice[notice_id].status==1">已接受</div>
                        <div class="txt" v-else-if="notice[notice_id].status==3">公告被取消</div>
                        <div class="txt" v-else-if="notice[notice_id].status==4">申请已过期</div>
                        <div class="txt" v-else>未知状态</div>
                        <div class="button">
                          <el-button @click="my_notice_dialog_open(index)">查看</el-button>
                        </div>
                      </el-main>
                    </el-container>
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateMyNoticeList">更新列表</el-button>
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
                <div v-if="my_application_list.length">
                  <el-container
                    v-for="(app_seq,index) in my_application_list"
                    :key="app_seq"
                    class="listitem"
                  >
                    <el-aside width="150px">
                      <img class="img" src="./img/avatar.png">
                    </el-aside>
                    <el-container>
                      <el-header>
                        <h1
                          class="name"
                        >{{item[notice[application[app_seq].notice_id].item_id].item_name}}</h1>
                      </el-header>
                      <el-main class="description">
                        <div class="txt" v-if="application[app_seq].status==0">申请中...</div>
                        <div class="txt" v-else-if="application[app_seq].status==1">已接受</div>
                        <div class="txt" v-else-if="application[app_seq].status==2">被拒绝</div>
                        <div class="txt" v-else-if="application[app_seq].status==3">公告被取消</div>
                        <div class="txt" v-else-if="application[app_seq].status==4">申请已过期</div>
                        <div class="button">
                          <el-button @click="my_applicationDialogVisible=true">查看</el-button>
                        </div>
                      </el-main>
                    </el-container>
                  </el-container>
                </div>
                <div v-else>
                  <el-button @click="updateApplicationList">更新列表</el-button>
                </div>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <el-dialog title="登陆" :visible.sync="loginDialogVisible" width="30%" center>
        <el-form ref="form" :model="login_form" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="login_form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="login_form.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button @click="loginDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog title="添加公告" :visible.sync="addnoticeDialogVisible" width="30%" center>
        <el-form ref="form" :model="add_notice_form" label-width="80px">
          <el-form-item label="物品名称">
            <el-input v-model="add_notice_form.item_name"></el-input>
          </el-form-item>
          <el-form-item label="物品描述">
            <el-input v-model="add_notice_form.item_info"></el-input>
          </el-form-item>
          <el-form-item label="丢失位置">
            <el-input v-model="add_notice_form.lost_location"></el-input>
          </el-form-item>
          <el-button type="primary" @click="add_notice">提交</el-button>
          <el-button @click="addnoticeDialogVisible=false">取消</el-button>
        </el-form>
      </el-dialog>

      <el-dialog title="公告信息" :visible.sync="noticeDialogVisible" width="30%" center>
        <div
          v-loading="!item.hasOwnProperty(notice[cur_my_notice_id].item_id)"
          element-loading-text="获取申请信息中..."
        >
          <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
          <div>物品名称：{{item[notice[cur_notice_id].item_id].item_name}}</div>
          <div>物品描述：{{item[notice[cur_notice_id].item_id].item_info}}</div>
          <div>丢失位置：{{item[notice[cur_notice_id].item_id].lost_location}}</div>
          <div>发布时间：{{notice[cur_notice_id].time}}</div>
          <el-button type="primary" @click="claim(index)">认领</el-button>
          <el-button @click="noticeDialogVisible=false">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="申请信息" :visible.sync="my_noticeDialogVisible" width="30%" center>
        <div
          v-loading="!item.hasOwnProperty(notice[cur_my_notice_id].item_id)"
          element-loading-text="获取申请信息中..."
        >
          <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
          <div>物品名称：{{item[notice[cur_my_notice_id].item_id].item_name}}</div>
          <div>物品描述：{{item[notice[cur_my_notice_id].item_id].item_info}}</div>
          <div>丢失位置：{{item[notice[cur_my_notice_id].item_id].lost_location}}</div>
          <div>发布时间：{{notice[cur_my_notice_id].time}}</div>
          <el-button type="primary" @click="claim(index)">xxx</el-button>
          <el-button @click="my_noticeDialogVisible=false">取消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="认领信息" :visible.sync="my_applicationDialogVisible" width="30%" center>
        <div
          v-loading="!item.hasOwnProperty(notice[application[cur_my_application_id].notice_id].item_id)"
          element-loading-text="获取认领信息中..."
        >
          <el-steps :space="200" :active="1" finish-status="success">
            <el-step title="已完成"></el-step>
            <el-step title="进行中"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
          <img class="img" style="width:100px;height:100px" src="./img/avatar.png">
          <div>物品名称：{{item[notice[application[cur_my_application_id].notice_id].item_id].item_name}}</div>
          <div>物品描述：{{item[notice[application[cur_my_application_id].notice_id].item_id].item_info}}</div>
          <div>丢失位置：{{item[notice[application[cur_my_application_id].notice_id].item_id].lost_location}}</div>
          <div>发布时间：{{notice[application[cur_my_application_id].notice_id].time}}</div>
          <el-button type="primary" @click="askfor(index)">xxx</el-button>
          <el-button @click="my_applicationDialogVisible=false">取消</el-button>
        </div>
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
      notice: {
        1: {
          finder_id: 2,
          status: 0,
          item_id: 1,
          contact_id: 2,
          time: "2018-8-8"
        }
      },
      application: {
        1: {
          applicant_id: 1,
          notice_id: 1,
          status: 0
        }
      },
      item: {
        1: {
          item_info: "xx23",
          item_name: "手机",
          lost_location: "食堂"
        }
      },
      notice_list: [1], //notice_id
      my_notice_list: [1],
      my_application_list: [1],
      ws: null,
      user_id: 0,
      noticeDialogVisible: false,
      my_noticeDialogVisible: false,
      my_applicationDialogVisible: false,
      addnoticeDialogVisible: false,
      loginDialogVisible: false,
      login_form: {
        type: 1,
        username: "",
        password: ""
      },
      add_notice_form: {
        item_name: "",
        item_info: "",
        lost_location: ""
      },
      activeIndex: "1",
      cur_notice_id: 1,
      cur_my_notice_id: 1,
      cur_my_application_id: 1
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
        this.updateNoticeList();
      } else if (key == 2) {
        this.updateMyNoticeList();
      } else if (key == 3) {
        this.updateApplicationList();
      }
    },
    notification(msg, title = "消息", type = "info") {
      this.$notify({
        title: title,
        message: msg,
        type: type,
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
      this.notification("连接已建立", "成功", "success");
    },
    ws_onerror() {
      this.notification("连接发生错误", "错误", "error");
    },
    ws_onmessage(e) {
      this.notification(e.data, "收到消息");
      var result = JSON.parse(e.data);
      if (result.type == 1) {
        if (result.code == 1) {
          this.notification("登陆成功: user_id " + result.user_id);
          this.loginDialogVisible = false;
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
          var tmp = {};
          var id = result.item_id;
          tmp["item_name"] = result.item_name;
          tmp["item_info"] = result.item_info;
          tmp["lost_location"] = result.lost_location;
          this.$set(this.item, id, tmp);
          // this.item[id] = tmp;
        }
      } else if (result.type == 11) {
        if (result.code == 11) {
          this.addnoticeDialogVisible = false;
          this.$message({
            message: "发布成功",
            type: "success"
          });
        } else if (result.code == 12) {
          this.notice_list = [];
          for (var i1 = 0; i1 < result.notice_info.length; i1++) {
            var obj1 = result.notice_info[i1];
            var tmp1 = {};
            var notice_id = obj1[0];
            tmp1["finder_id"] = obj1[1];
            tmp1["status"] = obj1[2];
            tmp1["item_id"] = obj1[3];
            tmp1["contact_id"] = obj1[4];
            tmp1["time"] = obj1[5];
            this.notice_list.push(notice_id);
            this.$set(this.notice, notice_id, tmp1);
            //this.notice[notice_id] = tmp1;
            if (!this.item.hasOwnProperty(obj1[3])) this.get_item_info(obj1[3]);
          }
        } else if (result.code == 13) {
          this.$message({
            message: "已发起申请",
            type: "success"
          });
          this.noticeDialogVisible = false;
        } else if (result.code == 14) {
          this.application = {};
          my_application_list = [];
          for (var i = 0; i < result.application_info.length; i++) {
            var obj = result.application_info[i];
            var tmp = {};
            var app_seq = obj[0];
            tmp["applicant_id"] = obj[1];
            tmp["notice_id"] = obj[2];
            tmp["status"] = obj[3];
            tmp["item_id"] = obj[4];
            tmp["item_name"] = obj[5];
            this.$set(this.my_application, app_seq, tmp);
            //this.my_application[app_seq] = tmp;
            my_application_list.push(app_seq);
            if (!notice.hasOwnProperty(obj[2])) get_notice_info(obj[2]);
            if (!item.hasOwnProperty(obj[4])) get_item_info(obj[4]);
          }
        } else if (result.code == 19) {
          var obj1 = result.notice_info;
          var tmp1 = {};
          var notice_id = obj1[0];
          tmp1["finder_id"] = obj1[1];
          tmp1["status"] = obj1[2];
          tmp1["item_id"] = obj1[3];
          tmp1["contact_id"] = obj1[4];
          tmp1["time"] = obj1[5];
          this.$set(this.item, notice_id, tmp1);
          // this.item[notice_id] = tmp1;
        }
      }
    },
    ws_onclose() {
      this.notification("连接关闭", "错误", "error");
    },
    login() {
      var content = JSON.stringify(this.login_form, null, 0);
      this.ws.send(content);
      this.notification(content, "发送消息");
    },
    updateNoticeList() {
      var request = { type: 11, code: 2 };
      this.send_msg(request);
    },
    updateMyNoticeList() {
      var request = { type: 11, code: 2 };
      this.send_msg(request);
    },
    updateApplicationList() {
      var request = { type: 11, code: 4 };
      this.send_msg(request);
    },
    claim() {
      var request = {
        type: 11,
        code: 3,
        notice_id: this.cur_notice_id
      };
      this.send_msg(request);
    },
    notice_dialog_open(index) {
      this.noticeDialogVisible = true;
      var notice_id = this.notice_list[index];
      var tmp = this.notice[notice_id];
      this.cur_notice_id = notice_id;
      var request = {
        type: 3,
        code: 1,
        item_id: tmp["item_id"]
      };
      this.send_msg(request);
    },
    my_notice_dialog_open(index) {
      this.my_noticeDialogVisible = true;
      var notice_id = this.my_notice_list[index];
      var tmp = this.notice[notice_id];
      this.cur_my_notice_id = notice_id;
      var request = {
        type: 3,
        code: 1,
        item_id: tmp["item_id"]
      };
      this.send_msg(request);
    },
    my_application_dialog_open(index) {
      this.applicationDialogVisible = true;
      var item_id = this.application_list[index]["item_id"];
      this.get_item_info(item_id);
    },
    add_notice() {
      var request = {
        type: 11,
        code: 1,
        item_name: this.add_notice_form.item_name,
        item_info: this.add_notice_form.item_info,
        lost_location: this.add_notice_form.lost_location
      };
      this.send_msg(request);
    },
    send_msg(request) {
      this.ws.send(JSON.stringify(request, null, 0));
      this.notification(JSON.stringify(request, null, 0), "发送消息");
    },
    get_item_info(item_id) {
      this.$set(this.item, item_id, {});
      //this.item[item_id] = {};
      var request = {
        type: 3,
        code: 1,
        item_id: item_id
      };
      this.send_msg(request);
    },
    get_notice_info(notice_id) {
      this.$set(this.notice, notice_id, {});
      //this.notice[notice_id] = {};
      var request = {
        type: 11,
        code: 9,
        notice_id: notice_id
      };
      this.send_msg(request);
    }
  }
};
</script>