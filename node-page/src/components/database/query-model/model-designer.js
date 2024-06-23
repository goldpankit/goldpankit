import Konva from 'konva'

class ModelDesigner {
  TABLE_WIDTH = 200
  TABLE_TITLE_HEIGHT = 50
  TABLE_FIELD_HEIGHT = 30
  // 画布基础信息
  stageWidth = 2000
  stageHeight = 2000
  stageContainer = null
  // 画布
  stage = null
  // 虚线
  dashLine = null
  // 表元素
  tables = []
  // 元素layer，存放表和关联线
  elementLayer = null
  // 预览stage
  previewStage = null
  // 元素layer克隆，用于预览
  cloneElementLayer = null
  // 当前拖动的字段信息
  currentDragField = null
  // 当前拖动的表信息
  currentDragTable = null
  // 事件
  events = {}

  constructor(container, width, height) {
    this.stageContainer = container
    this.stageWidth = width
    this.stageHeight = height
    this.#init()
  }

  /**
   * 初始化
   */
  #init ()  {
    // 创建stage
    this.stage = new Konva.Stage({
      container: this.stageContainer,
      width: this.stageWidth,
      height: this.stageHeight,
      draggable: false
    })
    this.redraw()
    // 鼠标点击
    this.stage.on('click', e => {
      this.events['stage:click'] && this.events['stage:click'](e)
    })
    // 鼠标松开处理
    this.stage.on('mouseup touchend', () => {
      // 设置所有的表均可拖动
      this.tables.forEach(table => table.draggable(true))
      // 清空拖拽字段
      this.currentDragTable = null
      this.currentDragField = null
      // 隐藏虚线
      this.dashLine.points([0, 0, 0, 0])
    })
    // 鼠标移动
    this.stage.on('mousemove touchmove', () => {
      // 如果存在拖动元素，则绘制虚线
      if (!this.currentDragTable || !this.currentDragField) {
        return
      }
      // 找到table
      const tableGroup = this.elementLayer.findOne(`#${this.currentDragTable.id}`)
      console.log('tableGroup', tableGroup)
      if (tableGroup == null) {
        return
      }
      // 找到字段
      const fieldGroup = tableGroup.findOne(`#${this.currentDragField.name}`)
      console.log('fieldGroup', fieldGroup)
      if (fieldGroup == null) {
        return
      }
      // 获取this.currentDragField的在this.stage中的x和y
      const pos = this.stage.getPointerPosition()
      this.dashLine.scale({ x: 1 / this.elementLayer.scale().x, y: 1 / this.elementLayer.scale().y })
      this.dashLine.zIndex(10000)
      this.dashLine.points([
        // 第一个点坐标
        fieldGroup.absolutePosition().x + 15,
        fieldGroup.absolutePosition().y + 15,
        // 当前鼠标位置
        pos.x,
        pos.y
      ])
    })
  }

  /**
   * 创建背景
   */
  createBackground () {
    const backgroundLayer = new Konva.Layer()
    this.stage.add(backgroundLayer)
    // - 添加500个点平均分布
    const cycleLength = 80
    const cycleRadius = 1
    // (总宽 - 总直径) / 数量 + 1
    let distance = (this.stage.width() - cycleLength * cycleRadius * 2) / (cycleLength + 1)
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
        })
        backgroundLayer.add(ball)
      }
    }
  }

  /**
   * 创建表
   * @param table
   * @param x
   * @param y
   * @returns {Group}
   */
  createTable (table, x, y) {
    // 创建表分组
    const tableGroup = new Konva.Group({
      id: table.id,
      name: `table_${table.name}_${Math.round(Math.random() * 10000)}`,
      width: this.TABLE_WIDTH,
      height: this.TABLE_TITLE_HEIGHT,
      x,
      y,
      draggable: true,
      zIndex: 10
    })
    this.tables.push(tableGroup)
    this.elementLayer.add(tableGroup)
    // 创建标题背景
    const titleBackground = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.TABLE_WIDTH,
      height: this.TABLE_TITLE_HEIGHT,
      fill: '#17171a',
      stroke: '#ccc',
      strokeWidth: 1,
      // 添加变宽圆弧
      cornerRadius: [10, 10, 0, 0],
      cornerStrokeWidth: 1,
      cornerStroke: '#ccc'
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
      width: this.TABLE_WIDTH,
      height: this.TABLE_TITLE_HEIGHT
    })
    // 创建字段
    for (let i = 0; i < table.fields.length; i++) {
      const field = table.fields[i]
      const fieldGroup = new Konva.Group({
        id: field.name,
        name: 'field',
        x: 0,
        y: titleBackground.height() + this.TABLE_FIELD_HEIGHT * i
      })
      // 背景
      const fieldBackground = new Konva.Rect({
        name: 'background',
        x: 0,
        y: 0,
        width: this.TABLE_WIDTH,
        height: this.TABLE_FIELD_HEIGHT,
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
        height: this.TABLE_FIELD_HEIGHT,
        lineHeight: 2
      })
      // 拖拽小球
      const fieldDragBall = new Konva.Circle({
        name: 'a' + Math.round(Math.random() * 10000),
        x: 15,
        y: 15,
        radius: 4,
        fill: '#008fab'
      })
      // 为拖拽小球添加鼠标按下事件，将对象记录至this.currentDragField
      fieldDragBall.on('mousedown', () => {
        tableGroup.draggable(false)
        this.stage.draggable(false)
        this.currentDragField = field
        this.currentDragTable = table
      })
      // 悬浮在拖拽小球上时修改鼠标样式
      fieldDragBall.on('mouseover', () => {
        fieldDragBall.fill('#00d8ff')
      })
      // 鼠标离开小球
      fieldDragBall.on('mouseout', () => {
        fieldDragBall.fill('#008fab')
      })
      // 为字段组添加鼠标悬浮事件
      fieldGroup.on('mouseover', () => {
        // 当this.currentDragField不为null时，修改背景色为红色
        if (this.currentDragField && this.currentDragTable !== table) {
          fieldBackground.fill('#fc6a70')
        }
      })
      // 为字段组添加鼠标离开事件
      fieldGroup.on('mouseout', () => {
        // 当this.currentDragField不为null时，恢复背景色
        if (this.currentDragField) {
          fieldBackground.fill('#232325')
        }
      })
      // 为字段组添加鼠标松开事件
      fieldGroup.on('mouseup', () => {
        // 当this.currentDragField不为null时，从this.currentDragField绘制箭头到当前小球位置
        if (!this.currentDragField || this.currentDragTable === table) {
          return
        }
        this.createLine({
          table: this.currentDragTable,
          field: this.currentDragField,
          targetTable: table,
          targetField: field,
          targetFieldBackgroundRect: fieldBackground
        })
        // 触发line:created事件
        this.events['line:created'] && this.events['line:created']({
          table: this.currentDragTable,
          field: this.currentDragField,
          targetTable: table,
          targetField: field
        })
      })
      // 添加到字段分组
      fieldGroup.add(fieldBackground)
      fieldGroup.add(fieldText)
      fieldGroup.add(fieldDragBall)
      // 添加到表
      tableGroup.add(fieldGroup)
      tableGroup.height(tableGroup.height() + this.TABLE_FIELD_HEIGHT)
    }
    // 添加到表分组
    tableGroup.add(titleBackground)
    tableGroup.add(title)
    // 为表添加鼠标离开事件，恢复鼠标样式
    tableGroup.on('mouseleave', () => {
      this.stage.container().style.cursor = 'default'
    })
    // 为表添加鼠标进入事件
    tableGroup.on('mouseover', (e) => {
      // 悬浮在小球上，更改鼠标样式为手指
      if (e.target instanceof Konva.Circle) {
        this.stage.container().style.cursor = 'pointer'
      }
      // 更改鼠标样式为可拖动
      else {
        this.stage.container().style.cursor = 'move'
      }
    })
    // 为表添加拖拽移动事件
    tableGroup.on('dragmove', () => {
      const fields = tableGroup.find('.field')
      fields.forEach((field) => {
        // 调整箭头位置
        if (field.__line) {
          field.__line.line.points(this.computeLinePoints(field.__line))
        }
      })
      table.x = tableGroup.absolutePosition().x
      table.y = tableGroup.absolutePosition().y
      // 触发change事件
      this.events.change && this.events.change(table)
    })
    // 为表添加双击事件
    tableGroup.on('dblclick', (e) => {
      // 触发dblclick事件
      this.events['table:dblclick'] && this.events['table:dblclick']({
        event: e,
        table,
        tableGroup
      })
    })
    return tableGroup
  }

  /**
   * 创建关联线
   * @param field
   * @param targetField
   * @param table
   * @param targetTable
   * @param targetFieldBackgroundRect
   * @param isInit
   */
  createLine = ({ field, targetField, table, targetTable, targetFieldBackgroundRect }) => {
    // 找到表对象和字段对象
    const tableGroup = this.elementLayer.findOne(`#${table.id}`)
    const targetTableGroup = this.elementLayer.findOne(`#${targetTable.id}`)
    const fieldGroup = tableGroup.findOne(`#${field.name}`)
    const targetFieldGroup = targetTableGroup.findOne(`#${targetField.name}`)
    // 计算线坐标点
    const points = this.computeLinePoints({
      table1: tableGroup,
      field1: fieldGroup,
      table2: targetTableGroup,
      field2: targetFieldGroup
    })
    const line = fieldGroup.__line = targetFieldGroup.__line = {
      table1: tableGroup,
      field1: fieldGroup,
      table2: tableGroup,
      field2: targetFieldGroup,
      line: new Konva.Line({
        name: `line_${Math.round(Math.random() * 10000)}`,
        points: points,
        stroke: '#cccccc',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        zIndex: 1
      })
    }
    // 添加到layer
    line.line.zIndex(1)
    this.elementLayer.add(line.line)
    // 恢复背景色
    if (targetFieldBackgroundRect) {
      targetFieldBackgroundRect.fill('#232325')
    }
    // 重新绘制预览
    this.redrawPreview()
  }

  /**
   * 创建预览stage
   * @param container
   * @param width
   * @param height
   * @param scaleX
   * @param scaleY
   */
  createPreview (container, width = 200, height = 200, scaleX = 1/10, scaleY = 1/10) {
    this.previewStage = new Konva.Stage({
      container,
      width,
      height,
      scaleX,
      scaleY,
    })
    this.redrawPreview()
    // 监听拖动，触发更新
    this.stage.on('dragmove', () => {
      // 找到所有节点，更新节点的位置
      this.elementLayer.children.forEach((shape) => {
        const clone = this.cloneElementLayer.findOne('.' + shape.name())
        clone.position(shape.position())
        if (clone instanceof Konva.Line) {
          clone.points(shape.points())
          clone.strokeWidth(2)
        }
      })
    })
  }

  /**
   * 初始化自动缩放
   */
  initAutoSize () {
    // 滚动缩放处理
    const scaleBy = 1.05
    this.stage.on('wheel', (e) => {
      if (!e.evt.ctrlKey) {
        return
      }
      // 阻止默认事件，防止页面滚动
      e.evt.preventDefault()
      const oldScale = this.elementLayer.scaleX()
      const pointer = this.stage.getPointerPosition()
      const mousePointTo = {
        x: (pointer.x - this.elementLayer.x()) / oldScale,
        y: (pointer.y - this.elementLayer.y()) / oldScale,
      }
      // 计算新的缩放比例
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy
      if (newScale > 3 || newScale < 0.2) {
        return
      }
      this.elementLayer.scale({ x: newScale, y: newScale })
      this.cloneElementLayer.scale({ x: newScale, y: newScale })
      // 缩放时重新计算坐标并赋值
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }
      this.elementLayer.position(newPos)
      this.cloneElementLayer.position(newPos)
    })
  }

  /**
   * 重绘
   */
  redraw () {
    this.tables = []
    // 销毁并创建新的元素layer
    if (this.elementLayer) {
      this.elementLayer.destroy()
    }
    this.elementLayer = new Konva.Layer()
    this.stage.add(this.elementLayer)
    // 创建一条隐藏的虚线
    this.dashLine = new Konva.Line({
      name: 'dash_line',
      points: [0, 0, 0, 0],
      stroke: '#fc6a70',
      strokeWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [10, 10]
    })
    // 添加到新的layer中
    this.elementLayer.add(this.dashLine)
  }

  /**
   * 重绘预览
   */
  redrawPreview = () => {
    // 销毁clone的元素layer
    if (this.cloneElementLayer) {
      this.cloneElementLayer.destroy()
    }
    // 重新克隆元素layer并添加到预览stage
    this.cloneElementLayer = this.elementLayer.clone()
    this.previewStage.add(this.cloneElementLayer)
  }

  /**
   * 计算关联线坐标点
   * @param field1
   * @param field2
   * @param table1
   * @param table2
   * @returns {number[]}
   */
  computeLinePoints ({ field1, field2, table1, table2 }) {
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
    const distance = rightFieldPosition.x - leftFieldPosition.x - this.TABLE_WIDTH
    // 计算第一个坐标点
    const firstPoint = [
      0,
      leftFieldPosition.y + 15
    ]
    // - 如果表之间存在距离，则坐标点为右侧 + 宽度
    if (distance > 0) {
      firstPoint[0] = leftFieldPosition.x + this.TABLE_WIDTH
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
        leftFieldPosition.x + this.TABLE_WIDTH + distance / 2,
        leftFieldPosition.y + 15,
      ]
      // - 如果左侧x + 宽度 > 右侧x，则坐标点为左侧x - 30
      if (leftFieldPosition.x + this.TABLE_WIDTH > rightFieldPosition.x) {
        turnPoint1[0] = leftFieldPosition.x - 30
      }
      turnPoint2 = [
        leftFieldPosition.x + this.TABLE_WIDTH + distance / 2,
        rightFieldPosition.y + 15
      ]
      // - 如果左侧x + 宽度 > 右侧x，则坐标点为左侧x - 30
      if (leftFieldPosition.x + this.TABLE_WIDTH > rightFieldPosition.x) {
        turnPoint2[0] = leftFieldPosition.x - 30
      }
    }
    // 计算最后一个坐标点
    const lastPoint = [
      0,
      rightFieldPosition.y + 15
    ]
    // - 如果左侧x+宽度超出右表x+宽度，则为右侧x + 宽度，否则为右侧x
    if (leftFieldPosition.x + this.TABLE_WIDTH > rightFieldPosition.x + this.TABLE_WIDTH) {
      lastPoint[0] = rightFieldPosition.x + this.TABLE_WIDTH
    } else {
      lastPoint[0] = rightFieldPosition.x
    }
    // - 如果坐标点在坐标区域，则第一个坐标点为左表右侧x+宽度，最后坐标点为右表右侧x + 宽度
    if (lastPoint[0] > leftTable.absolutePosition().x &&
      lastPoint[0] < leftTable.absolutePosition().x + leftTable.width() &&
      lastPoint[1] > leftTable.absolutePosition().y
      && lastPoint[1] < leftTable.absolutePosition().y + leftTable.height()
    ) {
      firstPoint[0] = leftFieldPosition.x + this.TABLE_WIDTH
      lastPoint[0] = rightFieldPosition.x + this.TABLE_WIDTH
      // 转弯点的x = 右侧表x + 30
      turnPoint1[0] = rightFieldPosition.x + this.TABLE_WIDTH + 30
      turnPoint2[0] = rightFieldPosition.x + this.TABLE_WIDTH + 30
    }
    return [...firstPoint, ...turnPoint1, ...turnPoint2, ...lastPoint]
  }

  /**
   * 绑定事件
   * @param eventName 事件名称
   * @param callback 事件处理器
   */
  on(eventName, callback) {
    this.events[eventName] = callback
  }
}
export default ModelDesigner
