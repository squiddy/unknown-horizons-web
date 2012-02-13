var background_ctx,
	foreground_ctx,
	scale = 1,
	base_texture,
	nature_texture,
	building_texture,
	water_layer,
	street_layer,
	island_layer,
	grid_layer,
	building_layer;

TILE_WIDTH *= scale;
TILE_HEIGHT *= scale;

var origin = {x: 0, y: document.height},
	DEBUG = false;


var Grid = {
	ScreenToMapCoordinates: function(x, y) {
		y -= origin.y;
		var mx = Math.floor(x / TILE_WIDTH - y / TILE_HEIGHT),
			my = Math.floor(x / TILE_WIDTH + y / TILE_HEIGHT);
		return [mx, my];
	},
	MapToScreenCoordinates: function(x, y) {
		var sx = origin.x + (x + y) * TILE_WIDTH / 2,
			sy = origin.y + (y - x) * TILE_HEIGHT / 2;
		return [sx, sy];
	}
};


$(document).ready(init);


function init_stats() {
    var el, stats;

    stats = new Stats();
    el = stats.getDomElement();
    el.style.position = 'fixed';
    el.style.left = '0px';
    el.style.top = '0px';

    document.body.appendChild(el);

    setInterval(stats.update, 1000 / 60);
}

function init() {
	init_stats();

	var canvas = document.getElementById('background');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	water_layer = new WaterLayer(canvas);
	island_layer = new IslandLayer(canvas, map['islands'][0]['grounds']);

	canvas = document.getElementById('foreground');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	grid_layer = new GridLayer(canvas);
	building_layer = new BuildingLayer(canvas, map['buildings']);

	canvas = document.getElementById('streets');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;
	street_layer = new StreetLayer(canvas, map['buildings']);

	load_assets();

	$('input[name=grid]').change(function() {
		DEBUG = $(this).is(':checked');

		grid_layer.clear();
		street_layer.clear();
		if (DEBUG) grid_layer.render();
		street_layer.render();
		building_layer.render();
	});

	$('canvas').mousemove(function(e) {
		var coords = Grid.ScreenToMapCoordinates(e.pageX, e.pageY);
		$('#coords').html(coords[0] + ':' + coords[1]);
	});
}

function load_assets() {
	var loaded = 0;
	function ready() {
		loaded++;
		if (loaded == 3) {
			pre_draw();
		}
	}

	base_texture = new Image();
	base_texture.src = 'res/textures/base.png'
	base_texture.onload = ready;

	nature_texture = new Image();
	nature_texture.src = 'res/textures/nature.png'
	nature_texture.onload = ready;

	building_texture = new Image();
	building_texture.src = 'res/textures/building.png'
	building_texture.onload = ready;
}

function pre_draw() {
	// draw once
	water_layer.render();
	island_layer.render();
	if (DEBUG) grid_layer.render();
	street_layer.render();
	building_layer.render();

	draw();
}

function draw() {
	webkitRequestAnimationFrame(draw);
}
