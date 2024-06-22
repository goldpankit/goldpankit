<template>
  <div class="designer-v2" @scroll="handleScroll">
    <div class="stage"></div>
    <el-slider v-model="scale" :min="0.5" :max="2" :step="0.01" @update:model-value="handleScale"/>
  </div>
</template>

<script>
import Konva from 'konva'
export default {
  name: 'DesignerV2',
  data () {
    return {
      scale: 1,
      elementLayer: null,
      elements: []
    }
  },
  methods: {
    handleScale (scale) {
      // console.log('scroll', e.target.scrollTop)
      // console.log('scroll', e.target.scrollY)
      // console.log(1 + e.target.scrollTop/1000)
      // for (const element of this.elements) {
      //   element.scale({
      //     x: 1 + scale,
      //     y: 1 + scale
      //   })
      // }
      elementLayer.scale({
        x: 1 + scale,
        y: 1 + scale
      })
    }
  },
  mounted () {
    const stage = new Konva.Stage({
      container: '.stage',
      width: 3000,
      height: 3000
    })
    // 添加布局layer
    const backgroundLayer = new Konva.Layer();
    stage.add(backgroundLayer);
    // 添加500个点平均分布
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
    // add canvas element
    window.elementLayer = new Konva.Layer();
    stage.add(elementLayer);

    var scaleBy = 1.05;
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
      // 缩放时重新计算坐标并赋值
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      elementLayer.position(newPos);
    })

    const box = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      draggable: true,
      scaleX: 2,
      scaleY: 3,
      zIndex: 2
    });
    elementLayer.add(box);
    this.elements.push(box)

    const textNode = new Konva.Text({
      text: 'Some text here',
      x: 50,
      y: 50,
      fill: '#fff',
      fontSize: 20,
      draggable: true,
    });
    elementLayer.add(textNode);
    this.elements.push(textNode)
  }
}
</script>

<style scoped lang="scss">
.designer-v2 {
  width: 100%;
  height: 100%;
  overflow: auto;
  .el-slider {
    width: 200px;
    position: absolute;
    top: 20px;
    right: 30px;
  }
}
</style>
