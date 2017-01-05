import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import InputManager  from '../InputManager';
import CookieManager  from '../CookieManager';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import Player from '../entity/Player';
import Wall from '../entity/Wall';
import Camera from '../Camera';

export default class GameScreen extends Screen{
	constructor(label){
		super(label);
	}

	
	build(){
		super.build();

		this.background = new PIXI.Graphics().beginFill(0x023548).drawRect(0,0,config.width, config.height);
		this.addChild(this.background)


		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer)
		

		this.player = new Player(this);

		this.player.x = config.width / 2;
		this.player.y = -config.height/2;
		this.gameContainer.addChild(this.player);

		this.camera = new Camera(this, this.gameContainer);
		this.camera.follow(this.player)

		this.wallList = [];
		this.addEvents();

		this.updateList = [];
		this.updateList.push(this.player);

		this.gameSpeed = 350;

		// this.addWalls()

		this.wallTimer = 0.5;
		this.middleWallTimer = 3;

		this.endZoneLine = new PIXI.Graphics().beginFill(0x00ffff).drawRect(-500,0,config.width + 1000, 5);
		this.gameContainer.addChild(this.endZoneLine);
		this.addWall2({x:-150, y:-config.height*2}, [0, 0, 200, 0, 200,config.height*2 , 0, config.height*2])
		this.addWall2({x:config.width - 50, y:-config.height*2}, [0, 0, 200, 0, 200,config.height*2 , 0, config.height*2])

		this.player.jump(true);
		this.endZone = 0;
		this.beginZone = 0;
		this.buildPattern(true);
	}
	addWall2(pos, shape, type = 'standard'){
		if(Math.random() < 0.2){
			type = 'slippery';
		}
		let wall = new Wall(this, type, shape);
		this.gameContainer.addChild(wall)
		this.wallList.push(wall);
		wall.x = pos.x;
		wall.y = pos.y;
		wall.velocity.y = this.gameSpeed;
		this.updateList.push(wall);
	}
	// addMiddleWall(){
	// 	this.addWall({x:config.width / 2 - 25, y:-config.height}, [0, 0, 50, 0, 50,500 , 0, 500])
	// }
	// addWalls(){
	// 	let w = 100
	// 	let h = 400
	// 	this.addWall({x:-w/2, y:-config.height}, [0, 0, w, 0, w,h , 0, h])
	// 	this.addWall({x:config.width - w/2, y:-config.height + 250}, [0, 0, w, 0, w,h , 0, h])
	// 	this.addWall({x:-config.width * 1.5, y:-config.height}, [0, 0, w, 0, w,620 , 0, 620])
	// 	this.addWall({x:config.width * 1.5, y:-config.height}, [0, 0, w, 0, w,620 , 0, 620])
	// }

	addWall(wallData, first){
		let shape = [0, 0, wallData.width, 0, wallData.width,wallData.height , 0, wallData.height]
		// if(Math.random() < 0.2){
		// 	type = 'slippery';
		// }
		let wall = new Wall(this, 'standard', shape);
		this.gameContainer.addChild(wall)
		this.wallList.push(wall);
		wall.x = wallData.x;
		wall.y = wallData.y - this.currentPattern.height - config.height*2// + (first?0:-config.height);
		wall.velocity.y = this.gameSpeed;
		this.updateList.push(wall);
	}

	normalSpeed(){
		this.gameSpeed = 350;
		for (var i = 0; i < this.wallList.length; i++) {
			this.wallList[i].velocity.y = this.gameSpeed;
		}
	}
	reduceSpeed(){
		this.gameSpeed = 150;
		for (var i = 0; i < this.wallList.length; i++) {
			this.wallList[i].velocity.y = this.gameSpeed;
		}
	}
	buildPattern(first){
		if(first){
			for (var i = 0; i < config.levels.length; i++) {
				if(config.levels[i].first){
					this.currentPattern = config.levels[i];
					break;
				}
			}
		}else{
			let id =Math.floor( Math.random() * config.levels.length);
			while(config.levels[id].first){
				 id =Math.floor( Math.random() * config.levels.length);
			}
			this.currentPattern = config.levels[id];
		}
		this.endZone = this.currentPattern.endZone.y - this.currentPattern.height //-  this.currentPattern.endZone.y + config.height;
		this.endZoneLine.y = this.endZone;
		for (var i = 0; i < this.currentPattern.walls.length; i++) {
			let wall = this.currentPattern.walls[i];
			this.addWall(wall, first);
		}

	}
	updateCurrentLevel(){


	}
	updateComboBar(){
		
	}
	addCombo(){
		

	}
	//EVENTS
	removeEvents(){
		this.off('touchstart').off('mousedown');
		this.off('touchend').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
		this.interactive = true;
		this.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this)); 
		this.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)); 	    
	}
	onMouseMoveCallback(e) {
		
	}
	onTapUp(e) {
		// console.log('up');
	}
	onTapDown(e) {
		// console.log('down');

		this.player.jump()

	}
	onPauseCallback() {
		
	}

	//GAMEPLAY
	
	//end game
	endGame() {
		
	}
	
	addBottomHUD() {
		
	}
	
	addInfoLabel(label, addEffects, dontRemove, grey) {
		
	}
	initGame() {
		

	}
	
	showGame(){
		
	}
	hideGame(){
		
	}
	showMenu(){
		
		
	}
	updateMenu(){

	}
	//end timer
	selectMenu(){
		
	}
	//destroy game
	destroyGame(){
		while(this.gameContainer.children.length){

			this.gameContainer.removeChildAt(0);
		}
		this.removeEvents();
	}
	
	gameOver() {
		
	}
	//SCREEN
	
	
	//UPDATE
	//update timer
	updateTimer(delta){
		if(this.ended){
			return;
		}
		
	}
	
	update(delta){
		super.update(delta);

		// return

		this.endZone += delta * this.gameSpeed;
		this.endZoneLine.y = this.endZone;
		if(this.endZone > 0){
			// return
			this.buildPattern();
		}
		// console.log(this.endZone);
		
		this.wallTimer -= delta * (this.gameSpeed / 300);
		if(this.wallTimer <= 0){
			// this.addWalls();
			this.wallTimer = 2
		}

		this.middleWallTimer -= delta* (this.gameSpeed / 300);
		if(this.middleWallTimer <= 0){
			// this.addMiddleWall();
			this.middleWallTimer = 5
		}
		// this.gameContainer.y += this.gameSpeed * delta;
		for (var i = 0; i < this.wallList.length; i++) {
			if(this.wallList[i].kill){
				this.wallList.splice(i,1);
			}
		}	
		for (var i = 0; i < this.updateList.length; i++) {
			this.updateList[i].update(delta)
			if(this.updateList[i].kill){
				this.updateList[i].parent.removeChild(this.updateList[i]);
				this.updateList.splice(i,1);
			}
		}
		this.camera.update(delta);
	}
}
