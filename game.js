// Manages the whole game ("God Object")
function Game() {
  this.refreshRate = 33;
  this.running = false;
  this.pause = true;
  this.score = new Score();
  this.soundfx = 0;
  this.map;
  this.pillCount;	// # of pills
  this.monsters;
  this.level = 1;
  this.gameOver = false;
  this.canvas = $("#myCanvas").get(0);
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.toggleSound = function() { 
    this.soundfx == 0 ? this.soundfx = 1 : this.soundfx = 0; 
    $('#mute').toggle();
    }
  this.reset = function() {
    }
  this.newGame = function() {
    console.log("new Game");
          this.init(0);
          this.pauseResume();
  }
  this.nextLevel = function() {
    this.level++;
          console.log("Level "+game.level);
    game.showMessage("Level "+game.level,"Level up! Click to continue!");
    this.init(1);
  }
  this.drawHearts = function (count) {
    var html = "";
    for (i = 0; i<count; i++) {
      html += " <img src='img/heart.png'>";
      }
    $(".lives").html("Lives: "+html);
    
  }
  this.showContent = function (id) {
    $('.content').hide();
    $('#'+id).show();
  }
  this.showMessage = function(title, text) {
    this.pause = true;
    $('#canvas-overlay-container').fadeIn(200);
    if ($('.controls').css('display') != "none") $('.controls').slideToggle(200);
    $('#canvas-overlay-content #title').text(title);
    $('#canvas-overlay-content #text').html(text);
  }
  this.closeMessage = function() {
    $('#canvas-overlay-container').fadeOut(200);
    $('.controls').slideToggle(200);
  }
  this.pauseResume = function () {
    if (!this.running) {
      this.pause = false;
      this.running = true;
      this.closeMessage();
      animationLoop();
    }
    else if (this.pause) {
      this.pause = false;
      this.closeMessage();
      }
    else {
      this.showMessage("Pause","Click to Resume");
      }
    }
  this.init = function (state) {
    
    //console.log("init game");
    
    // get Level Map
    $.ajax({
      url: mapConfig,
      async: false,
       beforeSend: function(xhr){
        if (xhr.overrideMimeType) xhr.overrideMimeType("application/json"); 
      },
      dataType: "json",
      success: function (data) {
        game.map =  data;
      }
    });
  
    var temp = 0;
    $.each(this.map.posY, function(i, item) {
       $.each(this.posX, function() { 
         if (this.type == "pill") {
        temp++;
        //console.log("Pill Count++. temp="+temp+". PillCount="+this.pillCount+".");
        }
      });
    });
    
    this.pillCount = temp;

    if (state == 0) {
      this.score.set(0);
      this.score.refresh(".score");
      pacman.lives = 3;
      game.level = 1;
      game.gameOver = false;
      }
    pacman.reset();
    
    game.drawHearts(pacman.lives);	
    
    // initalize Ghosts, avoid memory flooding
    if (pinky == null) {
      pinky = new Ghost(14*pacman.radius,10*pacman.radius,'img/pinky.svg');
      inky = new Ghost(16*pacman.radius,10*pacman.radius,'img/inky.svg');
      blinky = new Ghost(18*pacman.radius,10*pacman.radius,'img/blinky.svg');
      clyde = new Ghost(20*pacman.radius,10*pacman.radius,'img/clyde.svg');
    }
    else {
      //console.log("ghosts reset");
      pinky.setPosition(14*pacman.radius,10*pacman.radius);
      pinky.undazzle();
      inky.setPosition(16*pacman.radius,10*pacman.radius);
      inky.undazzle();
      blinky.setPosition(18*pacman.radius,10*pacman.radius);
      blinky.undazzle();
      clyde.setPosition(20*pacman.radius,10*pacman.radius);
      clyde.undazzle();
    }
  
    }
  this.check = function() {
  if ((this.pillCount == 0) && game.running) {
      this.nextLevel();
    }
  }
  this.win = function () {}
  this.gameover = function () {}
  this.toPixelPos = function (gridPos) {
    return gridPos*30;
  }
  this.toGridPos = function (pixelPos) {
    return ((pixelPos % 30)/30);
  }
}