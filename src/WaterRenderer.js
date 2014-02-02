function WaterRenderer() {
    this.shader = null;
    this.buffer = null;
    this.texture = null;
    this.log = logger('WaterRenderer');
}

WaterRenderer.prototype.init = function() {
    var vert = loadFile('/data/shaders/water.vert');
    var frag = loadFile('/data/shaders/water.frag');
    var tex = loadTexture('/data/water_p2.png');

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array([
            -1.0, -1.0, 
             1.0, -1.0, 
            -1.0,  1.0, 
            -1.0,  1.0, 
             1.0, -1.0, 
             1.0,  1.0
        ]), 
        gl.STATIC_DRAW
    );

    return Promise.all([vert, frag, tex]).then(function(resp) {
        this.shader = new Shader(resp[0], resp[1]);
        this.shader.initAttributes('a_position');
        this.shader.initUniforms('u_sampler', 'u_camera');
        this.texture = resp[2];
        this.log('ready');
    }.bind(this));
};

WaterRenderer.prototype.render = function() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.useProgram(this.shader.program);    
    gl.uniform1i(this.shader.loc.u_sampler, 0);
    gl.uniform2f(this.shader.loc.u_camera, camera.x, camera.y);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.shader.loc.a_position);
    gl.vertexAttribPointer(this.shader.loc.a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
