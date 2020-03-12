'use strict';

import DynamicObject from 'lance/serialize/DynamicObject';
import BaseTypes from 'lance/serialize/BaseTypes';

export default class Paddle extends DynamicObject {
	
	static get netScheme() {
        return Object.assign({
            localNum: { type: BaseTypes.TYPES.INT32 }
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        
        if (props && props.playerId){
            this.playerId = props.playerId;
            console.log('create paddle '+this.playerId);
		}
		
		if (props && props.localNum){
			this.localNum = props.localNum;
		}
		
        this.class = Paddle;
    }

    onAddToWorld(gameEngine) {
        if (gameEngine.renderer) {
            gameEngine.renderer.addSprite(this, 'paddle');
        }
    }
    
    onRemoveFromWorld(gameEngine) {
		if(gameEngine.renderer){
			gameEngine.renderer.remSprite(this, 'paddle');
		}
	}
}
