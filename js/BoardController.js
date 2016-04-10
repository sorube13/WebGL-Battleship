BATTLESHIP.BoardController = function (options) {
    'use strict';
    
    options = options || {};

    /**********************************************************************************************/
    /* Private properties *************************************************************************/

    /**
     * Store the instance of 'this' object.
     * @type BATTLESHIP.BoardController
     */
    var instance = this;

    /**
     * The DOM Element in which the drawing will happen.
     * @type HTMLDivElement
     */
    var containerEl = options.containerEl || null;
    
    /** @type String */
    var assetsUrl = options.assetsUrl || '';
    
    /** @type THREE.WebGLRenderer */
    var renderer;

    /** @type THREE.Projector */
    var projector;

    /** @type THREE.Scene */
    var scene;
    
    /** @type THREE.PerspectiveCamera */
    var camera;
    
    /** @type THREE.OrbitControls */
    var cameraController;
    
    /** @type Object */
    var lights = {};
        
    /** @type Object */
    var materials = {};
    
    /** @type THREE.Geometry */
    var carrierGeom = null;
    /** @type THREE.Geometry */
    var battleshipGeom = null;
    /** @type THREE.Geometry */
    var cruiserGeom = null;
    /** @type THREE.Geometry */
    var destroyerGeom = null;
    /** @type THREE.Geometry */
    var submarineGeom = null;
    
    /** @type THREE.Mesh */
    var boardModel;
    
    /** @type THREE.Mesh */
    var groundModel;
    
    /**
     * The board square size.
     * @type Number
     * @constant
     */
    var squareSize = 10;
    
    /**
     * The board representation.
     * @type Array
     */
    var board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    /** @type Object */
    //ar selectedPiece = null;

    /** @type Object */
    var callbacks = options.callbacks || {};
    
    
    /**********************************************************************************************/
    /* Public methods *****************************************************************************/
    
    /**
     * Draws the board.
     */
    this.drawBoard = function (callback) {
        initEngine();
        initLights();
        initMaterials();
        
        initObjects(function () {
            onAnimationFrame();
            
            callback();
        });

        //initListeners();
    };

    this.addPiece = function (piece){
        var pieceMesh;
        placePiece(piece);
        switch(piece.type){
            case 1:
                pieceMesh = new THREE.Mesh(submarineGeom, materials.blackPieceMaterial);
                break;
            case 2:
                pieceMesh = new THREE.Mesh(destroyerGeom, materials.blackPieceMaterial);
                break;
            case 3:
                pieceMesh = new THREE.Mesh(cruiserGeom, materials.blackPieceMaterial);
                break;
            case 4:
                pieceMesh = new THREE.Mesh(battleshipGeom, materials.blackPieceMaterial);
                break;
            case 5:
                pieceMesh = new THREE.Mesh(carrierGeom, materials.blackPieceMaterial);
                break;
            default:
                break;
        }
        pieceMesh.position = boardToWorld(piece);
        if(piece.orientation === 0){
            pieceMesh.rotation.y = 90 * Math.PI / 180; 
        }

        scene.add(pieceMesh);

    }
    
    
    
    /**********************************************************************************************/
    /* Private methods ****************************************************************************/

    /**
     * Initialize some basic 3D engine elements. 
     */
    function initEngine() {
        var viewWidth = containerEl.offsetWidth;
        var viewHeight = containerEl.offsetHeight;
        
        // instantiate the WebGL Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(viewWidth, viewHeight);

        projector = new THREE.Projector();
        
        // create the scene
        scene = new THREE.Scene();
        
        // create camera
        camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
        camera.position.set(squareSize * 5, 200, 300);
        cameraController = new THREE.OrbitControls(camera, containerEl);
        cameraController.center = new THREE.Vector3(squareSize * 5, squareSize * 2, 0);
        //
        scene.add(camera);
        
        containerEl.appendChild(renderer.domElement);
    }
    
    /**
     * Initialize the lights.
     */
    function initLights() {
        // top light
        lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(squareSize * 5, 150, squareSize * 5);
        lights.topLight.intensity = 0.4;
        
        // white's side light
        lights.whiteSideLight = new THREE.SpotLight();
        lights.whiteSideLight.position.set( squareSize * 5, 100, squareSize * 5 + 200);
        lights.whiteSideLight.intensity = 0.8;
        lights.whiteSideLight.shadowCameraFov = 55;

        // black's side light
        lights.blackSideLight = new THREE.SpotLight();
        lights.blackSideLight.position.set( squareSize * 5, 100, squareSize * 5 - 200);
        lights.blackSideLight.intensity = 0.8;
        lights.blackSideLight.shadowCameraFov = 55;
        
        // light that will follow the camera position
        lights.movingLight = new THREE.PointLight(0xf9edc9);
        lights.movingLight.position.set(0, 10, 0);
        lights.movingLight.intensity = 0.5;
        lights.movingLight.distance = 500;
        
        // add the lights in the scene
        scene.add(lights.topLight);
        scene.add(lights.whiteSideLight);
        scene.add(lights.blackSideLight);
        scene.add(lights.movingLight);
    }
    
    /**
     * Initialize the materials.
     */
    function initMaterials() {
        // board material
        // materials.boardMaterial = new THREE.MeshLambertMaterial({
        //     map: THREE.ImageUtils.loadTexture(assetsUrl + 'board_texture.jpg')
        // });
        materials.boardMaterial = new THREE.MeshPhongMaterial({
            color: 0x808080
        });
     
        // ground material
        materials.groundMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            map: THREE.ImageUtils.loadTexture(assetsUrl + 'ground.png')
        });
     
        // square material
        // materials.squareMaterial = new THREE.MeshLambertMaterial({
        //     map: THREE.ImageUtils.loadTexture(assetsUrl + 'sea_texture.jpg')
        // });

        // opposing side material
        // materials.opposingSquareMaterial = new THREE.MeshLambertMaterial({
        //     map: THREE.ImageUtils.loadTexture(assetsUrl + 'radar_texture.jpg')
        // });

        materials.squareMaterial = new THREE.MeshPhongMaterial({
            color: 0xd3d3d3,
            wireframe   : true,
            side: THREE.DoubleSide
        });
        
     
        // white piece material
        materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
            color: 0xe9e4bd,
            shininess: 20
        });
     
        // black piece material
        materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
            color: 0x9f2200,
            shininess: 20
        });
     
        // pieces shadow plane material
        materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
            transparent: true,
            map: THREE.ImageUtils.loadTexture(assetsUrl + 'piece_shadow.png')
        });
    }
    
    /**
     * Initialize the objects.
     * @param {Object} callback Function to call when the objects have been loaded.
     */
    function initObjects(callback) {

        var boardModel = new THREE.Mesh(new THREE.CubeGeometry(squareSize * 10 + 20, 5, squareSize * 10 + 20), materials.boardMaterial);
        boardModel.position.set(squareSize * 5, -0.02, squareSize * 5);
        scene.add(boardModel);
      

        // add ground
        groundModel = new THREE.Mesh(new THREE.PlaneGeometry(squareSize * 10, squareSize * 10, 1, 1), materials.groundMaterial);
        groundModel.position.set(squareSize * 5, -0.02, squareSize * 5);
        groundModel.rotation.x = -90 * Math.PI / 180;
        //        
        scene.add(groundModel);

        // create the board squares
        var squareMaterial = materials.squareMaterial;

        for (var row = 0; row < 10; row++) {
            for (var col = 0; col < 10; col++) {
               // squareMaterial = materials.squareMaterial;
         
                var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), squareMaterial);
         
                square.position.x = col * squareSize + squareSize / 2;
                square.position.z = row * squareSize + squareSize / 2;

                square.position.y = 2.5;
         
                square.rotation.x = -90 * Math.PI / 180;
         
                scene.add(square);
            }
        }

        var oppBoardModel = new THREE.Mesh(new THREE.CubeGeometry(squareSize * 10 + 20, squareSize * 10 + 20, 5), materials.boardMaterial);
        // oppBoardModel.position.set(squareSize * 5 , (squareSize * 5 + 10) * Math.cos(-30 * Math.PI / 180), -(0.02  + 10) * Math.sin(-30 * Math.PI / 180));

        oppBoardModel.position.set(squareSize * 5 , (squareSize * 5 + 10), -(0.02 + 10));
        //oppBoardModel.rotation.x = -30 * Math.PI / 180; 
        scene.add(oppBoardModel);
        

        var oppSquareMaterial = materials.squareMaterial;


        for (var row = 0; row < 10; row++) {
            for (var col = 0; col < 10; col++) {
               // squareMaterial = materials.squareMaterial;
         
                var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), oppSquareMaterial);
         
                square.position.x = col * squareSize + squareSize / 2;
                square.position.y = row * squareSize + squareSize / 2 + 10;

                square.position.z = 2.5 - 10;
        
                scene.add(square);
            }
        }

        carrierGeom = new THREE.CubeGeometry(squareSize * 5, squareSize - 1, squareSize - 1 );
        // aircraftCarrier.position.set(squareSize * 5 / 2, squareSize / 2 + 2.48, squareSize / 2);

        battleshipGeom = new THREE.CubeGeometry(squareSize * 4, squareSize - 1, squareSize - 1);
        // battleship.position.set(13 * squareSize / 2, squareSize / 2 + 2.48, squareSize * 5);

        cruiserGeom = new THREE.CubeGeometry(squareSize * 3, squareSize - 1, squareSize - 1 );
        // cruiser.position.set(squareSize * 5 / 2, squareSize / 2 + 2.48, squareSize * 17 / 2);

        destroyerGeom = new THREE.CubeGeometry(squareSize * 2, squareSize - 1, squareSize - 1 );
        // destroyer1.position.set(squareSize * 2 , squareSize / 2 + 2.48, squareSize * 7 / 2);

        submarineGeom = new THREE.CubeGeometry(squareSize, squareSize - 1, squareSize - 1 );
        // submarine2.position.set(squareSize * 7 / 2, squareSize / 2 + 2.48, squareSize * 11 / 2);

        callback();



    }

    
    
    /**
     * The render loop.
     */
    function onAnimationFrame() {
        requestAnimationFrame(onAnimationFrame);
        
        cameraController.update();
        
        // update moving light position
        lights.movingLight.position.x = camera.position.x;
        lights.movingLight.position.z = camera.position.z;
        
        renderer.render(scene, camera);
    }

    /**
     * Converts the board position to 3D world position.
     * @param {Array} pos The board position.
     * @returns {THREE.Vector3}
     */
    function boardToWorld (piece) {
        var x, y, z;
        var y = squareSize / 2 + 2.48;
        
        if(piece.orientation === 1){
            x = (piece.type / 2 + piece.pos[0]) * squareSize;
            z = piece.pos[1] * squareSize + squareSize / 2;

        } else{
            x = piece.pos[0] * squareSize + squareSize / 2;
            z = (piece.type  / 2 + piece.pos[1]) * squareSize;
        }     
        return new THREE.Vector3(x, y, z);
    }

    function placePiece(piece){
        var x = piece.pos[0];
        var y = piece.pos[1];
        for(var i = 0; i < piece.type; i++ ){
            if (piece.orientation === 1){
                board[x + i][y] = piece;
            } else{
                board[x][y + i] = piece;
            }       
        }
    }

    
};

