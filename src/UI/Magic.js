import { rotatePoint } from './helpers';
import spell from './image/magic-spell.png';
import fireball from './image/fireball.png';

export default class Magic {
	constructor(args) {
		let posDelta = rotatePoint({ x: 0, y: -20 }, { x: 0, y: 0 }, args.character.rotation * Math.PI / 180);
		this.position = {
			x: args.character.position.x + posDelta.x,
			y: args.character.position.y + posDelta.y
		};
		this.rotation = args.character.rotation;
		this.velocity = {
			x: posDelta.x / 2,
			y: posDelta.y / 2
		};
		this.radius = 2;
	}

	destroy() {
		this.delete = true;
	}

	render(state) {
		// Move
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Delete if it goes out of bounds
		if (
			this.position.x < 0 ||
			this.position.y < 0 ||
			this.position.x > state.screen.width ||
			this.position.y > state.screen.height
		) {
			this.destroy();
		}

		// Draw
		const context = state.context;
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation * Math.PI / 180);
		context.lineWidth = (0, 5);
		context.beginPath();
		let img = new Image();
		img.onload = () => {
			context.drawImage(img, this.position.x + 65, this.position.y + 55, 20, 20);
		};
		let source = Math.random() > 0.5 ? spell : fireball;
		img.src = fireball;
		context.arc(0, 0, 2, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
		context.restore();
	}
}
