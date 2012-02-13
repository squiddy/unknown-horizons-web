function TextureManager() {
	this.to_load = [];
	this.texture_data = [];
}

TextureManager.prototype.add = function(url, info) {
	this.to_load.push(url);
	this.texture_data.push({image: undefined, info: info});
}

TextureManager.prototype.load = function(ready_cb) {
	var loaded = 0,
		texture_count = this.to_load.length;

	function ready() {
		loaded++;
		if (loaded = texture_count) {
			ready_cb();
		}
	}

	for (var i = 0, len = this.to_load.length; i < len; i++) {
		texture = new Image();
		texture.src = this.to_load[i];
		texture.onload = ready;

		this.texture_data[i].image = texture;
	}
}

TextureManager.prototype.get = function(name) {
	for (var i = 0, len = this.texture_data.length; i < len; i++) {
		var image = this.texture_data[i].image,
			info = this.texture_data[i].info;

		var tex = info[name];
		if (tex !== undefined) {
			return {
				image: image,
				info: tex
			}
		}
	}

	return null;
}
