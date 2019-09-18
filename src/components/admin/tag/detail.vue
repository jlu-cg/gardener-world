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
        <el-divider content-position="left">标签详情</el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="tag" :model="tag" label-width="160px">
          <el-form-item label="名称">
            {{tag.name}}
          </el-form-item>
          <el-form-item label="标签分类">
            <el-radio disabled v-model="tag.tagType" :label="1">主话题</el-radio>
            <el-radio disabled v-model="tag.tagType" :label="2">非主话题</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider content-position="left">相关标签</el-divider>
      </el-col>
    </el-row>
    <el-row class="gardener-title-nav">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="addParentRelation" round>添加父标签</el-button>
        <el-button type="primary" size="small" @click="addChildRelation" round>添加子标签</el-button>
        <el-button type="primary" size="small" @click="delRelation" round>删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table ref="singleSelectRelationTable" :data="tagTagRelation.tagTagRelationList" highlight-current-row 
          @current-change="handleSelectRelationCurrentChange" style="width: 100%" border>
          <el-table-column prop="tagName" label="标签名">
          </el-table-column>
          <el-table-column prop="relateType" :formatter="formatterRelateType" label="关联关系" width="260">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="添加关联标签" :visible.sync="addTagTagRelation.addTagTagRelationVisible">
      <el-form :inline="true" :model="addTagTagRelation.searchTagForm" class="demo-form-inline">
        <el-form-item label="标签名">
          <el-input v-model="addTagTagRelation.searchTagForm.name" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearchTagSubmit">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="singleSelectTagTable" :data="addTagTagRelation.selectTagList" highlight-current-row 
          @current-change="handleSelectTagCurrentChange" style="width: 100%" border>
        <el-table-column prop="name" label="标签名">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="tagTagRelation.addTagTagRelationVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectTagRelation">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AdminTagDetail',
  data() {
    return {
      tagId : 0,
      tag : {
        id : 0,
        name : "",
        tagType : 2
      },
      tagTagRelation : {
        tagTagRelationList : [],
        currentRow : null
      },
      addTagTagRelation : {
        addTagTagRelationVisible : false,
        selectTagList : [],
        searchTagForm : {
          name : ''
        },
        tagRelation:{
          relateType : 1
        },
        currentRow : null,
      }
    };
  },
  created(){
    var params = this.gardener.getParams();
    var tagId = this.gardener.getParamInt(params['tagId'], -1);
    this.tagId = tagId;
    if(tagId == -1){
      return ;
    }
    this.addTagTagRelation.tagRelation.tagId = tagId;
    this.loadTag();
    this.loadTagTagRelation();
  },
  methods: {
    loadTag(){
      this.axios.get(this.gardener.adminBackBaseURL + 'tag/v1/detail', {
        params: {
          tagId : this.tagId
        }
      }).then((response) => {
        this.tag = response.data;
      }).catch((response)=>{
        
      })
    },
    loadTagTagRelation(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/list', this.tagId).then((response) => {
        this.tagTagRelation.tagTagRelationList = response.data;
      }).catch((response)=>{
        
      })
    },
    addParentRelation(){
      this.addTagTagRelation.tagRelation.relateType = 1;
      this.addTagTagRelation.addTagTagRelationVisible = true;
    },
    addChildRelation(){
      this.addTagTagRelation.tagRelation.relateType = 2;
      this.addTagTagRelation.addTagTagRelationVisible = true;
    },
    delRelation(){
      if(this.tagTagRelation.currentRow === null){
        this.checkRow();
      }else{
        this.$confirm('此操作将永久删除该关联, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.get(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/delete?tagTagRelationId=' + this.tagTagRelation.currentRow.id
          ).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.loadTagTagRelation();
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
    selectTagRelation(){
      this.addTagTagRelation.tagRelation.relateTagId = this.addTagTagRelation.currentRow.id;
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/tag/relation/v1/save', this.addTagTagRelation.tagRelation
      ).then((response) => {
        this.$message({
          message: '添加标签关联关系成功',
          type: 'success'
        });
        this.addTagTagRelation.addTagTagRelationVisible = false;
        this.loadTagTagRelation();
      }).catch((response)=>{
        
      })
    },
    onSearchTagSubmit(){
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/v1/list', this.addTagTagRelation.searchTagForm
      ).then((response) => {
        this.addTagTagRelation.selectTagList = response.data;
      }).catch((response)=>{
        
      })
    },
    handleSelectTagCurrentChange(val){
      this.addTagTagRelation.currentRow = val;
    },
    handleSelectRelationCurrentChange(val){
      this.tagTagRelation.currentRow = val;
    },
    formatterRelateType(row, column){
      return this.gardener.tagRelateType.get(row.relateType);
    },
    backToList(){
      window.location.href = '#/admin/tag/list';
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

<style>
</style>