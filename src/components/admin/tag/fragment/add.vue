<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-page-header @back="backToList" :content="title">
        </el-page-header>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form ref="tagFragment" :model="tagFragment" label-width="160px">
          <el-form-item label="标签名">
            <el-input v-model="tagFragment.name"></el-input>
          </el-form-item>
          <el-form-item label="标签分类">
            <el-radio v-model="tagFragment.type" :label="1">文章精华</el-radio>
            <el-radio v-model="tagFragment.type" :label="2">普通</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'AdminTagFragmentAdd',
  data() {
    return {
      tagFragment : {
        id : -1,
        name : '',
        type : 2
      },
      title : ''
    };
  },
  created(){
    this.loadEdit();
  },
  methods: {
    loadEdit(){
      var params = this.gardener.getParams();
      var tagFragmentId = this.gardener.getParamInt(params['tagFragmentId'], -1);
      if(tagFragmentId == -1){
        this.title = '添加碎片标签';
        return ;
      }

      this.title = '修改碎片标签';
      this.axios.get(this.gardener.adminBackBaseURL + 'tag/fragment/v1/detail', {
        params: {
          tagFragmentId : tagFragmentId
        }
      }).then((response) => {
        this.tagFragment = response.data;
      }).catch((response)=>{
        
      })
    },
    onSubmit() {
      this.axios.post(this.gardener.adminBackBaseURL + 'tag/fragment/v1/save', this.tagFragment)
      .then((response) => {
        if(response.data == 0){
          this.$alert('添加成功', '添加提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.backToList();
            }
          });
        }else{
          this.$message.error('添加标签失败');
        }
      }).catch((response)=>{
        
      })
    },
    backToList(){
      window.location.href = '#/admin/tag/fragment/list';
    }
  }
}
</script>

<style>
.tag-form{
    width: 540px;
}
</style>