<template>
  <container :filter="filter"></container>
</template>

<script>
  import Container from './components/container.vue'
  export default{
    name: 'PartialShipped',
    components: {
      Container
    },
    data() {
      return{
        filter: {
          order_status_id: '=4'
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>

