<template>
  <container :filter="filter"></container>
</template>

<script>
  import Container from './components/container.vue'
  export default{
    name: 'Pending',
    components: {
      Container
    },
    data() {
      return{
        filter: {
          order_status_id: '=7'
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>
