// import Gamepad from './Gamepad'
import utils  from '../utils';
import config  from '../config';
export default class Camera{
	constructor(game, worldMap){
		this.game = game;
		this.entityFollow = null;
		this.velocity = {x:0, y:0};
		this.velocityPlus = {x:0, y:0};
		this.virtualVelocity = {x:0, y:0};
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.worldMap = worldMap;
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.cameraDelayStandard = {x:1};
		this.cameraDelay = {x:0};
		this.cameraStopping = {x:false};
		this.cameraMoving = {x:false};
		this.fixCamera = false;
		this.startDelay = -1;
		this.currentZoom = 1;
		this.maxZoom = 1.1;
		// this.maxZoom = 1.2;
		this.minZoom = 0.055;

		this.bounds = {x:config.width * 0.2, y:config.height * 0.2, w:config.width - config.width * 0.4, h:config.height - config.height * 0.4}
		//se a distancia minima da camera for pequena, parece que o cara ta bebado
		this.cameraBounds = new PIXI.Graphics().lineStyle(1, 0xFF0000).drawRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h);
		this.worldMap.parent.addChild(this.cameraBounds);
	}
	
	follow(entity){
		this.entityFollow = entity;

		this.updatePosition(true);
	}

	shake(force, steps, time){
		if(!force){
			force = 1;
		}
		if(!steps){
			steps = 4;
		}
		if(!time){
			time = 1;
		}
		let timelinePosition = new TimelineLite();
		let positionForce = (force * 50);
		let spliterForce = (force * 20);
		let speed = time / steps;
		let currentPosition = {x:this.worldMap.x, y:this.worldMap.y};
		for (var i = steps; i >= 0; i--) {
			timelinePosition.append(TweenLite.to(this.worldMap.position, speed, {x:currentPosition.x+ Math.random() * positionForce - positionForce/2, y:currentPosition.y+ Math.random() * positionForce - positionForce/2, ease:"easeNoneLinear"}));
		};

		timelinePosition.append(TweenLite.to(this.worldMap.position, speed, {x:currentPosition.x, y:currentPosition.y, ease:"easeeaseNoneLinear"}));		
	}

	unfollow(){
		this.entityFollow = null;
	}
	
	zoomOut(value){
		return
		this.currentZoom -= value?value:0.1;
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom2(value){
		this.currentZoom += value;
		if(this.currentZoom > this.maxZoom){
			this.currentZoom = this.maxZoom;
		}
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom(value, time, delay){


		this.currentZoom = value;	
		TweenLite.killTweensOf(this.worldMap.scale)
		TweenLite.to(this.worldMap.scale, time?time:0.5, {delay:delay?delay:0, x:this.currentZoom, y:this.currentZoom});//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
		//this.worldMap.scale.set(value);//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
	}
	zoomBounce(value, time, delay){


		this.currentZoom = value;	
		TweenLite.killTweensOf(this.worldMap.scale)
		TweenLite.to(this.worldMap.scale, time?time:0.5, {delay:delay?delay:0, x:this.currentZoom, y:this.currentZoom, ease:'easeOutBack'});//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
		//this.worldMap.scale.set(value);//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
	}
	updatePosition(force){
		if(!this.entityFollow){
			return
		}
		if(force){
			console.log('force');
		}
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);

		if(force){
			//this.worldMap.x = (config.width / 2) - (globalEntityPosition.x)* this.worldMap.scale.x +  (globalWorldPosition.x) * this.worldMap.scale.x;
			//this.worldMap.y = (config.height / 2) - (globalEntityPosition.y)* this.worldMap.scale.y +  (globalWorldPosition.y)  * this.worldMap.scale.y;

//			TweenLite.to(this.worldMap, 0.1 ,{x:config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x, y:config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y});

			// let tempW = this.worldMap.width/this.worldMap.scale.x;
			// let tempH = this.worldMap.height/this.worldMap.scale.y;

			this.worldMap.pivot.x =this.entityFollow.x// -(this.entityFollow.x - tempW)// * this.worldMap.scale.x//((config.width / 2) - (globalEntityPosition.x) +  (globalWorldPosition.x))/2 
			this.worldMap.pivot.y = this.entityFollow.y//-(this.entityFollow.y - tempH) //* this.worldMap.scale.y//((config.height / 2) - (globalEntityPosition.y) +  (globalWorldPosition.y))/2

			this.worldMap.x = config.width / 2//-this.worldMap.pivot.x/2;
			this.worldMap.y = config.height / 2//-this.worldMap.pivot.y/2;


			// console.log(this.worldMap.width/this.worldMap.scale.x);
		//console.log(this.worldMap.x, force);
			return
		}

		let middleDistance = utils.distance(globalEntityPosition.x, globalEntityPosition.y, config.width/2, config.height/2);
		// console.log(middleDistance);
		if(globalEntityPosition.x < this.bounds.x){
			this.worldMap.pivot = {x:this.entityFollow.x, y:this.entityFollow.y}
			this.worldMap.x = this.bounds.x
		}else if(globalEntityPosition.x > this.bounds.x + this.bounds.w){
			this.worldMap.pivot = {x:this.entityFollow.x, y:this.entityFollow.y}
			this.worldMap.x = this.bounds.x + this.bounds.w
		}
	}
	update(delta){

		if(!this.entityFollow){
			return;
		}

		if(this.startDelay > 0){
			this.startDelay -= delta;
			return;	
		}

		this.updatePosition();
	}
	
}