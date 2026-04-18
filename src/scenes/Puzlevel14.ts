

import * as THREE from 'three';

export class PuzLevel14 {
    
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
        board.scale.set( 4,4, 0.1 );
        root.add( board );
        this.board = board;

        let board_face = mygame.create_item_plane( mygame.materials["tetravexboard"], 0,0, 0.6    ,1,1    ,1,1,0,0 );
        board_face.item_id = "board";
        board.add( board_face );
        this.root   = root;

        
        this.init_pieces();

        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.item_id = 0;
        selector.position.set( this.pieces_arr[ selector.item_id ].position.x, this.pieces_arr[ selector.item_id  ].position.y, 0.1);
        selector.scale.set( 0.9 , 0.9 , 0.2 );
        this.root.add( selector );
        this.selector = selector;
        

    }


    //---------------------
    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    //----
    init_pieces() {

        let mapnum = [1,2,3,4,5,6,7,8,9];
        this.shuffleArray(mapnum);

        let orimap = [
            mapnum[0],mapnum[1],mapnum[2],mapnum[0] ,
            mapnum[3],mapnum[6],mapnum[8],mapnum[3] ,
            mapnum[8],mapnum[1],mapnum[6],mapnum[2] ,
            mapnum[8],mapnum[2],mapnum[7],mapnum[6] ,
            
            mapnum[8],mapnum[3],mapnum[7],mapnum[7] ,
            mapnum[5],mapnum[5],mapnum[6],mapnum[0] ,
            mapnum[4],mapnum[1],mapnum[3],mapnum[6] ,
            mapnum[7],mapnum[6],mapnum[1],mapnum[4] ,
        
            mapnum[6],mapnum[0],mapnum[1],mapnum[2] ,
            mapnum[7],mapnum[2],mapnum[8],mapnum[5] ,
            mapnum[0],mapnum[8],mapnum[0],mapnum[7] ,
            mapnum[7],mapnum[3],mapnum[4],mapnum[2] ,
        
            mapnum[7],mapnum[7],mapnum[3],mapnum[4] ,
            mapnum[6],mapnum[6],mapnum[4],mapnum[8] ,
            mapnum[2],mapnum[4],mapnum[5],mapnum[3] ,
            mapnum[2],mapnum[8],mapnum[6],mapnum[7] 
        ]


        let size = 0.9;
        let gap  = 0.1;
        let xjs = [     0, -0.30, 0.30,     0 ];
        let yjs = [  0.30,     0,    0, -0.30 ];
        for ( let i = 0 ; i < 16 ; i++ ) {

            let x = ( i % 4 )         *  (size+gap) + 2.7;
            let y = (( i / 4 ) >> 0 ) * -(size+gap) + 1.5;
            
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0 );
            button.scale.set( size , size , 0.2 );
            button.item_id = i;
            button.item_vals = [];
            button.osize = size;
            button.ox = x;
            button.oy = y;
            button.oz = 0;
            this.root.add( button );

            let button_face = this.mygame.create_item_plane( this.mygame.materials["tetravexsquare"], 0,0, 0.6  ,1.0,1.0    ,1,1,0,0 );
            button.add( button_face );

            for ( let j = 0 ; j < 4 ; j++ ) {
                let xj = xjs[j];
                let yj = yjs[j];
                let val = orimap[ i * 4 + j ];
                
                let uvx = val % 4;
                let uvy = (val / 4) >> 0;
                
                let button_face_slice = this.mygame.create_item_plane( this.mygame.materials["symbols"], xj,yj, 0.2  ,0.35,0.35    ,4,4,uvy,uvx );
                button_face_slice.renderOrder = 1;
                button_face.add( button_face_slice );
                button.item_vals[j] = val;
            }

            this.pieces_arr.push( button );
        }   
    }


    //---------
    check_ok_to_fill( board_arr_id ) {

        let ret = true;
        // Check 4 neighbour , N,E,S,W
        // N
        if ( board_arr_id + 4 <= 15 && this.board_arr[ board_arr_id + 4 ] != null ) {
            let north_piece = this.board_arr[ board_arr_id + 4 ];
            if ( north_piece.item_vals[3] != this.pieces_arr[ this.selector.item_id ].item_vals[0] ) {
                ret = false;
            }
        }

        // W
        if ( board_arr_id % 4 > 0 && this.board_arr[ board_arr_id - 1 ] != null ) {
            let west_piece = this.board_arr[ board_arr_id - 1 ];
            if ( west_piece.item_vals[2] != this.pieces_arr[ this.selector.item_id ].item_vals[1] ) {
                ret = false;
            }
        }

        // E
        if ( board_arr_id % 4 < 3 && this.board_arr[ board_arr_id + 1 ] != null ) {
            let east_piece = this.board_arr[ board_arr_id + 1 ];
            if ( east_piece.item_vals[1] != this.pieces_arr[ this.selector.item_id ].item_vals[2] ) {
                ret = false;
            }
        }
        // S
        if ( board_arr_id - 4 >= 0 && this.board_arr[ board_arr_id - 4 ] != null ) {
            let south_piece = this.board_arr[ board_arr_id - 4 ];
            if ( south_piece.item_vals[0] != this.pieces_arr[ this.selector.item_id ].item_vals[3] ) {
                ret = false;
            }
        }
        return ret;
    }

    //----
    check_winning() {
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
            this.mygame.completed_level( 14 );
            
        }
    }

    //---------------
    board_onclick( hitPoint ) {
        
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.25 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.25 );
        //console.log( tile_x , tile_y );

        if ( tile_x < 0 || tile_x >= 4 || tile_y < 0 || tile_y >= 4 ) {
            this.mygame.snds["denied"].play();
            return ;
        }

        if ( this.board_arr[tile_y * 4 + tile_x ] == null ) {
        
            if ( this.selector.item_id != null ) {

                if ( this.check_ok_to_fill(  tile_y * 4 + tile_x )  ) {
                    
                    let piece = this.pieces_arr[ this.selector.item_id ];
                    
                    this.board.add( piece );
                    piece.position.x = tile_x * 0.25  - 0.125 - 0.25;
                    piece.position.y = tile_y * 0.25  - 0.125 - 0.25;
                    piece.position.z = 1;
                    piece.scale.set( 1/4, 1/4 , 1);
                    piece.renderOrder = 100;
                    
                    this.board_arr[ tile_y * 4 + tile_x ] = piece;
                    this.mygame.snds["arrowhit"].play();

                    this.selector.item_id = null;
                    this.root.remove( this.selector );
                    
                    this.check_winning();

                    
                } else {
                    this.mygame.display_text_effect("You cannot place it there.", 40);
                    this.mygame.snds["denied"].play();

                }
            } else {
                this.mygame.display_text_effect("Select a piece first", 40);
                this.mygame.snds["denied"].play();
            }
        } else {

            // click something on board.
            let selected_piece = this.board_arr[tile_y * 4 + tile_x ];
            
            // put back
            selected_piece.position.x = selected_piece.ox;
            selected_piece.position.y = selected_piece.oy;
            selected_piece.position.z = selected_piece.oz;
            selected_piece.scale.set( selected_piece.osize, selected_piece.osize, 0.2 ) ;
            this.root.add( selected_piece );
            
            this.item_onclick( selected_piece.item_id );

            // remove the piece from board.
            this.board_arr[tile_y * 4 + tile_x ] = null;
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
                if ( hit.object.item_id && hit.object.item_id == "board" ) {
                    break;
                }
            }

            let clickedObject = hit.object;
            let item_id = clickedObject.item_id;
            if ( item_id != "board" ) {
                item_id = clickedObject.parent.item_id;
                if ( item_id == null ) {
                    item_id = clickedObject.parent.parent.item_id;
                }
            }

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