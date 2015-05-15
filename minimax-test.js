
    function minimax(player, checkAhead) {

        // Generate possible next moves in a List of array of [row, col].
        var nextMoves = generateMoves();
        var choicesCount = nextMoves.length;
        //xplayer wants maximum score greater than -1 and o player wants minimum score less than 1
        var bestScore = (player == 'xPlayer') ? -1 : 1;
        var bestRows = [];
        var bestCols = [];
        //there will be many moves where a player cant win yet... storing neutrolrows
        var neutrolRows = [];
        var neutrolCols = [];
        var currentScore;

        if (checkAhead) {
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
                        if (bestRows.length == 0) bestScore = currentScore
                        neutrolRows.push(move[0]);
                        neutrolCols.push(move[1]);
                    }

                } else { // 'oPlayer' is minimizing player

                    if (currentScore == -1) {
                        bestScore = currentScore;
                        bestRows.push(move[0]);
                        bestCols.push(move[1]);
                    } else if (currentScore == 0) {
                        if (bestRows.length == 0) bestScore = currentScore;
                        neutrolRows.push(move[0]);
                        neutrolCols.push(move[1]);
                    }
                }
                // Undo move
                board[move[0]][move[1]].playerMove = null;
                //console.log('removing move ' + i + ' for player ' + player);
            }

        } else {

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
                        currentScore = minimax('oPlayer', 'true')[0];
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
                        currentScore = minimax('xPlayer', 'true')[0];
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
        }

        return [bestScore, bestRows, bestCols, neutrolRows, neutrolCols];
    }
