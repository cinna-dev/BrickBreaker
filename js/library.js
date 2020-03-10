/**
 * Breakout Game 
 * 
 * Date:2020-02-23 
 */

class Game {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d') //The getContext() method returns an object that provides methods and properties for drawing on the canvas.
        this.ballR = 10
        //Ball Position
        this.x = this.canvas.width / 2
        this.y = this.canvas.height - 56

        this.xTemp = this.x
        //Ball Direction
        this.movementX = 7
        this.movementY = -5
        //Catcher Dimensions

        // Key Boolean
        this.rightKey = false
        this.leftKey = false
        // Key Boolean 2nd Player
        this.rightKey2 = false
        this.leftKey2 = false
        //Bricks Grid
        this.brickRows = 5
        this.brickCol = 22
        this.aiBrickRows = 4
        this.aiBrickCol = 16
        this.brickCount = this.brickRows * this.brickCol;
        //Brick Dimensions
        this.brickW = ((this.canvas.width / this.brickCol) / 100) * 70
        this.brickOffset = (this.canvas.width - (this.brickW * this.brickCol)) / (this.brickCol + 1)
        this.brickH = 40
        this.brickOffsetLeft = this.brickOffset
        this.brickPadding = this.brickOffset
        this.brickOffsetTop = 80
        this.bricks;
        //catcher 
        this.catcherH = 15
        this.catcherW = 30 // this.canvas.width/8 //this.brickW * 1.5
        this.catcherX = (this.canvas.width - this.catcherW) / 2
        this.catcherY = this.canvas.height
        this.catcherX2 = this.catcherX + this.catcherW
        this.catcherY2 = this.canvas.height
        this.catcherSpeed = 12
        this.catcher;
        //2nd catcher 
        this.catcherSecondH = 15
        this.catcherSecondW = 30
        this.catcherSecondX = (this.canvas.width - this.catcherSecondW) / 2
        this.catcherSecondY = 0
        this.catcherSecondX2 = this.catcherSecondX + this.catcherSecondW
        this.catcherSecondY2 = 0
        this.pointOfInterest = this.x;
        //Collision Temp
        this.collisionBrickWTemp = false;
        this.collisionBrickHTemp = false;
        //Accoun Data
        this.accountName;
        this.firstName;
        this.lastName;
        this.email;
        this.passWord;
        this.highScore = 0;
        this.id;
        this.login = false;
        //misc
        this.deathTimer = 0;
        this.score = 0;
        this.gradientsize = this.canvas.width * 5;
        this.playerLifes = 9;
        this.aiLifes = 9;
        this.aiLifesTemp = this.aiLifes;
        this.aiActive = false;
        this.pausedGame = false;
        this.shadows = false;
        this.shadowsCatcher = false;
        this.shading = false;
        this.Fog = false;
        this.fps = 16.67;
        this.intervalId;
        this.running = false;
        this.audio = new Audio('./music/Power_Plant.mp3');
        this.music = true;
        this.debugShadows = false;
        this.lensFlare = true;
        this.slowMo = true;
        this.dist = window.innerWidth //1700;
        this.adminModu = true;
    }

    createCanvas() {
        const canvases = Array.from(document.getElementsByTagName('canvas'))
        if (canvases.length > 0) {
            canvases.forEach(canvas => {
                canvas.remove();
            })
        }
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'canvas'
        document.body.appendChild(this.canvas)
        this.ctx = this.canvas.getContext('2d')
    }

    drawCanvas(x = window.innerWidth, y = window.innerHeight) {
        this.ctx.canvas.width = x // 100 * 99
        this.ctx.canvas.height = y - 56 // 100 * 88
        this.x = this.canvas.width / 2
        this.y = this.canvas.height - 60
        this.brickW = ((this.canvas.width / this.brickCol) / 100) * 70
        this.brickOffset = (this.canvas.width - (this.brickW * this.brickCol)) / (this.brickCol + 1)
        this.brickOffsetLeft = this.brickOffset
        this.brickPadding = this.brickOffset
        this.brickOffsetTop = 80
        this.catcherW = this.brickW * 3.5
        this.catcherSecondW = this.brickW * 3.5
    }

    updateCanvas() {
        this.ctx.canvas.width = window.innerWidth
        this.ctx.canvas.height = window.innerHeight
    }

    randomNumGen(minNum, MaxNum) {
        return Math.floor(Math.random() * MaxNum) + minNum
    }

    randomNegativeGen(minNum, maxNum) {
        return Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    }

    reWriteBrickData() {
        this.brickCount = this.aiBrickRows * this.aiBrickCol;
        //Brick Dimensions
        this.brickW = ((this.canvas.width / this.aiBrickCol) / 100) * 75
        this.brickOffset = (this.canvas.width - (this.brickW * this.aiBrickCol)) / (this.aiBrickCol + 1)
        this.brickOffsetLeft = this.brickOffset
        this.brickPadding = this.brickOffset
        this.brickOffsetTop = (this.canvas.height / 2) - ((this.brickH * this.aiBrickRows) + (this.brickOffset * (this.aiBrickRows - 1)) / 2)
    }

    createBricks(callback) {
        this.bricks = [];
        this.brickCount = this.brickRows * this.brickCol;
        for (let c = 0; c < this.brickCol; c++) {
            for (let r = 0; r < this.brickRows; r++) {
                this.bricks.push({
                    //push coordinates of the pivot point for each brick
                    x: (c * (this.brickW + this.brickPadding)) + this.brickOffsetLeft,
                    y: (r * (this.brickH + this.brickPadding)) + this.brickOffsetTop,
                    x2: ((c * (this.brickW + this.brickPadding)) + this.brickOffsetLeft) + this.brickW,
                    y2: ((r * (this.brickH + this.brickPadding)) + this.brickOffsetTop) + this.brickH,
                    status: 1,
                    lifes: callback(1, 4),
                    collisionBrickWTemp: false
                });
            }
        }
    }

    aiCreateBricks(callback) {

        this.bricks = [];
        this.brickCount = this.aiBrickRows * this.aiBrickCol;

        for (let c = 1; c < this.aiBrickCol + 1; c++) {
            for (let r = 1; r < this.aiBrickRows + 1; r++) {
                this.bricks.push({
                    //push coordinates of the pivot point for each brick
                    x: (c * (this.brickW + this.brickPadding)) + this.brickOffsetLeft,
                    y: (r * (this.brickH + this.brickPadding)) + this.brickOffsetTop,
                    x2: ((c * (this.brickW + this.brickPadding)) + this.brickOffsetLeft) + this.brickW,
                    y2: ((r * (this.brickH + this.brickPadding)) + this.brickOffsetTop) + this.brickH,
                    status: c % 2 == 0 ? 0 : 1,
                    lifes: callback(1, 4),
                    collisionBrickWTemp: false
                });
            }
        }
    }

    slowMoMode() {
        if (this.slowMo) {
            this.movementX = 7 * 0.7
            this.movementY = -5 * 0.7
        } else {
            if (this.fps == 33.33) {
                this.movementX = 16;
                this.movementY = -10;
            } else if (this.fps == 16.67) {
                this.movementX = 8;
                this.movementY = -5;
            } else {
                this.movementX = 4
                this.movementY = -2.5
            }
        }
    }

    drawBall() {
        this.ctx.beginPath(); //The CanvasRenderingContext2D.beginPath() method of the Canvas 2D API starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
        this.ctx.arc(this.x, this.y, this.ballR, 0, Math.PI * 2); //void ctx.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
        this.ctx.fillStyle = "#ffffcc"; //The CanvasRenderingContext2D.fillStyle property of the Canvas 2D API specifies the color, gradient, or pattern to use inside shapes.
        this.ctx.fill() //method of the Canvas 2D API fills the current or given path with the current fillStyle
        this.ctx.closePath() //method of the Canvas 2D API attempts to add a straight line from the current point to the start of the current sub-path. If the shape has already been closed or has only one point, this function does nothing.
        //This method doesn't draw anything to the canvas directly. You can render the path using the stroke() or fill() methods.

    }

    drawBackground() {
        this.ctx.beginPath()
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gradientsize);

        gradient.addColorStop(0, '#ffff55');
        gradient.addColorStop(.5, '#00cccc');
        gradient.addColorStop(1, '#005566');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.closePath()
    }

    drawLensFlare() {
        let alpha
        //flares containes offestValues for each flare
        const flares = [{
            offset: -0.99,
            size: 10
        }, {
            offset: -0.98,
            size: 20
        }, {
            offset: -0.96,
            size: 500
        }, {
            offset: -0.92,
            size: 100
        }, {
            offset: -0.86,
            size: 200
        }, {
            offset: -0.70,
            size: 400
        }, {
            offset: -0.38,
            size: 600
        }, {
            offset: -0.15,
            size: 750
        }, {
            offset: 0.15,
            size: 850
        }, {
            offset: 0.32,
            size: 1000
        }, {
            offset: 0.5,
            size: 1250
        }, {
            offset: 1,
            size: 2500
        }, {
            offset: 1.5,
            size: 8000
        }]
        flares.forEach((flare) => {
            let offset = flare
            this.ctx.beginPath()
            const midPointX = window.innerWidth / 2
            const midPointY = window.innerHeight / 2
            let flarePosX = ((midPointX - this.x) * flare.offset) + midPointX
            let flarePosY = ((midPointY - this.y) * flare.offset) + midPointY
            let flarePosAlphaX = (midPointX - this.x) + midPointX
            let flarePosAlphaY = (midPointY - this.y) + midPointY
            let gradient = this.ctx.createRadialGradient(flarePosX, flarePosY, 0, flarePosX, flarePosY, flare.size);
            alpha = Math.abs((flarePosAlphaX * flarePosAlphaY) / (midPointX * midPointY) - 1)
            alpha = Math.min(alpha, 1)
            gradient.addColorStop(0, ` rgba(255, 255, 187,${alpha*0.3})`);
            gradient.addColorStop(.05, ` rgba(255, 255, 96,${alpha*0.02})`);
            gradient.addColorStop(.2, 'rgba(255, 255, 96, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.closePath()
        })

    }

    drawFog() {
        this.ctx.beginPath()
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gradientsize);

        gradient.addColorStop(0, '#ffff5566');
        gradient.addColorStop(.5, '#00cccc11');
        gradient.addColorStop(1, '#00667711');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.closePath()
    }

    drawcatcher() {
        this.ctx.beginPath();
        this.ctx.rect(this.catcherX, this.canvas.height - this.catcherH, this.catcherW, this.catcherH);
        this.ctx.fillStyle = "#00CC00"
        this.ctx.strokeStyle = "#00CC00"
        this.ctx.fill();
        this.ctx.closePath();
        this.catcher = {
            x: this.catcherX,
            y: this.canvas.height - this.catcherH,
            x2: this.catcherX + this.catcherW,
            y2: this.canvas.height
        }
        if (this.shading) {
            let alpha;
            let alpha2;
            let offset = 4
            let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.dist)
            let gradient2 = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.canvas.width + this.canvas.height)
            gradient.addColorStop(0, `rgba(255, 255, 255, 1`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            gradient2.addColorStop(0, `rgba(0, 0, 0, 0)`);
            gradient2.addColorStop(1, `rgba(0, 0, 0, 1)`);
            this.ctx.beginPath()

            //left Poly
            if (this.x - this.catcher.x < 0) {
                alpha = 1 - (Math.abs(this.x - this.catcher.x) / this.dist)
                alpha2 = 1 - (Math.abs(this.y - (this.catcher.y - this.catcherH / 2)) / this.dist)
                alpha = alpha * alpha2;
                alpha = Math.min(alpha, 1)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = gradient
            } else {
                alpha = this.catcher.x / this.x
                alpha = Math.min(alpha, 1)
                gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                this.ctx.fillStyle = gradient2
            }
            this.ctx.moveTo(this.catcher.x, this.catcher.y);
            this.ctx.lineTo((this.catcher.x + offset), (this.catcher.y + offset));
            this.ctx.lineTo((this.catcher.x + offset), (this.catcher.y2 - offset));
            this.ctx.lineTo(this.catcher.x, (this.catcher.y2));
            this.ctx.stroke()
            this.ctx.fill()
            this.ctx.closePath();

            //bottom Poly//
            this.ctx.beginPath()
            if (this.y - this.catcher.y2 > 0) {
                alpha = 1 - (Math.abs(this.y - this.catcher.y2) / this.dist)
                alpha2 = 1 - (Math.abs(this.x - (this.catcher.x + this.catcherW / 2)) / this.dist)
                alpha = alpha * alpha2;
                alpha = Math.min(alpha, 1)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                this.ctx.fillStyle = gradient
            } else {
                alpha = this.catcher.y / this.y
                alpha = Math.min(alpha, 1)
                gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                this.ctx.fillStyle = gradient2
            }
            this.ctx.moveTo(this.catcher.x, this.catcher.y2);
            this.ctx.lineTo((this.catcher.x + offset), (this.catcher.y2 - offset));
            this.ctx.lineTo((this.catcher.x2 - offset), (this.catcher.y2 - offset));
            this.ctx.lineTo((this.catcher.x2), (this.catcher.y2));
            this.ctx.stroke()
            this.ctx.fill()
            this.ctx.closePath();
            this.ctx.beginPath()

            //right Poly
            if (this.x - this.catcher.x2 > 0) {
                alpha = 1 - (Math.abs(this.x - this.catcher.x2) / this.dist)
                alpha2 = 1 - (Math.abs(this.y - (this.catcher.y + this.catcherH / 2)) / this.dist)
                alpha = alpha * alpha2;
                alpha = Math.min(alpha, 1)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                this.ctx.fillStyle = gradient
            } else {
                alpha = this.catcher.x2 / this.x
                alpha = Math.min(alpha, 1)
                gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                this.ctx.fillStyle = gradient2
            }
            this.ctx.moveTo(this.catcher.x2, this.catcher.y2);
            this.ctx.lineTo((this.catcher.x2 - offset), (this.catcher.y2 - offset));
            this.ctx.lineTo((this.catcher.x2 - offset), (this.catcher.y + offset));
            this.ctx.lineTo((this.catcher.x2), (this.catcher.y));
            this.ctx.stroke()
            this.ctx.fill()
            this.ctx.closePath();
            this.ctx.beginPath();

            //top Poly
            if (this.y - this.catcher.y - this.catcherH < 0) {
                alpha = 1 - (Math.abs(this.y - this.catcher.y - this.catcherH) / this.dist)
                alpha2 = 1 - (Math.abs(this.x - (this.catcher.x + this.catcherW / 2)) / this.dist)
                alpha = alpha * alpha2;
                alpha = Math.min(alpha, 1)
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                this.ctx.fillStyle = gradient
            } else {
                alpha = this.catcher.y2 / this.x
                alpha = Math.min(alpha, 1)
                gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                this.ctx.fillStyle = gradient2
            }
            this.ctx.moveTo(this.catcher.x2, this.catcher.y);
            this.ctx.lineTo((this.catcher.x2 - offset), (this.catcher.y + offset));
            this.ctx.lineTo((this.catcher.x + offset), (this.catcher.y + offset));
            this.ctx.lineTo((this.catcher.x), (this.catcher.y));
            this.ctx.stroke()
            this.ctx.fill()
            this.ctx.closePath();
        }
    }

    drawcatcherSecond() {
        this.ctx.beginPath();
        this.ctx.rect(this.catcherSecondX, 0, this.catcherSecondW, this.catcherSecondH);
        this.ctx.fillStyle = "#00CC00"
        this.ctx.fill();
        this.ctx.closePath();
    }

    //EventListener
    EventListenerAdding() {
        document.addEventListener("keydown", this.keyDown, false);
        document.addEventListener("keyup", this.keyUp, false);
    }

    //eventHandler have to "refere" to game not "this" // this referece to "document" 
    keyDown(e) {
        game.rightKey = game.rightPressed(e);
        game.leftKey = game.leftPressed(e);
        game.rightKey2 = game.rightPressed2(e)
        game.leftKey2 = game.leftPressed2(2)
        game.pausePressed(e)
    }

    keyUp(e) {
        game.rightKey = game.rightPressed(e) ? false : game.rightKey;
        game.leftKey = game.leftPressed(e) ? false : game.leftKey;
        game.rightKey2 = game.rightPressed2(e) ? false : game.rightKey2;
        game.leftKey2 = game.leftPressed2(e) ? false : game.leftKey2;
    }

    rightPressed(e) {
        return e.keyCode == 39;
    }

    leftPressed(e) {
        return e.keyCode == 37;
    }
    rightPressed2(e) {

        return e.keyCode == 68;
    }
    leftPressed2(e) {
        return e.keyCode == 65;
    }
    pausePressed(e) {
        if (e.keyCode == 80 && this.running) {
            if (this.pausedGame == false) {
                this.pausedGame = true
                document.getElementById('container').innerHTML = `<div id="pauseContainer" class="mx-auto my-auto">
                <h1 id="pausedGame"> Game Paused</h1>
                </div>`
            } else {
                this.pausedGame = false
                document.getElementById('pauseContainer').remove()
            }
        }
    }

    drawBricks() {
        this.bricks.forEach(brick => {
            //if brick does not exist , don't draw
            if (!brick.status) return;
            //else draws each Brick
            this.ctx.beginPath();
            this.ctx.rect(brick.x, brick.y, this.brickW, this.brickH)
            this.ctx.fillStyle = brick.lifes == 1 ? "green" : brick.lifes == 2 ? "blue" : brick.lifes == 3 ? "#cccc00" : 'red';
            let tempFillStyle = this.ctx.fillStyle;
            this.ctx.fill();
            //this.ctx.lineWidth = "1";
            //this.ctx.strokeStyle = this.ctx.fillStyle;
            this.ctx.closePath();

            /// dynamic shading model ///
            if (this.shading) {
                let alpha;
                let alpha2;
                let offset = 15
                let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.dist)
                let gradient2 = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.canvas.width + this.canvas.height)
                gradient.addColorStop(0, `rgba(255, 255, 255, 1`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                gradient2.addColorStop(0, `rgba(0, 0, 0, 0)`);
                gradient2.addColorStop(1, `rgba(0, 0, 0, 1)`);
                this.ctx.beginPath()

                //left Poly
                if (this.x - brick.x < 0) {
                    alpha = 1 - (Math.abs(this.x - brick.x) / this.dist)
                    alpha2 = 1 - (Math.abs(this.y - (brick.y + this.brickH / 2)) / this.dist)
                    alpha = alpha * alpha2;
                    alpha = Math.min(alpha, 1)
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    this.ctx.fillStyle = gradient
                    this.ctx.strokeStyle = tempFillStyle
                    //backSide
                } else {
                    alpha = brick.x / this.x
                    alpha = Math.min(alpha, 1)
                    gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                    this.ctx.fillStyle = gradient2
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
                }
                this.ctx.moveTo(brick.x, brick.y);
                this.ctx.lineTo((brick.x + offset), (brick.y + offset));
                this.ctx.lineTo((brick.x + offset), (brick.y2 - offset));
                this.ctx.lineTo(brick.x, (brick.y2));
                // this.ctx.stroke()
                this.ctx.fill()
                this.ctx.closePath();

                //bottom Poly//
                this.ctx.beginPath()
                if (this.y - brick.y2 > 0) {
                    alpha = 1 - (Math.abs(this.y - brick.y2) / this.dist)
                    alpha2 = 1 - (Math.abs(this.x - (brick.x + this.brickW / 2)) / this.dist)
                    alpha = alpha * alpha2;
                    alpha = Math.min(alpha, 1)
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                    this.ctx.fillStyle = gradient
                    this.ctx.strokeStyle = tempFillStyle
                    //backSide
                } else {
                    alpha = brick.y / this.y
                    alpha = Math.min(alpha, 1)
                    gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                    this.ctx.fillStyle = gradient2
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
                }
                this.ctx.moveTo(brick.x, brick.y2);
                this.ctx.lineTo((brick.x + offset), (brick.y2 - offset));
                this.ctx.lineTo((brick.x2 - offset), (brick.y2 - offset));
                this.ctx.lineTo((brick.x2), (brick.y2));
                // this.ctx.stroke()
                this.ctx.fill()
                this.ctx.closePath();
                this.ctx.beginPath()

                //right Poly
                if (this.x - brick.x2 > 0) {
                    alpha = 1 - (Math.abs(this.x - brick.x2) / this.dist)
                    alpha2 = 1 - (Math.abs(this.y - (brick.y + this.brickH / 2)) / this.dist)
                    alpha = alpha * alpha2;
                    alpha = Math.min(alpha, 1)
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                    this.ctx.fillStyle = gradient
                    this.ctx.strokeStyle = tempFillStyle
                    //backSide
                } else {
                    alpha = brick.x2 / this.x
                    alpha = Math.min(alpha, 1)
                    gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                    this.ctx.fillStyle = gradient2
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
                }
                this.ctx.moveTo(brick.x2, brick.y2);
                this.ctx.lineTo((brick.x2 - offset), (brick.y2 - offset));
                this.ctx.lineTo((brick.x2 - offset), (brick.y + offset));
                this.ctx.lineTo((brick.x2), (brick.y));
                //this.ctx.stroke()
                this.ctx.fill()
                this.ctx.closePath();
                this.ctx.beginPath();

                //top Poly
                if (this.y - brick.y < 0) {
                    alpha = 1 - (Math.abs(this.y - brick.y) / this.dist)
                    alpha2 = 1 - (Math.abs(this.x - (brick.x + this.brickW / 2)) / this.dist)
                    alpha = alpha * alpha2;
                    alpha = Math.min(alpha, 1)
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                    this.ctx.fillStyle = gradient
                    this.ctx.strokeStyle = tempFillStyle
                    //backSide
                } else {
                    alpha = brick.y2 / this.x
                    alpha = Math.min(alpha, 1)
                    gradient2.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
                    this.ctx.fillStyle = gradient2
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
                }
                this.ctx.moveTo(brick.x2, brick.y);
                this.ctx.lineTo((brick.x2 - offset), (brick.y + offset));
                this.ctx.lineTo((brick.x + offset), (brick.y + offset));
                this.ctx.lineTo((brick.x), (brick.y));
                //this.ctx.stroke()
                this.ctx.fill()
                this.ctx.closePath();
            }
        });
    }



    normalizeNumber(val, max, min) {
        return (val - min) / (max - min);
    }



    collisionDetection() {
        this.bricks.forEach(brick => {
            //if brick does not exist, don't detect collision
            if (!brick.status) return;
            //True if x is bigger than the left side position and  smaller than the right side position /
            let collisionBrickW = this.x >= brick.x && this.x <= brick.x + this.brickW,
                //True if y is bigger than the Bottom side position and smaller than the Top  side position 

                collisionBrickH = this.y >= brick.y && this.y <= brick.y + this.brickH;

            // If true , Ball is inside the Brick
            if (collisionBrickW && collisionBrickH) {
                // by collision invert Ball Movement
                if (brick.collisionBrickWTemp) {

                    this.movementY = -this.movementY;

                } else {

                    this.movementX = -this.movementX;

                }
                //reduce lifes
                brick.lifes--;
                //add to score
                this.score += brick.lifes == 3 ? 250 : brick.lifes == 2 ? 150 : brick.lifes == 1 ? 100 : 50
                // and delete the brick if lifes is at 0
                brick.status = brick.lifes == 0 ? 0 : 1;
                // reduce brick count
                if (brick.status == 0) this.brickCount--;
                // assigne the last approach direction

            }
            brick.collisionBrickWTemp = collisionBrickW
        })

    }

    drawScore() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 16px Arial"
        this.ctx.fillText(`Score : ${this.score}`, 100, 20);
        if (this.score > this.highScore) {
            this.highScore = this.score
            this.updateNavScore()
        }
    }

    drawLifes() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 16px Arial"
        this.ctx.fillText(`lifes : ${this.playerLifes}`, 12, 20);
        if (this.aiActive) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 16px Arial"
            this.ctx.fillText(`AI lifes : ${this.aiLifes}`, this.canvas.width - 100, 20);
        }
    }

    reduceLifeAnimation() {
        if (this.deathTimer >= 0) {
            this.ctx.fillStyle = `rgba(255,0,0,${this.deathTimer*0.01})`;
            this.ctx.font = "bold 64px Arial"
            this.ctx.fillText('-1', this.canvas.width / 2, this.canvas.height / 2);
            this.deathTimer--
        }
    }

    reduceLife() {
        this.deathTimer = 100;
        this.x = this.canvas.width / 2
        this.y = this.canvas.height - 60
        if (this.fps == 33.33) {
            this.movementX = 16
            this.movementY = -10
            this.catcherSpeed = 24
        } else if (this.fps == 16.67) {
            this.movementX = 8
            this.movementY = -5
            this.catcherSpeed = 12
        } else {
            this.movementX = 4
            this.movementY = -2.5
            this.catcherSpeed = 6
        }
        if (this.slowMo) {
            this.movementX = 7 * 0.7
            this.movementY = -5 * 0.7
        }
        console.log(this.fps, this.movementX, this.movementY)
        this.playerLifes--;
    }

    aiReduceLife() {
        this.x = this.canvas.width / 2
        this.y = 60
        if (this.fps == 33.33) {
            this.movementX = -16
            this.movementY = 10
            this.catcherSpeed = 24
        } else if (this.fps == 16.67) {
            this.movementX = -8
            this.movementY = 5
            this.catcherSpeed = 12
        } else {
            this.movementX = -4
            this.movementY = 2.5
            this.catcherSpeed = 6
        }
        if (this.slowMo) {
            this.movementX = 7 * 0.7
            this.movementY = -5 * 0.7
        }
        this.aiLifes--;
    }

    //arrow function will link "this" to where it is written not executed?
    outOfCanvas(vert1, xVec, vert2, yVec) {
        let endx;
        let endy;
        if (Math.sign(xVec) == 1 && Math.sign(yVec) == 1) {
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 - xVec;

                yVec = yVec * i;
                endy = vert2 - yVec;
                if (endx < 0 && endy < 0) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }

        } else if (Math.sign(xVec) == -1 && Math.sign(yVec) == 1) {
            xVec = Math.abs(xVec)
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 + xVec;

                yVec = yVec * i;
                endy = vert2 - yVec;
                if (endx > this.ctx.canvas.width && endy < 0) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }

        } else if (Math.sign(xVec) == 1 && Math.sign(yVec) == -1) {
            yVec = Math.abs(yVec)
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 - xVec;

                yVec = yVec * i;
                endy = vert2 + yVec;
                if (endx < 0 && endy > this.ctx.canvas.height) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }

        } else if (Math.sign(xVec) == -1 && Math.sign(yVec) == -1) {
            xVec = Math.abs(xVec)
            yVec = Math.abs(yVec)
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 + xVec;

                yVec = yVec * i;
                endy = vert2 + yVec;
                if (endx > this.ctx.canvas.width && endy > this.ctx.canvas.height) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }


            ///////////////////////////////////////////////
            ///////////////////////////////////////////////

        } else if (Math.sign(xVec) == 0 && Math.sign(yVec) == 1) {

            for (let i = 1;; i++) {
                xVec = 0;
                endx = vert1 + xVec;

                yVec = yVec * i;
                endy = vert2 - yVec;
                if (endy < 0) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }
        } else if (Math.sign(xVec) == 0 && Math.sign(yVec) == -1) {
            yVec = Math.abs(yVec)
            for (let i = 1;; i++) {
                xVec = 0;
                endx = vert1 + xVec;

                yVec = yVec * i;
                endy = vert2 + yVec;
                if (endy > this.ctx.canvas.height) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }
        } else if (Math.sign(xVec) == 1 && Math.sign(yVec) == 0) {
            yVec = Math.abs(yVec)
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 - xVec;

                yVec = 0;
                endy = vert2 + yVec;
                if (endx < 0) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }
        } else if (Math.sign(xVec) == -1 && Math.sign(yVec) == 0) {
            xVec = Math.abs(xVec)
            for (let i = 1;; i++) {
                xVec = xVec * i;
                endx = vert1 + xVec;

                yVec = 0;
                endy = vert2 + yVec;
                if (endx > this.ctx.canvas.width) {
                    return {
                        endx: endx,
                        endy: endy
                    }
                }
            }
        } else if (Math.sign(xVec) == 0 && Math.sign(yVec) == 0) {
            xVec = 0;
            endx = vert1 + xVec;

            yVec = 0;
            endy = vert2 + yVec;
            return {
                endx: endx,
                endy: endy
            }

        }
    }

    drawShadows() {
        let xVec1;
        let yVec1;
        let xVec2;
        let yVec2;
        let obj;
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gradientsize);
        gradient.addColorStop(0, '#888822');
        gradient.addColorStop(.5, '#008888');
        gradient.addColorStop(1, '#005566');
        this.ctx.strokeStyle = this.debugShadows ? 'darkgreen' : gradient;
        this.ctx.fillStyle = this.debugShadows ? 'rgba(0,0,0,0)' : gradient;
        if (this.shadowsCatcher) {

            // this.ctx.strokeStyle = gradient
            // this.ctx.fillStyle = gradient;

            //Catcher Shadow//
            xVec1 = (this.x - this.catcherX)

            yVec1 = (this.y - this.canvas.height - this.catcherH)
            obj = this.outOfCanvas(this.catcherX, xVec1, (this.canvas.height - this.catcherH), yVec1)
            xVec1 = obj.endx
            yVec1 = obj.endy
            this.ctx.beginPath();


            this.ctx.moveTo(this.catcherX, (this.canvas.height - this.catcherH));
            this.ctx.lineTo(xVec1, yVec1);
            xVec2 = (this.x - this.catcherX)
            yVec2 = (this.y - (this.canvas.height - this.catcherH))
            obj = this.outOfCanvas(this.catcherX, xVec2, (this.canvas.height - this.catcherH), yVec2)
            xVec2 = obj.endx
            yVec2 = obj.endy
            this.ctx.lineTo(xVec2, yVec2);
            this.ctx.lineTo(this.catcherX, this.canvas.height);
            this.ctx.stroke()
            this.ctx.fill()


            this.ctx.moveTo(this.catcherX, this.canvas.height);
            this.ctx.lineTo(xVec2, yVec2);
            xVec1 = (this.x - (this.catcherX + this.catcherW))
            yVec1 = (this.y - (this.canvas.height - this.catcherH))
            obj = this.outOfCanvas((this.catcherX + this.catcherW), xVec1, (this.canvas.height - this.catcherH), yVec1)


            xVec1 = obj.endx
            yVec1 = obj.endy
            this.ctx.lineTo(xVec1, yVec1);
            this.ctx.lineTo((this.catcherX + this.catcherW), this.canvas.height);
            this.ctx.fill()
            this.ctx.stroke()


            this.ctx.moveTo((this.catcherX + this.catcherW), this.canvas.height);
            this.ctx.lineTo(xVec1, yVec1);
            xVec2 = (this.x - (this.catcherX + this.catcherW))
            yVec2 = (this.y - (this.canvas.height - this.catcherH))
            obj = this.outOfCanvas((this.catcherX + this.catcherW), xVec2, (this.canvas.height - this.catcherH), yVec2)
            xVec2 = obj.endx
            yVec2 = obj.endy
            this.ctx.lineTo(xVec2, yVec2);
            this.ctx.lineTo((this.catcherX + this.catcherW), (this.canvas.height - this.catcherH));
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.closePath();
        }
        if (this.shadows) {
            this.bricks.forEach(brick => {
                if (brick.status == 0) {
                    return;
                } else {

                    //first EdgeShadow

                    //calc vector for vertex1
                    xVec1 = (this.x - brick.x)

                    yVec1 = (this.y - brick.y)

                    obj = this.outOfCanvas(brick.x, xVec1, brick.y, yVec1)
                    xVec1 = obj.endx
                    yVec1 = obj.endy
                    this.ctx.beginPath();

                    this.ctx.moveTo(brick.x, brick.y);
                    this.ctx.lineTo(xVec1, yVec1);
                    //calc vector for vertex2
                    xVec2 = (this.x - brick.x)

                    yVec2 = (this.y - brick.y2)

                    obj = this.outOfCanvas(brick.x, xVec2, brick.y2, yVec2)
                    xVec2 = obj.endx
                    yVec2 = obj.endy
                    this.ctx.lineTo(xVec2, yVec2);
                    this.ctx.lineTo(brick.x, brick.y2);
                    this.ctx.stroke()
                    this.ctx.fill()

                    //second EdgeShadow
                    this.ctx.moveTo(brick.x, brick.y2);
                    this.ctx.lineTo(xVec2, yVec2);

                    xVec1 = (this.x - brick.x2)

                    yVec1 = (this.y - brick.y2)

                    obj = this.outOfCanvas(brick.x2, xVec1, brick.y2, yVec1)
                    xVec1 = obj.endx
                    yVec1 = obj.endy
                    this.ctx.lineTo(xVec1, yVec1);
                    this.ctx.lineTo(brick.x2, brick.y2);

                    this.ctx.fill()
                    this.ctx.stroke()

                    //third EdgeShadow
                    this.ctx.moveTo(brick.x2, brick.y2);
                    this.ctx.lineTo(xVec1, yVec1);

                    xVec2 = (this.x - brick.x2)
                    yVec2 = (this.y - brick.y)

                    obj = this.outOfCanvas(brick.x2, xVec2, brick.y, yVec2)
                    xVec2 = obj.endx
                    yVec2 = obj.endy
                    this.ctx.lineTo(xVec2, yVec2);
                    this.ctx.lineTo(brick.x2, brick.y);

                    this.ctx.fill()
                    this.ctx.stroke()

                    this.ctx.closePath();
                }
            })
        }
    }

    cleanCanvas() {
        const canvases = Array.from(document.getElementsByTagName('canvas'))
        if (canvases.length > 0) {
            canvases.forEach(canvas => {
                canvas.remove();
            })
        }
    }

    logOut() {
        this.aiActive = false;
        this.aiLifes = 6;
        this.accountName;
        this.firstName;
        this.lastName;
        this.email;
        this.passWord;
        this.highScore = 0;
        this.login = false;
        this.shadows
        this.shadowsCatcher
        this.shading = true;
        this.fog = true;
        this.fps = 16.67;
        this.music = true;
    }

    checkLogin() {
        let data = localStorage.getItem('data')
        if (data == null) {
            return false;
        } else {
            data = JSON.parse(data)
            let check = false
            data.forEach(acc => {
                if (acc.login) {
                    check = true;
                    this.aiActive = false;
                    this.aiLifes = 6;
                    this.accountName = acc.accountName
                    this.firstName = acc.firstName
                    this.lastName = acc.lastName
                    this.email = acc.email
                    this.passWord = acc.passWord
                    this.highScore = acc.highScore
                    this.id = acc.id;
                    this.login = acc.login
                    this.shadows = acc.shadows
                    this.shadowsCatcher = acc.shadowsCatcher
                    this.shading = acc.shading
                    this.fog = acc.fog
                    this.fps = acc.fps
                    this.music = acc.music
                    this.lensFlare = acc.lensFlare;
                    this.slowMo = acc.slowMo;
                }
            })
            if (check) return true;
        }
    }

    drawTryAgainScreen() {
        document.getElementById('container').innerHTML = `
        <div class="card col-sm-6  col-md-4 col-lg-3 pt-3  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
            <div class="card-head text-center border-secondary">
                <h2>Try Again ?</h2>
            </div>
            <div class="card-body">
                <div class="py-3" id="output"></div>
                <div class="container text-center ">
                    <form onclick=game.tryAgainHandler(event)>
                        <button value="yes" class=" m-3   btn btn-lg btn-success   text-center cursor-pointer"
                            type="submit">Yes</button>
                        <button value="no" class=" m-3 btn btn-lg btn-danger text-center cursor-pointer"
                            type="submit">No</button>
                    </form>
                </div>
            </div>
        </div>`;
    }

    drawYouWonScreen() {
        document.getElementById('container').innerHTML = `
        <div class="card col-sm-6 col-md-4 col-lg-3  pt-3  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
            <div class="card-head text-center border-secondary">
                <h1>Congratulation</h1>
                <h2>You Won</h2>
                <br><br><br>
                <h2>Do you want to try again?</h2>
            </div>
            <div class="card-body">
                <div class="py-3" id="output"></div>
                <div class="container text-center ">
                    <form onclick=game.tryAgainHandler(event)>
                        <button value="yes" class=" m-3   btn btn-lg btn-success   text-center cursor-pointer"
                            type="submit">Yes</button>
                        <button value="no" class=" m-3 btn btn-lg btn-danger   text-center cursor-pointer" type="submit">No</button>
                    </form>
                </div>
            </div>
        </div>`;
    }

    clearGame() {
        this.running = false;
        clearInterval(this.intervalId)
    }

    playMusic() {
        if (this.music == true) {
            this.audio.play();
        }
    }

    stopMusic() {
        this.audio.pause()
    }

    artificialIntelligence() {
        let right = false;
        let left = false;
        let margin = 100

        /* if (this.catcherSecondX > this.pointOfInterest +40 && this.catcherSecondX < this.pointOfInterest -40) {
            obj = this.outOfCanvas(this.x, this.movementX, this.y, this.movementY)
            this.pointOfInterest =  obj.endx * (this.randomNumGen(0, margin) * this.randomNegativeGen())
        } */
        this.pointOfInterest = this.x - (this.randomNumGen(0, margin) * this.randomNegativeGen())

        if (this.pointOfInterest > this.catcherSecondX + this.catcherSecondW / 2) {
            right = true;
        } else {
            left = true;
        }
        /* if (this.aiLifesTemp > this.aiLifes) {
            this.catcherSecondX = this.x
        }
        if (this.pointOfInterest > this.catcherSecondX + this.catcherSecondW / 2) {
            right = true;
        } else if (this.pointOfInterest < this.catcherSecondX + this.catcherSecondW / 2) {
            left = true;
        } */
        /*  if (this.x > this.xTemp && pointOfInterest > this.catcherSecondX + this.catcherSecondW / 2) {
             right = true;
         } else if (this.x < this.xTemp && pointOfInterest < this.catcherSecondX + this.catcherSecondW / 2) {
             left = true;
         } */
        this.aiLifesTemp = this.aiLifes
        let maxX2 = this.canvas.width - this.catcherSecondW,
            minX2 = 0,
            catcherDelta2 = right ? this.catcherSpeed : left ? -(this.catcherSpeed) : 0;
        this.xTemp = this.x
        this.catcherSecondX = this.catcherSecondX + catcherDelta2;
        this.catcherSecondX = Math.min(this.catcherSecondX, maxX2);
        this.catcherSecondX = Math.max(this.catcherSecondX, minX2);
    }

    hitCanvasWall() {
        return this.x + this.movementX > this.canvas.width - this.ballR || this.x + this.movementX < this.ballR;
    }

    GameOver() {
        return this.playerLifes == 0
    }

    GameWon() {
        return this.brickCount == 0
    }

    hitCatcher() {
        return this.hitCanvasBottom() && this.ballOverCatcher();
    }
    // checks if the ball and Catcher are in the same x space
    ballOverCatcher() {
        return this.x > this.catcherX && this.x < this.catcherX + this.catcherW;
    }

    hitCanvasBottom() {
        return this.y + this.movementY > this.canvas.height - this.ballR;
    }
    // game over if ball hits the canvas bottom but the Catcher in not in the same x space
    loss() {
        return this.hitCanvasBottom() && !this.ballOverCatcher()
    }

    hitCanvasTop() {
        return this.y + this.movementY < this.ballR;
    }

    setMovement() {
        let x = Math.floor(Math.random() * 10) + (-4)
        this.movementX = x
        this.movementY = Math.abs(x) - 6
    }

    aiGameWon() {
        return this.aiLifes == 0
    }

    aiBallOverCatcher() {
        return this.x > this.catcherSecondX && this.x < this.catcherSecondX + this.catcherW;
    }

    aiLoss() {
        return this.hitCanvasTop() && !this.aiBallOverCatcher()
    }

    aiHitCatcher() {
        return this.hitCanvasTop() && this.aiBallOverCatcher();
    }

    draw() {
        if (this.GameOver()) {
            this.aiActive = false;
            this.running = false;
            clearInterval(this.intervalId)
            this.drawTryAgainScreen()
            return;
        }
        if (this.GameWon()) {
            this.aiActive = false;
            clearInterval(this.intervalId)
            this.drawYouWonScreen()
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.shadows) {
            this.drawBackground()
        }
        this.drawShadows();
        this.drawBricks();
        this.drawBall();
        this.drawcatcher();
        if (this.fog) {
            this.drawFog();
        }
        if (this.lensFlare) this.drawLensFlare()
        this.drawLifes();
        this.drawScore();
        this.reduceLifeAnimation()
        this.collisionDetection();

        if (this.pausedGame === true) {
            return;
        }

        //////////////////
        /// Game Logic ///

        if (this.hitCanvasWall())
            this.movementX = -this.movementX;

        if (this.hitCanvasTop() || this.hitCatcher())
            //invert y movement 
            this.movementY = -this.movementY;

        if (this.loss()) {
            this.reduceLife()
        };


        let maxX = this.canvas.width - this.catcherW,
            minX = 0,
            catcherDelta = this.rightKey ? this.catcherSpeed : this.leftKey ? -(this.catcherSpeed) : 0;

        this.catcherX = this.catcherX + catcherDelta;
        this.catcherX = Math.min(this.catcherX, maxX);
        this.catcherX = Math.max(this.catcherX, minX);

        //Append movement
        this.x += this.movementX;
        this.y += this.movementY;

        //console.log(this.fps, this.movementX, this.movementY)
    }

    /////////////////////////////////////////////////////////////////////////
    ////////////////////    Vs Artificial Inteligence     ///////////////////

    drawVsAi() {
        if (this.GameOver()) {
            this.stopMusic()
            this.running = false;
            clearInterval(this.intervalId)
            this.drawTryAgainScreen()
            return;
        }
        if (this.GameWon()) {
            clearInterval(this.intervalId)
            this.drawYouWonScreen()
            return;
        }

        if (this.aiGameWon()) {
            clearInterval(this.intervalId)
            this.drawYouWonScreen()
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.shadows) {
            this.drawBackground()
        }
        this.drawShadows();
        this.drawBricks();
        this.drawBall();

        this.drawcatcherSecond();
        this.drawcatcher();
        if (this.fog) {
            this.drawFog();
        }
        this.drawLifes();
        this.drawScore();
        this.reduceLifeAnimation()
        this.collisionDetection();

        if (this.pausedGame === true) {
            return;
        }
        this.artificialIntelligence();
        //////////////////
        /// Game Logic ///
        //////////////////

        if (this.hitCanvasWall())
            this.movementX = -this.movementX;

        if (this.hitCatcher())
            this.movementY = -this.movementY;

        // reduce ai lifes

        if (this.aiHitCatcher()) {
            this.movementY = -this.movementY;
        }

        if (this.loss()) {
            this.reduceLife()
        };
        if (this.aiLoss()) {
            this.aiReduceLife()
        }

        let maxX = this.canvas.width - this.catcherW,
            minX = 0,
            catcherDelta = this.rightKey ? this.catcherSpeed : this.leftKey ? -(this.catcherSpeed) : 0;

        this.catcherX = this.catcherX + catcherDelta;
        this.catcherX = Math.min(this.catcherX, maxX);
        this.catcherX = Math.max(this.catcherX, minX);

        //Append movement
        this.x += this.movementX;
        this.y += this.movementY;
    }


    drawGame(fpsInput) {

        if (!fpsInput) {
            fpsInput = this.fps
        }
        if (this.fps == 33.33) {
            this.movementX = 16;
            this.movementY = -10;
            this.catcherSpeed = 24
        } else if (this.fps == 16.67) {
            this.movementX = 8;
            this.movementY = -5;
            this.catcherSpeed = 12
        } else {
            this.movementX = 4
            this.movementY = -2.5
            this.catcherSpeed = 6
        }
        this.slowMoMode()
        console.log(this.fps, fpsInput, this.movementX, this.movementY)
        this.running = true
        this.intervalId = setInterval(
            (function (self) { //Self-executing func which takes 'this' as self
                return function () { //Return a function in the context of 'self'
                    self.draw(); //Thing you wanted to run as non-window 'this'
                }
            })(this),
            fpsInput //normal interval, 'this' scope not impacted here.
        );
        // this.intervalId = setInterval(this.draw, fpsInput)
    }



    drawGameVsAi(fpsInput) {
        this.aiActive = true;
        if (!fpsInput) {
            fpsInput = this.fps
        }
        if (this.fps == 33.33) {
            this.movementX = 16;
            this.movementY = -10;
            this.catcherSpeed = 24
        } else if (this.fps == 16.67) {
            this.movementX = 8;
            this.movementY = -5;
            this.catcherSpeed = 12
        } else {
            this.movementX = 4
            this.movementY = -2.5
            this.catcherSpeed = 6
        }
        this.slowMoMode()
        this.running = true
        this.intervalId = setInterval(
            (function (self) { //Self-executing func which takes 'this' as self
                return function () { //Return a function in the context of 'self'
                    self.drawVsAi(); //Thing you wanted to run as non-window 'this'
                }
            })(this),
            fpsInput //normal interval, 'this' scope not impacted here.
        );
    }

    logIn(account) {
        if (account) {
            this.login = account.login;
            this.accountName = account.accountName
            this.firstName = account.firstName
            this.lastName = account.lastName
            this.email = account.email
            this.highScore = account.highScore
            this.passWord = account.passWord
            this.id = account.id
            this.shadows = account.shadows;
            this.shadowsCatcher = account.shadowsCatcher;
            this.shading = account.shading;
            this.fog = account.fog;
            this.fps = account.fps;
            this.music = account.music;
        }

        const nav = document.getElementById('profile')
        nav.innerHTML = `<li id="navScore" class="nav-item ml-auto"><a class="nav-link">HighScore : ${this.highScore}</a></li>
        <li class="nav-item dropdown ml-auto">
            <a class="nav-link dropdown-toggle text-info cursor-pointer" id="navbarDropdownMenuLink-4" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                ${this.accountName} </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-info bg-dark shadow-lg"
                aria-labelledby="navbarDropdownMenuLink-4">
                <div class="card mx-2 border border-dark">
                    <div class="card-head">
                    </div>
                    <div class="card-body bg-dark">
                        <button onclick= game.logoutHandler(event) class="btn btn-block btn-primary cursor-pointer">LogOut</button>
                    </div>
                </div>
            </div>
        </li>   `


    }

    updateNavScore() {
        document.getElementById('navScore').innerHTML = `<a class="nav-link">HighScore : ${this.highScore}</a>`
    }

    createNavbar(x) {
        let nav;
        if (x == 'main') {
            nav = document.getElementById('nav')
            nav.innerHTML = ` <a class="navbar-brand" href="#">BreakOut.io</a>
            <ul id="profile" class="navbar-nav ml-auto">
            <ul id="profile" class="navbar-nav ml-auto font-weight-bold">
            <li id="logIn" class="nav-item ml-auto"><a class="nav-link cursor-pointer" onclick= game.newLoginHandler(event)> Login</a></li>
        </ul>
          `

        } else if (x == 'game') {
            nav = document.getElementById('nav')
            nav.innerHTML = ` <a class="navbar-brand cursor-pointer" href="#">BreakOut</a>
            <ul class="navbar-nav font-weight-bold">
                <li class="nav-item">
                    <a onclick= game.getLobbyHandler(event) class="nav-link cursor-pointer" href="#">Main Menu</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle cursor-pointer" href="#" id="graphics" data-toggle="dropdown">
                        Options
                    </a>
                    <div onclick= game.graphicHandler(event) class="dropdown-menu bg-dark  font-weight-bold">
                        <a id="sb" value=${this.shadows ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#">shadows Bricks : <span class=${this.shadows ? "text-success" : "text-danger" }>${this.shadows ? "on" : "off" } </span> </a>
                        <a id="sc" value=${this.shadowsCatcher ? "on" : "off" }  class="dropdown-item text-light cursor-pointer" href="#">shadows Catcher: <span class=${this.shadowsCatcher ? "text-success" : "text-danger" }>${this.shadowsCatcher ? "on" : "off" }</span> </a>
                        <a id="sh" value=${this.shading ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#">Shading : <span class=${this.shading ? "text-success" : "text-danger" }>${this.shading ? "on" : "off" }</span> </a>
                        <a id="fg" value=${this.fog ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#"> Fog : <span class=${this.fog ? "text-success" : "text-danger" }>${this.fog ? "on" : "off" }</span> </a>
                        <a id="lf" value=${this.lensFlare ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#"> lensFlare : <span class=${this.lensFlare ? "text-success" : "text-danger" }>${this.lensFlare ? "on" : "off" }</span> </a>
                        <a id="fps" value=${this.fps == 33.33 ?"30" : 16.67?  "60": "120" } class="dropdown-item text-light cursor-pointer" href="#"> FPS : <span class=${this.fps ==33.33? "text-success" : "text-danger" }>
                        30</span> | <span class=${this.fps ==16.67 ? "text-success" : "text-danger" }>
                        60</span> | <span class=${this.fps ==8.33? "text-success" : "text-danger" }>
                       120</span></a>
                       <a id="sm" value=${this.slowMo ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#"> SlowMo : <span class=${this.slowMo ? "text-success" : "text-danger" }>${this.slowMo ? "on" : "off" } </span> </a>
                       <a id="mc" value=${this.music ? "on" : "off" } class="dropdown-item text-light cursor-pointer" href="#"> Music : <span class=${this.music ? "text-success" : "text-danger" }>${this.music ? "on" : "off" } </span> </a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle cursor-pointer" href="#" id="graphics" data-toggle="dropdown">
                        Debug
                    </a>
                    <div onclick= game.debugHandler(event) class="dropdown-menu bg-dark  font-weight-bold cursor-pointer">
                    <a id="ds" value=${this.debugShadows ? "on" : "off" } class="dropdown-item text-light cursor-pointer"  href="#"> ShadowDebug : <span class=${this.debugShadows ? "text-success" : "text-danger" }>${this.debugShadows ? "on" : "off" } </span> </a>
                    </div>
                </li>
                 <li class="nav-item">
                    <a onclick= game.getLeaderBoardHandler(event) class="nav-link cursor-pointer" href="#">Leader Board</a>
                </li>

            </ul>
            <ul id="profile" class="navbar-nav ml-auto font-weight-bold">
                <li id="logIn" class="nav-item ml-auto"><a class="nav-link cursor-pointer" onclick= game.newLoginHandler(event)> Login</a></li>
            </ul>`
        }
    }

    addNavAccount() {
        const nav = document.getElementById('profile')
        nav.innerHTML = `<li id="navScore" class="nav-item ml-auto"><a class="nav-link cursor-pointer">HighScore : ${this.highScore}</a></li>
        <li class="nav-item dropdown ml-auto cursor-pointer">
            <a class="nav-link dropdown-toggle text-info cursor-pointer" id="navbarDropdownMenuLink-4" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                ${this.accountName} </a>
            <div class="dropdown-menu dropdown-menu-right dropdown-info bg-dark shadow-lg"
                aria-labelledby="navbarDropdownMenuLink-4">
                <div class="card mx-2 border border-dark">
                    <div class="card-head">
                    </div>
                    <div class="card-body bg-dark">
                        <button onclick= game.logoutHandler(event) class="btn btn-block btn-primary cursor-pointer">LogOut</button>
                    </div>
                </div>
            </div>
        </li>   `
    }

    createRegister() {
        const container = document.getElementById('container')
        container.innerHTML = ` <div class="card col-sm-6 col-md-4 col-lg-3 pt-5  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
        <div class="card-head text-center">
            <h2>Register an Account</h2>
        </div>
        <div class="card-body">
            <form id="form">
                <div>
                    <div class="form-group">
                        <label for="accountName">Account Name*</label>
                        <input id="accountName" class="form-control" type="text" placeholder="Account Name">
                    </div>
                    <div class="form-group">
                        <label for="firstName">Firstname*</label>
                        <input id="firstName" class="form-control" type="text" placeholder="Lastname">
                    </div>
                    <div class="form-group">
                        <label for="lastName">Lastname*</label>
                        <input id="lastName" class="form-control" type="text" placeholder="Lastname">
                    </div>
                    <div class="form-group">
                        <label for="email">email*</label>
                        <input id="email" class="form-control" type="text" placeholder="email">
                    </div>
                    <div class="form-group">
                        <label for="passWord">Password*</label>
                        <input id="passWord" class="form-control" type="password" placeholder="Password">
                    </div>
                    <div class="form-group">
                        <label for="passWordR">repeat Password*</label>
                        <input id="passWordR" class="form-control" type="password" placeholder="repeat Password">
                    </div>
                </div>
                <div class="py-3" id="output"></div>
                <div class="container text-center ">
                    <button onclick= game.registerHandler(event) class="btn btn-primary btn-block text-center cursor-pointer"
                        type="submit">Submit</button>
                </div>
            </form>
            <hr class="bg-secondary">
            <div class="card-footer p-4  text-center ">
                <div class="card-text">
                    You allready have an Account? 
                    <br>
                    <a class="cursor-pointer" href='#' onclick= game.getLoginHandler(event) > Back to the Login </a>
                </div>
            </div>
        </div>
    </div>`

    }
    createLogin() {
        const container = document.getElementById('container')
        container.innerHTML = `<div id="container" class="col-12 row position-absolute  bg-transparent">
        <div
            class="card col-sm-6 col-md-4 col-lg-3 pt-5 my-5 mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
            <div class="card-head text-center border-secondary">
                <h2>Login</h2>
            </div>
            <div class="card-body">
                <form id="form">
                    <div>
                        <div class="form-group">
                            <label for="accountName">Account Name*</label>
                            <input id="accountName" class="form-control" type="text" placeholder="Account Name">
                        </div>
                        <div class="form-group">
                            <label for="passWord">Password*</label>
                            <input id="passWord" class="form-control" type="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="py-3" id="output"></div>
                    <div class="container text-center ">
                        <button onclick= game.loginHandler(event) class="btn btn-primary btn-block text-center"
                            type="submit">login</button>
                    </div>
                </form>
            </div>
            <hr class="bg-secondary">
            <div class="card-footer p-4  text-center ">
                <div class="card-text">
                    new Visitor? <a href='' onclick= game.getRegisterHandler(event) > Create an Account</a>
                </div>
            </div>
        </div>
    </div> `
    }

    createlobby() {

        this.aiActive = false;
        this.aiLifes = 6;
        const container = document.getElementById('container')
        container.innerHTML = `<div
        class="card col-sm-6 col-md-4 col-lg-3 py-5  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
        <div class="card-head text-center">
            <h4>welcome to</h4>
            <h1>Breakout</h1>
        </div>
        <div class="btn-group btn-group-toggle p-4  " data-toggle="buttons">
            <label class="btn btn-info active">
              <input id="onePlayer" type="radio" name="options" id="option1" autocomplete="off" checked> One Player
            </label>
            <label class="btn btn-info">
              <input id="twoPlayer" type="radio" name="options" id="option2" autocomplete="off"> vs AI
            </label>
          </div>
        <div class="card-body text-center ">
            <button onclick= game.StartGameHandler(event) class="btn btn-primary btn-block ">Start Game</button>
             <br>
             <br>
            <a href="#" onclick= "game.ruleHandler(event)"  class="text-white">Show Rules </a>
        </div>
    </div>`
    }

    createRuleBlock() {
        document.getElementById('container').innerHTML = `<div
        class="card col-sm-6 col-md-5 col-lg-4 pt-1  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
             <button onclick= "game.getLobbyHandler(event)"  type="button" class="close pb-5 ml-auto " aria-label="Close">
                 <span aria-hidden="true">&times;</span>
             </button>
         <div class="card-head text-center">
             <h1 class="text-warning font-weight-bold">Rules of Break Out</h1>
         </div>  
         <div  class="card-body text-center overflow-auto">
             <ul  class="list-group list-group-flush bg-dark text-light">
             <li class="list-group-item list-group-item-dark bg-dark text-light"> <span class="text-danger">Red</span> Block has 4 lifes </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> <span class="text-warning">Yellow</span> Block has 3 lifes </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> <span class="text-primary">Blue</span> Block has 2 lifes </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> <span class="text-success">Green</span> Block has 1 lifes </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> Hitting a Block with the Ball will reduce its life by 1 </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> the Ball will bounce on the side- and top walls as well as the Bricks and Catcher itself </li>
             <li class="list-group-item list-group-item-dark bg-dark text-light"> if the Ball touches the floor You will lose a life</li>
             </ul>
         </div>
     </div>`
    }

    //leaderBoardList
    createLeaderBoard() {
        document.getElementById('container').innerHTML = `<div
       class="card h-100 col-sm-6 col-md-5 col-lg-4 pt-1  mx-auto my-auto  bg-dark text-light rounded border border-secondary shadow-lg ">
            <button onclick="game.refreshContainer()"  type="button" class="close pb-5 ml-auto " aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        <div class="card-head text-center">
            <h1 class="text-warning font-weight-bold">Leader Board</h1>
        </div>  
        <div id="leaderCard" class="card-body text-center overflow-auto">
            <ul id="leaderBoardList" class="list-group list-group-flush text-light">
            </ul>
        </div>
    </div>`
        const data = JSON.parse(localStorage.getItem('data'))
        const leaderBoard = document.getElementById("leaderBoardList")
        data.sort((x, y) => {
            return y.highScore - x.highScore;
        })
        data.forEach(acc => {
            leaderBoard.innerHTML += `<li class="list-group-item list-group-item-dark bg-dark text-light"><h3>
            ${acc.accountName}  : ${acc.highScore}</h3></li>`
        })
    }

    refreshContainer() {
        const container = document.getElementById('container')
        container.innerHTML = '';
    }

    /* static account(accountName, firstName, lastName, email, passWord, data) {
        this.accountName = accountName,
            this.firstName = firstName,
            this.lastName = lastName,
            this.email = email,
            this.passWord = passWord,
            this.id = data == null ? 0 : data.length
    } */

    setData(data) {
        this.shadows = data.shadows;
        this.shadowsCatcher = data.shadowsCatcher;
        this.shading = data.shading;
    }

    ///////////////////////////////////////////////////////
    ////////////////////// Handlers ///////////////////////
    ///////////////////////////////////////////////////////

    registerHandler(e) {
        document.getElementById('output').innerHTML = '';
        let data;
        const accountName = document.getElementById('accountName').value
        const firstName = document.getElementById('firstName').value
        const lastName = document.getElementById('lastName').value
        const email = document.getElementById('email').value
        const passWord = document.getElementById('passWord').value
        const passWordR = document.getElementById('passWordR').value
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            document.getElementById('output').className = 'text-warning text-center py-3'
            document.getElementById('output').innerHTML = 'email is not valid';
        } else {
            if (accountName == '' || firstName == '' || lastName == '' || email == '') {
                document.getElementById('output').className = 'text-warning text-center py-3'
                document.getElementById('output').innerHTML = 'Please fill out every Input';

            } else {
                if (passWord != passWordR) {
                    document.getElementById('output').className = 'text-warning text-center py-3'
                    document.getElementById('output').innerHTML = 'Your Password does not match';
                } else {
                    data = JSON.parse(localStorage.getItem('data'))
                    //default account
                    const account = new Account(accountName, firstName, lastName, email, passWord, 0, (data == null ? 0 : data.length), true, true, false, true, true, 16.67, false, true, true)
                    console.log(data)
                    console.log(account)
                    let check = true;
                    if (data == null) {

                        data = [];
                    } else {

                        data.forEach(element => {
                            if (element.accountName == account.accountName) {
                                document.getElementById('output').innerHTML = 'This Account Name is allready taken, please choose a different one'
                                document.getElementById('output').className = 'text-warning text-center py-3'
                                check = false
                            }
                        });

                    }
                    if (check) {
                        data.push(account)
                        localStorage.setItem('data', JSON.stringify(data))
                        this.logIn(account)
                        this.createNavbar('game')
                        this.addNavAccount()
                        this.createlobby()
                    }
                }
            }
        }
        e.preventDefault()
    }

    registerAdminAccount() {
        if (!this.adminModu) return
        let check;
        let data;
       let account;
      
            data = JSON.parse(localStorage.getItem('data'))
            if (data == null) {
                check = true;
                data = [];
            } else {
                data.forEach((acc) => {
                    if (acc.accountName === 'Admin') {
                        account = acc
                        check = false;
                    }
                })
            }
            if (check) {
                account = new Account('Admin', 'asmin', 'admin', 'admin@admin.com', 1111, 0, (data == null ? 0 : data.length), true, true, false, true, true, 16.67, false, true, true);
                data.push(account);
                localStorage.setItem('data', JSON.stringify(data))

            }
            this.createNavbar('main')
            this.logIn(account)
            //this.addNavAccount()
            this.createlobby()
     
    }

    StartGameHandler(e) {
        if (this.intervalId != undefined) {
            this.clearGame()
        }
        const onePlayer = document.getElementById('onePlayer').checked
        if (onePlayer) {
            this.playerLifes = 9
            this.score = 0;
            this.EventListenerAdding()
            this.refreshContainer()
            this.createCanvas()
            this.drawCanvas()
            this.createBricks(this.randomNumGen)
            this.playMusic()
            this.drawGame()

        } else {
            this.playerLifes = 9
            this.score = 0;
            this.EventListenerAdding()
            this.refreshContainer()
            this.createCanvas()
            this.drawCanvas()
            this.reWriteBrickData()
            this.aiCreateBricks(this.randomNumGen)
            this.playMusic()
            this.drawGameVsAi()

        }
        e.preventDefault()
    }

    loginHandler(e) {
        document.getElementById('output').innerHTML = '';
        let data;
        const accountName = document.getElementById('accountName').value
        const passWord = document.getElementById('passWord').value
        if (accountName == '' || passWord == '') {
            document.getElementById('output').className = 'text-warning text-center py-3'
            document.getElementById('output').innerHTML = accountName == '' && passWord == '' ? 'Please fill in Account Name & Password' : accountName == '' ? 'Please fill in your Account Name' : 'Please fill in your Password'
        } else {
            data = JSON.parse(localStorage.getItem('data'))
            if (data == null) {
                document.getElementById('output').className = 'text-warning text-center py-3'
                document.getElementById('output').innerHTML = 'Can not find your Account';
            } else {
                let check = true;
                data.forEach(acc => {
                    if (acc.accountName == accountName) {
                        check = false
                        if (acc.passWord == passWord) {
                            const account = new Account(acc.accountName, acc.firstName, acc.lastName, acc.email, acc.passWord, acc.highScore, acc.id, true, acc.shadows, acc.shadowsCatcher, acc.shading, acc.fog, acc.fps, acc.music, acc.lensFlare, acc.slowMo)
                            this.createNavbar('game')
                            this.logIn(account)
                            this.saveDataLocal()
                            this.createlobby()
                        } else {
                            document.getElementById('output').className = 'text-warning text-center py-3'
                            document.getElementById('output').innerHTML = 'Password is not correct';
                        }
                    }
                })
                if (check) {
                    document.getElementById('output').className = 'text-warning text-center py-3'
                    document.getElementById('output').innerHTML = 'Can not find your Account';
                }

            }
        }
        e.preventDefault()
    }

    getRegisterHandler(e) {
        this.createRegister()
        e.preventDefault()
    }

    tryAgainHandler(e) {
        if (e.target.value == 'yes') {
            if (this.aiActive) {
                this.playerLifes = 9
                this.aiLifes = 9
                this.score = 0;
                this.cleanCanvas()
                this.refreshContainer()
                this.createCanvas()
                this.drawCanvas()
                this.reWriteBrickData()
                this.aiCreateBricks(this.randomNumGen)
                this.playMusic()
                this.drawGameVsAi()
            } else {
                this.playerLifes = 9
                this.score = 0;
                this.refreshContainer()
                this.createCanvas()
                this.drawCanvas()
                this.createBricks(this.randomNumGen)
                this.playMusic()
                this.drawGame()
            }
        } else {
            this.stopMusic()
            this.refreshContainer()
            this.cleanCanvas()
            this.createlobby()
        }
        e.preventDefault()
    }

    logoutHandler(e) {
        if (this.intervalId != undefined) {
            this.refreshContainer()
            this.clearGame();
            this.createNavbar('main')
            this.stopMusic()
        }
        this.login = false;
        this.saveDataLocal()
        this.cleanCanvas()
        this.refreshContainer()
        this.createNavbar('main')
        e.preventDefault()
    }

    newLoginHandler(e) {
        this.cleanCanvas()
        this.refreshContainer()
        this.createLogin()
        e.preventDefault()
    }

    graphicHandler(e) {
        if (e.target.id == "sb") {
            if (this.shadows) {
                this.shadows = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.shadows = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on';
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "sc") {
            if (this.shadowsCatcher) {
                this.shadowsCatcher = false;
                e.target.value = 'off';
                e.target.children[0].textContent = 'off';
                e.target.children[0].className = 'text-danger'
            } else {
                this.shadowsCatcher = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "sh") {
            if (this.shading) {
                this.shading = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.shading = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "fg") {
            if (this.fog) {
                this.fog = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.fog = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "lf") {
            if (this.lensFlare) {
                this.lensFlare = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.lensFlare = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "fps") {
            if (this.fps == 33.33) {
                this.fps = 16.67;
                e.target.value = '60'
                e.target.children[0].className = 'text-danger'
                e.target.children[1].className = 'text-success'
                e.target.children[2].className = 'text-danger'
                if (this.running) {
                    this.clearGame()
                    this.refreshContainer()
                    this.createCanvas()
                    this.drawCanvas()
                    this.playMusic()
                    this.drawGame()
                }
            } else if (this.fps == 16.67) {
                e.target.value = '120'
                this.fps = 8.33;
                e.target.children[0].className = 'text-danger'
                e.target.children[1].className = 'text-danger'
                e.target.children[2].className = 'text-success'
                if (this.running) {
                    this.clearGame()
                    this.refreshContainer()
                    this.createCanvas()
                    this.drawCanvas()
                    this.playMusic()
                    this.drawGame()
                }
            } else {
                e.target.value = '30'
                this.fps = 33.33;
                e.target.children[0].className = 'text-success'
                e.target.children[1].className = 'text-danger'
                e.target.children[2].className = 'text-danger'
                if (this.running) {
                    this.clearGame()
                    this.refreshContainer()
                    this.createCanvas()
                    this.drawCanvas()
                    this.playMusic()
                    this.drawGame()
                }
            }
        } else if (e.target.id == "sm") {
            if (this.slowMo) {
                this.slowMo = false;
                this.slowMoRunning = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.slowMo = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        } else if (e.target.id == "mc") {
            if (this.music) {
                this.stopMusic()
                this.music = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.music = true
                if (this.running == true) this.playMusic()
                e.target.value = 'on'
                e.target.children[0].textContent = 'on'
                e.target.children[0].className = 'text-success'
            }
        }
        this.saveDataLocal()

        e.preventDefault()
    }

    debugHandler(e) {
        if (e.target.id == "ds") {
            if (this.debugShadows) {
                this.debugShadows = false;
                e.target.value = 'off'
                e.target.children[0].textContent = 'off'
                e.target.children[0].className = 'text-danger'
            } else {
                this.debugShadows = true;
                e.target.value = 'on'
                e.target.children[0].textContent = 'on';
                e.target.children[0].className = 'text-success'
            }
            this.saveDataLocal()
            e.preventDefault()
        }
    }

    getLobbyHandler(e) {
        if (this.intervalId != undefined) {
            this.stopMusic()
            this.clearGame()
        }
        if (this.login == true) {
            this.saveDataLocal()
            this.cleanCanvas()
            this.refreshContainer()
            this.createlobby()
        } else {
            this.cleanCanvas()
            this.refreshContainer()
        }
        e.preventDefault();
    }

    getLoginHandler() {
        this.refreshContainer()
        this.createLogin()
    }

    getLeaderBoardHandler() {
        this.saveDataLocal()
        this.refreshContainer()
        this.createLeaderBoard()
    }

    saveDataLocal() {
        const account = new Account(this.accountName, this.firstName, this.lastName, this.email, this.passWord, this.highScore, this.id, this.login, this.shadows, this.shadowsCatcher, this.shading, this.fog, this.fps, this.music, this.lensFlare, this.slowMo)
        let data = JSON.parse(localStorage.getItem('data'))
        data.forEach((acc, i) => {
            if (acc.id == this.id) {
                data[i] = account;
            }
        })
        localStorage.setItem('data', JSON.stringify(data))
    }

    ruleHandler(e) {
        this.refreshContainer()
        this.createRuleBlock()
        e.preventDefault()
    }

    createWatermark() {
        const watermark = document.createElement('div')
        watermark.textContent = 'by Philipp Puls @ FBW4';
        watermark.id = 'watermark';
        // document.getElementById('container').append(watermark);
        document.body.append(watermark);
    }
}

class Account {
    constructor(accountName, firstName, lastName, email, passWord, highScore, id, login, shadows, shadowsCatcher, shading, fog, fps, music, lensFlare, slowMo) {
        this.accountName = accountName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passWord = passWord;
        this.highScore = highScore;
        this.id = id;
        this.login = login;
        this.shadows = shadows;
        this.shadowsCatcher = shadowsCatcher;
        this.shading = shading;
        this.fog = fog;
        this.fps = fps;
        this.music = music;
        this.lensFlare = lensFlare;
        this.slowMo = slowMo;
    }
}