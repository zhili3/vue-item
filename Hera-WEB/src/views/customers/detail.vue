<template>
  <div class="container">
    <h1>{{records.info.name}}</h1>
    <el-switch
      v-model="on_off"
      @change="handleOn"
      active-text="启用"
      inactive-text="禁用">
    </el-switch>
    <el-row :gutter="20" v-loading="infoLoading" style="margin: 40px 0;">
      <el-col :xs="24" :sm="24" :md="17" :lg="17">
        <el-card style="margin-bottom: 30px;">
          <el-row type="flex" :gutter="40" align="middle" style="margin: 0 0 20px;">
            <avatar :username="records.info.name" :src="records.info.avatar" :size="80"></avatar>
            <el-col :span="20">
              <h4>{{records.info.name}}</h4>
              <p>{{records.info.country}}</p>
              <p>Customer for about {{records.info.create_time}} days</p>
            </el-col>
          </el-row>

          <el-row v-if="records.order.last_order_id" type="flex" align="top" style="color: #637381;border-top:1px solid #ebeef0;">
            <el-col :span="8" align="center">
              <p>{{$t('customer.lastOrder')}}</p>
              <p>{{records.order.last_order_time}}</p>
            </el-col>
            <el-col :span="8" align="center">
              <p>{{$t('customer.lifetimeSpent')}}</p>
              <p>${{records.order.order_total_paid}}</p>
              <p>{{records.order.order_count}}&nbsp;order</p>
            </el-col>
            <el-col :span="8" align="center">
              <p>{{$t('customer.averageOrder')}}</p>
              <p>${{records.order.order_avg_paid}}</p>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <div slot="header">
            <span>{{$t('customer.recent')}}</span>
          </div>
          <div v-if="records.order.last_order_id">
            <el-row type="flex" align="top">
              <el-col>
                <p>Order:&nbsp;{{records.order.last_order_num}}</p>
                <p>${{records.order.order_total_paid ? records.order.order_total_paid : '0.00'}}</p>
              </el-col>
              <el-col align="right">
                <p>{{records.order.last_order_time}}</p>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" v-for="item in records.order.products" :key="item.icon" style="margin: 15px 0;">
              <img :src="item.icon" width="50" height="50">
              <el-col :span="18">
                <el-row>
                  <el-col :span="24">
                    <p class="product-title">{{item.product_name}}</p>
                  </el-col>
                  <el-col :span="24">
                    <p>X {{item.quantity}}</p>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row>
              <el-col :span="24" align="center" style="margin-bottom: 30px;">
                <svg-icon icon-class="order" style="font-size: 64px;"/>
              </el-col>
              <el-col :span="24" align="center">
                This customer hasn't placed any orders yet
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="7" :lg="7">
        <el-card>
          <div class="contact" style="padding: 0 0 10px;">
            <h4>{{$t('customer.contact')}}</h4>
            <p>{{records.info.email}}</p>
          </div>

          <div class="address" style="border-top: 1px solid #ebeef0;">
            <h4>{{$t('customer.defaultAddress')}}</h4>
            <p>{{records.address.firstname}} {{records.address.lastname}}</p>
            <p>{{records.address.address}}</p>
            <p>{{records.address.city}}</p>
            <p>{{records.address.state}}</p>
            <p>{{records.address.country}}</p>
            <p>{{records.address.phone}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {customerInfo} from '@/api/customer.js'
  import Avatar from 'vue-avatar'
  export default{
    name: 'CustomerInfo',
    components: {
      Avatar
    },
    computed: {
      // operation() {
      //   let val= this.records.info.banned
      //   if(val=='N'){
      //     return this.on_off = true
      //     // return true
      //   }else if(val=='Y'){
      //     return this.on_off = false
      //     // return false
      //   }
      // }
    },
    data() {
      return{
        infoLoading: false,
        on_off: true,
        records: {
          address: {},
          info: {
            avatar: '',
            country: '',
            create_time: '',
            createdAt: '',
            email: '',
            id: '',
            banned:"",
            lastLogin:"",
            name:""
          },
          order: {}
        }
      }
    },
    created() {
      this.loadData()
    },
    activated() {

    },
    methods: {
      handleOn(val) {
        console.log(val)
      },
      operation() {
        let val= this.records.info.banned
        if(val=='N' ){
          this.on_off = true
        }else if(val=='Y'){
          this.on_off = false
        }
      },
      loadData() {
        this.infoLoading=true
        customerInfo(this.$route.params.userId).then(response => {
          // console.log(response)
          this.records=response.data.records
          this.operation()
          this.infoLoading=false
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped>
  .container{width: 94%;margin: 30px auto 0;font-size: 14px;}
  .product-title{
    white-space: nowrap;
    overflow : hidden;
    text-overflow: ellipsis;
  }
</style>
