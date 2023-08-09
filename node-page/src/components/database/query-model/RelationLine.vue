<template>
  <v-line
    ref="line"
    :config="lineConfig"
    @mouseenter="highlight(true, selected)"
    @mouseleave="highlight(false, selected)"
    @click="handleSelect"
  />
</template>

<script>
// 颜色配置
const COLORS = {
  join: {
    color: '#eee',
    hoverColor: '#faa5aa',
    selectedColor: '#FC777D'
  },
  aggregate: {
    color: '#9b8e35',
    hoverColor: '#d9c64b',
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
    // 是否已选中
    selected: {
      default: false
    },
    // 线条类型
    lineType: {
      required: true
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
        strokeWidth: 4,
        lineJoin: 'round',
        lineCap: 'round'
      }
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
    },
    selected () {
      if (this.selected) {
        this.highlight(true, this.selected)
      } else {
        this.highlight(false, this.selected)
      }
    }
  },
  methods: {
    // 选中
    handleSelect () {
      if (!this.selected) {
        this.$emit('select')
      } else {
        this.$emit('unselect')
      }
    },
    // 高亮
    highlight (highlight=true,selected=false) {
      const node = this.$refs.line.getNode()
      if (highlight) {
        if (selected) {
          node.setAttr('stroke', COLORS[this.lineType].selectedColor)
          node.zIndex(101)
        } else {
          node.setAttr('stroke', COLORS[this.lineType].hoverColor)
          node.zIndex(100)
        }
        node.setAttr('strokeWidth', 5)
      } else {
        node.zIndex(1)
        if (selected) {
          return
        }
        node.setAttr('stroke', COLORS[this.lineType].color)
        node.setAttr('strokeWidth', 4)
      }
    },
    // 初始化
    init () {
      // 初始化颜色
      this.lineConfig.stroke = COLORS[this.lineType].color
      // 初始化线条点
      const points = []
      if (this.start.y !== this.end.y) {
        // 开始位置在左侧
        if (this.end.x - this.start.x > 0) {
          // 附近
          if (this.end.x - this.start.x < 50) {
            this.start.x -= 200
            points.push(this.start.x - 50)
            points.push(this.start.y)
            points.push(this.start.x - 50)
            points.push(this.end.y)
          }
          // 无限远
          else {
            points.push(this.start.x + ((this.end.x - this.start.x) / 2))
            points.push(this.start.y)
            points.push(this.start.x + ((this.end.x - this.start.x) / 2))
            points.push(this.end.y)
          }
        }
        // 开始位置在右侧
        else {
          // 重叠
          if (Math.abs(this.end.x - this.start.x) < 200) {
            this.start.x -= 200
            points.push(this.start.x - 50)
            points.push(this.start.y)
            points.push(this.start.x - 50)
            points.push(this.end.y)
          }
          // 刚好穿过50像素
          else if (Math.abs(this.end.x - this.start.x) < 450) {
            this.end.x += 200
            points.push(this.start.x + 50)
            points.push(this.start.y)
            points.push(this.start.x + 50)
            points.push(this.end.y)
          }
          // 无限远
          else {
            this.start.x -= 200
            this.end.x += 200
            points.push(this.start.x - (Math.abs(this.end.x - this.start.x) / 2))
            points.push(this.start.y)
            points.push(this.start.x - (Math.abs(this.end.x - this.start.x) / 2))
            points.push(this.end.y)
          }
        }
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
