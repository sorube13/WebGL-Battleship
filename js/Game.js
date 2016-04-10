var BATTLESHIP = {
    SUBMARINE : 1,
    DESTROYER : 2,
    CRUISER : 3,
    BATTLESHIP : 4,
    CARRIER : 5
};

BATTLESHIP.Game = function(options){
    'use strict';

    options = options || {};

    var boardController = null;

    var myBoard = [
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

    var oppBoard = [
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

    function init(){
        boardController = new BATTLESHIP.BoardController({
            containerEl: options.containerEl,
            assetsUrl: options.assetsUrl
        });

        boardController.drawBoard(onBoardReady);
    }

    function onBoardReady(){
        var piece;

        piece = {
            type: BATTLESHIP.CARRIER,
            orientation: 1, // 1: horizontal 0: vertical
            pos: [0, 0]
        };
        placePiece(piece);
       
        piece = {
            type: BATTLESHIP.BATTLESHIP,
            orientation: 0, // 1: horizontal 0: vertical
            pos: [6, 3]
        };
        placePiece(piece);

        piece = {
            type: BATTLESHIP.CRUISER,
            orientation: 1, // 1: horizontal 0: vertical
            pos: [1, 8]
        };
        placePiece(piece);

        piece = {
            type: BATTLESHIP.DESTROYER,
            orientation: 1, // 1: horizontal 0: vertical
            pos: [1, 3]
        };
        placePiece(piece);

        piece = {
            type: BATTLESHIP.DESTROYER,
            orientation: 0, // 1: horizontal 0: vertical
            pos: [9, 8]
        };
        placePiece(piece);

        piece = {
            type: BATTLESHIP.SUBMARINE,
            orientation: 1, // 1: horizontal 0: vertical
            pos: [8, 1]
        };
        placePiece(piece);

        piece = {
            type: BATTLESHIP.SUBMARINE,
            orientation: 1, // 1: horizontal 0: vertical
            pos: [3, 5]
        };
        placePiece(piece);
    }

    function placePiece(piece){
        var x = piece.pos[0];
        var y = piece.pos[1];
        for(var i = 0; i < piece.type; i++ ){
            if (piece.orientation === 1){
                myBoard[x + i][y] = piece;
            } else{
                myBoard[x][y + i] = piece;
            }       
        }
        boardController.addPiece(piece);
    }

    init();
}