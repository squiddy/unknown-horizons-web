export class Camera {
    constructor(canvas) {
        this.canvas = canvas;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.keysPressed = {up: false, down: false, left: false, right: false};

        this.resize();
    }

    mapToScreenCoords(x, y) {
        var sx = (x + y) * 64 / 2,
            sy = (y - x) * 32 / 2;
        return {x: sx, y: sy};
    }

    resize() {
        var width = document.documentElement.clientWidth,
            height = document.documentElement.clientHeight;

        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, width, height);
    }

    keyEvent(event, state) {
        var toggle = (state === 'down');

        // WSAD navigation
        switch (event.which) {
            case 87:
                this.keysPressed.up = toggle;
                break;
            case 83:
                this.keysPressed.down = toggle;
                break;
            case 65:
                this.keysPressed.left = toggle;
                break;
            case 68:
                this.keysPressed.right = toggle;
                break;
            default:
        }
    }

    update(dt) {
        var step = parseInt(800 * dt);

        if (this.keysPressed.up) this.y += step;
        if (this.keysPressed.down) this.y -= step;
        if (this.keysPressed.right) this.x += step;
        if (this.keysPressed.left) this.x -= step;
    }
}
