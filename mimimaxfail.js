var ticTacToeGame = (function() {
    var board =  [
        [{
            "playerMove": null
        }, {
            "playerMove": 'xPlayer'
        }, {
            "playerMove": 'xPlayer'
        }],
        [{
            "playerMove": 'oPlayer'
        }, {
            "playerMove": 'oPlayer'
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
    ];/*[
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
    ]; */// initialize a board which is array of each cell object
    this.level = 4;
    var lastMove;


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

    function generateMoves() {
        //List<int[]> nextMoves = new ArrayList<int[]>(); 
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

        function animateBoard() {
        //animate the board
    }

    function evaluateCase() {
        var score = 0;
        // Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
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
        @Return 1 for X win, -1 for 0 win and 0 for no win */
    function evaluateWinCase(row1, col1, row2, col2, row3, col3) {
        var score = 0;

        // Third cell
        if (board[row1][col1].playerMove == 'xPlayer' && board[row2][col2].playerMove == 'xPlayer' && board[row3][col3].playerMove == 'xPlayer') {

            score = 1;
        } else if (board[row1][col1].container == 'oPlayer' && board[row2][col2].container == 'oPlayer' && board[row3][col3].container == 'oPlayer') {

            score = -1;
        } else {

            return 0;
        }
        return score;
    }

    function minimax(level, player) {

        // Generate possible next moves in a List of int[2] of {row, col}.
        var nextMoves = generateMoves();
        var choicesCount = nextMoves.length;
        var bestScore = (player == 'xPlayer') ? - 1 : 1;
        var bestRows = [];
        var bestCols = [];

        // mySeed is maximizing; while oppSeed is minimizing
        // int bestScore = (player == mySeed) ? Integer.MIN_VALUE : Integer.MAX_VALUE;
        var currentScore;

        //if(player=='xPlayer') ? 

        if (nextMoves.length == 0 || level == 0) {
            // Gameover or depth reached, evaluate score
            bestScore = evaluateCase();
        } else {

            for (var i = 0; i < nextMoves.length; i++) {
                var move = nextMoves[i];
                // console.log('checking move ' + i +' for player ' + player + ' with level ' + level);
                // Try this move for the current "player"
                board[move[0]][move[1]].playerMove = player;
                if (player == 'xPlayer') { // mySeed (computer) is maximizing player
                    currentScore = minimax(level - 1, 'oPlayer')[0];
                    if (currentScore == 1) {
                        bestScore = currentScore;
                        bestRows.push(move[0]);
                        bestCols.push(move[1]);
                    }

                } else { // 'oPlayer' is minimizing player
                    currentScore = minimax(level - 1, 'xPlayer')[0];
                    if (currentScore == -1) {
                        bestScore = currentScore;
                        bestRows.push(move[0]);
                        bestCols.push(move[1]);
                    }
                }
                // Undo move
                board[move[0]][move[1]].playerMove = null;
                //console.log('removing move ' + i + ' for player ' + player + ' with level ' + level);
            }
        }
        //this will handle the case there where you will definately lose and have to make a move anyway
        //i.e. your bestscore is less than tieing or winning
        if(bestRows.length==0){
          var indeces = nextMoves.length-1;

          nextMoves[Math.floor((Math.random() * indeces) + 0)];

        }
        return [bestScore, bestRows, bestCols];
    }

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
                return true;
            } else {

                return false;
            }

        },
        makeNextBestMove: function(player) {
            var bestMoves = minimax(4, player);
            var indeces = 0;
            if(bestMoves[1].length==0) {
              console.log('couldnt find a best move on this move so going random');
              var possibleMoves = generateMoves();
              indeces = possibleMoves.length-1;
              var moveIndex = Math.floor((Math.random() * indeces) + 0);
              lastMove =  board[possibleMoves[moveIndex][0]][possibleMoves[moveIndex][1]];
              board[possibleMoves[moveIndex][0]][possibleMoves[moveIndex][1]].playerMove = player;

            }
            else{
           indeces = bestMoves[1].length-1;
            lastMove =   board[bestMoves[1][moveIndex]][bestMoves[2][moveIndex]];
            var moveIndex = Math.floor((Math.random() * indeces) + 0);
            board[bestMoves[1][moveIndex]][bestMoves[2][moveIndex]].playerMove = player;
          }
            for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                if ((winCase.cells[0].playerMove !== winCase.cells[1].playerMove && (winCase.cells[0].playerMove !==null && winCase.cells[1].playerMove !==null))|| 
                 (winCase.cells[0].playerMove !== winCase.cells[2].playerMove && (winCase.cells[0].playerMove !==null && winCase.cells[2].playerMove !==null))||  
                 (winCase.cells[1].playerMove !== winCase.cells[2].playerMove && (winCase.cells[1].playerMove !==null && winCase.cells[2].playerMove !==null))) {

                    winCase.willTie = true;
                } else {

                    winCase.willTie = false;
                }


                if (winCase.cells[0].playerMove == winCase.cells[1].playerMove && winCase.cells[1].playerMove == winCase.cells[2].playerMove && winCase.cells[0].playerMove != null) {

                    winCase.gameWon = true;
                }
            }

        },
        isGameOver: function() {
            var moves = generateMoves();
            var gameIsWon= false
             for (var i = 0; i < winCases.length; i++) {
                var winCase = winCases[i];

                if (winCase.gameWon == true) gameIsWon = true;
            }
            if (moves == null) {
                 animateBoard();
                 console.log('no more moves');
                return true;
            } else if(gameIsWon){
              console.log('somebody won');
               animateBoard();

              return true;
            }
            else{
                return false;
              }
            }
        
    };
}());