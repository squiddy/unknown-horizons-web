function initGL(canvas) {
    var gl = null;

    try {
        gl = canvas.getContext("webgl", {alpha: false}) ||
             canvas.getContext("experimental-webgl", {alpha: false});
    }
    catch(e) {}
  
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
  
    return gl;
}

function logger(name) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(name + ':');
        return console.log(args.join(' '));
    }
}

function loadFile(url) {
    return Promise.cast($.get(url));
}
