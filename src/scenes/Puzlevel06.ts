

import * as THREE from 'three';

export class PuzLevel06 {
    
    setting_active_range = 18;
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
        board.scale.set( 6.8, 6.8 , 0.2 );
        board.position.set( 2.1 , 0 , 0);
        board.children[0].material = mygame.materials["darkgrey"];
        root.add( board );

        let instruction = mygame.create_item_plane( mygame.materials["knightsmove"], -3.0 ,0,0, 6,6, 1, 1, 0, 0 )
        root.add( instruction );
        
        let resetbutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        resetbutton.position.set(  -4, -1.75, 0.1);
        resetbutton.scale.set( 2.5, 0.75, 0.2);
        let resetbutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"], -0.05, 0, 0.6  , 0.6, 1    ,8,4,1,0 );
        resetbutton.add( resetbutton_face );
        resetbutton.children[0].children[0].material = mygame.materials["blue"];
        resetbutton.button_id = "reset";
        this.resetbutton = resetbutton;
        root.add( resetbutton );
        
        
        this.init_pieces();
        let size = 0.7;
        let gap  = 0.1;
        for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
			
			let piece = this.pieces_arr[i];
            let sx =  piece.tilesize.x * size;
            let sy =  piece.tilesize.y * size;
			piece.scale.set( sx,sy, 0.2 );
            
			let x  =  (piece.tile.x + piece.scale.x * 0.5 ) * (size+gap) - 1.0 ;
			let y  =  (piece.tile.y + piece.scale.y * 0.5 ) * (size+gap) - 3.0;
			
            piece.position.set( x,y, 0.1 );
            piece.item_id = i;
            root.add( piece );
		}	
        this.root   = root;
        this.reset_board();
    }



    //---------
    reset_board() {
        var i;
        this.lastmove = null;
		for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
            let piece = this.pieces_arr[i];
            piece.children[0].children[0].material = this.mygame.materials["white"];
            piece.state = 1;
            this.root.add( piece );
        }
    }


    //------------------
    init_pieces() {

        let mygame = this.mygame;

        for ( let i = 0 ; i < 64 ; i++ ) {
            let piece = mygame.cloneInstance( mygame.models["cube2"].scene );
            piece.tile     = new THREE.Vector2( i % 8, Math.floor(i / 8) );
            piece.tilesize = new THREE.Vector2(1,1);
            piece.state = 1;
            this.pieces_arr.push( piece );
        } 
	}


    //--------------------------------
    button_onclick( id  ) {
        
        //console.log( "button_onclick", id );
        
        if ( id == "reset" ) {
            this.reset_board();
        }   
        this.mygame.snds["tok1"].play();
        
    }

    
    //-----------
    piece_onclick( item_id ) {
		
        //console.log( item_id );
		let piece = this.pieces_arr[ item_id ];
        
        let invalid = 0;
        if ( piece.state != 1 ) {
            return ;
        }

        if ( this.lastmove != null ) {
            let last_x = this.lastmove % 8;
            let last_y = ( this.lastmove / 8 ) >> 0 ;
            let cur_x  = item_id % 8;
            let cur_y  = ( item_id / 8 ) >> 0 ;

            if ( Math.abs( last_x - cur_x ) == 2  && Math.abs( last_y - cur_y ) == 1 ) {

            } else if ( Math.abs( last_y - cur_y ) == 2  && Math.abs( last_x - cur_x ) == 1 ) {
                
            } else {
                invalid = 1;
            }
        }
        
        if ( invalid == 0 ) {
            
            piece.state = null;
            
            let curpiece =  this.pieces_arr[ item_id ]
            if ( this.lastmove != null ) {
                let prevpiece = this.pieces_arr[ this.lastmove ];
                this.root.remove( prevpiece );
            }
            curpiece.children[0].children[0].material = this.mygame.materials["orange"];

            
            this.mygame.snds["tick"].play();
            this.lastmove = item_id;
            this.check_winning();
        } else {
            this.mygame.display_text_effect("Invalid Move. Please use Knight's Move only.",  40 );
            this.mygame.snds["denied"].play();
        }
        
	}

    //--------------
	check_winning() {

		let i;
		let win = 1;
		for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
			let piece = this.pieces_arr[i];
            if ( piece.state == 1 ) {
                win = 0;
				break;
			}
		} 
		if ( win == 1  ) {
			this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.mygame.display_text_effect("Well Done!", 50);
            this.solved = 1
            this.mygame.completed_level( 6 );
            
            this.root.remove( this.resetbutton );

            
		}
    }

    //---
    onPointerDown( pointer ) {

        //console.log( this.constructor.name, "onPointerDown" );

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
            let clickedObject = hit.object.parent.parent;
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