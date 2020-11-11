var myGamePiece;
var myGamePieceW;
var myGamePieceH;
var myTarget;
var myTargetX;
var myTargetY;
var myKuka;
var myScore;
var myScoreCounter = 0;
var myCanvasWidth;
var myCanvasHeight;
var trafficjobb=[];
var trafficbal=[];
var SATArray=[];
var BtestX;
var BtestY;
var BtestW;
var BtestH;
var myGameOver;
var myGameRestart;
var kapta = 0;
var ctx;

trafficjobb = [
    "auto/jobb/jarmu1.png",
    "auto/jobb/jarmu2.png",
    "auto/jobb/jarmu3.png",
    "auto/jobb/jarmu4.png",
    "auto/jobb/jarmu5.png",
    "auto/jobb/jarmu6.png",
    "auto/jobb/jarmu7.png",
    "auto/jobb/jarmu8.png",
    "auto/jobb/jarmu9.png",
    "auto/jobb/jarmu10.png",
]
trafficbal = [
    "auto/bal/jarmu1.png",
    "auto/bal/jarmu2.png",
    "auto/bal/jarmu3.png",
    "auto/bal/jarmu4.png",
    "auto/bal/jarmu5.png",
    "auto/bal/jarmu6.png",
    "auto/bal/jarmu7.png",
    "auto/bal/jarmu8.png",
    "auto/bal/jarmu9.png",
    "auto/bal/jarmu10.png",
]

//meghatározom a canvas nagyságát 720p és 900p között és ezzel arányosan a többi test méretét is
if (window.innerHeight > 900) {
    myCanvasWidth = 1600;
    myCanvasHeight = 900;
    myGamePieceW = 35 * 0.75;
    myGamePieceH = 104 * 0.75;
    myTrafficW = 45 * 1.25;
    myTrafficH = 22.5 * 1.25;
} else if (window.innerHeight < 720) {
    myCanvasWidth = 1280;
    myCanvasHeight = 720;
    myGamePieceW = 35 * 0.75 * 0.8;
    myGamePieceH = 104 * 0.75 * 0.8;
    myTrafficW = 45;
    myTrafficH = 22.5;
} else {
    myCanvasHeight = window.innerHeight;
    myCanvasWidth = 1600 * (window.innerHeight / 900);
    myGamePieceW = 35 * 0.75 * (window.innerHeight / 900);
    myGamePieceH = 104 * 0.75 * (window.innerHeight / 900);
    myTrafficW = 45 * (window.innerHeight / 900);
    myTrafficH = 22.5 * (window.innerHeight / 900);
}

var myRoadWidth = myGamePieceW * 4.2;
var myBlockW = (myCanvasWidth - 3 * myRoadWidth) / 4;
var myBlockH = (myCanvasHeight - 2* myRoadWidth) / 3;
var L1spawnH = myBlockH + myRoadWidth  / 3 - myTrafficH / 2;
var L2spawnH = 2 * myBlockH + myRoadWidth + myRoadWidth  / 3 - myTrafficH / 2;
var R1spawnH = myBlockH + myRoadWidth * 2 / 3 - myTrafficH / 2;
var R2spawnH = 2 * myBlockH + myRoadWidth + myRoadWidth * 2 / 3 - myTrafficH / 2;

function myTargetRandomPlace() {
    // a középső 2 kocka körüli utakon jelenhet csak meg a kuka, hogy ne legyen szopatás a forgalom
    // az x,y koordinátáktól jobbra le rajzolja a kockát, ezt a számolásoknál figyelembe kell venni
    // 3 szakaszra bontom a spawn zónát, felső út, alsó út, és a 3 kis függőleges darab együtt
    var melyik = Math.floor(Math.random() * 5);
    if (melyik == 0) {
        myTargetX = myBlockW + Math.random() * (myBlockW * 2 + myRoadWidth * 3 - 15);
        myTargetY = myBlockH + Math.random() * (myRoadWidth - 20);
    } else if (melyik == 1) {
        myTargetX = myBlockW + Math.random() * (myBlockW * 2 + myRoadWidth * 3 - 15);
        myTargetY = myBlockH * 2 + myRoadWidth + Math.random() * (myRoadWidth - 20);
    } else if (melyik == 2){
        myTargetX = myBlockW + ((Math.floor(Math.random() * 3)) * (myBlockW + myRoadWidth)) + Math.random()*(myRoadWidth - 15);
        myTargetY = Math.random() * (myBlockH - 20);
    } else if (melyik == 3) {
        myTargetX = myBlockW + ((Math.floor(Math.random() * 3)) * (myBlockW + myRoadWidth)) + Math.random()*(myRoadWidth - 15);
        myTargetY = myBlockH + myRoadWidth + Math.random() * (myBlockH - 20);
    } else {
        myTargetX = myBlockW + ((Math.floor(Math.random() * 3)) * (myBlockW + myRoadWidth)) + Math.random()*(myRoadWidth - 15);
        myTargetY = 2 * myBlockH + 2 * myRoadWidth + Math.random() * (myBlockH - 20);
    }
}

function startGame() {
    myTargetRandomPlace();
    myGamePiece = new component(myGamePieceW, myGamePieceH, "kukasauto.gif", myCanvasWidth/2, myCanvasHeight/2, "kukasauto");
    SATArray.push(myTarget = new component(15, 20, "kukapixel2.png", myTargetX, myTargetY,"kuka"));
    myScore = new component("30px", "Consolas", "black", 5, 30, "text");
    SATArray.push(myBlock = new component(myBlockW,myBlockH,"blocks/block8.png",0,0, "teszt"));
    SATArray.push(myBlock2 = new component(myBlockW,myBlockH,"blocks/block1.png",0,myBlockH+myRoadWidth, "teszt"));
    SATArray.push(myBlock3 = new component(myBlockW,myBlockH,"blocks/block6.png",0,(myBlockH+myRoadWidth)*2, "teszt"));
    SATArray.push(myBlock4 = new component(myBlockW,myBlockH,"blocks/block7.png",myBlockW+myRoadWidth,0, "teszt"));
    SATArray.push(myBlock5 = new component(myBlockW,myBlockH,"blocks/block3.png",myBlockW+myRoadWidth,myBlockH+myRoadWidth, "teszt"));
    SATArray.push(myBlock6 = new component(myBlockW,myBlockH,"blocks/block12.png",myBlockW+myRoadWidth,(myBlockH+myRoadWidth)*2,"teszt"));
    SATArray.push(myBlock7 = new component(myBlockW,myBlockH,"blocks/block5.png",(myBlockW+myRoadWidth)*2,0,"teszt"));
    SATArray.push(myBlock8 = new component(myBlockW,myBlockH,"blocks/block2.png",(myBlockW+myRoadWidth)*2,myBlockH+myRoadWidth,"teszt"));
    SATArray.push(myBlock9 = new component(myBlockW,myBlockH,"blocks/block4.png",(myBlockW+myRoadWidth)*2,(myBlockH+myRoadWidth)*2,"teszt"));
    SATArray.push(myBlock10 = new component(myBlockW,myBlockH,"blocks/block10.png",(myBlockW+myRoadWidth)*3,0,"teszt"));
    SATArray.push(myBlock11 = new component(myBlockW,myBlockH,"blocks/block11.png",(myBlockW+myRoadWidth)*3,myBlockH+myRoadWidth,"teszt"));
    SATArray.push(myBlock12 = new component(myBlockW,myBlockH,"blocks/block9.png",(myBlockW+myRoadWidth)*3,(myBlockH+myRoadWidth)*2,"teszt"));
    SATArray.push(myTrafficjobb1 = new component(myTrafficW,myTrafficH,"auto/jobb/jarmu1.png",-200,R1spawnH,"trafficjobb"));
    SATArray.push(myTrafficjobb2 = new component(myTrafficW,myTrafficH,"auto/jobb/jarmu5.png",-600,R2spawnH,"trafficjobb"));
    SATArray.push(myTrafficbal1 = new component(myTrafficW,myTrafficH,"auto/bal/jarmu8.png",myCanvasWidth+600,L1spawnH,"trafficbal"));
    SATArray.push(myTrafficbal2 = new component(myTrafficW,myTrafficH,"auto/bal/jarmu3.png",myCanvasWidth+100,L2spawnH,"trafficbal"));
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = myCanvasWidth;
        this.canvas.height = myCanvasHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 8.333);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        window.removeEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.setTimeout(restart,1000);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "kukasauto" || type == "teszt" || type == "kuka" || type =="kut" || type=="trafficjobb" || type=="trafficbal") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "kukasauto") {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        } else if (type == "kut" || type=="teszt" || type == "kuka" || type =="trafficjobb" || type=="trafficbal") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else if (type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if (type=="kukasauto") {
            this.angle += this.moveAngle * Math.PI / 180;
            this.x += this.speed * Math.sin(this.angle);
            this.y -= this.speed * Math.cos(this.angle);
        } else if (type=="trafficjobb") {
            if (this.x > myCanvasWidth) {
                this.x = -200;
                this.image.src = trafficjobb[Math.floor(Math.random()*10)];
            }
            this.x += 1.5;
        } else if (type=="trafficbal") {
            if (this.x < -200) {
                this.x = myCanvasWidth+200;
                this.image.src = trafficbal[Math.floor(Math.random()*10)];
            }
            this.x -= 1.5;
        }
    }
}

function updateGameArea() {
        var direction;
        var v;
        myGameArea.clear();
        myBlock.update();
        myBlock2.update();
        myBlock3.update();
        myBlock4.update();
        myBlock5.update();
        myBlock6.update();
        myBlock7.update();
        myBlock8.update();
        myBlock9.update();
        myBlock10.update();
        myBlock11.update();
        myBlock12.update();
        myTrafficjobb1.newPos();
        myTrafficjobb1.update();
        myTrafficjobb2.newPos();
        myTrafficjobb2.update();
        myTrafficbal1.newPos();
        myTrafficbal1.update();
        myTrafficbal2.newPos();
        myTrafficbal2.update();
        myTarget.update();
        myGamePiece.moveAngle = 0;
        myGamePiece.speed = 0;
        if ((myGameArea.keys && myGameArea.keys[16])){
            v = 2;
        } else if (myGameArea.keys && myGameArea.keys[32]) {
            v = 1;
        } else {
            v = 1.5;
        }
        if ((myGameArea.keys && myGameArea.keys[38]) || (myGameArea.keys && myGameArea.keys[87])) {
            myGamePiece.speed= v; direction = 1;
        }
        if ((myGameArea.keys && myGameArea.keys[40]) || (myGameArea.keys && myGameArea.keys[83])) {
            myGamePiece.speed= -v; direction = -1;
        }
        if ((myGameArea.keys && myGameArea.keys[65]) || (myGameArea.keys && myGameArea.keys[37])) { 
            if (direction == -1){
                myGamePiece.moveAngle = v;
            } else if (direction == 1){
                myGamePiece.moveAngle = -v;
            }
        }
        if ((myGameArea.keys && myGameArea.keys[68]) || (myGameArea.keys && myGameArea.keys[39])) { 
            if (direction == -1){
                myGamePiece.moveAngle = -v;
            } else if (direction == 1){
                myGamePiece.moveAngle = v;
            }
        }
        myScore.text = "PONTSZÁM: " + myScoreCounter;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
        for(var k = 0; k < SATArray.length; k++){
            BtestX = SATArray[k].x;
            BtestY = SATArray[k].y;
            BtestW = SATArray[k].width;
            BtestH = SATArray[k].height;
            sat();
            if (sat()) {
                if (SATArray[k].type == "kuka"){
                    myTargetRandomPlace();
                    myTarget.x=myTargetX;
                    myTarget.y=myTargetY;
                    myScoreCounter +=1;
                } else {
                    ctx.fillStyle = 'rgba(200,200,200,0.5)';
                    ctx.fillRect(0,0,myCanvasWidth,myCanvasHeight);
                    myGameOver = new component("150px", "Consolas", "black", myCanvasWidth/2-450, myCanvasHeight/2+40, "text");
                    myGameOver.text = "Játék vége!";
                    myGameRestart = new component("30px", "Consolas", "black", myCanvasWidth/2-350, myCanvasHeight/2+150, "text");
                    myGameRestart.text = "Nyomj le egy billentyűt az újraindításhoz!";
                    kapta = 1;
                    myGameOver.update();
                    myGameRestart.update();
                    myGameArea.stop();
                }
            }
        }
        if (myGamePiece.x < 0) {
            myGamePiece.x = myCanvasWidth-1;
        } else if (myGamePiece.x > myCanvasWidth) {
            myGamePiece.x = 1;
        } else if(myGamePiece.y < 0) {
            myGamePiece.y = myCanvasHeight-1;
        } else if (myGamePiece.y > myCanvasHeight) {
            myGamePiece.y = 1;
        }
}

function restart(){
    window.addEventListener('keydown', function(e){
        e.preventDefault();
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = (e.type == "keydown");
        if (kapta == 1) {
            location.reload();
        }
    })  
}

function xy(x,y){
    this.x = x;
    this.y = y;
};
function polygon(vertices, edges){
    this.vertex = vertices;
    this.edge = edges;
};

function sat(){
    var atlo = Math.sqrt(Math.pow(myGamePiece.width,2)+Math.pow(myGamePiece.height,2))/2;
    var sinalfa = Math.sin(Math.atan(myGamePiece.width/myGamePiece.height));
    var KozepX = Math.floor(myGamePiece.x);
    var KozepY = Math.floor(myGamePiece.y);
    var BalFelsoX = KozepX + (Math.floor(Math.sin(myGamePiece.angle - (sinalfa))*(atlo)))*0.75;
    var BalFelsoY = KozepY - (Math.floor(Math.cos(myGamePiece.angle - (sinalfa))*(atlo)))*0.75;
    var JobbFelsoX = KozepX + (Math.floor(Math.sin(myGamePiece.angle + (sinalfa))*(atlo)))*0.75;
    var JobbFelsoY = KozepY - (Math.floor(Math.cos(myGamePiece.angle + (sinalfa))*(atlo)))*0.75;
    var JobbAlsoX = KozepX - (Math.floor(Math.sin(myGamePiece.angle - (sinalfa))*(atlo)) -1)*0.75;
    var JobbAlsoY = KozepY + (Math.floor(Math.cos(myGamePiece.angle - (sinalfa))*(atlo)))*0.75;
    var BalAlsoX = KozepX - (Math.floor(Math.sin(myGamePiece.angle + (sinalfa))*(atlo)) -1)*0.75;
    var BalAlsoY = KozepY + (Math.floor(Math.cos(myGamePiece.angle + (sinalfa))*(atlo)))*0.75;
    var polygonA;
    var polygonAVertices = [];
    var polygonAEdges = [];
    polygonAVertices.push(new xy(BalFelsoX, BalFelsoY));
    polygonAVertices.push(new xy(JobbFelsoX, JobbFelsoY));
    polygonAVertices.push(new xy(JobbAlsoX, JobbAlsoY));
    polygonAVertices.push(new xy(BalAlsoX, BalAlsoY));
    polygonAEdges.push(new xy(JobbFelsoX - BalFelsoX, JobbFelsoY - BalFelsoY));
    polygonAEdges.push(new xy(JobbAlsoX - JobbFelsoX, JobbAlsoY - JobbFelsoY));
    polygonAEdges.push(new xy(BalAlsoX - JobbAlsoX, BalAlsoY - JobbAlsoY));
    polygonAEdges.push(new xy(BalFelsoX - BalAlsoX, BalFelsoY - BalAlsoY));
    polygonA = null;
    polygonA = new polygon(polygonAVertices, polygonAEdges);
    var polygonB;
    var polygonBVertices = [];
    var polygonBEdges = [];
    polygonBVertices.push(new xy(BtestX, BtestY));
    polygonBVertices.push(new xy(BtestX + BtestW, BtestY));
    polygonBVertices.push(new xy(BtestX + BtestW, BtestY + BtestH));
    polygonBVertices.push(new xy(BtestX, BtestY + BtestH));
    polygonBEdges.push(new xy(BtestX- (BtestX + BtestH), BtestY -BtestY));
    polygonBEdges.push(new xy((BtestX + BtestW) - (BtestX + BtestW), BtestY -(BtestY + BtestH)));
    polygonBEdges.push(new xy((BtestX + BtestW) - BtestX, (BtestY + BtestH) -(BtestY + BtestH)));
    polygonBEdges.push(new xy(BtestX - BtestX, (BtestY + BtestH) -BtestY));
    polygonB = null;
    polygonB = new polygon(polygonBVertices, polygonBEdges);
    var perpendicularLine = null;
    var dot = 0;
    var perpendicularStack = []; //merőleges vektorok array
    var amin = null;
    var amax = null;
    var bmin = null;
    var bmax = null;
    //a 2 test merőleges vektorainak kiszámolása és beszórása az arraybe
    for(var i = 0; i < polygonA.edge.length; i++){
        perpendicularLine = new xy(-polygonA.edge[i].y, polygonA.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    for(var i = 0; i < polygonB.edge.length; i++){
        perpendicularLine = new xy(-polygonB.edge[i].y, polygonB.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    //végigmegyünk egyesével a vektorokon
    for(var i = 0; i < perpendicularStack.length; i++){
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        //vizsgáljuk A test vektorokra vetített pontjait
        for(var j = 0; j < polygonA.vertex.length; j++){
            dot = polygonA.vertex[j].x * perpendicularStack[i].x + polygonA.vertex[j].y * perpendicularStack[i].y;
            if(amax === null || dot > amax){
                amax = dot;
            }
            if(amin === null || dot < amin){
                amin = dot;
            }
        }
        //vizsgáljuk B test vektorokra vetített pontjait
        for(var j = 0; j < polygonB.vertex.length; j++){
            dot = polygonB.vertex[j].x * perpendicularStack[i].x + polygonB.vertex[j].y * perpendicularStack[i].y;
            if(bmax === null || dot > bmax){
                bmax = dot;
            }
            if(bmin === null || dot < bmin){
                bmin = dot;
            }
        }
        //nézem van-e átfedés
        if((amin < bmax && amin > bmin) || (bmin < amax && bmin > amin)){
            continue;
        }
        // ha valahol nem fedik egymást akkor false
        else {
            return false;
        }
    }
    //ha minden vektoron fedés van akkor true
    return true;
}