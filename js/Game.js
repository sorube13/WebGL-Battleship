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
            assetsUrl: options.assetsUrl,
            callbacks: {
                pieceCanDrop: isMoveLegal
            }
        });

        boardController.drawBoard(onBoardReady);
    }

    function onBoardReady(){
        var piece;

        piece = {
            type: BATTLESHIP.CARRIER,
            orientation: Math.round(Math.random()), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
       
        piece = {
            type: BATTLESHIP.BATTLESHIP,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);

        piece = {
            type: BATTLESHIP.CRUISER,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);

        piece = {
            type: BATTLESHIP.DESTROYER,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);

        piece = {
            type: BATTLESHIP.DESTROYER,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);

        piece = {
            type: BATTLESHIP.SUBMARINE,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);

        piece = {
            type: BATTLESHIP.SUBMARINE,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
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

    function setRandomPos(piece){
        var length = piece.type;
        var tries = 0;
        var done = false;
        do{
            if(piece.orientation === 1){
                var x = Math.max(Math.floor((Math.random() * 10 - length)), 0);
                var y = Math.floor((Math.random() * 10));
            } else {
                var x = Math.floor((Math.random() * 10));
                var y = Math.max(Math.floor((Math.random() * 10 - length)), 0);
            }
            for(var i=0; i<length; i++) {
                if(piece.orientation === 1 && myBoard[x+i][y] !== 0){
                    done = false;
                    break;
                } else if(piece.orientation === 0 && myBoard[x][y + i] !== 0){
                    done = false;
                    break;
                } else{
                    done = true;
                }
            }
            tries++;
        } while(tries < 10 && !done);
        return [x,y];
    }

    function isMoveLegal(to, length, orientation){
        var toRow = to[0];
        var toCol = to[1];
        console.log("to: ", toRow, toCol);
        console.log("Board length:", myBoard.length);
        console.log("piece (length, orientation):" , length, orientation);
        // piece will still be on board
        if(toRow < 0 || toRow > myBoard.length || toCol < 0 || toCol > myBoard.length){
            return false
        }else if(orientation === 1 && toRow + length > myBoard.length){
            return false
        } else if(orientation === 0 && toCol + length > myBoard.length){
            return false
        }
        return true;
    }

    init();
}