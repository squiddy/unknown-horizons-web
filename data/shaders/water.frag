precision highp float;

uniform sampler2D u_sampler;
uniform vec2 u_camera;
      
void main(void) {
    float x = (gl_FragCoord.x + u_camera.x) / 1024.0;
    float y = (gl_FragCoord.y + u_camera.y) / 512.0;
    gl_FragColor = texture2D(u_sampler, vec2(x, y));
}
