//THREEJS RELATED VARIABLES 

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    gobalLight, shadowLight, backLight,
    renderer,
    container,
    controls;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
    mousePos = { x:0, y:0 },
    oldMousePos = {x:0, y:0},
    ballWallDepth = 28;


//3D OBJECTS VARIABLES

var hero;

//INIT THREE JS, SCREEN AND MOUSE EVENTS

/**
* @description This function initializes a THREE.js scene and camera setup for a
* webGL renderer. It sets the dimensions of the canvas based on the window size and
* establishes various parameters such as aspect ratio and field of view for the camera.
* 
* @returns { any } The `initScreenAnd3D` function creates a THREE.js scene and camera
* setup for a 2D/3D application. It sets up the rendering context with WebGL and
* applies aspect ratio and pixel ratio adjustments based on window dimensions. Finally
* it returns a rendered 3D scene within the given container element on the page.
*/
function initScreenAnd3D() {
  
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 50;
  nearPlane = 1;
  farPlane = 2000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 250;
  camera.lookAt(new THREE.Vector3(0, 60, 0));

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
  
  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);

}

/**
* @description This function sets the size of the canvas (renderer) and the perspective
* of the camera based on the window size.
* 
* @returns { any } This function returns nothing (undefined) and has no effect on
* the outside code as it is not doing anything useful but just defining variables
* with values that can be easily accessed from within the scope of the function.
*/
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

/**
* @description This function saves the current mouse position (in client coordinates)
* into a variable called `mousePos`.
* 
* @param { object } event - The `event` parameter is an object containing information
* about the current event that triggered the function.
* 
* @returns { object } The output returned by this function is an object with two
* properties: `x` and `y`, each property containing the current mouse position (in
* client coordinates) as a number.
*/
function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
} 

/**
* @description The given function `handleTouchMove` prevents the default browser
* behavior for touch moves and captures the current touch position as `mousePos`.
* 
* @param {  } event - In the given function `handleTouchMove`, the `event` parameter
* is an argument passed to the function when it is called. It represents the Touch
* Move event that is triggered when a touchmove gesture is detected on a touch-enabled
* device.
* 
* @returns { any } The output returned by the `handleTouchMove` function is `undefined`.
*/
function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}

/**
* @description This function creates and adds three lights to the THREE.Scene: a
* hemisphere light (globalLight), a directional light for shadows (shadowLight), and
* a back light (backLight).
* 
* @returns {  } The function `createLights()` creates three lights and returns nothing
* (undefined). The lights created are:
* 
* 1/ `globalLight` - a hemisphere light with color white (0xffffff) and intensity 0.5.
* 2/ `shadowLight` - a directional light with color white (0xffffff), intensity 0.9
* and casting a shadow with darkness 0.2.
* 3/ `backLight` - a directional light with color white (0xffffff), intensity 0.4.
* 
* All three lights are added to the scene using `scene.add()`.
*/
function createLights() {
  globalLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
  shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 100, 100);
  backLight.castShadow = true;
  backLight.shadowDarkness = .1;
  backLight.shadowMapWidth = shadowLight.shadowMapHeight = 2048;
  
  scene.add(globalLight);
  scene.add(shadowLight);
  scene.add(backLight);
}

/**
* @description This function creates a new plane mesh object with dimensions 1000x1000
* units and sets its material properties and position.
* 
* @returns { object } The `createFloor()` function returns a new `THREE.Mesh` object
* representing a plane with dimensions 1000x1000 units and material color #6ecccc
* (pale blue). The mesh is rotated 90 degrees counterclockwise around the x-axis and
* positioned at y=0. Additionally., the function adds the mesh to the scene and
* enables receiving shadows.
*/
function createFloor(){ 
  floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0x6ecccc}));
  floor.rotation.x = -Math.PI/2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
}

/**
* @description This function creates a new instance of the `Cat` class and adds it
* to the scene using the `threeGroup`.
* 
* @returns { object } The output returned by the `createHero()` function is an
* instance of the `Cat` class.
*/
function createHero() {
  hero = new Cat();
  scene.add(hero.threeGroup);
}

/**
* @description This function creates a new `Ball` object and adds its `threeGroup`
* object to the scene.
* 
* @returns { object } The function `createBall()` creates a new instance of the
* `Ball` object and adds its `threeGroup` property to the `scene`.
* 
* Output: The function returns `ball`, which is an instance of the `Ball` class.
*/
function createBall() {
  ball = new Ball();
  scene.add(ball.threeGroup);
}

// BALL RELATED CODE


var woolNodes = 10,
	woolSegLength = 2,
	gravity = -.8,
	accuracy =1;


Ball = function(){

	var redMat = new THREE.MeshLambertMaterial ({
	    color: 0x630d15, 
	    shading:THREE.FlatShading
	});

	var stringMat = new THREE.LineBasicMaterial({
    	color: 0x630d15,
    	linewidth: 3
	});

	this.threeGroup = new THREE.Group();
	this.ballRay = 8;

	this.verts = [];

	// string
	var stringGeom = new THREE.Geometry();

	for (var i=0; i< woolNodes; i++	){
		var v = new THREE.Vector3(0, -i*woolSegLength, 0);
		stringGeom.vertices.push(v);

		var woolV = new WoolVert();
		woolV.x = woolV.oldx = v.x;
		woolV.y = woolV.oldy = v.y;
		woolV.z = 0;
		woolV.fx = woolV.fy = 0;
		woolV.isRootNode = (i==0);
		woolV.vertex = v;
		if (i > 0) woolV.attach(this.verts[(i - 1)]);
		this.verts.push(woolV);
		
	}
  	this.string = new THREE.Line(stringGeom, stringMat);

  	// body
  	var bodyGeom = new THREE.SphereGeometry(this.ballRay, 5,4);
	this.body = new THREE.Mesh(bodyGeom, redMat);
  	this.body.position.y = -woolSegLength*woolNodes;

  	var wireGeom = new THREE.TorusGeometry( this.ballRay, .5, 3, 10, Math.PI*2 );
  	this.wire1 = new THREE.Mesh(wireGeom, redMat);
  	this.wire1.position.x = 1;
  	this.wire1.rotation.x = -Math.PI/4;

  	this.wire2 = this.wire1.clone();
  	this.wire2.position.y = 1;
  	this.wire2.position.x = -1;
  	this.wire1.rotation.x = -Math.PI/4 + .5;
  	this.wire1.rotation.y = -Math.PI/6;

  	this.wire3 = this.wire1.clone();
  	this.wire3.rotation.x = -Math.PI/2 + .3;

  	this.wire4 = this.wire1.clone();
  	this.wire4.position.x = -1;
  	this.wire4.rotation.x = -Math.PI/2 + .7;

  	this.wire5 = this.wire1.clone();
  	this.wire5.position.x = 2;
  	this.wire5.rotation.x = -Math.PI/2 + 1;

  	this.wire6 = this.wire1.clone();
  	this.wire6.position.x = 2;
  	this.wire6.position.z = 1;
  	this.wire6.rotation.x = 1;

  	this.wire7 = this.wire1.clone();
  	this.wire7.position.x = 1.5;
  	this.wire7.rotation.x = 1.1;

  	this.wire8 = this.wire1.clone();
  	this.wire8.position.x = 1;
  	this.wire8.rotation.x = 1.3;

  	this.wire9 = this.wire1.clone();
  	this.wire9.scale.set(1.2,1.1,1.1);
  	this.wire9.rotation.z = Math.PI/2;
  	this.wire9.rotation.y = Math.PI/2;
  	this.wire9.position.y = 1;
  	
  	this.body.add(this.wire1);
  	this.body.add(this.wire2);
  	this.body.add(this.wire3);
  	this.body.add(this.wire4);
  	this.body.add(this.wire5);
  	this.body.add(this.wire6);
  	this.body.add(this.wire7);
  	this.body.add(this.wire8);
  	this.body.add(this.wire9);

  	this.threeGroup.add(this.string);
	this.threeGroup.add(this.body);

	this.threeGroup.traverse( function ( object ) {
    if ( object instanceof THREE.Mesh ) {
      object.castShadow = true;
      object.receiveShadow = true;
    }});

}

/* 
The next part of the code is largely inspired by this codepen :
https://codepen.io/dissimulate/pen/KrAwx?editors=001
thanks to dissimulate for his great work
*/

/*
Copyright (c) 2013 dissimulate at Codepen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/



WoolVert = function(){
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.oldx = 0;
	this.oldy = 0;
	this.fx = 0;
	this.fy = 0;
	this.isRootNode = false;
	this.constraints = [];
	this.vertex = null;
}


WoolVert.prototype.update = function(){
	var wind = 0;//.1+Math.random()*.5;
  	this.add_force(wind, gravity);

  	nx = this.x + ((this.x - this.oldx)*.9) + this.fx;
  	ny = this.y + ((this.y - this.oldy)*.9) + this.fy;
  	this.oldx = this.x;
  	this.oldy = this.y;
  	this.x = nx;
  	this.y = ny;

  	this.vertex.x = this.x;
  	this.vertex.y = this.y;
  	this.vertex.z = this.z;

  	this.fy = this.fx = 0
}

WoolVert.prototype.attach = function(point) {
  this.constraints.push(new Constraint(this, point));
};

WoolVert.prototype.add_force = function(x, y) {
  this.fx += x;
  this.fy += y;
};

Constraint = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.length = woolSegLength;
};

Ball.prototype.update = function(posX, posY, posZ){
		
	var i = accuracy;
	
	while (i--) {
		
		var nodesCount = woolNodes;
		
		while (nodesCount--) {
		
			var v = this.verts[nodesCount];
			
			if (v.isRootNode) {
			    v.x = posX;
			    v.y = posY;
			    v.z = posZ;
			}
		
			else {
		
				var constraintsCount = v.constraints.length;
		  		
		  		while (constraintsCount--) {
		  			
		  			var c = v.constraints[constraintsCount];

		  			var diff_x = c.p1.x - c.p2.x,
					    diff_y = c.p1.y - c.p2.y,
					    dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
					    diff = (c.length - dist) / dist;

				  	var px = diff_x * diff * .5;
				  	var py = diff_y * diff * .5;

				  	c.p1.x += px;
				  	c.p1.y += py;
				  	c.p2.x -= px;
				  	c.p2.y -= py;
				  	c.p1.z = c.p2.z = posZ;
		  		}

		  		if (nodesCount == woolNodes-1){
		  			this.body.position.x = this.verts[nodesCount].x;
					this.body.position.y = this.verts[nodesCount].y;
					this.body.position.z = this.verts[nodesCount].z;

					this.body.rotation.z += (v.y <= this.ballRay)? (v.oldx-v.x)/10 : Math.min(Math.max( diff_x/2, -.1 ), .1);
		  		}
		  	}
		  	
		  	if (v.y < this.ballRay) {
		  		v.y = this.ballRay;
		  	}
		}
	}

	nodesCount = woolNodes;
	while (nodesCount--) this.verts[nodesCount].update();

	this.string.geometry.verticesNeedUpdate = true;

	
}

Ball.prototype.receivePower = function(tp){
	this.verts[woolNodes-1].add_force(tp.x, tp.y);
}

// End of the code inspired by dissmulate


// Make everything work together :

var t=0;

/**
* @description This function renders the scene and updates the position of the ball
* and the hero based on their positions and power transfers between them.
* 
* @returns { object } The `loop()` function renders the scene and updates the positions
* and movements of the hero and the ball based on user input. It returns no output;
* instead; it updates the values of `t`, `ballPos`, and other variables and schedules
* another animation frame using `requestAnimationFrame()`.
*/
function loop(){
  render();
  
  t+=.05;
  hero.updateTail(t);

  var ballPos = getBallPos();
  ball.update(ballPos.x,ballPos.y, ballPos.z);
  ball.receivePower(hero.transferPower);
  hero.interactWithBall(ball.body.position);

  requestAnimationFrame(loop);
}


/**
* @description The provided function 'getBallPos()' calculates the position of a
* ball (ballPos) based on mouse cursor position and camera position. It uses unproject
* method to transform screen coordinates into world coordinates. Then it calculates
* direction vector from camera to the ball and normalizes it to get distance between
* them.
* 
* @returns { object } The function `getBallPos` returns a Vector3 object that
* represents the position of the ball given the current mouse position and camera position.
*/
function getBallPos(){
  var vector = new THREE.Vector3();

  vector.set(
      ( mousePos.x / window.innerWidth ) * 2 - 1, 
      - ( mousePos.y / window.innerHeight ) * 2 + 1,
      0.1 );

  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = (ballWallDepth - camera.position.z) / dir.z;
  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  return pos;
}

/**
* @description This function is responsible for rendering the scene using the
* `renderer` object.
* 
* @returns {  } Based on the code provided:
* 
* The output returned by the `render` function is unitless (i.e., it does not return
* a number or a specific value).
* 
* Here's a concise description of the output:
* 
* The `render` function updates the controls (if they exist) and then renders the
* scene using the renderer and camera. It does not return any value explicitly.
*/
function render(){
  if (controls) controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

/**
* @description This function initializes the game by setting up the screen and 3D
* objects (lights and floor), creating the hero and ball objects and starting the
* main loop of the game.
* 
* @param {  } event - The `event` input parameter is not used or referenced within
* the `init` function.
* 
* @returns { any } The `init` function does not return any value explicitly. However.
* it performs several actions and initiates various game objects such as lights ,
* floor , hero and ball . Therefore.
*/
function init(event){
  initScreenAnd3D();
  createLights();
  createFloor()
  createHero();
  createBall();
  loop();
}

