var animations = (function() {
    //Sprite
    function Sprite(img, x, y, w, h) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mirrorH = 0;
        this.mirrorV = 0;
    };
    
    //Zombie animation
    var zombieAnimations = {
        left: {
            animationSpeed: 10,
            spriteWidth: 36,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 3; i++) {
                    sprites.push(new Sprite(images.zombieLeftWalk, i*36, 0, 36, 51));
                }
                return sprites;
            }
        },
        right: { //same as left but when draw must be made mirror
            animationSpeed: 10,
            spriteWidth: 36,
            spriteHeight: 51,
            mirrorH: 1, //flip horizontally
//            mirrorV: 1, //flip vertically
            animation: function() {
                return zombieAnimations.left.animation();
            }
        },
        up:  {
            animationSpeed: 10,
            spriteWidth: 30,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 4; i++) {
                    sprites.push(new Sprite(images.zombieUpWalk, i*30, 0, 30, 51));
                }
                return sprites;
            }
        },
        down:  {
            animationSpeed: 5,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 6; i++) {
                    sprites.push(new Sprite(images.zombieDownWalk, i*32, 0, 32, 51));
                }
                return sprites;
            }
        },
        create: {
            animationSpeed: 6,
            spriteWidth: 39,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 5; i++) {
                    sprites.push(new Sprite(images.zombieCreate, i*39, 0, 39, 51));
                }
                return sprites;
            }
        },
        die: {
            animationSpeed: 10,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                var sprites = [];
                for(var i=0; i < 10; i++) {
                    sprites.push(new Sprite(images.zombieDie, i*32, 0, 32, 51));
                }
                return sprites;
            }
        }
    };
    //END Zombie animation
    
    //Zombie 2 animation
    var zombie2Animations = {
        left: {
            animationSpeed: 6,
            spriteWidth: 34,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 4; i++) {
                    sprites.push(new Sprite(images.zombie2LeftWalk, i*34, 0, 34, 51));
                }
                return sprites;
            }
        },
        right: { //same as left but when draw must be made mirror
            animationSpeed: 6,
            spriteWidth: 34,
            spriteHeight: 51,
            mirrorH: 1, //flip horizontally
//            mirrorV: 1, //flip vertically
            animation: function() {
                return zombie2Animations.left.animation();
            }
        },
        up:  {
            animationSpeed: 10,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 4; i++) {
                    sprites.push(new Sprite(images.zombie2UpWalk, i*32, 0, 32, 51));
                }
                return sprites;
            }
        },
        down:  {
            animationSpeed: 10,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 4; i++) {
                    sprites.push(new Sprite(images.zombie2DownWalk, i*32, 0, 32, 51));
                }
                return sprites;
            }
        },
        create: {
            animationSpeed: 10,
            spriteWidth: 50,
            spriteHeight: 56,
            animation: function() {
                var sprites = []; 
                for(var i=0; i < 4; i++) {
                    sprites.push(new Sprite(images.zombie2Create, i*50, 0, 50, 56));
                }
                return sprites;
            }
        },
        die: {
            animationSpeed: 10,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                return zombieAnimations.die.animation();
            }
        }
    };
    //END Zombie 2 animation
    
    //Explosion animatoin
    var explosion = {
        explode: {
            animationSpeed: 8,
            spriteWidth: 32,
            spriteHeight: 51,
            animation: function() {
                var sprites = [];
                for(var i=0; i < 3; i++) {
                    sprites.push(new Sprite(images.zombieDie, i*32, 0, 32, 51));
                }
                return sprites;
            }
        }
    };
    //END Explosion animation
    
    return {
        zombie: zombieAnimations,
        zombie2: zombie2Animations,
        explosion: explosion
    };
    
}());
