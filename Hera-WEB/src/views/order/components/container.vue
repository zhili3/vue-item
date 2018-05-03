<template>
  <div class="container">
    <el-row type="flex" class="header" align="middle">
        <el-col :span="24"><h1>{{$t('route.'+this.$route.meta.title)}}</h1></el-col>
    </el-row>

    <el-card class="box-card" style="margin: 40px 0;">
      <div class="toolbar" style="margin-bottom: 15px;">
        <el-button type="text" @click="handleExportCustomer"><i class="el-icon-download"></i>&nbsp;{{$t('tool.export')}}</el-button>
        <el-button type="text" @click="handleRefresh"><i class="el-icon-refresh"></i>&nbsp;{{$t('tool.refresh')}}</el-button>
      </div>
      <div class="search">
        <el-form :inline="true" :model="queryFrom" ref="searchForm">
          <el-form-item prop="keyword">
            <el-input v-model="queryFrom.keyword" placeholder="keywords"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">{{$t('tool.search')}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleReset('searchForm')">{{$t('tool.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="orderTable">
        <el-table
          :data="tableData.list"
          v-loading="listLoading"
          element-loading-text="Loading"
          @sort-change="handleSort"
          :row-style="{cursor: 'pointer'}"
          :header-row-style="{background: '#f2f2f2'}"
          border
          style="width: 100%;"
          >
          <el-table-column
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column
            fixed
            prop="id"
            :label="$t('order.id')"
            sortable="custom"
            width="80"
            >
          </el-table-column>
          <el-table-column
            prop="order_num"
            :label="$t('order.orderNo')"
            width="200"
            >
          </el-table-column>
          <el-table-column
            prop="oms_order_num"
            :label="'OMS '+$t('order.orderNo')"
            width="200"
            >
            <template slot-scope="scope">
              {{scope.row.oms_order_num || '未拉取'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="created"
            :label="$t('order.date')"
            sortable="custom"
            width="160"
            >
            <template slot-scope="scope">
              {{scope.row.created_at}}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_amount"
            :label="$t('order.total')"
            sortable="custom"
            width="100"
            >
            <template slot-scope="scope">
              ${{scope.row.total_amount}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('order.orderStatus')"
            width="160"
            >
            <template slot-scope="scope">
              <el-tag type="warning">{{tableData.options.order_status[scope.row.order_status_id]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="carrier"
            :label="$t('order.transport')"
            width="200"
            >
            <template slot-scope="scope">
              {{scope.row.carrier}}&nbsp;({{scope.row.shipping_fee}})
            </template>
          </el-table-column>
          <el-table-column
            prop="currency_code"
            :label="$t('order.currency')"
            width="100"
            >
          </el-table-column>
          <el-table-column
            prop="payment_method"
            :label="$t('order.payment')"
            width="200"
            >
          </el-table-column>
          <el-table-column
            prop="username"
            :label="$t('order.customer')"
            width="150"
            >
          </el-table-column>
          <el-table-column
            :label="$t('customer.operation')"
            fixed="right"
            width="100"
            >
            <template slot-scope="scope">
              <el-button size="mini">
                <router-link :to="{name: 'OrderInfo', params: { id: scope.row.id }}">View</router-link>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pager"
          :page-sizes="[10,20,30]"
          :total="+tableData.total"
          style="margin-top: 15px;"
          >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {allOrder} from '@/api/order.js'
  export default{
    props: {
      filter: {
        type: Object,
        default: {}
      }
    },
    data() {
      return{
        listLoading: false,
        tableData: {
          total: 0,
          list: [{
            UserId: '',
            created_at: '',
            order_num: '',
            oms_order_num: '',
            payment_method: '',
            currency_code: '',
            payment_status: '',
            order_status_id: '',
            ship_status: '',
            total_amount: '',
            username: '',
            id: '0'
          }],
          options: {
            order_status: []
          }
        },
        queryFrom: {
          keyword: ''
        },
        params: {
          site: 'nf',
          pager: 1,
          page_size: 10,
          query: [this.filter],
          sort: {}
        }
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      // 导出
      handleExportCustomer() {

      },
      // 刷新
      handleRefresh() {
        this.loadData()
      },
      // 查询
      handleQuery() {
        // this.loadData()
      },
      // 重置
      handleReset(formName) {
        this.$refs[formName].resetFields()
        // this.loadData()
      },
      // 排序
      handleSort(column) {
        this.params.sort = {}
        let sortName = column.prop
        if(column.order=='ascending'){
          this.params.sort[sortName] = 'ASC'
        }else if(column.order=='descending'){
          this.params.sort[sortName] = 'DESC'
        }
        this.loadData()
      },
      // 每页显示数据量
      handleSizeChange(val) {
        this.params.page_size = val
        this.loadData()
      },
      // 分页
      handleCurrentChange(val) {
        this.params.pager = val
        this.loadData()
      },
      loadData() {
        this.listLoading=true
        allOrder(this.params).then(response => {
          // console.log(response)
          this.tableData=response.data
          this.listLoading=false
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>
  .container{width: 94%;margin: 30px auto 0;}
</style>

