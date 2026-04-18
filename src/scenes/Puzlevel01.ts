

import * as THREE from 'three';

export class PuzLevel01 {

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
        board.scale.set( 4.5, 5.5 , 0.1 );
        board.children[0].material = mygame.materials["darkgrey"];
        board.item_id = -1;
        root.add( board );

        let obj = mygame.cloneInstance( mygame.models["cube"].scene );
        obj.position.set( 0, -2.65, 0.1);
        obj.scale.set( 2, 0.2, 0.4 );
        obj.children[0].material = mygame.materials["yellow"];
        root.add( obj );


        this.init_pieces();

        for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
			
			let piece = this.pieces_arr[i];
            let sx =  piece.tilesize.x * 0.9;
            let sy =  piece.tilesize.y * 0.9;
			piece.scale.set( sx,sy, 0.4 );
            
			let x  =  (piece.tile.x + piece.scale.x * 0.5 )  - 2;
			let y  =  (piece.tile.y + piece.scale.y * 0.5 )  - 2.5;
			
            piece.position.set( x,y, 0.1 );
            piece.item_id = i;

            if ( piece.tilesize.x == 2 && piece.tilesize.y == 2 ) {
                piece.children[0].children[0].material = mygame.materials["poap"];
                piece.children[0].children[0].geometry.attributes.uv.setXY(0, 1.00,  1.00);
                piece.children[0].children[0].geometry.attributes.uv.setXY(1, 1.00,  0.75);
                piece.children[0].children[0].geometry.attributes.uv.setXY(2, 0.75,  1.00);
                piece.children[0].children[0].geometry.attributes.uv.setXY(3, 0.75,  0.75);
                
            }
            root.add( piece );
		}	
        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.position.set( 0,0, 0.1);
        selector.scale.set( 1,1, 0.4 );
        
        this.selector = selector;
        this.root   = root;
    }



    //----------------
	init_pieces() {

        let mygame = this.mygame;
        let obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile     = new THREE.Vector2(0,0);
        obj.tilesize = new THREE.Vector2(1,1);
        this.pieces_arr.push( obj );

        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile     = new THREE.Vector2(1,1);
        obj.tilesize = new THREE.Vector2(1,1);
        this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(2,1);
        obj.tilesize = new THREE.Vector2(1,1);
        this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(3,0);
        obj.tilesize = new THREE.Vector2(1,1);
        this.pieces_arr.push( obj );
        

        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(0,1);
        obj.tilesize = new THREE.Vector2(1,2);
		this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(0,3);
        obj.tilesize = new THREE.Vector2(1,2);
		this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(3,1);
        obj.tilesize = new THREE.Vector2(1,2);
		this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(3,3);
        obj.tilesize = new THREE.Vector2(1,2);
		this.pieces_arr.push( obj );

        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(1,2);
        obj.tilesize = new THREE.Vector2(2,1);
		this.pieces_arr.push( obj );
        
        obj = mygame.cloneInstance( mygame.models["cube2"].scene );
        obj.tile = new THREE.Vector2(1,3);
        obj.tilesize = new THREE.Vector2(2,2);
		this.pieces_arr.push( obj );        
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
    		if ( piece.tile.x + piece.tilesize.x == 4 ) {
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


    
    //------
    move_done( piece ) {
        
        let x  =  (piece.tile.x + piece.scale.x * 0.5 )  - 2;
        let y  =  (piece.tile.y + piece.scale.y * 0.5 )  - 2.5;
        piece.position.x = x ;
        piece.position.y = y ;
        this.selector.position.copy( piece.position );

        if ( piece.tilesize.x == 2 && piece.tilesize.y == 2 && piece.tile.x == 1 && piece.tile.y == 0) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 1 );
            
        }
        
        this.mygame.snds["tok1"].play();
    }


    //---------
    move_piece( hitPoint ) {

        if ( this.selected_item_id != null ) {
            let suppress_x = 0;
            let suppress_y = 0;
            let moved 		= 0;

            let use_x = hitPoint.x - this.selector.position.x;
            let use_y = hitPoint.y - this.selector.position.y;
            let movable_direction = this.get_movable_direction();
            let piece =  this.pieces_arr[ this.selected_item_id ];

            // If can move both horizontally and vertically, can only pick one based on movement size
            if ( ( movable_direction & 0x0a) &&   ( movable_direction & 0x05) ) {

                let xmovesize = Math.abs( use_x );
                let ymovesize = Math.abs( use_y );
                
                if ( ymovesize > xmovesize ) {
                    suppress_x = 1;
                } else {
                    suppress_y = 1;
                }

            }

            if ( suppress_y == 0 ) {

                if ( ( movable_direction & 0x02) == 0x02  && 
                    ( use_y > 0 ) ) {
                        
                    piece.tile.y += 1;
                    moved = 1;

                
                } else if ( ( movable_direction & 0x08) == 0x08  && 	
                        ( use_y < 0 )) {
                    
                    piece.tile.y -= 1;
                    moved = 1;
                }
            }

            if ( suppress_x == 0 ) {
                

                if ( ( movable_direction & 0x01) == 0x01  && 	
                        ( use_x < 0 )) {
                    piece.tile.x -= 1;
                    moved = 1;
                

                } else if ( ( movable_direction & 0x04) == 0x04  && 	
                        ( use_x > 0 )) {
                    piece.tile.x += 1;
                    moved = 1;
                }

            }
            
            if ( moved == 1 ) {
                this.move_done(piece);
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
                    this.selector.scale.copy( clickedObject.scale )
                    this.selector.position.copy( clickedObject.position );
                    this.selected_item_id = item_id;
                    this.root.add( this.selector );
                    this.mygame.snds["buttonclick"].play();
                                    
                } else {

                    const localPoint = hit.object.parent.parent.worldToLocal(hit.point.clone());
                    this.move_piece( localPoint );
                    
                }
            }
            return 0;
        } 
        return null;

    }
}