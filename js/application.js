var applications = (function() {
    function createCountDown(timeRemaining) {
        var startTime = Date.now();
        return function() {
           return timeRemaining - ( Date.now() - startTime );
        }
    }
    
    function Application(renderer) {
        this.renderer = renderer;
        this.zombieNum = 30;
    };
    Application.prototype.setSizes = function() {
        this.appWidth = screen.getWidth()-30;
        this.appHeight = screen.getHeight()-120;
        this.renderer.canvas.width = this.appWidth;
        this.renderer.canvas.height = this.appHeight;  
    };
    
    var theRenderer,
        currentCountDown = createCountDown(60000),
        countDownDom = document.getElementById('timeLeft'),
        killedZombiesDom = document.getElementById('killedZombies'),
        scoreDom = document.getElementById('score'),
        highestScoreDom = document.getElementById('highestScore'),
        score = 0, highestScore = 0,
        theZombies = [],
        theExplosions = [],
        normalKillZombie = function(mouseX, mouseY) {
                var killedZombiesCounter = parseInt(killedZombiesDom.innerHTML),
                zombie, killZombieFlag;
            for(var i=0, len = theZombies.length; i < len; i++) {
                zombie = theZombies[i];
                var ax = zombie.x,
                    ay = zombie.y,
                    aw = zombie.animation[zombie.status].spriteWidth,
                    ah = zombie.animation[zombie.status].spriteHeight;                        
                if(zombies.collision(ax, ay, aw, ah, mouseX, mouseY, 0, 0) && zombie.status !== 'die') {
                    zombie.setStatus('die');
                    killedZombiesCounter++;
                    score++;
                    killedZombiesDom.innerHTML = killedZombiesCounter;
                    scoreDom.innerHTML = score;
                    killZombieFlag = true;
                    break;
                }
            }
            if(killZombieFlag) {
                killZombieFlag = false;
            } else {
                mouseX -= (animations.explosion.explode.spriteWidth/2), 
                mouseY -= (animations.explosion.explode.spriteHeight/2);
                var explosion = zombies.getExplosion(mouseX, mouseY, animations.explosion);
                theExplosions.push(explosion);
            }
        }, 
        mobileKillZombie = function() {
            var touches = inputHandler.getTouches(),
                canvas = theRenderer.canvas,
                rect = canvas.getBoundingClientRect(),
                mouseX, mouseY;
        
            for(var j = 0, lenTouches = touches.length; j < lenTouches; j++) {
                mouseX = touches[j].pageX - rect.left;
                mouseY = touches[j].pageY - rect.top;
                normalKillZombie(mouseX, mouseY);
            }
        },
        animationFrame = function() {
            var canvas = theRenderer.canvas,
                rect = canvas.getBoundingClientRect(),zombie,
                explosion,
                possibleDirections = ['down', 'right', 'up', 'left'], 
                countDownDate = new Date(currentCountDown()),
                secondsLeft = countDownDate.getSeconds();
            //For countdown
            
            if(secondsLeft === 0) {
                if(score > highestScore) {
                    highestScore = score;
                    highestScoreDom.innerHTML = highestScore;
                }
                score = 0;
                scoreDom.innerHTML = 0;
            }
            countDownDom.innerHTML = secondsLeft;
            //END for countdown
            //kill by pressing space
            if(inputHandler.isPressed(32) || inputHandler.leftClicked()) { //space or click
                var mouseX = inputHandler.mouse.position.x - rect.left, 
                mouseY = inputHandler.mouse.position.y - rect.top;
                normalKillZombie(mouseX, mouseY);
            }
            if(inputHandler.isTouched()) { //touch the screen
                mobileKillZombie();
            }
            //END kill by pressing space          
            
            theRenderer.clear();
            for(var i=0, len = theExplosions.length; i < len; i++) {
                explosion = theExplosions[i];
                if(explosion.endExplode()) {
                    theExplosions.splice(i, 1);
                    i--;
                    len--;
                    continue;
                }
                theRenderer.draw(explosion);
            }
            for(i=0, len = theZombies.length; i < len; i++) {
                zombie = theZombies[i];
                //change status after creation 
                if(zombie.isCreated() === 1) { 
                    possibleDirections
                    zombie.setStatus(possibleDirections[Math.floor(Math.random()*possibleDirections.length)]);
                }
                //END change status after creation
                //delete the zombie
                if(zombie.isDead()) {
                    theZombies.splice(i, 1);
                    i--;
                    len--;
                    setTimeout(function() {
                        theZombies.push(zombies.randomZombie(theRenderer.canvas.width, theRenderer.canvas.height, animations.zombie))
                    }, 2000);
                    continue;
                }
                //END delete the zombie
                
                //move the zombie
                zombie.aiMove(theRenderer.canvas);
                //END move the zombie
                
                theRenderer.draw(zombie);
            }
            if(theRenderer.frames == 999999) {
                theRenderer.frames = 0;
            }
            theRenderer.frames++;
            requestAnimationFrame(animationFrame);
        };
    Application.prototype.changeScreen = function() {
        this.setSizes();
        theRenderer = this.renderer;
        var zombie;
        for(var i = 0, len = theZombies.length; i < len; i++) {
            zombie = theZombies[i];
            if(zombie.x + zombie.animation[zombie.status].spriteWidth > this.renderer.canvas.width) {
                zombie.setStatus('die');
                continue;
            }
            if(zombie.y + zombie.animation[zombie.status].spriteHeight > this.renderer.canvas.height) {
                zombie.setStatus('die');
                continue;
            }
        }
    }; 
    Application.prototype.start = function() {
        //rotate screen event listener
        var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
        window.addEventListener(orientationEvent, function() {
            app.changeScreen();
        }, false);   
        //END rotate screen event listener
        theRenderer = this.renderer;
        theRenderer.canvas.style.display = 'block';     
        theZombies = [];
        for(var i = 1; i < this.zombieNum; i++) {
            theZombies.push(zombies.randomZombie(renderer.canvas.width, renderer.canvas.height));
        }
        requestAnimationFrame(animationFrame);
    };
    Application.prototype.end = function() {
        theZombies = [];
        theExplosions = [];
        killedZombiesDom.innertHTML = 0;
    };
    
    return {
        get: function(renderer) {
            return new Application(renderer);
        }
    }
}());