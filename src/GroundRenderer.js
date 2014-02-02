function GroundRenderer() {
    this.shader = null;
    this.buffer = null;
    this.sprite = null;
    this.log = logger('GroundRenderer');
}

GroundRenderer.prototype.load = function() {
    var vert = loadFile('/data/shaders/ground.vert');
    var frag = loadFile('/data/shaders/ground.frag');
    this.sprite = new SpriteTexture('/data/gfx/base.png', '/data/gfx/base.min.json');

    return Promise.all([vert, frag, this.sprite.load()]).then(function(resp) {
        this.shader = new Shader(resp[0], resp[1]);
        this.shader.initAttributes('a_position', 'a_texCoord');
        this.shader.initUniforms('u_camera');

        this.log('ready');
    }.bind(this));
};

GroundRenderer.prototype.render = function(buffer, tileCount) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);

    gl.useProgram(this.shader.program);
    gl.uniform4f(this.shader.loc.u_camera, camera.x, camera.y, camera.width, camera.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(this.shader.loc.a_position);
    gl.enableVertexAttribArray(this.shader.loc.a_texCoord);
    gl.vertexAttribPointer(this.shader.loc.a_position, 2, gl.FLOAT, false, 4*4, 0);
    gl.vertexAttribPointer(this.shader.loc.a_texCoord, 2, gl.FLOAT, false, 4*4, 2*4);

    gl.drawArrays(gl.TRIANGLES, 0, tileCount * 6);
};

GroundRenderer.prototype.buildTile = function(x0, y0, texName) {
    var t = this.sprite.getFrame(texName);

    var x1 = x0 + 64.0, y1 = y0 + 64.0;

    return new Float32Array([
        x0, y0, t.s0, t.t0,
        x1, y0, t.s1, t.t0,
        x0, y1, t.s0, t.t1, 
        x0, y1, t.s0, t.t1, 
        x1, y0, t.s1, t.t0, 
        x1, y1, t.s1, t.t1
    ]);
};
