/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var previousTime = Date.now();

setInterval(tick, 0);

function rgb(red, green, blue, alpha){
    var decColor = 0x100000000 + blue * 0x100 + 0x10000 * green + 0x1000000 * red + alpha;
    return '#'+decColor.toString(16).substr(1);
}

class Particle {
	constructor(x, y, speed, life, degree) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.degree = degree;
		this.life = life;
	}
	update(deltaTime) {
		this.x += Math.sin(this.degree) * deltaTime * this.speed;
		this.y += Math.cos(this.degree) * deltaTime * this.speed;
		this.life -= deltaTime * 0.1;
	}
	render() {
		context.fillStyle = rgb(255, 0, 0, Math.min(100, this.life));
		context.fillRect(this.x, this.y, 10, 10);
	}
}

class ParticleSystem {
	constructor() {
		this.data = [];
	}
	addParticle(x, y) {
		this.data.push(new Particle(x, y, 0.4, 100, Math.random() * Math.PI * 2));
	}
	update(deltaTime) {
		for (var at = 0; at < this.data.length; at++){
			var temp = this.data.at(at);
			temp.update(deltaTime);
			
			if (temp.x > canvas.width || temp.y > canvas.height || temp.x < 0 || temp.y < 0 || temp.life < 0) {
				this.data.splice(at, 1);
				at--;
			}
		}
	}
	render() {
		this.data.forEach(function(item) {
			item.render();
		});
	}
}

function tick() {
	var currentTime = Date.now();
	var deltaTime = currentTime - previousTime;
	previousTime = currentTime;

	update(deltaTime);
	render();
}

class Point {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
}

let particleSystem = new ParticleSystem();
let mousePosition = new Point();

onmousemove = function(e) {
	mousePosition.x = e.clientX;
	mousePosition.y = e.clientY;
}

function update(deltaTime) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	particleSystem.addParticle(mousePosition.x, mousePosition.y);
	particleSystem.update(deltaTime);
}

function render() {
	context.fillStyle = "#000000FF";
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);

	particleSystem.render();
	context.rect(300, 300, 300, 300);
}