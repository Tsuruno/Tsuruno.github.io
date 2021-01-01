(function(window) {
	var Piece = function(canvas, config)
	{
		this.initialize(canvas, config);
	}
	var p = Piece.prototype = new BasePiece();
	//
	p.initialize = function(canvas, config)
	{
		BasePiece.prototype.initialize.call(this, canvas, config);
		this.initInteraction();
	}

	/*********************************
	 *		    INTERACTION
	 ********************************/

	p.initInteraction = function()
	{
    if (this.config.interactionMode>0) {
      this.stage.addEventListener("stagemouseup", this.handleMouseUp.bind(this));
      this.stage.addEventListener("stagemousedown", this.handleMouseDown.bind(this));
      this.stage.addEventListener("stagemousemove", this.handleMouseMove.bind(this));
    }
	}
	p.handleMouseDown = function(e)
	{
		if (this.pointerID!=null) return;
    this.pointerID = e.pointerID;
    var x = e.stageX-this.width/2, y = e.stageY-this.height/2;
    this.changeCenter(x,y);
	}
	p.handleMouseUp = function(e)
	{
		if (this.pointerID!=this.pointerID) return;
    this.pointerID = null;
	}
	p.handleMouseMove = function(e)
	{
		if (this.pointerID!=null && this.pointerID!=this.pointerID) return;
    if (this.config.interactionMode<2 && this.pointerID==null) return;
    var x = e.stageX-this.width/2, y = e.stageY-this.height/2;
    this.changeCenter(x,y);
	}

	p.onKeyUp = function(e)
	{
		BasePiece.prototype.onKeyUp.call(this, e);
		if (!this.config.debug) return;
		var c = String.fromCharCode(e.which);
		if (c=="R") this.reset();
		else if (c=="I") this.config.speed *= -1;
		else if (c=="C") this.recenter();
	}


	/*********************************
	 *			    FLOW
	 ********************************/

	p.setSize = function(w,h,dpr)
	{
		w = this.width = Math.floor(w*dpr);
		h = this.height = Math.floor(h*dpr);
    this.radius = Math.sqrt(w*w+h*h)/2;
		//
		this.stage.x = w/2;
		this.stage.y = h/2;
		log("setSize",w,h,dpr);
    ///
    this.vortexCenter = new createjs.Point(this.config.center[0]*w,this.config.center[1]*h);
    this.vortexCenterOrig = this.vortexCenter.clone();
		if (!this.stops) this.reset();
	}

	p.start = function()
	{
		BasePiece.prototype.start.apply(this);
		this.shape = this.stage.addChild(new createjs.Shape());
		this.ease = createjs.Ease.getPowIn(this.config.perspective);
	}

	p.reset = function()
	{
		const cfg = this.config;
		var s = RandomUtil.between.apply(null, cfg.size);
		var p = RandomUtil.between(-s,0);
    var color;
		this.stops = [];
		while (p<1) {
      color = this.getRandomColor(color);
			this.stops.push({position:p, size:s, color:color});
			p += s;
			s = RandomUtil.between.apply(null, cfg.size);
		}
		//
		this.draw();
	}

	p.update = function()
	{
		var cfg = this.config, d = cfg.speed;
		for (var i=0;i<this.stops.length;i++) {
      this.stops[i].position += d;
    }
		//
    var ref = this.stops[0], p0 = ref.position, s0 = ref.size, c0 = ref.color;
    if (p0+s0<0) {
      this.stops.shift();
    }
    else if (p0>0) {
      var s = RandomUtil.between.apply(null, cfg.size);
      var stop = {position:p0-s, size:s, color:this.getRandomColor(c0)};
      this.stops.unshift(stop);
    }
    if (this.stops[this.stops.length-2].position>1) {
      this.stops.pop();
    }
    var ref = this.stops[this.stops.length-1], p0 = ref.position, s0 = ref.size, c0 = ref.color;
    if (p0<1) {
      var s = RandomUtil.between.apply(null, cfg.size);
      var stop = {position:p0+s0, size:s, color:this.getRandomColor(c0)};
      this.stops.push(stop);
    }
	  //
		this.draw();
		return true;
	}


	/*********************************
	 *			    VORTEX CENTER
	 ********************************/

  p.changeCenter = function(x,y) {
    this.vortexCenter.setValues(x,y);
    this.scheduleRecenter();
  }

  p.scheduleRecenter = function() {
    this.stopRecenter();
    createjs.Tween.get(this.vortexCenter).wait(this.config.recenterDelay).call(this.recenter.bind(this));
  }

  p.recenter = function() {
    this.stopRecenter();
    var orig = this.vortexCenterOrig;
    createjs.Tween.get(this.vortexCenter).to({x:orig.x, y:orig.y},this.config.recenterDuration, this.config.recenterEase);
  }

  p.stopRecenter = function() {
    createjs.Tween.removeTweens(this.vortexCenter);
  }

	/*********************************
	 *			    DRAW
	 ********************************/

	var cs = [], rs = [];
	p.draw = function()
	{
		var ss = this.stops, n = ss.length;
		var s = this.radius, w = this.width/2, h = this.height/2;
    //first band (center): draw visible part
    var p0 = -ss[0].position/ss[0].size;
    var c = ColorUtil.interpolateHex(ss[0].color,ss[1].color, p0);
    cs.length = 0;
    rs.length = 0;
    cs.push(c);
    rs.push(0);
    for (var i=1;i<n;i++) {
      var stop = ss[i];
      if (stop.position>1) {
        c = ColorUtil.interpolateHex(ss[i-1].color,stop.color, 1-(stop.position-1)/ss[i-1].size);
        cs.push(c);
        rs.push(1);
        break;
      }
      else {
        cs.push(stop.color);
        rs.push(this.ease(stop.position));
      }
    }
    var g = this.shape.graphics.c();
    var r0 = this.ease(p0)*s;
    g.rf(cs, rs, this.vortexCenter.x,this.vortexCenter.y,0, 0,0,s)
    .dr(-s,-s,2*s,2*s);
	}

  var except = [];
  p.getRandomColor = function(exceptColor) {
    except[0] = exceptColor;
    return RandomUtil.pick(this.config.colors, except);
  }

	window.Piece = Piece;

}(window));
