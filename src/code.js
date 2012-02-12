var background_ctx,
	foreground_ctx,
	scale = 0.4,
	base_texture,
	tile_texture = {
		1: 'beach-shallow',
		2: 'shallow-deep',
		3: 'grass',
		4: 'grass-beach',
		5: 'beach-shallow',
		6: 'beach'
	};

var BUILDINGS = {
	17: ['trees/as_tupelo1/idle_full/45', 'trees/as_birch/idle_full/45', 'trees/as_maple1/idle_full/45',
		 'trees/as_tupelo/idle_full/45', 'trees/as_maple2/idle_full/45', 'trees/as_spruce/idle_full/45',
		 'trees/as_tupelo2/idle_full/45', 'trees/as_maple3/idle_full/45', 'trees/as_spruce1/idle_full/45'],
	23: ['resources/as_clay/idle/45/1.png'],
	33: ['fish'],
	34: ['mountains/as_mountain5x5/idle/45']
};

var origin = {x: 0, y: document.height / 2},
	TILE_WIDTH = 64 * scale,
	TILE_HEIGHT = 32 * scale;


$(document).ready(init);


function init_stats() {
    var el, stats;

    stats = new Stats();
    el = stats.getDomElement();
    el.style.position = 'absolute';
    el.style.left = '0px';
    el.style.top = '0px';

    document.body.appendChild(el);

    setInterval(stats.update, 1000 / 60);
}

function init() {
	init_stats();

	var canvas = document.getElementById('background');
	canvas.width = document.width;
	canvas.height = document.height;

	background_ctx = canvas.getContext('2d');
	background_ctx.fillStyle = "#000";
	background_ctx.fillRect(0, 0, canvas.width, canvas.height);

	canvas = document.getElementById('foreground');
	canvas.width = document.width;
	canvas.height = document.height;

	foreground_ctx = canvas.getContext('2d');
	foreground_ctx.clearRect(0, 0, canvas.width, canvas.height);

	load_assets();
}

function load_assets() {
	var loaded = 0;
	function ready() {
		loaded++;
		if (loaded == 2) {
			pre_draw();
		}
	}

	base_texture = new Image();
	base_texture.src = 'res/base.png'
	base_texture.onload = ready;

	nature_texture = new Image();
	nature_texture.src = 'res/nature.png'
	nature_texture.onload = ready;
}

function pre_draw() {
	// draw once
	draw_water(background_ctx);
	draw_island(background_ctx, map['islands'][0]['grounds']);
	//draw_grid(foreground_ctx);
	draw_buildings(foreground_ctx, map['buildings']);

	draw();
}

function draw() {
	webkitRequestAnimationFrame(draw);
}

function draw_grid(ctx) {
	ctx.strokeStyle = "#000";
	for (var x = 0; x < document.width; x += TILE_WIDTH) {
		for (var y = 0; y < document.height; y += TILE_HEIGHT) {
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

	for (var i = -1; i < 8; i++) {
		for (var j = -1; j < 8; j++) {
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

		var tex = sprites[tile_texture[tile_type] + '/' + island[i][3] + '/' + island[i][4]];

		var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
			y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2 + TILE_HEIGHT / 2;

		ctx.drawImage(base_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, TILE_WIDTH, TILE_HEIGHT);
	}
}

function draw_buildings(ctx, buildings) {
	for (var i = 0, len = buildings.length; i < len; i++) {
		var tile_type = buildings[i][0],
			tile_x = buildings[i][1],
			tile_y = buildings[i][2];

		var texs = BUILDINGS[tile_type],
			tex = nature_sprites[texs[Math.floor(Math.random() * texs.length)]];

		// mountains
		//tile_x -= 3;
		//tile_y += 3;
		// trees
		tile_x -= 1;
		tile_y += 1;

		if (tex === undefined) {
			continue;
		}

		var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
			y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2 - tex.height * scale + TILE_HEIGHT / 2;

		ctx.drawImage(nature_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);

		/*
		x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2;
		y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2;
		ctx.beginPath();
		ctx.fillStyle = '#0ff';
		ctx.moveTo(x,                  y);
		ctx.lineTo(x + TILE_WIDTH / 2, y - TILE_HEIGHT / 2);
		ctx.lineTo(x + TILE_WIDTH,     y);
		ctx.lineTo(x + TILE_WIDTH / 2, y + TILE_HEIGHT / 2);
		ctx.lineTo(x,                  y);
		ctx.fill();
		*/
	}
}
