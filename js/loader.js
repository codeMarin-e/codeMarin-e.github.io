function Loader(loaderDom) {
    this.loaderDom = loaderDom;
    this.loaded = 0;
    this.loadObjects = [];
    this.afterLoad;
};
Loader.prototype.changeLoaded = function() {
    this.loaderDom.children['loaded'].innerHTML = this.loaded;
};
Loader.prototype.changeToLoad = function() {
    this.loaderDom.children['toLoad'].innerHTML = this.loadObjects.length;
};
Loader.prototype.loadImages = function(imgArray) {
    var img, imgName;
    for (imgName in imgArray) {
        img = new Image();
        img.src = imgArray[imgName]; 
        img.onLoad = this.onLoad();
        imgArray[imgName] = img;
        this.loadObjects.push(img);
        
    }
    this.changeToLoad();
    return imgArray;
};
Loader.prototype.loadAudio = function(audio) {
    this.loadObjects.push(audio); 
    audio.addEventListener('load', this.onLoad());
};
Loader.prototype.setAfterLoad = function(afterLoad) {
    this.afterLoad = afterLoad;
};
Loader.prototype.onLoad = function() {
    if(this.loaded === this.loadObjects.length) {
        //this.loaderDom.style.display = 'none';
        this.afterLoad(); 
        return;
    }    
    this.loaded++;
    this.changeLoaded();
};
