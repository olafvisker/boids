function Boid(x, y, rotation, vx, vy, maxv, size) {
	this.x = x;
	this.y = y;
	this.rotation = rotation;
	this.vx = vx;
	this.vy = vy;
	this.maxv = maxv;
	this.size = size;
	this.id = 0;
}

var boids = [];
var boidSize = 5;

setup(main, update, draw);

function main() {
	for (var i = 0; i < 3000; i++) 
		boids.push(new Boid(rnd(cv.width / 4, cv.width / 4 * 3), rnd(cv.height / 4, cv.height / 4 * 3), 45, i * rnd(-250, 250), rnd(-250, 250), rnd(150, 200), boidSize));
}

function update(delta) { 
	clearMap();
	for (var i = 0; i < boids.length; i++)
		register(boids[i]);
	for (var i = 0; i < boids.length; i++)
		updateBoid(boids[i], delta);
}

function draw(delta) { 
	//drawMap();
	for (var i = 0; i < boids.length; i++) {
		drawSquare(boids[i].x, boids[i].y, boids[i].rotation, boids[i].size, Math.abs(boids[i].vx) / boids[i].maxv * 255, i / boids.length * 255, Math.abs(boids[i].vy) / boids[i].maxv * 255);	
	}
}

function updateBoid(boid, delta) {	
	var v1 = behaviour(boid, 10, 0.5, 0.5, 0.1);
	var v2 = moveTo(boid, mx, my, 100, 15);
	var v3 = [0,0];//moveTo(boid, 500, 500, 100, 10);
	boid.vx += v1[0] + v2[0] + v3[0];
	boid.vy += v1[1] + v2[1] + v3[1];
	boid.vx = clamp(boid.vx, -boid.maxv, boid.maxv);
	boid.vy = clamp(boid.vy, -boid.maxv, boid.maxv);
	boid.x += boid.vx * delta;
	boid.y += boid.vy * delta;
	boid.x = boid.x >= cv.width ? 0 : boid.x < 0 ? cv.width - 1 : boid.x;
	boid.y = boid.y >= cv.height ? 0 : boid.y < 0 ? cv.height - 1 : boid.y;
	boid.rotation = Math.atan2(boid.vy, boid.vx);
}

function behaviour(boid, distance, cohesion, avoidance, alignment) {
	var c = [0, 0];	
	var a = [0, 0];	
	var v = [0, 0];	

	var n = getNeighbours(boid);
	var l = n.length;

	for (var i = 0; i < l; i++) {
		var neighbour = n[i];
		if (boid == neighbour)
			continue;

		c[0] += neighbour.x;
		c[1] += neighbour.y;

		v[0] += neighbour.vx;
		v[1] += neighbour.vy;

		var d = dist(boid.x, boid.y, neighbour.x, neighbour.y);
		if (d >= distance)
			continue;
		a[0] += (boid.x - neighbour.x);
		a[1] += (boid.y - neighbour.y);
	}
	
	if (l > 1) {
		c[0] /= (l - 1);
		c[1] /= (l - 1);
		v[0] /= (l - 1);
		v[1] /= (l - 1);
	} else  {
		c = [boid.x, boid.y];
		v = [boid.vx, boid.vy];
	}

	c = [(c[0]-boid.x) / 100 * cohesion, (c[1]-boid.y) / 100 * cohesion];
	a = [a[0] * avoidance, a[1] * avoidance];
	v = [(v[0] - boid.vx) * alignment, (v[1] - boid.vy) * alignment];
	return [c[0] + a[0] + v[0], c[1] + a[1] + v[1]];
}

function moveTo(boid, x, y, radius, strength) {
	if (dist(boid.x, boid.y, x, y) >= radius)
		return [0, 0];
	return [(x - boid.x) / 100 * strength, (y - boid.y) / 100 * strength];
}

function moveFrom(boid, x, y, radius, strength) {	
	if (dist(boid.x, boid.y, x, y) >= radius)
		return [0, 0];
	return [(boid.x - x) / 100 * strength, (boid.y - y) / 100 * strength];
}

function rnd(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function dist(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return Math.sqrt(a*a + b*b);
}