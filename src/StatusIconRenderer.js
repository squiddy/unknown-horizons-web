var icons = (function() {
    var r = [];
    var animations = [
        ['inventory_full', 72],
        ['mainsquare_access', 72], 
        ['mine_gold', 72], 
        ['pestilence', 72],
        ['question_mark', 72],
        ['attention_please', 17],
        ['book_close', 10],
        ['book_flip', 10],
        ['book_open', 10],
        ['decommissioned', 18]
    ];
    for (var x = 0; x < 60; x++) {
        for (var y = 0; y < 60; y++) {
            var a = animations[(x*y)%animations.length];
            r.push({x: x * 70, y: y * 70, 
                    icon: a[0],
                    frame: parseInt(Math.random() * a[1]), maxFrame: a[1]});
        }
    }
    return r;
})();


function StatusIconRenderer() {
    this.shader = null;
    this.buffer = null;
    this.sprite = null;
    this.log = logger('StatusIconRenderer');
}

StatusIconRenderer.prototype.init = function() {
    var vert = loadFile('/data/shaders/status_icons.vert');
    var frag = loadFile('/data/shaders/status_icons.frag');
    this.sprite = new SpriteTexture('/data/gfx/status_icons.png', '/data/gfx/status_icons.min.json');

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, 
        new Float32Array([
             0.0,  0.0, 0.0, 0.0,
            64.0,  0.0, 1.0, 0.0,
             0.0, 64.0, 0.0, 1.0,
             0.0, 64.0, 0.0, 1.0,
            64.0,  0.0, 1.0, 0.0,
            64.0, 64.0, 1.0, 1.0
        ]), 
        gl.STATIC_DRAW
    );

    return Promise.all([vert, frag, this.sprite.load()]).then(function(resp) {
        this.shader = new Shader(resp[0], resp[1]);
        this.shader.initAttributes('a_position', 'a_texCoord');
        this.shader.initUniforms('u_sampler', 'u_camera', 'u_transform', 'u_spriteId');
        this.log('ready');
    }.bind(this));
};

StatusIconRenderer.prototype.render = function() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture);

    gl.useProgram(this.shader.program);    
    gl.uniform1i(this.shader.loc.u_sampler, 0);
    gl.uniform4f(this.shader.loc.u_camera, camera.x, camera.y, camera.width, camera.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.shader.loc.a_position);
    gl.enableVertexAttribArray(this.shader.loc.a_texCoord);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4*4, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4*4, 2*4);

    for (var i=0;i<icons.length;i++) {
        var icon = icons[i];
        var coords = this.spriteId(icon.icon, parseInt(icon.frame));
        icon.frame += 0.7;
        icon.frame = icon.frame % icon.maxFrame;
        gl.uniform2f(this.shader.loc.u_transform, icon.x, icon.y);
        gl.uniform2f(this.shader.loc.u_spriteId, coords.x, coords.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
};

StatusIconRenderer.prototype.spriteId = function(name, frame) {
    var tex = 'as_' + name + '/idle/45/' + pad(frame, 3) + '.png';
    var frame = this.sprite.sheet.frames[tex].frame;

    return {x: frame.x / 64, y: frame.y / 64};
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
