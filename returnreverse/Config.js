var Config = {};

//base:
Config.debug = false;
Config.framerate = 60;
Config.backgroundColor = '#fff';

//piece:
Config.colors = ["#ff0000","#9d00ff","#ffffff","#ff00ff","#00ffff","#ffff00"];
Config.perspective = 2.5;//>=1
Config.speed = .0006;//in perc/frame, negative is reverse
Config.size = [.2,.3];//min, max. Distance between gradient stops.
Config.center = [0,0];//center of vortex, x,y in range 0 .. 0.5

//interaction:
Config.interactionMode = 0;//no following of mouse/touch, 1:drag only, 2:drag and move
Config.recenterDelay = 2000;//in msecs
Config.recenterDuration = 1000;//in msecs
Config.recenterEase = createjs.Ease.quadInOut;

//
Config.liveTweaks = {p:["perspective",0], s:["speed",0], size:["size",4], colors:["colors",6], center:["center",4], i:["interactionMode",1]};
