function Island(map, x, y, grounds) {
	this.map = map;
	this.x = x;
	this.y = y;
	this.grounds = grounds;
	this.bbox = {width: 0, height: 0};
	this.calculate_bounding_box()
}

Island.prototype.calculate_bounding_box = function() {
	var xmin = 0, ymin = 0, xmax = 0, ymax = 0;

	for (var i = 0, len = this.grounds.length; i < len; i++) {
		var tile_x = this.grounds[i][0],
			tile_y = this.grounds[i][1];

		xmin = Math.min(xmin, tile_x); ymin = Math.min(ymin, tile_y);
		xmax = Math.max(xmax, tile_x); ymax = Math.max(ymax, tile_y);
	}

	this.bbox.width = xmax - xmin;
	this.bbox.height = ymax - ymin;
}

function Map(data) {
	this.data = data;
	this.islands = [];
	this.bbox = {width: 0, height: 0};
	this.roadmap = null;
	this.STREET_TYPE = 15;

	this.load();
	this.calculate_bounding_box();
	this.calculate_roadmap()
}

Map.prototype.load = function() {
	// buildings
	this.buildings = this.data.buildings;

	// load islands
	for (var i = 0, len = this.data.islands.length; i < len; i++) {
		var data = this.data.islands[i];

		this.islands.push(new Island(this, data.x, data.y, data.grounds));
	}
}

Map.prototype.calculate_bounding_box = function() {
	var xmin = 0, ymin = 0, xmax = 0, ymax = 0;

	for (var i = 0, len = this.islands.length; i < len; i++) {
		var island = this.islands[i];

		xmin = Math.min(xmin, island.x); ymin = Math.min(ymin, island.y);
		xmax = Math.max(xmax, island.x + island.bbox.height); ymax = Math.max(ymax, island.y + island.bbox.height);
	}

	this.bbox.width = xmax - xmin;
	this.bbox.height = ymax - ymin;
}

Map.prototype.calculate_roadmap = function() {
	this.roadmap = new Uint8Array(new ArrayBuffer(this.bbox.width * this.bbox.height));

	for (var i = 0, len = this.buildings.length; i < len; i++) {
		if (this.buildings[i][0] === this.STREET_TYPE) {
			var tile_x = this.buildings[i][1],
				tile_y = this.buildings[i][2];

			this.roadmap[tile_y * this.bbox.width + tile_x] = 1;
		}
	}
}

Map.prototype.check_street = function(x, y) {
	return this.roadmap[y * this.bbox.width + x] == 1;
}
