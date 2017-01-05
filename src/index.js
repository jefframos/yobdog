import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import GameScreen from './game/screen/GameScreen';
import LoadScreen from './game/screen/LoadScreen';



PIXI.loader
	.add('./assets/map.json')
	.load(configGame);

function configGame(){

	window.game = new Game(config);
	
	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let gameScreen = new GameScreen('GameScreen');
	let loadScreen = new LoadScreen('LoadScreen');

	game.stage.addChild(screenManager);

	screenManager.addScreen(gameScreen);
	screenManager.addScreen(loadScreen);
	//change to init screen
	screenManager.forceChange('LoadScreen');	

	game.start();
}
