<template>
  <container :filter="filter"></container>
</template>

<script>
  import Container from './components/container.vue'
  export default{
    name: 'Unshipped',
    components: {
      Container
    },
    data() {
      return{
        filter: {
          order_status_id: '=3'
        }
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

</style>

