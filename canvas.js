
"use strict";
let myCanvas1 = document.getElementById("myCanvas1"),
    myCanvas2 = document.getElementById("myCanvas2"),
    ctx1 = myCanvas1.getContext("2d"), ctx2 = myCanvas2.getContext("2d"),
    canvW, canvH, trafficW, green = "#0F9A48", ghostWhite = "#E8E9F3",
    lightGray = "#CECECE", raisinBlack = "#272635", darkGray = "#6D6A75",
    trafficH, BtestX, BtestY, BtestW, BtestH, truck, truckW, truckH, target,
    targetX, targetY, endTxt, resetTxt, score, countDown, counter = 60,
    scoreCounter = 0, startButton, trafficR1, trafficR2, trafficL1, startTxt,
    trafficL2, countdownColor = "green", myMenuBG, gameAreaBG, mouseX, mouseY,
    trafficSpeed = 1.5, mode = "norm", challCounter = 20, trashcanW, gap,
    trashcanH;

const SATArr = [], blockXArr = [], blockYArr = [], introArr = [], dfcArr = [],
    dfcTxtArr = [], modeArr = [], modeTxtArr = [],
    trafficRArr = [
        "auto/jobb/jarmu1.png", "auto/jobb/jarmu2.png", "auto/jobb/jarmu3.png",
        "auto/jobb/jarmu4.png", "auto/jobb/jarmu5.png", "auto/jobb/jarmu6.png",
        "auto/jobb/jarmu7.png", "auto/jobb/jarmu8.png", "auto/jobb/jarmu9.png",
        "auto/jobb/jarmu10.png"
    ],
    trafficLArr = [
        "auto/bal/jarmu1.png", "auto/bal/jarmu2.png", "auto/bal/jarmu3.png",
        "auto/bal/jarmu4.png", "auto/bal/jarmu5.png", "auto/bal/jarmu6.png",
        "auto/bal/jarmu7.png", "auto/bal/jarmu8.png", "auto/bal/jarmu9.png",
        "auto/bal/jarmu10.png"
    ],
    blockArr = [
        "blocks/block1.png", "blocks/block2.png", "blocks/block3-1.png",
        "blocks/block4.png", "blocks/block5-1.png", "blocks/block6.png",
        "blocks/block7.png", "blocks/block8.png", "blocks/block9.png",
        "blocks/block10.png", "blocks/block11.png", "blocks/block12.png"
    ],
    windMillArr = [
        "blocks/block3-1.png", "blocks/block3-2.png", "blocks/block3-3.png"
    ],
    waterFallArr = [
        "blocks/block5-1.png", "blocks/block5-2.png", "blocks/block5-3.png",
        "blocks/block5-4.png"
    ];

//meghatározom a canvas nagyságát 720p és 900p között és ezzel arányosan a többi test méretét is
if (window.innerHeight > 900) {
    canvW = 1600;
    canvH = 900;
    trashcanH = 20 * 10 / 8;
    trashcanW = trashcanH * 3 / 4;
    truckW = 45 * 75 / 100;
    truckH = truckW * 3;
    trafficW = 45 * 125 / 100;
    trafficH = trafficW / 2;
    gap = (canvW - 1100) / 2;
} else if (window.innerHeight < 720) {
    canvW = 1280;
    canvH = 720;
    trashcanH = 20;
    trashcanW = trashcanH * 3 / 4;
    truckW = 45 * (75 / 100) * (8 / 10);
    truckH = truckW * 3;
    trafficW = 45;
    trafficH = trafficW / 2;
    gap = (canvW - 1100) / 2 * (8 / 10);
} else {
    canvH = window.innerHeight;
    canvW = 1600 * (window.innerHeight / 900);
    trashcanH = 20 * (window.innerHeight / 900);
    trashcanW = trashcanH * 3 / 4;
    truckW = 45 * (75 / 100) * (window.innerHeight / 900);
    truckH = truckW * 3;
    trafficW = 45 * (window.innerHeight / 900);
    trafficH = trafficW / 2;
    gap = (canvW - 1100) / 2 * (window.innerHeight / 900);
}

let roadW = truckW * 4.2;
let blockW = (canvW - 3 * roadW) / 4;
let blockH = (canvH - 2 * roadW) / 3;
let L1spawnH = blockH + roadW / 3 - trafficH / 2;
let L2spawnH = 2 * blockH + roadW + roadW / 3 - trafficH / 2;
let R1spawnH = blockH + roadW * 2 / 3 - trafficH / 2;
let R2spawnH = 2 * blockH + roadW + roadW * 2 / 3 - trafficH / 2;
let challTxt = "Minden hulladék begyűjtése után kevesebb időd lesz a következőre";
let normTxt = "Gyűjts össze minél több hulladékot egy perc alatt";

function onInit() {
    // menühöz tartozó cuccok
    myMenuBG = new component(canvW, canvH, lightGray, 0, 0);
    for (let i = 0; i < 3; i++) {
        dfcArr.push(new component(150, 36, darkGray, 250 + i * 170 + gap, 272));
        dfcTxtArr.push(new component("30px", "Arial", ghostWhite,
            dfcArr[i].x + dfcArr[i].width / 2, dfcArr[i].y + 27, "txtMid"));
    }
    dfcArr[1].color = green;
    dfcTxtArr[0].text = "Könnyű";
    dfcTxtArr[1].text = "Közepes";
    dfcTxtArr[2].text = "Nehéz";
    for (let i = 0; i < 2; i++) {
        modeArr.push(new component(175, 36, darkGray, 250 + i * 195 + gap, 312));
        modeTxtArr.push(new component("30px", "Arial", ghostWhite,
            modeArr[i].x + modeArr[i].width / 2, modeArr[i].y + 27,
            "txtMid"));
    }
    modeArr[0].color = green;
    modeTxtArr[0].text = "Normál mód";
    modeTxtArr[1].text = "Kivíhás mód";
    for (let i = 0; i < 8; i++) {
        introArr.push(new component("30px", "Arial", green, 100 + gap,
            100 + i * 40, "text"));
    }
    introArr[0].text = "Gyűjts hulladékot a kukásautóval!";
    introArr[1].text = "Irányítás:";
    introArr[2].text = " - Nyilakkal, vagy WASD gombokkal mozgasd a kukásautót";
    introArr[3].text = " - Sebesség növelése a SHIFT, csökkentése a szóköz gombbal";
    introArr[4].text = "Vigyázz, ha összeütközöl valamivel, akkor vége a játéknak.";
    introArr[5].text = "Nehézség:";
    introArr[6].text = "Játékmód:";
    introArr[7].text = normTxt;
    startButton = new component(350, 55, green, 100 + gap, 400);
    startTxt = new component("30px", "Arial", ghostWhite,
        startButton.x + startButton.width / 2, startButton.y + 40, "txtMid");
    startTxt.text = "Játék indítása";

    // játékhoz tartozó cuccok
    gameAreaBG = new component(canvW, canvH, "blocks/road.png", 0, 0, "bg");
    targetRndPlace();
    truck = new component(truckW, truckH, "truck.png", canvW / 2,
        canvH / 2, "truck");
    SATArr.push(target = new component(trashcanW, trashcanH, "kukapixel2.png",
        targetX, targetY, "trashcan"));
    score = new component("30px", "Arial", "black", 5, 30, "text");

    for (let i = 0; i < 4; i++) {
        blockXArr.push(0 + i * (blockW + roadW));
    }
    for (let i = 0; i < 3; i++) {
        blockYArr.push(0 + i * (blockH + roadW));
    }
    blockArr.reverse();
    for (const x of blockXArr) {
        for (const y of blockYArr) {
            SATArr.push(new component(blockW, blockH, blockArr.pop(),
                x, y, "block"));
        }
    }
    SATArr.push(trafficR1 = new component(trafficW, trafficH,
        "auto/jobb/jarmu1.png", -200, R1spawnH, "trafficR"));
    SATArr.push(trafficR2 = new component(trafficW, trafficH,
        "auto/jobb/jarmu5.png", -600, R2spawnH, "trafficR"));
    SATArr.push(trafficL1 = new component(trafficW, trafficH,
        "auto/bal/jarmu8.png", canvW + 600, L1spawnH, "trafficL"));
    SATArr.push(trafficL2 = new component(trafficW, trafficH,
        "auto/bal/jarmu3.png", canvW + 100, L2spawnH, "trafficL"));
    countDown = new component("30px", "Arial", countdownColor,
        SATArr[11].x + blockW / 4, SATArr[11].y + blockH / 2, "countdown");
    myMenu.start();
}

let myMenu = {
    canvas: myCanvas1,
    start: function () {
        this.canvas.width = canvW;
        this.canvas.height = canvH;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateMyMenu, 1000);
        window.addEventListener("click", onMouseClick, false);
        window.addEventListener("mousemove", onMouseMove, false);
        updateMyMenu();
    },
    clear: function () {
        ctx1.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        window.removeEventListener("click", onMouseClick, false);
    }
}

let gameArea = {
    canvas: myCanvas1,
    start: function () {
        myMenu.stop();
        this.canvas.width = canvW;
        this.canvas.height = canvH;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(function () {
            animation();
            updateGameArea();
        }, 1000 / 4);
        this.interval2 = setInterval(count, 1000);
        updateGameArea();
    },
    clear: function () {
        ctx1.clearRect(0, 0, canvW, canvH);
    },
    stop: function () {
        clearInterval(this.interval);
        clearInterval(this.interval2);
    }
}

let movementArea = {
    canvas: myCanvas2,
    start: function () {
        this.canvas.width = canvW;
        this.canvas.height = canvH;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateMovement, 1000 / 120);
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);
    },
    clear: function () {
        ctx2.clearRect(0, 0, canvW, canvH);
    },
    stop: function () {
        clearInterval(this.interval);
        window.removeEventListener("keydown", onKeyDown, false);
        window.setTimeout(reset, 1000);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "truck" || type == "block" || type == "trashcan" ||
        type == "trafficR" || type == "trafficL" || type == "bg") {
        this.image = new Image();
        this.image.src = color;
    } else {
        this.color = color;
    }
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        if (type == "truck") {
            ctx2.save();
            ctx2.translate(this.x, this.y);
            ctx2.rotate(this.angle);
            ctx2.drawImage(this.image, this.width / -2, this.height / -2,
                this.width, this.height);
            ctx2.restore();
        } else if (type == "trashcan" || type == "trafficR" ||
            type == "trafficL") {
            ctx2.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else if (type == "endTxt") {
            ctx2.font = this.width + " " + this.height;
            ctx2.fillStyle = this.color;
            ctx2.textAlign = "center";
            ctx2.fillText(this.text, this.x, this.y);
        } else if (type == "block") {
            ctx1.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else if (type == "bg") {
            let pattern = ctx1.createPattern(this.image, 'repeat');
            ctx1.fillStyle = pattern;
            ctx1.fillRect(0, 0, canvW, canvH,);
        } else if (type == "text") {
            ctx1.font = this.width + " " + this.height;
            ctx1.fillStyle = this.color;
            ctx1.textAlign = "left";
            ctx1.fillText(this.text, this.x, this.y);
        } else if (type == "txtMid") {
            ctx1.font = this.width + " " + this.height;
            ctx1.fillStyle = this.color;
            ctx1.textAlign = "center";
            ctx1.fillText(this.text, this.x, this.y);
        } else if (type == "countdown") {
            ctx1.font = this.width + " " + this.height;
            ctx1.fillStyle = countdownColor;
            ctx1.fillText(this.text, this.x, this.y);
        } else {
            ctx1.fillStyle = this.color;
            ctx1.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        if (type == "truck") {
            this.angle += this.moveAngle * Math.PI / 180;
            this.x += this.speed * Math.sin(this.angle);
            this.y -= this.speed * Math.cos(this.angle);
        } else if (type == "trafficR") {
            if (this.x > canvW) {
                this.x = -200;
                this.image.src = trafficRArr[Math.floor(Math.random() * 10)];
            }
            this.x += trafficSpeed;
        } else if (type == "trafficL") {
            if (this.x < -200) {
                this.x = canvW + 200;
                this.image.src = trafficLArr[Math.floor(Math.random() * 10)];
            }
            this.x -= trafficSpeed;
        }
    }
}

function onMouseClick() {
    if (checkMouse(startButton, mouseX, mouseY)) {
        gameArea.start();
        movementArea.start();
        return;
    }
    for (let i = 0; i < 3; i++) {
        if (checkMouse(dfcArr[i], mouseX, mouseY)) {
            for (const dfc of dfcArr) {
                dfc.color = darkGray;
            }
            dfcArr[i].color = green;
            trafficSpeed = 1 + i * 0.5;
            updateMyMenu();
            return;
        }
    }
    for (let i = 0; i < 2; i++) {
        if (checkMouse(modeArr[i], mouseX, mouseY)) {
            for (const modes of modeArr) {
                modes.color = darkGray;
            }
            modeArr[i].color = green;
            switch (i) {
                case 0:
                    mode = "norm";
                    counter = 60;
                    introArr[7].text = normTxt;
                    break;
                case 1:
                    mode = "chall";
                    counter = 20;
                    introArr[7].text = challTxt;
            }
            updateMyMenu();
        }
    }
}

function onMouseMove(e) {
    let tmpElem = document.getElementById("myCanvas1");
    let canvCurrPos = tmpElem.getBoundingClientRect();
    mouseX = e.clientX - canvCurrPos.left;
    mouseY = e.clientY - canvCurrPos.top;
}

function onKeyDown(e) {
    e.preventDefault();
    gameArea.keys = (gameArea.keys || []);
    gameArea.keys[e.keyCode] = (e.type == "keydown");
}

function onKeyUp(e) {
    gameArea.keys[e.keyCode] = (e.type == "keydown");
}

function animation() {
    windMillArr.push(windMillArr.shift());
    SATArr[3].image.src = windMillArr[0];
    waterFallArr.push(waterFallArr.shift());
    SATArr[5].image.src = waterFallArr[0];
}

function checkMouse(rect, mX, mY) {
    if (mX > rect.x &&
        mX < rect.x + rect.width &&
        mY > rect.y &&
        mY < rect.y + rect.height) {
        return true;
    }
    return false;
}

function count() {

    if (counter != 0) {
        counter -= 1;
    } else {
        gameOver("time");
    }
    if (counter > 10) {
        countdownColor = "green";
    } else if ((counter <= 10) && (counter > 5)) {
        countdownColor = "yellow";
    } else if (counter <= 5) {
        countdownColor = "red";
    }
}

function targetRndPlace() {
    let rnd = Math.floor(Math.random() * 5);
    switch (rnd) {
        case 0: // felső vízszintes utca (szélek nem 1-1 blokk)
            targetX = blockW + Math.random() * (blockW * 2 + roadW * 3 - trashcanW);
            targetY = blockH + Math.random() * (roadW - trashcanH);
            break;
        case 1: // alsó vízszintes utca (szélek nem 1-1 blokk)
            targetX = blockW + Math.random() * (blockW * 2 + roadW * 3 - trashcanW);
            targetY = blockH * 2 + roadW + Math.random() * (roadW - trashcanH);
            break;
        case 2: // felső 3 függőleges darabka
            targetX = blockW + ((Math.floor(Math.random() * 3)) *
                (blockW + roadW)) + Math.random() * (roadW - trashcanW);
            targetY = Math.random() * (blockH - trashcanH);
            break;
        case 3: // középső 3 függőleges darabka
            targetX = blockW + ((Math.floor(Math.random() * 3)) *
                (blockW + roadW)) + Math.random() * (roadW - trashcanW);
            targetY = blockH + roadW + Math.random() * (blockH - trashcanH);
            break;
        default: // alsó 3 függőleges darabka
            targetX = blockW + ((Math.floor(Math.random() * 3)) *
                (blockW + roadW)) + Math.random() * (roadW - trashcanW);
            targetY = 2 * blockH + 2 * roadW + Math.random() * (blockH - trashcanH);
    }
}

function updateMyMenu() {
    myMenu.clear();
    myMenuBG.update();
    startButton.update();
    startTxt.update();
    for (const dfc of dfcArr) {
        dfc.update();
    }
    for (const dfcTxt of dfcTxtArr) {
        dfcTxt.update();
    }
    for (const intro of introArr) {
        intro.update();
    }
    for (const mode of modeArr) {
        mode.update();
    }
    for (const modeTxt of modeTxtArr) {
        modeTxt.update();
    }
}

function updateMovement() {
    movementArea.clear();
    for (const elem of SATArr) {
        if (elem.type == "trashcan") {
            elem.update();
        } else if (elem.type == "trafficR" || elem.type == "trafficL") {
            elem.newPos();
            elem.update();
        }
    }
    truckMovement();
    truck.newPos();
    truck.update();
    useSAT();
}

function updateGameArea() {
    gameArea.clear();
    gameAreaBG.update();
    for (const elem of SATArr) {
        if (elem.type == "block") {
            elem.update();
        }
    }
    countDown.text = "Idő: " + counter;
    countDown.update();
    score.text = "Pontszám: " + scoreCounter;
    score.update();
}

function truckMovement() {
    let v, direction;
    truck.moveAngle = 0;
    truck.speed = 0;
    if (gameArea.keys) {
        if (gameArea.keys[16]) {
            v = 2;
        } else if (gameArea.keys[32]) {
            v = 1;
        } else {
            v = 1.5;
        }
        if (gameArea.keys[38] || gameArea.keys[87]) {
            truck.speed = v; direction = 1;
        }
        if (gameArea.keys[40] || gameArea.keys[83]) {
            truck.speed = -v; direction = -1;
        }
        if (gameArea.keys[65] || gameArea.keys[37]) {
            if (direction == -1) {
                truck.moveAngle = v;
            } else if (direction == 1) {
                truck.moveAngle = -v;
            }
        }
        if (gameArea.keys[68] || gameArea.keys[39]) {
            if (direction == -1) {
                truck.moveAngle = -v;
            } else if (direction == 1) {
                truck.moveAngle = v;
            }
        }
    }
    if (truck.x < 0) {
        truck.x = canvW - 1;
    } else if (truck.x > canvW) {
        truck.x = 1;
    } else if (truck.y < 0) {
        truck.y = canvH - 1;
    } else if (truck.y > canvH) {
        truck.y = 1;
    }
}

function useSAT() {
    for (let i = 0; i < SATArr.length; i++) {
        BtestX = SATArr[i].x;
        BtestY = SATArr[i].y;
        BtestW = SATArr[i].width;
        BtestH = SATArr[i].height;
        if (sat()) {
            if (SATArr[i].type == "trashcan") {
                targetRndPlace();
                target.x = targetX;
                target.y = targetY;
                scoreCounter += 1;
                if (mode == "chall") {
                    challCounter -= 1;
                    counter = challCounter;
                }
            } else {
                gameOver("crash");
            }
        }
    }
}

function gameOver(reason) {
    ctx2.fillStyle = 'rgba(200,200,200,0.8)';
    ctx2.fillRect(0, 0, canvW, canvH);
    endTxt = new component("50px", "Arial", "black",
        canvW / 2, canvH / 2 + 25, "endTxt");
    if (reason == "crash") {
        endTxt.text = "Összeütköztél, a játék véget ért!"
    } else {
        endTxt.text = "Elfogyott az időd, a játék véget ért!"
    }
    let scoreTxt = new component("30px", "Arial", "black", canvW / 2,
        canvH / 2 + 75, "endTxt");
    scoreTxt.text = "Pontszám: " + scoreCounter;
    resetTxt = new component("30px", "Arial", "black",
        canvW / 2, canvH / 2 + 150, "endTxt");
    resetTxt.text = "Nyomj le egy billentyűt az újraindításhoz!";
    endTxt.update();
    scoreTxt.update();
    resetTxt.update();
    gameArea.stop();
    movementArea.stop();
}

function reset() {
    window.addEventListener('keydown', function () {
        //angular typescript féle this.ngOnInit() kell majd ide asszem
        this.location.reload();
    })
}

function xy(x, y) {
    this.x = x;
    this.y = y;
};
function poly(vertex, edge) {
    this.vertex = vertex;
    this.edge = edge;
};

function sat() {
    let diag = Math.sqrt(Math.pow(truck.width, 2) + Math.pow(truck.height, 2)) / 2;
    let sinalfa = Math.sin(Math.atan(truck.width / truck.height));
    let midX = Math.floor(truck.x);
    let midY = Math.floor(truck.y);
    let BalFelsoX = midX + (Math.floor(Math.sin(truck.angle - (sinalfa)) * (diag))) * 0.75;
    let BalFelsoY = midY - (Math.floor(Math.cos(truck.angle - (sinalfa)) * (diag))) * 0.75;
    let JobbFelsoX = midX + (Math.floor(Math.sin(truck.angle + (sinalfa)) * (diag))) * 0.75;
    let JobbFelsoY = midY - (Math.floor(Math.cos(truck.angle + (sinalfa)) * (diag))) * 0.75;
    let JobbAlsoX = midX - (Math.floor(Math.sin(truck.angle - (sinalfa)) * (diag)) - 1) * 0.75;
    let JobbAlsoY = midY + (Math.floor(Math.cos(truck.angle - (sinalfa)) * (diag))) * 0.75;
    let BalAlsoX = midX - (Math.floor(Math.sin(truck.angle + (sinalfa)) * (diag)) - 1) * 0.75;
    let BalAlsoY = midY + (Math.floor(Math.cos(truck.angle + (sinalfa)) * (diag))) * 0.75;
    let polyA;
    let polyAVertArr = [];
    let polyAEdgeArr = [];
    polyAVertArr.push(new xy(BalFelsoX, BalFelsoY));
    polyAVertArr.push(new xy(JobbFelsoX, JobbFelsoY));
    polyAVertArr.push(new xy(JobbAlsoX, JobbAlsoY));
    polyAVertArr.push(new xy(BalAlsoX, BalAlsoY));
    polyAEdgeArr.push(new xy(JobbFelsoX - BalFelsoX, JobbFelsoY - BalFelsoY));
    polyAEdgeArr.push(new xy(JobbAlsoX - JobbFelsoX, JobbAlsoY - JobbFelsoY));
    polyAEdgeArr.push(new xy(BalAlsoX - JobbAlsoX, BalAlsoY - JobbAlsoY));
    polyAEdgeArr.push(new xy(BalFelsoX - BalAlsoX, BalFelsoY - BalAlsoY));
    polyA = null;
    polyA = new poly(polyAVertArr, polyAEdgeArr);
    let polyB;
    let polyBVertArr = [];
    let polyBEdgeArr = [];
    polyBVertArr.push(new xy(BtestX, BtestY));
    polyBVertArr.push(new xy(BtestX + BtestW, BtestY));
    polyBVertArr.push(new xy(BtestX + BtestW, BtestY + BtestH));
    polyBVertArr.push(new xy(BtestX, BtestY + BtestH));
    polyBEdgeArr.push(new xy(BtestX - (BtestX + BtestH), BtestY - BtestY));
    polyBEdgeArr.push(new xy((BtestX + BtestW) - (BtestX + BtestW), BtestY - (BtestY + BtestH)));
    polyBEdgeArr.push(new xy((BtestX + BtestW) - BtestX, (BtestY + BtestH) - (BtestY + BtestH)));
    polyBEdgeArr.push(new xy(BtestX - BtestX, (BtestY + BtestH) - BtestY));
    polyB = null;
    polyB = new poly(polyBVertArr, polyBEdgeArr);
    let perpendicularLine = null;
    let dot = 0;
    let perpendicularStack = []; //merőleges vektorok array
    let amin = null;
    let amax = null;
    let bmin = null;
    let bmax = null;
    //a 2 test merőleges vektorainak kiszámolása és beszórása az arraybe
    for (let i = 0; i < polyA.edge.length; i++) {
        perpendicularLine = new xy(-polyA.edge[i].y, polyA.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    for (let i = 0; i < polyB.edge.length; i++) {
        perpendicularLine = new xy(-polyB.edge[i].y, polyB.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    //végigmegyünk egyesével a vektorokon
    for (let i = 0; i < perpendicularStack.length; i++) {
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        //vizsgáljuk A test vektorokra vetített pontjait
        for (let j = 0; j < polyA.vertex.length; j++) {
            dot = polyA.vertex[j].x * perpendicularStack[i].x + polyA.vertex[j].y * perpendicularStack[i].y;
            if (amax === null || dot > amax) {
                amax = dot;
            }
            if (amin === null || dot < amin) {
                amin = dot;
            }
        }
        //vizsgáljuk B test vektorokra vetített pontjait
        for (let j = 0; j < polyB.vertex.length; j++) {
            dot = polyB.vertex[j].x * perpendicularStack[i].x + polyB.vertex[j].y * perpendicularStack[i].y;
            if (bmax === null || dot > bmax) {
                bmax = dot;
            }
            if (bmin === null || dot < bmin) {
                bmin = dot;
            }
        }
        //nézem van-e átfedés
        if ((amin < bmax && amin > bmin) || (bmin < amax && bmin > amin)) {
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

onInit();

// dfc = difficulty