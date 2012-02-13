function Layer() {}

Layer.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Layer.prototype.highlight_tile = function(x, y, width, height, color) {
	var coords = Grid.MapToScreenCoordinates(x, y);
	
	x = coords[0];
	y = coords[1];

	this.ctx.beginPath();
	this.ctx.fillStyle = color;
	this.ctx.moveTo(x,                          y);
	this.ctx.lineTo(x + width * TILE_WIDTH / 2, y - height * TILE_HEIGHT / 2);
	this.ctx.lineTo(x + width * TILE_WIDTH,     y);
	this.ctx.lineTo(x + width * TILE_WIDTH / 2, y + height * TILE_HEIGHT / 2);
	this.ctx.lineTo(x,                          y);
	this.ctx.fill();
}


function StreetLayer(canvas, buildings, island) {
	this.buildings = buildings;
	this.island = island;
	this.island_bbox = {width: 0, height: 0};
	this.roadmap = undefined;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');

	this.clear();
	this.calculate_roads();
}

StreetLayer.prototype = new Layer();
StreetLayer.prototype.constructor = StreetLayer;

StreetLayer.prototype.calculate_roads = function() {
	// get island bounding box
	var xmin = 0, ymin = 0, xmax = 0, ymax = 0;

	for (var i = 0, len = this.island.length; i < len; i++) {
		var tile_x = this.island[i][0],
			tile_y = this.island[i][1];

		xmin = Math.min(xmin, tile_x); ymin = Math.min(ymin, tile_y);
		xmax = Math.max(xmax, tile_x); ymax = Math.max(ymax, tile_y);
	}

	this.island_bbox.width = xmax - xmin;
	this.island_bbox.height = ymax - ymin;

	// fill roadmap
	this.roadmap = new Uint8Array(new ArrayBuffer(this.island_bbox.width * this.island_bbox.height));

	for (var i = 0, len = this.buildings.length; i < len; i++) {
		if (this.buildings[i][0] === 15) {
			var tile_x = this.buildings[i][1],
				tile_y = this.buildings[i][2];

			this.roadmap[tile_y * this.island_bbox.width + tile_x] = 1;
		}
	}
}

StreetLayer.prototype.render_street = function(tile_x, tile_y, type) {
	var tex = building_sprites['sailors/streets/as_trail/' + type + '/45'];

	// why?
	tile_x -= 1;
	tile_y += 1;

	var coords = Grid.MapToScreenCoordinates(tile_x, tile_y),
		x = coords[0], y = coords[1];

	y += TILE_HEIGHT / 2;
	y -= tex.height * scale;

	this.ctx.drawImage(building_texture, tex.xpos, tex.ypos, tex.width, tex.height, x, y, tex.width * scale, tex.height * scale);
}

StreetLayer.prototype.check_street = function(x, y) {
	return this.roadmap[y * this.island_bbox.width + x] == 1;
}

StreetLayer.prototype.render = function() {
	for (var i = 0, len = this.roadmap.length; i < len; i++) {
		if (this.roadmap[i] === 1) {
			var y = Math.floor(i / this.island_bbox.width),
				x = i % this.island_bbox.width;

			var a = this.check_street(x, y - 1) ? 'a' : '',
				b = this.check_street(x + 1, y) ? 'b' : '',
				c = this.check_street(x, y + 1) ? 'c' : '',
				d = this.check_street(x - 1, y) ? 'd' : '',
				type = [a, b, c, d].join('');

			if (type !== '') {
				this.render_street(x, y, type);
			}
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

		var coords = Grid.MapToScreenCoordinates(tile_x, tile_y),
			x = coords[0], y = coords[1] + TILE_HEIGHT / 2;

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

	if (DEBUG) this.highlight_tile(tile_x, tile_y, 1, 1, 'rgba(255, 0, 0, 0.8)');
	if (DEBUG) this.highlight_tile(tile_x, tile_y, info.size_x, info.size_y, 'rgba(255, 255, 0, 0.5)');

	var coords = Grid.MapToScreenCoordinates(tile_x, tile_y),
		x = coords[0], y = coords[1];

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
