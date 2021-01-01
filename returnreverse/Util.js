var RandomUtil = {};
RandomUtil.pick = function(pool, exceptions)
{
	if (exceptions != null)
	{
		var pool2 = [];
		var n = pool.length;
		for (var i = 0; i < n; i++)
		{
			var item = pool[i];
			if (exceptions.indexOf(item) == -1) pool2.push(item);
		}
		pool = pool2;
	}
	return pool[Math.floor(Math.random() * pool.length)];
}
RandomUtil.between = function(min, max, integer, extremeFactor)
{
	var p = Math.random();
	if (extremeFactor)
	{
		var f = Math.pow((p < .5) ? p * 2 : (1 - p) * 2, extremeFactor);
		p = (p < .5) ? f / 2 : 1 - (f / 2);
	}
	var n = min + p * (max-min);
	if (integer) return Math.floor(n);
	else return n;
}

//

var ColorUtil = { };

ColorUtil.intToHex = function(c)
{
	return "#"+("000000"+c.toString(16)).substr(-6);
}
ColorUtil.interpolateHex = function(from, to, ratio)
{
	var res = ColorUtil.interpolate(parseInt(from.substr(-6), 16), parseInt(to.substr(-6), 16), ratio);
	return ColorUtil.intToHex(res);
}

ColorUtil.interpolate = function(from, to, ratio)
{
	var r = Math.round(((to>>16) - (from>>16)) * ratio + (from>>16));
	var g = Math.round(((to>>8&255) - (from>>8&255)) * ratio + (from>>8&255));
	var b = Math.round(((to&255) - (from&255)) * ratio + (from&255));
	return (r<<16)+(g<<8)+b;
}
