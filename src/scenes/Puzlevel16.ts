

import * as THREE from 'three';

export class PuzLevel16 {
    
    setting_active_range = 16;
    setting_initial_speed = 0.06;
    
    keystates = {};
    tile_size = 0.4;
    movables = {};
    game_state = 0;
    move_histories = [];


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
        
        let instruction = mygame.create_item_plane( mygame.materials["sokobaninstruction"], 4, 0, 0.06,  4, 4 , 1, 1, 0, 0 )
        instruction.rotation.x = -Math.PI/2
        root.add( instruction );

        
        this.init_pieces();
    }


    //-------------
    init_pieces() {

        this.walls_arr = [
            1,1,1,1,1,1,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,0,0,0,0,0,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,0,1,0,0,0,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,0,0,0,0,0,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,0,0,0,0,0,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,1,0,0,0,0,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            1,1,1,1,1,1,1,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
        ]
        this.blocks_arr = [
            0,0,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,0,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,1,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,1,0,0,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,1,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,0,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
        ]
        this.buttons_arr = [
            0,0,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,1,1,0,1,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,1,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,1,0,1,1,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,1,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
            0,0,0,0,0,0,0,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2, 2,2,
        ]
        
        // walls and floors
        for ( let i = 0 ; i < this.walls_arr.length ; i++ ) {
            
            let pos = this.tilecoord_to_position( i );
            let tile;
            if ( this.walls_arr[i] == 1 ) {
                tile = this.mygame.cloneInstance( this.mygame.models["wall"].scene );
            } else if ( this.walls_arr[i] == 0 ) {
                tile = this.mygame.cloneInstance( this.mygame.models["floor"].scene );
                if ( this.buttons_arr[i] == 1 ) {
                    tile.children[0].material = this.mygame.materials["yellow"];
                }
            }
            if ( tile != null ) {
                tile.position.set( pos.x, 0 , pos.z );
                tile.scale.set( this.tile_size, this.tile_size/2, this.tile_size );
                this.root.add( tile );
            }
        }

        //buttons
        for ( let i = 0 ; i < this.buttons_arr.length ; i++ ) {
            if ( this.buttons_arr[i] == 1 ) {
                let pos = this.tilecoord_to_position( i );
                let tile = this.mygame.cloneInstance( this.mygame.models["yellowbutton"].scene );
                tile.position.set( pos.x, 0 , pos.z );
                tile.scale.set( this.tile_size, this.tile_size, this.tile_size );
                this.root.add( tile );
            }
        }

        // blocks
        for ( let i = 0 ; i < this.blocks_arr.length ; i++ ) {
            if ( this.blocks_arr[i] == 1 ) {
                let pos = this.tilecoord_to_position( i );
                let tile = this.mygame.cloneInstance( this.mygame.models["block"].scene );
                tile.position.set( pos.x, 0 , pos.z );
                tile.scale.set( this.tile_size * 0.78, this.tile_size/2, this.tile_size * 0.78 );
                this.root.add( tile );
                this.movables[ i ] = tile;
                
            }
        }
        this.player = this.mygame.models["robot"].scene;
        this.player.start_x = 5;
        this.player.start_z = 5;
        this.player.registered_position = new THREE.Vector3( this.player.start_x, 0 , this.player.start_z );
        this.mygame.castShadow( this.player );
        this.player.mixer = new THREE.AnimationMixer( this.player );
        this.player.mixer.clipAction( this.mygame.models["robot"].animations[2]).play() ; 
        this.player_align_avatar_to_player_pos_tilecoord();
        this.player.scale.set( this.tile_size/4.5, this.tile_size/4.5, this.tile_size/4.5 );
        this.player.rotation.y = Math.PI ;
        this.root.add( this.player );


    }

    //------
    undo() {
        if ( this.player.lerp_progress == null && this.move_histories.length > 0) {
            let history = this.move_histories.pop();
            let player_pos = history.player_pos;

            this.player.registered_position.x = player_pos % 32;
            this.player.registered_position.z = Math.floor( player_pos / 32 );
            this.player_align_avatar_to_player_pos_tilecoord();   
            
            if ( history.movable ) {
                let pos = this.tilecoord_to_position( history.movable_pos );
                history.movable.position.x = pos.x;
                history.movable.position.z = pos.z;
                this.movables[ history.movable_pos ] = history.movable;
                delete this.movables[ history.movable_newpos ];
            }
        }
    }

    //------
    reset_board() {

        this.player.lerp_progress = null;
        this.move_histories.length = 0;
        this.player.registered_position = new THREE.Vector3( this.player.start_x, 0 , this.player.start_z );
        this.player_align_avatar_to_player_pos_tilecoord();
        for ( let tilecoord in this.movables ) {
            this.root.remove( this.movables[tilecoord] );
            delete this.movables[tilecoord];
        }
        for ( let i = 0 ; i < this.blocks_arr.length ; i++ ) {
            if ( this.blocks_arr[i] == 1 ) {
                let pos = this.tilecoord_to_position( i );
                let tile = this.mygame.cloneInstance( this.mygame.models["block"].scene );
                tile.scale.set( this.tile_size * 0.78, this.tile_size/2, this.tile_size * 0.78 );
                tile.position.set( pos.x, 0 , pos.z );
                this.root.add( tile );
                this.movables[ i ] = tile;
                
            }
        }
    }

    //---
    onKeyDown( key ) {

         if ( this.solved == 1 ) {
            this.mygame.display_text_effect("This game has been completed.", 40);
            return -1;
        }

        //console.log("Puzlevel16", "onKeyDown", key);

        switch (key) {
            case 'u':
            case 'U':
                this.undo();
                break;
            case 'r':
            case 'R':
                this.reset_board();
                break;  
            case 'i':
            case 'I':
                this.keystates[38] = 1;
                this.keystates[40] = 0;
                break;
            case 'j':
            case 'J':

                this.keystates[37] = 1;
                this.keystates[39] = 0;
                break;
            case 'k':
            case 'K':
                this.keystates[40] = 1;
                this.keystates[38] = 0;
                break;
            case 'l':
            case 'L':
                this.keystates[39] = 1;
                this.keystates[37] = 0;
                
               
                break;
        }
           
        
    }

    //--
    onKeyUp( key ) {

        //console.log("Puzlevel16", "onKeyUp", key);
        
        switch (key) {
            case 'i':
            case 'I':
                this.keystates[38] = 0;
                
                break;
            case 'j':
            case 'J':
                this.keystates[37] = 0;
                
                break;
            case 'k':
            case 'K':
                this.keystates[40] = 0;
                
                break;
            case 'l':
            case 'L':
                this.keystates[39] = 0;
                
                break;
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
            let clickedObject = hit.object.parent.parent;
            if ( clickedObject.item_id == null && clickedObject.button_id == null ) {
                clickedObject = hit.object.parent;
            }
            let item_id = clickedObject.item_id;

            if ( item_id != null ) {

                
            }
            return 0;

        } else {
            return null;
        }
    }





    //-------------
    // GENERAL PASSABLE 
    check_is_tile_passable_general( tilecoord:number , direction:number ) {

        let ret = true; 
        // standard wall (1) 
        if ( this.walls_arr[  tilecoord  ] == 1  )  {
            ret = false;
        }
        return ret;
    }

    //-----------
    check_is_tile_passable_non_player( tilecoord:number , direction:number ) {

        let ret = true;
        if ( this.check_is_tile_passable_general( tilecoord , direction ) == false ) {
            ret = false;
        }    
        return ret;

    }


    //---------
    // CHECK BLOCK PASSABLE
    check_is_tile_passable_for_movable_block( tilecoord:number ,  direction:number ) {

        let ret = true;
        
        if ( this.check_is_tile_passable_non_player( tilecoord , direction ) == false ) {
            ret = false;

        // Movable blocks vs movable blocks
        } else if ( this.movables[ tilecoord ] ) {
            ret = false;

        // Should not crush monster with blocks
        } 
        return ret;
    }

    //-------
    // CHECK PLAYER PASSABLE
    check_is_tile_passable_for_player( tilecoord:number , direction:number ) {

        let ret = true;
        // Generic check
        if ( this.check_is_tile_passable_general( tilecoord , direction ) == false ) {

            ret = false;
            
        // Movable blocks (7), if there's a movable block, check if pushable or not.
        } else if ( this.movables[ tilecoord ] ) {
            
            if ( this.check_is_tile_passable_for_movable_block( tilecoord + direction , direction  ) == true ) {
               
            } else {
                // Cannot push into
                ret = false;
            }
        }
        return ret;
    }

    //-------------
    tilecoord_to_position( tilecoord ):Vector3 {

        let tile_x = tilecoord % 32;
        let tile_z = ( tilecoord / 32 ) >> 0;
        let x =  tile_x  * this.tile_size - 3 * this.tile_size;
        let z =  tile_z  * this.tile_size - 3 * this.tile_size;
        let y =  0;
        return new THREE.Vector3(x, y, z); 
    }

    //--------
    move_player(  direction:number ) {

        if ( this.game_state != 0 ) {
            return;
        }

        // player's involuntary movement.
        if ( this.player.lerp_progress != null ) {
            return;
        }

        let cur_tilecoord   = this.player.registered_position.z * 32 + this.player.registered_position.x ;
        let new_tilecoord   = this.player.registered_position.z * 32 + this.player.registered_position.x + direction;
        
        if ( this.check_is_tile_passable_for_player( new_tilecoord , direction ) == true ) {
            
            this.player.lerp_progress   = 0;
            this.player.lerp_start_pos  = this.tilecoord_to_position( cur_tilecoord );
            this.player.lerp_start_pos.y = this.player.position.y;

            this.player.lerp_end_pos    = this.tilecoord_to_position( new_tilecoord );
            this.player.lerp_end_pos.y = this.player.position.y;
            
            this.player.direction       = direction;
            this.player.new_tilecoord   = new_tilecoord;
            this.player.tilecoord       = cur_tilecoord;
            this.player.speed           = this.setting_initial_speed; 


            let history = { 
                player_pos: cur_tilecoord,
            };
            if ( this.movables[ new_tilecoord ] ) {
                history.movable = this.movables[ new_tilecoord ];
                history.movable_pos     = new_tilecoord; 
                history.movable_newpos  = new_tilecoord + direction; 
            }
            this.move_histories.push( history );

        } else {
            //this.open_lock_if_bump_into_one( new_tilecoord );
            
        }
    }


    //------
    // PMB
    push_movable_block(  direction:number ) {
        
        let tilecoord       =  this.player.registered_position.z * 32 + this.player.registered_position.x ;
        
        if ( this.movables[ tilecoord ]  )  {    

            let movable = this.movables[ tilecoord ];
            
            let new_tilecoord = tilecoord + direction;
            let new_direction = new_tilecoord - tilecoord;
            
            movable.item_id = 7;
            movable.lerp_progress = 0;
            movable.lerp_start_pos = this.tilecoord_to_position( tilecoord );
            movable.lerp_end_pos   = this.tilecoord_to_position( new_tilecoord );
            movable.direction = new_direction; 
            movable.tilecoord = tilecoord; 
            movable.new_tilecoord = new_tilecoord;
            movable.speed = this.setting_initial_speed * 2; 
            movable.passed_tile_action_done = null;
            
            // Should occupy the new tile immediately but dont do block_current_tile() yet until lerp finished.
            delete this.movables[ tilecoord ];
            this.movables[ new_tilecoord ] =  movable ;
                    
        }
    }

    //-----
    get_y_rot_by_direction( direction:number ) {
        
        if ( direction == -1 ) {
            return -Math.PI/2;
        } else if ( direction == -32 ) {
            return Math.PI;
        } else if ( direction == 1 ) {
            return Math.PI/2
        } else if ( direction == 32 ) {
            return 0
        }
        return 0;
    }

    //-----
    player_align_avatar_to_player_pos_tilecoord() {

        this.player.position.x = this.player.registered_position.x * this.tile_size - 3 * this.tile_size;
        this.player.position.z = this.player.registered_position.z * this.tile_size - 3 * this.tile_size;

    }


    //-------
    check_player_current_tile(  prev_tilecoord:number ) {
        
        let tilecoord       = this.player.registered_position.z  * 32 + this.player.registered_position.x  ;
        if ( this.buttons_arr[ tilecoord ] == 1 ) {
            this.mygame.snds["buttonshort"].play();
        }
        
    }

    //----------
    player_pos( elapsed ) {
        
        // player
        if ( this.player.lerp_progress != null ) {
            
            this.player.lerp_progress += this.player.speed * elapsed * 0.1;
            if ( this.player.lerp_progress > 1.0 ) {
                this.player.lerp_progress = 1.0;
            }

            this.player.position.lerpVectors( this.player.lerp_start_pos,  this.player.lerp_end_pos ,  this.player.lerp_progress ) ;
            this.player.rotation.y = this.get_y_rot_by_direction( this.player.direction );

            //Animator.playSingleAnimation( _this.player , 'walk', false )
            this.player.mixer.clipAction( this.mygame.models["robot"].animations[2]).stop() ; 
            this.player.mixer.clipAction( this.mygame.models["robot"].animations[10]).play() ; 



            // UPDATE PLAYER

            // If to be entered tile is not ice or force floor, then can start check_player_current_tile() at lerp progress 0.5
            //  otherwise, we only do it at lerp progress of 0.99 for smoother animation.
            //   The reason for doing early at 0.5 is because when pushing block or encountering monster,
            //      the player doesn't need to wait until the full tile is entered.

            let passed_tile_lerp_threshold = 0.5;
            
            if ( this.player.lerp_progress >= passed_tile_lerp_threshold && this.player.passed_tile_action_done == null ) {

                this.player.passed_tile_action_done = 1;
                this.player.registered_position.x =   this.player.new_tilecoord % 32;
                this.player.registered_position.z = ( this.player.new_tilecoord / 32 ) >> 0;  
                this.push_movable_block( this.player.direction );
                this.check_player_current_tile( this.player.tilecoord ); 
            }   

            if ( this.player.lerp_progress >= 0.5 ) {
                this.player.registered_position.x =   this.player.new_tilecoord % 32;
                this.player.registered_position.z = ( this.player.new_tilecoord / 32 ) >> 0;  
            }
            
            if (  this.player.lerp_progress >= 0.99 ) {                
                this.player.lerp_progress   = null;
                this.player_align_avatar_to_player_pos_tilecoord();
                this.player.passed_tile_action_done = null;


            }
        } 

        // Forward always takes precedence
        let has_down = 0;
        if ( this.keystates[38] == 1 ) { 
            this.player.rotation.y = Math.PI;

            this.move_player(-32);
            has_down = 1;

        } else if ( this.keystates[37] == 1 ) {

            this.player.rotation.y = -Math.PI/2;
            this.move_player(-1);
            has_down = 1;
                
        } else if ( this.keystates[39]  == 1) {
            this.player.rotation.y = Math.PI/2;
            this.move_player(1);
            has_down = 1;
            
        } else if ( this.keystates[40]  == 1) {
            
            this.player.rotation.y = 0;
            this.move_player(32);
            has_down = 1;
            
        } 
        if ( this.player.lerp_progress == null ) {
            this.player.mixer.clipAction( this.mygame.models["robot"].animations[2]).play() ; 
            this.player.mixer.clipAction( this.mygame.models["robot"].animations[10]).stop() ; 
        }   
    }

    //----
    check_winning() {
        let solve = 1;
        for ( let i = 0 ; i < this.buttons_arr.length ; i++ ) {
            if ( this.buttons_arr[i] == 1 ) {
                if ( this.movables[i] == null ) {
                    solve = 0;
                    break;
                }
            }
        }
        if ( solve == 1 ) {
            this.mygame.display_text_effect("Well Done!", 60);
            this.mygame.snds["success"].play();
            this.mygame.snds["applause"].play();
            this.solved = 1;
            this.mygame.completed_level( 16 );
            
        }
    }

    //-------
    movable_block_pos( elapsed ) {

        // movable blocks
        for ( let tilecoord in this.movables ) {
            
            let tile = this.movables[tilecoord];

            if ( tile.lerp_progress != null ) {
                
                tile.lerp_progress += tile.speed * elapsed * 0.1;

                if ( tile.lerp_progress > 1.0 ) {
                    tile.lerp_progress = 1.0;
                }
                tile.position.lerpVectors( tile.lerp_start_pos,  tile.lerp_end_pos ,  tile.lerp_progress ) ;
                
                // Reach destination
                if ( tile.lerp_progress >= 0.99 ) {
                    tile.lerp_progress = null ;

                    if ( tile.passed_tile_action_done == null  ) {
                        tile.passed_tile_action_done = 1;
                        this.check_winning();
                        if ( this.mygame.snds["stone"].isPlaying == false ) {
                            this.mygame.snds["stone"].play();
                        }
                    }
                }
            }
        }
    }

    //-------
    update( elapsed ) {
        this.player_pos( elapsed );
        this.movable_block_pos( elapsed );
        this.player.mixer.update(elapsed * 0.00380);
    }
}