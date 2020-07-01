var dragStartPos = null;
var drawingLine = false;
var lastLine = null;
var lastItem = null;
var originalLayer = null;
var colourPicked = null;
var originalPosition = null;
var lineFromDots = null;
var finishedJoiningDots = null;
var regionDots = null;

function resetStageEvents(stage) {
    dragStartPos = null;
    drawingLine = false;
    lastLine = null;
    lastItem = null;
    originalLayer = null;
    colourPicked = null;
    originalPosition = null;
    lineFromDots = null;
    finishedJoiningDots = null;
    regionDots = null;
    
    stage.off('mousedown');
    stage.off('mousemove');
    stage.off('mouseup');
    stage.off('touchend');
    stage.off('touchmove');
    stage.off('touchstart');
    stage.off('dragstart');
    stage.off('dragend');
}

function drawLineEvent(drawLayer, slide) {
    if (!slide || !slide.drawLineEnabled) {
        return;
    }
    
    const pencil_name = Object.keys(slide.items.position).filter((key) => {return 'isPencil' in slide.items.position[key]});
    var pencil = null;
    if (pencil_name.length) {
        pencil = stage.find('#' + pencil_name[0])[0];
        pencil.setAttrs({ offset: { x: 0 ,y: 0 }});
    }
    const pencil_position = pencil_name.length ? pencil.position() : null;
    
    
    const sources = Object.keys(slide.items.position).filter((key) => {return 'isSource' in slide.items.position[key]});
    sources.forEach(item => {
        console.log(item);
        const stage_item = stage.find('#' + item)[0];
        stage_item.setAttrs({offsetX: stage_item.width(), x: stage_item.position().x+stage_item.width()/2});
    });
    
    const targets = Object.keys(slide.items.position).filter((key) => {return 'isTarget' in slide.items.position[key]});
    targets.forEach(item => {
        console.log(item);
        const stage_item = stage.find('#' + item)[0];
        stage_item.setAttrs({offsetX: 0, x: stage_item.position().x-stage_item.width()/2});
    });
    
    
    drawLayer.getStage().on('mousedown touchstart', function(e) {
        var pos = getRelativePointerPosition(drawLayer.getStage());
        dragStartPos = pos;
        drawingLine = false;
        var item = e.target;
        
        if (item.id() in slide.items.position) {
            if (slide.items.position[item.id()].isSource) {
                if (slide.items.position[item.id()].isConnected) {
                    return;
                }
                lastItem = item.id();
                drawingLine = true;
                lastLine = new Konva.Line({
                    stroke: '#df4b26',
                    strokeWidth: 5,
                    globalCompositeOperation: 'brush',
                    points: [item.position().x, item.position().y, item.position().x, item.position().y],
                    listening: false,
                });
                drawLayer.add(lastLine);
            }
        }
        
    });

    drawLayer.getStage().on('mousemove touchmove', function(e) {
        if (!drawingLine) {
            return;
        }

        var pos = getRelativePointerPosition(drawLayer.getStage());
        
        if (pencil) {
            pencil.moveToTop();
            pencil.setAttrs({ x: pos.x + 10, y: pos.y + 20 });
            pencil.getLayer().batchDraw();
        }
        
        var newPoints = lastLine.points();
        newPoints[2] = pos.x;
        newPoints[3] = pos.y;
        lastLine.points(newPoints);
        drawLayer.batchDraw();
    });

    drawLayer.getStage().on('mouseup touchend', function(e) {
        if (!drawingLine) {
            return;
        }
        
        if (pencil) {
            pencil.setAttrs({ x: slide.items.position[pencil_name[0]].x, y: slide.items.position[pencil_name[0]].y });
            pencil.getLayer().batchDraw();
        }
        
        var item = e.target;
        
        var newPoints = lastLine.points();
        newPoints[2] = item.position().x;
        newPoints[3] = item.position().y;
        lastLine.points(newPoints);
        drawLayer.batchDraw();
        
        drawLayer.getStage().fire('line_drawn', {
            fromItem: lastItem,
            toItem: item.id(),
            currentSlide: slide,
            invalidLine: function() {
                lastLine.remove();
                drawLayer.batchDraw();
            }
        });

        drawingLine = false;
    });
}

function checkItemEvent(drawLayer, slide) {
    if (!slide || !slide.checkEnabled) {
        return;
    }
        
    drawLayer.getStage().on('mousedown touchstart', function(e) {
        var item = e.target;
        if (item.id() in slide.items.position) {
            var posData = slide.items.position[item.id()];
            if (posData.isCheckable) {
                if (!posData.isChecked) {
                    posData.isChecked = true;
                    if(!posData.checkImgObj) {
                        var img = new Image();
                        img.onload = function() {
                            posData.checkImgObj = new Konva.Image({
                                x: posData.x + posData.checkImg.offset.x,
                                y: posData.y + posData.checkImg.offset.y,
                                image: img,
                            });
                            drawLayer.add(posData.checkImgObj);
                            posData.checkImgObj.on('mousedown touchstart', function() {
                                posData.isChecked = false;
                                posData.checkImgObj.remove();
 
                                drawLayer.batchDraw();
                                
                                stage.fire('item_checked', { item: item.id(), checked: false, currentSlide: slide });
                            });
                            drawLayer.batchDraw();
                        };
                        img.src = 'assets/' + posData.checkImg.path;
                    } else {
                        drawLayer.add(posData.checkImgObj);
                        drawLayer.batchDraw();
                    }
                } else {
                    posData.isChecked = false;
                    posData.checkImgObj.remove();
                    drawLayer.batchDraw();
                }
                
                stage.fire('item_checked', { item: item.id(), checked: posData.isChecked, currentSlide: slide });
            }
        }
        
    });
}

function colouringEvent(drawLayer, slide) {
    if (!slide || !slide.colouringEnabled) {
        return;
    }
    
    const pencil_name = Object.keys(slide.items.position).filter((key) => {return 'isPencil' in slide.items.position[key]});
    var pencil = null;
    if (pencil_name.length) {
        pencil = stage.find('#' + pencil_name[0])[0];
        pencil.setAttrs({ offset: { x: pencil.width() ,y: 0 }});
    }
    
    //const pencil_position = pencil_name.length ? pencil.absolutePosition() : null;
        
    drawLayer.getStage().on('mousedown touchstart', function(e) {
        var pos = drawLayer.getStage().getPointerPosition();
        var item = e.target;
                
        if (item.id() in slide.items.position) {
            var posData = slide.items.position[item.id()];
            if (posData.canColour && colourPicked) {
                if (posData.groupName) {
                    fillColour(item, posData.originalImage, colourPicked);
                
                    item.getLayer().batchDraw();
                    colourPicked = null;
                    
                    if (pencil) {
                        pencil.setAttrs({ x: slide.items.position[pencil_name[0]].x + pencil.width(), 
                                          y: slide.items.position[pencil_name[0]].y});
                        pencil.getLayer().batchDraw();
                    }
                
                    var parent = item.findAncestor('Group');
                    var mainItem = parent ? parent.name() : item.id();
                    
                    if(!slide.items.position[mainItem].isColoured) {
                        stage.fire('item_coloured', { item: mainItem, currentSlide: slide });
                        slide.items.position[mainItem].isColoured = true;
                    }
                }
            } else if (posData.isSwatch) {
                var originalLayer = item.getLayer();
                item.moveTo(drawLayer);
                drawLayer.batchDraw();
                originalLayer.batchDraw();
                
                var canvas = drawLayer.toCanvas({ x: 0, y: 0}, drawLayer.width, drawLayer.height);
                var pixel = canvas.getContext('2d').getImageData(pos.x, pos.y, 1, 1).data;
                
                colourPicked = pixel[3] > 0 ? pixel : null;
                
                var rel_pos = getRelativePointerPosition(drawLayer.getStage());
                
                if (pencil) {
                    pencil.moveTo(drawLayer);
                    pencil.moveToTop();
                    pencil.setAttrs({ x: rel_pos.x, y: rel_pos.y});
                    pencil.getLayer().batchDraw();
                }

                item.moveTo(originalLayer);
                drawLayer.batchDraw();
                originalLayer.batchDraw();
            }
        }
    });
    
    drawLayer.getStage().on('mousemove touchmove', function(e) {
        if (colourPicked && pencil) {
            var pos = getRelativePointerPosition(drawLayer.getStage());
            pencil.moveToTop();
            pencil.setAttrs({ x: pos.x, y: pos.y});
            pencil.getLayer().batchDraw();
        }
    });
}

function dragEvent(drawLayer, slide) {
    if (!slide || !slide.dragEnabled) {
        return;
    }
    
    stage.on('dragstart', function (e) {
        var item = e.target;
        var key = item.id();
        if (item.getClassName() === 'Group') {
            key = item.name();
        }
        originalPosition = item.position();

        if (key in slide.items.position) {
            var posData = slide.items.position[key];
            if(posData.isDraggable) {
                originalLayer = item.getLayer();
                if (posData.makeCopy) {
                    originalLayer.add(item.clone(/*{ draggable: false }*/));
                }
                item.moveTo(drawLayer);
                originalLayer.batchDraw();
            }
        }
        drawLayer.batchDraw();
    });
    
    stage.on('dragend', function (e) {
        var pos = drawLayer.getStage().getPointerPosition();

        var box = originalLayer.getIntersection(pos);
        
        if(!box || !(box.id() in slide.items.position)) { return; }
        
        var key = e.target.getClassName() === 'Group' ? e.target.name() : e.target.id();

        var posData = slide.items.position[box.id()];
        
        if (posData.isDroppable && !posData.itemsDropped) {
             posData.itemsDropped = [];
        }
        
        if(!posData.isDroppable || (posData.dragLimit && posData.itemsDropped.length >= posData.dragLimit)) {
            e.target.moveTo(originalLayer);
            e.target.position(originalPosition);
            originalLayer.batchDraw();
        } else {
            if (slide.items.position[key].onDropImg) {
                var img = new Image();
                img.onload = function() {
                    e.target.image(img);
                    e.target.setAttrs({ offsetX: img.width/2, offsetY: img.height/2, width: img.width, height: img.height });
                    e.target.getLayer().batchDraw();
                }
                if (slide.items.position[key].onDropImg in slideImages) {
                    img.src = slideImages[slide.items.position[key].onDropImg].src;
                } else {
                    img.src = assetDir + slide.items.position[key].onDropImg;
                } 
            }
            posData.itemsDropped.push(key);
            e.target.moveTo(originalLayer);
            e.target.moveToTop();
            
            var itemRect = e.target.getClientRect();
            var boxRect = box.getClientRect();
            
            var x = e.target.position().x, y = e.target.position().y;
            var padding = 0;//25;
            
            e.target.draggable(false);

            if (itemRect.x + itemRect.width > boxRect.x + boxRect.width) {
                x += (boxRect.x + boxRect.width) - (itemRect.x + itemRect.width) - padding;
            }
            if (itemRect.x < boxRect.x + padding) {
                x += boxRect.x - itemRect.x + padding
            }
            if (itemRect.y + itemRect.height > boxRect.y + boxRect.height) {
                y += (boxRect.y + boxRect.height) - (itemRect.y + itemRect.height) - padding;
            }
            if (itemRect.y < boxRect.y + padding) {
                y += boxRect.y - itemRect.y + padding
            }
            
            e.target.position(posData.snapToCenter ? box.position() : {x, y});
            originalLayer.batchDraw();

            stage.fire('item_dropped', {item: key, box: box.id(), currentSlide: slide });
        }
        
        drawLayer.batchDraw();
    });
}

function joinDotsEvent(drawLayer, slide) {
    if (!slide || !slide.joinDotsEnabled) {
        return;
    }
    
    lineFromDots = new Konva.Line({
        points: [],
        stroke: 'black',
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round',
    });
    regionDots = [];
    
    drawLayer.add(lineFromDots);
    drawLayer.batchDraw();
    
    finishedJoiningDots = false;
    var listening = true;
    var regions = [];
    for (var dot in slide.joinDotsEnabled.dots) {
        var region = new Konva.Circle({
            x: slide.joinDotsEnabled.dots[dot].x,
            y: slide.joinDotsEnabled.dots[dot].y,
            radius: 15,
            stroke: 0,
            listening: listening
        });
        regions.push(region);
        listening = false;
        drawLayer.add(region);
        drawLayer.batchDraw();
        
    }
    for(var r = 0; r < regions.length; r++) {
        regions[r].on('mouseup touchend', function(e) {
            if (finishedJoiningDots) {
                return;
            }
            
            regionDots = regionDots.concat([this.x(), this.y()]);
            lineFromDots.points(regionDots);
            
            for(var r = 0; r < regions.length; r++) {
                if (this === regions[r] && r < regions.length - 1) {
                    regions[r+1].listening(true);
                }
            }
            
            drawLayer.batchDraw();
            
            if(this === regions[regions.length - 1]) {
                finishedJoiningDots = true;
                stage.fire('line_joined', { currentSlide: slide });
            }
                
            e.cancelBubble = true;
        });
    }
    
    drawLayer.getStage().on('mousemove touchmove', function(e) {
        if(finishedJoiningDots || !regionDots.length) {
            return;
        }
        
        var pos = getRelativePointerPosition(drawLayer.getStage());
        lineFromDots.points(regionDots.concat([pos.x, pos.y]));
        drawLayer.batchDraw();
    });
    
    drawLayer.getStage().on('mouseup touchend', function(e) {
        var pos = getRelativePointerPosition(drawLayer.getStage());
        console.log(pos);
        if (regionDots.length <= 2) {
            regionDots = [];
            regions[0].listening(true);
            lineFromDots.points(regionDots);
            drawLayer.batchDraw();
            return;
        }
        
        lineFromDots.points(regionDots);
        drawLayer.batchDraw();
    });
}

function getRelativePointerPosition(node) {
    var transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    var pos = node.getStage().getPointerPosition();

    // now we can find relative point
    return transform.point(pos);
}

function pointInRect(p, rect) {
    return rect.x <= p.x && p.x <= rect.x + rect.width &&
           rect.y <= p.y && p.y <= rect.y + rect.height;
}

function fillColour(item, image, colour) {
    var image = new Konva.Image({ 
        x: 0, y: 0, 
        width: item.width(), 
        height: item.height(), 
        image: image, 
        pixelRatio: 5 });
    var c = image.toCanvas();
    var ctx = c.getContext('2d');
    var pixels = ctx.getImageData(0, 0, item.width(), item.height());
    for (var x = 0; x < pixels.width; x++) {
        for (var y = 0; y < pixels.height; y++) {
            var rIndex = (x + y * pixels.width) * 4;
            var gIndex = rIndex + 1;
            var bIndex = rIndex + 2;
            var aIndex = rIndex + 3;
            if(pixels.data[rIndex] == 255 && pixels.data[gIndex] == 255 && pixels.data[bIndex] == 255 && pixels.data[aIndex] == 255) {
                pixels.data[rIndex] = colour[0];
                pixels.data[gIndex] = colour[1];
                pixels.data[bIndex] = colour[2];
                //pixels.data[aIndex] = colour[3] - pixels.data[aIndex];
            }
        }
    }
    ctx.imageSmoothingEnabled = false;
    ctx.putImageData(pixels, 0, 0);
    item.image(c);
}