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
		this.headView = new PIXI.Graphics().beginFill(0xff55ff).drawCircle(0,0,this.radius/2);

		this.velocity = {x:0,y:0};
		this.speed = {x: 1300, y:-20};
		this.gravity = 1500;
		this.playerContainer.addChild(this.playerView)
		this.headView.y = - this.radius
		this.playerContainer.addChild(this.headView)

		this.side = 1;
		this.currentStickedWall = null;

		this.falling = false;


	}
	jump(force){
		if(this.falling){
			return
		}
		if(!this.currentStickedWall && !force){
			return;
		}
		this.side *= -1;
		this.velocity.x = this.speed.x * this.side;
		this.currentStickedWall = null;

		this.game.camera.zoom(0.5, 1);
	}
	getHeadBounds(){
		return {x:this.x + this.headView.x - this.headView.width/2, y:this.y + this.headView.y - this.headView.height/2,
				width:this.headView.width, height:this.headView.height}
	}
	headCollision(){
		this.headView.tint = 0xFFFFFF
		for (var i = 0; i < this.game.wallList.length; i++) {
			let wallBounds = this.game.wallList[i].getHeadHitBounds()
			let headBounds = this.getHeadBounds()
			if(headBounds.x < wallBounds.x + wallBounds.width &&
			   headBounds.x + headBounds.width > wallBounds.x &&
			   headBounds.y < wallBounds.y + wallBounds.height &&
			   headBounds.height + headBounds.y > wallBounds.y){
				this.headView.tint = 0xFF0000
				this.game.wallList[i].wallView.tint = 0x0000ff;
				return true
			}else{
				this.game.wallList[i].wallView.tint = 0xffffff;
			}
			// if(test){
			// 	return this.game.wallList[i];
			// }
		}
		// return null
	}
	wallCollide(){
		for (var i = 0; i < this.game.wallList.length; i++) {

			let test = this.velocity.x < 0 && this.game.wallList[i].getPolygon().contains(
					this.x - this.getRadius() , this.y//4
				) || this.velocity.x > 0 &&
				this.game.wallList[i].getPolygon().contains(
					this.x + this.getRadius() , this.y//4
				)			
			if(test){
				this.game.wallList[i].wallView.tint = 0xff0000;
				return this.game.wallList[i];
			}else{
				this.game.wallList[i].wallView.tint = 0xffffff;
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
	}
	getRadius(){
		return this.playerContainer.scale.x * this.radius;
	}
	die(){
		this.game.gameOver();
		TweenLite.to(this.playerContainer.scale, 0.3, {x:1, y:1, ease:'easeOutBounce'});
		this.falling = true;
		this.gameOver = true;
		this.velocity.x *= - 0.2;
		this.velocity.y = 0;
	}
	dyingLoop(delta){
		this.game.camera.unfollow();

		this.velocity.y += this.gravity * delta;

		this.playerContainer.rotation = Math.atan2(this.velocity.y,this.velocity.x) - 3.14

		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;

		if(this.y > config.height){
			this.kill = true;
		}
	}
	jumpingLoop(delta){
		//this.velocity.y = -this.game.gameSpeed;
		// console.log(this.velocity);
		let headCollision = this.headCollision();
		if(headCollision){
			this.die();
			return;
		}
		if(this.velocity.x && !this.currentStickedWall){
			this.playerContainer.scale.x = 1.5;
			this.playerContainer.scale.y = 0.5;
			if(this.velocity.x < 0){
				this.playerContainer.rotation = Math.atan2(this.game.gameSpeed,Math.abs(this.velocity.x))
			}else{
				this.playerContainer.rotation = -Math.atan2(this.game.gameSpeed,Math.abs(this.velocity.x))				
			}
		}
		let wallCollide = this.wallCollide();
		if(!wallCollide){
			this.currentStickedWall = null;
			this.x += this.velocity.x * delta;
			this.game.normalSpeed();
		}else if(this.currentStickedWall != wallCollide){
			this.stickWall(wallCollide);
		}
		this.y += this.velocity.y * delta;
		
	}
	update(delta){
		if(!this.falling){
			this.jumpingLoop(delta);
		}else{
			this.dyingLoop(delta);
		}

	}
}