#version 330 core

layout(location = 0) in vec3 vCoord;

uniform mat4 modelTransform;

out vec3 fragmentPosition;
// Camera transforms for this frame
layout(std140) uniform CameraTransforms {
  mat4 view;
  mat4 projection;
  mat4 infiniteProjection;
}
cameraTransforms;

void main() {
  mat4 modelView = cameraTransforms.view * modelTransform;

  vec4 vCoordTransformed = modelView * vec4(vCoord, 1.0);
  fragmentPosition = vCoordTransformed.xyz;
  gl_Position = cameraTransforms.projection * cameraTransforms.view * modelTransform * vec4(vCoord, 1.0);
}
