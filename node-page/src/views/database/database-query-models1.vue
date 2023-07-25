<template>
  <div class="database-query-models">
    <v-stage
      :config="configKonva"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
    >
      <v-layer width="1296px" height="1000px">
        <v-text :config="{text: 'Some text on canvas', fontSize: 15}"/>
        <v-rect :config="{
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10
        }"
        />
        <v-circle :config="{
          x: 200,
          y: 100,
          radius: 50,
          fill: 'green'
        }"
        />
        <v-line :config="{
          x: 20,
          y: 200,
          points: [0, 0, 100, 0, 100, 100],
          tension: 0.5,
          closed: true,
          stroke: 'black',
          fillLinearGradientStartPoint: { x: -50, y: -50 },
          fillLinearGradientEndPoint: { x: 50, y: 50 },
          fillLinearGradientColorStops: [0, 'red', 1, 'yellow']
        }"/>
        <!-- draggable是否可拖动 -->
        <v-circle :config="configCircle" :draggable="true"/>
        <v-shape :config="customShape" :draggable="true"/>
        <v-transformer ref="transformer" />
        <v-rect
          v-for="item in rectangles"
          :key="item.id"
          :config="item"
          @transformend="handleTransformEnd"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: "database-query-models",
  data () {
    return {
      configKonva: {
        // 设计区宽度
        width: 1960,
        // 设计区高度
        height: 1000
      },
      // 绘制圆
      configCircle: {
        // 绘制坐标
        x: 100,
        y: 100,
        // 半径
        radius: 70,
        // 填充色
        fill: "red",
        // 描边颜色
        stroke: "black",
        // 描边宽度
        strokeWidth: 4,
        // 阴影
        shadowBlur: 10
      },
      // 自定义形状
      customShape: {
        x: 300,
        y: 300,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
        // 绘制函数
        sceneFunc: function(context, shape) {
          context.beginPath();
          context.moveTo(20, 50);
          context.lineTo(220, 80);
          context.quadraticCurveTo(150, 100, 260, 170);
          context.closePath();
          // special Konva.js method
          context.fillStrokeShape(shape);
        }
      },
      rectangles: [
        {
          rotation: 0,
          x: 10,
          y: 10,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          fill: 'red',
          name: 'rect1',
          draggable: true,
        },
        {
          rotation: 0,
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          scaleX: 1,
          scaleY: 1,
          fill: 'green',
          name: 'rect2',
          draggable: true,
        },
      ],
      selectedShapeName: '',
    }
  },
  methods: {
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.rectangles.find(
        (r) => r.name === this.selectedShapeName
      );
      // update the state
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.rotation = e.target.rotation();
      rect.scaleX = e.target.scaleX();
      rect.scaleY = e.target.scaleY();

      // change fill
      rect.fill = Konva.Util.getRandomColor();
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.rectangles.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
}
</style>
