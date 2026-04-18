

import * as THREE from 'three';

export class PuzLevel03 {

    pieces_arr = [];
    
    setting_active_range = 16;

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
        board.scale.set( 5.5, 5.5 , 0.1 );
        board.children[0].material = mygame.materials["darkgrey2"];
        board.item_id = -1;
        root.add( board );

        


        this.init_pieces();

        for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
			
			let piece = this.pieces_arr[i];
            let sx =  piece.tilesize.x * 0.9;
            let sy =  piece.tilesize.y * 0.9;
			piece.scale.set( sx,sy, 0.4 );
            
			let x  =  (piece.tile.x + piece.scale.x * 0.5 )  - 2.5;
			let y  =  (piece.tile.y + piece.scale.y * 0.5 )  - 2.5;
			
            piece.position.set( x,y, 0.1 );
            piece.item_id = i;
            root.add( piece );
		}	
        this.root   = root;
    }


    //------
    check_winning( ) {

        for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
            let piece = this.pieces_arr[i];
            let supposed_tag = ( 4 - piece.tile.y ) * 5 + piece.tile.x;
            if ( supposed_tag != piece.tag  ) {
                
                return 0;
            }
        }
        return 1;
    }

    //------
    scramble( pos_arr , cur_hole ) {
        
        let hole_x = cur_hole % 5;
        let hole_y = Math.floor( cur_hole / 5 );
        let mov = 0;
        let rnd = Math.floor( Math.random() * 2 );
        let new_hole = cur_hole ;

        if ( rnd == 0 ) {
            if ( hole_x > 0 && hole_x < 4 ) {
                rnd = Math.floor( Math.random() * 3 );
                if ( rnd == 1 ) {
                    mov = 1;
                } else if ( rnd == 2 ) {
                    mov = -1;
                }
            } else if ( hole_x == 0 ) { 
                rnd = Math.floor( Math.random() * 2 );
                if ( rnd == 1 ) {
                    mov = 1;
                }
            } else if ( hole_x == 4 ) {
                rnd = Math.floor( Math.random() * 2 );
                if ( rnd == 1 ) {
                    mov = -1;
                }
            }
        } else {
            if ( hole_y > 0 && hole_y < 4 ) {
                rnd = Math.floor( Math.random() * 3 );
                if ( rnd == 1 ) {
                    mov = 5;
                } else if ( rnd == 2 ) {
                    mov = -5;
                }
            } else if ( hole_y == 0 ) { 
                rnd = Math.floor( Math.random() * 2 );
                if ( rnd == 1 ) {
                    mov = 5;
                }
            } else if ( hole_y == 4 ) {
                rnd = Math.floor( Math.random() * 2 );
                if ( rnd == 1 ) {
                    mov = -5;
                }
            }
        }
        if ( mov != 0 ) {
            new_hole = cur_hole + mov;
            let tmp = pos_arr[ cur_hole ];
            pos_arr[cur_hole ] = pos_arr[ new_hole ];
            pos_arr[ new_hole ] = tmp;
        }
        return new_hole;
    }


    //----------------
	init_pieces() {

        let mygame = this.mygame;

        
        let start_position = [
			20,21,22,23,23,
            15,16,17,18,19,
			10,11,12,13,14,
			5,6,7,8,9,
			0,1,2,3,4,
		]
        let hole = 4;

        for ( let i = 0 ; i < 300 ; i++ ) {
            hole = this.scramble( start_position, hole );
        }

        let uv_max_x = 0.50;
        let uv_min_x = 0.25;
        let uv_min_y = 0.75;
        let uv_max_y = 1.00;
        let uv_range_x = ( uv_max_x - uv_min_x ) 
        let uv_range_y = ( uv_max_y - uv_min_y ) ;
        let uv_slice_w = uv_range_x / 5;
        let uv_slice_h = uv_range_y / 5;
        
		for ( let i = 0 ; i < start_position.length ; i++ ) {
            if ( i != hole ) {
                
                let r =    Math.floor( i / 5) ;
                let c =    i % 5;
                
                let piece = mygame.cloneInstance( mygame.models["cube2"].scene );
                piece.tile     = new THREE.Vector2(c,r);
                piece.tilesize = new THREE.Vector2(1,1);
                piece.tag = start_position[ i ];
                piece.children[0].children[0].material = mygame.materials["poap"];

                let uv_r =    Math.floor( piece.tag / 5) ;
                let uv_c =    piece.tag % 5;
                let uv_x0 = ( uv_c / 5) * uv_range_x + uv_min_x;
                let uv_x1 = uv_x0 + uv_slice_w;
                let uv_y0 = ( uv_r / 5) * uv_range_y + uv_min_y;
                let uv_y1 = uv_y0 + uv_slice_h;

                piece.children[0].children[0].geometry = piece.children[0].children[0].geometry.clone();
                piece.children[0].children[0].geometry.attributes.uv.setXY(0, uv_x1,  uv_y1);
                piece.children[0].children[0].geometry.attributes.uv.setXY(1, uv_x1,  uv_y0);
                piece.children[0].children[0].geometry.attributes.uv.setXY(2, uv_x0,  uv_y1);
                piece.children[0].children[0].geometry.attributes.uv.setXY(3, uv_x0,  uv_y0);
                
                
                this.pieces_arr.push( piece );
                
            }

			
		}
             
	}



    //----------------------
    get_movable_direction() {

    	let ret = 0;

    	if ( this.selected_item_id != null ) {

            let i,j,k;
    		let piece = this.pieces_arr[ this.selected_item_id ];

    		let up = 1;
    		let down = 1;
    		let left = 1;
    		let right = 1;
            
    		if ( piece.tile.y + piece.tilesize.y == 5 ) {
    			up = 0;
    			//log( "Blocked by top frame");
    		} 
    		if ( piece.tile.y == 0 ) {
    			down = 0;
    			//log( "Blocked by bottom frame");    			
    		}
    		if ( piece.tile.x == 0 ) {
    			left = 0;
    			//log( "Blocked by left frame");    			
    		}
    		if ( piece.tile.x + piece.tilesize.x == 5 ) {
    			right = 0;
    			//log( "Blocked by right frame");    			
    		} 


			for ( k = 0 ; k < this.pieces_arr.length ; k++ ) {
				if ( k != this.selected_item_id ) {
					let piece_k = this.pieces_arr[k];
					
					let a_p1 = piece.tile.x;
					let a_p2 = piece.tile.x + piece.tilesize.x;
					let b_p1 = piece_k.tile.x;
					let b_p2 = piece_k.tile.x + piece_k.tilesize.x;

					if ( piece.tile.y + piece.tilesize.y == piece_k.tile.y  && 
						( 
						  ( b_p2 > a_p1  && b_p2 <= a_p2 )  ||
						  ( a_p2 > b_p1  && a_p2 <= b_p2 ) 
						)  
						
					) {
						//log("up tio block", k );
						up = 0;
					}

					if ( piece_k.tile.y + piece_k.tilesize.y == piece.tile.y  && 
						( 
						  ( b_p2 > a_p1  && b_p2 <= a_p2 )  ||
						  ( a_p2 > b_p1  && a_p2 <= b_p2 ) 
						)  
					) {
						//log("down tio block", k );
						down = 0;
					}

					
					a_p1 = piece.tile.y;
					a_p2 = piece.tile.y + piece.tilesize.y;
					b_p1 = piece_k.tile.y;
					b_p2 = piece_k.tile.y + piece_k.tilesize.y;
					

					if ( piece_k.tile.x + piece_k.tilesize.x == piece.tile.x  && 
						( 
						  ( b_p2 > a_p1  && b_p2 <= a_p2 )  ||
						  ( a_p2 > b_p1  && a_p2 <= b_p2 ) 
						) 
						
					) {
						//log("left tio block", k );
						left = 0;
					}

					if ( piece_k.tile.x  == piece.tile.x + piece.tilesize.x && 
						( 
						  ( b_p2 > a_p1  && b_p2 <= a_p2 )  ||
						  ( a_p2 > b_p1  && a_p2 <= b_p2 ) 
						) 
					) {
						//log("right tio block", k );
						right = 0;
					}					
				}

			}

    		ret = (left << 0 ) | ( up << 1 ) | (right << 2) | ( down <<3 );

    	}
    	return ret ;
    }

    //---------
    move_piece( hitPoint ) {

        if ( this.selected_item_id != null ) {

            let movable_direction = this.get_movable_direction();
            let piece =  this.pieces_arr[ this.selected_item_id ];
            let moved = 0;

            // If can move both horizontally and vertically, can only pick one based on movement size
            if ( ( movable_direction & 0x02) == 0x02  ) {
                    
                piece.tile.y += 1;
                moved = 1;

            
            } else if ( ( movable_direction & 0x08) == 0x08 ) {
                
                piece.tile.y -= 1;
                moved = 1;

            } else if ( ( movable_direction & 0x01) == 0x01 ) {
                piece.tile.x -= 1;
                moved = 1;
            
            } else if ( ( movable_direction & 0x04) == 0x04 ) {
                piece.tile.x += 1;
                moved = 1;
            }
            
            
            if ( moved == 1 ) {

                let x  =  (piece.tile.x + piece.scale.x * 0.5 )  - 2.5;
                let y  =  (piece.tile.y + piece.scale.y * 0.5 )  - 2.5;
                piece.position.x = x ;
                piece.position.y = y ;
                this.mygame.snds["tok1"].play();
                if ( this.check_winning() == 1 ) {
           
                    this.mygame.display_text_effect("Well Done!", 60);
                    this.mygame.snds["success"].play();
                    this.mygame.snds["applause"].play();
                    this.solved = 1;
                    this.mygame.completed_level( 3 );
            
                }

                
            } else {
                //console.log( this.print_binary( movable_direction ) , suppress_x, suppress_y, use_x, use_y );
                this.mygame.snds["denied"].play();
            }
        }
    }

    //----------
    print_binary( num ) {

		return Number( num.toString(2) ); 
	}

    //-----
    onPointerDown( pointer ) {

        let mouse = new THREE.Vector2(0,0);
        if ( this.mygame.input.mouse.locked == false ) {
            mouse.x =  ( pointer.x / this.mygame.sys.game.scale.width ) * 2 - 1;
            mouse.y = -( pointer.y / this.mygame.sys.game.scale.height ) * 2 + 1;

            //console.log( "pointer", pointer.x, pointer.y , "mouse",mouse.x , mouse.y );
        }
        let raycaster = this.mygame.raycaster;
        raycaster.setFromCamera(mouse, this.mygame.threejs_camera );

        const intersects = raycaster.intersectObjects( this.root.children );

        if ( intersects.length > 0 ) {

             if ( this.solved == 1 ) {
                this.mygame.display_text_effect("This game has been completed.", 40);
                return;
            }

            let hit = intersects[0];
            let clickedObject = hit.object.parent.parent;
            if ( clickedObject.item_id == null ) {
                clickedObject = hit.object.parent;
            }
            
            let item_id = clickedObject.item_id;
            
            if ( item_id != null ) {

                if ( item_id >= 0 ) {
                    this.mygame.snds["tok0"].play();
                    this.selected_item_id = item_id;
                    this.move_piece( );
                } 
            }
            return 0;
        } 
        return null;

    }
}