attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec4 u_camera;
uniform vec2 u_transform;

varying vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    // Transform pixel coordinates into normalized device coordinates
    vec2 transformed = (a_position - u_camera.xy + u_transform) / u_camera.zw * 2.0 - 1.0;
    gl_Position = vec4(transformed, 0, 1);
}
