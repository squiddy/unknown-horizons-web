function Minimap(map_canvas, view_canvas, map) {
	this.map_canvas = map_canvas;
	this.view_canvas = view_canvas;

	this.map_ctx = map_canvas.getContext('2d');
	this.view_ctx = view_canvas.getContext('2d');
	this.map = map;
	this.clear();

	this.offset = 10;
	this.tw = (this.map_canvas.width - 2 * this.offset) / this.map.bbox.width;
	this.th = (this.map_canvas.height - 2 * this.offset) / this.map.bbox.height;

	this.coords = [];
	this.view_changed = false;
	var self = this;
	document.addEventListener('scroll', function() {
		self.coords = Grid.ScreenToMapCoordinates(window.pageXOffset, window.pageYOffset);
		self.view_changed = true;
	});
}

Minimap.prototype.clear = function() {
	this.map_ctx.clearRect(0, 0, this.map_canvas.width, this.map_canvas.height);
	this.view_ctx.clearRect(0, 0, this.view_canvas.width, this.view_canvas.height);
	this.view_ctx.fillRect(0, 0, this.view_canvas.width, this.view_canvas.height);
}

Minimap.prototype.render_island = function(island) {
	this.map_ctx.fillStyle = 'rgb(124, 115, 100)';

	for (var i = 0, len = island.grounds.length; i < len; i++) {
		var tile_x = island.grounds[i][0] + island.x,
			tile_y = island.grounds[i][1] + island.y,
			tile_type = island.grounds[i][2];

		this.map_ctx.fillRect(tile_x * this.tw + this.offset, tile_y * this.th + this.offset, this.tw, this.th);
	}
}

Minimap.prototype.update_view = function() {
	var width = window.innerWidth / (TILE_WIDTH * this.map.bbox.width) * this.view_canvas.width,
		height = window.innerHeight / (TILE_HEIGHT * this.map.bbox.height) * this.view_canvas.height;

	this.view_ctx.clearRect(0, 0, this.view_canvas.width, this.view_canvas.height);

	this.view_ctx.strokeStyle = '#000';
	this.view_ctx.strokeRect(Math.floor(this.coords[0] * this.tw + this.offset),
							 Math.floor(this.coords[1] * this.th + this.offset),
							 Math.floor(width), Math.floor(height));
}

Minimap.prototype.render_once = function() {
	for (var i = 0, len = this.map.islands.length; i < len; i++) {
		this.render_island(this.map.islands[i]);
	}
}

Minimap.prototype.render = function() {
	if (this.view_changed === true) {
		this.update_view();
		this.view_changed = false;
	}
}
