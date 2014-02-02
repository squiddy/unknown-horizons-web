function Shader(vertSource, fragSource) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertSource);
    gl.compileShader(vertexShader);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragSource);
    gl.compileShader(fragmentShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);    

    this.loc = {};
}

Shader.prototype.initAttributes = function() {
    for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i];
        var loc = gl.getAttribLocation(this.program, name);
        if (loc === -1) {
            throw new Error('Failed to lookup attribute location for ' + name);
        }
        this.loc[name] = loc;
    }
};

Shader.prototype.initUniforms = function() {
    for (var i = 0; i < arguments.length; i++) {
        var name = arguments[i];
        var loc = gl.getUniformLocation(this.program, name);
        if (loc === -1) {
            throw new Error('Failed to lookup uniform location for ' + name);
        }
        this.loc[name] = loc;
    }
};
