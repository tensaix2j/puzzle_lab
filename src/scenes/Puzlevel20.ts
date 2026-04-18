

import * as THREE from 'three';

export class PuzLevel20 {
    
    setting_active_range = 16;
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
        mygame.threejs_scene.add( root );
        this.root   = root;
        
        let board = mygame.cloneInstance( mygame.models["cube"].scene );
        board.scale.set( 4,4, 0.1 );
        root.add( board );
        this.board = board;
        
        let board_face = mygame.create_item_plane( mygame.materials["squarerouteboard"], 0,0, 0.55  ,1,1    ,1,1,0,0 );
        board.item_id = "board";
        board.add( board_face );

        let instruction = mygame.create_item_plane( mygame.materials["squarerouteinstruction"], 2, -1, 0.06,  8, 6 , 1, 1, 0, 0 )
        root.add( instruction );

        this.init_pieces();
        
        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.item_id = 0;
        selector.position.set( this.pieces_arr[ selector.item_id ].position.x, this.pieces_arr[ selector.item_id  ].position.y, 0.1);
        selector.scale.set( 0.35 , 0.35 , 0.1 );
        this.selector = selector;
        this.root.add( selector );

    }


    //---------
    init_pieces() {

        this.answer_arr = [
            18,18,19,22,11,
            2,14,0,8,11,
            0,15,19,13,0,
            17,11,4,4,17,
            21,8,13,6,5
        ];

        let size = 0.35;
        let gap  = 0.05;

        // Number selection panel
        for ( let i = 0 ; i < 26 ; i++ ) {
            
            let x =  ( i % 8 )        * (size + gap) + 2.5;
            let y = (( i / 8 ) >> 0 ) * -(size + gap) - 0.5;
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0.05 );
            button.scale.set( size , size , 0.1 );
            button.item_id = i;
            button.item_val = i;

            let frame_x = i % 8;
            let frame_y = 7 -( (i / 8) >> 0);

            this.root.add( button );
            this.pieces_arr.push( button );
            let button_face = this.mygame.create_item_plane( this.mygame.materials["alphabets"], 0,0, 0.6  ,1,1    ,8,8, frame_y , frame_x );
            button.add( button_face );
        } 
    }


    //---
    check_winning() {
        //16631
        let solved = 1;

        for ( let i = 0 ; i < this.answer_arr.length ; i++ ) {
            let piece = this.board_arr[i];
            if ( piece == null || piece.item_val != this.answer_arr[i] ) {
                solved = 0;
                break;
            } 
        }

        if ( solved == 1 ) {
            
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 20 );
            
        }
    }

    //-------
    board_onclick( hitPoint ) {
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.2 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.2 );
        console.log( tile_x , tile_y );

        if ( tile_x < 0 || tile_x >= 5 || tile_y < 0 || tile_y >= 5 ) {
            this.mygame.snds["denied"].play();
            return ;
        }

            
        if ( this.board_arr[ tile_y * 5 + tile_x ] == null ) {
            // putting number
            if ( this.selector.item_id != null ) {
                
                let item_val = this.pieces_arr[ this.selector.item_id ].item_val;
                
                this.mygame.snds["arrowhit"].play();
                let size = 0.2;
                let x = tile_x * 1/5 - 0.5 + 1/10;
                let y = tile_y * 1/5 - 0.5 + 1/10;
                let frame_x = item_val % 8;
                let frame_y = 7 -( (item_val / 8) >> 0);

                let number_face = this.mygame.create_item_plane( this.mygame.materials["alphabets"], x,y, 0.6  ,size,size    ,8,8, frame_y , frame_x );
                number_face.renderOrder = 1;
                number_face.item_val = item_val;
                this.board.add( number_face );
                this.board_arr[ tile_y * 5 + tile_x ] = number_face;
                this.check_winning();
                
            
                
            } else {
                this.mygame.display_text_effect("Select a number", 40);
                this.mygame.snds["denied"].play();
            }
        } else {
            // removing number
            let number_face = this.board_arr[tile_y * 5 + tile_x ];
            this.board.remove( number_face );
            this.board_arr[tile_y * 5 + tile_x ] = null;
            this.mygame.snds["plop"].play();
        }   
        
    }

    //----
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

            let item_id = hit.object.parent.item_id;
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