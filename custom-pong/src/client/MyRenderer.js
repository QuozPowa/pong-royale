'use strict';

import Renderer from 'lance/render/Renderer';

export default class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
    }

    draw(t, dt) {
        super.draw(t, dt);

        for (let objId of Object.keys(this.sprites)) {
            if (this.sprites[objId].el) {
                this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].position.y + 'px';
                this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].position.x + 'px';
            }
        }
    }

    addSprite(obj, objName) {
        if (objName === 'paddle') objName += obj.localNum;
        this.sprites[obj.id] = {
            el: document.querySelector('.' + objName)
        };
    }
    
    remSprite(obj, objName) {
        if (objName === 'paddle') objName += obj.localNum;
        delete this.sprites[obj.id];
    }

}
