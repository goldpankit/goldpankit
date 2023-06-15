<template>
  <v-line
    ref="line"
    :config="lineConfig"
    @mouseenter="highlight(true)"
    @mouseleave="highlight(false)"
  />
</template>

<script>
// 颜色配置
const COLORS = {
  join: {
    color: '#eee',
    hoverColor: '#FC777D',
    selectedColor: '#FC777D'
  },
  aggregate: {
    color: '#FFE957',
    hoverColor: '#FFE957',
    selectedColor: '#FFE957'
  }
}
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
    // 线条类型
    lineType: {
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
      this.init()
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
      const node = this.$refs.line.getNode()
      if (highlight) {
        node.setAttr('stroke', COLORS[this.lineType].hoverColor)
        node.setAttr('strokeWidth', 3)
        node.zIndex(100)
      } else {
        node.setAttr('stroke', COLORS[this.lineType].color)
        node.setAttr('strokeWidth', 2)
        node.zIndex(1)
      }
    },
    // 初始化
    init () {
      // 初始化颜色
      this.lineConfig.stroke = COLORS[this.lineType].color
      // 初始化线条点
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
    this.init()
  }
}
</script>

<style scoped>
body {
  color: #ffa7a7;
}
</style>
