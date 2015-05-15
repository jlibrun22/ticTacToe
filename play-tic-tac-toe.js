document.getElementById('ticTacToeButton').addEventListener('click', function() {
    var nextPlayer = 'xPlayer';
    var counter = 0;
    while ( !ticTacToeGame.checkTie() && !ticTacToeGame.isGameOver()) {
         counter++;
        console.log('we are on the ' + counter + ' move of the game and the next player is ' 
            + nextPlayer);

        ticTacToeGame.makeNextBestMove(nextPlayer);

        if (nextPlayer == 'xPlayer') {
            nextPlayer = 'oPlayer';
        } else {
            nextPlayer = 'xPlayer';
        }
    }
});

document.getElementById('resetButton').addEventListener('click', function() {
   
        ticTacToeGame.resetGame();

});