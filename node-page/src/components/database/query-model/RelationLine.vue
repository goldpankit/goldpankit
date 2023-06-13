<template>
  <v-line
    ref="line"
    :config="lineConfig"
    @mouseenter="highlight(true)"
    @mouseleave="highlight(false)"
  />
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
        stroke: '#ccc',
        // 线条粗细（1个像素时无法出发mouseenter等事件）
        strokeWidth: 2,
        lineJoin: 'round',
        lineCap: 'round'
      }
    }
  },
  methods: {
    // 高亮
    highlight (highlight=true) {
      console.log('highlight', highlight)
      const node = this.$refs.line.getNode()
      if (highlight) {
        node.setAttr('stroke', '#3d6596')
        node.setAttr('strokeWidth', 3)
        node.zIndex(100)
      } else {
        node.setAttr('stroke', '#ccc')
        node.setAttr('strokeWidth', 2)
        node.zIndex(1)
      }
    },
    // 初始化线条点
    initPoints () {
      const points = []
      if (this.start.y !== this.end.y) {
        points.push(this.start.x + ((this.end.x - this.start.x) / 2))
        points.push(this.start.y)
        points.push(this.start.x + ((this.end.x - this.start.x) / 2))
        points.push(this.end.y)
      }
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
