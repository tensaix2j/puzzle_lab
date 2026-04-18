

import * as THREE from 'three';

export class PuzLevel10 {
    
    setting_active_range = 160;
    fruits = [];
    
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
        this.root   = root;


        let fruit_coords = [
            { x:  -50, y: 24, z: -0.5 },
            { x:  -25,   y:   3, z: -41.6 },
            { x:  24, y: 1, z: 28 },
        ]
        let fruit_names = ["apple","orange","banana"];
        let fruit_sizes = [ 2,1,3];

        for ( let i = 0 ; i < fruit_coords.length; i++ ) {
            let fruit = this.mygame.cloneInstance( this.mygame.models[ fruit_names[i] ].scene );
            fruit.position.set( fruit_coords[i].x , fruit_coords[i].y, fruit_coords[i].z );
            fruit.scale.set( fruit_sizes[i], fruit_sizes[i] , fruit_sizes[i] );
            
            fruit.fruit_id = i;
            root.add( fruit );
            this.fruits.push( fruit );
        }

        let instruction = mygame.create_item_plane( mygame.materials["hiddenfruits"], 14,1,-26.75,  4, 0.5 , 1, 1, 0, 0 )
        instruction.rotation.y = Math.PI;
        root.add( instruction );
        
        
    }

    //---
    fruit_onclick( fruit_id ) {
        let fruit = this.fruits[ fruit_id ];
        if ( fruit ) {
            this.root.remove( fruit );
            fruit.found = 1;
            this.mygame.snds["correct"].play();
            this.check_winning();
        }
    }

    //----
    check_winning() {
        
        for ( let i = 0 ; i < this.fruits.length ; i++ ) {
            let fruit_i = this.fruits[i];
            if ( fruit_i.found != 1 ) {
                return ;
            }
        }
        this.mygame.snds["success"].play();
        this.mygame.snds["applause"].play();
        this.mygame.display_text_effect("All fruits have been found. Level 10 solved. Well Done!", 50);
        this.solved = 1
        this.mygame.completed_level( 10 );
            


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
            if ( clickedObject.fruit_id == null  ) {
                clickedObject = hit.object.parent;
            }
            let fruit_id = clickedObject.fruit_id;

            if ( fruit_id != null ) {
                this.fruit_onclick( fruit_id );
            }
            return null;

        } else {
            return null;
        }
    }
}