<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <div class="col-4">
        <ul>
          <li v-for="section in wheelData" :key="section.title">
            {{ section.title }}: {{ section.path }}
            <ul>
              <li v-for="scene in section.scenes" :key="scene.id">
                <input type="text" v-model="scene.body">
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="col-8">
        <Wheel :wheelData="wheelData"/>
      </div>
    </div>
  </div>
</template>

<script>
import Wheel from './components/Wheel.vue'
import sectionsFixture from '@/fixtures/sections';

export default {
  name: 'App',
  components: {
    Wheel,
  },
  data() {
    return {
      wheelData: sectionsFixture,
    }
  }
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.css';
@import '../node_modules/vue-resize/dist/vue-resize.css'

@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');

#app {

}
</style>
