

import * as THREE from 'three';

export class PuzLevel08 {
    
    setting_active_range = 24;
    setting_rotspeed = 5;

    pieces_arr = [];

    //----------
    constructor( mygame , x,y,z, y_rot ) {
        
        this.mygame = mygame;
        let dx = Math.sin( y_rot ) * this.setting_active_range/2;
        let dz = Math.cos( y_rot ) * this.setting_active_range/2;
        this.activepoint = new THREE.Vector3(x + dx ,  y - mygame.setting_PH ,  z + dz);
        
        let root = new THREE.Object3D();
        root.position.set( x,y,z );
        root.scale.set( 0.5, 0.5, 0.5 );

        root.rotation.y = y_rot;
        mygame.threejs_scene.add( root );

        this.init_pieces();

        let board = mygame.cloneInstance( mygame.models["bloxorplatform"].scene );
        board.scale.set( 16, 0.1, 16 );
        board.position.set( 7.5 , -0.1 ,  -7.5 );
        board.item_id = "board";
        root.add( board );
        this.board = board;
        mygame.receiveShadow( board );
        
        this.cube_root = new THREE.Object3D();
        root.add( this.cube_root );

        this.cube = mygame.cloneInstance( mygame.models["cube"].scene );
        this.cube.children[0].material = mygame.materials["metalblue"];
        this.cube_root.add( this.cube );
        mygame.castShadow( this.cube );


        this.cursize = new THREE.Vector3(0,0,0);
        this.curpos  = new THREE.Vector3(0,0,0);
        this.reset_cube_root();
        
        this.root   = root;
    }

    //-------------
    // bookmark0
	reset_cube_root() {

        this.rot = 0;
		this.rotdir = 0;

        // logical unit.
        this.cursize.set(1,  2,  1);
        this.curpos.set( 0,  1 , 4);

        
        this.cube_root_copy_curpos();
        this.cube_root.rotation.set(0,0,0);

        this.reset_cube();
        
	}

    //-----
    cube_root_copy_curpos() {
        this.cube_root.position.x =  this.curpos.x ;
		this.cube_root.position.y =  this.curpos.y ;
		this.cube_root.position.z =  -this.curpos.z ;
		
    }
    //---
    cube_copy_cursize() {
        this.cube.scale.x = this.cursize.x ;
		this.cube.scale.y = this.cursize.y ;
		this.cube.scale.z = this.cursize.z ;
    }

    //------
    reset_cube() {
        this.cube.position.set(0,0,0);
        this.cube_copy_cursize();
    }


    //-----------
	move_x_right() {
		this.rotorient = 0;
		this.rotdir = 1;
	}
	//--------
	move_x_left() {
		this.rotorient = 0;
		this.rotdir = 2;
	}
	//-----------
	move_z_right() {
		this.rotorient = 1;
		this.rotdir = 2;
	}
	//--------
	move_z_left() {
		this.rotorient = 1;
		this.rotdir = 1;
	}

    //---
    floor_onclick( hitPoint ) {

        //console.log( hitPoint.x + this.board.position.x , hitPoint.z + this.board.position.z ); 
        if ( this.rotdir == 0 ) {
            let delx = hitPoint.x + this.board.position.x - this.cube_root.position.x ;
            let delz = -( hitPoint.z + this.board.position.z - this.cube_root.position.z );
            
            if ( Math.abs(delx) > Math.abs(delz) ) {
                if ( delx > 0 ) {
                    this.move_x_right();
                } else {
                    this.move_x_left();
                }

            } else {
                if ( delz > 0 ) {
                    this.move_z_right();
                } else {
                    this.move_z_left();
                }
            }
        }
        
    }

    //---------
	init_pieces() {

		let map = [

			0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
			0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1,
			0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1,
			0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
			0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0,
			1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0,
		]	

		for ( let i = 0 ; i < 16 ;i++) {
			for ( let j = 0 ; j < 16; j++) {
				this.pieces_arr[i * 16 + j ] = map[ ( 15 - i ) * 16 + j];
			}
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

            if ( item_id == "board" ) {

                const localPoint = hit.object.parent.parent.worldToLocal(hit.point.clone()).multiplyScalar( clickedObject.scale.x) ;
                this.floor_onclick( localPoint )
            }
            return 0;

        } else {
            return null;
        }
    }

    //---------------
    //bookmark1
	render_rot() {
		
        // rotdir       1: decrement, 2: increment
        // rotorient    0: x , 1: z
		if ( this.rotdir == 1 || this.rotdir == 2 ) {

			if ( this.rot == -90 || this.rot == 90 ) { 

				if ( this.rotorient == 0 ) {

					let tmp = this.cursize.x;
					this.cursize.x = this.cursize.y;
					this.cursize.y = tmp;
					this.curpos.y  =  0.5 * this.cursize.y ;

					if ( this.rot == -90 ) {
						this.curpos.x += Math.max(this.cursize.x , this.cursize.y)  * 0.5 + 0.5;
					} else {
						this.curpos.x -= Math.max(this.cursize.x , this.cursize.y)  * 0.5 + 0.5;
					}
                    
				} else if ( this.rotorient == 1 ) {

					let tmp         = this.cursize.z;
					this.cursize.z  = this.cursize.y;
					this.cursize.y  = tmp;
					this.curpos.y   = 0.5 * this.cursize.y ;

					if ( this.rot == -90 ) {
						this.curpos.z -= Math.max(this.cursize.z , this.cursize.y)  * 0.5 + 0.5;
					} else {
						this.curpos.z += Math.max(this.cursize.z , this.cursize.y)  * 0.5 + 0.5;
					}
				}

				this.rot = 0;
				this.rotdir = 0;
				
				this.cube_root_copy_curpos();
                this.reset_cube();
                this.cube_root.rotation.set(0,0,0);
				
				let start_x = Math.floor( this.curpos.x );
				let start_z = Math.floor( this.curpos.z );
				let touches = [];

                this.mygame.snds["plop"].play();
                
                //console.log( start_x, start_z );


                for ( let i = 0 ; i < this.cursize.z ; i++ ) {
					for ( let j = 0 ; j < this.cursize.x ; j++ ) {
						
						let tile_x = start_x + j;
						let tile_z = start_z + i;
                        touches.push( new THREE.Vector3( tile_x, 0, tile_z ) )		
					}
				}
				if ( touches.length == 1 ) {

					if ( touches[0].x <= -1 || touches[0].z <= -1 || touches[0].z >= 16 || touches[0].z >= 16 ) {
						this.rotdir = 3;
					} else if ( this.pieces_arr[  touches[0].z * 16 + touches[0].x ] != 1 ) {
						this.rotdir = 3;
					}

					if ( touches[0].x == 14 && touches[0].z == 12 ) {

						this.mygame.snds["success"].play();
                        this.mygame.snds["applause"].play();
                        this.mygame.display_text_effect("Well Done!", 50);
                        this.solved = 1
                        this.mygame.completed_level( 8 );
            
					}


				} else if ( touches.length == 2 ) {

					let stepemptycount = 0;
					let empty_i = -1;
					for ( let i = 0 ; i < touches.length ; i++ ) {
						if ( touches[i].x <= -1 || touches[i].z <= -1 || touches[i].z >= 16 || touches[i].z >= 16 ) {
							stepemptycount += 1;
							empty_i = i;
						} else if ( this.pieces_arr[  touches[i].z * 16 + touches[i].x ] != 1 ) {
							stepemptycount += 1;
							empty_i = i;
						}
					}
					if ( stepemptycount >= 2) {
						this.rotdir = 3;
					} else if ( stepemptycount == 1 ) {
						
						if ( touches[0].z == touches[1].z ) {
							this.rotorient = 0;
						} else {
							this.rotorient = 1;
						}
						if ( empty_i == 0 ) {
							this.rotdir = 4;
                            if ( this.rotorient == 0 ) {
                                this.rotdir = 5;
                            }
						} else {
							this.rotdir = 5;
                            if ( this.rotorient == 0 ) {
                                this.rotdir = 4;
                            }
						}
					}

					if ( this.rotdir >= 3 && this.rotdir <= 5 ) {
						this.mygame.snds["plopwater"].play();
					} 

					
				}

			
			// bookmark1.1
			} else if ( this.rot > -90 && this.rot <= 0 ) {

				//   --->
				//  |
				this.cube_root.position.y = 0.5;
				this.cube.position.y = 0.5 * this.cursize.y ;
					
				if ( this.rotorient == 0 ) {
					
					this.cube_root.position.x = this.curpos.x + this.cursize.x / 2;
                    this.cube_root.position.y = this.curpos.y - this.cursize.y / 2;
                    this.cube.position.x = -this.cursize.x / 2;
                    this.cube.position.y =  this.cursize.y / 2;
                    this.cube_root.rotation.set(0,0, this.rot * Math.PI/ 180 );
				
				} else if ( this.rotorient == 1  ) {

					this.cube_root.position.z = -this.curpos.z + this.cursize.z / 2;
                    this.cube_root.position.y =  this.curpos.y - this.cursize.y / 2;
					this.cube.position.z = -this.cursize.z/2;
                    this.cube.position.y = this.cursize.y/2;
					this.cube_root.rotation.set( -this.rot  * Math.PI/ 180 ,0 , 0 );
				}

			} else if ( this.rot >= 0 && this.rot < 90 ) {
				
				//   <---
				//      |
				this.cube_root.position.y   = 0.5;
				this.cube.position.y        = 0.5 * this.cursize.y;
				
				if ( this.rotorient == 0 ) {
					this.cube_root.position.x = this.curpos.x - this.cursize.x / 2 ;
                    this.cube_root.position.y = this.curpos.y - this.cursize.y / 2;
					this.cube.position.x = this.cursize.x/ 2;
                    this.cube.position.y =  this.cursize.y / 2;
					this.cube_root.rotation.set(0,0, this.rot * Math.PI/ 180);
				} else if ( this.rotorient == 1 ) {

					this.cube_root.position.z = -this.curpos.z - this.cursize.z / 2 ;
                    this.cube_root.position.y = this.curpos.y - this.cursize.y / 2;
					this.cube.position.z = this.cursize.z/ 2;
                    this.cube.position.y = this.cursize.y/2;
					this.cube_root.rotation.set(-this.rot  * Math.PI/ 180,0, 0 );
				}

			}


		//-------------------------------------------------
        // bookmark1.2
		} else if ( this.rotdir == 4 || this.rotdir == 5 ) {

			if ( this.rot == -90 || this.rot == 90 ) { 
				this.rotdir = 3;
			} else {

                this.cube_root.position.y = this.curpos.y - this.cursize.y / 2;
				this.cube.position.y = this.cursize.y/2;

				if ( this.rotorient == 0 ) {
					this.cube_root.rotation.set(0,0, this.rot * Math.PI/ 180);
                } else if ( this.rotorient == 1 ) {
				    this.cube_root.rotation.set( -this.rot  * Math.PI/ 180,  0 , 0);
                }
			}

		}
	}

    //---
    update( elapsed ) {

        if ( this.rotdir == 1 ) {

			if ( this.rot > -90 ) {
				this.rot -= this.setting_rotspeed;
				this.render_rot();
			} else {
				this.rotdir = 0;
			}

		} else if ( this.rotdir == 2 ) {
			
            if ( this.rot < 90 ) {
				this.rot +=this.setting_rotspeed;
				this.render_rot();
			} else {
				this.rotdir = 0;
			}
            
		} else if ( this.rotdir == 3 ) {
			
            // Fall full edge
			this.cube_root.position.y -= 0.05;
			if ( this.cube_root.position.y < -4 ) {
				this.reset_cube_root();
                this.mygame.snds["keypad"].play();
			}
		} else if ( this.rotdir == 4 ) {
			// Fall left half edge
			this.rot -= this.setting_rotspeed;
			this.render_rot();
		} else if ( this.rotdir == 5 ) {
			// fall right half edge
			this.rot += this.setting_rotspeed;
			this.render_rot();
		}
    }
}