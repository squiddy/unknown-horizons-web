var TILE_TEXTURE = {
	1: 'beach-shallow',
	2: 'shallow-deep',
	3: 'grass',
	4: 'grass-beach',
	5: 'beach-shallow',
	6: 'beach'
};

function MapRenderer() {
    this.map = null;
    this.buffer = null;
    this.tileCount = null;
    this.groundRenderer = new GroundRenderer();
}

MapRenderer.prototype.load = function(map_data) {
    return Promise.all([this.groundRenderer.load(), loadFile(map_data)]).then(function(res) {
        console.time('Load map');
        var map_data = res[1];

        this.buffer = gl.createBuffer();
        var grounds = map_data.islands[0].grounds;

        var data = new Float32Array(grounds.length * 6 * 4);
        var idx = 0;
        for (var i = 0; i < grounds.length; i++) {
            var g = grounds[i];
            var c = camera.mapToScreenCoords(g[0], g[1]);
            var tex = 'ts_' + TILE_TEXTURE[g[2]] + '0/' + g[3] + '/' + g[4] + '/0.png';
            var subData = this.groundRenderer.buildTile(c.x, c.y, tex);
            data.set(subData, idx);
            idx += subData.length;
        }

        this.tileCount = grounds.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        console.timeEnd('Load map');
    }.bind(this));
};

MapRenderer.prototype.render = function() {
    this.groundRenderer.render(this.buffer, this.tileCount);
};
