var ticTacToeGame = (function() {
    var board =
        /*actual board*/
        // initialize a board which is array of each cell object
        [
            [{
                "playerMove": null
            }, {
                "playerMove": null
            }, {
                "playerMove": null
            }],
            [{
                "playerMove": null
            }, {
                "playerMove": null
            }, {
                "playerMove": null
            }],
            [{
                "playerMove": null
            }, {
                "playerMove": null
            }, {
                "playerMove": null
            }]
        ];
    //create an instance variable last move to run checks on all the win cases
    var lastMove;
    //initialize winCase object to perform checks after each move

    var winCases = [{
        "willTie": false,
        "cells": [board[0][0], board[0][1], board[0][2]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[1][0], board[1][1], board[1][2]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[2][0], board[2][1], board[2][2]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[0][0], board[1][0], board[2][0]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[0][1], board[1][1], board[2][1]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[0][2], board[1][2], board[2][2]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[0][0], board[1][1], board[2][2]],
        "gameWon": false
    }, {
        "willTie": false,
        "cells": [board[0][2], board[1][1], board[2][0]],
        "gameWon": false
    }];
    //private method which generates all moves left remaining on board
    function generateMoves() {
            var nextMoves = []; // allocate List

            // Search for empty cells and add to the List
            for (var row = 0; row < 3; ++row) {
                for (var col = 0; col < 3; ++col) {
                    if (board[row][col].playerMove == null) {
                        nextMoves.push([row, col]);
                    }
                }
            }
            return nextMoves;
        }
        //animate the board
    function animateBoard() {
        var el;
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                var player = board[i][j].playerMove;
                el = document.getElementById(i + '' + j);
                if (player == 'xPlayer') {
                    el.style.backgroundImage = "url('images/x.png')";
                } else if (player == 'oPlayer') {
                    el.style.backgroundImage = "url('images/o.png')";
                }
            }
        }
    }

    function evaluateCase() {
        var score = 0;
        // Evaluate score for each of the 8 winCases (3 rows, 3 columns, 2 diagonals)
        score += evaluateWinCase(0, 0, 0, 1, 0, 2); // row 0
        score += evaluateWinCase(1, 0, 1, 1, 1, 2); // row 1
        score += evaluateWinCase(2, 0, 2, 1, 2, 2); // row 2
        score += evaluateWinCase(0, 0, 1, 0, 2, 0); // col 0
        score += evaluateWinCase(0, 1, 1, 1, 2, 1); // col 1
        score += evaluateWinCase(0, 2, 1, 2, 2, 2); // col 2
        score += evaluateWinCase(0, 0, 1, 1, 2, 2); // diagonal
        score += evaluateWinCase(0, 2, 1, 1, 2, 0); // alternate diagonal
        return score;
    }

    /** The heuristic evaluation function for the given line of 3 cells
        Return 1 for X win, -1 for O win and 0 for no win */
    function evaluateWinCase(row1, col1, row2, col2, row3, col3) {
        var score = 0;

        // Third cell
        if (board[row1][col1].playerMove == 'xPlayer' && board[row2][col2].playerMove == 'xPlayer' && board[row3][col3].playerMove == 'xPlayer') {

            score = 1;
        } else if (board[row1][col1].playerMove == 'oPlayer' && board[row2][col2].playerMove == 'oPlayer' && board[row3][col3].playerMove == 'oPlayer') {

            score = -1;
        } else {

            return 0;
        }
        return score;
    }
//first time this method is called for a given move and player checkahead will be false.... we only want to check ahead once
// checkahead if a given move isn't a winning move... if a given move gives the opponent an opportunity to win, don't save it in best moves
//or neutral moves
   function minimax(player, checkAhead) {

        // Generate possible next moves in a List of array of [row, col].
        var nextMoves = generateMoves();
        var choicesCount = nextMoves.length;
        //xplayer wants maximum score greater than -1 and o player wants minimum score less than 1
        var bestScore = (player == 'xPlayer') ? -1 : 1;
        var bestRows = [];
        var bestCols = [];
        //there will be many moves where a player cant win yet... storing neutral rows
        var neutrolRows = [];
        var neutrolCols = [];
        var currentScore;

            for (var i = 0; i < nextMoves.length; i++) {
                var move = nextMoves[i];
                // console.log('checking move ' + i +' for player ' + player);
                // Try this move for the current "player"
                board[move[0]][move[1]].playerMove = player;
                currentScore = evaluateCase();
                if (player == 'xPlayer') {
                    if (currentScore == 1) {
                        bestScore = currentScore;
                        bestRows.push(move[0]);
                        bestCols.push(move[1]);
                    } else if (currentScore == 0) {
                        //check if currentscore is still 0 after going ahead 1 level
                        if(checkAhead==false){
                        currentScore = minimax('oPlayer', 'true')[0];
                    }
                        if (currentScore == 0) {
                            if (bestRows.length == 0) bestScore = currentScore;
                            neutrolRows.push(move[0]);
                            neutrolCols.push(move[1]);
                        } else {

                            console.log('xPlayer is going to lose');
                        }

                    }

                } else { // 'oPlayer' is minimizing player

                    if (currentScore == -1) {
                        bestScore = currentScore;
                        bestRows.push(move[0]);
                        bestCols.push(move[1]);
                    } else if (currentScore == 0) {
                        if(checkAhead==false){
                        currentScore = minimax('xPlayer', 'true')[0]; 
                         }
                
                        if (currentScore == 0) {
                            if (bestRows.length == 0) bestScore = currentScore
                            neutrolRows.push(move[0]);
                            neutrolCols.push(move[1]);
                        } else {
                            console.log('oplayer is going to lose');
                        }
                    }

                }
                // Undo move
                board[move[0]][move[1]].playerMove = null;
                //console.log('removing move ' + i + ' for player ' + player);
            }
        

        return [bestScore, bestRows, bestCols, neutrolRows, neutrolCols];
    }

//public functions
    return {
        checkTie: function() {
            var tie = true;
            for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                if (winCase.willTie == false) tie = false;
            }
            if (tie) {
                console.log('there will be a tie');
                lastMove.playerMove = null;
                animateBoard();
              var el = document.getElementById('tie');
              
              el.style.display = "block";
                return true;
            } else {

                return false;
            }

        },
        makeNextBestMove: function(player) {
            var bestMoves = minimax(player, false);
            var indeces = 0;
            if (bestMoves[1].length == 0) {

                if (bestMoves[3].length > 0) {

                    indeces = bestMoves[3].length - 1;
                    var moveIndex = Math.floor((Math.random() * indeces) + 0);
                    lastMove = board[bestMoves[3][moveIndex]][bestMoves[4][moveIndex]];
                    board[bestMoves[3][moveIndex]][bestMoves[4][moveIndex]].playerMove = player;
                    console.log('couldnt find a best move so making a neutrel move or blocking');

                } else {

                    console.log('going to lose regardless so going random');

                    var possibleMoves = generateMoves();
                    indeces = possibleMoves.length - 1;
                    var moveIndex = Math.floor((Math.random() * indeces) + 0);
                    lastMove = board[possibleMoves[moveIndex][0]][possibleMoves[moveIndex][1]];
                    board[possibleMoves[moveIndex][0]][possibleMoves[moveIndex][1]].playerMove = player;
                }
            } else {
                indeces = bestMoves[1].length - 1;
                var moveIndex = Math.floor((Math.random() * indeces) + 0);
                lastMove = board[bestMoves[1][moveIndex]][bestMoves[2][moveIndex]];
                board[bestMoves[1][moveIndex]][bestMoves[2][moveIndex]].playerMove = player;
            }
            for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                if ((winCase.cells[0].playerMove !== winCase.cells[1].playerMove && (winCase.cells[0].playerMove !== null && winCase.cells[1].playerMove !== null)) ||
                    (winCase.cells[0].playerMove !== winCase.cells[2].playerMove && (winCase.cells[0].playerMove !== null && winCase.cells[2].playerMove !== null)) ||
                    (winCase.cells[1].playerMove !== winCase.cells[2].playerMove && (winCase.cells[1].playerMove !== null && winCase.cells[2].playerMove !== null))) {

                    winCase.willTie = true;
                } else {

                    winCase.willTie = false;
                }


                if (winCase.cells[0].playerMove == winCase.cells[1].playerMove && winCase.cells[1].playerMove == winCase.cells[2].playerMove && winCase.cells[0].playerMove != null) {

                    winCase.gameWon = true;
                    if(player=='xPlayer') {
                      document.getElementById('x-won').style.display = "block";
                    }
                    else{
                    document.getElementById('o-won').style.display = "block";

                    }
                     animateBoard();
                }
            }
           
        },
        resetGame: function() {
             var el;
             //clear background images from html
            for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                var player = board[i][j].playerMove;
                el = document.getElementById(i + '' + j);
              
              el.style.backgroundImage = "";
            }
        }
          //clear board object
            for (var row = 0; row < 3; ++row) {
                for (var col = 0; col < 3; ++col) {
                    board[row][col].playerMove = null;
                }
            }
            // reset winCase objects
             for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                    winCase.willTie = false;
       
                    winCase.gameWon = false;
               
            }
            //clear results lines from DOM
              el = document.getElementById('x-won');
              
              el.style.display = "none";
             
              el = document.getElementById('o-won');
              
              el.style.display = "none";

              el = document.getElementById('tie');
              
              el.style.display = "none";
        },
        isGameOver: function() {
            var moves = generateMoves();
            var gameIsWon = false
            for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                if (winCase.gameWon == true) gameIsWon = true;
            }
            if (moves == null) {
                animateBoard();
                console.log('no more moves');
                return true;
            } else if (gameIsWon) {
                console.log('somebody won');
                animateBoard();

                return true;
            } else {
                return false;
            }
        }

    };
}());