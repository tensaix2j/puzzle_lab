

import * as THREE from 'three';

export class PuzLevel02 {

    
    setting_active_range = 20;
    pieces_arr = [];
    board_arr = [];

    //----------
    constructor( mygame , x,y,z, y_rot ) {
        
        this.mygame = mygame;
        let dx = Math.sin( y_rot ) * this.setting_active_range/2;
        let dz = Math.cos( y_rot ) * this.setting_active_range/2;
        this.activepoint = new THREE.Vector3(x + dx ,  y - mygame.setting_PH ,  z + dz);
        
        let root = new THREE.Object3D();
        root.position.set( x,y,z );
        root.rotation.y = y_rot;
        this.root   = root;
        mygame.threejs_scene.add( root );

        let board = mygame.cloneInstance( mygame.models["cube"].scene );
        board.scale.set( 7,7, 0.1 );
        root.add( board );
        this.board = board;
        
        let board_face = mygame.create_item_plane( mygame.materials["grackoncurseboard"], 0,0,0.6    ,1,1    ,1,1,0,0 );
        board.item_id = "board";
        board.add( board_face );
        
        
        this.init_pieces();
        
        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.item_id = 0;
        selector.position.set( this.pieces_arr[ selector.item_id ].position.x, this.pieces_arr[ selector.item_id  ].position.y, 0.1);
        selector.scale.set( 0.9 , 0.9 , 0.1 );
        this.selector = selector;
        this.root.add( selector );
        
    }

    //----
    init_pieces() {

        this.placable_arr = [
            0,0,0,0,0,0,
            0,0,0,0,0,0,
            0,0,1,1,0,0,
            0,0,1,1,0,0,
            0,0,0,0,0,0,
            0,0,0,0,0,0,
        ];

        let size    = 1.1;
        let gap     = 0.05 ;
        
        for ( let i = 0 ; i < 10 ; i++ ) {

            let x = ( i % 2 )         *  (size+gap) + 4.5;
            let y = (( i / 2 ) >> 0 ) * -(size+gap) + 2.7;
            let row = (i / 4) >> 0;
            let col =  i % 4;
            
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0 );
            button.scale.set( 0.9 , 0.9 , 0.2 );
            button.item_id = i;
            button.item_val = i;

            this.root.add( button );

            let button_face = this.mygame.create_item_plane( this.mygame.materials["symbols"], 0,0, 0.6  ,0.9,0.9    ,4,4, row ,col );
            button.add( button_face );
            this.pieces_arr.push( button );

        }   

    }

    //---
    check_winning() {

        let solve = 1;
        let indices = [14,15,20,21];
        let answers = [ 9, 0, 8, 0];

        for ( let i = 0 ; i < indices.length; i++ ) {
            let index_to_use = indices[i];
            if ( this.board_arr[index_to_use] && this.board_arr[index_to_use].item_val == answers[i] ) {
                // OK
            } else {
                solve = 0;
                break;
            }
        }

        if ( solve == 1 ) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 2 );
            
        }
    }

    //----
    board_onclick( hitPoint ) {
        //console.log( "board_onclick", hitPoint );
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.16667 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.16667 );
        //console.log( tile_x , tile_y );

        if ( tile_x < 0 || tile_x >= 6 || tile_y < 0 || tile_y >= 6 ) {
            this.mygame.snds["denied"].play();
            return ;
        }

        if ( this.placable_arr[tile_y * 6 + tile_x ] == 1) {
            
            if ( this.board_arr[ tile_y * 6 + tile_x ] == null ) {
                // putting number
                if ( this.selector.item_id != null ) {
                    
                    let item_val = this.pieces_arr[ this.selector.item_id ].item_val;
                    
                    this.mygame.snds["arrowhit"].play();

                    let size = 0.165;
                    let x = tile_x * 1/6 - 0.5 + 1/12;
                    let y = tile_y * 1/6 - 0.5 + 1/12;
                    let frame_y = (item_val / 4) >> 0;
                    let frame_x =  item_val % 4;

                    let number_face = this.mygame.create_item_plane( this.mygame.materials["symbols_r"], x,y, 0.6  ,size,size    ,4,4, frame_y , frame_x );
                    number_face.renderOrder = 1;
                    number_face.item_val = item_val;
                    this.board.add( number_face );
                    this.board_arr[ tile_y * 6 + tile_x ] = number_face;
                    this.check_winning();
                    
                
                    
                } else {
                    this.mygame.display_text_effect("Select a symbol", 40);
                    this.mygame.snds["denied"].play();
                }
            } else {
                // removing number
                let number_face = this.board_arr[tile_y * 6 + tile_x ];
                this.board.remove( number_face );
                this.board_arr[tile_y * 6 + tile_x ] = null;
                this.mygame.snds["plop"].play();
            }   
        }
     
    }

    //---
    item_onclick( item_id ) {
        
        this.mygame.snds["buttonclick"].play();
        this.selector.position.x = this.pieces_arr[item_id].position.x;
        this.selector.position.y = this.pieces_arr[item_id].position.y;
        this.selector.item_id = item_id;
        this.root.add( this.selector );

    }


    //---
    onPointerDown( pointer ) {

        const mouse = new THREE.Vector2(0,0);
        if ( this.mygame.input.mouse.locked == false ) {
            mouse.x =  ( pointer.x / this.mygame.sys.game.scale.width ) * 2 - 1;
            mouse.y = -( pointer.y / this.mygame.sys.game.scale.height ) * 2 + 1;

            //console.log( "pointer", pointer.x, pointer.y , "mouse",mouse.x , mouse.y );
        }
        let raycaster = this.mygame.raycaster;
        raycaster.setFromCamera(mouse, this.mygame.threejs_camera );
        const intersects = raycaster.intersectObjects( this.root.children);

        if (intersects.length > 0) {
             if ( this.solved == 1 ) {
                this.mygame.display_text_effect("This game has been completed.", 40);
                return -1;
            }

            let hit;
            for ( let i = intersects.length - 1 ; i >= 0 ; i-- ) {
                hit = intersects[i];
                if ( hit.object.parent.item_id && hit.object.parent.item_id == "board" ) {
                    break;
                } else if ( hit.object.item_id && hit.object.item_id == "board" ) {
                    break;
                }
            }

            let item_id = hit.object.item_id;
            if ( item_id == null ) {
                item_id = hit.object.parent.item_id;
            }
            if ( item_id == null ) {
                item_id = hit.object.parent.parent.item_id;
            }


            if ( item_id != null ) {
                if ( item_id == "board" ) {
                    const localPoint = hit.object.parent.worldToLocal(hit.point.clone());
                    this.board_onclick( localPoint );
                } else {
                    this.item_onclick( item_id );
                }
            }
            return 0;

        } else {
            return null;
        }
    }
}