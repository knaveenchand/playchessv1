game = new Chess();
var socket = io();

var color = "white";
var players;
var roomId;
var play = true;
var movebegan = 0;

var joingame = document.getElementById("joingame")
var room = document.getElementById("room")
var roomNumber = document.getElementById("roomNumbers")
var button = document.getElementById("button")
var state = document.getElementById('state')

var myTimerEl = $('#my-timer');
var opponentTimerEl = $('#opponent-timer');
var myTimerSecondsEl = $('#my-timer-seconds');
var myTimerSecondsFormatEl = $('#my-timer-seconds-format');
var opponentTimerSecondsEl = $('#opponent-timer-seconds');
var opponentTimerSecondsFormatEl = $('#opponent-timer-seconds-format');
var myTimerSeconds, opponentTimerSeconds;

  var statusEl = $('#status');
//  fenEl = $('#fen'),
  var pgnEl = $('#pgn');

$('.board-infobar').hide();
$('.timerheader').hide();

var wincolor;



var connect = function(){
    roomId = room.value;
    if (roomId !== "" && parseInt(roomId) <= 100) {
        room.remove();
        joingame.remove();
        roomNumber.innerHTML = "Room Number " + roomId;
        button.remove();
        $('.board-infobar').show();
        myTimerEl.html('waiting for opponent...');
        opponentTimerEl.html('waiting for opponent...');
        $('.timerheader').show();
        socket.emit('joined', roomId);
    }
}

socket.on('full', function (msg) {
    if(roomId == msg)
        window.location.assign(window.location.href+ 'full.html');
});

socket.on('play', function (msg) {
    if (msg == roomId) {
        play = false;
        state.innerHTML = "Game in progress";
        movebegan = 1;
        
//        myTimerEl.html('Both players joined. White to move.');
//        opponentTimerEl.html('Both players joined. White to move.');
    }
    // console.log(msg)
});

socket.on('move', function (msg) {
    if (msg.room == roomId) {
        game.move(msg.move);
        board.position(game.fen());
        updateStatus();
        console.log("moved")
    }
});

var removeGreySquares = function () {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function (square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var onDragStart = function (source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (game.game_over() === true || play ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
        (game.turn() === 'w' && color === 'black') ||
        (game.turn() === 'b' && color === 'white') ) {
            return false;
    }
    // console.log({play, players});
};

var onDrop = function (source, target) {
    removeGreySquares();

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    if (game.game_over()) {
        state.innerHTML = 'GAME OVER';
        socket.emit('gameOver', roomId)
    }

    // illegal move
    if (move === null) {
        return 'snapback';
    }
    else {
        socket.emit('move', { move: move, board: game.fen(), room: roomId});
        
    }
    
    updateStatus();

};

var onMouseoverSquare = function (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    greySquare(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function (square, piece) {
    removeGreySquares();
};


// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }
   
  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';
      
        if ((color === 'white' && game.turn() ==='w') || 
            (color === 'black' && game.turn() ==='b') ) {
            myTimerEl.html("my timer ON");
            opponentTimerEl.html("opponent timer OFF");

        }
        if ((color === 'black' && game.turn() ==='w') || 
            (color === 'white' && game.turn() ==='b') ) {
            myTimerEl.html("my timer OFF");
            opponentTimerEl.html("opponent timer ON");
        }
          
    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  //fenEl.html(game.fen());
  pgnEl.html(game.pgn()); 
    
};

var secondsToTime = function (myseconds)  {
    var sec_num = parseInt(myseconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var n = hours + ':' + minutes + ':' + seconds;
    return n;
}

    socket.on('timelapse', function(msg) {
        if (movebegan === 1) {
            myTimerEl.html('Both players joined. White to move.')
            opponentTimerEl.html('Both players joined. White to move.')
            movebegan++;
        }
        if (myTimerEl.html() === 'my timer ON') {
            myTimerSeconds = myTimerSecondsEl.html();
            myTimerSeconds = myTimerSeconds - 1;
                myTimerSecondsEl.html(myTimerSeconds);
                myTimerSecondsFormatEl.html(secondsToTime(myTimerSeconds));

            opponentTimerSeconds = opponentTimerSecondsEl.html();
            
            if (myTimerSeconds > 0) {
                socket.emit('clientsenttime', { time: myTimerSeconds, room: roomId, color: color, player: players, opponenttime: opponentTimerSeconds, gamestatus: 'on'} );
            }
            if (myTimerSeconds === 0) {
                myTimerSecondsEl.html(0);                    
                socket.emit('clientsenttime', { time: 0, room: roomId, color: color, player: players, opponenttime: opponentTimerSeconds, gamestatus: 'timeup'} );
            }
            if (myTimerSeconds < 0) {
                myTimerSecondsEl.html(0);
                myTimerSecondsFormatEl.html(secondsToTime(0));

            }
           
//        socket.emit('move', { move: move, board: game.fen(), room: roomId });
            
//            if (myTimerSeconds === -1) {
//                myTimerSeconds = 0;
//            }
//            socket.emit('clientsenttime', { time: myTimerSeconds, room: roomId} );
//            myTimerSecondsEl.html(myTimerSeconds);    
            
        }
//        if (opponentTimerEl.html() === 'opponent timer ON') {
//            opponentTimerSeconds = opponentTimerSecondsEl.html();
//            opponentTimerSeconds = opponentTimerSeconds - 1;
//            opponentTimerSecondsEl.html(opponentTimerSeconds);        
//        }
        
    });

socket.on('clientviaservertimer', function(msg) {
//    console.log(msg);
    //check if this is our room timer
    if (msg.room === roomId) {     
        //check if my timer ON
        
        if(msg.color === color) {
            myTimerSecondsEl.html(msg.time);
            myTimerSecondsFormatEl.html(secondsToTime(msg.time));
        } else {
            opponentTimerSecondsEl.html(msg.time);
            opponentTimerSecondsFormatEl.html(secondsToTime(msg.time));
        }
//         if (myTimerEl.html() === 'my timer ON') {
//             myTimerSecondsEl.html(msg.time);
//             opponentTimerSecondsEl.html(msg.opponenttime);
//         } 
//         if (opponentTimerEl.html() === 'opponent timer ON') {
//             opponentTimerSecondsEl.html(msg.time);
//         }
        
        //msg.time is zero?
         if (msg.gamestatus === 'timeup') {
             var savefen = game.fen();
//             board.clear;
             board = Chessboard('myBoard', {
                 position: savefen, 
                 draggable: false,
                 orientation: color
             });
             if (msg.color === 'white') {
                  wincolor = 'black';
             } else {
                wincolor = 'white';
             }
            myTimerEl.html(wincolor + ' wins. ' + msg.color + ' timeout.');
            opponentTimerEl.html(wincolor + ' wins. ' + msg.color + ' timeout.');
//             board.position(game.fen(), false);
//             board.clear(true);
//             alert(msg.color +' time-up');
         }
            
        
    }     
});

socket.on('player', function(msg) {
    var plno = document.getElementById('player')
    color = msg.color;

    plno.innerHTML = 'Player ' + msg.players + " : " + color;
    players = msg.players;

    if(players == 2){
        play = false;
        socket.emit('play', msg.roomId);
        state.innerHTML = "Game in Progress"
            myTimerEl.html('Both players joined. White to move.');
            opponentTimerEl.html('Both players joined. White to move.');
    }
    else
        state.innerHTML = "Waiting for Second player";


    var cfg = {
        orientation: color,
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('myBoard', cfg);
    
});
// console.log(color)

var board;