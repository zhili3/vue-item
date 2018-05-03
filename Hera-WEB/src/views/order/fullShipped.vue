<template>
  <container :filter="filter"></container>
</template>

<script>
  import Container from './components/container.vue'
  export default{
    name: 'FullShipped',
    components: {
      Container
    },
    data() {
      return{
        filter: {
          order_status_id: '=5'
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>

