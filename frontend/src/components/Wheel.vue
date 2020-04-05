<template>
  <div class="row">
    <div class="four columns">
      <button @click="addSection">Add Section</button>
      {{ width }}
      <ul>
        <li v-for="section in sections" :key="section.title">
          {{ section.title }}: {{ section.path }}
          <ul>
            <li v-for="scene in section.scenes" :key="scene.body">
              <input type="text" v-model="scene.body">
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="eight columns" ref="wheelEl">
      <svg :width="width" height="500">
        <g class="sections" :style="`transform: translate(${width / 2}px, 250px)`">
          <g class="section" v-for="(section, i) in sections" :key="section.title">
            <path :d="svg.sections[i].section"/>
            <circle :cx="svg.sections[i].label.x"
                    :cy="svg.sections[i].label.y"
                    :r="2" fill="red"/>
            <g class="scenes" v-for="(scene, j) in section.scenes" :key="scene.body">
              <circle :cx="svg.scenes[i][j].x"
                      :cy="svg.scenes[i][j].y"
                      :r="2" fill="blue"/>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  onMounted
} from '@vue/composition-api';

import generateSectionSvgs from '@/lib/wheel/generate-section-svgs';
import sectionsFixture from '@/fixtures/sections';

export default {
  name: 'Wheel',

  setup() {
    const wheelEl = ref(null);
    const width = ref(300);
    const svg = ref({});
    const sections = reactive(sectionsFixture);
    console.log(sections)

    onMounted(() => {
      console.log("WHEEL", wheelEl.value)
      width.value = wheelEl.value.clientWidth;
    });


    function addSection() {
      sections.push({
        title: 'Go' + sections.length,
        scenes: [
          {
            body: 'Yeet yart'
          },
        ],
      });

      svg.value = generateSectionSvgs(sections);
    }

    svg.value = generateSectionSvgs(sections);

    return {
      sections: sections,
      addSection,
      wheelEl,
      width,
      svg,
    }
  }
}
</script>

<style scoped>
  .wheel {
  }
</style>
