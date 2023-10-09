// ==UserScript==
// @name         Constellation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        */*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// allows me global access to canvas and it’s width and height properties
// ctx enables me to have many canvases all positioned on top of eachother at 100% width and height of page
var ctx = CanvasRenderingContext2D.prototype;
var mousePressed, mouseReleased, w, width, h, height, canvas;
var mouseSpeedX = 0,
    mouseSpeedY = 0,
    mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0,
    oldMouseX = 0,
    oldMouseY = 0,
    frameRate = 60,
    frameCount = 0,
    frameNumber = 0,
    lastUpdate = Date.now(),
    mouseMoved = false,
    mouseDown = false,
    number_of_balls = 200,
    max_distance = 80;
var balls = [];
ctx = createCanvas("canvas1");

function addBall(_i){
  var ball = {
    x: random(w),
    y: random(h),
    speed_x: posNeg() * random(0.2, 1),
    speed_y: posNeg() * random(0.2, 1),
    size: 8,
    colour: rgb(128, 128, 128)
  }
  balls.push(ball);
}

function bounce(num, min, max, sz) {
    if (sz == undefined) {
        sz = 0;
    }
    if (num >= max - sz/2 || num - sz/2 <= min ) {
        return 1;
    } else {
        return 0;
    }
    //return num > max ? -1 : num < min ? -1 : 1
}

function cjsloop() {
    var now = Date.now();
    var elapsedMils = now - lastUpdate;
//    if((typeof window.draw == 'function') && (elapsedMils >= (1000/window.frameRate))) {
        /*window.*/draw();
        frameCount++;
        frameNumber++;
        lastUpdate = now - elapsedMils % (1000/window.frameRate );
        mouseSpeedX = mouseX - oldMouseX;
        mouseSpeedY = mouseX - oldMouseX;
        lastMouseX = oldMouseX = mouseX;
        lastMouseY = oldMouseY = mouseY;
        mouseReleased = 0;
        mouseMoved = 0;
//    }
    requestAnimationFrame(cjsloop);
    //x.clearRect(0, 0, w, h);
}

function clamp(value, min, max){
    return Math.min(Math.max(value, Math.min(min, max)),Math.max(min, max));
}


function createCanvas(canvas_name){
    canvas = document.createElement('canvas');
    var body = document.querySelector('body');
    canvas.setAttribute("id", canvas_name);
    canvas.style.position = "fixed";
    canvas.style.zIndex = "100";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.opacity = "0.4";
    canvas.style.pointerEvents = "none";
  //  canvas.style.background = "transparent";
    body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener("resize", resize, false);
    return ctx;
}

function dist(x1, y1, x2, y2) {
    x2 -= x1; y2 -= y1;
    return Math.sqrt((x2*x2) + (y2*y2));
}

function draw() {
    ctx.clearRect(0, 0, width, height);
   // ctx.background();
    moveBall();
    drawBall();
}

function drawBall(){
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        drawConnections(i);
        ctx.fillStyle = b.colour;
        ctx.fillEllipse(b.x, b.y, b.size);

    }
}

function drawConnections(_i) {
    for (var j = _i + 1; j < balls.length; j++) {
      var b1 = balls[_i];
      var b2 = balls[j];
      if (dist(b1.x, b1.y, b2.x, b2.y) <= max_distance) {
        ctx.strokeStyle = rgb(128, 128, 128);
        ctx.line(b1.x, b1.y, b2.x, b2.y);
      }
   }
}

function init() {
    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseMoved = true;
    });
    if(typeof window.setup == 'function') window.setup();
    cjsloop();
}

function posNeg(){
    return randomInt(0,1) * 2 - 1;
}


function random(min, max) {
    if(min == undefined) {
        min = 0;
        max = 1;
    } else if(max == undefined) {
        max = min;
        min = 0;
    }
    return (Math.random() * (max - min)) + min;
}

function randomInt(min, max) {
    if(max == undefined) {
        max = min;
        min = 0;
    }
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}


function resize(){
	var c = document.getElementsByTagName('canvas');
	width = w = window.innerWidth;
	height = h = window.innerHeight;
	for(var i = 0; i < c.length; i++) {
		c[i].width = width;
		c[i].height = height;

	}
	console.log("resize: " + w +":" + h);
}

function rgb(r, g, b) {
    if (g == undefined) g = r;
    if (b == undefined) b = r;
    return 'rgb('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+')';
}

function rgba(r, g, b, a) {
    if (g == undefined) {
        return 'rgb(' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(r), 0, 255) + ')';
    } else if (b == undefined) {
        return 'rgba(' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(r), 0, 255)+ ', ' + clamp(Math.round(r), 0, 255) + ', ' + clamp(g, 0, 1) + ')';
    } else if (a == undefined){
        return 'rgba(' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(g), 0, 255)+ ', ' + clamp(Math.round(b), 0, 255) + ', 1)';
    } else {
        return 'rgba(' + clamp(Math.round(r), 0, 255) + ', ' + clamp(Math.round(g), 0, 255)+ ', ' + clamp(Math.round(b), 0, 255) + ', '+ clamp(a, 0, 1) + ')';
    }
}

function moveBall(){
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        b.x += b.speed_x;
        b.y += b.speed_y;
        if (bounce(b.x, 0, w)) b.speed_x *= -1;
        if (bounce(b.y, 0, h)) b.speed_y *= -1;
    }
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
ctx.ellipse = function(x, y, width, height) {
    'use strict';
    if (height == undefined) { height = width; }
    this.beginPath();
    for(var i = 0; i < Math.PI*2; i += Math.PI/16) {
        this.lineTo(x + (Math.cos(i) * width/2), y + (Math.sin(i) * height/2));
    }
    this.closePath();
};

ctx.fillEllipse = function(x, y, width, height) {
    'use strict';
    if (height == undefined) height = width;
    this.ellipse(x, y, width, height);
    this.fill();
    this.beginPath();
};

ctx.line = function(x1, y1, x2, y2){
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
    this.beginPath();
};

ctx.background = function(r, g, b, a) {
    if (g == undefined) {
        this.fillStyle = rgb(r, r, r);
    } else if (b == undefined && a == undefined) {
        this.fillStyle = rgba(r, r, r, g);
    } else if (a == undefined) {
        this.fillStyle = rgb(r, g, b);
    } else {
        this.fillStyle = rgba(r, g, b, a);
    }
    this.fillRect(0, 0, w, h);
};
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// push a ball and it's values into the array
for (var i = 0; i < number_of_balls; i++) {addBall(i);}
//window.addEventListener("load", draw);
window.addEventListener("load", init);

//window.on('load', draw);
