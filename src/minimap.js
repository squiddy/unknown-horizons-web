function Minimap(canvas, map) {
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');
	this.map = map;
	this.clear();
}

Minimap.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Minimap.prototype.render = function() {
	var island = this.map.islands[0],
		offset = 10,
		tw = (this.canvas.width - 2 * offset) / island.bbox.width,
		th = (this.canvas.height - 2 * offset) / island.bbox.height;

	this.ctx.fillStyle = 'rgb(124, 115, 100)';

	for (var i = 0, len = island.grounds.length; i < len; i++) {
		var tile_x = island.grounds[i][0],
			tile_y = island.grounds[i][1],
			tile_type = island.grounds[i][2];

		this.ctx.fillRect(tile_x * tw + offset, tile_y * th + offset, tw, th);
	}
}
