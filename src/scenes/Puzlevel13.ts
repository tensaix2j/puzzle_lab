

import * as THREE from 'three';

export class PuzLevel13 {
    
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

        let board = mygame.cloneInstance( mygame.models["cube"].scene );
        board.scale.set( 3.75, 6, 0.1 );
        root.add( board );

        let board_face = mygame.create_item_plane( mygame.materials["tangramboard"], 0,0, 0.6    ,1,1    ,1,1,0,0 );
        board_face.item_id = "board";
        board.add( board_face );

        this.root   = root; 
        this.init_pieces();
        
        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.item_id = 0;
        selector.position.set( this.pieces_arr[ selector.item_id ].position.x, this.pieces_arr[ selector.item_id  ].position.y, 0.1);
        selector.scale.set( 0.9 , 0.9 , 0.2 );
        this.selector = selector;
        this.root.add( selector );
        
        this.board = board;

        
    }

    //-----------
    getAffectedTiles( piece_id, tile_x, tile_y ) {

        let ret = [];
        ret.push( [tile_x, tile_y] );

        if ( piece_id == 0  ){
            ret.push( [tile_x - 1, tile_y + 0] );
            ret.push( [tile_x - 1, tile_y + 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y - 1] );

        } else if ( piece_id == 1  ){
            ret.push( [tile_x + 0, tile_y + 1] );
            ret.push( [tile_x + 0, tile_y - 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 1] );
        

        } else if ( piece_id == 2  ){
            ret.push( [tile_x + 0, tile_y + 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 1] );
            
        } else if ( piece_id == 3  ){
            ret.push( [tile_x - 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 1] );
            
        } else if ( piece_id == 4  ){
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 1] );
            
        } else if ( piece_id == 5  ){
            ret.push( [tile_x - 1, tile_y + 0] );
            ret.push( [tile_x - 1, tile_y - 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            
        } else if ( piece_id == 6  ){
            ret.push( [tile_x - 1, tile_y + 0] );
            ret.push( [tile_x - 1, tile_y - 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            ret.push( [tile_x + 1, tile_y + 1] );
        
        } else if ( piece_id == 7  ){
            ret.push( [tile_x + 0, tile_y + 1] );
            
        } else if ( piece_id == 8 ) {
            ret.push( [tile_x + 0, tile_y + 1] );
            ret.push( [tile_x + 1, tile_y + 0] );
            
        } else if ( piece_id == 9  ) {
            ret.push( [tile_x - 1, tile_y - 1] );
            ret.push( [tile_x + 0, tile_y - 1] );
            ret.push( [tile_x + 0, tile_y + 1] );
            ret.push( [tile_x + 1, tile_y + 1] );
        }
        return ret;
    }


    //------------
    check_winning(){

        let done = 1;
        for ( let i = 0 ; i < this.board_arr.length ; i++) {
            if ( this.board_arr[i] == null ) {
                done = 0;
                break;
            }
        }
        if ( done == 1 ) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 13 );
            
        }
    }

    //----
    board_onclick( hitPoint ) {
        
        //console.log("board_onclick", hitPoint );
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.2 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.125 );
        
        if ( tile_x < 0 || tile_x >= 5 || tile_y < 0 || tile_y >= 8 ) {
            this.mygame.snds["denied"].play();
            return ;
        }

        if ( this.board_arr[tile_y * 5 + tile_x ] == null ) {
            
            // click empty.
            let affected_tiles = this.getAffectedTiles( this.selector.item_id, tile_x, tile_y);    
            let clash = 0;

            if ( this.selector.item_id != null ) {
                for ( let i  = 0 ; i < affected_tiles.length ; i++ ) {
                
                    let affected_tile = affected_tiles[i];
                    let atile_x = affected_tile[0];
                    let atile_y = affected_tile[1];

                    if ( atile_x < 0 || atile_x >= 5 || atile_y < 0 || atile_y >= 8 ) {
                        clash = 1;
                        break;
                    }
                    if ( this.board_arr[atile_y * 5 + atile_x ] != null ) {
                        clash = 1;
                        break;
                    }
                    
                }

                if ( clash == 1 ) {

                    this.mygame.display_text_effect("You cannot place it there.", 40);
                    this.mygame.snds["denied"].play();
                    
                } else {
                    
                    let piece = this.pieces_arr[ this.selector.item_id ];
                    piece.scale.set( 3/5, 3/8 ,  1);
                    this.board.add( piece );
                    
                    piece.position.x = tile_x * 0.2    - 0.5 + 1/10;
                    piece.position.y = tile_y * 0.125  - 0.5 + 1/16;
                    piece.position.z = 0.7;
                    piece.renderOrder = 100;

                    this.root.remove( this.selector );
                    
                    this.board_arr[ tile_y * 5 + tile_x ] = this.selector.item_id;
                    for ( let i  = 0 ; i < affected_tiles.length ; i++ ) {
                        let affected_tile = affected_tiles[i];
                        let atile_x = affected_tile[0];
                        let atile_y = affected_tile[1];
                        this.board_arr[ atile_y * 5 + atile_x ] = this.selector.item_id;
                    }
                    this.selector.item_id = null;

                    this.mygame.snds["arrowhit"].play();
                    this.check_winning();
                    
                }
            } else {
                //this.mygame.display_text_effect("You cannot place it there.", 40);
                //this.mygame.snds["denied"].play();
            }
            

        } else {
            // click something on board.
            let selected_piece_item_id = this.board_arr[tile_y * 5 + tile_x ];
            let selected_piece = this.pieces_arr[ selected_piece_item_id ];

            // put back
            selected_piece.position.x = selected_piece.ox;
            selected_piece.position.y = selected_piece.oy;
            selected_piece.position.z = selected_piece.oz;
            selected_piece.scale.set( selected_piece.osize, selected_piece.osize, 1 ) ;
            this.root.add( selected_piece );
            
            this.item_onclick( selected_piece_item_id );

            // remove the piece from board.
            for ( let i = 0 ; i < this.board_arr.length ; i++ ) {
                if ( this.board_arr[i] == selected_piece_item_id ) {
                    this.board_arr[i] = null;
                }
            }
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

    //-------
    init_pieces() {

        let size = 0.9;
        let gap  = 0.2;
        for ( let i = 0 ; i < 10 ; i++ ) {
            let x =  ( i % 2 )        * (size + gap) + 3;
            let y = (( i / 2 ) >> 0 ) * (size + gap) - 2.3;
            let frame_y = ( i / 5 ) >> 0;
            let frame_x =   i % 5;
            let piece = this.mygame.create_item_plane( this.mygame.materials["tangram"], x,y, 0.08  ,size,size    ,2,5, frame_y ,frame_x );
            piece.item_id = i;
            piece.osize = size;
            piece.ox = x;
            piece.oy = y;
            piece.oz = 0;
            this.root.add( piece );
            this.pieces_arr.push( piece );
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

            let hit;
            for ( let i = intersects.length - 1 ; i >= 0 ; i-- ) {
                hit = intersects[i];
                if ( hit.object.item_id && hit.object.item_id == "board" ) {
                    break;
                }
            }

            let clickedObject = hit.object;
            let item_id = clickedObject.item_id;

            if ( item_id != null ) {
                if ( item_id == "board" ) {
                    const localPoint = hit.object.worldToLocal(hit.point.clone());
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