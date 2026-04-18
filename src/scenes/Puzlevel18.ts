

import * as THREE from 'three';

export class PuzLevel18 {
    
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
        this.root   = root;
        
        let board = mygame.cloneInstance( mygame.models["cube"].scene );
        board.scale.set( 5, 5, 0.1 );
        root.add( board );
        this.board = board;
        
        let board_face = mygame.create_item_plane( mygame.materials["rippleeffectboard"], 0,0, 0.55  ,1,1    ,1,1,0,0 );
        board.item_id = "board";
        board.add( board_face );

        let instruction = mygame.create_item_plane( mygame.materials["rippleeffectinstruction"], -4.5, 0, 0.06,  3, 4 , 1, 1, 0, 0 )
        root.add( instruction );

        this.init_pieces();

        let selector = mygame.cloneInstance( mygame.models["cubeframe"].scene );
        selector.item_id = 0;
        selector.position.set( this.pieces_arr[ selector.item_id ].position.x, this.pieces_arr[ selector.item_id  ].position.y, 0.1);
        selector.scale.set( 0.7 , 0.7 , 0.2 );
        this.selector = selector;
        this.root.add( selector );
        
        
    }

    //---------
    init_pieces() {

        // Static board arr that says which cell is placable, which is not.
        this.placable_arr = [
            4,0,0,0,0,2,0,0,
            0,2,0,7,0,5,0,0,
            0,0,0,0,0,3,0,0,
            0,0,0,1,0,0,0,0,
            0,0,0,0,3,0,0,0,
            0,0,4,0,0,0,0,0,
            0,0,5,0,1,0,2,0,
            0,0,1,0,0,0,0,2
        ];

        this.group_arr = [
            1, 1, 2, 2, 3, 3, 3, 4,
            5, 1, 2, 2, 2, 4, 4, 4,
            1, 1, 6, 6, 2, 2, 4, 7,
            8, 8, 8, 9, 9,10,10,11,
           12,13, 8, 9, 9,10,10,11,
           12,14,14,14,15,16,10,17,
           12,18,14,14,15,15,15,17,
           19,20,20,20,20,15,17,17
        ]

        this.answer_arr = [
            4,1,2,5,1,2,3,4,
            1,2,6,7,4,5,1,3,
            5,3,1,2,1,3,2,1,
            1,4,3,1,2,1,4,2,
            3,1,2,4,3,2,5,1,
            1,2,4,1,5,1,3,4,
            2,1,5,3,1,4,2,3,
            1,3,1,2,4,3,1,2
        ];

        let size = 0.7;
        let gap  = 0.1;

        // board
        for ( let i = 0 ; i < this.placable_arr.length ; i++ ) {
            if ( this.placable_arr[i] != 0 ) {
                let item_val = this.placable_arr[i];
                let tile_x = i % 8;
                let tile_y = ( i / 8 ) >> 0;
                let size = 0.1;
                let x = tile_x * 1/8 - 0.5 + 1/16;
                let y = tile_y * 1/8 - 0.5 + 1/16;
                let number_face = this.mygame.create_item_plane( this.mygame.materials["numbers100_b"], x,y, 0.6  ,size,size    ,10,10, 0 , item_val );
                number_face.renderOrder = 1;
                number_face.item_val = item_val;
                this.board.add( number_face );
            }
        }


        // Number selection panel
        for ( let i = 0 ; i < 9 ; i++ ) {
            
            let x =  ( i % 2 )        * (size + gap) + 4.0;
            let y = (( i / 2 ) >> 0 ) * -(size + gap) + 1.5;
            let button = this.mygame.cloneInstance( this.mygame.models["cube2"].scene );
            button.position.set( x, y , 0.1 );
            button.scale.set( size , size , 0.2 );
            button.item_id = i;
            button.item_val = i+1;

            this.root.add( button );
            this.pieces_arr.push( button );
            let button_face = this.mygame.create_item_plane( this.mygame.materials["numbers100"], 0,0, 0.6  ,0.6,0.6    ,10,10, 0 , i+1 );
            button.add( button_face );
        } 
    }

    //---
    check_winning() {
        //16631
        let solved = 1;

        for ( let i = 0 ; i < this.placable_arr.length ; i++ ) {
            if ( this.placable_arr[i] == 0 ) {
                let piece = this.board_arr[i];
                if ( piece == null || piece.item_val != this.answer_arr[i] ) {
                    solved = 0;
                    break;
                } 
            }
        }

        if ( solved == 1 ) {
            
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 18 );
            
        }
    }

    //----------
    check_single_cell( tile_x , tile_y, item_val ) {

        console.log( "check_single_cell", tile_x , tile_y );

        // check column
        for ( let i = 0 ; i < 8 ; i++ ) {
            
            if ( i != tile_y ) {

                let i_item_val = this.placable_arr[ i * 8 + tile_x ];
                if ( this.board_arr[ i * 8 + tile_x ] != null ) {
                    i_item_val = this.board_arr[ i * 8 + tile_x ].item_val;
                }   
                if ( i_item_val == item_val ) {
                    if ( Math.abs( i - tile_y ) <= item_val ) {
                        // Cannot.
                        this.mygame.display_text_effect( "" + item_val + " needs to be seperated\n at least " + item_val + " cell(s) from other " + item_val + "s on column", 35);
                        return -1;
                    }
                }
                
            }
        }
        // check row.
        for ( let j = 0 ; j < 8 ; j++ ) {
            
            if ( j != tile_x ) {
                
                let j_item_val = this.placable_arr[ tile_y * 8 + j ];
                if ( this.board_arr[  tile_y * 8 + j ] != null ) {
                    j_item_val = this.board_arr[  tile_y * 8 + j ].item_val;
                }   
                if ( j_item_val == item_val ) {
                    if ( Math.abs( j - tile_x ) <= item_val ) {
                        // Cannot.
                        this.mygame.display_text_effect( "" + item_val + " needs to be seperated \nat least " + item_val + " cell(s) from other " + item_val + "s on row", 35);
                        return -1;
                    }
                }
                
            }
        }

        // check group
        let mygroup = this.group_arr[ tile_y * 8 + tile_x ];
        let group_has_n_cell = 0;

        for ( let i = 0 ; i < this.group_arr.length ; i++ ) {
            let group = this.group_arr[i];
            if ( group == mygroup &&  i != tile_y * 8 + tile_x ) {
                let i_item_val = this.placable_arr[i];
                if ( this.board_arr[i] != null ) {
                    i_item_val = this.board_arr[i].item_val;
                }    
                if ( i_item_val == item_val ) {
                    // Cannot.
                    this.mygame.display_text_effect( "Cannot have multiple " + item_val + "s in a group", 35);
                    return -1;
                }
            }
            if ( group == mygroup ) {
                group_has_n_cell += 1;
            }
        }

        // check 1-n
        if ( item_val > group_has_n_cell ) {
            if ( group_has_n_cell == 1 ) {
                this.mygame.display_text_effect( "This group has only 1 cell. You can only place 1 here",35);
            } else {
                this.mygame.display_text_effect( "This group has only " + group_has_n_cell + " cells. You can only place 1 - " + group_has_n_cell + " within the group.", 35);
            }
            return -1;
        }

        return 0;

    }

    //---
    board_onclick( hitPoint ) {
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.125 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.125 );
        //console.log( tile_x , tile_y );

        if ( tile_x < 0 || tile_x >= 8 || tile_y < 0 || tile_y >= 8 ) {
            this.mygame.snds["denied"].play();
            return ;
        }


        if ( this.placable_arr[tile_y * 8 + tile_x ] == 0) {
            
            if ( this.board_arr[ tile_y * 8 + tile_x ] == null ) {
                // putting number
                if ( this.selector.item_id != null ) {
                    
                    let item_val = this.pieces_arr[ this.selector.item_id ].item_val;
                    
                    let check_clash_ret = this.check_single_cell( tile_x, tile_y, item_val );
                    if ( check_clash_ret != 0 ) {

                        this.mygame.snds["denied"].play();
                        
                    } else {

                        this.mygame.snds["arrowhit"].play();
                        let size = 0.1;
                        let x = tile_x * 1/8 - 0.5 + 1/16;
                        let y = tile_y * 1/8 - 0.5 + 1/16;
                        let number_face = this.mygame.create_item_plane( this.mygame.materials["numbers100"], x,y, 0.6  ,size,size    ,10,10, 0 , item_val );
                        number_face.renderOrder = 1;
                        number_face.item_val = item_val;
                        this.board.add( number_face );
                        this.board_arr[ tile_y * 8 + tile_x ] = number_face;
                        this.check_winning();
                    }
                    
                
                    
                } else {
                    this.mygame.display_text_effect("Select a number", 40);
                    this.mygame.snds["denied"].play();
                }
            } else {
                // removing number
                let number_face = this.board_arr[tile_y * 8 + tile_x ];
                this.board.remove( number_face );
                this.board_arr[tile_y * 8 + tile_x ] = null;
                this.mygame.snds["plop"].play();
            }   
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
                if ( hit.object.parent.item_id && hit.object.parent.item_id == "board" ) {
                    break;
                } else if ( hit.object.item_id && hit.object.item_id == "board" ) {
                    break;
                }
            }

            let item_id = hit.object.parent.item_id;
            if ( item_id == null ) {
                item_id = hit.object.parent.parent.item_id;
            }

            if ( item_id != null ) {
                if ( item_id == "board" ) {
                    const localPoint = hit.object.parent.worldToLocal(hit.point.clone());
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