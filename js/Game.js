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
                pieceCanDrop : isMoveLegal,
                pieceDropped : pieceMoved 
            }
        });

        boardController.drawBoard(onBoardReady);
    }

    function onBoardReady(){
        var piece;

        piece = {
            id: 1,
            type: BATTLESHIP.CARRIER,
            orientation: Math.round(Math.random()), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);
       
        piece = {
            id : 2,
            type: BATTLESHIP.BATTLESHIP,
            orientation:  1//Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);

        piece = {
            id: 3,
            type: BATTLESHIP.CRUISER,
            orientation: 0//Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);

        piece = {
            id : 4,
            type: BATTLESHIP.DESTROYER,
            orientation: 0//Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);

        piece = {
            id : 5,
            type: BATTLESHIP.DESTROYER,
            orientation: 0//Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);

        piece = {
            id : 6,
            type: BATTLESHIP.SUBMARINE,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);

        piece = {
            id : 7,
            type: BATTLESHIP.SUBMARINE,
            orientation: Math.round(Math.random() ), // 1: horizontal 0: vertical
        };
        piece.pos = setRandomPos(piece);
        placePiece(piece);
        boardController.addPiece(piece);
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
        // boardController.addPiece(piece);
    }

    function removePiece(piece, from){
        var x = from[0];
        var y = from[1];
        for(var i = 0; i < piece.type; i++ ){
            if (piece.orientation === 1){
                myBoard[x + i][y] = 0;
            }else{
                myBoard[x][y + i] = 0;
            }       
        }
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

    function isMoveLegal(to, piece){
        var length = piece.type;
        var orientation = piece.orientation;
        var toRow = to[1];
        var toCol = to[0];
        var l2 = Math.floor(length/2);
        if(toRow < 0 || toRow >= myBoard.length || toCol < 0 || toCol >= myBoard.length){
            console.log("legalNo1");
            return false
        }else if(length%2){ // odd
            if(orientation === 1){
                if(toCol < l2 || toCol >= myBoard.length - l2){
                    console.log("legalNo2");
                    return false;
                } 
                for(var i = toCol - l2; i < toCol + l2 + 1; i++){
                    if((myBoard[i][toRow]) && (myBoard[i][toRow].id != piece.id)){
                        console.log("legalNo3");
                        return false;
                    }
                }
            } else if(orientation === 0){
                if (toRow < l2 || toRow >= myBoard.length - l2){
                    console.log("legalNo4");
                    return false;
                } 
                for(var i = toRow - l2; i < toRow + l2 + 1; i++){
                    if((myBoard[toCol][i])&& (myBoard[i][toRow].id != piece.id)){
                        console.log("legalNo5");
                        return false;
                    }
                }
            }
        }else{ // even
            if(orientation === 1){
                if(toCol < l2 - 1 || toCol >= myBoard.length - l2){
                    console.log("legalNo6");
                    return false;
                }
                for(var i = toCol - l2 + 1; i < toCol + l2 + 1; i++){
                    if((myBoard[i][toRow])&& (myBoard[i][toRow].id != piece.id)){
                        console.log("legalNo7");
                        return false;
                    }
                }
            } else if(orientation === 0){
                if(toRow < l2 - 1 || toRow >= myBoard.length - l2){
                    console.log("legalNo8");
                    return false;
                } 
                for(var i = toRow - l2 + 1; i < toRow + l2 + 1; i++){
                    if((myBoard[toCol][i]) && (myBoard[i][toRow].id != piece.id)){
                        console.log("legalNo9");
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function pieceMoved(from, to){
        var toCol = to[0]
        var toRow = to[1];

        var piece = myBoard[from[0]][from[1]];
        removePiece(piece, centerToPos(piece, from));
        piece.pos = centerToPos(piece, to);

        placePiece(piece);
    }

    function centerToPos(piece, to){
        var x, y;
        if(piece.type % 2){ // if odd
           if(piece.orientation === 1){
                x = Math.max(to[0] - Math.floor(piece.type / 2), 0);
                y = to[1];
            } else{
                x = to[0];
                y = Math.max(to[1] - Math.floor(piece.type / 2), 0);
            }
            
        } else{
            if(piece.orientation === 1){
                x = Math.max(to[0] - piece.type / 2 + 1, 0);
                y = to[1];
            } else{
                x = to[0];
                y = Math.max(to[1] - piece.type / 2 + 1, 0);
            }
        }
        return [x, y];
    }

    init();
}
