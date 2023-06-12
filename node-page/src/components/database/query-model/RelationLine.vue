<template>
  <v-line :config="lineConfig"/>
</template>

<script>
export default {
  name: "RelationLine",
  props: {
    // 开始坐标
    start: {
      required: true
    },
    // 结束坐标
    end: {
      required: true
    }
  },
  computed: {
    position () {
      return [this.start, this.end]
    }
  },
  watch: {
    position () {
      this.initPoints()
    }
  },
  data () {
    return {
      lineConfig: {
        x: 0,
        y: 0,
        // 弯曲度，值越高，线条越弯曲
        // tension: 0.2,
        // 如果没有提供tension，则自动弯曲（按照点的方向渐渐弯曲，类似曲线图的弯曲）
        // bezier: true,
        // hitStrokeWidth: 3,
        // strokeHitEnabled: true,
        // perfectDrawEnabled: true,
        // 线条的点集[x1,y1,x2,y2...]
        // points: [...point1, ...point2],
        // 线条粗细
        stroke: 5
      }
    }
  },
  methods: {
    initPoints () {
      this.lineConfig.points = [
        this.start.x, this.start.y,
        this.end.x, this.end.y
      ]
    }
  },
  created () {
    this.initPoints()
  }
}
</script>

<style scoped>

</style>
