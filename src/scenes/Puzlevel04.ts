

import * as THREE from 'three';

export class PuzLevel04 {

    pieces_arr = [];
    setting_active_range = 16;
    mode = 0;
    elapsed = 0;
    ai_response = [];

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
        board.scale.set( 10,5, 0.1 );
        board.children[0].material = mygame.materials["darkgrey"];
        root.add( board );
        
        let board_face = mygame.create_item_plane( mygame.materials["niminstruction"], -0.225, -0.02, 0.6  ,0.4, 0.8    ,1,1,0,0 );
        board.add( board_face );



        let startbutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        startbutton.position.set( -2, -1.75, 0.1);
        startbutton.scale.set( 2, 0.5, 0.4);
        let startbutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"], 0, 0, 0.6  , 0.6, 1    ,8,4,0,0 );
        startbutton.add( startbutton_face );
        startbutton.children[0].children[0].material = mygame.materials["blue"];
        startbutton.button_id = "start";
        this.startbutton = startbutton;

        root.add( startbutton );
        


        let endturnbutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        endturnbutton.position.set( -3.25, -1.75, 0.1);
        endturnbutton.scale.set( 2, 0.5, 0.4);
        let endturnbutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"], 0, 0, 0.6  , 0.8, 1    ,8,3,2,0 );
        endturnbutton.add( endturnbutton_face );
        endturnbutton.children[0].children[0].material = mygame.materials["blue"];
        endturnbutton.button_id = "endturn";
        this.endturnbutton = endturnbutton;
        


        let resetbutton = mygame.cloneInstance( mygame.models["cube2"].scene );
        resetbutton.position.set(  -1.25, -1.75, 0.1);
        resetbutton.scale.set( 1.5, 0.5, 0.4);
        let resetbutton_face = mygame.create_item_plane( mygame.materials["buttonlbl"], -0.05, 0, 0.6  , 0.6, 1    ,8,4,1,0 );
        resetbutton.add( resetbutton_face );
        resetbutton.children[0].children[0].material = mygame.materials["blue"];
        resetbutton.button_id = "reset";
        this.resetbutton = resetbutton;

        
        


        this.init_pieces();

        for ( let i = 0 ; i < this.pieces_arr.length ; i++ ) {
			
			let piece = this.pieces_arr[i];
            let sx =  piece.tilesize.x * 0.9;
            let sy =  piece.tilesize.y * 0.9;
			piece.scale.set( sx,sy, 0.4 );
            
			let x  =  (piece.tile.x + piece.scale.x * 0.5 ) + 0.5 ;
			let y  =  (piece.tile.y + piece.scale.y * 0.5 )  -2 ;
			
            piece.position.set( x,y, 0.1 );
            piece.item_id = i;
            root.add( piece );
		}	
        
        this.root   = root;
    }


    //---------
    reset_board() {
        var i;
		for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
            let piece = this.pieces_arr[i];
            piece.children[0].children[0].material = this.mygame.materials["white"];
            piece.state = 1;
            this.root.add( piece );
        }

    }


    //--------------------------------
    button_onclick( id  ) {
        
        console.log( "button_onclick", id );
        
        if ( id == "start" ) {
        	this.mode = 1;
        	this.reset_board();
        	
        } else if ( id == "reset" ) {

        	this.reset_board();
            this.mode = 1;
        	

        } else if ( id == "endturn" ) {

        	this.endturn();
        }   
        this.mygame.snds["buttonclick"].play();
             
        this.state_to_button_visibility();
    }


    //----
    piece_onclick( item_id ) {
		
		if ( this.mode == 1 ) {

            let piece = this.pieces_arr[ item_id ];

            if ( piece.state == 0 ) {
                piece.state = 1;
                piece.children[0].children[0].material = this.mygame.materials["white"];

            } else {
                piece.state = 0;
                piece.children[0].children[0].material = this.mygame.materials["darkgrey2"];
            }
                
            this.mygame.snds["tick"].play();
        
            
		} else {
			this.mygame.display_text_effect("Start the game first.", 40);
		}

	}


    //---
    state_to_button_visibility() {
        
        let mygame = this.mygame;
        this.root.remove( this.startbutton );
        this.root.remove( this.endturnbutton );
        this.root.remove( this.resetbutton );
        
    	if ( this.mode == 0 ) {
            this.root.add( this.startbutton );
            
    	} else if ( this.mode == 1 ) {
            this.root.add( this.resetbutton );
            this.root.add( this.endturnbutton );
            //this.status_txtshape.value = "Your Turn";
    		
    	} else if ( this.mode == 2 ) {

    		//this.status_txtshape.value = "AI's Turn";
    		
    	} else if ( this.mode == 3 ) {

    		if ( this.winner == "You" ) {
    			//this.status_txtshape.value = "Congratulation. " + this.winner + " won." ;
    		} else {
    			//this.status_txtshape.value = "Game Over. " + this.winner + " won." ;
    		}
            this.root.add( this.resetbutton );
    	
        } 
    }

    //-----
    endturn() {

    	let i;
    	let picked = [];
    	let invalid = 0;
    	let col_or_row = 0;

    	for ( i = 0 ; i < this.pieces_arr.length; i++ ) {

            let piece = this.pieces_arr[i];

    		if ( piece.state == 0 ) {

    			picked.push( i );

    			if ( picked.length == 2 ) {

    				let col_0 =  picked[0] % 4;
    				let row_0 = (picked[0] / 4 ) >> 0;

    				let col_1 =  picked[1] % 4;
    				let row_1 =  (picked[1] / 4 ) >> 0;
    			
    				if ( col_0 == col_1 ) {
    					col_or_row = 1;
    				} else if ( row_0 == row_1 ) {
    					col_or_row = 2;
    				} else {
    					invalid = 1;
    					break;
    				}

    			} else if ( picked.length > 2 ) {

    				if ( col_or_row >= 1 ) {
    					if ( col_or_row == 1 ) {

    						let col_0 =  picked[0] % 4;
							let col_i =  i % 4;    						
							if ( col_0 != col_i ) {
								invalid = 1;
								break;
							}

    					} else { 

    						let row_0 = (picked[0] / 4 ) >> 0;
    						let row_i = (i / 4) >> 0;
    						if ( row_0 != row_i ) {
    							invalid = 1;
    							break;
    						}
    					}


    				} else {
    					invalid = 1;
    					break;
    				} 
    			}
    		}
    	}




    	if ( picked.length >= 1 ) {

    		if ( invalid > 0 ) {
    			this.mygame.display_text_effect("All selected tiles must be on single row or single column only.",  40 );
                this.mygame.snds["denied"].play();

    		} else {
    			
    			//commit 
    			let alive_tile_count = 0;

    			for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
                    let piece = this.pieces_arr[i];
                    if ( piece.state == 0 ) {
    					piece.state = null;
                        this.root.remove( piece );
                    
                    } else if ( piece.state == 1 ) {
                        alive_tile_count += 1;
                    }
    			}
                this.mygame.snds["tok0"].play();


    			if ( alive_tile_count == 0 ) {

    				this.winner = "You";
    				this.mode = 4;
                    this.mygame.snds["success"].play();
					this.mygame.snds["applause"].play();
                    this.mygame.display_text_effect("Congratulations! You won!", 50);
					this.solved = 1
                    this.mygame.completed_level( 4 );
            

    			} else {
    			
	    			// Say AI is thinking... but already got the ans first
                    let board = [];
                    for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
                        let piece = this.pieces_arr[i];
                        if ( piece.state == 1 ) {
                            board[i] = 1;
                        } else {
                            board[i] = 0;   
                        };
                    }
	    			
                    let ai_remove_mask = this.ai_answer( board , 4, 4    ,0,0,0   ) ;
                    this.ai_response.length = 0;
                    for ( i = 0 ; i < ai_remove_mask.length ; i++ ) {
						if ( ai_remove_mask[i] == 1 ) {
							this.ai_response.push( i );
						}
					}	
                    this.mode = 2;
                    this.mygame.display_text_effect("AI's turn",  40 );

    			}
                this.state_to_button_visibility();
				
    		}
    	} else {
    		this.mygame.display_text_effect("You need to take at least 1 tile in each turn",  40 );
    	}	

    }



    //-----------------------
	rotate_board_ccw(board,width,height) {

		let new_board = [];
		var i,j;

		for ( j = width - 1 ; j >= 0 ; j-- ) {
			for ( i = 0 ; i < height ; i++ ) {
				new_board.push( board[ i * width + j ] );
			}
		}
		return new_board;
	}

	//-----------------------
	rotate_board_cw(board,width,height) {

		let new_board = [];
		var i,j;

		for ( j = 0 ; j < width ; j++ ) {
			for ( i = height - 1 ; i >= 0 ; i-- ) {
				new_board.push( board[ i * width + j ] );
			}
		}
		return new_board;
	}


	//-----------------------
	mirror_board(board,width,height) {

		let new_board = [];
		var i,j;

		for ( i = 0 ; i < height ; i++ ) {
			for ( j = width - 1 ; j >= 0 ; j-- ) {
				new_board.push( board[ i * width + j ] );
			}
		}
		return new_board;
	}


    //----------------
	compress_board ( board,width,height ) {

		var new_board = [];
		var row_removed = [];
		var col_removed = [];

		var i,j;

		for ( i = 0 ; i < height ; i++ ) {
			let row_empty = 1;
			for ( j = 0 ; j < width ; j++ ) {
				if ( board[ i * width + j ] != 0 && board[ i * width + j ] != null  ) {
					row_empty = 0;
					break;
				} 
			}
			if ( row_empty == 1 ) {
				row_removed.push( i );
			}
		}

		for ( j = 0 ; j < width ; j++ ) {
			let col_empty = 1;
			for ( i = 0 ; i < height ; i++ ) {
				if ( board[ i * width + j ] != 0 && board[ i * width + j ] != null ) {
					col_empty = 0;
					break;
				} 
			}
			if ( col_empty == 1 ) {
				col_removed.push( j );
			}
		}

		for ( i = 0 ; i < height ; i++ ) {
			if ( row_removed.indexOf( i ) == -1 ) {
				for ( j = 0 ; j < width ; j++ ) {
					if ( col_removed.indexOf(j) == -1 ) {
						new_board.push( board[i * width + j] );
					}
				}
			}
		}

		//print_board2( new_board , width - col_removed.length , height - row_removed.length , "compress_board return");

		return [ new_board , row_removed , col_removed ];
	}


    //---------------
	copyboard( board, width, height ) {

		var i,j;
		var new_board = [];
		for ( i = 0 ; i < height ; i++ ) {
			for ( j = 0 ; j < width ; j++ ) {
				new_board[ i * width + j ] = board[i * width + j];
			}
		}
		return new_board;
	}


	//-----------
	is_signature_loser( board , width , height ) {

		var ret = 0;
		var r;

		if ( width == 2 && height == 2 ) {
			
			if ( board[0] == 1 && board[1] == 1 &&
				 board[2] == 1 && board[3] == 1 ) {
				ret = 1;

			} else if ( 
				board[0] == 1 && board[1] != 1 &&
				board[2] != 1 && board[3] == 1 ) {

				ret = 1;

			} else if ( 
				board[0] != 1 && board[1] == 1 &&
				board[2] == 1 && board[3] != 1 ) {
				
				ret = 1;
			}



		} else if ( width == 2 && height == 4 ) {
			
			if ( board[0] == 1 && board[1] == 1 &&
				 board[2] == 1 && board[3] == 1 && 
				 board[4] == 1 && board[5] == 1 &&
				 board[6] == 1 && board[7] == 1 ) {

				ret = 1;

			} else if ( 
				
				 board[0] == 0 && board[1] == 1 &&
				 board[2] == 1 && board[3] == 0 && 
				 board[4] == 1 && board[5] == 0 &&
				 board[6] == 0 && board[7] == 1 ) {

				ret = 1;
			
			} else if ( 
				 board[0] == 0 && board[1] == 1 &&
				 board[2] == 1 && board[3] == 0 && 
				 board[4] == 0 && board[5] == 1 &&
				 board[6] == 1 && board[7] == 0 ) {

				
				ret = 1;
			}


		
		} else if ( width == 3 && height == 3 ) {

			var tiles_remaining = this.count_tiles( board, width, height );

			// Y shape 
			if ( 
				board[0] == 1 && board[1] != 1 && board[2] == 1 &&
				board[3] != 1 && board[4] == 1 && board[5] != 1 &&
				board[6] != 1 && board[7] == 1 && board[8] != 1  

				) {

				ret = 1;


			// + with empty center
			} else if ( 

				board[0] != 1 && board[1] == 1 && board[2] != 1 &&
				board[3] == 1 && board[4] != 1 && board[5] == 1 &&
				board[6] != 1 && board[7] == 1 && board[8] != 1  

				) {

				ret = 1;


			// L shape without hinge
			} else if ( 

				board[0] != 1 && board[1] == 1 && board[2] == 1 &&
				board[3] == 1 && board[4] != 1 && board[5] != 1 &&
				board[6] == 1 && board[7] != 1 && board[8] != 1  
	

				) {

				ret = 1;

			// New 3x3 empty
			} else if ( 

				board[0] == 1 && board[1] == 1 && board[2] == 1 &&
				board[3] == 1 && board[4] == 1 && board[5] == 1 &&
				board[6] == 1 && board[7] == 1 && board[8] == 1  


				) {
				ret = 1;



			} else if ( tiles_remaining == 6 ) {

				var found = this.slice_scan( board, width, height );
				if ( found == 0 ) {
					ret = 1;
				}
			
			}

		}

		return ret;
	}

    //----------
	count_tiles( board , width , height ) {
		var i;
		var ret = 0;
		for ( i = 0 ; i < width * height ; i++ ) {
			if ( board[i] == 1 ) {
				ret += 1;
			}
		}
		return ret;
	}


	//----------
	slice_scan( board, width , height ) {

		var i,j,k;
		var found = 0;


		// Check row slice does it lead to loser
		for ( i = 0 ; i < height ; i++ ) {
		
			let tmp_board = this.copyboard( board, width , height );
			for ( j = 0 ; j < width ; j++ ) {
				tmp_board[ i * width + j ] = 0;
			}

			var ret = this.compress_board( tmp_board, width , height );
			var tmp_board_compressed = ret[0];
			var row_removed = ret[1];
			var col_removed = ret[2];
			var new_width = width - col_removed.length;
			var new_height = height - row_removed.length;

			//print_board2( tmp_board_compressed, new_width, new_height , " slice row " + i );


			if ( this.is_signature_loser( tmp_board_compressed, new_width, new_height ) == 1 ) {
				found = i + 100;
			}
			if ( found == 0 && ( new_width > 2 || new_height > 2 ) ) {

				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_width, new_height )
				if ( this.is_signature_loser( tmp_board_compressed, new_height , new_width ) == 1 ) {
					found = i + 100;	
				}
				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_height, new_width )
				if ( this.is_signature_loser( tmp_board_compressed, new_width, new_height ) == 1 ) {
					found = i + 100;	
				}
				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_width, new_height )
				if ( this.is_signature_loser( tmp_board_compressed, new_height, new_width ) == 1 ) {
					found = i + 100 ;	
				}
			}


			if ( found != 0 ) {
				return found;
			}
		}

		
		// Check column slice does it lead to loser.
		for ( j = 0 ; j < width ; j++ ) {
			
			let tmp_board = this.copyboard( board, width , height );
				

			for ( i = 0 ; i < height ; i++ ) {
				tmp_board[ i * width + j ] = 0;
			}

			var ret = this.compress_board( tmp_board, width , height );
			var tmp_board_compressed = ret[0];
			var row_removed = ret[1];
			var col_removed = ret[2];
			var new_width = width - col_removed.length;
			var new_height = height - row_removed.length;

			//print_board2( tmp_board_compressed, new_width, new_height , " slice col " + j );

			if ( this.is_signature_loser( tmp_board_compressed, new_width, new_height ) == 1 ) {
				found = j + 200;
			}
			if ( found == 0 && ( new_width > 2 || new_height > 2 ) ) {

				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_width, new_height )
				if ( this.is_signature_loser( tmp_board_compressed, new_height , new_width ) == 1 ) {
					found = j + 200;	
				}
				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_height, new_width )
				if ( this.is_signature_loser( tmp_board_compressed, new_width, new_height ) == 1 ) {
					found = j + 200;	
				}
				tmp_board_compressed = this.rotate_board_cw( tmp_board_compressed, new_width, new_height )
				if ( this.is_signature_loser( tmp_board_compressed, new_height, new_width ) == 1 ) {
					found = j + 200;	
				}
			}
			if ( found != 0 ) {
				return found;
			}
		}
		
		return found;

	}


    //---------------------------------------------
	ai_answer( board ,  width , height , depth , rotated , mirrored ) {

		var i,j,k,l,r;

		let remove_mask = [];
		for ( i = 0 ; i < height ; i++ ) {
			for ( j = 0 ; j < width ; j++ ) {
				remove_mask.push(0);
			}
		}


		//------
		// Remove empty row/col
		let compressed = 0;

		if ( depth == 0 ) {
			
			var ret = this.compress_board( board, width , height );
			var new_board = ret[0];
			var row_removed = ret[1];
			var col_removed = ret[2];

			if ( new_board.length != board.length ) {
				
				//console.log( new_board_arr );
				compressed = 1;		
				let new_width 		= width  - col_removed.length;
				let new_height 		= height - row_removed.length;
				let subset_ans_mask = this.ai_answer( new_board, new_width, new_height , depth + 1 , rotated , mirrored );

				//console.log( new_board, row_removed , col_removed );
				let ii,jj;

				for ( i = 0 , ii = 0 ; i < height ; i++ ) {

					if (  row_removed.indexOf( i ) == -1 ) {
					
						for ( j = 0 , jj = 0 ; j < width ; j++ ) {
							if ( col_removed.indexOf(j) == -1 ) {

								remove_mask[ i * width + j ] = subset_ans_mask[ ii * new_width + jj ]
								jj += 1;
							}
						}
						ii+=1;
					}
				}

			} 
		}
		
		//-------------------------
		// Algorithm here..
		if ( compressed == 0 ) {

			if ( width == 1 ) {
			
				// 1xn
				for ( i = 0 ; i < height ; i++ ) {
					remove_mask[ i  ] = 1; 
				}
				//console.log("Column sweep");
			
			} else if ( height == 1 ) {
			
				// nx1
				for ( j = 0 ; j < width ; j++ ) {
					remove_mask[ j ] = 1; 
				}
				//console.log("Row Sweep ");
			
			} else if ( width == 2 && height == 2 ) {

				// 2x2	
				if ( board[0] == 1 && board[1] == 1 && board[2] == 1 && board[3] != 1  ) {
					remove_mask[ 0 ] = 1;

				} else if ( rotated < 3 ) {

					new_board  = this.rotate_board_ccw( board , width , height );
					let subset_remove_mask = this.ai_answer( new_board, height, width , depth , rotated + 1 , mirrored );
					remove_mask = this.rotate_board_cw( subset_remove_mask, height, width );

				}
			

			} else if ( width == 2 && height == 3 || width == 3 && height == 2) {

				// 2x3
				if ( board[0] == 1 && board[1] != 1 && 
					 board[2] == 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] == 1 && 
					 width == 2 && height == 3) {

					remove_mask[ 0 ] = 1;
				
				} else if ( 
					 board[0] == 1 && board[1] == 1 && 
					 board[2] == 1 && board[3] != 1 && 
					 board[4] == 1 && board[5] == 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 2 ] = 1;

				
				} else if ( 
					 board[0] == 1 && board[1] != 1 && 
					 board[2] == 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] != 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 0 ] = 1;
					remove_mask[ 2 ] = 1;


				} else if ( 
				
					 board[0] == 1 && board[1] == 1 && 
					 board[2] != 1 && board[3] == 1 && 
					 board[4] != 1 && board[5] == 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 1 ] = 1;
					remove_mask[ 3 ] = 1;

				} else if ( 
				
					 board[0] == 1 && board[1] == 1 && 
					 board[2] != 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] != 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 0 ] = 1;
					remove_mask[ 1 ] = 1;

				} else if ( 
				
					 board[0] == 1 && board[1] == 1 && 
					 board[2] == 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] == 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 0 ] = 1;
					remove_mask[ 1 ] = 1;	
				

				} else if ( 
				
					 board[0] == 1 && board[1] != 1 && 
					 board[2] != 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] != 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 0 ] = 1;
				
				} else if ( 
				
					 board[0] != 1 && board[1] == 1 && 
					 board[2] == 1 && board[3] == 1 && 
					 board[4] == 1 && board[5] != 1 && 
					 width == 2 && height == 3 ) {

					remove_mask[ 2 ] = 1;
					remove_mask[ 3 ] = 1;
												


				} else if ( rotated < 3 ) {

					new_board  = this.rotate_board_ccw( board , width , height );
					let subset_remove_mask = this.ai_answer( new_board, height, width , depth , rotated + 1 , mirrored );
					remove_mask = this.rotate_board_cw( subset_remove_mask, height, width );

				} else if ( rotated == 3 && mirrored == 0 ) {

					new_board  = this.mirror_board( board , width , height );
					let subset_remove_mask = this.ai_answer( new_board, width, height , depth , 0 , mirrored + 1);
					remove_mask = this.mirror_board( subset_remove_mask, width, height );
				}


            } else if ( width == 3 && height == 3 ) {

				// 3x3
				if ( board[0] == 1 && board[1] != 1 && board[2] != 1 && 
                     board[3] != 1 && board[4] != 1 && board[5] != 1 &&
                     board[6] != 1 && board[7] == 1 && board[8] == 1 ) {
                    remove_mask[ 7 ] = 1;

				} else if ( 
                    board[0] == 1 && board[1] != 1 && board[2] != 1 && 
                    board[3] == 1 && board[4] != 1 && board[5] != 1 &&
                    board[6] != 1 && board[7] != 1 && board[8] == 1 ) { 

                    remove_mask[ 3 ] = 1

                } else if ( 
                    board[0] == 1 && board[1] != 1 && board[2] != 1 && 
                    board[3] == 1 && board[4] != 1 && board[5] != 1 &&
                    board[6] != 1 && board[7] == 1 && board[8] != 1 ) { 
                    remove_mask[ 3 ] = 1
                } else if ( 

                    board[0] != 1 && board[1] != 1 && board[2] != 1 && 
                    board[3] == 1 && board[4] != 1 && board[5] != 1 &&
                    board[6] != 1 && board[7] == 1 && board[8] == 1 ) { 
                    remove_mask[ 7 ] = 1;    
                }  

			} else if ( width == 2 && height == 4 || width == 4 && height == 2 ) {
				//2x4

					if ( 
				
						 board[0] == 1 && board[1] == 1 && 
						 board[2] == 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] == 1 && 
						 board[6] == 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						 ) {

						remove_mask[ 2 ] = 1;
						
					} else if ( 

						 board[0] == 1 && board[1] != 1 && 
						 board[2] == 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] == 1 && 
						 board[6] == 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[2] = 1;


					} else if ( 

						 board[0] == 1 && board[1] != 1 && 
						 board[2] == 1 && board[3] != 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] == 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[0] = 1;	
						remove_mask[2] = 1;	
						remove_mask[6] = 1;	
						


					} else if ( 

						 board[0] == 1 && board[1] != 1 && 
						 board[2] == 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] == 1 && board[7] != 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[0] = 1;	
						remove_mask[2] = 1;	
						remove_mask[6] = 1;	


					} else if ( 

						 board[0] == 1 && board[1] != 1 && 
						 board[2] == 1 && board[3] != 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] != 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[0] = 1;	
						remove_mask[2] = 1;	
					
					} else if ( 

						 board[0] != 1 && board[1] == 1 && 
						 board[2] != 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] != 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[1] = 1;	
						remove_mask[3] = 1;	


					} else if ( 

						 board[0] == 1 && board[1] == 1 && 
						 board[2] != 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] != 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[1] = 1;	


					} else if ( 

						 board[0] == 1 && board[1] == 1 && 
						 board[2] == 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] != 1 && 
						 board[6] == 1 && board[7] != 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[4] = 1;		
						remove_mask[6] = 1;	


					} else if ( 

						 board[0] == 1 && board[1] == 1 && 
						 board[2] != 1 && board[3] == 1 && 
						 board[4] == 1 && board[5] == 1 && 
						 board[6] == 1 && board[7] == 1 &&
						 width == 2 && height == 4 
						) { 

						remove_mask[5] = 1;		
															

					} else if ( rotated < 3 ) {

						new_board  = this.rotate_board_ccw( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, height, width , depth , rotated + 1 , mirrored );
						remove_mask = this.rotate_board_cw( subset_remove_mask, height, width );

					} else if ( rotated == 3 && mirrored == 0 ) {

						new_board  = this.mirror_board( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, width, height , depth , 0 , mirrored + 1);
						remove_mask = this.mirror_board( subset_remove_mask, width, height );
					}	


	
			
			} else if ( width >= 3 && height >= 3 )  {


				// 3 x 3 and above
				let found = this.slice_scan( board , width , height );

				if ( found > 0 ) {

					if ( found >= 100 && found < 200 ) {

						var slice_row = found % 100;
						for ( j = 0 ; j < width ; j++ ) {
							if ( board[slice_row * width + j ] == 1 ) {
								remove_mask[ slice_row * width + j ] = 1;
							}
						}
						//console.log( "Found in slicing row " + slice_row);
					
					} else if ( found >= 200 && found < 300 ) {

						var slice_col = found % 200;
						for ( i = 0 ; i < height ; i++ ) {
							if ( board[i * width + slice_col ] == 1 ) {
								remove_mask[ i * width + slice_col ] = 1;
							}
						}
						//console.log( "Found in slicing col " + slice_col);
					}



				} else if ( width == 3 && height == 3 ) {

					var tiles_remaining = this.count_tiles( board , width , height );

					if ( 
					
						// 1 corner tile off
						board[0] != 1 && board[1] == 1 && board[2] == 1 && 
						board[3] == 1 && board[4] == 1 && board[5] == 1 && 
						board[6] == 1 && board[7] == 1 && board[8] == 1  ) { 
						
						remove_mask[ 2 ] = 1;
						remove_mask[ 5 ] = 1;
						

					} else if ( 
						// 1 edge tile off
						board[0] == 1 && board[1] != 1 && board[2] == 1 && 
						board[3] == 1 && board[4] == 1 && board[5] == 1 && 
						board[6] == 1 && board[7] == 1 && board[8] == 1  ) { 
						 
						remove_mask[ 6 ] = 1;
						remove_mask[ 7 ] = 1;
							
					

					} else if ( 
						// 1 center tile off
						board[0] == 1 && board[1] == 1 && board[2] == 1 && 
						board[3] == 1 && board[4] != 1 && board[5] == 1 && 
						board[6] == 1 && board[7] == 1 && board[8] == 1  ) { 
						 
						remove_mask[ 7 ] = 1;
						remove_mask[ 8 ] = 1;
						
						

					
					} else if ( 
						
						// 2 opposite corners off
						board[0] != 1 && board[1] == 1 && board[2] == 1 && 
						board[3] == 1 && board[4] == 1 && board[5] == 1 && 
						board[6] == 1 && board[7] == 1 && board[8] != 1  ) { 
						 
						remove_mask[ 2 ] = 1;
					


					} else if ( 
						
						// cross, response with middleless cross
						board[0] != 1 && board[1] == 1 && board[2] != 1 && 
						board[3] == 1 && board[4] == 1 && board[5] == 1 && 
						board[6] != 1 && board[7] == 1 && board[8] != 1  ) { 
						 
						remove_mask[ 4 ] = 1;
					

					} else if ( 
						// T , response with Y
						board[0] == 1 && board[1] == 1 && board[2] == 1 && 
						board[3] != 1 && board[4] == 1 && board[5] != 1 && 
						board[6] != 1 && board[7] == 1 && board[8] != 1  ) { 
						 
						remove_mask[ 1 ] = 1;
					
					} else if ( 
						// T+ 1 , response with Y
						board[0] == 1 && board[1] == 1 && board[2] == 1 && 
						board[3] != 1 && board[4] == 1 && board[5] == 1 && 
						board[6] != 1 && board[7] == 1 && board[8] != 1  ) { 
						 
						remove_mask[ 1 ] = 1;	

					} else if ( 
						// L , 
						board[0] == 1 && board[1] != 1 && board[2] != 1 && 
						board[3] == 1 && board[4] != 1 && board[5] != 1 && 
						board[6] == 1 && board[7] == 1 && board[8] == 1  ) { 
						 
						remove_mask[ 6 ] = 1;	

                    
					
					} else if ( tiles_remaining == 5 ) {
						
						//console.log("tiles remaining is 5");

						//print_board2( board , width ,height , "board" );

			
						for ( i = 0 ; i < width * height ; i++ ) {
							if ( board[i] == 1 ) {
								
								var tmp_board = this.copyboard( board , width , height );
								tmp_board[i] = 0;
								

								//print_board2( tmp_board , width ,height , "tmp_board" + i + " Rot 0" );


								if (this.is_signature_loser( tmp_board, width , height ) == 1 ) {
									remove_mask[i] = 1;
									break;	
								}

								tmp_board = this.rotate_board_cw( tmp_board, width, height )

								//print_board2( tmp_board , width ,height , "tmp_board" + i + " Rot 1" );
								
								if ( this.is_signature_loser( tmp_board, width , height ) == 1 ) {
									remove_mask[i] = 1;
									break;	
								}

								tmp_board = this.rotate_board_cw( tmp_board, width, height )

								//print_board2( tmp_board , width ,height , "tmp_board" + i + " Rot 2" );
								
								if ( this.is_signature_loser( tmp_board, width , height ) == 1 ) {
									remove_mask[i] = 1;
									break;	
								}

								tmp_board = this.rotate_board_cw( tmp_board, width, height ) 

								//print_board2( tmp_board , width ,height , "tmp_board" + i + " Rot 3" );
								
								if ( this.is_signature_loser( tmp_board, width , height ) == 1 ) {
									remove_mask[i] = 1;
									break;	
								}								

							}
						}	



					} else if ( rotated < 3 ) {

						new_board  = this.rotate_board_ccw( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, height, width , depth , rotated + 1 , mirrored );
						remove_mask = this.rotate_board_cw( subset_remove_mask, height, width );

					} else if ( rotated == 3 && mirrored == 0 ) {

						new_board  = this.mirror_board( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, width, height , depth , 0 , mirrored + 1);
						remove_mask = this.mirror_board( subset_remove_mask, width, height );
					}
				


				} else if ( width == 4 && height == 4 ) {

					if ( 
						board[0]  != 1 && board[1]  != 1 && board[2]  == 1 && board[3]  == 1 &&
						board[4]  == 1 && board[5]  == 1 && board[6]  == 1 && board[7]  == 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 3 ] = 1;	
						remove_mask[ 7 ] = 1;	
						remove_mask[ 11 ] = 1;	

					} else if ( 

						board[0]  == 1 && board[1]  != 1 && board[2]  != 1 && board[3]  == 1 &&
						board[4]  == 1 && board[5]  == 1 && board[6]  == 1 && board[7]  == 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 3 ] = 1;	
						remove_mask[ 7 ] = 1;	
						remove_mask[ 11 ] = 1;	

					} else if ( 

						board[0]  != 1 && board[1]  == 1 && board[2]  == 1 && board[3]  == 1 &&
						board[4]  == 1 && board[5]  == 1 && board[6]  == 1 && board[7]  == 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 3 ] = 1;	
						remove_mask[ 7 ] = 1;	
						remove_mask[ 11 ] = 1;
						
					} else if ( 

						board[0]  == 1 && board[1]  != 1 && board[2]  == 1 && board[3]  == 1 &&
						board[4]  == 1 && board[5]  == 1 && board[6]  == 1 && board[7]  == 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 3 ] = 1;	
						remove_mask[ 7 ] = 1;	
					

					} else if ( 

						board[0]  != 1 && board[1]  == 1 && board[2]  != 1 && board[3]  != 1 &&
						board[4]  != 1 && board[5]  == 1 && board[6]  != 1 && board[7]  != 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 1 ] = 1;	
						remove_mask[ 5 ] = 1;	
					
					} else if ( 

						board[0]  != 1 && board[1]  == 1 && board[2]  == 1 && board[3]  != 1 &&
						board[4]  != 1 && board[5]  == 1 && board[6]  == 1 && board[7]  != 1 &&
						board[8]  != 1 && board[9]  == 1 && board[10] == 1 && board[11] != 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 12 ] = 1;	
						remove_mask[ 15 ] = 1;	
						

					} else if ( 

						board[0]  == 1 && board[1]  != 1 && board[2]  != 1 && board[3]  != 1 &&
						board[4]  == 1 && board[5]  != 1 && board[6]  != 1 && board[7]  != 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 0 ] = 1;	
						remove_mask[ 4 ] = 1;	
					

					
					


					} else if ( 

						board[0]  == 1 && board[1]  == 1 && board[2]  == 1 && board[3]  == 1 &&
						board[4]  == 1 && board[5]  == 0 && board[6]  == 0 && board[7]  == 1 &&
						board[8]  == 1 && board[9]  == 1 && board[10] == 1 && board[11] == 1 &&
						board[12] == 1 && board[13] == 1 && board[14] == 1 && board[15] == 1 ) { 
						 
						remove_mask[ 7 ] = 1;	
						remove_mask[ 11 ] = 1;	
						


					} else if ( rotated < 3 ) {

						new_board  = this.rotate_board_ccw( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, height, width , depth , rotated + 1 , mirrored );
						remove_mask = this.rotate_board_cw( subset_remove_mask, height, width );

					} else if ( rotated == 3 && mirrored == 0 ) {

						new_board  = this.mirror_board( board , width , height );
						let subset_remove_mask = this.ai_answer( new_board, width, height , depth , 0 , mirrored + 1);
						remove_mask = this.mirror_board( subset_remove_mask, width, height );
					}

				}




			}

		}	

        
		if ( depth == 0 && rotated == 0 && mirrored == 0 ) {
			let has_answer = 0;
			for ( i = 0 ; i < remove_mask.length ; i++ ) {
				if ( remove_mask[i] == 1 ) {
					has_answer = 1;
					break;
				}
			}
			if ( has_answer == 0 ) {
				// Simply 
				console.log( "No answer for this one, simply pick one" );
				let anyanswer = [];
				for ( i = 0 ; i < board.length ; i++ ) {
					if ( board[i] == 1 ) {
						anyanswer.push( i );
					}
				}
				let rndindex = ( Math.random() * anyanswer.length ) >> 0
				remove_mask[anyanswer[rndindex]] = 1;
                
			}
		}

		//print_board2( remove_mask , width , height , "answer. Depth: "+ depth + ", Rotated: "+ rotated );
		return remove_mask
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

        //console.log( "onPointerDown", intersects.length );

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

            //console.log( "onPointerDown", "item_id", item_id , "button_id", button_id );

            if ( button_id != null ) {
                this.button_onclick( button_id  );
            } else if ( item_id != null ) {
                this.piece_onclick( item_id );
            }
            return 0;

        } else {
            return null;
        }
    }

    //---
    //----------------
	init_pieces() {

        let mygame = this.mygame;

        for ( let i = 0 ; i < 16 ; i++ ) {
            let piece = mygame.cloneInstance( mygame.models["cube2"].scene );
            piece.tile     = new THREE.Vector2( i % 4, Math.floor(i / 4) );
            piece.tilesize = new THREE.Vector2(1,1);
            this.pieces_arr.push( piece );
        }            
	}

    //--------
    update( elapsed ) {

        let i;
		if ( this.mode == 2 ) {

			this.elapsed += 1;
			if ( this.elapsed >= 50 ) {
				
				if ( this.ai_response.length > 0 ) { 

					let pos = this.ai_response.shift();
					let piece = this.pieces_arr[pos];
                    piece.state = 0;
                    piece.children[0].children[0].material = this.mygame.materials["darkgrey2"];
    				this.mygame.snds["tick"].play();
				} else {
				
					//commit 
					let alive_tile_count = 0;
                    for ( i = 0 ; i < this.pieces_arr.length ; i++ ) {
                        let piece = this.pieces_arr[i];
	    				if ( piece.state == 0 ) {
                            piece.state = null;
                            this.root.remove( piece );
                        } else if ( piece.state == 1 ) {
	    					alive_tile_count += 1;
	    				}
	    			}
                    this.mygame.snds["tok1"].play();

	    			if ( alive_tile_count == 0 ) { 

	    				this.winner = "A.I";
	    				this.mode = 3;
                        this.mygame.snds["oof"].play();
                        this.mygame.display_text_effect("You Lose",  40 );
                        

	    			} else {
                        this.mode = 1;
                        this.mygame.display_text_effect("Your turn",  40 );
                    
					}
					this.state_to_button_visibility();
				}

				this.elapsed = 0
			}
		}
    }
}