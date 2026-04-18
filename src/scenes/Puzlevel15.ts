

import * as THREE from 'three';

export class PuzLevel15 {
    
    setting_active_range = 16;
    pieces_arr = [];
    spelling = ["P","U","Z","Z","L","E"];
    spelling_num = [15,20,25,25,11,4];
    
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
        board.scale.set( 5,5, 0.1 );
        board.children[0].material = mygame.materials["darkgrey"];
        root.add( board );
        this.root   = root;
        
        let resetbutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        resetbutton.position.set(  0, -3, 0.1);
        resetbutton.scale.set( 2.5, 0.75, 0.2);
        let resetbutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"], -0.05, 0, 0.6  , 0.6, 1    ,8,4,1,0 );
        resetbutton.add( resetbutton_face );
        resetbutton.children[0].children[0].material = mygame.materials["blue"];
        resetbutton.button_id = "reset";
        root.add( resetbutton );


        this.init_pieces();
        this.reset_board();
        
    }

    //----
    reset_board() {
        this.current_spelling_index = 1;
        this.current_cell_id = 0;
        this.prev_item_id = 0;

        for ( let i = 0 ; i < this.pieces_arr.length ; i++) {
            let piece = this.pieces_arr[i];
            piece.opened = null;
            if ( i == 0 ) {
                piece.children[0].children[0].material = this.mygame.materials["yellow"];
            } else if ( i == 35 ) {
                piece.children[0].children[0].material = this.mygame.materials["emigreen"];
            } else {
                piece.children[0].children[0].material = this.mygame.materials["white"];
            }

        }   
    }

    //---------
    init_pieces() {

        // Static board arr that says which cell is placable, which is not.
        this.board_arr = [
            15, 25, 25, 15, 20, 25,
            11, 20, 20, 11,  4, 25,
             4, 25, 25, 15,  4, 11,
            15, 11,  4, 25, 25, 15, 
            20, 25, 25, 20, 11, 20, 
            25, 25, 11,  4, 15,  4,
        ]        

        let size = 0.6;
        let gap  = 0.1;
        
        for ( let i = 0 ; i < 36 ; i++ ) {

            let x = (  i % 6 )         *  (size+gap) - 1.8;
            let y = (( i / 6 ) >> 0 ) * -(size+gap)  + 1.8;
            
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0.1 );
            button.scale.set( size , size , 0.2 );
            button.item_id = i;
            this.root.add( button );

            let val = this.board_arr[i];
            let uvx = val % 8;
            let uvy = 7 - Math.floor( val / 8 );
            button.item_val = val;

            let button_face = this.mygame.create_item_plane( this.mygame.materials["alphabets"], 0,0, 0.6  ,1.0,1.0    ,8,8, uvy ,uvx );
            button.add( button_face );
            
            this.pieces_arr.push( button );
        } 
    }


    //----------
    // Not against 0
    check_single_cell( item_val , item_id ) {

        console.log("check_single_cell", item_id, "val", item_val);
        
        let row = ( item_id / 6 ) >> 0;
        let col =   item_id % 6 ;
        let adjacent_test_ok = -1;
        
        // Check previous (Compulsory) with 8 neighbours.
        let neighbour_coords = [
            [-1,0],
            [ 1,0],
            [ 0,-1],
            [ 0, 1],
            [ -1, -1 ],
            [  1, -1 ],
            [ -1,  1 ],
            [  1,  1 ]
        ]

        for ( let i = 0 ; i < neighbour_coords.length ; i++ ) {

            let ncol = neighbour_coords[i][0] + col;
            let nrow = neighbour_coords[i][1] + row;
            
            //log( "neighbour " , ncol, nrow )
            if ( nrow >=0 && nrow < 6 && ncol >= 0 && ncol < 6 ) {

                if ( this.current_cell_id == nrow * 6 + ncol  ) { // for prev, check with all
                    adjacent_test_ok = 1;
                }
            }
        }

        if ( adjacent_test_ok != 1 ) {
            if ( this.current_cell_id == 0 ) {
                this.mygame.display_text_effect( "Clear ALL the squares \nby constructing a path from Start to End. \nPUZZLE should be spelt out along the path."  ,  30);
            
            } else {
                this.mygame.display_text_effect( "You must select a square adjacent \nto the last square selected."  ,  30);
            }
            return -1;

        }

        // Check the square is the correct spelling.
        if ( this.spelling_num[this.current_spelling_index] != item_val ) {
            this.mygame.display_text_effect( "Incorrect spelling. Next letter is " + this.spelling[this.current_spelling_index]  ,  40);
            return -1;
        }


        // Check the finishing
        if ( item_id == 35 ) {
            for ( let i = 0 ; i < this.pieces_arr.length; i++) {
                if ( i != 35 && i != 0 ) {
                    let piece_i = this.pieces_arr[i];
                    if ( piece_i.opened != 1 ) {
                        this.mygame.display_text_effect( "Not allowed to end before all squares are cleared."  , 40);
                        return -1;
                    }
                }
            }
        }
        return adjacent_test_ok;
    }


    //---
    item_onclick( item_id ) {

        //console.log( item_id );
        let piece       = this.pieces_arr[ item_id ];
        let prev_piece  = this.pieces_arr[ this.prev_item_id];
        let item_val    = piece.item_val;

        if ( piece.opened != 1  ) {

            
            if ( this.check_single_cell( item_val, item_id ) == -1 ) {

                this.mygame.snds["denied"].play();
                
            } else {

                // 1 is white 2 is emit
                prev_piece.children[0].children[0].material = this.mygame.materials["orange"];
                piece.children[0].children[0].material = this.mygame.materials["yellow"];


                this.current_cell_id = item_id;
                piece.opened = 1 ;
                this.current_spelling_index = ( this.current_spelling_index + 1 ) % 6;
                this.mygame.snds["arrowhit"].play();
                this.prev_item_id = item_id

                if ( item_id == 35 ) {
                    
                    this.mygame.display_text_effect("Well Done!", 60);
                    this.mygame.snds["success"].play();
                    this.mygame.snds["applause"].play();
                    this.solved = 1;
                    this.mygame.completed_level( 15 );
            
                    
                } else {
                    //this.current_spelling_index.value = "Next Letter: " + this.spelling[ this.current_spelling_index ];
                }
            }

        } else {

            this.mygame.snds["denied"].play();
            this.mygame.display_text_effect("Please select a square which has not been selected previously." , 40);
            
        }
    }
    //----
    button_onclick( button_id ) {
        if ( button_id == "reset" ) {
            this.reset_board();
            this.mygame.snds["keypad"].play();
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
            let clickedObject = hit.object.parent;
            let item_id = clickedObject.item_id;
            let button_id = clickedObject.button_id;

            if ( item_id != null ) {
                this.item_onclick( item_id );
            } else if ( button_id != null ) {
                this.button_onclick( button_id );
            }
            return 0;

        } else {
            return null;
        }
    }
}