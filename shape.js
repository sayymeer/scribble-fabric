var canvas = this.__canvas = new fabric.Canvas('mainCanvas');
const myCanvas = canvas.getElement();
const ctx = myCanvas.getContext('2d');
canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);

window.addEventListener('resize',function(){
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
})

let fillColor = 'white';
let strokeColor = 'black'
let strokeWidth = 3;
let bgColor = 'white';
let colorLayerData=ctx.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
let isPaintBucket = false;


canvas.isDrawingMode = false;

canvas.selectionColor = 'rgba(255, 255, 255, 0.3)';
canvas.selectionBorderColor = 'blue';
canvas.selectionLineWidth = 1;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'square';
fabric.Object.prototype.noScaleCache = false;
fabric.Object.prototype.cornerSize = 8;

document.getElementById('strokeColor').addEventListener('input',function(e){
    strokeColor = e.target.value;
    var activeObjects = canvas.getActiveObjects();
    if (activeObjects) {
        activeObjects.forEach(function(obj) {
            obj.set('stroke',strokeColor);
            obj.set()
        })
    canvas.renderAll();
    }
    if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = strokeColor
    }
})

document.getElementById('fillColor').addEventListener('input',function(e){
    fillColor = e.target.value;
    var activeObjects = canvas.getActiveObjects();
    if (activeObjects) {
        activeObjects.forEach(function(obj) {
            obj.set('fill',fillColor);
        })
    canvas.renderAll();
    }
    
})

document.getElementById('strokeWidth').addEventListener('input',function(e){
    strokeWidth = e.target.value;
    var activeObjects = canvas.getActiveObjects();
    if (activeObjects) {
        activeObjects.forEach(function(obj) {
            obj.set('strokeWidth',strokeWidth);
            obj.set()
        })
    canvas.renderAll();
    }
    if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.width = strokeWidth
    }
})

function paintBucketOn() {
    Select();
    AllBrushOff();
    isPaintBucket = true;
}

function Select() {
    AllBrushOff()
    canvas.isDrawingMode = false;
    isPaintBucket = false;
    myCanvas.style.cursor = 'default'
}

function Erase() {
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = bgColor;
    canvas.freeDrawingBrush.width = strokeWidth;
    canvas.isDrawingMode = true;
}



function Copy() {
	canvas.getActiveObject().clone(function(cloned) {
		_clipboard = cloned;
	});
   
}

function Paste() {
	_clipboard.clone(function(clonedObj) {
		canvas.discardActiveObject();
		clonedObj.set({
			left: clonedObj.left + 10,
			top: clonedObj.top + 10,
			evented: true,
		});
		if (clonedObj.type === 'activeSelection') {
			// active selection needs a reference to the canvas.
			clonedObj.canvas = canvas;
			clonedObj.forEachObject(function(obj) {
				canvas.add(obj);
			});
			// this should solve the unselectability
			clonedObj.setCoords();
		} else {
			canvas.add(clonedObj);
		}
		_clipboard.top += 10;
		_clipboard.left += 10;
		canvas.setActiveObject(clonedObj);
		canvas.requestRenderAll();
	});
}

function Cut() {
    Copy();
    var activeObjects = canvas.getActiveObjects();

    // Check if an object is selected
    if (activeObjects) {
    // Remove the selected object from the canvas
    activeObjects.forEach(function (object) {
        canvas.remove(object);
    })
    }
    canvas.setActiveObject(null);
}

document.addEventListener('copy',function(e){
    Copy();
    navigator.clipboard.writeText("fabricObject");
    e.preventDefault();

})

document.addEventListener('paste',function(e){
    if (e.clipboardData && e.clipboardData.items) {
          if (e.clipboardData.items[e.clipboardData.items.length-1].type.indexOf('image') !== -1 ) {
            // create a file object from the clipboard data
            var file = e.clipboardData.items[e.clipboardData.items.length-1].getAsFile();
    
            // create a URL object from the file object
            var url = URL.createObjectURL(file);
    
            // create an image object from the URL
            fabric.Image.fromURL(url, function(img) {
              // set the position and size of the image
              img.set({
                left: 100,
                top: 50,
                width: img.width,
                height: img.height
              });
    
              // add the image to the canvas
              canvas.add(img);
    
              // render the canvas to update the changes
              canvas.renderAll();
            });
    
            // prevent the default paste action
            e.preventDefault();
          }
        
          e.clipboardData.items[e.clipboardData.items.length-1].getAsString(function(data){
            if (data==='fabricObject') {
                Paste();
            }
          })
          
        }
})

document.addEventListener('cut',function(){
    Cut();
})

document.addEventListener('keydown', function(event) {
if (event.keyCode === 46) { // 46 is the keycode for 'delete' key
    // Get the currently selected object
    var activeObjects = canvas.getActiveObjects();

    // Check if an object is selected
    if (activeObjects) {
    // Remove the selected object from the canvas
    activeObjects.forEach(function (object) {
        canvas.remove(object);
    })
    canvas.setActiveObject(null)
    }
}
});

// functions to add shapes
function AddRectangle() {
var rect = new fabric.Rect({
  left: 100,
  top: 50,
  fill: fillColor,
  width: 200,
  height: 100,
  objectCaching: false,
  stroke: strokeColor,
  strokeWidth: strokeWidth,
  strokeUniform: true
});
canvas.add(rect);
canvas.setActiveObject(rect);
Select();
}

function AddCircle() {
    var circle = new fabric.Circle({
        top:50,
        left: 100,
        fill: fillColor,
        radius: 100,
        objectCaching: false,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeUniform: true
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    Select();
}

function AddEllipse(){
    var ellipse = new fabric.Ellipse({
        top:50,
        left: 100,
        fill: fillColor,
        rx:150,
        ry:75,
        objectCaching: false,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeUniform: true
    });
    canvas.add(ellipse);
    canvas.setActiveObject(ellipse);
    Select();
}

function AddTriangle(){
    var triangle = new fabric.Triangle({
        top:50,
        left: 100,
        fill: fillColor,
        width:200,
        height:100,
        objectCaching: false,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeUniform: true
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    Select();
}

function AddLine() {
    var line = new fabric.Line([100, 100, 200, 200], {
        stroke: 'black',
        strokeWidth: 2,
      });
    canvas.add(line);
    canvas.setActiveObject(line);
    Select();
}


function AddSquare() {
    var rect = new fabric.Rect({
        left: 100,
        top: 50,
        fill: fillColor,
        width: 100,
        height: 100,
        objectCaching: false,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeUniform: true
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      Select();
}


canvas.on('mouse:down',function(ev) {
    if (isPaintBucket) {
        paintBucket(ev)
    }
})

function paintBucket(ev) {

    // Get the fill color from the foreground element
  
    // Get the current mouse position
    let pointer = canvas.getPointer(ev.e);
  
    // Find the object at the current mouse position
    let target = canvas.findTarget(pointer);
  
    if (target) {
      // If an object is found, fill it with the selected color
      target.set({ fill: fillColor });
      canvas.renderAll();
    } else {
      // If no object is found, fill the entire canvas with the selected color
      canvas.setBackgroundColor(fillColor, canvas.renderAll.bind(canvas));
    }
  }

function DownloadPng() {
    let img = canvas.toDataURL('image/png');
    var link = document.createElement('a');
    link.href = img;
    link.download = 'my-image.png';
    link.click();
    document.body.removeChild(link);
}

  function shapeAutocomplete() {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 3;

    canvas.freeDrawingBrush.
    canvas.on('path:created', function(options) {      
        canvas.setActiveObject(options.path);
        var selectedPath = canvas.getActiveObject();  
        var img = new Image();
        img.src = selectedPath.toDataURL();
  })      
}