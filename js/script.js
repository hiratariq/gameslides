var stageWidth = 1366;
var stageHeight = 768;
var slides = null;
var currentSlide = 'slide1';
var currentLevel = 'level1';
var chances = 3;
var scoreLayer = null;
var scoreGroup = null;
var itemsLayer = null;
var drawLayer = null;
var preview = false;
var assetDir =  'assets/';
var slideImages = {};

function getNextSlide() {
    var keys = Object.keys(slides);
    var i = keys.indexOf(currentSlide);

    return i !== -1 && keys[i + 1] && slides[keys[i + 1]] ? keys[i + 1] : -1;
}

function getNextLevel() {
    var keys = Object.keys(levels);
    var i = keys.indexOf(currentLevel);

    return i !== -1 && keys[i + 1] && levels[keys[i + 1]] ? keys[i + 1] : -1;
}

function initLevel(same_slide) {
    slideImages = {};
    var sources = slides[currentSlide].items.sources;
    for (var src in sources) {
        slideImages[sources[src]] = null;
    }
    loadImages(sources, stage, initStage, currentSlide, same_slide || false);
}

function loadImages(sources, stage, callback, subdir, sameslide) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;

    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        if (slideImages[sources[src]]) {
            images[src] = slideImages[sources[src]];
            if (++loadedImages >= numImages) {
                callback(images, stage, sameslide);
            }
        } else {
            images[src] = new Image();
            images[src].onload = function() {
                var key = this.src.split("/").pop();
                if (key in slideImages) {
                    slideImages[key] = this;
                }
                if (++loadedImages >= numImages) {
                    callback(images, stage, sameslide);
                }
            };
            images[src].src = assetDir + subdir + '/' + sources[src];
        }
    }
}

function initScoreBoard(images, stage, sameslide) {
    resetGame(stage, slides[currentSlide], sameslide || false);
    
    if (!drawLayer) {
        drawLayer = new Konva.Layer({ id: 'draw_layer' });
        stage.add(drawLayer);
    } else {
        drawLayer.destroyChildren();
        drawLayer.clear();
    }
    
    if(scoreLayer) {
        //stage.add(scoreLayer);
        scoreLayer.zIndex(2);
        scoreLayer.batchDraw();
        scoreGroup.moveToTop();
        drawLayer.batchDraw();
        
        resetStageEvents(stage);
        drawLineEvent(drawLayer, slides[currentSlide]);
        checkItemEvent(drawLayer, slides[currentSlide]);
        colouringEvent(drawLayer, slides[currentSlide]);
        dragEvent(drawLayer, slides[currentSlide]);
        joinDotsEvent(drawLayer, slides[currentSlide]);
        return; 
    }
    
    scoreLayer = new Konva.Layer();
    scoreGroup = new Konva.Group();
    scoreLayer.add(scoreGroup);

    var items = common.items;
    var nextbtn = null;

    for (var key in items) {
        // anonymous function to induce scope
        (function() {
            var itemPos = items[key];

            var item = new Konva.Image({
                id: key,
                image: images[key],
                x: itemPos.x,
                y: itemPos.y,
            });

            if ('next_btn' === key) {
                nextbtn = item;
            }

            scoreGroup.add(item);
        })();
    }

    // Score
    scoreDisp = new Konva.Text({
        x: 361, y: 720,
        fontFamily: 'Arial black',
        fontSize: 22,
        fill: 'white',
        text: '0/100',
    });

    scoreGroup.add(scoreDisp);

    // Next button
    nextbtn.on('click tap', function() {
        currentSlide = getNextSlide();
        if (currentSlide !== -1) {
            loadSlide(currentSlide);
            //initLevel();
        } else {
            alert("level finished!");
            currentLevel = getNextLevel();
            if (currentLevel !== -1) {
                currentSlide = 'slide1';
                loadSlide(currentSlide);
            } else {
                alert("No new level exists");
            }
        }
    });
    scoreGroup.add(nextbtn);
    //var drawLayer = new Konva.Layer({ id: 'draw_layer' });
    
    var heart_full = new Image();
    var heart_empty = new Image();
    
    heart_full.onload = function() {
        scoreLayer.batchDraw();
    };
    heart_full.src = 'assets/common/heart_full.png';

    heart_empty.onload = function() {
        scoreLayer.batchDraw();
    };
    heart_empty.src = 'assets/common/heart_empty.png';

    stage.on('update_score', function(evt){
        if(evt.can_submit) {
            //TODO: ENable submit button
            
            /*if(evt.score < 33) {
                chances--;
            }
            
            updateChances();*/
        }
        
        var stars_full = stage.find('#stars_full');
        if (stars_full) {
            stars_full[0].crop({x: 0, y: 0, width: (evt.score/100) * stars_full[0].image().width, height: stars_full[0].image().height});
            stars_full[0].setAttrs({width: (evt.score/100) * stars_full[0].image().width});
        }
        
        scoreDisp.text(evt.score + '/100');
        scoreGroup.moveToTop();
        scoreLayer.batchDraw();
    });

    stage.add(scoreLayer);
    drawLayer.batchDraw();
    
    function updateChances() {
        var heart1 = stage.find('#heart1');
        var heart2 = stage.find('#heart2');
        var heart3 = stage.find('#heart3');
        if (heart1 && heart2 && heart3) {
            heart1[0].image(chances > 0? heart_full: heart_empty);
            heart2[0].image(chances > 1? heart_full: heart_empty);
            heart3[0].image(chances > 2? heart_full: heart_empty);
            
            heart1[0].listening(chances > 0);
            heart2[0].listening(chances > 1);
            heart3[0].listening(chances > 2);
        }
    }
    
    var hearts = stage.find('#heart1').concat(stage.find('#heart2')).concat(stage.find('#heart3'));
    
    hearts.forEach((heart) => {
        heart.off('click tap');
        heart.on('click tap', () => {
            loadSlide(currentSlide, true);
            chances--;
            updateChances();
        });
    })
    
    updateChances();
    
    var stars_full = stage.find('#stars_full');
    if (stars_full) {
        stars_full[0].crop({x: 0, y: 0, width: 0, height: stars_full[0].image().height});
        stars_full[0].setAttrs({width: 0});
    }
    
    scoreLayer.batchDraw();
    
    resetStageEvents(stage);
    drawLineEvent(drawLayer, slides[currentSlide]);
    checkItemEvent(drawLayer, slides[currentSlide]);
    colouringEvent(drawLayer, slides[currentSlide]);
    dragEvent(drawLayer, slides[currentSlide]);
    joinDotsEvent(drawLayer, slides[currentSlide]);
}

function initStage(images, stage, sameslide) {
    if (!itemsLayer) {
        itemsLayer = new Konva.Layer({ id: 'items_layer' });
        stage.add(itemsLayer);
    } else {
        itemsLayer.destroyChildren();
        itemsLayer.clear();
    }

    // image positions
    var items = slides[currentSlide].items.position;

    for (var key in items) {
        // anonymous function to induce scope
        //(function() {
            var itemPos = items[key];
            var group;
        
            if (itemPos.groupName) {
                group = stage.find('#grp_' + itemPos.groupName)[0];
                
                if (group) {
                    if (!group.draggable()) {
                        group.draggable(itemPos.isDraggable);
                        group.name(key);
                    }
                } else {
                    group = new Konva.Group({ draggable: itemPos.isDraggable, id: 'grp_' + itemPos.groupName });
                    if (itemPos.isDraggable) {
                        group.name(key);
                    }
                    itemsLayer.add(group);
                }
            }

            var item = new Konva.Image({
                id: key,
                image: images[key],
                x: itemPos.x,
                y: itemPos.y,
                draggable: itemPos.groupName ? false : itemPos.isDraggable
            });
            item.setAttrs({x: itemPos.x + item.width() / 2, y: itemPos.y + item.height() / 2, offsetX: item.width() / 2, offsetY: item.height() / 2});
            
            if ('isClickable' in itemPos) {
                item.listening(itemPos.isClickable);
            }
        
            if(itemPos.canColour) {
                itemPos.originalImage = images[key];
            }
            
            if (itemPos.groupName) {
                group.add(item);
                if (itemPos.isDraggable) {
                    item.moveToTop();
                } else {
                    item.moveToBottom();
                }
            } else {
                itemsLayer.add(item);
            }

            if('z' in itemPos) {
                item.zIndex(itemPos.z);
            }
        
            if('playSound' in itemPos) {
                itemPos.sound = new sound(itemPos.playSound);
                item.on("click tap", (e) => {
                   slides[currentSlide].items.position[e.target.id()].sound.play(); 
                });
            }
        //})();
    }

    itemsLayer.batchDraw();
    
    loadImages(common.sources, stage, initScoreBoard, 'common', sameslide || false);
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = assetDir + currentSlide + '/' + src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

var stage = new Konva.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight,
});

fitStageIntoParentContainer();

function loadSlide(slidename, same_slide) {
    var url = levels.level1.slides_path + slidename + '.json';
    loadScript(levels.level1.script_path, function() {
        loadJSON(url, function(data) {
            slides[currentSlide]['items'] = JSON.parse(data);
            slides[currentSlide].datafile = url;
            if (currentSlide) {
                initLevel(same_slide || false);
            }
        });
        var x = document.getElementById("slides");
        if(x.options.length) {return;}
        Object.keys(slides).forEach((s) => {
           var option = document.createElement("option");
            option.text = s;
            x.add(option); 
        });
    });
}

loadSlide(currentSlide);
//initLevel();

function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function selectSlide() {
    currentSlide = document.getElementById("slides").value;
    loadSlide(currentSlide);
}

function fitStageIntoParentContainer() {
    var container = document.querySelector('#stage-parent');
    // now we need to fit stage into parent
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    // to do this we need to scale the stage
    var scale = containerWidth / stageWidth > containerHeight / stageHeight ? 
        containerHeight / stageHeight : containerWidth / stageWidth;

    stage.width(stageWidth * scale);
    stage.height(stageHeight * scale);
    stage.scale({ x: scale, y: scale });
    stage.batchDraw();
}

fitStageIntoParentContainer();
// adapt the stage on any window resize
window.addEventListener('resize', fitStageIntoParentContainer);