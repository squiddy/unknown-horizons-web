precision highp float;

uniform sampler2D uSampler;
uniform vec2 uCamera;

varying vec2 v_texCoord;

void main(void) {
    gl_FragColor = texture2D(uSampler, v_texCoord.st);
}
