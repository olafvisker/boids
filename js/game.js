window.addEventListener('resize', resize, false); 
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

var cv = document.getElementById('canvas');
var ctx = cv.getContext('2d');
var fpslabel = document.getElementById('fps');
var fpsCounter = 0;
var fpsArray = [];

var fps = 60;
var interval = 1000/fps;
var lastTime = performance.now();
var currentTime = 0;
var delta = 0;

var mx = -Infinity;
var my = -Infinity;

var update = function(){};
var draw = function(){};

resize();

function setup(main, update, draw) {	
	
    this.update = update;
    this.draw = draw;
    
	main();
	loop();
}

function resize() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
}

function loop() {
	window.requestAnimationFrame(loop);
	fpsCounter += delta;

    currentTime =  performance.now();
	delta = (currentTime - lastTime) / 1000;	
	update(delta); 
	//clearBuffer();
	semiClearBuffer(0.03);
	draw(delta);
	lastTime = currentTime;
	
	if (fpsCounter >= 1) {
		var sum = fpsArray.reduce((previous, current) => current += previous);
		var avg = sum / fpsArray.length;
		fpslabel.innerText = String('FPS: ' + Math.round(avg));
		fpsCounter = 0;
		fpsArray = [];
	}
	fpsArray.push(1/delta);
}

function clearBuffer() {
	ctx.clearRect(0,0,cv.width,cv.height);
}
function semiClearBuffer(speed) {	
	ctx.save();
	ctx.beginPath();
	ctx.rect(0, 0, cv.width, cv.height);
	ctx.fillStyle = 'rgba(0,0,0,'+String(speed)+')';
	ctx.fill();
 	ctx.restore();
}

function drawSquare(x, y, rotation, size, r, g, b) {
	r = String(Math.round(r));
	g = String(Math.round(g));
	b = String(Math.round(b));

	ctx.save();
	ctx.beginPath();
	ctx.translate(x+size/2, y+size/2 );
	ctx.rotate(rotation);
	ctx.rect(-size/2,-size/2,size,size);
	ctx.fillStyle = 'rgb('+r+','+g+','+b+')'; 
	ctx.fill();
 	ctx.restore();
}


function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
  }

cv.addEventListener('mousemove', function(evt) {
var mousePos = getMousePos(canvas, evt);
mx = mousePos.x;
my = mousePos.y;
}, false);