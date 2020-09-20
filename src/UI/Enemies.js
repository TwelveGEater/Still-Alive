import { asteroidVertices, randomNumBetween } from './helpers';
import enemy from './image/enemy.gif';
export default class Enemies {
	constructor(args) {
		this.position = args.position;
		this.velocity = {
			x: randomNumBetween(-1.5, 1.5),
			y: randomNumBetween(-1.5, 1.5)
		};
		this.rotation = 0;
		this.rotationSpeed = randomNumBetween(-1, 1);
		this.radius = args.size;
		this.score = 80 / this.radius * 5;
		this.create = args.create;
		this.addScore = args.addScore;
		this.vertices = asteroidVertices(8, args.size);
	}

	destroy() {
		this.delete = true;
		this.addScore(this.score);

		// Explode
		// for (let i = 0; i < this.radius; i++) {
		// 	const particle = new Particle({
		// 		lifeSpan: randomNumBetween(60, 100),
		// 		size: randomNumBetween(1, 3),
		// 		position: {
		// 			x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
		// 			y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
		// 		},
		// 		velocity: {
		// 			x: randomNumBetween(-1.5, 1.5),
		// 			y: randomNumBetween(-1.5, 1.5)
		// 		}
		// 	});
		// 	this.create(particle, 'particles');
		// }

		// Break into smaller Enemies
		if (this.radius > 10) {
			for (let i = 0; i < 2; i++) {
				let enemies = new Enemies({
					size: this.radius / 2,
					position: {
						x: randomNumBetween(-10, 20) + this.position.x,
						y: randomNumBetween(-10, 20) + this.position.y
					},
					create: this.create.bind(this),
					addScore: this.addScore.bind(this)
				});
				this.create(enemies, 'enemies');
			}
		}
	}

	render(state) {
		// Move
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Rotation
		this.rotation += this.rotationSpeed;
		if (this.rotation >= 360) {
			this.rotation -= 360;
		}
		if (this.rotation < 0) {
			this.rotation += 360;
		}

		// Screen edges
		if (this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
		else if (this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
		if (this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
		else if (this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

		// Draw
		const context = state.context;
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation * Math.PI / 180);
		context.strokeStyle = '#FFF';
		context.lineWidth = 2;
		context.beginPath();
		let img = new Image();

		context.moveTo(0, -this.radius);
		for (let i = 1; i < this.vertices.length; i++) {
			context.lineTo(this.vertices[i].x - 10, this.vertices[i].y + 23);
			img.onload = () => {
				context.drawImage(
					img,
					this.position.x,
					this.position.y,
					this.vertices[i].x * 2,
					this.vertices[i].y * 2
				);
			};
		}
		img.src = enemy;
		context.closePath();
		context.stroke();
		context.restore();
	}
}
