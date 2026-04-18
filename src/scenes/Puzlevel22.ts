

import * as THREE from 'three';

export class PuzLevel22 {
    
    setting_active_range = 16;
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
        this.root   = root;
        
        let board = mygame.cloneInstance( mygame.models["cube"].scene );
        board.scale.set( 7 ,8, 0.1 );
        board.children[0].material = mygame.materials["darkgrey"];
        root.add( board );
        this.root   = root;
        
        let instruction = mygame.create_item_plane( mygame.materials["bosnianinstruction"], 0, -3, 0.06,  6, 1.5 , 1, 1, 0, 0 )
        root.add( instruction );

        this.init_pieces();


    }

    //--------
    init_pieces() {
        this.board_arr = [
        	0,0,0,0,0, 1, 0,0,0,0,0,
        	0,0,6,0,0, 0, 0,0,0,0,0,
            0,0,0,0,0, 0, 0,0,0,5,0,
            0,0,0,0,0, 0, 4,0,0,0,0,
            0,0,0,3,0, 0, 0,0,0,0,0,
            2,0,0,0,0, 0, 0,0,0,0,4,
            0,0,0,0,0, 0, 0,6,0,0,0,
            0,0,0,0,2, 0, 0,0,0,0,0,
            0,7,0,0,0, 0, 0,0,0,0,0,
            0,0,0,0,0, 0, 0,0,4,0,0,
            0,0,0,0,0, 3, 0,0,0,0,0,
        ]

        let size = 0.35;
        let gap  = 0.020;
        
        for ( let i = 0 ; i < 121 ; i++ ) {

            let x = (  i % 11 )         *  (size+gap)  - 2;
            let y = (( i / 11 ) >> 0 )  * -(size+gap)  + 2.0;
            
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0.05 );
            button.scale.set( size , size , 0.1 );
            button.item_id = i;
            button.children[0].children[0].material = this.mygame.materials["white"];
            this.root.add( button );
            this.pieces_arr[i] =  button ;

            if ( this.board_arr[i] != 0 ) {
                
                let item_val = this.board_arr[i];
                let number_face = this.mygame.create_item_plane( this.mygame.materials["numbers100_b"], x,y, 0.12  ,size,size    ,10,10, 0 , item_val );
                number_face.renderOrder = 1;
                number_face.item_val = item_val;
                this.root.add( number_face );
                button.item_id = null;                    
            }
        } 

    }


    //------------
    check_winning() {
    	
    	let solved = 1;
    	let shaded_count = 0;

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

    	for ( let i = 0 ; i < this.board_arr.length ; i++ ) {

    		let col =  i % 11;
    		let row = (i / 11) >> 0;
    		let n_shaded_count = 0;
    				
    		// This cell is shadable.
    		if ( this.board_arr[i] == 0 ) {
    			
    			let piece = this.pieces_arr[i];
    			
    			// This cell is a shaded
    			if ( piece.shaded == 1 ) {
    				
    				shaded_count += 1;

    				for ( let n = 0 ; n < 4 ; n++ ) {
	    				// Need to have exactly 2 shaded neighbours.
	    				let ncol = neighbour_coords[n][0] + col;
	            		let nrow = neighbour_coords[n][1] + row;
	            		
	            		if ( ncol >= 0 && nrow >= 0 && ncol < 11 && nrow < 11 ) {
	            			let n_i = nrow * 11 + ncol;
	            			if ( this.board_arr[n_i] == 0 ) {
	            				let n_piece = this.pieces_arr[n_i];
	            				if ( n_piece.shaded == 1 ) {
	            					n_shaded_count += 1;
	            				} 
	            			}
	            		}
            		}
            		if ( n_shaded_count != 2 ) {
            			
            			console.log( "Check shaded neighbours:" , row, col , "n_shaded_count" , n_shaded_count);
        				solved = 0;
            			break;

            		}

				}

			// this cell is number.
    		} else if ( this.board_arr[i] > 0 ) {
    			let n_shaded_needed = this.board_arr[i];
    			let n_shaded_count = 0;

    			for ( let n = 0 ; n < neighbour_coords.length ; n++ ) {
    				// Need to have exactly 2 shaded neighbours.
    				let ncol = neighbour_coords[n][0] + col;
            		let nrow = neighbour_coords[n][1] + row;
            		
            		if ( ncol >= 0 && nrow >= 0 && ncol < 11 && nrow < 11 ) {
            			let n_i = nrow * 11 + ncol;
            			if ( this.board_arr[n_i] == 0 ) {
            				let n_piece = this.pieces_arr[n_i];
            				if ( n_piece.shaded == 1 ) {
            					n_shaded_count += 1;
            				} 
            			}
            		}
        		}

        		if ( n_shaded_count != n_shaded_needed ) {
        			
        			console.log( "Check numbered cell:" , row, col , "n_shaded_needed", n_shaded_needed , "n_shaded_count" , n_shaded_count);
        			solved = 0;
        			break;
        		}

    		}
    	}	



    	if ( shaded_count > 0 && solved == 1 ) {

    		this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
        	this.mygame.completed_level( 22 );
            
        }
            
    }


    //----
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