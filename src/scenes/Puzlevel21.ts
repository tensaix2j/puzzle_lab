

import * as THREE from 'three';

export class PuzLevel21 {
    
    setting_active_range = 16;
    pieces_arr = [];
    group_arr = [];

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
        
        let instruction = mygame.create_item_plane( mygame.materials["hitoriinstruction"], 0, -3, 0.06,  6, 1.5 , 1, 1, 0, 0 )
        root.add( instruction );

        this.init_pieces();
    }

    //---------
    init_pieces() {

        this.board_arr = [
            9, 2, 5, 3, 7, 1, 2, 7, 1,
            2, 2, 8, 5, 1, 3, 6, 9, 7,
            8, 1, 5, 5, 7, 9, 3, 6, 4,
            5, 9, 8, 1, 2, 8, 3, 5, 9,
            
            4, 4, 1, 7, 3, 3, 8, 2, 9,

            1, 3, 7, 1, 9, 2, 5, 6, 6,
            3, 5, 8, 6, 2, 6, 7, 1, 6,
            6, 1, 3, 9, 5, 7, 4, 4, 2,
            5, 7, 1, 8, 3, 6, 9, 4, 1
        ]

        let size = 0.45;
        let gap  = 0.05;
        
        for ( let i = 0 ; i < 81 ; i++ ) {

            let x = (  i % 9 )         *  (size+gap)  - 2;
            let y = (( i / 9 ) >> 0 )  * -(size+gap)  + 2.1;
            
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0.1 );
            button.scale.set( size , size , 0.2 );
            button.item_id = i;
            button.children[0].children[0].material = this.mygame.materials["white"];
            this.root.add( button );

            let val = this.board_arr[i];
            let uvx = val % 8;
            let uvy = 7 - Math.floor( val / 8 );
            button.item_val = val;

            let button_face = this.mygame.create_item_plane( this.mygame.materials["numbers100"], 0,0, 0.6  ,0.7,0.7    ,10,10, 0 , val );
            button.add( button_face );
            
            this.pieces_arr.push( button );
        } 

    }


    //---------
    mark_group( i , piece,  neighbour_coords , depth ) {

        
        let ret = 0;
        let col =  i % 9;
    	let row = (i / 9) >> 0;
        
        if ( this.group_arr[i] == 0 ) {

            //log( "mark_group", row, col, "Depth:", depth);
            this.group_arr[i] = 1 ;

            // Expand and mark neighbours
            for ( let n = 0 ; n < neighbour_coords.length ; n++ ) {

                // Need to have exactly 2 shaded neighbours.
                let ncol = neighbour_coords[n][0] + col;
                let nrow = neighbour_coords[n][1] + row;
                
                if ( ncol >= 0 && nrow >= 0 && ncol < 9 && nrow < 9 ) {
                    
                    let n_i = nrow * 9 + ncol;
                    let n_piece = this.pieces_arr[n_i];
                    if ( n_piece.shaded != 1 && this.group_arr[n_i] == 0 ) {
                        this.mark_group( n_i , n_piece, neighbour_coords, depth + 1 );
                    } 
                }
            }
            ret = 1;
        } 
        return ret;

    }

    //----
    check_winning() {

        let solved = 1;
    	let shaded_count = 0;

    	let neighbour_coords = [
            [-1,    0],
            [ 1,    0],
            [ 0,   -1],
            [ 0,    1],
        ]
        
        for ( let i = 0 ; i < this.board_arr.length ; i++ ) {

    		let col =  i % 9;
    		let row = (i / 9) >> 0;
    		let n_shaded_count = 0;
    				
    		let piece = this.pieces_arr[i];
            let piece_val = piece.item_val;

            // This cell is a shaded
            if ( piece.shaded == 1 ) {
                
                let two_black_adjacent = 0;
                shaded_count += 1;
                
                // Check rule 2 
                for ( let n = 0 ; n < neighbour_coords.length ; n++ ) {
                    
                    let ncol = neighbour_coords[n][0] + col;
                    let nrow = neighbour_coords[n][1] + row;
                    
                    if ( ncol >= 0 && nrow >= 0 && ncol < 9 && nrow < 9 ) {
                        
                        let n_i = nrow * 9 + ncol;
                        let n_piece = this.pieces_arr[n_i];
                        if ( n_piece.shaded == 1 ) {
                            two_black_adjacent = 1;
                            break;
                        } 
                        
                    }
                }

                if ( two_black_adjacent == 1 ) {
                    
                    console.log( "Two black cells" , row, col );
                    solved = 0;
                    break;
                }

            } else {

                // This cell is not shaded. Then check rule 1: row and col for dup
                let has_dup_in_row_or_col = 0;
                
                for ( let other_col = 0 ; other_col < 9 ; other_col++ ) {
                    if ( other_col != col ) {
                        let other_i = row * 9 + other_col;
                        let other_piece = this.pieces_arr[ other_i ];
                        let other_piece_val = other_piece.item_val;
                        if ( other_piece.shaded != 1 ) {
                            if ( piece_val == other_piece_val ) {
                                console.log("Duplicate on other col", row,col ," vs " , row, other_col, "val", other_piece_val )
                                has_dup_in_row_or_col = 1;
                                break;
                            }
                        }
                    }
                }

                if ( has_dup_in_row_or_col == 0 ) {
                    for ( let other_row = 0 ; other_row < 9 ; other_row++ ) {
                        if ( other_row != row ) {
                            let other_i = other_row * 9 + col;
                            let other_piece = this.pieces_arr[other_i];
                            let other_piece_val = other_piece.item_val;
                            if ( other_piece.shaded != 1 ) {
                                if ( piece_val == other_piece_val ) {
                                    
                                    console.log("Duplicate on other row", row,col ," vs " , other_row, col, "val", piece_val )
                                    has_dup_in_row_or_col = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
                if ( has_dup_in_row_or_col == 1 ) {
                    console.log( "Duplicate unshaded" , row, col );
                    solved = 0;
                    break;
                }
                
                
            }
            
    	}	
        
        if ( solved == 1 ) {
            let group_id = 0;
            for ( let i  = 0 ; i < this.board_arr.length ; i++ ) {
                this.group_arr[i]= 0;
            }
            for ( let i = 0 ; i < this.board_arr.length ; i++ ) {
                
                let piece = this.pieces_arr[i];

                if ( piece.shaded != 1 ) {
                    let ret = this.mark_group(i , piece, neighbour_coords , 0 );
                    if ( ret == 1 ) {
                        group_id += 1;
                    }
                    if ( group_id > 1 ) {
                        console.log("Connected groups no longer in 1 piece")
                        solved = 0;
                        break;
                    }
                    
                }
            }
        }
        
        if ( shaded_count > 0 && solved == 1 ) {

    		this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
        	this.mygame.completed_level( 21 );
            
        }
    }

    //---
    item_onclick( item_id ) {
        let piece = this.pieces_arr[item_id];
        if ( piece.shaded == null ) {
            piece.shaded = 1;
            piece.children[0].children[0].material = this.mygame.materials["darkgrey"];
            this.mygame.snds["tick"].play();
        } else {
            piece.shaded = null;
            piece.children[0].children[0].material = this.mygame.materials["white"];
            this.mygame.snds["plop"].play();
        }
        this.check_winning();
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
            let item_id = hit.object.item_id;
            if ( item_id == null ) {
                item_id = hit.object.parent.item_id;
            }
            if ( item_id == null ) {
                item_id = hit.object.parent.parent.item_id;
            }
            
            if ( item_id != null ) {
                this.item_onclick( item_id );
            } 
            return 0;

        } else {
            return null;
        }
    }
}