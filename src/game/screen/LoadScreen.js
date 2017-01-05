import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';

export default class LoadScreen extends Screen{
	constructor(label){
		super(label);
	}
	build(){
		super.build();
		
		this.mapSrc = './assets/map.json';

		// this.screenManager.change('GameScreen')

		this.startLoad();
	}

	toGame(){
		this.screenManager.change('GameScreen')
	}
	startLoad(){
		let loader = new PIXI.loaders.Loader(); // you can also create your own if you want

		loader.add(this.mapSrc);

		loader.once('complete',this.onAssetsLoaded.bind(this));

		loader.load();
	}
	onAssetsLoaded(evt){

		let map = evt.resources[this.mapSrc].data;
		let mapLayers = map.layers;

		console.log(map);
		console.log(mapLayers);


		this.levels = [];


		for (var i = 0; i < mapLayers.length; i++) {
			let levelObj = {
				walls:[],
				coins:[],
				enemies:[],
				beginZone:null,
				endZone:null,
				first:false,
				height:0
			}
			if(mapLayers[i].name.indexOf('Pattern')  !== -1){
				console.log(mapLayers[i]);
				if(mapLayers[i].properties && mapLayers[i].properties.first){
					levelObj.first = true;
				}
				for (var j = 0; j < mapLayers[i].objects.length; j++) {
					let obj = mapLayers[i].objects[j];
					if(obj.type == 'wall'){
						levelObj.walls.push(obj);
					}
					if(obj.type == 'beginzone'){
						levelObj.beginZone = obj
					}
					if(obj.type == 'endzone'){
						levelObj.endZone = obj
					}
				}

				levelObj.height = levelObj.beginZone.y - levelObj.endZone.y;

				this.levels.push(levelObj);				
			}
		}

		console.log('levelsssss',this.levels);
		for (var i = 0; i < this.levels.length; i++) {
			let level = this.levels[i];
			for (var j = 0; j < level.walls.length; j++) {
				console.log(level);
				level.walls[j].y -= level.endZone.y;
			}
			
		}


		console.log('levels',this.levels);

		config.levels = this.levels;
		this.toGame();
		return
		if(this.buildedOnce){
			this.destroyGame();
		}

		this.buildedOnce = true;

		this.enemyList = [];
		this.environmentList = [];
		this.bulletList = [];
		this.uiList = [];
		this.spawnerList = [];

		// console.log(evt.resources['./assets/data/map1Data.json'].data.layers)//.data.layers);
		// let map = evt.resources[this.mapSrc].data;
		// let mapLayers = map.layers;
		config.worldBounds = [];
		config.towerList = [];
		config.spawnerList = [];
		config.nestList = [];
		config.players = [];
		config.wayPath = [];
		// console.log(map);
		this.worldBounds = {x:0,y:0, w:map.width * map.tilewidth, h:map.height * map.tileheight}
		// console.log(this.worldBounds);
		for (var i = 0; i < mapLayers.length; i++) {
			if(mapLayers[i].name == 'Ways'){
				for (var k = 0; k < mapLayers[i].objects.length; k++) {
					let path = []
					if(mapLayers[i].objects[k].visible){
						let polyline = (mapLayers[i].objects[k].polyline);
						for (var j = 0; j < polyline.length; j++) {
							path.push(polyline[j].x);
							path.push(polyline[j].y);
						}
						// console.log(mapLayers[i].objects[k]);

						if(mapLayers[i].objects[k].name == 'pathDown1'){
							console.log(path);
							// let cut = 44;
							// path.splice(cut, path.length -cut)
							// this.scaleArrayPoints(path)
							console.log(this.scaleArrayPoints(path, true));
						}
							// path.push(polyline[0].x);
							// path.push(polyline[0].y);
						config.wayPath.push(path)
					}
				}
				// console.log(polyline);
			}
			if(mapLayers[i].name == 'WorldBounds'){
				let polyline = (mapLayers[i].objects[0].polyline);
				for (var j = 1; j < polyline.length; j++) {
					config.worldBounds.push(polyline[j].x)
					config.worldBounds.push(polyline[j].y)
				}
			}
			if(mapLayers[i].name.indexOf('Towers') !== -1){
				let towers = mapLayers[i].objects;
				for (var j = 0; j < towers.length; j++) 
				{
					let tower = towers[j];
					// console.log(tower.name);
					config.towerList.push({name:tower.name, x:tower.x,y:tower.y,team:tower.properties.team});
				}
			}
			if(mapLayers[i].name.indexOf('Hero') !== -1){
				let hero = mapLayers[i].objects[0];
				config.players.push({team:hero.properties.team, x:hero.x,y:hero.y, name:hero.name, type:hero.type});
			}
			if(mapLayers[i].name.indexOf('Nests') !== -1){
				for (var j = 0; j < mapLayers[i].objects.length; j++) {
					let nest = mapLayers[i].objects[j];
					config.nestList.push({name:nest.name, x:nest.x, y:nest.y});
				}
			}
			if(mapLayers[i].name.indexOf('Spawner') !== -1 && mapLayers[i].visible){
				console.log(mapLayers[i]);
				let spawers = mapLayers[i].objects;
				let spwPosition = {x:0,y:0};
				let spawnerObject = {pos:null, team:-1, waypoints:[]};
				for (var j = 0; j < spawers.length; j++) {
					let data = spawers[j];
					if(data.name.indexOf('spawner') !== -1){
						spawnerObject.pos = {x:data.x,y:data.y};
						spawnerObject.team = data.properties.team;
					}
					else if(data.name.indexOf('waypoints') !== -1){
						let waypoints = [];
						// console.log(data);
						// if(data.properties.invertList){
						// 	for (var k = data.polyline.length - 1; k >= 1; k--) {
						// 	 	let wayPos = {x:data.polyline[k].x,y:data.polyline[k].y}
						// 	 	spawnerObject.waypoints.push(wayPos);
						// 	}
						// }else{
							for (var k = 1; k<data.polyline.length; k++) {
								let wayPos = {x:data.polyline[k].x,y:data.polyline[k].y}
								spawnerObject.waypoints.push(wayPos);
							}
						// }
					}
				}
				config.spawnerList.push(spawnerObject);
			}

		}

	}
}
