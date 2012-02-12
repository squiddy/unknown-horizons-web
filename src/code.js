var background_ctx,
	streets_ctx,
	foreground_ctx,
	scale = 1,
	base_texture,
	nature_texture,
	building_texture;

TILE_WIDTH *= scale;
TILE_HEIGHT *= scale;

var origin = {x: 0, y: document.height},
	DEBUG = false;


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

	background_ctx = canvas.getContext('2d');
	background_ctx.fillStyle = "#000";
	background_ctx.fillRect(0, 0, canvas.width, canvas.height);

	canvas = document.getElementById('foreground');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	foreground_ctx = canvas.getContext('2d');
	foreground_ctx.clearRect(0, 0, canvas.width, canvas.height);

	canvas = document.getElementById('streets');
	canvas.width = document.width * 2;
	canvas.height = document.height * 2;

	streets_ctx = canvas.getContext('2d');
	streets_ctx.clearRect(0, 0, canvas.width, canvas.height);

	load_assets();
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
	draw_water(background_ctx);
	draw_island(background_ctx, map['islands'][0]['grounds']);
	if (DEBUG) draw_grid(foreground_ctx);
	draw_buildings(map['buildings']);

	draw();
}

function draw() {
	webkitRequestAnimationFrame(draw);
}

function draw_grid(ctx) {
	ctx.strokeStyle = "#000";
	for (var x = 0; x < document.width * 2; x += TILE_WIDTH) {
		for (var y = 0; y < document.height * 2; y += TILE_HEIGHT) {
			ctx.moveTo(origin.x + x,              origin.y + y);
			ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y + y - TILE_HEIGHT);
			ctx.moveTo(origin.x + x,              origin.y + y);
			ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y + y + TILE_HEIGHT);

			ctx.moveTo(origin.x + x,              origin.y - y);
			ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y - y - TILE_HEIGHT);
			ctx.moveTo(origin.x + x,              origin.y - y);
			ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y - y + TILE_HEIGHT);
		}
	}
	ctx.stroke();
}

function draw_water(ctx) {
	var tex = sprites['deep/straight/45'];

	for (var i = -1; i < 16; i++) {
		for (var j = -1; j < 16; j++) {
			var x = j * tex.width * scale,
				y = i * tex.height * scale;
			ctx.drawImage(base_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
			x += tex.width * scale / 2;
			y += tex.height * scale / 2;
			ctx.drawImage(base_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
		}
	}
}

function draw_island(ctx, island) {
	for (var i = 0, len = island.length; i < len; i++) {
		var tile_x = island[i][0],
			tile_y = island[i][1],
			tile_type = island[i][2];

		var tex = sprites[TILE_TEXTURE[tile_type] + '/' + island[i][3] + '/' + island[i][4]];

		var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
			y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2 + TILE_HEIGHT / 2;

		ctx.drawImage(base_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, TILE_WIDTH, TILE_HEIGHT);
	}
}

function draw_buildings(buildings) {
	for (var i = 0, len = buildings.length; i < len; i++) {
		var tile_type = buildings[i][0];

		if (tile_type === 15) {
			draw_building(streets_ctx, buildings[i]);
		} else {
			draw_building(foreground_ctx, buildings[i]);
		}
	}
}

function draw_building(ctx, building) {
	var tile_type = building[0],
		tile_x = building[1],
		tile_y = building[2];

	var info = BUILDINGS[tile_type];
	if (info === undefined) {
		console.log('Unknown building: ' + tile_type);
		return;
	}

	var tex_name = info.textures[Math.floor(Math.random() * info.textures.length)];
	var tex = nature_sprites[tex_name];
	var texture = nature_texture;

	if (tex === undefined) {
		console.log(tex_name + ' not found in nature, trying buildings');
		tex = building_sprites[tex_name];
		texture = building_texture;
		if (tex === undefined) {
			console.log(tex_name + ' not found in buildings');
			return;
		}
	}

	// why?
	tile_x -= 1;
	tile_y += 1;

	var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
		y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2;

	if (DEBUG) draw_base(ctx, x, y, 1, 1, 'rgba(255, 0, 0, 0.8)');
	if (DEBUG) draw_base(ctx, x, y, info.size_x, info.size_y, 'rgba(255, 255, 0, 0.5)');

	y += info.size_y * TILE_HEIGHT / 2;
	y -= tex.height * scale;

	ctx.drawImage(texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
}

function draw_base(ctx, x, y, width, height, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.moveTo(x,                          y);
	ctx.lineTo(x + width * TILE_WIDTH / 2, y - height * TILE_HEIGHT / 2);
	ctx.lineTo(x + width * TILE_WIDTH,     y);
	ctx.lineTo(x + width * TILE_WIDTH / 2, y + height * TILE_HEIGHT / 2);
	ctx.lineTo(x,                          y);
	ctx.fill();
}
