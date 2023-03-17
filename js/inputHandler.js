
//InputHandler
function InputHandler() {
    this.down = {};
    this.pressed = {};
    this.mouse = {
        which: 0, //1 -left, 2 - scroll, 3 - right
        drag: false,
        clicked: false,
        position: {x: 0, y: 0}
    };
    this.touched = []
    this.touches = [];

    var $this = this;
    document.addEventListener('keydown', function(event) {        
        event = event || window.event; //for ie
        $this.down[event.keyCode] = true;
    });
    document.addEventListener('keyup', function(event) {     
        delete $this.down[event.keyCode];
        delete $this.pressed[event.keyCode];
    });
    document.addEventListener('mousedown', function(event) {        
        event = event || window.event; //for ie
        event.preventDefault();
        $this.mouse.which = event.which;
        $this.mouse.drag = true;
    });
    document.addEventListener('mouseup', function(event) {
        event = event || window.event; //for ie
        event.preventDefault();
        $this.mouse.drag = false;
        $this.mouse.clicked = false;
    });
    document.addEventListener('mousemove', function(event) {        
        event = event || window.event; //for ie
        $this.mouse.position = {
            x: event.clientX, 
            y: event.clientY
        };
    });
    document.addEventListener('touchstart', function(event) {
        event.preventDefault();
        $this.touched = event.changedTouches;
    });
    document.addEventListener('touchend', function(event) {
        event.preventDefault();
        $this.touched = [];
        $this.touches = [];
    });

};
InputHandler.prototype.isDown = function(code) {
    return this.down[code];
};
InputHandler.prototype.isPressed = function(code) {
    if(this.pressed[code]) {
        return false;
    }
    if(this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};
InputHandler.prototype.mouseIsDraged = function() {
    return this.mouse.drag;
};
InputHandler.prototype.mouseIsClicked = function() {
    if(this.mouse.clicked) {
        return false;
    }
    if(this.mouse.drag) {
        return this.mouse.clicked = true;
    }
    return false;
};
InputHandler.prototype.leftClicked = function() {
    if(this.mouseIsClicked() && this.mouse.which === 1) {
        return true;
    }
    return false;
};
InputHandler.prototype.rightClicked = function() {
    if(this.mouseIsClicked() && this.mouse.which === 3) {
        return true;
    }
    return false;
};
InputHandler.prototype.isTouched = function() {
    if(this.touches.length) {
        return false;
    }
    if(this.touched.length){
        this.touches = this.touched;
        return true;
    }
    return false
}
InputHandler.prototype.getTouches = function() {
    return this.touches;
};
var inputHandler = new InputHandler();