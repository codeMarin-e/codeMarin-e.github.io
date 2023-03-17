var renderers = (function(){
    var drawZombie = function(canvasRenderer, zombie) {
        var canvas = canvasRenderer.canvas,
            ctx = canvas.getContext('2d'),
            animation = zombie.animation[zombie.status],
            directions = zombies.getDirections(),
            zombieSpeed = directions[zombies.status]? zombie.speed : 1,
            animationSpeed = Math.floor(100/(animation.animationSpeed * zombieSpeed)),
            sprites = animation.animation(),
            frames = canvasRenderer.frames,
            sprite;
        if(zombie.animationFrame > sprites.length-1) {
            zombie.animationFrame = 0;
        }
        sprite = sprites[zombie.animationFrame];
        if(animation.mirrorH === 1 || animation.mirrorV === 1) { //flip animation
            var posX = zombie.x, posY = zombie.y, scaleH = 1, scaleV = 1;
            if(animation.mirrorH === 1) {
                posX = zombie.x*-1-animation.spriteWidth;
                scaleH = -1;
            }
            if(animation.mirrorV === 1) {
                posY = zombie.y*-1-animation.spriteHeight;
                scaleV = -1;
            }
            canvasRenderer.flipImage(ctx, sprite.img, sprite.x, sprite.y, sprite.w, sprite.h, posX, posY, sprite.w, sprite.h, scaleH, scaleV);
        }else {
            ctx.drawImage(sprite.img, sprite.x, sprite.y, sprite.w, sprite.h, zombie.x, zombie.y, sprite.w, sprite.h);
        }
        if(frames % animationSpeed === 0) {
           zombie.animationFrame++;
        }
    }
    
    var drawExplosion = function(canvasRenderer, explosion) {
        var canvas = canvasRenderer.canvas,
            ctx = canvas.getContext('2d'),
            animation = explosion.animation[explosion.status],
            animationSpeed = Math.floor(100/(animation.animationSpeed)),
            sprites = animation.animation(),
            frames = canvasRenderer.frames,
            sprite;
            if(explosion.animationFrame > sprites.length-1) {
                explosion.animationFrame = 0;
            }
            sprite = sprites[explosion.animationFrame];
            ctx.drawImage(sprite.img, sprite.x, sprite.y, sprite.w, sprite.h, explosion.x, explosion.y, sprite.w, sprite.h);
            if(frames % animationSpeed === 0) {
                explosion.animationFrame++;
            }
    }
    
	function CanvasRenderer(selector) {
		//debugger;
		if(selector instanceof HTMLCanvasElement) {
			this.canvas = selector;
		} else if(typeof selector == "String" || typeof selector == "string") {
			this.canvas = document.querySelector(selector)
		}
	}	
	//examples
	// var theCanvas = ducument.getElementById("...");
	// var c1 = new CanvasRenderer(theCanvas);
	// var c2 = new CanvasRenderer('#the-canvas');

	CanvasRenderer.prototype = {
        frames: 0,
        flipImage: function(ctx, img, x, y, w, h, posX, posY, dw, dh, scaleH, scaleV) {
            ctx.save(); // Save the current state
            ctx.scale(scaleH, scaleV);
            ctx.drawImage(img, x, y, w, h, posX, posY, dw, dh);
            ctx.restore(); // Restore the last saved state
        },
        draw: function(obj) {
			if(obj instanceof zombies.zombieType) {
				drawZombie(this, obj);
			}
            if(obj instanceof zombies.explosionType) {
				drawExplosion(this, obj);
			}
        },
		clear: function() {
			var ctx = this.canvas.getContext('2d'),
				width = this.canvas.width,
				height = this.canvas.height;
			ctx.clearRect(0, 0, width, height);
		}
	};


	function DomRenderer() {

	}

	return {
		getCanvas: function (selector) {
			return new CanvasRenderer(selector);
		},
		getDom: function() {
			return new DomRenderer();
		}
	}
}());