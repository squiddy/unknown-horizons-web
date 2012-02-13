function Minimap(canvas, map) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.map = map;
	this.clear();
}

Minimap.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Minimap.prototype.render_island = function(island) {
	var offset = 10,
		tw = (this.canvas.width - 2 * offset) / this.map.bbox.width,
		th = (this.canvas.height - 2 * offset) / this.map.bbox.height;

	this.ctx.fillStyle = 'rgb(124, 115, 100)';

	for (var i = 0, len = island.grounds.length; i < len; i++) {
		var tile_x = island.grounds[i][0] + island.x,
			tile_y = island.grounds[i][1] + island.y,
			tile_type = island.grounds[i][2];

		this.ctx.fillRect(tile_x * tw + offset, tile_y * th + offset, tw, th);
	}
}

Minimap.prototype.render = function() {
	for (var i = 0, len = this.map.islands.length; i < len; i++) {
		this.render_island(this.map.islands[i]);
	}
}
