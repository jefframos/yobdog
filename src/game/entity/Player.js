import PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';

export default class Player extends PIXI.Container{
	constructor(game){
		super();

		this.game = game;
		this.radius = 25;
		this.playerContainer = new PIXI.Container();
		this.addChild(this.playerContainer);
		this.playerView = new PIXI.Graphics().beginFill(0xff5555).drawCircle(0,0,this.radius);

		this.velocity = {x:0,y:0};
		this.speed = {x: 1300, y:-20};
		this.playerContainer.addChild(this.playerView)

		this.side = 1;
		this.currentStickedWall = null;
	}
	jump(force){
		if(!this.currentStickedWall && !force){
			return;
		}
		this.side *= -1;
		this.velocity.x = this.speed.x * this.side;
		this.currentStickedWall = null;

		this.game.camera.zoom(0.5, 1);
	}
	wallCollide(){
		for (var i = 0; i < this.game.wallList.length; i++) {
			let test = this.game.wallList[i].getBounds().contains(
					this.x + this.getRadius() * this.side, this.y + this.getRadius()/2
				) ||
				this.game.wallList[i].getBounds().contains(
					this.x + this.getRadius() * this.side, this.y - this.getRadius()/2
				)
			
			if(test){
				return this.game.wallList[i];
			}
		}
		return null
	}
	stickWall(wall){
		this.currentStickedWall = wall;


		if(this.currentStickedWall.type == 'slippery'){
			this.game.reduceSpeed();
		}else{
			this.game.normalSpeed();
		}
		TweenLite.to(this.playerContainer.scale, 0.3, {x:1, y:1, ease:'easeOutBounce'});
		// TweenLite.to(this.playerContainer, 0.2, {rotation:0});
		this.playerContainer.rotation = 0;

		if(wall.x < this.x){
			this.x = wall.x + this.currentStickedWall.wallContainer.width
		}else{
			this.x = wall.x
		}
		this.game.camera.zoom(1);
		// this.game.camera.zoom2(1);
	}
	getRadius(){
		return this.scale.x * this.radius;
	}
	update(delta){

		//this.velocity.y = -this.game.gameSpeed;
		if(this.velocity.x && !this.currentStickedWall){
			this.playerContainer.scale.x = 1.5;
			this.playerContainer.scale.y = 0.5;
			this.playerContainer.rotation = -Math.atan2(this.game.gameSpeed,this.velocity.x)
		}
		let wallCollide = this.wallCollide()
		if(!wallCollide){
			this.currentStickedWall = null;
			this.x += this.velocity.x * delta;
			this.game.normalSpeed();
		}else if(this.currentStickedWall != wallCollide){
			this.stickWall(wallCollide);
		}
		this.y += this.velocity.y * delta;
	}
}