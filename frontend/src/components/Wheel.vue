<template>
  <div class="d-flex">
    <div>
      <button class="btn btn-sm btn-primary" @click="addSection">Add Section</button>
      {{ width }}
      <ul>
        <li v-for="section in sections" :key="section.title">
          {{ section.title }}: {{ section.path }}
          <ul>
            <li v-for="scene in section.scenes" :key="scene.id">
              <input type="text" v-model="scene.body">
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="flex-grow-1" ref="wheelEl">
      <svg :width="width" height="500">
        <g class="sections" :style="`transform: translate(${width / 2}px, 250px)`">
          <g class="section" v-for="(section, i) in sections" :key="section.id">
            <path :d="svg.sections[i].section"/>
<!--
            <circle :cx="svg.sections[i].label.x"
                    :cy="svg.sections[i].label.y"
                    :r="2" fill="red"/>
 -->
            <g class="scenes" v-for="(scene, j) in section.scenes" :key="scene.body">
              <line :x1="svg.scenes[i][j].lineInnerX"
                    :y1="svg.scenes[i][j].lineInnerY"
                    :x2="svg.scenes[i][j].lineOuterX"
                    :y2="svg.scenes[i][j].lineOuterY"
                    stroke="black"/>
              <text :x="svg.scenes[i][j].textX"
                    :y="svg.scenes[i][j].textY"
                    :text-anchor="svg.scenes[i][j].textAnchor"
                    :alignment-baseline="svg.scenes[i][j].alignmentBaseline">
                {{ scene.body }}
              </text>
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

import generateWheel from '@/lib/wheel/generate-section-svgs';
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

      svg.value = generateWheel({ sections, width: width.value });
    }

    svg.value = generateWheel({ sections, width: width.value });

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
  svg {
    font-family: 'Courier Prime', monospace;
  }
</style>
