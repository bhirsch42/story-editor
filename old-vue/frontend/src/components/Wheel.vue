<template>
  <div class="wheel-svg-container">
    <resize-observer @notify="handleResize" />
    <svg class="wheel-svg">
      <g class="sections" :style="`transform: translate(${box.width / 2}px, ${box.height / 2}px)`">
        <g class="section" v-for="(section, i) in sections" :key="section.id">
          <path :d="svg.sections[i].section"/>
<!--
          <circle :cx="svg.sections[i].label.x"
                  :cy="svg.sections[i].label.y"
                  :r="2" fill="red"/>
-->
          <g class="scenes" v-for="(scene, j) in section.scenes" :key="scene.id">
            <line :x1="svg.scenes[i][j].lineInnerX"
                  :y1="svg.scenes[i][j].lineInnerY"
                  :x2="svg.scenes[i][j].lineOuterX"
                  :y2="svg.scenes[i][j].lineOuterY"
                  stroke="black"/>
            <text :x="svg.scenes[i][j].textX"
                  :y="svg.scenes[i][j].textY"
                  :text-anchor="svg.scenes[i][j].textAnchor">
              <tspan v-for="(line, k) in svg.scenes[i][j].lines"
                     :key="k"
                     :dy="k == 0 ? 0 : '1.2em'"
                     :x="svg.scenes[i][j].textX"
                     :alignment-baseline="svg.scenes[i][j].alignmentBaseline">
                {{ line }}
              </tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  onMounted
} from '@vue/composition-api';

import generateWheel from '@/lib/wheel/generate-section-svgs';

export default {
  name: 'Wheel',
  props: ['wheelData'],
  setup(props) {
    const wheelEl = ref(null);
    const box = reactive({
      width: 0,
      height: 0,
    })
    const sections = reactive(props.wheelData);
    const svg = computed(() => generateWheel({ sections, width: box.width }));

    onMounted(function() {
      box.width = this.$el.clientWidth;
      box.height = this.$el.clientHeight;
    });

    function handleResize({ width, height }) {
      console.log('handleResize', width, height);
      box.width = width;
      box.height = height;
    }

    return {
      sections: sections,
      wheelEl,
      box,
      svg,
      handleResize,
    }
  }
}
</script>

<style scoped>
  .wheel-svg-container {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .wheel-svg {
    font-family: 'Courier Prime', monospace;
    height: 100%;
    width: 100%;
  }
</style>
