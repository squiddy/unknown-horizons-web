var background_ctx,
	foreground_ctx,
	scale = 0.4,
	texture,
	tile_texture = {
		1: 'beach-shallow',
		2: 'shallow-deep',
		3: 'grass',
		4: 'grass-beach',
		5: 'beach-shallow',
		6: 'beach'
	};



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

	load_assets();
}

function load_assets() {
	texture = new Image();
	texture.src = 'res/base.png'
	texture.onload = pre_draw;
}

function pre_draw() {
	// draw once
	draw_water(background_ctx);
	draw_island(background_ctx);

	draw();
}

function draw() {
	webkitRequestAnimationFrame(draw);
}

function draw_water(ctx) {
	var tex = sprites['deep/straight/45'];

	for (var i = -1; i < 8; i++) {
		for (var j = -1; j < 8; j++) {
			var x = j * tex.width * scale,
				y = i * tex.height * scale;
			ctx.drawImage(texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
			x += tex.width * scale / 2;
			y += tex.height * scale / 2;
			ctx.drawImage(texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
		}
	}
}

function draw_island(ctx) {
	var origin = {x: 50, y: document.height / 2};

	for (var i = 0, len = map.length; i < len; i++) {
		var tile_x = map[i][0],
			tile_y = map[i][1],
			tile_type = map[i][2];

		var tex = sprites[tile_texture[tile_type] + '/' + map[i][3] + '/' + map[i][4]];

		var x = origin.x + (tile_x + tile_y) * tex.width / 2 * scale,
			y = origin.y + (tile_y - tile_x) * tex.height / 2 * scale;

		ctx.drawImage(texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
	}
}
