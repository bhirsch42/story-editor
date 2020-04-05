<template>
  <div id="app" class="container">
    <Wheel/>
  </div>
</template>

<script>
import Wheel from './components/Wheel.vue'

export default {
  name: 'App',
  components: {
    Wheel,
  }
}
</script>

<style>
@import './assets/skeleton-css/css/skeleton.css';

#app {

}
</style>
