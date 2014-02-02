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
    
    var sprite = new SpriteTexture('/data/gfx/terrain.png', '/data/gfx/terrain.json');
    fixedRenderer = new FixedAnimationRenderer(sprite);
    fixedRenderer.addObject({x: 20, y:140, width: 320, height: 320, frame: 'mountains/as_mine5x5/work/45/0.png'});
    fixedRenderer.addObject({x: 140, y:40, width: 100, height: 100, frame: 'resources/as_fish0/idle/315/000.png'});
    fixedRenderer.addObject({x: 260, y:40, width: 100, height: 100, frame: 'trees/as_birch0/idle_full/135/0.png'});

    mapRenderer = new MapRenderer();
    statusIconRenderer = new StatusIconRenderer();

    console.time('Main init');
    var init = [waterRenderer.init(), statusIconRenderer.init(), fixedRenderer.init(),
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
    fixedRenderer.render();

    $('#frame-time').text((window.performance.now() - curFrame).toFixed(3) + 'ms');
    $('#pos').text('X: ' + camera.x + ' Y: ' + camera.y);
}

function handleError(e) {
    console.log('error', e.message, e.fileName, e.lineNumber);
}
