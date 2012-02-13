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
	var island = this.map.islands[0]['grounds'],
		bbox = street_layer.island_bbox,
		offset = 10,
		tw = (this.canvas.width - 2 * offset) / bbox.width,
		th = (this.canvas.height - 2 * offset) / bbox.height;

	this.ctx.fillStyle = 'rgb(124, 115, 100)';

	for (var i = 0, len = island.length; i < len; i++) {
		var tile_x = island[i][0],
			tile_y = island[i][1],
			tile_type = island[i][2];

		this.ctx.fillRect(tile_x * tw + offset, tile_y * th + offset, tw, th);
	}
}
