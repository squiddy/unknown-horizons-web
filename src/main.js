var gl, mapRenderer, waterRenderer, camera, statusIconRenderer;

function resize(event) {
    camera.resize(event);
}

function keyDown(event) {
    camera.keyEvent(event, 'down');
}

function keyUp(event) {
    camera.keyEvent(event, 'up');
}

function main() {
    var canvas = document.getElementById('canvas');
    gl = initGL(canvas);

    camera = new Camera(canvas);
    waterRenderer = new WaterRenderer();
    mapRenderer = new MapRenderer();
    statusIconRenderer = new StatusIconRenderer();

    console.time('Main init');
    var init = [waterRenderer.init(), statusIconRenderer.init(),
                mapRenderer.load('/data/example_map.min.json')];
    Promise.all(init).then(function(res) {
        window.addEventListener('resize', resize);
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        console.timeEnd('Main init');
        console.log('Start rendering');
        requestAnimationFrame(animate);
    }, handleError);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

var lastFrame = window.performance.now();

function animate() {
    requestAnimationFrame(animate);

    var curFrame = window.performance.now();
    var dt = curFrame - lastFrame;
    lastFrame = curFrame;

    camera.update(dt / 1000);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    waterRenderer.render();
    mapRenderer.render();
    statusIconRenderer.render();

    $('#frame-time').text((window.performance.now() - curFrame).toFixed(3) + 'ms');
    $('#pos').text('X: ' + camera.x + ' Y: ' + camera.y);
}

function handleError(e) {
    console.log('error', r.message, r.fileName, r.lineNumber);
}
