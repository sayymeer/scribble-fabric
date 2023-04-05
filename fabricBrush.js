
let isMarkerBrush = false;
let isPenBrush = false;
let isSprayBrush = false;
let isCalligraphyBrush = false;
let isHighlighter = true;
canvas.isDrawingMode = true;

function AllBrushOff(){
    isMarkerBrush = false;
    isPenBrush = false;
    isSprayBrush = false;
    isCalligraphyBrush = false;
}

function penDraw() {
    AllBrushOff();
    isPenBrush = true;
    Draw();
}

function markerDraw() {
    AllBrushOff();
    isMarkerBrush = true;
    Draw();
}

function sprayDraw() {
    AllBrushOff();
    isSprayBrush = true;
    Draw();
}


fabric.CalligraphyBrush = fabric.util.createClass(fabric.PencilBrush, {
    initialize: function(canvas) {
      this.callSuper('initialize', canvas);
      this.width = 10;
      this.color = strokeColor;
      this.angle = 0;
      this.prevPoint = null;
      this.currentPoint = null;
    },
    onMouseDown: function(pointer) {
      this.prevPoint = pointer;
    },
    onMouseMove: function(pointer) {
      if (!this.prevPoint) {
        return;
      }
  
      var angle = Math.atan2(pointer.y - this.prevPoint.y, pointer.x - this.prevPoint.x);
      var distance = fabric.util.distanceBetween(pointer, this.prevPoint);
      var spacing = Math.max(5, distance / 10);
  
      for (var i = 0; i < distance; i += spacing) {
        var x = this.prevPoint.x + Math.cos(angle) * i;
        var y = this.prevPoint.y + Math.sin(angle) * i;
        var point = new fabric.Point(x, y);
  
        if (this.currentPoint) {
          var width = Math.max(this.width * 0.1, Math.min(this.width * 0.8, this.width - i / distance * this.width));
          var color = fabric.Color.fromSource(this.color).setAlpha(i / distance * 0.8 + 0.2).toRgba();
          this.canvas.contextTop.strokeStyle = color;
          this.canvas.contextTop.lineWidth = width;
          this.canvas.contextTop.beginPath();
          this.canvas.contextTop.moveTo(this.currentPoint.x, this.currentPoint.y);
          this.canvas.contextTop.lineTo(point.x, point.y);
          this.canvas.contextTop.stroke();
        }
  
        this.currentPoint = point;
      }
  
      this.prevPoint = pointer;
    },
    onMouseUp: function() {
      this.prevPoint = null;
      this.currentPoint = null;
    }
  });
  

function Draw() {
    // Initialize marker brush properties
    let markerBrush = new fabric.PencilBrush(canvas);
    markerBrush.color = strokeColor;
    markerBrush.width = (3+strokeWidth);
    markerBrush.shadow = new fabric.Shadow({ blur: 3, offsetX: 0, offsetY: 0, color: strokeColor });

    let PenBrush = new  fabric.PencilBrush(canvas);
    PenBrush.color = strokeColor;
    PenBrush.width = strokeWidth;

    let highlighterBrush = new fabric.PencilBrush(canvas);
    highlighterBrush.color = 'yellow'; // set highlighter color
    highlighterBrush.width = 10; // set highlighter width

    let sprayBrush = new fabric.SprayBrush(canvas);
    sprayBrush.width = 20; // Set the width of the spray brush
    sprayBrush.density = 30; // Set the density of the spray brush
    sprayBrush.dotWidth = 1; // Set the dot width of the spray brush
    sprayBrush.dotWidthVariance = 0; // Set the dot width variance of the spray brush

    let calligraphyBrush = new fabric.CalligraphyBrush(canvas);

    // Activate marker brush
    canvas.isDrawingMode = true;

    if (isMarkerBrush) {
        canvas.freeDrawingBrush = markerBrush;
    }
    if (isPenBrush) {
        canvas.freeDrawingBrush = PenBrush;
    }
    if (isSprayBrush) {
        canvas.freeDrawingBrush = sprayBrush;
    }
    if (isCalligraphyBrush) {
        canvas.freeDrawingBrush = calligraphyBrush;
    }
    if (isHighlighter) {
        canvas.freeDrawingBrush = highlighterBrush;

    }

    canvas.freeDrawingBrush.color = strokeColor;
    canvas.freeDrawingBrush.width = strokeWidth;
}