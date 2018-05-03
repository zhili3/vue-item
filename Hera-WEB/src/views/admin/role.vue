<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-button type="primary" icon="el-icon-plus" @click="newAdd">新增</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="batchDelete">删除</el-button>
    </h3>
    <div slot="body">
      <el-row :gutter="10" style="margin-bottom: 20px;">
        <el-col :xs="24" :sm="24" :md="8" :lg="8" style="margin-bottom: 20px;">
          <el-card class="box-card">
            <el-tree v-if="roleTree"
                    :data="roleTree"
                    ref="roleTree"
                    show-checkbox
                    highlight-current
                    default-expand-all
                    :render-content="renderContent"
                    @node-click="handleNodeClick" clearable node-key="id"
                    :props="roleProps"
                    style="padding: 10px 5px;"
                    >
            </el-tree>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <el-card class="box-card">
            <div class="text item">
              <el-form :model="form" ref="form" :rules="loginRules">
                <el-form-item label="父级" :label-width="formLabelWidth" prop="parentId">
                  <el-select-tree v-model="form.parentId" :treeData="roleTree" :propNames="roleProps" clearable placeholder="请选择父级">
                  </el-select-tree>
                </el-form-item>
                <el-form-item label="名称" :label-width="formLabelWidth" prop="cname">
                  <el-input v-model="form.cname" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                  <el-input type="textarea" v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否生效" :label-width="formLabelWidth">
                  <el-radio class="radio" v-model="form.status" label="1">是</el-radio>
                  <el-radio class="radio" v-model="form.status" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                  <el-button type="primary" @click="onSubmit" v-text="form.id?'修改':'新增'"></el-button>
                  <el-button type="info" @click="settingResource($event,form.id,form.sign)" icon="el-icon-setting" v-show="form.id && form.id!=null">配置资源
                  </el-button>

                  <el-button type="danger" @click="deleteSelected($event,form.id,form.sign)" icon="el-icon-delete" v-show="form.id && form.id!=null">删除
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog title="配置资源" :visible.sync="dialogVisible">
        <div class="select-tree">
          <el-scrollbar
            tag="div"
            class='is-empty'
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list">
            <el-tree
              :data="resourceTree"
              ref="resourceTree"
              show-checkbox
              check-strictly
              node-key="signid"
              default-expand-all
              v-loading="dialogLoading"
              :props="accessProps">
            </el-tree>
          </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="configRoleResources">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </imp-panel>

</template>
<script>
  import panel from "./components/panel"
  import selectTree from "./components/selectTree"
  import treeter from "./components/treeter"
  import {RoleList,EditAccessToDep,CheckDepAccess,AddDepOrRole,DelDepOrRole,DelsDepOrRole} from "@/api/admin/role"
  import {AccessGroupList} from "@/api/admin/access_group"
  export default {
    name: 'Role',
    mixins: [treeter],
    components: {
      'imp-panel': panel,
      'el-select-tree': selectTree,
    },
    data(){
      return {
        dialogLoading:false,
        dialogVisible:false,
        formLabelWidth: '100px',
        roleProps: {
          children: 'role_list',
          label: 'cname',
          id: "id",
          sign:"sign",
          description:'description'
        },

        accessProps: {
          children: 'access_list',
          label: 'cname',
          id: "id",
          signid:"signid",
          sign:"sign"
        },
        roleTree: [],
        resourceTree:[],
        maxId:700000,
        form: {
          id: null,
          parentId: null,
          cname: '',
          name: '',
          signid:"signid",
          sign: '',
          // sort: 0,
          status: '1'
        },
        loginRules: {
          parentId: [{ required: true, trigger: 'blur', message: '请输入父级Id' }],
          cname: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          name: [{ required: true, trigger: 'blur', message: '请输入英文名称' }]
        }
      }
    },
    methods: {
    	//添加资源组 及资源
      configRoleResources(){
      	// console.log(this.$refs.resourceTree.getCheckedKeys());
        let checkedns = this.$refs.resourceTree.getCheckedNodes();
        var params = "sign="+this.form.sign+"&id=" + this.form.id;
        this.$nextTick(function(){
        	EditAccessToDep(checkedns,params).then(res => {
            this.$message('修改成功');
            this.dialogVisible = false;
         });
        })
      },
      handleNodeClick(data){
        this.form = data;
      },
      newAdd(){
        this.form = {
          id: null,
          parentId: null,
          name: '',
          sign:'',
          cname: '',
          status: '1',
          description: ''
        };
      },
      batchDelete(){
        var checkKeys = this.$refs.roleTree.getCheckedNodes();
        if (checkKeys == null || checkKeys.length <= 0) {
          this.$message.warning('请选择要删除的资源');
          return;
        }
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	//批量删除
            DelsDepOrRole(checkKeys,'_').then(res => {
              this.$message('操作成功');
              this.load();
            }).catch(e => {
              console.log(e)
          })
        }).catch(() =>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
        })
      },
      onSubmit(){
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.parentId = this.form.parentId;
            AddDepOrRole(this.form,'_').then(res => {
              this.form.id = res.data.id;
              this.appendTreeNode(this.roleTree, res.data);
              }).catch(e => {
              this.maxId += 1;
              this.$message('操作成功');
              this.form.id = this.maxId;
              var  ddd = {
                id: this.form.id,
                name: this.form.name,
                // sort: this.form.sort,
                cname:this.form.cname,
                parentId: this.form.parentId,
                status: this.form.status,
                description: this.form.description,
                children:[]
              }
              this.appendTreeNode(this.roleTree, ddd);
              this.roleTree.push({});
              this.roleTree.pop();
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      deleteSelected(event,data){
        this.$confirm('该角色或角色组删除后会对用户权限有影响，您确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //单个删除
          DelDepOrRole(data,'_').then(res => {
              this.$message('操作成功');
              this.deleteFromTree(this.roleTree, data.id);
              this.newAdd();
            }).catch(e =>{
              console.log(e)
            this.load();
          })
        }).catch(() =>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
        })
      },
      load(){
      	RoleList('data',"sign=1").then(response => {
      		var res = response.data;
      		this.roleTree = [];
      		this.roleTree.push(...res)
	      })
      },
      renderContent(h, {node, data, store}) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span class="render-content">
              <i class="el-icon-setting" title="配置资源" on-click={(e)=>this.settingResource(e,data.id,data.sign)}></i>
              <i class="el-icon-delete" on-click={ (e) => this.deleteSelected(e,data) }></i>
            </span>
          </span>);
      },
      settingResource(event,id,sign){
          event.stopPropagation();
          this.dialogVisible = true;
          if(this.resourceTree==null||this.resourceTree.length<=0){
            this.dialogLoading = true;
            AccessGroupList('data',"s=1").then(response => {
            	var res = response.data;
                this.dialogLoading = false;
                this.resourceTree = res;
              })
          }
           // this.$refs.resourceTree.setCheckedKeys(['Access3','Access1']);
          // console.log(id);

        CheckDepAccess("id="+id+"&sign="+sign).then(res => {
            this.$refs.resourceTree.setCheckedKeys(res.data);
          }).catch(err=> {
          	console.log(err);
        })

      }

    },
    created(){
      this.load();
    }
  }
</script>

<style>
  .render-content {
    /* float: right; */
    margin-right: 20px
  }
  /* .render-content i.fa {
    margin-left: 10px;
  } */
  /* .render-content i.fa:hover{
    color: #e6000f;
  } */
  .select-tree .el-scrollbar.is-empty .el-select-dropdown__list {
    padding: 0;
  }
  .select-tree .el-scrollbar {
    border: 1px solid #d1dbe5;
  }
  .select-tree .el-tree{
    border:0;
  }
  .el-icon-setting{
    margin: 0 5px;
  }
  .el-icon-setting:hover,.el-icon-delete:hover{
    color: #e6000f;
  }
</style>
