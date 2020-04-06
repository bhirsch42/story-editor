<template>
  <div id="app" class="container-fluid">
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
@import '../node_modules/bootstrap/dist/css/bootstrap.css';

@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');

#app {

}
</style>
