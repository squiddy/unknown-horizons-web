attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute vec4 a_sprite;

uniform vec4 u_camera;
uniform vec2 u_texSize;

varying vec2 v_texCoord;

void main() {
    v_texCoord = (a_texCoord * a_sprite.zw + a_sprite.xy) / u_texSize;
    // Transform pixel coordinates into normalized device coordinates
    vec2 transformed = (a_position - u_camera.xy) / u_camera.zw * 2.0 - 1.0;
    gl_Position = vec4(transformed, 0, 1);
}
