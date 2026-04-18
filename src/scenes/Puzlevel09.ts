

import * as THREE from 'three';

export class PuzLevel09 {
    
    setting_active_range = 16;
    
    current_number = 2;
    pieces_arr = [];

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
        board.children[0].material = mygame.materials["orange"];
        board.scale.set( 7,7, 0.1 );
        root.add( board );
        
        let board_face = mygame.create_item_plane( mygame.materials["hidatoboard"], 0,0, 0.55  ,1,1    ,1,1,0,0 );
        board.add( board_face );
        this.root   = root;

        
        this.init_pieces();

        this.lbl_current_number = this.mygame.create_item_plane( this.mygame.materials["numbers100_b"],
                     -3,
                     -3, 
                     0.1 , 

                     1, 
                     1, 

                     10, 
                     10, 
                     0, 
                     2 );
        root.add( this.lbl_current_number );

    }


    //----------
    // Not against 0
    check_single_cell( item_id , item_val_to_use ) {

        //console.log("check_single_cell", item_id , item_val  );
        
        let row = ( item_id / 11 ) >> 0;
        let col =   item_id % 11 ;

        //log( "row", row, "col", col)
        let adjacent_test_ok = -1;
        
        // Check previous (Compulsory) with 6 neighbours.
        let neighbour_coords = [
            [-1,0],
            [ 1,0],
            [ 0,-1],
            [ 0, 1],
            [ [-1, 1][row % 2]  ,-1 ],
            [ [-1 ,1][row % 2]  , 1 ]
        ]

        for ( let i = 0 ; i < neighbour_coords.length ; i++ ) {

            let ncol = neighbour_coords[i][0] + col;
            let nrow = neighbour_coords[i][1] + row;
            
            //log( "neighbour " , ncol, nrow )
            if ( nrow >=0 && nrow < 11 && ncol >= 0 && ncol < 11 ) {

                if ( this.board_arr[nrow * 11 + ncol ] >= 0 ) { // for prev, check with all

                    //log( "neighbourval " , ncol, nrow , this.board_pieces_ent[nrow * 11 + ncol]["piece_id"] )
                    if ( this.pieces_arr[nrow * 11 + ncol] && this.pieces_arr[nrow * 11 + ncol].item_val == item_val_to_use - 1 ) {
                        adjacent_test_ok = 1;
                        break;
                    }
                }
            }
        }

        if ( adjacent_test_ok != 1 ) {
            this.mygame.display_text_effect( this.current_number + " must be placed adjacent to " + ( item_val_to_use - 1)  ,  40);
            return -1;
        }

        // Check next num if needed with 6 neighbours
        if ( this.board_arr.indexOf(item_val_to_use + 1 ) != -1 ) {
            
            adjacent_test_ok = 0;

            for ( let i = 0 ; i < neighbour_coords.length ; i++ ) {
            
                let ncol = neighbour_coords[i][0] + col;
                let nrow = neighbour_coords[i][1] + row;
            
                if ( nrow >=0 && nrow < 11 && ncol >= 0 && ncol < 11 ) {
            
                    if ( this.board_arr[nrow * 11 + ncol ] > 0 ) { //for next only check with static
                        if ( this.pieces_arr[nrow * 11 + ncol] && this.pieces_arr[nrow * 11 + ncol].item_val == item_val_to_use + 1 ) {
                            adjacent_test_ok = 1;
                            break;
                        }
                    }
                }
            }

            if ( adjacent_test_ok != 1 ) {
                this.mygame.display_text_effect( this.current_number + " must be placed adjacent to " + (item_val_to_use + 1)  ,  40);
                return -1;
            }

        }

        return adjacent_test_ok;
    }


    //-------------
    update_current_number( clicked_number  ) {
        
        if ( clicked_number == 0 ) {
            // add number
            for ( let i = this.current_number + 1 ; i < 93 ; i++ ) {
                // First we check the next number is it given since the start. if given keep increment 1
                // until the next not given,  
                if ( this.board_arr.indexOf(i) == -1 ) {
                    this.current_number = i;
                    break;
                }
            }
        } else { 
            // Remove number
            this.current_number = clicked_number;
            for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
                let piece = this.pieces_arr[i];
                // board_arr[i] == 0 means clickable.
                if ( this.board_arr[i] == 0 && piece.item_val >= clicked_number ) {
                    this.update_single_piece( piece, 0);
                }
            }
        }
        
        let frame_x =  this.current_number % 10;
        let frame_y = (this.current_number / 10 ) >> 0;
        this.mygame.setUV( this.lbl_current_number.geometry.attributes.uv, 10,10, frame_y, frame_x );
    }

    //-------------------------
    update_single_piece( piece, item_val_to_use ) {
        
        console.log( "update_single_piece", item_val_to_use );

        let frame_x =  item_val_to_use % 10;
        let frame_y = (item_val_to_use / 10 ) >> 0;
        this.mygame.setUV( piece.geometry.attributes.uv, 10,10, frame_y, frame_x );
        piece.item_val = item_val_to_use;

    }

    //----------------
    check_winning() {
        
        let solved = 0;

        if ( this.current_number == 92 ) {
            solved = 1;
            for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
                let piece = this.pieces_arr[i];    
                if ( piece && piece.item_val == 0 ) {
                    solved = 0;
                    break;
                }            
            }
        }
        
        if ( solved == 1 ) {
            
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.mygame.display_text_effect("Well Done!", 50);
            this.solved = 1
            this.mygame.completed_level( 9 );
            
        }
    }

    //-----
    piece_onclick( item_id ) {
        
        //console.log( "piece_onclick", item_id );
        let piece = this.pieces_arr[ item_id ] 

          // board_arr[item_id] == 0 means clickable
        if ( piece != null && this.board_arr[item_id] == 0 ) {
            
            let old_item_val = piece.item_val;
                
            if ( old_item_val == 0 ) {
                
                // Place number
                let adjacent_test = this.check_single_cell( item_id , this.current_number );
                if ( adjacent_test != 1 ) {
                    this.mygame.snds["denied"].play();
                    return ;
                }
                    
                this.mygame.snds["arrowhit"].play();
                this.update_single_piece( piece, this.current_number );
                this.update_current_number( old_item_val );
                this.check_winning();

            } else {
                // Remove number
                this.mygame.snds["plop"].play();
                this.update_single_piece( piece, 0 );
                this.update_current_number( old_item_val );
                
            }
            
        }

    }

    


    //---------
    init_pieces() {

        // Static board arr that says which cell is placable, which is not.
        this.board_arr = [

            -2,-2,-2, 0, 0,42, 0, 0, 0,-2,-2,
            -2,-2, 0, 0, 0, 0, 0, 0, 0,-2,-2,
            -2,-2, 0,31, 0,38,46,47, 0, 0,-2,
            -2, 0, 0, 0, 0, 0,48, 0, 0, 0,-2,
            -2, 0, 0,26, 0,61, 0,57, 0, 0, 0,
             9, 8, 0,24, 0, 0, 0, 0, 0, 0,76,
            -2, 0, 0, 3,22, 0, 0, 0, 0, 0, 0,
            -2, 0, 0, 1,20, 0, 0,69,81, 0,-2,
            -2,-2, 0, 0,17, 0, 0, 0, 0, 0,-2,
            -2,-2,14, 0,16, 0, 0,84, 0,-2,-2,
            -2,-2,-2,91, 0, 0, 0, 0, 0,-2,-2
        ]

        for ( let i = 0 ; i < this.board_arr.length ; i++ ) {

            let col = i % 11;
            let row = (i / 11) >> 0 ;

            let extra = 0;
            if ( row % 2 == 1 ) {
                extra = 0.5;
            }

            let x =  (col + extra ) * 0.58   - 3.20;
            let y =  row            * 0.58   - 2.9 ;
            let piece_val = this.board_arr[i]  ;

            if ( piece_val  >= 0 ) {

                let uvr = ( piece_val / 10 ) >> 0;
                let uvc =   piece_val % 10;

                let piece = this.mygame.create_item_plane( this.mygame.materials["numbers100"],
                     x,
                     y, 
                     0.1 , 

                     0.50, 
                     0.50, 

                     10, 
                     10, 
                     uvr, 
                     uvc 
                );
                piece.item_id = i;
                piece.item_val = piece_val;
                piece.renderOrder = 1;
                if ( piece_val == 0 ) {
                    piece.material = this.mygame.materials["numbers100_b"];
                }
                this.pieces_arr[i] = piece ;
                this.root.add( piece );
            } 
        }
    }


    //---
    onPointerDown( pointer ) {

        //console.log("OnPointerDown" );

        const mouse = new THREE.Vector2(0,0);
        if ( this.mygame.input.mouse.locked == false ) {
            mouse.x =  ( pointer.x / this.mygame.sys.game.scale.width ) * 2 - 1;
            mouse.y = -( pointer.y / this.mygame.sys.game.scale.height ) * 2 + 1;
        }
        
        let raycaster = this.mygame.raycaster;
        raycaster.setFromCamera(mouse, this.mygame.threejs_camera );
        const intersects = raycaster.intersectObjects( this.root.children);

        if (intersects.length > 0) {

            //console.log("onPointerDown", intersects );
            
            if ( this.solved == 1 ) {
                this.mygame.display_text_effect("This game has been completed.", 40);
                return -1;
            }

            let hit = intersects[0];
            let clickedObject = hit.object;
            if ( clickedObject.item_id == null && clickedObject.button_id == null ) {
                clickedObject = hit.object.parent;
            }
            let item_id = clickedObject.item_id;
            let button_id = clickedObject.button_id;

            if ( item_id != null ) {
                this.piece_onclick( item_id );
            } else if ( button_id != null ) {
                this.button_onclick( button_id );
            }
            return 0;

        } else {
            return null;
        }
    }
}