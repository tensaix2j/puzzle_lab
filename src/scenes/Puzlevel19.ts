

import * as THREE from 'three';

export class PuzLevel19 {
    
    setting_active_range = 16;
    answer_arr = [];
    pieces_arr = [];
    board_arr  = [];



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
        board.children[0].material = mygame.materials["darkgrey"];
        board.scale.set( 5,5, 0.1 );
        root.add( board );
        this.board = board;

        let board_face = mygame.create_item_plane( mygame.materials["flatrubikboard"], 0,0, 0.55  , 0.9 ,0.9    ,1,1,0,0 );
        board.add( board_face );

        let instruction = mygame.create_item_plane( mygame.materials["flatrubikinstruction"], 5.0, 0, 0.06,  5.12, 2 , 1, 1, 0, 0 )
        root.add( instruction );

        this.init_pieces();
    }


    //---
    onKeyDown( key ) {

        if ( this.solved == 1 ) {
            this.mygame.display_text_effect("This game has been completed.", 40);
            return -1;
        }

        switch (key) {
            case 'r':
            case 'R':
                this.rotate_pieces(0,4);
                break;
            case 'f':
            case 'F':
                this.rotate_pieces(1,4);
                break;
            case 't':
            case 'T':
                this.rotate_pieces(0,2);
                break;
            case 'g':
            case 'G':
                this.rotate_pieces(1,2);
                break;
            case 'y':
            case 'Y':
                this.rotate_pieces(0,3);
                break;
            case 'h':
            case 'H':
                this.rotate_pieces(1,3);
                break;
            case 'u':
            case 'U':
                this.rotate_pieces(0,5);
                break;
            case 'j':
            case 'J':
                this.rotate_pieces(1,5);
                break;
            case 'i':
            case 'I':
                this.rotate_pieces(0,0);
                break;
            case 'k':
            case 'K':
                this.rotate_pieces(1,0);
                break;
            case 'o':
            case 'O':
                this.rotate_pieces(0,1);
                break;
            case 'l':
            case 'L':
                this.rotate_pieces(1,1);
                break;
        }
        
        this.mygame.snds["tick"].play();
        this.update_pieces();
        this.check_winning();
    }

    //--
    onKeyUp( key ) {

    }
    

    //--
    check_answer_matched() {
        let match = 1;
        for ( let i = 0 ; i < this.board_arr.length ; i++ ) {
            let item_val = this.board_arr[i];
            if ( item_val != this.answer_arr[i] ) {
                match = 0;
                break;
            }
        }
        return match;
    }

    //----
    check_winning() {
        let match = this.check_answer_matched();
        if ( match == 1 ) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 19 );
            
        }
    }



    //-------
    update_pieces() {
        for ( let i = 0 ; i < this.board_arr.length ; i++ ) {
            let piece       = this.pieces_arr[i];
            let item_val    = this.board_arr[i];
            let frame_y = (item_val / 4 ) >> 0;
            let frame_x = item_val % 4;
            this.mygame.setUV( piece.geometry.attributes.uv, 4,4, frame_y ,frame_x );
        }
    }

    //-----
    rotate_pieces( direction , center_index ) {

        if ( direction == 0 ) {
            if ( center_index == 0 ) {
                    
                let tmp = this.board_arr[0];
                this.board_arr[0] = this.board_arr[4];
                this.board_arr[4] = this.board_arr[6];
                this.board_arr[6] = this.board_arr[2];
                this.board_arr[2] = tmp;
            
            } else if ( center_index == 1 ) {

                let tmp = this.board_arr[1];
                this.board_arr[1] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[3];
                this.board_arr[3] = tmp;

            } else if ( center_index == 2 ) {

                let tmp = this.board_arr[0];
                this.board_arr[0] = this.board_arr[1];
                this.board_arr[1] = this.board_arr[3];
                this.board_arr[3] = this.board_arr[2];
                this.board_arr[2] = tmp;   

            } else if ( center_index == 3 ) {

                let tmp = this.board_arr[0];
                this.board_arr[0] = this.board_arr[1];
                this.board_arr[1] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[4];
                this.board_arr[4] = tmp;     
                
            
            } else if ( center_index == 4 ) {

                let tmp = this.board_arr[2];
                this.board_arr[2] = this.board_arr[3];
                this.board_arr[3] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[6];
                this.board_arr[6] = tmp;        
            

            } else if ( center_index == 5 ) {

                let tmp = this.board_arr[4];
                this.board_arr[4] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[6];
                this.board_arr[6] = tmp;     
            }
            
        } else if ( direction == 1 ) {

            if ( center_index == 0 ) {

                let tmp = this.board_arr[2];
                this.board_arr[2] = this.board_arr[6];
                this.board_arr[6] = this.board_arr[4];
                this.board_arr[4] = this.board_arr[0];
                this.board_arr[0] = tmp;
            
            } else if ( center_index == 1 ) {

                let tmp = this.board_arr[3];
                this.board_arr[3] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[1];
                this.board_arr[1] = tmp;

            } else if ( center_index == 2 ) {

                let tmp = this.board_arr[2];
                this.board_arr[2] = this.board_arr[3];
                this.board_arr[3] = this.board_arr[1];
                this.board_arr[1] = this.board_arr[0];
                this.board_arr[0] = tmp;    

            } else if ( center_index == 3 ) {

                let tmp = this.board_arr[4];
                this.board_arr[4] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[1];
                this.board_arr[1] = this.board_arr[0];
                this.board_arr[0] = tmp;     
                
            
            } else if ( center_index == 4 ) {

                let tmp = this.board_arr[6];
                this.board_arr[6] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[3];
                this.board_arr[3] = this.board_arr[2];
                this.board_arr[2] = tmp;        
            

            } else if ( center_index == 5 ) {

                let tmp = this.board_arr[6];
                this.board_arr[6] = this.board_arr[7];
                this.board_arr[7] = this.board_arr[5];
                this.board_arr[5] = this.board_arr[4];
                this.board_arr[4] = tmp;     
            }
        }
    } 
      


    //----
    init_pieces() {
        
        let xs = [ -0.65,  0.8, -1.95, -0.65 ,  0.8, 1.92, -0.65,  0.8 ];
        let ys = [  1.4 , 1.4,  0.00,  0.00, 0.00, 0.00, -1.4, -1.4 ];
        let vals = [ 0,1,2,3,6, 9 ,4,10  ];

        let size = 0.45;

        for ( let i = 0 ; i < xs.length ; i++ ) {

            let x = xs[i];
            let y = ys[i];
            let item_val = vals[i];
            let frame_y = (item_val / 4 ) >> 0;
            let frame_x = item_val % 4;
            
            let number_face = this.mygame.create_item_plane( this.mygame.materials["symbols"], x,y, 0.06  ,size,size    ,4,4, frame_y , frame_x);
            number_face.renderOrder = 1;
            this.root.add( number_face );

            let answer_face = this.mygame.create_item_plane( this.mygame.materials["symbols_r"], x,y + 0.5, 0.06  ,size * 0.9,size *0.9    ,4,4, frame_y , frame_x);
            answer_face.renderOrder = 1;
            this.root.add( answer_face );

            this.board_arr[i]  = item_val;
            this.pieces_arr[i] = number_face;
            this.answer_arr[i] = item_val;

        }
        
        // Scramble
        for ( let i = 0 ; i < 50 ; i++ ) {
           let rnd_direction       = Math.floor( Math.random() * 2 );
           let rnd_center_index    = Math.floor( Math.random() * 6 );
            this.rotate_pieces( rnd_direction, rnd_center_index );
        }

        // Incase the scramble accdental match, then we use a preset.
        let match = this.check_answer_matched();
        if ( match == 1 ) {
            this.rotate_pieces( 0, 0 );
            this.rotate_pieces( 0, 1 );
            this.rotate_pieces( 0, 1 );
            this.rotate_pieces( 0, 2 );
        }
        
        this.update_pieces();
        
    }

    //---
    onPointerDown( pointer ) {
        
    }
}