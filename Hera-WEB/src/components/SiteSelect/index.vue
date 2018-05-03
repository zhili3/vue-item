<template>
  <el-select
    v-model="value"
    size="mini"
    placeholder="请选择站点"
    @change="handleSiteSelect"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <!-- <el-dropdown class="siteBox" @command="handleSiteSelect">
    <div>
      {{selected}}<i class="el-icon-arrow-down el-icon--right"></i>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="NewFrog" :disabled="site==='NewFrog'">NewFrog</el-dropdown-item>
      <el-dropdown-item command="Peggybuy" :disabled="site==='Peggybuy'">Peggybuy</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown> -->
</template>

<script>
export default {
  data() {
    return {
      // selected: 'NewFrog',
       options: [{
          value: 'NewFrog',
          label: 'NewFrog'
        }, {
          value: 'Peggybuy',
          label: 'Peggybuy'
        }],
        value: 'NewFrog'
    }
  },
  // computed: {
  //   site() {
  //     return this.$store.getters.site
  //   }
  // },
  methods: {
    handleSiteSelect(val) {
      // this.selected = val
      this.$store.dispatch('setSite', val)
      this.$message({
        message: 'switch Site success',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
  .siteBox{
    margin: 0 8px;
    cursor: pointer;
  }
  .siteBox:hover{color: #409eff;}
</style>


