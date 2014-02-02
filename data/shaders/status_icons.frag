precision highp float;

uniform sampler2D u_sampler;
uniform vec2 u_spriteId;

varying vec2 v_texCoord;
      
void main(void) {
    vec2 tex = (v_texCoord + u_spriteId) / vec2(16.0, 32.0);
    gl_FragColor = texture2D(u_sampler, tex.st);
}
