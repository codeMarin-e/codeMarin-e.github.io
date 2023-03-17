function Screen() { };
Screen.prototype.getWidth = function() {
    if (self.innerWidth) {
        return self.innerWidth;
    } else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientWidth;
    } else if (document.body) {
        return document.body.clientWidth;
    }
    return 0;
};
Screen.prototype.getHeight = function() {
    if (self.innerWidth) {
        return self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight){
        return document.documentElement.clientHeight;
    } else if (document.body) {
        return document.body.clientHeight;
    }
    return 0;
};