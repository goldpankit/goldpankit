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
    },
    // 线索引，用于控制颜色
    index: {
      default: 0
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
        stroke: '#ccc',
        // 线条粗细
        strokeWidth: 1,
      }
    }
  },
  methods: {
    initPoints () {
      const colors = [
        '#b274a8',
        '#a86f6f',
        '#98b763',
        '#70ab81',
        '#6ca69d',
        '#6f93ad',
        '#797cbb'
      ]
      const points = []
      if (this.start.y !== this.end.y) {
        points.push(this.start.x + ((this.end.x - this.start.x) / 2))
        points.push(this.start.y)
        points.push(this.start.x + ((this.end.x - this.start.x) / 2))
        points.push(this.end.y)
      }
      this.lineConfig.stroke = colors[this.index]
      this.lineConfig.points = [
        this.start.x, this.start.y,
        ...points,
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
body {
  color: #ffa7a7;
}
</style>
