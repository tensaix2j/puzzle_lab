

import * as THREE from 'three';

export class PuzLevel05 {

    setting_active_range = 16;

    //----------
    constructor( mygame , x,y,z, y_rot ) {
        
        this.mygame = mygame;
        let dx = Math.sin( y_rot ) * this.setting_active_range/2;
        let dz = Math.cos( y_rot ) * this.setting_active_range/2;
        this.activepoint = new THREE.Vector3(x + dx ,  y - mygame.setting_PH ,  z + dz);
        
        let root = new THREE.Object3D();
        root.position.set( x,y,z );
        root.rotation.y = y_rot;
        mygame.threejs_scene.add( root );

        let board = mygame.create_item_plane( mygame.materials["crypticminute"], 0,0,0, 7,7, 1, 1, 0, 0 )
        root.add( board );
        
        let solvebutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        solvebutton.position.set( 0, -1.75, 0.1);
        solvebutton.scale.set( 3, 1, 0.2);
        let solvebutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"],  -0.05, 0, 0.6  , 0.6, 0.8    ,8,4,3,0 );
        solvebutton.add( solvebutton_face );
        solvebutton.children[0].children[0].material = mygame.materials["blue"];
        solvebutton.button_id = "solve";
        
        root.add( solvebutton );

        
        this.root   = root;
    }


    //----
    button_onclick() {
        this.mygame.osk.target = this;
        this.mygame.osk.setVisible(1);
        this.mygame.osk.txtField.setText("");
        this.mygame.game_state = 1;
        this.mygame.input.mouse.releasePointerLock();
    }

    //-------
    onTextInput( msg ) {
        
        if ( msg.toLowerCase() == "excess" ) {
        
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.mygame.display_text_effect("Well Done!", 50);
            this.solved = 1
            this.mygame.completed_level( 5 );
            
        } else {
            this.mygame.snds["denied"].play();
            this.mygame.display_text_effect("Wrong Answer", 50);
        }

    }

    //---
    onPointerDown( pointer ) {

        const mouse = new THREE.Vector2(0,0);
        if ( this.mygame.input.mouse.locked == false ) {
            mouse.x =  ( pointer.x / this.mygame.sys.game.scale.width ) * 2 - 1;
            mouse.y = -( pointer.y / this.mygame.sys.game.scale.height ) * 2 + 1;
        }
        
        let raycaster = this.mygame.raycaster;
        raycaster.setFromCamera(mouse, this.mygame.threejs_camera );
        const intersects = raycaster.intersectObjects( this.root.children);

        if (intersects.length > 0) {

            if ( this.solved == 1 ) {
                this.mygame.display_text_effect("This game has been completed.", 40);
                return -1;
            }

            let hit = intersects[0];
            let clickedObject = hit.object.parent.parent;
            if ( clickedObject.item_id == null && clickedObject.button_id == null ) {
                clickedObject = hit.object.parent;
            }
            let item_id = clickedObject.item_id;
            let button_id = clickedObject.button_id;
            if ( button_id != null ) {
                this.button_onclick();
            }
            return null;

        } else {
            return null;
        }
    }
}