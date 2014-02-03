import { logger, loadFile } from 'src/Utils';

var texLogger = logger('Texture');

export class SpriteTexture {
    constructor(imageUrl, sheetUrl) {
        this.imageUrl = imageUrl;
        this.sheetUrl = sheetUrl;
        this.sheet = null;
        this.texture = null;
    }

    load() {
        var sheet = loadFile(this.sheetUrl);
        var texture = loadTexture(this.imageUrl);

        return Promise.all([sheet, texture]).then(function(res) {
            this.sheet = res[0];
            this.texture = res[1];
            texLogger('Loaded ' + this.sheetUrl);
        }.bind(this));
    }

    getFrame(name) {
        var width = this.sheet.meta.size.w,
            height = this.sheet.meta.size.h;

        if (this.sheet.frames[name] === undefined) {
            throw new Error(name + ' not found in ' + this.sheetUrl);
        }
        
        var frame = this.sheet.frames[name].frame;

        return {
            s0: frame.x / width,
            t0: frame.y / height,
            s1: (frame.x + frame.w) / width,
            t1: (frame.y + frame.h) / height,
        };
    }
}

function loadImage(path) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.onload = function() {
            texLogger('Loaded image ' + path);
            resolve(image);
        };
        image.src = path;
    });
}

export function loadTexture(path) {
    return loadImage(path).then(function(image) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        texLogger('Loaded texture ' + path);
        return texture;
    });
}
