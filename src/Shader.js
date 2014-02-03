export class Shader {
    constructor(vertSource, fragSource) {
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

    initAttributes(...names) {
        for (var name of names) {
            var loc = gl.getAttribLocation(this.program, name);
            if (loc === -1) {
                throw new Error('Failed to lookup attribute location for ' + name);
            }
            this.loc[name] = loc;
        }
    };

    initUniforms(...names) {
        for (var name of names) {
            var loc = gl.getUniformLocation(this.program, name);
            if (loc === -1) {
                throw new Error('Failed to lookup uniform location for ' + name);
            }
            this.loc[name] = loc;
        }
    }
}
