var zombies = (function() {
    var directions = {
        up: {x: 0, y: -1}, //up
        right: {x: 1, y: 0}, //right
        down: {x: 0, y: 1}, //down
        left: {x: -1, y: 0} //left
    },
    collision = function(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
    };
    function GameObject(x, y, animation) {
        this.x = x;
        this.y = y;
        this.animation = animation;
        this.animationFrame = 0;
    };
    
    function Explosion(x, y, animation) {
        GameObject.call(this, x, y, animation);
        this.status = 'explode';
    }
    Explosion.prototype = new GameObject();
    Explosion.prototype.constructor = Explosion; 
    
    Explosion.prototype.endExplode = function() {
        //after end of animation
        var sprites = this.animation[this.status].animation();
        if(sprites.length !== this.animationFrame) {
            return false;
        }
        //END after end of animation
        return true;
    };
    
    function Zombie(x, y, animation) {
        GameObject.call(this, x, y, animation);
        this.status = 'create';
        this.moves = 0;
        this.speed = 1;
        this.escapeMoves = 0; //for escaping from mouse
    };
    Zombie.prototype = new GameObject();
    Zombie.prototype.constructor = Zombie; 
    
    Zombie.prototype.setSpeed = function(speed) {
        if(speed <= 10 || speed >= 0) {
            this.speed = speed;
        }
    };
    Zombie.prototype.setAnimationFrame = function(frameIndex) {
        var len = this.animation[this.status].length;
        if(frameIndex < len || frameIndex >= 0) {
            this.animationFrame = frameIndex;
        }
    };
    Zombie.prototype.setStatus = function(status) {
       if (this.animation.hasOwnProperty(status)) {
           this.animationFrame = 0;
           this.moves = 0;
           this.status = status;
       }
    };
    Zombie.prototype.nextMove = function() {
        var nextMove = {};
        nextMove.x = directions.hasOwnProperty(this.status)? this.x + directions[this.status].x*this.speed : this.x;
        nextMove.y = directions.hasOwnProperty(this.status)? this.y + directions[this.status].y*this.speed : this.y;
        return nextMove;
    };
    Zombie.prototype.move = function(move) {
        this.x = move.x;
        this.y = move.y;
        this.moves++;
    };
    Zombie.prototype.escapeMove = function(possibleDirections) {
        if(!this.escapeMoves) {
            this.setStatus(possibleDirections[Math.floor(Math.random()*possibleDirections.length)]);
        }
        this.escapeMoves = 1;
    };
    Zombie.prototype.aiMove = function(canvas) {
        if(!directions.hasOwnProperty(this.status)) {
            return;
        }
        var screenW = canvas.width,
            screenH = canvas.height,
            newXY = this.nextMove(),
            possibleDirections = [],
            possibleX = ['right', 'left'],
            possibleY = ['down', 'up'],
            width = this.animation[this.status].spriteWidth,
            height = this.animation[this.status].spriteHeight,
            rect = canvas.getBoundingClientRect(),
            mouseX = inputHandler.mouse.position.x - rect.left, 
            mouseY = inputHandler.mouse.position.y - rect.top,
            statusIdx,
            stayInDistance = 40,
            movesUntilChange = screenW > 500? 208 : 50;
        if(newXY.x < 0) { //zombie is in sceen left wall
            possibleX = ['right'];
        }
        if(newXY.x + width > screenW) {//zombie is in sceen right wall
            possibleX = ['left'];
        }
        if(newXY.y < 0) { //zombie is in sceen up wall
            possibleY = ['down'];
        }
        if(newXY.y + height > screenH) {//zombie is in sceen down wall
            possibleY = ['up'];
        }
        possibleDirections = possibleDirections.concat(possibleX);
        possibleDirections = possibleDirections.concat(possibleY);
        statusIdx = possibleDirections.indexOf(this.status);
        if(statusIdx !== -1) {
            if(collision(newXY.x, newXY.y, width, height, mouseX-stayInDistance/2, mouseY-stayInDistance/2, stayInDistance, stayInDistance)) {
                possibleDirections.splice(statusIdx, 1);
                this.escapeMove(possibleDirections);
                this.move(this.nextMove());
                return;
            }
            if(this.moves === movesUntilChange) {
                possibleDirections.splice(statusIdx, 1);
            } else {     
                this.escapeMoves = 0;
                this.move(newXY);
                return;
            } 
        } 
        this.escapeMoves = 0;
        this.setStatus(possibleDirections[Math.floor(Math.random()*possibleDirections.length)]);
        this.move(this.nextMove());
    };
    
    Zombie.prototype.isDead = function() {
        if(this.status !== 'die') {
            return false;
        }
        //delete after end of animation
        var sprites = this.animation[this.status].animation();
        if(sprites.length !== this.animationFrame) {
            return false;
        }
        //END delete after end of animation
        return true;
    };
    Zombie.prototype.isCreated = function() {
        if(this.status !== 'create') {
            return -1;
        }
        //after end of animation
        var sprites = this.animation[this.status].animation();
        if(sprites.length !== this.animationFrame) {
            return 0;
        }
        //END after end of animation
        return 1;
    };
    
    return {
        get: function(x, y, animation) {
            return new Zombie(x, y, animation);
        },
        getExplosion: function(x, y, animation) {
            return new Explosion(x, y, animation);
        },
        getDirections: function() {
            return directions;
        },
        collision: function(ax, ay, aw, ah, bx, by, bw, bh) {
            return collision(ax, ay, aw, ah, bx, by, bw, bh);
        },
        randomCreate: function(screenW, screenH, animation) {
            var animationW = animation.create.spriteWidth,
                animationH = animation.create.spriteHeight,
                minX = 0,
                maxX = screenW - animationW,
                minY = 0,
                maxY = screenH - animationH,
                randomX = Math.random() * (maxX - minX) + minX,
                randomY = Math.random() * (maxY - minY) + minY,
                randomSpeed = Math.random() * (3 - 1) + 1,
                zombie = this.get(randomX, randomY, animation);
            zombie.setSpeed(randomSpeed);
            return zombie;
        },
        randomZombie: function(screenW, screenH) {
            var randomAnimations = [
                animations.zombie
                //animations.zombie2
            ];
            return this.randomCreate(screenW, screenH, randomAnimations[Math.floor(Math.random()*randomAnimations.length)]);
        },
        zombieType: Zombie,
        explosionType: Explosion
    };
}());