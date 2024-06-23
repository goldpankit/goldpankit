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
// 变量放在data中会导致卡顿
const c = {
  TABLE_WIDTH: 200,
  TABLE_TITLE_HEIGHT: 50,
  TABLE_FIELD_HEIGHT: 30,
  stage: null,
  elementLayer: null,
  // 预览stage
  previewStage: null,
  // 元素layer克隆
  cloneElementLayer: null
}
export default {
  name: 'DesignerV2',
  props: {
    model: {}
  },
  data () {
    return {
      scale: 1,
      elementLayer: null,
      elements: [],
      lines: []
    }
  },
  methods: {
    // 拖拽表
    handleDrop (e) {
      // 获取放下时的鼠标坐标
      c.stage.setPointersPositions(e);
      const mousePos = c.stage.getPointerPosition();
      // 获取到表信息
      c.createTable(this.model.dragData, mousePos.x - 100, mousePos.y)
      // 重新绘制预览
      this.__redrawPreview()
    },
    // 计算关联线坐标点
    computeLinePositions ({ field1, field2, table1, table2 }) {
      let leftTable = table1
      let rightTable = table2
      if (table1.absolutePosition().x > table2.absolutePosition().x) {
        leftTable = table2
        rightTable = table1
      }
      let leftField = field1
      let rightField = field2
      if (field1.absolutePosition().x > field2.absolutePosition().x) {
        leftField = field2
        rightField = field1
      }
      const leftFieldPosition = leftField.absolutePosition()
      const rightFieldPosition = rightField.absolutePosition()
      // 计算两表之间的距离
      const distance = rightFieldPosition.x - leftFieldPosition.x - c.TABLE_WIDTH
      // 计算第一个坐标点
      const firstPoint = [
        0,
        leftFieldPosition.y + 15
      ]
      // - 如果表之间存在距离，则坐标点为右侧 + 宽度
      if (distance > 0) {
        firstPoint[0] = leftFieldPosition.x + c.TABLE_WIDTH
      } else {
        firstPoint[0] = leftFieldPosition.x
      }
      // 计算高度差引起的转弯点
      let turnPoint1 = [...firstPoint]
      let turnPoint2 = [...firstPoint]
      // - 存在高度差
      const heightDifference = Math.abs(rightFieldPosition.y - leftFieldPosition.y)
      if (heightDifference > 0) {
        turnPoint1 = [
          leftFieldPosition.x + c.TABLE_WIDTH + distance / 2,
          leftFieldPosition.y + 15,
        ]
        // - 如果左侧x + 宽度 > 右侧x，则坐标点为左侧x - 30
        if (leftFieldPosition.x + c.TABLE_WIDTH > rightFieldPosition.x) {
          turnPoint1[0] = leftFieldPosition.x - 30
        }
        turnPoint2 = [
          leftFieldPosition.x + c.TABLE_WIDTH + distance / 2,
          rightFieldPosition.y + 15
        ]
        // - 如果左侧x + 宽度 > 右侧x，则坐标点为左侧x - 30
        if (leftFieldPosition.x + c.TABLE_WIDTH > rightFieldPosition.x) {
          turnPoint2[0] = leftFieldPosition.x - 30
        }
      }
      // 计算最后一个坐标点
      const lastPoint = [
        0,
        rightFieldPosition.y + 15
      ]
      // - 如果左侧x+宽度超出右表x+宽度，则为右侧x + 宽度，否则为右侧x
      if (leftFieldPosition.x + c.TABLE_WIDTH > rightFieldPosition.x + c.TABLE_WIDTH) {
        lastPoint[0] = rightFieldPosition.x + c.TABLE_WIDTH
      } else {
        lastPoint[0] = rightFieldPosition.x
      }
      // - 如果坐标点在坐标区域，则坐标点为右侧x + 宽度
      if (lastPoint[0] > leftTable.absolutePosition().x &&
        lastPoint[0] < leftTable.absolutePosition().x + leftTable.width() &&
        lastPoint[1] > leftTable.absolutePosition().y
        && lastPoint[1] < leftTable.absolutePosition().y + leftTable.height()
      ) {
        lastPoint[0] = rightFieldPosition.x + c.TABLE_WIDTH
      }
      return [...firstPoint, ...turnPoint1, ...turnPoint2, ...lastPoint]
    },
    // 重新绘制预览
    __redrawPreview () {
      // 移除layer
      c.cloneElementLayer.destroy()
      // c.previewStage.remove(c.cloneElementLayer)
      // 重新克隆layer并添加
      c.cloneElementLayer = c.elementLayer.clone()
      c.previewStage.add(c.cloneElementLayer)
    }
  },
  mounted () {
    c.stage = new Konva.Stage({
      container: '.stage',
      width: 2000,
      height: 2000,
      draggable: false
    })
    // 添加布局layer
    const backgroundLayer = new Konva.Layer();
    c.stage.add(backgroundLayer);
    // - 添加500个点平均分布
    const cycleLength = 80
    const cycleRadius = 1
    // (总宽 - 总直径) / 数量 + 1
    let distance = (c.stage.width() - cycleLength * cycleRadius * 2) / (cycleLength + 1);
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
    c.elementLayer = new Konva.Layer();
    c.stage.add(c.elementLayer);
    // 当前拖拽的字段
    let currentDragField = null
    let currentTable = null
    // 所有的表
    const tables = []
    // 创建表
    c.createTable = (table, x, y) => {
      // 创建表分组
      const tableGroup = new Konva.Group({
        name: `table_${table.name}_${Math.round(Math.random() * 10000)}`,
        width: c.TABLE_WIDTH,
        height: c.TABLE_TITLE_HEIGHT,
        x,
        y,
        draggable: true,
        zIndex: 1
      })
      tables.push(tableGroup)
      c.elementLayer.add(tableGroup);
      // 创建标题背景
      const titleBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: c.TABLE_WIDTH,
        height: c.TABLE_TITLE_HEIGHT,
        fill: '#17171a',
        stroke: '#ccc',
        strokeWidth: 1
      })
      // 创建标题
      const title = new Konva.Text({
        x: 10,
        y: 3,
        text: table.name,
        fontSize: 20,
        fontFamily: 'Calibri',
        fill: '#fff',
        padding: 10,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffsetX: 10,
        shadowOffsetY: 10,
        shadowOpacity: 0.2,
        width: c.TABLE_WIDTH,
        height: c.TABLE_TITLE_HEIGHT
      })
      // 创建字段
      for (let i = 0; i < table.fields.length; i++) {
        const field = table.fields[i]
        const fieldGroup = new Konva.Group({
          name: 'field',
          x: 0,
          y: titleBackground.height() + c.TABLE_FIELD_HEIGHT * i
        })
        // 背景
        const fieldBackground = new Konva.Rect({
          x: 0,
          y: 0,
          width: c.TABLE_WIDTH,
          height: c.TABLE_FIELD_HEIGHT,
          fill: '#232325',
          stroke: '#ccc',
          strokeWidth: 1
        })
        // 文字
        const fieldText = new Konva.Text({
          x: 25,
          y: 0,
          text: field.name,
          fontSize: 14,
          fontFamily: 'Calibri',
          fill: '#fff',
          height: c.TABLE_FIELD_HEIGHT,
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
        // 为拖拽小球添加鼠标按下事件，将对象记录至currentDragField
        fieldDragBall.on('mousedown', () => {
          tableGroup.draggable(false)
          c.stage.draggable(false)
          currentDragField = fieldGroup
          currentTable = tableGroup
        })
        // 悬浮在拖拽小球上时修改鼠标样式
        fieldDragBall.on('mouseover', () => {
          c.stage.container().style.cursor = 'pointer'
        })
        // 为字段组添加鼠标悬浮事件
        fieldGroup.on('mouseover', () => {
          // 当currentDragField不为null时，修改背景色为红色
          if (currentDragField && currentTable !== tableGroup) {
            fieldBackground.fill('#fc6a70')
          }
        })
        // 为字段组添加鼠标离开事件
        fieldGroup.on('mouseout', () => {
          // 当currentDragField不为null时，恢复背景色
          if (currentDragField) {
            fieldBackground.fill('#232325')
          }
        })
        // 为字段组添加鼠标松开事件
        fieldGroup.on('mouseup', () => {
          // 当currentDragField不为null时，从currentDragField绘制箭头到当前小球位置
          if (currentDragField && currentTable !== tableGroup) {
            // 绘制箭头
            const points = this.computeLinePositions({
              field1: currentDragField,
              field2: fieldGroup,
              table1: currentTable,
              table2: tableGroup
            })
            currentDragField.__line = fieldGroup.__line = {
              table1: currentTable,
              field1: currentDragField,
              table2: tableGroup,
              field2: fieldGroup,
              line: new Konva.Line({
                name: `line_${Math.round(Math.random() * 10000)}`,
                points: points,
                stroke: '#fc6a70',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
              })
            }
            // 添加到layer
            c.elementLayer.add(currentDragField.__line.line);
            // 恢复背景色
            fieldBackground.fill('#232325')
            // 重新绘制预览
            this.__redrawPreview()
          }
        })
        // 添加到字段分组
        fieldGroup.add(fieldBackground);
        fieldGroup.add(fieldText);
        fieldGroup.add(fieldDragBall);
        // 添加到表
        tableGroup.add(fieldGroup);
        tableGroup.height(tableGroup.height() + c.TABLE_FIELD_HEIGHT)
      }
      // 添加到表分组
      tableGroup.add(titleBackground);
      tableGroup.add(title);
      // 为表添加拖拽移动事件
      tableGroup.on('dragmove', () => {
        const fields = tableGroup.find('.field')
        fields.forEach((field) => {
          // 调整箭头位置
          if (field.__line) {
            field.__line.line.points(this.computeLinePositions(field.__line));
          }
        })
      })
      // 松开表拖拽
      // tableGroup.on('dragend', () => {
      // })
    }
    // 创建一条隐藏的虚线
    const line = new Konva.Line({
      name: 'dash_line',
      points: [0, 0, 0, 0],
      stroke: '#fc6a70',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [10, 10]
    })
    c.elementLayer.add(line);

    // 添加预览stage
    c.previewStage = new Konva.Stage({
      container: '.preview-stage',
      width: 200,
      height: 200,
      scaleX: 1 / 10,
      scaleY: 1 / 10,
    })
    c.cloneElementLayer = c.elementLayer.clone({ listening: false });
    c.previewStage.add(c.cloneElementLayer)
    // - 更新预览内容
    function updatePreview() {
      // 找到所有节点，更新节点的位置
      c.elementLayer.children.forEach((shape) => {
        const clone = c.cloneElementLayer.findOne('.' + shape.name());
        clone.position(shape.position());
        if (clone instanceof Konva.Line) {
          clone.points(shape.points());
          clone.strokeWidth(2)
        }
        console.log('clone', clone)
      })
    }
    c.stage.on('dragmove', updatePreview);

    // 滚动缩放处理
    const scaleBy = 1.05;
    c.stage.on('wheel', (e) => {
      if (!e.evt.ctrlKey) {
        return
      }
      // 阻止默认事件，防止页面滚动
      e.evt.preventDefault();
      const oldScale = c.elementLayer.scaleX()
      const pointer = c.stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - c.elementLayer.x()) / oldScale,
        y: (pointer.y - c.elementLayer.y()) / oldScale,
      };
      // 计算新的缩放比例
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      if (newScale > 3 || newScale < 0.2) {
        return
      }
      c.elementLayer.scale({ x: newScale, y: newScale });
      c.cloneElementLayer.scale({ x: newScale, y: newScale });
      // 缩放时重新计算坐标并赋值
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      c.elementLayer.position(newPos);
      c.cloneElementLayer.position(newPos);
    })

    // 鼠标松开
    c.stage.on('mouseup touchend', (e) => {
      // 设置所有的表均可拖动
      tables.forEach(table => table.draggable(true))
      // 清空拖拽字段
      currentDragField = null
      // 隐藏虚线
      line.points([0, 0, 0, 0])
    })

    // 鼠标移动
    c.stage.on('mousemove touchmove', (e) => {
      // 如果存在currentDragField，则将隐藏的虚线line绘制到鼠标移动的当前位置
      if (currentDragField) {
        // 获取currentDragField的在c.stage中的x和y
        const pos = c.stage.getPointerPosition();
        // console.log('mouse', pos)
        // console.log('currentDragField x', currentDragField.absolutePosition().x)
        // console.log('scale', c.elementLayer.scale())
        line.scale({ x: 1 / c.elementLayer.scale().x, y: 1 / c.elementLayer.scale().y })
        line.zIndex(10000)
        line.points([
          // 第一个点坐标
          currentDragField.absolutePosition().x,
          currentDragField.absolutePosition().y,
          // 当前鼠标位置
          pos.x,
          pos.y
        ])
      }
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
