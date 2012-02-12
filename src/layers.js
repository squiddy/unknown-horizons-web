function Layer() {}

Layer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Layer.prototype.highlight_tile = function(x, y, width, height, color) {
	this.ctx.beginPath();
	this.ctx.fillStyle = color;
	this.ctx.moveTo(x,                          y);
	this.ctx.lineTo(x + width * TILE_WIDTH / 2, y - height * TILE_HEIGHT / 2);
	this.ctx.lineTo(x + width * TILE_WIDTH,     y);
	this.ctx.lineTo(x + width * TILE_WIDTH / 2, y + height * TILE_HEIGHT / 2);
	this.ctx.lineTo(x,                          y);
	this.ctx.fill();
}


function StreetLayer(canvas, buildings) {
	this.buildings = buildings;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.clear();
}

StreetLayer.prototype = new Layer();
StreetLayer.prototype.constructor = StreetLayer;

StreetLayer.prototype.render_street = function(building) {
	var info = BUILDINGS[building[0]],
		tile_x = building[1],
		tile_y = building[2];

	var tex_name = info.textures[Math.floor(Math.random() * info.textures.length)];
	var tex = building_sprites[tex_name];

	// why?
	tile_x -= 1;
	tile_y += 1;

	var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
		y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2;

	if (DEBUG) this.highlight_tile(x, y, 1, 1, 'rgba(255, 0, 0, 0.8)');

	y += TILE_HEIGHT / 2;
	y -= tex.height * scale;

	this.ctx.drawImage(building_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
}

StreetLayer.prototype.render = function() {
	for (var i = 0, len = this.buildings.length; i < len; i++) {
		if (this.buildings[i][0] === 15) {
			this.render_street(this.buildings[i]);
		}
	}
}


function WaterLayer(canvas) {
	this.texture = sprites['deep/straight/45'];
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.clear();
}

WaterLayer.prototype = new Layer();
WaterLayer.prototype.constructor = WaterLayer;

WaterLayer.prototype.render = function() {
	for (var i = -1; i < 16; i++) {
		for (var j = -1; j < 16; j++) {
			var x = j * this.texture.width * scale,
				y = i * this.texture.height * scale;

			this.ctx.drawImage(base_texture,
				this.texture.xpos, this.texture.ypos, this.texture.width, this.texture.height,
				x, y, this.texture.width * scale, this.texture.height * scale);

			x += this.texture.width * scale / 2;
			y += this.texture.height * scale / 2;
			this.ctx.drawImage(base_texture,
				this.texture.xpos, this.texture.ypos, this.texture.width, this.texture.height,
				x, y, this.texture.width * scale, this.texture.height * scale);
		}
	}

}


function IslandLayer(canvas, island) {
	this.island = island;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.clear();
}

IslandLayer.prototype = new Layer();
IslandLayer.prototype.constructor = IslandLayer;

IslandLayer.prototype.render = function() {
	for (var i = 0, len = this.island.length; i < len; i++) {
		var tile_x = this.island[i][0],
			tile_y = this.island[i][1],
			tile_type = this.island[i][2];

		var tex = sprites[TILE_TEXTURE[tile_type] + '/' + this.island[i][3] + '/' + this.island[i][4]];

		var x = origin.x + (tile_x + tile_y) * TILE_WIDTH / 2,
			y = origin.y + (tile_y - tile_x) * TILE_HEIGHT / 2 + TILE_HEIGHT / 2;

		this.ctx.drawImage(base_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, TILE_WIDTH, TILE_HEIGHT);
	}
}


function GridLayer(canvas) {
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.clear();
}

GridLayer.prototype = new Layer();
GridLayer.prototype.constructor = GridLayer;

GridLayer.prototype.render = function() {
	this.ctx.strokeStyle = "#000";
	for (var x = 0; x < this.canvas.width; x += TILE_WIDTH) {
		for (var y = 0; y < this.canvas.height * 2; y += TILE_HEIGHT) {
			this.ctx.moveTo(origin.x + x,              origin.y + y);
			this.ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y + y - TILE_HEIGHT);
			this.ctx.moveTo(origin.x + x,              origin.y + y);
			this.ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y + y + TILE_HEIGHT);

			this.ctx.moveTo(origin.x + x,              origin.y - y);
			this.ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y - y - TILE_HEIGHT);
			this.ctx.moveTo(origin.x + x,              origin.y - y);
			this.ctx.lineTo(origin.x + x + TILE_WIDTH, origin.y - y + TILE_HEIGHT);
		}
	}
	this.ctx.stroke();
}


function BuildingLayer(canvas, buildings) {
	this.buildings = buildings;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.clear();
}

BuildingLayer.prototype = new Layer();
BuildingLayer.prototype.constructor = BuildingLayer;

BuildingLayer.prototype.render_building = function(building) {
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

	if (DEBUG) this.highlight_tile(x, y, 1, 1, 'rgba(255, 0, 0, 0.8)');
	if (DEBUG) this.highlight_tile(x, y, info.size_x, info.size_y, 'rgba(255, 255, 0, 0.5)');

	y += info.size_y * TILE_HEIGHT / 2;
	y -= tex.height * scale;

	this.ctx.drawImage(texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
}

BuildingLayer.prototype.render = function() {
	for (var i = 0, len = this.buildings.length; i < len; i++) {
		var tile_type = this.buildings[i][0];

		if (tile_type !== 15) {
			this.render_building(this.buildings[i]);
		}
	}
}
