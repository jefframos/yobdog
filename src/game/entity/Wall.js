import PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Wall extends PIXI.Container{
	constructor(game, type, bounds){
		super();

		this.game = game;
		this.type = type;
		this.wallContainer = new PIXI.Container();
		this.addChild(this.wallContainer);
		// console.log(bounds);
		this.starterBounds = [];
		this.bounds = [];
		for (var i = 0; i < bounds.length; i++) {
			this.starterBounds.push(bounds[i])
			this.bounds.push(bounds[i])
		}
		// this.polygon = new PIXI.Polygon(this.bounds);
		this.wallView = new PIXI.Graphics().beginFill(this.type == 'standard' ? 0x864654: 0x021687).drawPolygon(this.starterBounds);
		this.wallView.alpha = 0.8
		this.wallContainer.addChild(this.wallView)

		this.side = 1;

		this.velocity = {x:0,y:0};
	}
	getBounds(){
		this.applyPolygonPosition();
		return this.polygon;
	}
	applyPolygonPosition(){
		for (var i = 0; i < this.bounds.length; i+=2) {
			this.bounds[i] = this.starterBounds[i] + this.x;
			this.bounds[i+1] = this.starterBounds[i+1] + this.y;
		}
		this.polygon = new PIXI.Polygon(this.bounds);

	}
	update(delta){
		if(this.toGlobal(new PIXI.Point()).y > config.height * 1.5){
			this.kill = true;
		}
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
	}
}