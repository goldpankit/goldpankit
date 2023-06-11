<template>
  <div class="database-query-models">
  </div>
</template>

<script>
import Konva from "konva";
export default {
  name: "database-query-models",
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    var width = window.innerWidth;
    var height = window.innerHeight;

    // function to build anchor point
    function buildAnchor(x, y) {
      var anchor = new Konva.Circle({
        x: x,
        y: y,
        radius: 20,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        draggable: true,
      });
      layer.add(anchor);

      // add hover styling
      anchor.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
      });
      anchor.on('mouseout', function () {
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
      });

      anchor.on('dragmove', function () {
        updateDottedLines();
      });

      return anchor;
    }

    var stage = new Konva.Stage({
      container: '.database-query-models',
      width: width,
      height: height,
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    // function to update line points from anchors
    function updateDottedLines() {
      var q = quad;
      var b = bezier;

      // 找到红线对象
      var quadLinePath = layer.findOne('#quadLinePath');
      // 找到蓝线对象
      var bezierLinePath = layer.findOne('#bezierLinePath');

      // 修改红线点的points，调整路径
      quadLinePath.points([
        q.start.x(),
        q.start.y(),
        q.control.x(),
        q.control.y(),
        q.end.x(),
        q.end.y(),
      ]);

      bezierLinePath.points([
        b.start.x(),
        b.start.y(),
        b.control1.x(),
        b.control1.y(),
        b.control2.x(),
        b.control2.y(),
        b.end.x(),
        b.end.y(),
      ]);
    }

    // 红线
    var quadraticLine = new Konva.Shape({
      stroke: 'red',
      strokeWidth: 4,
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(quad.start.x(), quad.start.y());
        ctx.quadraticCurveTo(
          quad.control.x(),
          quad.control.y(),
          quad.end.x(),
          quad.end.y()
        );
        ctx.fillStrokeShape(shape);
      },
    });
    layer.add(quadraticLine);

    // 蓝线
    var bezierLine = new Konva.Shape({
      stroke: 'blue',
      strokeWidth: 5,
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(bezier.start.x(), bezier.start.y());
        ctx.bezierCurveTo(
          bezier.control1.x(),
          bezier.control1.y(),
          bezier.control2.x(),
          bezier.control2.y(),
          bezier.end.x(),
          bezier.end.y()
        );
        ctx.fillStrokeShape(shape);
      },
    });
    layer.add(bezierLine);

    var quadLinePath = new Konva.Line({
      dash: [10, 10, 0, 10],
      strokeWidth: 3,
      stroke: 'black',
      lineCap: 'round',
      id: 'quadLinePath',
      opacity: 0.3,
      points: [0, 0],
    });
    layer.add(quadLinePath);

    var bezierLinePath = new Konva.Line({
      dash: [10, 10, 0, 10],
      strokeWidth: 3,
      stroke: 'black',
      lineCap: 'round',
      id: 'bezierLinePath',
      opacity: 0.3,
      points: [0, 0],
    });
    layer.add(bezierLinePath);

    // special objects to save references to anchors
    var quad = {
      // 红线端点1
      start: buildAnchor(60, 30),
      // 红色控制球
      control: buildAnchor(240, 110),
      // 红线端点2
      end: buildAnchor(80, 160),
    };

    var bezier = {
      start: buildAnchor(280, 20),
      control1: buildAnchor(530, 40),
      control2: buildAnchor(480, 150),
      end: buildAnchor(300, 150),
    };

    updateDottedLines();
  }
}
</script>

<style scoped lang="scss">
.database-query-models {
  height: 100%;
}
</style>
