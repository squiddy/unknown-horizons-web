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
	building_layer,
	texture_manager,
	minimap,
	map;

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
    var stats;

    stats = new Stats();
    $('#content').prepend(stats.getDomElement());

    setInterval(stats.update, 1000 / 60);
}

function init() {
	init_stats();

	map = new Map(map_data);

	var canvas = document.getElementById('background');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	water_layer = new WaterLayer(canvas);
	island_layer = new IslandLayer(canvas, map);

	canvas = document.getElementById('foreground');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	grid_layer = new GridLayer(canvas);
	building_layer = new BuildingLayer(canvas, map);

	canvas = document.getElementById('streets');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;
	street_layer = new StreetLayer(canvas, map);

	texture_manager = new TextureManager();
	texture_manager.add('res/textures/base.png', sprites);
	texture_manager.add('res/textures/nature.png', nature_sprites);
	texture_manager.add('res/textures/building.png', building_sprites);
	texture_manager.load(pre_draw);

	canvas = document.getElementById('minimap-display');
	minimap = new Minimap(canvas, map);

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

function pre_draw() {
	// draw once
	water_layer.render();
	island_layer.render();
	if (DEBUG) grid_layer.render();
	street_layer.render();
	building_layer.render();
	minimap.render();

	draw();
}

function draw() {
	webkitRequestAnimationFrame(draw);
}
