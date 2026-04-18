

import * as THREE from 'three';

export class PuzLevel11 {
    
    setting_active_range = 16;
    answer_targets = [];
    answer_found = [];
    
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

        let picA = mygame.create_item_plane( mygame.materials["spotdifference_1024_a"], -3.6, 0, 0.1   ,7,7    ,1,1,0,0 );
        root.add( picA );
        let picB = mygame.create_item_plane( mygame.materials["spotdifference_1024_b"],  3.6, 0, 0.1   ,7,7    ,1,1,0,0 );
        root.add( picB );
        
        this.picB = picB;
        this.root   = root;

        this.init_pieces();

    }

    //----
    picture_onclick( hitPoint ) {

        console.log( hitPoint );
        let found = 0;
        for ( let i = 0 ; i < this.answer_targets.length ; i++ ) {

            let diff_x = this.answer_targets[i].x - hitPoint.x;
            let diff_y = this.answer_targets[i].y - hitPoint.y;
         	let diffsqr =  diff_x * diff_x + diff_y * diff_y;

            if ( diffsqr <= 0.015 * 0.015 ) { 
                found = 1;
				this.answer_found[i] = 1;
                break;
            }
        }
        if ( found == 1 ) {
            this.mygame.snds["correct"].play();
            let count_found = 0;
            for ( let i = 0 ; i < this.answer_found.length ; i++ ) {
                count_found += this.answer_found[i];
            }
            if ( count_found >= this.answer_found.length ) {

                this.mygame.snds["success"].play();
                this.mygame.snds["applause"].play();
                this.mygame.display_text_effect("Well Done!", 50);
                this.solved = 1
                this.mygame.completed_level( 11 );
            
            }
        }
    }

    //----
    init_pieces() {

        this.answer_targets.push( new THREE.Vector2( 0.466, -0.393  ) );
        this.answer_targets.push( new THREE.Vector2( 0.216,  0.424  ) );
        this.answer_targets.push( new THREE.Vector2( -0.110, 0.136  ) );
        this.answer_targets.push( new THREE.Vector2( -0.412 , 0.096  ) );
        this.answer_targets.push( new THREE.Vector2( 0.441 , 0.064  ) );
        this.answer_targets.push( new THREE.Vector2( 0.038 , 0.209  ) );
        this.answer_targets.push( new THREE.Vector2( 0.177 , -0.138  ) );
        this.answer_targets.push( new THREE.Vector2( 0.428 , 0.313  ) );
        this.answer_targets.push( new THREE.Vector2( 0.436 , -0.189  ) );
        this.answer_targets.push( new THREE.Vector2( 0.080 , -0.051  ) );
        
        let i;
        for ( i = 0 ; i < this.answer_targets.length; i++) {
            this.answer_found.push(0);
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
        const intersects = raycaster.intersectObject( this.picB );

        if (intersects.length > 0) {

            if ( this.solved == 1 ) {
                this.mygame.display_text_effect("This game has been completed.", 40);
                return -1;
            }

            let hit = intersects[0];
            const localPoint = hit.object.worldToLocal(hit.point.clone());
            this.picture_onclick( localPoint );

            return 0;

        } else {
            return null;
        }
    }
}