import {WbBaseNode} from './wbBaseNode.js';
import {WbWorld} from './wbWorld.js';

class WbFog extends WbBaseNode {
  constructor(id, color, visibilityRange, fogType) {
    super(id);
    this.color = color;
    this.visibilityRange = visibilityRange;
    this.fogType = fogType;
  }

  createWrenObjects() {
    super.createWrenObjects();

    this._applyChangesToWren();
  }

  delete() {
    if (typeof this.parent === 'undefined') {
      const index = WbWorld.instance.sceneTree.indexOf(this);
      WbWorld.instance.sceneTree.splice(index, 1);
    }

    if (this.wrenObjectsCreatedCalled)
      _wr_scene_set_fog(_wr_scene_get_instance(), ENUM.WR_SCENE_FOG_TYPE_NONE, ENUM.WR_SCENE_FOG_DEPTH_TYPE_PLANE, null, 1.0, 0.0, 1.0);

    WbWorld.instance.hasFog = false;

    super.delete();
  }

  preFinalize() {
    super.preFinalize();

    this.updateFogType();
  }

  updateFogType() {
    if (this.fogType === 'EXPONENTIAL')
      this.wrenFogType = ENUM.WR_SCENE_FOG_TYPE_EXPONENTIAL;
    else if (this.fogType === 'EXPONENTIAL2')
      this.wrenFogType = ENUM.WR_SCENE_FOG_TYPE_EXPONENTIAL2;
    else
      this.wrenFogType = ENUM.WR_SCENE_FOG_TYPE_LINEAR;

    if (this.wrenFogType === ENUM.WR_SCENE_FOG_TYPE_LINEAR && this.fogType !== 'LINEAR')
      console.warn("Unknown 'fogType': " + this.fogType + ' Set to "LINEAR"');

    if (this.wrenObjectsCreatedCalled)
      this._applyChangesToWren();
  }

  clone(customID) {
    this.useList.push(customID);
    return new WbFog(customID, this.color, this.visibilityRange, this.fogType);
  }

  // Private functions

  _applyChangesToWren() {
    let density = 0.0;
    if (this.visibilityRange > 0.0)
      density = 1.0 / this.visibilityRange;
    else
      this.wrenFogType = ENUM.WR_SCENE_FOG_TYPE_NONE;

    const colorPointer = _wrjs_array3(this.color.x, this.color.y, this.color.z);
    _wr_scene_set_fog(_wr_scene_get_instance(), this.wrenFogType, ENUM.WR_SCENE_FOG_DEPTH_TYPE_POINT, colorPointer, density, 0.0, this.visibilityRange);
  }
}

export {WbFog};
