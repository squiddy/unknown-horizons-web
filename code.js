var ctx,
	textures = {},
	scale = 0.4;


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

	var canvas = document.getElementById('canvas');
	canvas.width = document.width;
	canvas.height = document.height;

	ctx = canvas.getContext('2d');
	ctx.fillStyle = "rgba(8,8,12,.65)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	load_assets();
}

function load_assets() {
	var assets = {
		grass: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_grass0/straight/45/0.png",
		water: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_deep0/straight/45/0.png",
		shallow: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_shallow0/straight/45/0.png",
		beach: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_beach0/straight/45/0.png",
		coast: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_beach-shallow0/straight/45/0.png",
		shallow_deep: "https://github.com/unknown-horizons/unknown-horizons/raw/master/content/gfx/base/moderate/ts_shallow-deep0/straight/45/0.png"
	}, asset_count = 6;

	var loaded = 0;
	function ready() {
		loaded++;
		if (loaded === asset_count) {
			draw();
		}
	}

	for (var name in assets) {
		img = new Image();
		img.src = assets[name];
		img.onload = ready;
		textures[name] = img;
	}
}

function draw() {
	draw_water();
	draw_island();

	requestAnimationFrame(draw);
}

function draw_water() {
	var water = textures.water;

	for (var i = -1; i < 8; i++) {
		for (var j = -1; j < 8; j++) {
			var x = j * water.width * scale,
				y = i * water.height * scale;
			ctx.drawImage(water, x, y, water.width * scale, water.height * scale);
			x += water.width * scale / 2;
			y += water.height * scale / 2;
			ctx.drawImage(water, x, y, water.width * scale, water.height * scale);
		}
	}
}

function draw_island() {
	var origin = {x: 50, y: document.height / 2},
		texture_types = {
			1: textures.shallow,
			2: textures.shallow_deep,
			3: textures.grass,
			4: textures.beach,
			5: textures.coast,
			6: textures.beach
		};

	for (var i = 0, len = map.length; i < len; i++) {
		var tile_x = map[i][0],
			tile_y = map[i][1],
			tile_type = map[i][2],
			tex = texture_types[tile_type];

		if (tex !== undefined) {
			var x = origin.x + (tile_x + tile_y) * tex.width / 2 * scale,
				y = origin.y + (tile_y - tile_x) * tex.height / 2 * scale;

			ctx.drawImage(tex, x, y, tex.width * scale, tex.height * scale);
		} else {
			console.log(tile_type);
		}
	}
}
