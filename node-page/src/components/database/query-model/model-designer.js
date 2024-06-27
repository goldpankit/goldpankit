import Konva from 'konva'

class ModelDesigner {
  #lineType = 'join'
  BACKGROUND_ITEM_COLOR = '#555'
  TABLE_MIN_DISTANCE = 50 // 关联表之间最大的间距
  TABLE_WIDTH = 200
  TABLE_TITLE_HEIGHT = 40
  TABLE_FIELD_HEIGHT = 30
  TABLE_TITLE_BACKGROUND_COLOR = '#fc6a70'
  SUB_TABLE_TITLE_BACKGROUND_COLOR = '#2e3444'
  TABLE_FIELD_BACKGROUND_COLOR = '#fff'
  TABLE_FIELD_BORDER_COLOR = '#ccc'
  TABLE_FIELD_HOVER_BACKGROUND_COLOR = '#f0f0f0'
  TABLE_FIELD_DRAG_BALL_BACKGROUND_COLOR = '#4a536e'
  TABLE_FIELD_DRAG_BALL_HOVER_BACKGROUND_COLOR = '#90a1d7'
  TABLE_OPERA_BACKGROUND_COLOR = '#f7f7f7'
  TABLE_BUTTON_BACKGROUND_COLOR = '#cb5053'
  TABLE_BUTTON_HOVER_BACKGROUND_COLOR = '#fc6a70'
  TABLE_Z_INDEX = 100
  LINE_COLOR = '#394054'
  LINE_HOVER_COLOR = '#fc6a70'
  LINE_CONTROL_COLOR = '#999'
  LINE_CONTROL_HOVER_COLOR = '#fc6a70'
  LINE_AGG_CONTROL_COLOR = '#3e74ea' // 聚合线控制点颜色
  DEFAULT_FONT_COLOR = '#333'
  MAX_Z_INDEX = 10000
  REVERSE_FONT_COLOR = '#fff'
  FONT_SIZE_TITLE = 16
  // 画布基础信息
  stageWidth = null
  stageHeight = null
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
  // 当前拖动是否结束（不可以直接使用当前拖动的字段信息或表信息替代，拖拽的信息在完成拖拽时会延迟清空，导致在延迟时间内移动鼠标产生绘制线）
  isDragEnd = false
  // 事件
  events = {}

  constructor(container, width = 3500, height = 2000) {
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
    // 鼠标移动
    this.stage.on('mousemove', () => {
      // 不存在拖动元素，直接返回
      if (this.isDragEnd || !this.currentDragTable || !this.currentDragField) {
        return
      }
      // 绘制虚线
      // - 找到table
      const tableGroup = this.elementLayer.findOne(`#${this.currentDragTable.id}`)
      if (tableGroup == null) {
        return
      }
      // - 找到字段
      const fieldGroup = tableGroup.findOne(`#${this.currentDragField.name}`)
      if (fieldGroup == null) {
        return
      }
      // - 获取this.currentDragField的x和y
      const pos = this.stage.getPointerPosition()
      this.dashLine.zIndex(this.MAX_Z_INDEX)
      this.dashLine.opacity(1)
      this.dashLine.points([
        // 第一个点坐标
        fieldGroup.absolutePosition().x + 15,
        fieldGroup.absolutePosition().y + 15,
        // 当前鼠标位置
        pos.x,
        pos.y
      ])
    })
    // 鼠标松开处理
    this.stage.on('mouseup', () => {
      // 设置所有的表均可拖动
      this.tables.forEach(table => table.draggable(true))
      // 隐藏虚线
      this.dashLine.points([0, 0, 0, 0])
      this.dashLine.opacity(0)
      // 标记为拖动结束，使鼠标移动时不再绘制虚线
      this.isDragEnd = true
      // 清空拖拽字段，此处延迟50毫秒，避免字段组先监听到鼠标松开，导致获取不到拖拽元素引起关联字段失败
      setTimeout(() => {
        this.currentDragTable = null
        this.currentDragField = null
      }, 50)
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
          fill: this.BACKGROUND_ITEM_COLOR,
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
      height: this.TABLE_TITLE_HEIGHT + 20,
      x,
      y,
      draggable: true,
      zIndex: this.TABLE_Z_INDEX
    })
    // 创建表背景
    const background = new Konva.Rect({
      width: this.TABLE_WIDTH,
      height: this.TABLE_TITLE_HEIGHT + 20,
      x: 0,
      y: -20,
      fill: this.TABLE_OPERA_BACKGROUND_COLOR,
      stroke: this.TABLE_FIELD_BORDER_COLOR,
      strokeWidth: 1,
      // 添加圆弧
      cornerRadius: [10, 10, 10, 10],
      cornerStrokeWidth: 1,
      cornerStroke: this.TABLE_FIELD_BORDER_COLOR
    })
    tableGroup.add(background)
    // 创建删除按钮
    const deleteButton = new Konva.Circle({
      x: tableGroup.width() - 15,
      y: -10,
      radius: 5,
      fill: this.TABLE_BUTTON_BACKGROUND_COLOR,
      draggable: false,
    })
    deleteButton.on('click', () => {
      this.events['table:delete'] && this.events['table:delete']({
        table,
        tableGroup
      })
    })
    deleteButton.on('mouseover', () => {
      deleteButton.fill(this.TABLE_BUTTON_HOVER_BACKGROUND_COLOR)
    })
    deleteButton.on('mouseout', () => {
      deleteButton.fill(this.TABLE_BUTTON_BACKGROUND_COLOR)
    })
    tableGroup.add(deleteButton)
    // 创建标题背景
    const titleBackground = new Konva.Rect({
      x: -2,
      y: 0,
      width: this.TABLE_WIDTH + 4,
      height: this.TABLE_TITLE_HEIGHT,
      fill: table.type === 'MAIN' ? this.TABLE_TITLE_BACKGROUND_COLOR : this.SUB_TABLE_TITLE_BACKGROUND_COLOR,
      stroke: table.type === 'MAIN' ? this.TABLE_TITLE_BACKGROUND_COLOR : this.SUB_TABLE_TITLE_BACKGROUND_COLOR,
      strokeWidth: 1
    })
    // 创建标题
    const title = new Konva.Text({
      x: 10,
      y: 5,
      text: table.name,
      fontSize: this.FONT_SIZE_TITLE,
      fontStyle: 'bold',
      fill: this.REVERSE_FONT_COLOR,
      width: this.TABLE_WIDTH,
      height: this.TABLE_TITLE_HEIGHT,
      lineHeight: 2
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
      let cornerRadius = [0, 0, 0, 0]
      if (i === table.fields.length - 1) {
        cornerRadius = [0, 0, 10, 10]
      }
      const fieldBackground = new Konva.Rect({
        name: 'background',
        x: 0,
        y: 0,
        width: this.TABLE_WIDTH,
        height: this.TABLE_FIELD_HEIGHT,
        fill: this.TABLE_FIELD_BACKGROUND_COLOR,
        stroke: this.TABLE_FIELD_BORDER_COLOR,
        strokeWidth: 0.5,
        cornerRadius,
        cornerStrokeWidth: 0.5,
        cornerStroke: '#ccc'
      })
      // 文字
      const fieldText = new Konva.Text({
        x: 25,
        y: 0,
        text: field.name,
        fontSize: 14,
        fontFamily: 'Calibri',
        fill: this.DEFAULT_FONT_COLOR,
        height: this.TABLE_FIELD_HEIGHT,
        lineHeight: 2
      })
      // 拖拽小球
      const fieldDragBall = new Konva.Circle({
        name: 'a' + Math.round(Math.random() * 10000),
        x: 15,
        y: 15,
        radius: 4,
        fill: this.TABLE_FIELD_DRAG_BALL_BACKGROUND_COLOR
      })
      // 为拖拽小球添加鼠标按下事件，将对象记录至this.currentDragField
      fieldDragBall.on('mousedown', () => {
        tableGroup.draggable(false)
        this.stage.draggable(false)
        // 标记为拖拽结束为false
        this.isDragEnd = false
        // 记录当前拖动的元素
        this.currentDragField = field
        this.currentDragTable = table
      })
      // 悬浮在拖拽小球上时修改鼠标样式
      fieldDragBall.on('mouseover', () => {
        fieldDragBall.fill(this.TABLE_FIELD_DRAG_BALL_HOVER_BACKGROUND_COLOR)
      })
      // 鼠标离开小球
      fieldDragBall.on('mouseout', () => {
        fieldDragBall.fill(this.TABLE_FIELD_DRAG_BALL_BACKGROUND_COLOR)
      })
      // 为字段组添加鼠标悬浮事件
      fieldGroup.on('mouseover', () => {
        // 当this.currentDragField不为null时，修改背景色
        if (this.currentDragField && this.currentDragTable !== table) {
          fieldBackground.fill(this.TABLE_FIELD_HOVER_BACKGROUND_COLOR)
        }
      })
      // 为字段组添加鼠标离开事件
      fieldGroup.on('mouseout', () => {
        // 当this.currentDragField不为null时，恢复背景色
        if (this.currentDragField) {
          fieldBackground.fill(this.TABLE_FIELD_BACKGROUND_COLOR)
        }
      })
      // 为字段组添加鼠标松开事件
      fieldGroup.on('mouseup', () => {
        // 当this.currentDragField不为null时，从this.currentDragField绘制箭头到当前小球位置
        if (!this.currentDragField || this.currentDragTable === table) {
          return
        }
        // 创建关联线
        this.createLine({
          table: this.currentDragTable,
          field: this.currentDragField,
          targetTable: table,
          targetField: field,
          targetFieldBackgroundRect: fieldBackground
        })
          .then(() => {
            try { // 触发line:created事件
              this.events['line:created'] && this.events['line:created']({
                table: this.currentDragTable,
                field: this.currentDragField,
                targetTable: table,
                targetField: field
              })
            } catch (e) {
              throw e
            }
          })
          .catch(e => {
            console.error('创建关联线出现错误', e)
            // 触发line:create:error事件
            this.events['line:create:error'] && this.events['line:create:error'](e)
          })
      })
      // 添加到字段分组
      fieldGroup.add(fieldBackground)
      fieldGroup.add(fieldText)
      fieldGroup.add(fieldDragBall)
      // 添加到表
      tableGroup.add(fieldGroup)
      // 调整group和背景的高度
      const newHeight = tableGroup.height() + this.TABLE_FIELD_HEIGHT
      tableGroup.height(newHeight)
      background.height(newHeight)
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
        if (field.__lines && field.__lines.length > 0) {
          for (const line of field.__lines) {
            const linePoints = this.computeLinePoints(line)
            line.line.points(linePoints)
            const controlPoints = this.computeLineControlPoints({ linePoints, ...line })
            line.control.position(controlPoints)
          }
        }
      })
      table.x = tableGroup.absolutePosition().x
      table.y = tableGroup.absolutePosition().y
    })
    // 为表添加拖拽结束事件
    tableGroup.on('dragend', () => {
      // 触发change事件，以更新表坐标
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
    this.tables.push(tableGroup)
    this.elementLayer.add(tableGroup)
    this.redrawPreview()
    // 触发change事件
    this.events.change && this.events.change()
    return tableGroup
  }

  /**
   * 删除表
   *
   * @param table
   */
  deleteTable (table) {
    try {
      const tableGroup = this.elementLayer.findOne(`#${table.id}`)
      if (tableGroup == null) {
        console.warn('删除表，但在设计器中找到表元素！', table)
        return
      }
      // 获取表中所有字段
      const fields = tableGroup.find('.field')
      // 删除字段和对应字段的关联线
      for (const field of fields) {
        if (!field.__lines || field.__lines.length === 0) {
          continue
        }
        for (const line of field.__lines) {
          line.line.destroy()
          line.control.destroy()
        }
        field.__lines = []
      }
      // 删除表
      this.tables = this.tables.filter(t => t !== tableGroup)
      tableGroup.destroy()
      // 重新绘制预览
      this.redrawPreview()
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * 获取或设置关联线类型
   *
   * @param lineType
   * @returns {any}
   */
  lineType (lineType) {
    if (lineType == null) {
      return this.lineType
    }
    this.#lineType = lineType
  }

  /**
   * 创建关联线
   * @param lineType
   * @param field
   * @param targetField
   * @param table
   * @param targetTable
   * @param targetFieldBackgroundRect
   * @param isInit
   */
  createLine = ({ lineType, field, targetField, table, targetTable, targetFieldBackgroundRect }) => {
    return new Promise((resolve ,reject) => {
      try {
        lineType = lineType || this.#lineType
        // 找到表对象和字段对象
        const tableGroup = this.elementLayer.findOne(`#${table.id}`)
        const targetTableGroup = this.elementLayer.findOne(`#${targetTable.id}`)
        const fieldGroup = tableGroup.findOne(`#${field.name}`)
        const targetFieldGroup = targetTableGroup.findOne(`#${targetField.name}`)
        // 不允许重复关联
        if (fieldGroup.__lines && fieldGroup.__lines.length > 0) {
          for (const line of fieldGroup.__lines) {
            // 完全重复，A.a1 => B.b1，再次操作为A.a1 => B.b1
            if (line.table === tableGroup && line.targetTable === targetTableGroup && line.field1 === fieldGroup && line.field2 === targetFieldGroup) {
              return reject(new Error('请勿重复关联！'))
            }
            // 反向重复，A.a1 => B.b1，再次操作为B.b1 => A.a1
            if (line.table === targetTableGroup && line.targetTable === tableGroup && line.field1 === targetFieldGroup && line.field2 === fieldGroup) {
              return reject(new Error('请勿重复关联！'))
            }
          }
        }
        // 计算线坐标点
        const points = this.computeLinePoints({
          table: tableGroup,
          field1: fieldGroup,
          targetTable: targetTableGroup,
          field2: targetFieldGroup
        })
        // 计算删除球坐标点
        const controlPoints = this.computeLineControlPoints({
          linePoints: points,
          table: tableGroup,
          targetTable: targetTableGroup
        })
        // 创建线
        fieldGroup.__lines = fieldGroup.__lines || []
        targetFieldGroup.__lines = targetFieldGroup.__lines || []
        const line = {
          lineType: lineType,
          table: tableGroup,
          field1: fieldGroup,
          targetTable: targetTableGroup,
          field2: targetFieldGroup,
          // 线条
          line: new Konva.Line({
            name: `field_line_${Math.round(Math.random() * 10000)}`,
            points: points,
            stroke: this.LINE_COLOR,
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
            zIndex: 1
          }),
          // 删除球
          control: new Konva.Circle({
            name: `field_line_control_${Math.round(Math.random() * 10000)}`,
            x: controlPoints.x,
            y: controlPoints.y,
            radius: 10,
            fill: lineType === 'join' ? this.LINE_CONTROL_COLOR : this.LINE_AGG_CONTROL_COLOR,
            draggable: false,
            zIndex: 2
          })
        }
        fieldGroup.__lines.push(line)
        targetFieldGroup.__lines.push(line)
        this.elementLayer.add(line.line)
        this.elementLayer.add(line.control)
        // 点击删除控制点，删除关联线
        line.control.on('click', () => {
          // 销毁关联线元素
          line.line.destroy()
          line.control.destroy()
          // 从关联字段的关联线中删除
          const fieldLineIndex = fieldGroup.__lines.indexOf(line)
          if (fieldLineIndex !== -1) {
            fieldGroup.__lines.splice(fieldLineIndex, 1)
          }
          // 从被关联字段的关联线中删除
          const targetFieldLineIndex = targetFieldGroup.__lines.indexOf(line)
          if (targetFieldLineIndex !== -1) {
            targetFieldGroup.__lines.splice(targetFieldLineIndex, 1)
          }
          // 重新绘制预览
          this.redrawPreview()
          // 触发line:deleted事件
          this.events['line:deleted'] && this.events['line:deleted']({
            field,
            targetField,
            table,
            targetTable
          })
        })
        // 悬浮在控制点时更改颜色和关联线颜色
        line.control.on('mouseover', () => {
          line.line.stroke(this.LINE_HOVER_COLOR)
          line.line.zIndex(this.MAX_Z_INDEX)
          // line.line.dash([5, 5])
          line.control.zIndex(this.MAX_Z_INDEX)
          line.control.fill(this.LINE_CONTROL_HOVER_COLOR)
          line.table.zIndex(this.MAX_Z_INDEX)
          line.targetTable.zIndex(this.MAX_Z_INDEX)
          // 修改手势为手指
          this.stage.container().style.cursor = 'pointer'
        })
        // 离开小球时恢复小球颜色和关联线颜色
        line.control.on('mouseout', () => {
          line.line.stroke(this.LINE_COLOR)
          line.line.zIndex(1)
          line.line.dash([])
          line.control.zIndex(2)
          line.control.fill(line.lineType === 'join' ? this.LINE_CONTROL_COLOR : this.LINE_AGG_CONTROL_COLOR)
          line.table.zIndex(this.TABLE_Z_INDEX)
          line.targetTable.zIndex(this.TABLE_Z_INDEX)
          this.stage.container().style.cursor = 'default'
        })
        // 恢复目标字段的背景色
        if (targetFieldBackgroundRect) {
          targetFieldBackgroundRect.fill(this.TABLE_FIELD_BACKGROUND_COLOR)
        }
        // 重置table的zIndex，让表都能覆盖在line上
        this.tables.forEach(t => t.zIndex(this.TABLE_Z_INDEX))
        // 重新绘制预览
        this.redrawPreview()
        resolve()
      } catch (e) {
        // 恢复背景色
        if (targetFieldBackgroundRect) {
          targetFieldBackgroundRect.fill(this.TABLE_FIELD_BACKGROUND_COLOR)
        }
        reject(e)
      }
    })
  }

  /**
   * 创建预览stage
   * @param container
   * @param width
   * @param height
   */
  createPreview (container, width = 200, height = 150) {
    this.previewStage = new Konva.Stage({
      container,
      width,
      height,
      scaleX: width/this.stageWidth,
      scaleY: height/this.stageHeight,
    })
    this.redrawPreview()
    // 监听拖动，触发更新
    this.stage.on('dragmove', () => {
      // 找到所有节点，更新节点的位置
      this.elementLayer.children.forEach((shape) => {
        const clone = this.cloneElementLayer.findOne('.' + shape.name())
        // 线条元素
        if (clone instanceof Konva.Line) {
          clone.points(shape.points())
          clone.strokeWidth(2)
        }
        // 其它元素
        else {
          clone.position(shape.position())
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
      opacity: 0,
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
   * @param table
   * @param targetTable
   * @returns {number[]}
   */
  computeLinePoints ({ field1, field2, table, targetTable }) {
    // 两表间的最小距离
    let leftTable = table // 最左侧的表
    let topTable = table // 最高的表
    if (table.absolutePosition().x > targetTable.absolutePosition().x) {
      leftTable = targetTable
    }
    if (table.absolutePosition().y > targetTable.absolutePosition().y) {
      topTable = targetTable
    }
    let topTablePosition = topTable.absolutePosition()
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
    if (distance >= this.TABLE_MIN_DISTANCE) {
      firstPoint[0] = leftFieldPosition.x + this.TABLE_WIDTH
    } else {
      firstPoint[0] = leftFieldPosition.x
    }
    // 计算4个拐点
    let turnPoint1 = [...firstPoint]
    let turnPoint2 = [...firstPoint]
    let turnPoint3 = [...firstPoint]
    let turnPoint4 = [...firstPoint]
    // 拐点1：默认处理左右边存在距离，且距离大于最小间距
    turnPoint1 = [
      leftFieldPosition.x + this.TABLE_WIDTH + distance / 2,
      leftFieldPosition.y + 15,
    ]
    turnPoint2 = [...turnPoint1]
    turnPoint3 = [...turnPoint1]
    // 拐点2：如果左表x + 宽度 + 表最小距离 > 右侧x，则坐标点为左侧x - 30（两表相隔太近）
    if (leftFieldPosition.x + this.TABLE_WIDTH + this.TABLE_MIN_DISTANCE > rightFieldPosition.x) {
      // 修改拐点1的x为左表 - 30
      turnPoint1[0] = leftFieldPosition.x - 30
      // 第二个转弯点的Y为最高的表y - 50
      turnPoint2[0] = turnPoint1[0]
      turnPoint2[1] = topTablePosition.y - 50
    }
    // 拐点3：如果左表x + 宽度 + 表最小距离 > 右侧x，则坐标点为右侧x + 30（两表相隔太近）
    if (leftFieldPosition.x + this.TABLE_WIDTH + this.TABLE_MIN_DISTANCE > rightFieldPosition.x) {
      // x = 右侧x + 宽度 + 30
      turnPoint3[0] = rightFieldPosition.x + this.TABLE_WIDTH + 30
      // y = 第二个拐点Y
      turnPoint3[1] = turnPoint2[1]
    }
    // 拐点4：默认处理左右边存在距离，且距离大于最小间距
    turnPoint4 = [
      leftFieldPosition.x + this.TABLE_WIDTH + distance / 2,
      rightFieldPosition.y + 15
    ]
    // - 如果左表x + 宽度 + 表最小距离 > 右侧x，则坐标点为右侧x + 30（两表相隔太近）
    if (leftFieldPosition.x + this.TABLE_WIDTH + this.TABLE_MIN_DISTANCE > rightFieldPosition.x) {
      // x = 右侧x + 宽度 + 30
      turnPoint4[0] = rightFieldPosition.x + this.TABLE_WIDTH + 30
    }
    // 计算最后一个坐标点
    const lastPoint = [
      0,
      rightFieldPosition.y + 15
    ]
    // - 如果左侧x+宽度+最小距离 超出 右表x，则为右侧x + 宽度，否则为右侧x
    if (leftFieldPosition.x + this.TABLE_WIDTH + this.TABLE_MIN_DISTANCE > rightFieldPosition.x) {
      lastPoint[0] = rightFieldPosition.x + this.TABLE_WIDTH
    } else {
      lastPoint[0] = rightFieldPosition.x
    }
    // - 如果坐标点在左表区域，则第一个坐标点为左表右侧x+宽度，最后坐标点为右表右侧x + 宽度
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
    return [...firstPoint, ...turnPoint1, ...turnPoint2, ...turnPoint3, ...turnPoint4, ...lastPoint]
  }

  /**
   * 计算关联线控制点
   *
   * @param linePoints 关联线的坐标
   * @param table 表1元素
   * @param targetTable 表2元素
   * @returns {{x: number, y: *}}
   */
  computeLineControlPoints ({ linePoints, table, targetTable }) {
    // 获取第一个点x轴坐标
    const firstPointX = linePoints[0]
    // 情况1: 最后一个点在左表左侧
    let leftTable = table // 最右侧的表
    if (table.absolutePosition().x > targetTable.absolutePosition().x) {
      leftTable = targetTable
    }
    let offset = firstPointX >= leftTable.absolutePosition().x + this.TABLE_WIDTH ? 20 : -20
    return {
      x: linePoints[0] + offset,
      y: linePoints[1]
    }
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
