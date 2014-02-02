function FixedAnimationRenderer(sprite) {
    this.objects = [];
    this.shader = null;
    this.geometryBuffer = gl.createBuffer();
    this.dataBuffer = gl.createBuffer();
    this.sprite = sprite;
}

// Setup sprite sheet and shader
FixedAnimationRenderer.prototype.init = function() {
    var vert = loadFile('/data/shaders/fixed.vert');
    var frag = loadFile('/data/shaders/fixed.frag');

    return Promise.all([vert, frag, this.sprite.load()]).then(function(resp) {
        this.shader = new Shader(resp[0], resp[1]);
        this.shader.initAttributes('a_position', 'a_texCoord', 'a_sprite');
        this.shader.initUniforms('u_camera', 'u_sampler', 'u_texSize');

        gl.useProgram(this.shader.program);
        gl.uniform2f(this.shader.loc.u_texSize, this.sprite.width, this.sprite.height);
        gl.useProgram(null);

        this.updateGeometry();
        this.updateTextures();
    }.bind(this));
};

// Update geometry buffer when objects are added/removed
FixedAnimationRenderer.prototype.updateGeometry = function() {
    console.time('FixedAnimationRenderer updateGeometry');

    // TODO don't recreate whole buffer on every change, reuse
    // TODO empty locations (need indexed drawing)
    var data = new Float32Array(24 * this.objects.length);
    for (var i = 0; i < this.objects.length; i++) {
        var obj = this.objects[i];
        data.set(createQuad(obj.x, obj.y, obj.width, obj.height), i*24);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.geometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    console.timeEnd('FixedAnimationRenderer updateGeometry');
};

// Update texture buffer when objects are added/removed and/or animation
// frames change
FixedAnimationRenderer.prototype.updateTextures = function() {
    console.time('FixedAnimationRenderer updateTextures');

    var w = this.sprite.sheet.meta.size.w;
    var h = this.sprite.sheet.meta.size.h;

    // TODO don't recreate whole buffer on every change, reuse
    // TODO empty locations (need indexed drawing)
    var data = new Float32Array(24 * this.objects.length);
    for (var i = 0; i < this.objects.length; i++) {
        var frame = this.sprite.getFrame2(this.objects[i].frame);
        var texData = [
            frame.x, frame.y, frame.w, frame.h,
            frame.x, frame.y, frame.w, frame.h,
            frame.x, frame.y, frame.w, frame.h,
            frame.x, frame.y, frame.w, frame.h,
            frame.x, frame.y, frame.w, frame.h,
            frame.x, frame.y, frame.w, frame.h
        ];
        data.set(texData, i*24);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);

    console.timeEnd('FixedAnimationRenderer updateTextures');
};

FixedAnimationRenderer.prototype.addObject = function(obj) {
    this.objects.push(obj);
    if (this.sheet) {
        this.updateGeometry();
        this.updateTextures();
    }
};

FixedAnimationRenderer.prototype.render = function() {
    if (this.objects.length === 0) return;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);

    gl.useProgram(this.shader.program);
    gl.uniform1i(this.shader.loc.u_sampler, 0);
    gl.uniform4f(this.shader.loc.u_camera, camera.x, camera.y, camera.width, camera.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.geometryBuffer);
    gl.enableVertexAttribArray(this.shader.loc.a_position);
    gl.enableVertexAttribArray(this.shader.loc.a_texCoord);
    gl.vertexAttribPointer(this.shader.loc.a_position, 2, gl.FLOAT, false, 4*4, 0);
    gl.vertexAttribPointer(this.shader.loc.a_texCoord, 2, gl.FLOAT, false, 4*4, 2*4);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
    gl.enableVertexAttribArray(this.shader.loc.a_sprite);
    gl.vertexAttribPointer(this.shader.loc.a_sprite, 4, gl.FLOAT, false, 4*4, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.objects.length * 6);
};

function createQuad(x, y, width, height) {
    return [
        x,       y,        0.0, 1.0,
        x+width, y,        1.0, 1.0,
        x,       y+height, 0.0, 0.0,
        x,       y+height, 0.0, 0.0,
        x+width, y,        1.0, 1.0,
        x+width, y+height, 1.0, 0.0
    ];
}
