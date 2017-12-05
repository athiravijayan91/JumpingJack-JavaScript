
var currentState;
var width;
var height,
    ogroup,cgroup;
var thehero;
var frames=0;
var score = 0;
var coinnum = 0;



var states = {   //8

    Splash:0,
    Game:1,
    Score:2
};
var canvas;
var renderingContext;







function OctoGroup() {
    this.collection = [];
    this.reset = function () {

        this.collection = [];
    };

    this.add = function () {

        this.collection.push(new Octorock());//Octorock

    };





    this.update = function () {

       if(frames % 100 ===0) {    //add an octorock every 100 frames

           this.add();
       }


        for(var i = 0, len = this.collection.length;i<len;i++){


            var octorock = this.collection[i];


            if(i ===0){

                octorock.detectCollision();
                octorock.checkScore();

            }

            octorock.x -= 2;
            if(octorock.x < -octorock.width ){

                this.collection.splice(i,1);

                i--;
                len --;
            }

        }

    };

    this.draw = function () {

        for(var i = 0, len = this.collection.length;i<len;i++){

            var octorock = this.collection[i];

            octorock.draw();
        }
    }


}


function Octorock() {


    this.x= 400;
    this.y = 370;
    this.width = octorockSprite.width;
    this.height = octorockSprite.height;
    this.scored = false;



    this.detectCollision = function () {

        //console.log("value of x = "+ this.x);
        //console.log("value of y = "+ this.y);
        //console.log("value of hero x = "+ thehero.x);
        //console.log("value of hero y = "+ thehero.y);

        //console.log(thehero.y);
        if(this.x <= (thehero.x +thehero.width)&& this.x>=thehero.x&&thehero.y>=135){

            console.log("you are dead");


            currentState = states.Score;

            document.getElementById("resetbutton").style.display = "block";
            //localStorage.setItem("score")


        }

    }

    this.checkScore= function () {
        if((this.x + this.width)<thehero.x && ! this.scored){

            score++;
            this.scored = true;
            document.getElementById("score").innerHTML = "Score :"+score;
        }

    }






    this.draw = function () {

        octorockSprite.draw(renderingContext,this.x,this.y);
    }
}

function Hero() {

    this.x = 60;
    this.y = 180;
    this.width = 45;
    this.height = 55;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0,1,2,1];

    this.rotation = 0;
    this.radius = 12;
    this.gravity = 0.25;
    this._jump = 4.6;
    this.jumpcount = 3;


    this.jump = function () {

        if(this.jumpcount>0) {

            this.velocity = -this._jump;
            this.jumpcount--;
        }
    };

    this.update = function(){
        var h = currentState === states.Splash ? 10:5;
        this.frame += frames % h === 0 ? 1 : 0 ;
        this.frame %= this.animation.length;
        //console.log(this.frame);


        if(currentState === states.Splash){

            this.updateIdleHero();

        }

        else{

            this.updatePlayingHero();
        }
    };

    this.updateIdleHero =function () {

        //this.y = 250;
    };


    this.updatePlayingHero = function () {

        this.velocity += this.gravity;
        this.y += this.velocity;

        //check to see if hit the ground and stay there

        if(this.y >= 180){
            //console.log("hitting ground");
            this.y = 180;
            this.jumpcount = 3;
            this.velocity = this._jump; //resetting velocity after hitting the ground
        }
    };

    this.draw = function (renderingContext) {

        renderingContext.save();
        renderingContext.translate(this.x,this.y);
        renderingContext.rotate(this.rotation);
        var f = this.animation[this.frame];
        link[f].draw(renderingContext,20,this.y);//change the possition of animation x and y
        renderingContext.restore();

    }

}


function main() {    //1
    windowSetup();
    canvasSetup();
    currentState = states.Splash;
    document.getElementById("wrapper").appendChild(canvas);
    loadGraphics();
    thehero = new Hero();
    ogroup = new OctoGroup();
    localStorage.setItem("Highscore",0);

}

function resetgame() {


    ogroup.reset();
    currentState = states.Splash;
    console.log("score="+score);

    if(score>Number(localStorage.getItem("Highscore"))){

        localStorage.setItem("Highscore",score);

    }

    document.getElementById("Highscore").innerHTML = "High Score: "+localStorage.getItem("Highscore");

   score = 0;

    document.getElementById("resetbutton").style.display = "none";

}




function windowSetup() {   //2

    var inputEvent ="touchstart";
    var windowWidth=$(window).width();
    //console.log(windowWidth);

    if(windowWidth<500){

        width = 320;
        height = 430;
    }


    else {
        width = 400;
        height = 430;
        inputEvent = "mousedown";

    }

    document.addEventListener(inputEvent,onpress); //9  //make changes keycode is this do this with spacebars,enter key

}
function  onpress(evt) {   //10
                           //console.log("click happened");


    switch (currentState){

        case states.Splash:
            thehero.jump();
            currentState = states.Game;
            break;
        case states.Game:
            thehero.jump();
            break;
    }
}

function canvasSetup() {    //3

    canvas = document.createElement("canvas");

    canvas.style.border = "3px solid black";
    canvas.width = width;
    canvas.height = height;
    canvas.style.marginLeft = "35%";
    canvas.style.marginTop = "2%";


    renderingContext = canvas.getContext("2d");


}

function loadGraphics() {   //4
    var img = new Image();
    img.src = "linkSheet.png";
    img.onload = function () {

        initSprites(this);
        renderingContext.fillStyle = "#3db0dd";

        gameLoop();

    };


}

function gameLoop() {    //5

    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() {    //6

    frames++;
    if(currentState === states.Game){

        ogroup.update();

    }
    thehero.update();

}

function render() {    //7
    renderingContext.fillRect(0, 0, width, height);
    backgroundSprite.draw(renderingContext,0,180);
    ogroup.draw(renderingContext);
    thehero.draw(renderingContext);


}











