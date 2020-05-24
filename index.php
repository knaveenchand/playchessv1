<!DOCTYPE html>
<html lang="en">
<head>
   <title>ChessATC</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="./chessboardjs-1/css/chessboard-1.0.0.min.css">
    
    <style>
    .number::-webkit-inner-spin-button, 
    .number::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
    }
    #roomNumbers{
/*      margin: 7px;*/
    }

        @media only screen and (max-width: 600px) {
            
            div#myBoard {
                width: 100%;
            }
        }

        @media only screen and (min-width: 600px) {
            
            div#myBoard {
                width: 400px;
            }
        }
      
        
        
   
  </style>

 </head>
<body>

<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
  <a class="navbar-brand" href="#">Play ChessATC</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="collapsibleNavbar">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>    
    </ul>
  </div>  
</nav>

<div class="container" style="margin-top:30px">
  <div class="row">
    <div class="col-md-8 shadow-lg p-3 mb-5 bg-white rounded">
        <form>
            <div id="joingame">Join Game: Enter a room number between 0 and 99</div> 
          <div class="row">
            <div class="col">
              <input type="number" id="room" min="0" max="99" 
              class="form-control form-control-md number">
            </div>
            <div class="col">
              <button id="button" class="btn btn-success" onclick="connect()">Connect</button>
            </div>
          </div>
        </form>

        <div class="row board-infobar">
        
            <div class="col-12">
                <div class="alert alert-dark mb-1" role="alert">
                    <span id="opponent-timer"></span>
                    <span class="float-right timerheading">
                        <span class="badge badge-light" id="opponent-timer-seconds-format"></span>
                        <span class="badge badge-light d-none" id="opponent-timer-seconds">60</span>
                    </span>
            </div>            
        </div>
            
        </div>
        
        
<!--
        <div id="opponent-timer"></div>
        <div id="opponent-timer-seconds">60</div>
-->
        <div class="row mb-1">
            <div class="col-12">
                      <div id="myBoard" class="mx-auto"></div>             
            </div>
        </div>
        
        
        <div class="row board-infobar">
        
            <div class="col-12">
                <div class="alert alert-dark" role="alert">
                    <span id="my-timer"></span>
                    <span class="float-right timerheading">
                        <span class="badge badge-light" id="my-timer-seconds-format"></span>
                        <span class="badge badge-light d-none" id="my-timer-seconds">60</span>
                    </span>
            </div>  
                
        </div>
            
        </div>
<!--
        
        <div id="my-timer-seconds">60</div>
        <div id ="my-timer"></div>
-->
    </div>
    <div class="col-md-4">
        
        <div class="panel panel-default ng-scope" ng-controller="MenuCtrl">
				<ul class="list-group">
					<li class="list-group-item">Status: 
                        <div id="status"></div>
					</li>
					<li class="list-group-item">Pgn: 
                    <div id="pgn"></div>
                    </li>
                    <li class="list-group-item">
                    <div>
      
        <div id="player"></div>
        <div id="roomNumbers"></div>
        <div id="state"></div>
    </div>
                        
                    </li>
				</ul>
			</div>

    </div>

  </div>

</div>
                <hr class="d-sm-none">

<div class="jumbotron text-center" style="margin-bottom:0">
  <p>Powered by: Parishkaar</p>
</div>

    
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>

<script src="chess.js"></script>
<script src="./chessboardjs-1/js/chessboard-1.0.0.min.js"></script>
<script src="game.js"></script>
    
</body>
</html>

