export function initGL(canvas) {
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

export function logger(name) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(name + ':');
        return console.log(args.join(' '));
    }
}

export function loadFile(url) {
    return Promise.cast($.get(url));
}

export function padZero(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
