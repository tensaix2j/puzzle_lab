import {Game, Scene} from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextureLoader } from 'three';
import { CubeTextureLoader } from 'three';

import { Capsule } from 'three/addons/math/Capsule.js';
import { Octree } from 'three/addons/math/Octree.js';
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { globalGameData } from '../GlobalGameData';

import { PuzLevel01 } from './Puzlevel01'
import { PuzLevel02 } from './Puzlevel02'
import { PuzLevel03 } from './Puzlevel03'
import { PuzLevel04 } from './Puzlevel04'
import { PuzLevel05 } from './Puzlevel05'
import { PuzLevel06 } from './Puzlevel06'
import { PuzLevel07 } from './Puzlevel07'
import { PuzLevel08 } from './Puzlevel08'
import { PuzLevel09 } from './Puzlevel09'
import { PuzLevel10 } from './Puzlevel10'
import { PuzLevel11 } from './Puzlevel11'
import { PuzLevel12 } from './Puzlevel12'
import { PuzLevel13 } from './Puzlevel13'
import { PuzLevel14 } from './Puzlevel14'
import { PuzLevel15 } from './Puzlevel15'
import { PuzLevel16 } from './Puzlevel16'
import { PuzLevel17 } from './Puzlevel17'
import { PuzLevel18 } from './Puzlevel18'
import { PuzLevel19 } from './Puzlevel19'
import { PuzLevel20 } from './Puzlevel20'
import { PuzLevel21 } from './Puzlevel21'
import { PuzLevel22 } from './Puzlevel22'



export class MyGame extends Scene {


    startTime: number = 0

    models = {};
    
    models_to_load = [
        "building",
        "floating_island",
        "cog",
        "cube",
        "cube2",
        "cubeframe",
        "tree_0",
        "tree_1",
        "tree_2",
        "gate",
        "rock_0",
        "rock_1",
        "bloxorplatform",
        "boxygiraffe",
        "myape",
        "apple",
        "orange",
        "banana",
        "anamorphic",
        "wall",
        "block",
        "yellowbutton",
        "robot",
        "floor"
    ]

    models_loaded = 0;
    game_state = -1;

    text_effect = {
        x: 0,
        y: 0,
        text: "",
        elapsed: 0,
        elapsed_threshold: 100,
        ticking: false
    };
    endtimer = {
        ticking: false,
        elapsed: 0,
        elapsed_threshold: 800
    }

    keystates = {};
    materials = {};
    smokes = [];
    recycle_bins = [];
    
    colliders = [];
    cogs = [];

    
    setting_PR    = 0.35;   // player radius (half-extent XZ)
    setting_PH    = 1.5;   // player height  feet→eye
    setting_player_speed = 0.015;
    setting_gravity = 0.0010;
    setting_jump_height = 0.40;

    constructor() {
        super('MyGame');
    }

    worldOctree = new Octree();
    score = 0;
    

    //----------------
    preload() {

        if ( this.preloaded == null ) {

            this._0x77665544 = Math.random;
            this._0x77665545 = Math.floor;

            this.all_textures = [
                'smokesplash',
                'grackoncurseboard',
                'symbols',
                'niminstruction',
                'buttonlbl',
                'crypticminute',
                'knightsmove',
                'hiddencodeinstruction',
                'hiddencode',
                'hidatoboard',
                'numbers100',
                'alphabets',
                'hiddenfruits',
                'spotdifference_1024_a',
                'spotdifference_1024_b',
                'anamorphic',
                'tangram',
                'tangramboard',
                'tetravexboard',
                'tetravexsquare',
                'kakuroboard',
                'rippleeffectboard',
                'rippleeffectinstruction',
                'squarerouteboard',
                'squarerouteinstruction',
                'hitoriinstruction',
                'bosnianinstruction',
                'flatrubikboard',
                'flatrubikinstruction',
                'sokobaninstruction'
                
            ];
            for ( let i = 0 ; i < this.all_textures.length ; i++ ) {
                this.load.image( this.all_textures[i] , 'images/' + this.all_textures[i] +'.png');
            }

            this.load.image( 'esc' , 'images/esc.png');
            this.load.image( 'lmb' , 'images/lmb.png');
            this.load.image( 'backspace' , 'images/backspace.png');
            this.load.image( 'close' , 'images/close.png');
            
                


            this.load.audio('applause', 'sounds/applause.mp3');
            this.load.audio('arrowhit', 'sounds/arrowhit.mp3');
            this.load.audio('buttonclick', 'sounds/buttonclick.mp3');
            this.load.audio('correct', 'sounds/correct.mp3');
            this.load.audio('crash', 'sounds/crash.mp3');
            this.load.audio('denied', 'sounds/denied.mp3');
            this.load.audio('jump', 'sounds/jump.mp3');
            this.load.audio('keypad', 'sounds/keypad.mp3');
            this.load.audio('oof', 'sounds/oof.mp3');
            this.load.audio('put', 'sounds/put.mp3');
            this.load.audio('scream', 'sounds/scream.mp3');
            this.load.audio('success', 'sounds/success.mp3');
            this.load.audio('tick', 'sounds/tick.mp3');
            this.load.audio('tok0', 'sounds/tok0.mp3');
            this.load.audio('tok1', 'sounds/tok1.mp3');
            this.load.audio('plop', 'sounds/plop.mp3');
            this.load.audio('plopwater', 'sounds/plopwater.mp3');
            this.load.audio('stone', 'sounds/stone.mp3');
            this.load.audio('switch', 'sounds/switch.mp3');
            this.load.audio('buttonshort', 'sounds/buttonshort.mp3');
            this.load.audio('bgm', 'sounds/lettinggo.mp3');
            
            
            
        }
    }

    //-----------
    on_model_loaded( modelname ) {

        console.log("MyGame::on_model_loaded" , modelname );
        
        this.models_loaded += 1;
        if ( this.models_loaded >= this.models_to_load.length ) { 
            
            console.log("MyGame::on_model_loaded: All Models loaded");
            
            this.setup_threejs();
            this.init_once();
            
            this.preloaded = 1;
            this.reinit_game_dispatch();
            
        }
    }

    


    //-----------
    cloneInstance( model  ) {
            
        if ( model.type == "Group"){ 

            let group = new THREE.Object3D();
            group.scale.set( model.scale.x, model.scale.y, model.scale.z );
            group.rotation.set( model.rotation.x, model.rotation.y, model.rotation.z );
            group.position.set( model.position.x, model.position.y, model.position.z );
            
            for ( let i = 0 ; i < model.children.length ; i++ ) {
                let child_item  = model.children[i];
                let cloned_child_item =  this.cloneInstance( child_item );
                group.add( cloned_child_item );
            };
            return group;
        } else { 
            
            let mesh_instance = new THREE.InstancedMesh( model.geometry , model.material, 10);
            mesh_instance.scale.set( model.scale.x, model.scale.y, model.scale.z );
            mesh_instance.rotation.set( model.rotation.x, model.rotation.y, model.rotation.z );
            mesh_instance.position.set( model.position.x, model.position.y, model.position.z );
            mesh_instance.name = model.name;
            
            return mesh_instance;
        }

    }


    //--------
    create_or_reuse_object( modelname ) {

        let obj;
        for ( let i = this.recycle_bins.length - 1 ; i >= 0; i-- ) {
            obj = this.recycle_bins[i];
            
            if ( obj.modelname == modelname ) {
                this.recycle_bins.splice( i , 1 );
                this.threejs_scene.add( obj );
                return obj;
            }
        }
        // Nothing from recycle bin, so create new.
        obj = this.cloneInstance( this.models[ modelname ].scene  );
        obj.modelname       = modelname;
        return obj;        
    }


    //-------------
    clear_smokes() {
        
        for ( let i = this.smokes.length - 1 ; i >= 0 ; i-- ) {

            let obj = this.smokes[i];
            this.recycle_bins.push( obj );
            this.threejs_scene.remove( obj );
            this.smokes.splice( i , 1 );
        }
    }

    //---------------
    create_smoke( x, y, z , size ) {

        let obj = null;
        let modelname = "smokesplash";

        for ( let i = this.recycle_bins.length - 1 ; i >= 0; i-- ) {
            let iobj = this.recycle_bins[i];
            if ( iobj.modelname == modelname ) {
                obj = iobj;
                this.recycle_bins.splice( i , 1 );
            }
        }
        if ( obj == null ) {
            let planeGeometry    = new THREE.PlaneGeometry( 1, 1, 1, 1 );
            obj = new THREE.Mesh( planeGeometry, this.materials[modelname] );
            this.setUV( planeGeometry.attributes.uv,  4,4,0,0 );
            obj.modelname = modelname;        
        }

        
        obj.frame_index = 0;
        obj.frame_index_max = 10;
        obj.elapsed = 0;
        obj.elapsed_threshold = 35;

        obj.position.set( x , y ,z );
        obj.scale.set( size, size, size );
        obj.rotation.z = Math.random() * Math.PI * 2;
        obj.rotation.x = 0;
        obj.rotation.y = 0;
        obj.lookAt( this.threejs_camera.position);
        obj.renderOrder = 1;
        
        this.threejs_scene.add( obj );
        this.smokes.push( obj );
        return obj;

    }

    //----------
    create() {

        this.loadingText = this.add.text( this.sys.game.scale.width/2,
            100, 'Loading...', {
                fontFamily: 'Helvetica',
                fontSize: '40px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8
            }).setOrigin(0.5,0.5).setDepth(101);

        

        let x = 10;
        let y = this.sys.game.scale.height - 10;

        this.lmb = this.add.image(x, y, 'lmb').setOrigin(0, 1).setAlpha(0.8);
        this.lmb.setScale(0.4, 0.4 );
        this.lmb.flipX = true;
        this.lmb.setVisible(0);    

        x = 60;
        y = this.sys.game.scale.height - 40;
        this.instruction = this.add.text(x,y, "to lock cursor", {
            font: '14px Inter',
            fill: '#fff'
        }).setAlpha(0.4);

        // Tell user about mouse
        //“Click to start (mouse will be captured). Press ESC to exit.”

        const version = this.sys.game.config.gameVersion; 
        x = this.sys.game.scale.width - 10;
        y = this.sys.game.scale.height - 14;
        const versiontxt = this.add.text( x, y , version, {
            font: '10px Inter',
            fill: '#fff',
        }).setOrigin(1, 1); 



        // score
        this.score = globalGameData.puzzlelab_score

        y = 10;        
        this.scoreTxt = this.add.text( x, y, "", {
            font: '20px Inter',
            fill: '#fff',
            stroke: '#000000',       // Border color (red)
            strokeThickness: 8       // Border thickness
        }).setOrigin(1,0);
        this.render_score();


        this.debugtxt = this.add.text( 10, 10, "", {
            font: '20px Inter',
            fill: '#fff',
        }).setOrigin(0,0);
        

        this.ingame_cursor = this.add.graphics();
        this.ingame_cursor.lineStyle(2, 0x000000, 1);
        this.ingame_cursor.strokeCircle( this.sys.game.scale.width/2, this.sys.game.scale.height/2, 6);
        this.ingame_cursor.lineStyle(2, 0xffffff, 1);
        this.ingame_cursor.strokeCircle( this.sys.game.scale.width/2, this.sys.game.scale.height/2, 4);
        
        this.ingame_cursor.setVisible(0);
        this.input.mouse.disableContextMenu();
        
        this.text_effect.sprite = this.add.text( 
            this.sys.game.scale.width  * 0.5  , 
            this.sys.game.scale.height * 0.5 , 
            " ",
            {
                font: '150px creepycrawlersrotal',
                fill: '#ffffff',
                stroke: '#000000',       // Border color (red)
                strokeThickness: 8       // Border thickness
            }
        ).setOrigin(0.5, 0.5).setDepth(1);

        this.create_onscreen_keyboard();

        
        
        if ( this.created == null ) {
            this.snds = {};
            this.snds["applause"] = this.sound.add('applause');
            this.snds["arrowhit"] = this.sound.add('arrowhit');
            this.snds["buttonclick"] = this.sound.add('buttonclick');
            this.snds["correct"] = this.sound.add('correct');
            this.snds["crash"] = this.sound.add('crash');
            this.snds["denied"] = this.sound.add('denied');
            this.snds["jump"] = this.sound.add('jump');
            this.snds["keypad"] = this.sound.add('keypad');
            this.snds["oof"] = this.sound.add('oof');
            this.snds["put"] = this.sound.add('put');
            this.snds["scream"] = this.sound.add('scream');
            this.snds["success"] = this.sound.add('success');
            this.snds["stone"] = this.sound.add('stone');
            this.snds["switch"] = this.sound.add('switch');
            this.snds["buttonshort"] = this.sound.add('buttonshort');
            this.snds["tick"] = this.sound.add('tick');
            this.snds["tok0"] = this.sound.add('tok0');
            this.snds["tok1"] = this.sound.add('tok1');
            this.snds["plop"] = this.sound.add('plop');
            this.snds["plopwater"] = this.sound.add('plopwater');
            
            this.snds["bgm"] = this.sound.add('bgm', { loop: true });
            this.snds["bgm"].play();
            
            

            // load glb
            const gltfloader = new GLTFLoader();
            let _this = this;

            for ( let i = 0 ; i < this.models_to_load.length; i++ ) {

                let modelname = this.models_to_load[i];
                console.log("Loading", modelname );


                gltfloader.load(
                    'models/' + modelname + '.glb',
                    function (gltf) {
                        _this.models[ modelname ] = gltf;
                        _this.on_model_loaded( modelname );
                    },
                    undefined,
                    function (error) {
                        console.error('An error occurred while loading the model:', error);
                    }
                );
            }
            
        }
        this.created = 1;
        
        this.input.keyboard.on('keydown', this.onKeyDown, this);
        this.input.keyboard.on('keyup', this.onKeyUp, this);
        this.input.on('pointerdown', this.onPointerDown, this );
        this.input.on('pointerup', this.onPointerUp, this );
        this.input.on('pointermove', this.onPointerMove, this );
        this.input.manager.events.on('pointerlockchange', this.onPointerLock, this);
        this.input.on('gameobjectdown', this.onGameObjectDown, this );

        this.reinit_game_dispatch();
        
    }


    //----
    onPointerLock( pointer ) {

        if ( !this.input.mouse.locked ) {
            this.ingame_cursor.setVisible(0);
            this.instruction.setText("to lock cursor");
            

        } else {
            this.ingame_cursor.setVisible(1);
            this.instruction.setText("to release cursor");
            
        }
    }

    //-----------------
    // bookmark6
    onPointerDown( pointer ) {

        //console.log("onPointerDown");
        if ( this.game_state == 0 ) {
        
            if ( pointer.button == 2 ) {

                if ( this.input.mouse.locked == false )  {
                    console.log("Request pointer lock");
                    this.input.mouse.requestPointerLock();
                }  else {
                    console.log("Request pointer release");
                    this.input.mouse.releasePointerLock();
                }

            } else {
                
                this.keystates["touchstart"] = 1;
                let puz = this.get_active_puzzles();
                let ret;
                if ( puz != null ) {
                    ret = puz.onPointerDown( pointer );
                }
                this.puzzles[9].onPointerDown( pointer );
            }
        }
        
        
    }
    //---
    onGameObjectDown( pointer, item ) {

        //console.log( "OnGameObjectDown", item.button_id );
        if ( item.button_id == "close" ) {
            this.game_state = 0;
            this.osk.setVisible(0);
            this.snds["tok0"].play();
        } else { 

            this.snds["buttonclick"].play();
                    
            if ( item.button_id == 10 ) {
                this.osk.txtField.setText( this.osk.txtField.text.slice(0, -1) );
            } else if ( item.button_id == 38 ) {
                if ( this.osk.target != null ) {
                    this.osk.target.onTextInput(  this.osk.txtField.text ); 
                }
                this.game_state = 0;
                this.osk.setVisible(0);
                this.snds["tok0"].play();
                
            } else { 
                if ( this.osk.txtField.text.length < 38 ) {
                    let kb_keys = "1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ "
                    let ch = kb_keys[ item.button_id ];
                    this.osk.txtField.setText( this.osk.txtField.text + ch );
                    
                }
            }
        }
    }



    //-----------------
    onPointerUp( pointer ) {

        if ( this.keystates["touchstart"] == 1 ) {
            
            this.keystates["touchstart"] = null;
        }
    }


    //-----------------
    onPointerMove( e ) {
        
        if ( this.game_state == 0 ) {
            if ( this.input.mouse.locked == false )  {
                return ;
            }
            this.player.rotation.y   -= ( e.movementX * 0.002 );
            this.player.rotation.x -= e.movementY * 0.002;
            this.player.rotation.x  = Math.max(-1.3, Math.min(1.3, this.player.rotation.x ));   

            let deg360 = 2 * Math.PI;
            let deg180 = Math.PI;
            this.player.rotation.y = ( ( (  this.player.rotation.y + deg180 ) % deg360 ) + deg360 ) % deg360 - deg180;
        }
    }
    
    //---------------
    // bookmark2
    onKeyDown(event) {
        switch (event.key) {

            case 'Escape':
                break;

            case ' ':
                this.player_jump();

                break;

            case 'w':
            case 'W':
            case 'ArrowUp':
                            
                this.keystates[38] = 1;
                this.keystates[40] = null;
                
                break;

            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.keystates[37] = 1;
                this.keystates[39] = null;
                
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                
                this.keystates[40] = 1;
                this.keystates[38] = null;
                
                break;

            case 'd':
            case 'D':
            case 'ArrowRight':
                this.keystates[37] = null;
                this.keystates[39] = 1;
                break;

            case 'r':
            case 'R':
            case 'f':
            case 'F':
            case 't':
            case 'T':
            case 'g':
            case 'G':
            case 'y':
            case 'Y':
            case 'u':
            case 'U':
            case 'h':
            case 'H':
            case 'j':
            case 'J':
            case 'i':
            case 'I':
            case 'o':
            case 'O':
            case 'k':
            case 'K':
            case 'l':
            case 'L':
                this.onKeyDown_to_puzzle( event.key );
                break;


            case '1':
                this.reposition_objects();
                break;
            
            case '2':
                break;

            case '3':
                
                
                break;
            
            case '4':
                break;
            
            default:
                break;
        }


    }


    //---------------
    onKeyUp(event) {
        switch (event.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.keystates[38] = null;
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.keystates[37] = null;
                
                break;
            case 's':
            case 'S':
            case 'ArrowDown':

                this.keystates[40] = null;
                
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.keystates[39] = null;
                
                break;

            case 'r':
            case 'R':
            case 'f':
            case 'F':
            case 't':
            case 'T':
            case 'g':
            case 'G':
            case 'y':
            case 'Y':
            case 'u':
            case 'U':
            case 'h':
            case 'H':
            case 'j':
            case 'J':
            case 'i':
            case 'I':
            case 'o':
            case 'O':
            case 'k':
            case 'K':
            case 'l':
            case 'L':
                this.onKeyUp_to_puzzle( event.key );
                break;
            
            default:
                break;
        }
    }

    //----
    onKeyDown_to_puzzle( key ) {
        
        let puz = this.get_active_puzzles2();
        if ( puz ) {
            puz.onKeyDown(key);
        }
    }

    //----
    onKeyUp_to_puzzle( key ) {
        
        let puz = this.get_active_puzzles2();
        if ( puz ) {
            puz.onKeyUp(key);
        }
    }


    //----
    setUV( uvAttribute, rows,cols, row, col ) {
        
        let use_row = rows - row - 1;
        uvAttribute.setXY( 0 , (col+0)/cols , (use_row+1)/rows );
        uvAttribute.setXY( 1 , (col+1)/cols , (use_row+1)/rows );
        uvAttribute.setXY( 2 , (col+0)/cols , (use_row+0)/rows );
        uvAttribute.setXY( 3 , (col+1)/cols , (use_row+0)/rows );
        uvAttribute.needsUpdate = true;
        
    }

    

    //-------------------
    setup_threejs() {
        
        console.log("Setup Threejs");
        
        // Create Three.js scene
        this.threejs_renderer = new THREE.WebGLRenderer({alpha:true});
        this.threejs_renderer.setSize( this.sys.game.scale.width, this.sys.game.scale.height);
        this.threejs_renderer.setClearColor(0x222222, 1);
        
        this.threejs_renderer.shadowMap.enabled = true; 
        this.threejs_renderer.shadowMap.type = THREE.BasicShadowMap;
        

        let threejs_canvas = this.threejs_renderer.domElement;
        
        document.getElementById("game-container-parent").appendChild( threejs_canvas );
        threejs_canvas.style.width  = document.getElementById("game-container").style.width;
        threejs_canvas.style.height = document.getElementById("game-container").style.height;
        threejs_canvas.style.position = "absolute";
        threejs_canvas.style.left = "0px";
        threejs_canvas.style.top = "0px";
        

        document.getElementById("game-container").style.zIndex = 2;
        document.getElementById("game-container").style.backgroundColor = "rgba(0,0,0,0)";
        

        this.threejs_scene = new THREE.Scene();
        this.threejs_camera = new THREE.PerspectiveCamera(
            65, 
            this.sys.game.scale.width / this.sys.game.scale.height, 
            0.1, 
            1000
        );
        
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3 );
        this.threejs_scene.add(ambientLight);
        
        
        // HDR

        const pmremGenerator = new THREE.PMREMGenerator( this.threejs_renderer );
        
        let _this = this;
        
        const cubeImages = [
            'images/px.png',  // right
            'images/nx.png',  // left
            'images/py.png',  // top
            'images/ny.png',  // bottom
            'images/pz.png',  // front
            'images/nz.png'   // back
        ];
        let loader = new THREE.CubeTextureLoader();
        loader.load( cubeImages , function (texture) {
            _this.threejs_scene.environment = texture; 
            _this.threejs_scene.background = texture;  // optional: visible sky            
        });

        // 1. Create composer
        const composer = new EffectComposer( this.threejs_renderer);

        // 2. Add normal render pass
        const renderPass = new RenderPass( this.threejs_scene, this.threejs_camera);
        composer.addPass(renderPass);

        // 3. Add bloom pass
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(1200, 900),
            0.25,    // strength
            0.85,    // radius
            0.85    // threshold
        );
        composer.addPass(bloomPass);
        this.threejs_composer = composer;
        
        
        
    }

    
    //------------
    countOnes(num) {
        let count = 0;
        while (num !== 0) {
            num &= (num - 1); // removes lowest set bit
            count++;
        }
        return count;
    }

    //----
    render_score() {
        let solved = this.countOnes( this.score ) ;
        this.scoreTxt.setText( "Solved : " + solved + "/22" );
        
    }

    //---
    completed_level(  level ) {
        
        this.score = this.score | ( 1 << (level - 1) ) ;
        document.dispatchEvent(new CustomEvent('submit', {detail: {score: this.score }}));
        this.render_score();

    }


    //---
    checkIsMobile() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }



     //---
     create_cog( x,y,z, size, mat , angular_speed , y_rot) {
        let cog     = this.cloneInstance( this.models["cog"].scene );
        cog.position.set(x,y,z );
        cog.scale.set( size, size, 1 );
        cog.children[0].material = mat;
        cog.angular_speed = angular_speed;
        cog.rotation.y = y_rot;

        let cogOL   = cog.clone();
        cogOL.children[0].material = this.materials["backside_black"];
        cogOL.position.set(0,0,0);
        cogOL.scale.set( 1.05, 1.05, 1.05 );
        cogOL.rotation.set(0,0,0);
        cog.add( cogOL );
        
        this.threejs_scene.add( cog );
        return cog;
     }

     //---
     create_gate( x,y,z , y_rot) {

        let gate = this.cloneInstance( this.models["gate"].scene );
        y -= Math.random() * 0.5 ;
        gate.scale.set( 3.0 , 3.0, 3.0);
        gate.position.set( x,y,z );
        gate.rotation.y = y_rot;

        this.threejs_scene.add( gate );        
    }


    //-----
    create_onscreen_keyboard() {

        this.osk = this.add.container(
            this.sys.game.scale.width  * 0.5 ,
            this.sys.game.scale.height * 0.7
        );

        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffffff, 1);     // white border (2px)
        graphics.fillStyle(0x110503, 0.85);      // black fill, 50% opacity
        let w = 800;
        let h = 400;
        graphics.fillRoundedRect(  -w/2, -h/2,   w, h, 20 );
        graphics.strokeRoundedRect(-w/2, -h/2,   w, h, 20 );
         
        // txtField
        graphics.strokeRoundedRect(-w/2 + 20, -h/2 + 20,   w - 40, 60, 10 );
        
        this.osk.txtField = this.add.text( -w/2 + 30, -h/2 + 30 , "", {
            fontFamily: '"Helvetica"',
            fontSize: '30px',
            color: '#ffffff',
        }).setOrigin(0,0);
        
        this.osk.add( graphics );
        this.osk.add( this.osk.txtField );

        let bw = 60;
        let bh = 50;
        let hgap = 10;
        let vgap = 10;
        let tbw = (bw + hgap) * 11;
        let tbh = (bh + vgap) * 4;
        let kb_keys = "1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        for ( let i = 0 ; i < 39 ; i++ ) {

            let bx = ( i % 11 )         * (bw + hgap)           - tbw/2 ;
            let by = (( i / 11 ) >> 0 ) * (bh + vgap)           - tbh/2 + 50;
            
            let ubw = bw;
            let ubx = bx;
            if ( i >= 37 ) {
                ubw = bw * 2;
                if ( i >= 38 ) {
                    ubx = bx + ubw * 0.5;
                }
            }   
            
            let kb_button = this.add.graphics();
            kb_button.lineStyle(2, 0xffffff, 1);     // white border (2px)
            kb_button.strokeRoundedRect( ubx, by ,   ubw, bh, 8 );
            kb_button.button_id = i;
            kb_button.setInteractive(
                new Phaser.Geom.Rectangle(
                    ubx, 
                    by, 
                    ubw, 
                    bh
                ), Phaser.Geom.Rectangle.Contains
            ); 
            
            let kb_button_lbl;
            if ( i == 10 ) {
                kb_button_lbl = this.add.image(bx + bw/2, by + bh/2, 'backspace' ).setScale(0.3,0.3);
            
            } else {
                let txt = kb_keys[i];
                if ( i == 37 ) { 
                    txt = "Space";
                } else if ( i == 38 ) {
                    txt = "Enter"
                }
                kb_button_lbl = this.add.text( ubx + ubw/2, by + bh/2, txt, {
                    fontFamily: '"Helvetica"',
                    fontSize: '24px',
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 8
                }).setOrigin(0.5,0.5);
            }
            this.osk.add( kb_button  );
            this.osk.add( kb_button_lbl );

            let kb_close_button = this.add.image( w/2, -h/2, 'close' ).setScale(0.3,0.3);
            kb_close_button.setInteractive();
            kb_close_button.button_id = "close";
            this.osk.add( kb_close_button );
            
        }   
        this.osk.setVisible(0);
        
    }


    //-----------------
    create_item_plane( material, x,y,z, size_x, size_y, rows, cols, row, col ) {
        
        let planeGeometry    = new THREE.PlaneGeometry( 1, 1, 1, 1 );
        let tile = new THREE.Mesh( planeGeometry, material );
        this.setUV( planeGeometry.attributes.uv, rows, cols , row, col );
        tile.position.set( x , y ,z );
        tile.scale.set( size_x, size_y, 1 );
        //tile.rotation.set( 0 , Math.PI , 0 );
        
        return tile;
    }




    //----
    create_building( x,y,z , y_rot ) {

        let building = this.cloneInstance( this.models["building"].scene );
        building.position.set( x,y,z );
        building.rotation.y = y_rot;
        building.children[0].receiveShadow = true;

        let mesh_to_be_removed = [];
        building.traverse((child) => {

            
            if ( child.isMesh ) {

                if ( child.name.indexOf('collider') > -1 ) {
                    this.worldOctree.fromGraphNode( child );  
                    mesh_to_be_removed.push( child );   
                
                } else if ( child.name == "Cube024_1" ) {

                    this.materials["poap"] = child.material;

                } else if ( child.material.name.indexOf( 'Glass' ) > -1 ) {

                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x999999,         // glass color
                        metalness: 0,             // not metallic
                        roughness: 0,          // low roughness = sharp reflection
                        transparent: true,        // allow transparency
                        transmission: 1,
                        opacity: 0.4,            // adjust transparency
                        clearcoat: 1,             // adds extra glossy layer
                        clearcoatRoughness: 0,    // makes clearcoat perfectly reflective
                        envMap: this.threejs_scene.environment, // HDRI for reflections
                        envMapIntensity: 4,       // controls reflection strength
                        
                    });
                } else {
                    
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            }   
        });
        
        for ( let i = 0 ; i < mesh_to_be_removed.length ; i++ ) {
            let child = mesh_to_be_removed[i];
            child.geometry.dispose();

            if ( child.material ) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
            child.parent.remove(child);
        }
        this.threejs_scene.add( building );
        
    }

    //------
    create_materials() {

        // Basic colors
        this.materials["backside_black"] = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.BackSide
        });

        this.materials["brown"] = new THREE.MeshBasicMaterial({ color: 0x26201a });
        this.materials["yellow"] = new THREE.MeshBasicMaterial({ color: 0xbbbb00 });
        this.materials["orange"] = new THREE.MeshBasicMaterial({ color: 0xdd9731 });
        
        this.materials["darkgrey"] = new THREE.MeshBasicMaterial({ color: 0x222222 });
        this.materials["darkgrey2"] = new THREE.MeshBasicMaterial({ color: 0x111111 });
        this.materials["blue"] = new THREE.MeshBasicMaterial({ color: 0x0e1318 });
        this.materials["white"] = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        this.materials["cyan"] = new THREE.MeshBasicMaterial({ color: 0x30bbaa });
        this.materials["metalblue"] = new THREE.MeshStandardMaterial({
            color: 0x000022,   // base color
            metalness: 1.0,    // fully metallic
            roughness: 0.0     // lower = shinier
        });

        this.materials["emigreen"] = new THREE.MeshStandardMaterial({
            emissive: 0x00ff00,   // base color
            emissiveIntensity: 4,
        });
        this.materials["emiwhite"] = new THREE.MeshStandardMaterial({
            emissive: 0xffffff,   // base color
            emissiveIntensity: 2,
        });


        // Textures
        for ( let i = 0 ; i < this.all_textures.length ; i++ ) {
            let texture_name = this.all_textures[i];
            let phaserTexture = this.textures.get(texture_name).getSourceImage();
            let texture = new THREE.Texture( phaserTexture );
            
            texture.needsUpdate = true;  
            texture.colorSpace = THREE.SRGBColorSpace; 
            
            this.materials[texture_name] = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthWrite: false,
            });

            if ( ["numbers100"].indexOf( texture_name )  > -1 ) {
                this.materials[texture_name].color.set( 0x000000 );
                this.materials[texture_name + "_b"] = this.materials[texture_name].clone();
                this.materials[texture_name + "_b"].color.set( 0x009999 );
            } else if (  ["symbols"].indexOf( texture_name )  > -1 ) { 
                this.materials[texture_name].color.set( 0x000000 );
                this.materials[texture_name + "_r"] = this.materials[texture_name].clone();
                this.materials[texture_name + "_r"].color.set( 0xff0000 );
            }
            
        }

    }


    //----
    // Only called once upon models loaded.
    // bookmark0
    init_once() {
        

        this.create_materials();


        // Light
        let light = new THREE.DirectionalLight(0xffe3a1, 1.2);
        light.position.set(  -40,  70,  30); // Position the light source
        light.castShadow = true; // Enable shadow casting

        light.shadow.camera.left = -60;  // Increase/decrease to enlarge/narrow the shadow area
        light.shadow.camera.right = 60;
        light.shadow.camera.top = 60;
        light.shadow.camera.bottom = -60;

        light.shadow.camera.near = 1;
        light.shadow.camera.far = 100;
        light.shadow.mapSize.width = 4096; // Default is 512, can increase to 2048, 4096, or higher
        light.shadow.mapSize.height = 4096; 
        light.shadow.bias = -0.0005;

        this.light = light;
        this.threejs_scene.add(light);

        
        // building
        this.create_building(0 , 0, 0, 0 ) ;
        


        // Gear
        /*
        let c;
        c = this.create_cog( 0, 10   , 8.3, 1.5 , this.materials["yellow"] , 0.005 , 0 );
        this.cogs.push( c );
        c = this.create_cog( 4.5, 15 , 8.3,  0.8 ,  this.materials["orange"], -0.005 , 0);
        this.cogs.push( c );
        c = this.create_cog( -4, 15  , 8.3,  0.6 ,  this.materials["cyan"], -0.005 , 0 );
        this.cogs.push( c );
        
        c = this.create_cog(  8.3 , 15  , 0,  0.6 ,  this.materials["white"], -0.005 , Math.PI/2 );
        this.cogs.push( c );
        c = this.create_cog(  8.3 , 12  , 4,  1.1 ,  this.materials["white"], 0.005 , Math.PI/2 );
        this.cogs.push( c );
        */
        
        // Trees
        let tree_coords = [
            { x: -3.979, z: 13.206 },
            { x: 2.399, z: 19.318 },
            { x: 23.127, z: -5.130 },
            { x: -32.679, z: 8.954 },
            { x: -40.784, z: 12.674 },
            { x: -31.749, z: 17.723 },
            { x: -38.658, z: -39.012 },
            { x: -33.476, z: -32.900 },
            { x: -4.510, z: -32.634 },
            { x: 3.329, z: -38.082 },
            { x: 12.896, z: -34.628 },

            { x: -7.212, z: -19.170 },
            { x: -2.060, z: -22.477 },
            { x: -2.522, z: -17.479 },


        ]
        for ( let i = 0 ; i < tree_coords.length ; i++ ) {

            let type = i % 3;
            let tree = this.cloneInstance( this.models["tree_" + type ].scene );

            let coord = tree_coords[i]            
            let x = coord.x;
            let z = coord.z;            
            tree.position.set( x , 0 , z );
            tree.scale.set( 15 , 15, 15 );
            tree.rotation.y = Math.random() * Math.PI - Math.PI/2;
            this.castShadow( tree );

            this.threejs_scene.add( tree );
        }




        // Rocks
        let rock_coords = [
            { x: -12.837, z: 10.327 },
            { x: 7.869, z: -35.403 },
            { x: -34.539, z: 13.206 },
            { x: 23.259, z: -1.410 },
        ];
        for ( let i = 0 ; i < rock_coords.length ; i++ ) {

            let type = i % 2;
            let obj = this.cloneInstance( this.models["rock_" + type ].scene );

            let coord = rock_coords[i]            
            let x = coord.x;
            let z = coord.z;            
            obj.position.set( x , 0 , z );
            obj.scale.set( 2,2,2 );
            obj.rotation.y = Math.random() * Math.PI - Math.PI/2;
            this.castShadow( obj );
            
            this.threejs_scene.add( obj );
        }







        // Gates 

        // H
        for ( let i = 0 ; i < 18 ; i++ ) {

            let x = ( i - 11 ) * 4.2;
            let z = 27;
            this.create_gate( x, 0 ,         z  , 0 );
            this.create_gate( x, 0 , -z - 21.5  , 0 );
        }
        this.create_invisible_wall( 0, 0 ,   27     , 100, 2000,  1  ) ;
        this.create_invisible_wall( 0, 0 ,  -48.5   , 100, 2000,  1  ) ;
        

        // V
        for ( let i = 0 ; i < 18 ; i++ ) {
            let x = 27;
            let z = ( i - 11 ) * 4.2;
            this.create_gate(  x +  0 ,  0 , z , Math.PI/2);
            this.create_gate( -x - 21,  0 , z, Math.PI/2 ); 
        }

        // Boundarys
        this.create_invisible_wall( -48, 0 ,  0   ,  1, 2000, 100  ) ;
        this.create_invisible_wall(  25, 0 ,  0   ,  1, 2000, 100  ) ;
        
        

        // island
        this.island = this.cloneInstance( this.models["floating_island"].scene );
        this.island.scale.set( 320, 320, 320);
        this.receiveShadow( this.island );
        this.threejs_scene.add( this.island );

        //.updateMatrixWorld(true);
        this.worldOctree.fromGraphNode( this.island );
        
        
        // bookmark3
        // player
        this.player = {
            collider: new Capsule( 
                new THREE.Vector3( 0, 0, 0 ), 
                new THREE.Vector3( 0, this.setting_PH, 0 ), 
                this.setting_PR 
            ),
            rotation : new THREE.Euler(0,0,0),
            speed: this.setting_player_speed,
            velocity : new THREE.Vector3(0,0,0),
            direction: new THREE.Vector3(0,0,0)
        }
        

        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 14;


        // bookmark4
        // Puzzles.
        this.puzzles = [
            new PuzLevel01( this, -42.5, 4.75,  -4, Math.PI/2 ),
            new PuzLevel02( this, -42.5, 4.75, -18, Math.PI/2 ),
            new PuzLevel03( this, -26.6, 4.75, -31, Math.PI/2 ),
            new PuzLevel04( this, -26.5, 13, -34, Math.PI/2 ),
            new PuzLevel05( this, -42.5, 13, -18, Math.PI/2 ),
            new PuzLevel06( this, -42.5, 14, -4, Math.PI/2 ),
            new PuzLevel07( this, -27.5, 3.5, -31, -Math.PI/2 ),
            new PuzLevel08( this, 8, 9.375, -16, 0 ),
            new PuzLevel09( this, -43, 23, -20,  Math.PI/2 ),
            new PuzLevel10( this, 0,  0 , 0,  0 ),
            new PuzLevel11( this, -43, 23 , -4, Math.PI/2 ),
            new PuzLevel12( this, 12, 24 , -19, 0 ),
            new PuzLevel13( this, -43,  37.5 , -3, Math.PI/2 ),
            new PuzLevel14( this, -43,  37.5 , -19, Math.PI/2 ),
            new PuzLevel15( this, -13.5,  38 , -23, -Math.PI/2 ),
            new PuzLevel16( this,  12,  34.25 , -20, -Math.PI/2 ),
            new PuzLevel17( this,  17.8,  37.5 ,  -6, -Math.PI/2 ),
            new PuzLevel18( this,  17.8,  45.0 ,  -5.5, -Math.PI/2 ),
            new PuzLevel19( this,  -4,  28 ,  -18.5,  0 ),
            new PuzLevel20( this,  -43,  45.5 ,  -19, Math.PI/2 ),
            new PuzLevel21( this,  -43,  45.5 ,  -10, Math.PI/2 ),
            new PuzLevel22( this,   11,  45.5 ,  -26.5, 0 ),
        ]
        
        this.puzzles_group_01 = []

        // Mouse
        for ( let i = 0; i < this.puzzles.length ; i++ ) {
            let puz = this.puzzles[i];
            if ( i != 9 && i != 18 ) {
                this.puzzles_group_01.push( puz );
            }
        }

        // Keyboard
        this.puzzles_group_02 = [
            this.puzzles[11],
            this.puzzles[15],
            this.puzzles[18],

        ]
        
            
        
        // Giraffe and ape.
        this.boxygiraffe = this.cloneInstance( this.models["boxygiraffe"].scene );
        this.boxygiraffe.position.set( 17, 0, -34);
        this.boxygiraffe.rotation.set( 0 , Math.PI , 0 );
        this.addCollider( this.boxygiraffe )
        this.castShadow( this.boxygiraffe );
        this.threejs_scene.add( this.boxygiraffe );

        this.myape = this.cloneInstance( this.models["myape"].scene );
        this.myape.position.set( 20, 0, -34);
        this.myape.rotation.set( 0 , Math.PI , 0 );
        this.addCollider( this.myape )
        this.castShadow( this.myape );
        this.threejs_scene.add( this.myape );

        
        
        //let helper = new OctreeHelper( this.worldOctree );
		//helper.visible = true;
		//this.threejs_scene.add( helper );

        /*
        this.arrowHelper = new THREE.ArrowHelper(
            this.raycaster.ray.direction,   // direction of the ray
            this.raycaster.ray.origin,      // starting point of the ray
            100,                       // length
            0xff0000                   // color (red)
        );
        this.threejs_scene.add( this.arrowHelper );
        */
        
    }


    //----------------
    castShadow( model ) {
        model.traverse((child) => {
            if (child.isMesh && child.name.indexOf('collider') == -1 ) {
                child.castShadow = true;
            }
        });
    }
    //----------------
    receiveShadow( model ) {
        model.traverse((child) => {
            if (child.isMesh && child.name.indexOf('collider') == -1 ) {
                child.receiveShadow = true;
            }
        });
    }

    //---
    addCollider( model ) {
        
        let mesh_to_be_removed = [];
        model.traverse((child) => {
            if ( child.isMesh ) {
                if ( child.name.indexOf('collider') > -1 ) {
                    this.worldOctree.fromGraphNode( child );  
                    mesh_to_be_removed.push( child );   
                }
            }   
        });
        for ( let i = 0 ; i < mesh_to_be_removed.length ; i++ ) {
            let child = mesh_to_be_removed[i];
            child.geometry.dispose();
            if ( child.material ) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
            child.parent.remove(child);
        }
    }


    //---
    create_invisible_wall( x,y,z, sx,sy,sz) {
        const wallGeometry = new THREE.BoxGeometry(sx,sy,sz); // width, height, depth
        const wallMesh = new THREE.Mesh(wallGeometry);
        wallMesh.position.set(x,y,z); 
        this.worldOctree.fromGraphNode(wallMesh);  

        wallMesh.geometry.dispose();
        
    }

    //--------------
    reinit_game_dispatch() {

        if ( this.preloaded == 1 && this.created == 1 ) {
            // bookmark1
            console.log("reinit_game_dispatch");
            
            this.game_state = 0;
            this.endtimer.ticking = false;
            this.endtimer.elapsed = 0;
            this.text_effect.ticking = false;

            this.loadingText.setVisible(0);
            this.lmb.setVisible(1);
            
            
            this.clear_smokes();
            this.reposition_objects();
            
            // camera
            this.threejs_camera.position.set( 0 , 2, -4 );
            this.threejs_camera.lookAt( 0,0,0);


            window.aaa = this;
        }
    }
    
    //--------
    reposition_objects() {
        
        let y = 0;
        let x = 14;
        let z = 20;


        // DEBUG
        //x = 11;
        //y = 43;
        //z = -21;
        
        this.player.collider.start.set(  x , y , z );
        this.player.collider.end.set(    x , y + this.setting_PH , z );
        this.player.rotation.set(  0.2,  0.75,  0 );
        

        //this.player.rotation.set(   0,  0 ,  0 );

    }


    //----
    display_text_effect( caption, fontsize ) {

        this.text_effect.sprite.y = this.sys.game.scale.height * 0.5;
        this.text_effect.sprite.x = this.sys.game.scale.width * 0.5;
        this.text_effect.sprite.setText(caption + " " );

        this.text_effect.sprite.setAlpha( 1.0 );
        this.text_effect.ticking = true;
        this.text_effect.elapsed = 0;
        this.text_effect.sprite.setFontSize( fontsize);
       
        this.text_effect.elapsed_threshold = 4000;
    }

    

    //---
    text_effect_pos( elapsed  ) {
        
        if ( this.text_effect.ticking ) {
            if ( this.text_effect.elapsed >= this.text_effect.elapsed_threshold ) {

                this.text_effect.ticking = false;
                
            } else {
                
                this.text_effect.sprite.y -= 2;

                //console.log( this.text_effect.elapsed / this.text_effect.elapsed_threshold );
                if ( this.text_effect.elapsed / this.text_effect.elapsed_threshold >= 0.05 ) {
                    this.text_effect.sprite.setAlpha( this.text_effect.sprite.alpha - 0.01 );
                }
                this.text_effect.elapsed += elapsed
            }
        }
    }


    //---
    endtimer_pos( elapsed ) {

        if ( this.endtimer.ticking == true ) {
            if ( this.endtimer.elapsed >= this.endtimer.elapsed_threshold ) {
                this.player_die();
                this.endtimer.ticking = false;
                this.endtimer.elapsed = 0;
            } else {
                this.endtimer.elapsed += elapsed;
            }
        }
    }

    


    //----
    smoke_pos( elapsed )  {

        for ( let i = this.smokes.length - 1; i >= 0 ; i-- ) {

            let smoke = this.smokes[i];
            if ( smoke.elapsed >= smoke.elapsed_threshold ) {
                
                smoke.elapsed = 0;
                smoke.frame_index = smoke.frame_index + 1;

                let frame_x = smoke.frame_index % 4;
                let frame_y = ( smoke.frame_index / 4 ) >> 0;

                this.setUV(  smoke.geometry.attributes.uv, 4,4, frame_y, frame_x );
                
                if ( smoke.frame_index >= smoke.frame_index_max ) {
                    this.smokes.splice(i, 1 );
                    this.recycle_bins.push( smoke );
                    this.threejs_scene.remove( smoke );
                }
                
            } else {
                smoke.elapsed += elapsed;
            }
        }
    }


    //-------
    get_active_puzzles2() {
        let selected_puz;
        let selected_puz_dist = 99999;
        for ( let i = 0 ; i < this.puzzles_group_02.length ; i++ ) {
            
            let puz      = this.puzzles_group_02[i];
            let puz_dist =  puz.activepoint.distanceTo( this.player.collider.start );
            if ( puz_dist < selected_puz_dist ) {
                selected_puz = puz;
                selected_puz_dist = puz_dist;
            }
        }

        if ( selected_puz != null ) {
            //console.log( selected_puz.constructor.name );
        } else {
            //console.log("nothing");
        }
        return selected_puz;
    }
    
    //-------
    get_active_puzzles() {

        let selected_puz;
        let selected_puz_dist = 99999;
        for ( let i = 0 ; i < this.puzzles_group_01.length ; i++ ) {
            
            let puz      = this.puzzles_group_01[i];
            let puz_dist =  puz.activepoint.distanceTo( this.player.collider.start );

            if ( puz_dist <= puz.setting_active_range && 
                 Math.abs( puz.root.position.y - this.player.collider.end.y ) < puz.setting_active_range / 3 
                ) {

                let vDiff = new THREE.Vector3().subVectors( puz.root.position, this.player.collider.start );
                let angle = -Math.atan2( vDiff.x, -vDiff.z); 
                
                if ( Math.abs( angle - this.player.rotation.y ) < Math.PI * 2 /3  || [7,9].indexOf(i) > -1) {
                    
                    if ( puz_dist < selected_puz_dist ) {
                        selected_puz = puz;
                        selected_puz_dist = puz_dist;
                    }

                } else {
                    //console.log(i+1, "wrong angle", angle * 180/Math.PI, this.player.rotation.y * 180/Math.PI );
                }
            } else {
               //console.log(i+1, "too far");
            }
        }
        if ( selected_puz != null ) {
            //console.log( "get_active_puzzles", selected_puz.constructor.name );
        } else {
            //console.log("nothing");
        }
        return selected_puz;
    }



    //--------------
    pAABB(x,y,z) {
        return {
            min: new THREE.Vector3( x - this.setting_PR, y                   , z - this.setting_PR ),
            max: new THREE.Vector3( x + this.setting_PR, y + this.setting_PH , z + this.setting_PR ),
        };
    }

    //------------
    overlap(a,b) {
        return a.min.x<b.max.x && a.max.x>b.min.x
            && a.min.y<b.max.y && a.max.y>b.min.y
            && a.min.z<b.max.z && a.max.z>b.min.z;
    }

    //----------
    overlapXZ(a,b) {
        return a.min.x<b.max.x && a.max.x>b.min.x
            && a.min.z<b.max.z && a.max.z>b.min.z;
    }


    //--------
    player_jump( ) {

        if ( this.player.onGround == 1 ) { 
            this.player.velocity.y = this.setting_jump_height;
            this.player.onGround = null;
        }
        
    }



    //----------
    getForwardVector() {

        this.player.direction.set(0, 0, -1);           
        this.player.direction.applyEuler(this.player.rotation); 
        this.player.direction.y = 0;
        this.player.direction.normalize();
        return this.player.direction;    
    }


    //----------
    getSideVector() {

        this.player.direction.set(0, 0, -1);           
        this.player.direction.applyEuler(this.player.rotation); 
        this.player.direction.y = 0;
        this.player.direction.normalize();
        this.player.direction.cross( this.threejs_camera.up );
        return this.player.direction;    
    }

    //------------
    player_collisions() {

        let result = this.worldOctree.capsuleIntersect( this.player.collider );
        this.player.onGround = false;

        if ( result ) {

            this.player.onGround = result.normal.y > 0;
            
            if ( !this.player.onGround ) {
                this.player.velocity.addScaledVector( result.normal, - result.normal.dot( this.player.velocity ) );
            }
            if ( result.depth >= 1e-10 ) {
                this.player.collider.translate( result.normal.multiplyScalar( result.depth ) );
            }
        }
    }
    
    //----
    player_pos( elapsed ) {

        let damping = Math.exp( - 4 * elapsed ) - 0.5;

        if ( !this.player.onGround ) {
            // Flying
            this.player.velocity.y -= this.setting_gravity * elapsed;
            damping *= 0.10;
        } else {
            // On ground
            damping *= 0.20;
        }

        this.player.velocity.addScaledVector( this.player.velocity, damping );
        
        let speedDelta = this.player.speed * elapsed * 0.1 ;
        
        if ( this.keystates[38] == true ) {
            
            this.player.velocity.add( this.getForwardVector().multiplyScalar( speedDelta) );

        }   

        if ( this.keystates[40] == true ) {
            
            this.player.velocity.add( this.getForwardVector().multiplyScalar( -speedDelta) );

        }
        if ( this.keystates[37] == true ) {
            
            this.player.velocity.add( this.getSideVector().multiplyScalar( -speedDelta) );

        }
        
        if ( this.keystates[39] == true ) {
            this.player.velocity.add( this.getSideVector().multiplyScalar( speedDelta) );
            
        }
        
        this.player.collider.translate( this.player.velocity );

        this.player_collisions();


        /*
        this.debugtxt.setText( 
            this.player.collider.start.x.toFixed(2) + ", " +  
            this.player.collider.start.y.toFixed(2) + ", " + 
            this.player.collider.start.z.toFixed(2) + "\n"  +
            this.player.collider.end.x.toFixed(2) + ", " +  
            this.player.collider.end.y.toFixed(2) + ", " + 
            this.player.collider.end.z.toFixed(2) + "\n"  +
            this.player.velocity.x.toFixed(2) + ", " +  
            this.player.velocity.y.toFixed(2) + ", " + 
            this.player.velocity.z.toFixed(2) + "\n"  +
            this.player.rotation.x.toFixed(2) + ", " +  
            this.player.rotation.y.toFixed(2) + ", " + 
            this.player.rotation.z.toFixed(2) + "\n"  +
            this.player.direction.x.toFixed(2) + ", " +  
            this.player.direction.y.toFixed(2) + ", " + 
            this.player.direction.z.toFixed(2) + "\n"  +
            this.player.onGround 
        );
        */
        
    }

    //-------------
    camera_pos( elapsed ) { 
        
        this.threejs_camera.quaternion.setFromEuler(new THREE.Euler( this.player.rotation.x , this.player.rotation.y, 0, 'YXZ'));
        this.threejs_camera.position.set( 
            this.player.collider.end.x, 
            this.player.collider.end.y, 
            this.player.collider.end.z
        ); 

    }

    //----
    cog_pos( elapsed ) {
        for ( let i = 0 ; i < this.cogs.length ; i++ ) {
            let cog = this.cogs[i];
            cog.rotation.z += cog.angular_speed;
        }
    }

    //------------
    update(time, elapsed ) {
        
        if ( this.game_state == 0 ) {

            this.text_effect_pos( elapsed );
            this.endtimer_pos( elapsed );
            this.smoke_pos( elapsed );
            this.player_pos(elapsed);
            this.camera_pos( elapsed );
            this.cog_pos( elapsed );    
            
            this.puzzles[3].update( elapsed );
            this.puzzles[7].update( elapsed );
            this.puzzles[15].update( elapsed );
            
            
            //this.threejs_renderer.render( this.threejs_scene, this.threejs_camera );
            this.threejs_composer.render();

        }
    }
}