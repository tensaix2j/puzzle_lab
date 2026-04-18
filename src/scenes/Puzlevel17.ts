

import * as THREE from 'three';

export class PuzLevel17 {
    
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
        board.scale.set( 6,6, 0.1 );
        root.add( board );
        this.root   = root;
        this.board  = board;

        let board_face = mygame.create_item_plane( mygame.materials["kakuroboard"], 0,0, 0.55  ,1,1    ,1,1,0,0 );
        board.item_id = "board";
        board.add( board_face );
        
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
            0,0,0,1,1,0,0,0,0,0,1,1,1,1,0,
            0,0,0,1,1,1,0,0,0,1,1,1,1,1,0,
            0,1,1,0,0,1,1,1,1,1,0,0,1,1,0,
            0,1,1,1,1,0,1,1,1,0,0,0,1,1,0,
            0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,
            0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,
            0,1,1,0,0,0,1,1,1,0,0,0,1,1,1,
            0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,
            0,0,1,1,0,0,0,0,0,1,1,0,1,1,0,
            0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,
            0,0,1,1,0,0,0,1,1,1,0,1,1,1,1,
            0,0,1,1,0,0,1,1,1,1,1,0,0,1,1,
            0,0,1,1,1,1,1,0,0,0,1,1,1,0,0,
            0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
        ]
        this.h_sum = [
             0, 0,10, 1, 1, 0, 0, 0, 0,21, 1, 1, 1, 1, 0,
             0, 0,19, 1, 1, 1, 0, 0,18, 1, 1, 1, 1, 1, 0,
            12, 1, 1, 0,22, 1, 1, 1, 1, 1, 0,12, 1, 1, 0,
            22, 1, 1, 1, 1,12, 1, 1, 1, 0, 0, 9, 1, 1, 0,
             0, 0,14, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 5, 1, 1, 9, 1, 1, 0, 0, 0, 0, 7, 1, 1, 0,
             5, 1, 1, 0, 0,18, 1, 1, 1, 0, 0,11, 1, 1, 1,
            11, 1, 1, 1, 0, 0,19, 1, 1, 1, 0, 0, 9, 1, 1,
             0,10, 1, 1, 0, 0, 0, 0,13, 1, 1,16, 1, 1, 0,
             0, 0, 0, 0, 0, 0, 0, 0,19, 1, 1, 1, 1, 0, 0,
             0,11, 1, 1, 0, 0,13, 1, 1, 1,18, 1, 1, 1, 1,
             0, 6, 1, 1, 0,26, 1, 1, 1, 1, 1, 0,10, 1, 1,
             0,25, 1, 1, 1, 1, 1, 0, 0,10, 1, 1, 1, 0, 0,
             0,20, 1, 1, 1, 1, 0, 0, 0, 0, 4, 1, 1, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        this.v_sum = [
            0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0,
            0, 1, 1, 4,16, 1, 1, 1, 1, 1, 4,16, 1, 1, 0,
            0, 1, 1, 1, 1,16, 1, 1, 1, 4, 0, 0, 1, 1, 0,
            0,17, 4, 1, 1, 1, 1,17, 3, 0, 0, 0,10,29, 0,
            0, 0, 1, 1,16, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0,
            0, 1, 1, 7, 0, 4, 1, 1, 1, 0, 0, 0, 1, 1, 1,
            0, 1, 1, 1, 0, 0,16, 1, 1, 1, 0, 0, 3, 1, 1,
            0, 4, 1, 1, 0, 0, 0,16,17, 1, 1, 0, 1, 1, 3,
            0, 0,10,16, 0, 0, 0, 0, 0, 1, 1, 1, 1,30, 0,
            0, 0, 1, 1, 0, 0, 0, 1, 1, 1,16, 1, 1, 1, 1,
            0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 3,24, 1, 1,
            0, 0, 1, 1, 1, 1, 1,16, 4,16, 1, 1, 1, 3,16,
            0, 0, 1, 1, 1, 1, 3, 0, 0, 0,16, 1, 1, 0, 0,
            0, 0,29,11, 4,16, 0, 0, 0, 0, 0, 3, 4, 0, 0
        ]

        let size = 0.7;
        let gap  = 0.1;

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




    //----------
    // Not against 0
    check_single_cell( col, row , item_val ) {

        console.log("check_single_cell", col, row , item_val  );
        
        let h_filled = 1;
        let v_filled = 1;

        let h_fsum:number = 0;
        let v_fsum:number = 0;
        
        let h_sum:number = -1;
        let v_sum:number = -1;

        // Traverse col to the left until -1 
        for ( let j = col - 1 ; j >= 0 ; j-- ) {

            if ( this.placable_arr[ row * 15 + j ] == 0  ) {
                h_sum = this.h_sum[ row * 15 + j ];                
                break;
            }
            if ( this.board_arr[ row * 15 + j ] && this.board_arr[ row * 15 + j ].item_val == item_val  ) {
                return -1;
            }
            if ( this.board_arr[ row * 15 + j ] == null  ) {
                h_filled = 0;
            } 
            if ( this.board_arr[ row * 15 + j ] ) {
                h_fsum += this.board_arr[ row * 15 + j ].item_val;
            }
        }


        // Traverse col to the right until -1 
        for ( let j = col + 1 ; j < 15 ; j++ ) {
            
            
            if ( this.placable_arr[ row * 15 + j ] == 0  ) {
                break;
            }
            if ( this.board_arr[ row * 15 + j ] && this.board_arr[ row * 15 + j ].item_val == item_val  ) {
                return -1;
            }
            if ( this.board_arr[ row * 15 + j ] == null  ) {
                h_filled = 0;
                
            }
            if ( this.board_arr[ row * 15 + j ] ) {
                h_fsum += this.board_arr[ row * 15 + j ].item_val;
            }
        }

        if ( h_filled == 1 && h_sum != -1 ) {
            
            console.log( "You add up to", (h_fsum + item_val), "=", h_fsum, "+",item_val , " Supposed ans:" , h_sum);
            if ( h_fsum + item_val != h_sum ) {
                return -2;
            }
        } 
        


        // Traverse row to the bottom until -1 
        for ( let i = row - 1 ; i >= 0 ; i-- ) {

            if ( this.placable_arr[ i * 15 + col ] == 0  ) {
                break;
            }
            if ( this.board_arr[ i * 15 + col ] && this.board_arr[ i * 15 + col ].item_val == item_val  ) {
                return -1;
            }

            if ( this.board_arr[ i * 15 + col ] == null  ) {
                v_filled = 0;
            } 
            if ( this.board_arr[ i * 15 + col ] ) {
                v_fsum += this.board_arr[ i * 15 + col ].item_val;
            }
        }

        // Traverse row to the top until -1 
        for ( let i = row + 1 ; i < 15 ; i++ ) {

            if ( this.placable_arr[ i * 15 + col ] == 0  ) {
                v_sum = this.v_sum[ i * 15 + col ]; 
                break;
            }
            if ( this.board_arr[ i * 15 + col ] && this.board_arr[ i * 15 + col ].item_val == item_val  ) {
                return -1;
            }
            if ( this.board_arr[ i * 15 + col ] == null  ) {
                v_filled = 0;
            } 
            if ( this.board_arr[ i * 15 + col ] ) {
                v_fsum += this.board_arr[ i * 15 + col ].item_val;
            }
        }



        if ( v_filled == 1 && v_sum != -1 ) {
            
            console.log( "You add up to", (v_fsum + item_val), "=", v_fsum, "+",item_val , " Supposed ans:" , v_sum);

            if ( v_fsum + item_val != v_sum ) {
                
                return -3;
            }
        } 
        
        return 0;
    }


    //-----
    check_winning() {
        let done = 1;
        for ( let i = 0 ; i < this.placable_arr.length ; i++) {
            if ( this.placable_arr[i] == 1 && this.board_arr[i] == null ) {
                done = 0;
                break;
            }
        }
        if ( done == 1 ) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 17 );
            
        }
    }


    //----
    board_onclick( hitPoint ) {
        //console.log( "board_onclick", hitPoint );
        let tile_x = Math.floor( ( hitPoint.x + 0.5 ) / 0.06667 );
        let tile_y = Math.floor( ( hitPoint.y + 0.5 ) / 0.06667 );
        //console.log( tile_x , tile_y );

        if ( tile_x < 0 || tile_x >= 15 || tile_y < 0 || tile_y >= 15 ) {
            this.mygame.snds["denied"].play();
            return ;
        }
        
        if ( this.placable_arr[tile_y * 15 + tile_x ] == 1) {
            
            if ( this.board_arr[ tile_y * 15 + tile_x ] == null ) {
                // putting number
                if ( this.selector.item_id != null ) {
                    
                    let item_val = this.pieces_arr[ this.selector.item_id ].item_val;
                    
                    let check_clash_ret = this.check_single_cell( tile_x, tile_y, item_val );
                    if ( check_clash_ret != 0 ) {
                        
                        let msg = "Not allowed to use the same digit more than once to obtain a given sum."
                        if ( check_clash_ret == -2 ) {
                            msg = "Sum doesn't match (Horizontally)";
                        } else if ( check_clash_ret == -3 ) {
                            msg = "Sum doesn't match (Vertically)"
                        }

                        this.mygame.display_text_effect(msg , 40);
                        this.mygame.snds["denied"].play();
                        
                    } else {
                        
                        this.mygame.snds["arrowhit"].play();

                        let size = 0.05;
                        let x = tile_x * 1/15 - 0.5 + 1/30;
                        let y = tile_y * 1/15 - 0.5 + 1/30;
                        let number_face = this.mygame.create_item_plane( this.mygame.materials["numbers100"], x,y, 0.6  ,size,size    ,10,10, 0 , item_val );
                        number_face.renderOrder = 1;
                        number_face.item_val = item_val;
                        this.board.add( number_face );
                        this.board_arr[ tile_y * 15 + tile_x ] = number_face;
                        this.check_winning();
                        
                    }
                    
                } else {
                    this.mygame.display_text_effect("Select a number", 40);
                    this.mygame.snds["denied"].play();
                }
            } else {
                // removing number
                let number_face = this.board_arr[tile_y * 15 + tile_x ];
                this.board.remove( number_face );
                this.board_arr[tile_y * 15 + tile_x ] = null;
                this.mygame.snds["plop"].play();
            }   
        }
        
    }

    //---
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