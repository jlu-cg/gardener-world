<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" content="详情页面">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="userInfo" :model="userInfo" label-width="180px">
          <el-form-item label="用户名">
            {{userInfo.userName}}
          </el-form-item>
          <el-form-item label="昵称">
            {{userInfo.nickName}}
          </el-form-item>
          <el-form-item label="电子邮件">
            {{userInfo.email}}
          </el-form-item>
          <el-form-item label="手机号">
            {{userInfo.mobilePhone}}
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="userInfo.status" :label="1">有效</el-radio>
            <el-radio v-model="userInfo.status" :label="2">无效</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- -------------------------------------------------- 用户角色 -------------------------------------------------- -->
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">用户角色</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addUserRoleRelation" round>添加角色</el-button>
        <el-button type="primary" size="small" @click="delUserRoleRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleParentRelationTable" :data="userRoleRelation.tagTagRelation.tagTagRelationList" highlight-current-row 
          @current-change="handleParentRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="tagName" label="标签名">
          </el-table-column>
          <el-table-column prop="relateType" :formatter="formatterUserInfoStatus" label="关联关系" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联标签" :visible.sync="parentTagRelation.addTagTagRelation.addTagTagRelationVisible">
      <el-form :inline="true" :model="parentTagRelation.addTagTagRelation.searchTagForm" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="parentTagRelation.addTagTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchParentTagSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleParentTagTable" :data="parentTagRelation.addTagTagRelation.selectTagList" highlight-current-row 
          @current-change="handleParentTagCurrentChange" style="width: 100%" :row-class-name="gardener.relationTableRowClassName" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="parentTagRelation.tagTagRelation.addTagTagRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectParentTagRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminUserInfoDetail',
  data() {
    return {
      userInfo : {
        id : -1,
        userName : "",
        password : "",
        nickName : "",
        email : "",
        mobilePhone : "",
        status : 1
      },
      userRoleRelation : {
        userRoleRelation : {
          userRoleRelationList : [],
          tagRelation:{
            tagId : -1,
            relateType : 1
          },
          currentRow : null
        },
        adduserRoleRelation : {
          adduserRoleRelationVisible : false,
          selectTagList : [],
          searchTagForm : {
            name : ''
          },
          tagRelation:{
            relateType : 1
          },
          currentRow : null,
          tagIdStr : ','
        }
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var userInfoId = this.gardener.getParamInt(params['userInfoId'], -1);
    if(userInfoId == -1){
      return ;
    }
    this.userInfo.id = userInfoId;
    this.userRoleRelation.tagTagRelation.tagRelation.tagId = userInfoId;
    this.userRoleRelation.addTagTagRelation.tagRelation.tagId = userInfoId;
    this.loadUserInfo();
    this.loadUserRoleRelation();
  },
  methods: {
    loadUserInfo(){
      this.axios.get(this.gardener.adminBackBaseURL + 'user/info/v1/detail', {
        params: {
          userInfoId : this.userInfo.id
        }
      }).then((response) => {
        this.userInfo = response.data;
      }).catch((response)=>{
        
      })
    },
    //------------------------------------------ 用户角色 ------------------------------------------
    loadUserRoleRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/list', this.parentTagRelation.tagTagRelation.tagRelation).then((response) => {
        this.parentTagRelation.tagTagRelation.tagTagRelationList = response.data;
        for(var i = 0; i < this.parentTagRelation.tagTagRelation.tagTagRelationList.length; i++){
          this.parentTagRelation.addTagTagRelation.tagIdStr += this.parentTagRelation.tagTagRelation.tagTagRelationList[i].relateTagId + ',';
        }
      }).catch((response)=>{
        
      })
    },
    addParentRelation(){
      this.parentTagRelation.addTagTagRelation.addTagTagRelationVisible = true;
    },
    delParentRelation(){
      if(this.parentTagRelation.tagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/delete?tagTagRelationId=' + this.parentTagRelation.tagTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadParnetTagTagRelation();
          }).catch((response)=>{
            
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    selectParentTagRelation(){
      if(this.parentTagRelation.addTagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.parentTagRelation.addTagTagRelation.tagRelation.relateTagId = this.parentTagRelation.addTagTagRelation.currentRow.id;
        this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/save', this.parentTagRelation.addTagTagRelation.tagRelation
        ).then((response) => {
          this.$message({
            message: '添加标签关联关系成功',
            type: 'success'
          });
          this.parentTagRelation.addTagTagRelation.addTagTagRelationVisible = false;
          this.loadParnetTagTagRelation();
        }).catch((response)=>{
          
        })
      }
    },
    onSearchParentTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.parentTagRelation.addTagTagRelation.searchTagForm
      ).then((response) => {
        if(response.data === undefined){
          return;
        }
        for(var i = 0; i < response.data.length; i ++){
          if(this.parentTagRelation.addTagTagRelation.tagIdStr.indexOf(',' + response.data[i].id + ',') != -1){
            response.data[i].addType = 1;
          }
        }
        this.parentTagRelation.addTagTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleParentRelationCurrentChange(val){
      this.parentTagRelation.tagTagRelation.currentRow = val;
    },
    handleParentTagCurrentChange(val){
      this.parentTagRelation.addTagTagRelation.currentRow = val;
    },
    formatterUserInfoStatus(row, column){
      return this.gardener.userInfoStatus.get(row.status);
    },
    backToList(){
      window.location.href = '#/admin/user/info/list';
    },
    checkRow(){
      this.$message({
        message: '请选择数据后进行操作',
        type: 'warning'
      });
    }
  }
}
</script>