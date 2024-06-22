<template>
  <div
    class="designer-v2"
    @dragover.prevent
    @drop="handleDrop($event, 1)"
  >
    <div class="stage"></div>
    <div class="preview-stage"></div>
  </div>
</template>

<script>
import Konva from 'konva'
export default {
  name: 'DesignerV2',
  props: {
    model: {}
  },
  data () {
    return {
      scale: 1,
      elementLayer: null,
      elements: []
    }
  },
  methods: {
    // 拖拽表
    handleDrop () {
      // 获取到表信息
      console.log(this.model.dragData)
    }
  },
  mounted () {
    const stage = new Konva.Stage({
      container: '.stage',
      width: 2000,
      height: 2000,
      draggable: true
    })
    // 添加布局layer
    const backgroundLayer = new Konva.Layer();
    stage.add(backgroundLayer);
    // - 添加500个点平均分布
    const cycleLength = 80
    const cycleRadius = 1
    // (总宽 - 总直径) / 数量 + 1
    let distance = (stage.width() - cycleLength * cycleRadius * 2) / (cycleLength + 1);
    for (let i = 0; i < cycleLength; i++) {
      for (let j = 0; j < cycleLength; j++) {
        const ball = new Konva.Circle({
          // (间距 + 直径) * i + 间距
          x: (distance + cycleRadius * 2) * j + distance,
          y: (distance + cycleRadius * 2) * i + distance,
          radius: cycleRadius,
          fill: '#55555',
          draggable: true,
          zIndex: 1
        });
        backgroundLayer.add(ball);
      }
    }

    // 添加内容布局
    window.elementLayer = new Konva.Layer();
    stage.add(elementLayer);

    // 当前拖拽的字段
    let currentDragField = null
    // 所有的表
    const tables = []
    // 创建表
    function createTable (name, x, y) {
      const table = new Konva.Group({
        name: 'table',
        x,
        y,
        draggable: true
      })
      tables.push(table)
      elementLayer.add(table);
      // 创建标题背景
      const titleBackground = new Konva.Rect({
        name: 'a' + Math.round(Math.random() * 10000),
        x: 0,
        y: 0,
        width: 200,
        height: 50,
        fill: '#17171a',
        stroke: '#ccc',
        strokeWidth: 1
      })
      // 创建标题
      const title = new Konva.Text({
        name: 'a' + Math.round(Math.random() * 10000),
        x: 10,
        y: 3,
        text: name,
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: '#fff',
        padding: 10,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        width: 200,
        height: 50
      })
      // 创建字段
      const fields = ['name', 'gender', 'mobile', 'email', 'address']
      const fieldHeight = 30
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const fieldGroup = new Konva.Group({
          name: 'a' + Math.round(Math.random() * 10000),
          x: 0,
          y: titleBackground.height() + fieldHeight * i
        })
        // 背景
        const fieldBackground = new Konva.Rect({
          name: 'a' + Math.round(Math.random() * 10000),
          x: 0,
          y: 0,
          width: 200,
          height: fieldHeight,
          fill: '#232325',
          stroke: '#ccc',
          strokeWidth: 1
        })
        // 文字
        const fieldText = new Konva.Text({
          name: 'a' + Math.round(Math.random() * 10000),
          x: 25,
          y: 0,
          text: field,
          fontSize: 14,
          fontFamily: 'Calibri',
          fill: '#fff',
          height: fieldHeight,
          lineHeight: 2
        })
        // 拖拽小球
        const fieldDragBall = new Konva.Circle({
          name: 'a' + Math.round(Math.random() * 10000),
          x: 15,
          y: 15,
          radius: 4,
          fill: '#00D2FF'
        })
        fieldGroup.add(fieldBackground);
        fieldGroup.add(fieldText);
        fieldGroup.add(fieldDragBall);
        table.add(fieldGroup);
        // 为拖拽小球添加鼠标按下事件，将对象记录至currentDragField
        fieldDragBall.on('mousedown', () => {
          table.draggable(false)
          stage.draggable(false)
          currentDragField = fieldDragBall
        })
        // 悬浮在拖拽小球上时修改鼠标样式
        fieldDragBall.on('mouseover', () => {
          stage.container().style.cursor = 'pointer'
        })
      }
      table.add(titleBackground);
      table.add(title);
    }
    createTable('user', 100, 100)
    createTable('role', 400, 100)
    // 创建一条隐藏的虚线
    const line = new Konva.Line({
      name: 'a' + Math.round(Math.random() * 10000),
      points: [0, 0, 0, 0],
      stroke: '#fc6a70',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [10, 10]
    })
    elementLayer.add(line);

    // 添加预览stage
    const previewStage = new Konva.Stage({
      container: '.preview-stage',
      width: 200,
      height: 200,
      scaleX: 1 / 10,
      scaleY: 1 / 10,
    })
    const cloneElementLayout = elementLayer.clone({ listening: false });
    previewStage.add(cloneElementLayout)
    // - 更新预览内容
    function updatePreview() {
      // 找到所有节点，更新节点的位置
      elementLayer.children.forEach((shape) => {
        const clone = cloneElementLayout.findOne('.' + shape.name());
        clone.position(shape.position());
      })
    }
    stage.on('dragmove', updatePreview);

    // 滚动缩放处理
    const scaleBy = 1.05;
    stage.on('wheel', (e) => {
      if (!e.evt.ctrlKey) {
        return
      }
      // 阻止默认事件，防止页面滚动
      e.evt.preventDefault();
      const oldScale = elementLayer.scaleX()
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - elementLayer.x()) / oldScale,
        y: (pointer.y - elementLayer.y()) / oldScale,
      };
      // 计算新的缩放比例
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      if (newScale > 3 || newScale < 0.2) {
        return
      }
      elementLayer.scale({ x: newScale, y: newScale });
      cloneElementLayout.scale({ x: newScale, y: newScale });
      // 缩放时重新计算坐标并赋值
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      elementLayer.position(newPos);
      cloneElementLayout.position(newPos);
    })

    // 鼠标松开
    stage.on('mouseup touchend', (e) => {
      // 设置stage和所有的表均可拖动
      stage.draggable(true)
      tables.forEach(table => table.draggable(true))
      // 清空拖拽字段
      currentDragField = null
      // 隐藏虚线
      line.points([0, 0, 0, 0])
    })

    // 鼠标移动
    stage.on('mousemove touchmove', (e) => {
      // 如果存在currentDragField，则将隐藏的虚线line绘制到鼠标移动的当前位置
      if (currentDragField) {
        // 获取currentDragField的在stage中的x和y
        const pos = stage.getPointerPosition();
        line.points([
          // 第一个点坐标
          currentDragField.absolutePosition().x - stage.x(),
          currentDragField.absolutePosition().y - stage.y(),
          // 当前鼠标位置
          pos.x - stage.x(),
          pos.y - stage.y()
        ])
      }
    })

    // 接收拖拽内容
    stage.on('drop', (e) => {
      console.log('e', e)
    })
  }
}
</script>

<style scoped lang="scss">
.designer-v2 {
  width: 100%;
  height: 100%;
  overflow: auto;
  .preview-stage {
    background-color: rgba(0,0,0,.2);
    border-radius: 10px;
    position: absolute;
    top: 20px;
    right: 30px;
  }
}
</style>
