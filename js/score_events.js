// Must fire 'answer_given' and 'update_score' events

var scoreParams = {
    lineMatchActivitiy: { correctlyMatched: 0, totalMatched: 0, customScore: 0 },
    dragDropActivity: { correctlyDropped: 0, totalDropped: 0 },
    checkBoxActivity: { totalChecked: 0 },
    colouringActivity: { colouredItems: 0 },
    joinDotsActivity: { dotsJoinedCorrectly: false }
};

var previousScore = 0;
var previousSlide = null;


function resetGame(stage, slide, same_slide) {
    if(!same_slide && previousSlide) {
        if(slide.resetScore) {
            previousScore = 0;
        } else {
            previousScore += previousSlide.scoreCalculator(scoreParams);
        }
    }
        
    stage.fire('update_score', { can_submit: false, score: previousScore });       

    if(!same_slide) {
        previousSlide = slide;
    }

    scoreParams = {
        lineMatchActivitiy: { correctlyMatched: 0, totalMatched: 0, customScore: 0},
        dragDropActivity: { correctlyDropped: 0, totalDropped: 0 },
        checkBoxActivity: { totalChecked: 0 },
        colouringActivity: { colouredItems: 0 },
        joinDotsActivity: { dotsJoined: 0, dotsJoinedCorrectly: 0 }
    };
    
    stage.off('line_drawn');
    stage.off('item_dropped');
    stage.off('item_coloured');
    stage.off('item_checked');
    stage.off('line_joined');
    stage.off('answer_given');

    stage.on('line_drawn', function(evt) {
       if (evt.toItem in evt.currentSlide.items.position) {
           var item = evt.currentSlide.items.position[evt.toItem];
           if('isTarget' in item && item.isTarget && item.isTargetFor.includes(evt.fromItem)) {
               if (!('connected' in item)) {
                   item.connected = [];
               }
               item.connected.push(evt.fromItem);
               
               stage.fire('answer_given', {
                   isCorrect: ('matchLimit' in item ? 
                                    item.isCorrectFor.includes(evt.fromItem) && 
                                    item.connected.includes(evt.fromItem) && 
                                    item.connected.length == item.matchLimit 
                               : 
                                    item.isCorrectFor.includes(evt.fromItem)),
                   activityType: 'lineMatchActivity',
                   currentSlide: evt.currentSlide,
                   customScore: item.customScore ? item.customScore : 0
               });
               evt.currentSlide.items.position[evt.fromItem]['isConnected'] = true;
               return;
           }
       }

        evt.invalidLine();        
    });
    
    stage.on('item_dropped', function(evt) {
        // evt.item, evt.box, evt.currentSlide
       if (evt.box in evt.currentSlide.items.position) {
           var box = evt.currentSlide.items.position[evt.box];
           var item = evt.currentSlide.items.position[evt.item];
           if('isDroppable' in box && box.isDroppable) {
               // handle sort activity
               if ('correctForInstance' in box && box.correctForInstance) {
                   var count = box.itemsDropped.length;
                   if(!count) { 
                       return;
                   }
                   var instance = evt.currentSlide.items.position[box.itemsDropped[0]].instanceName;
                   var sameInstance = true;
                   for (var index in box.itemsDropped) {
                       if (instance !== evt.currentSlide.items.position[box.itemsDropped[index]].instanceName) {
                           sameInstance = false;
                       }
                   }
                   
                   box.completed = true;
                   box.correct = sameInstance &&
                            (box.isCorrectFor[0] instanceof Object ? 
                                box.isCorrectFor.filter((ins) => {return ins.name == instance})[0].count == count : box.isCorrectFor.includes(instance));

               } else {
                   box.completed = true;
                   box.correct = box.isCorrectFor.includes(evt.item);
               }
               
               
               if ('dependsOn' in box) {
                   var dependencyMet = true;
                   box.dependsOn.push(evt.box);
                   box.dependsOn.forEach(function(_box, it) {
                       dependencyMet = dependencyMet && 'correct' in evt.currentSlide.items.position[_box] && evt.currentSlide.items.position[_box].correct;
                   });
                   
                   if(dependencyMet) {
                           box.dependsOn.forEach(function(_box, it) {
                               stage.fire('answer_given', {
                               isCorrect: true,
                               activityType: 'dragDropActivity',
                               currentSlide: evt.currentSlide
                           });
                       });
                   }
                } else {
                    stage.fire('answer_given', {
                           isCorrect: box.correct,
                           activityType: 'dragDropActivity',
                           currentSlide: evt.currentSlide
                       });
                }
               
               return;
           }
       }
    });
    
    stage.on('item_checked', function(evt) {
        stage.fire('answer_given', {
            isCorrect: true,
            activityType: 'checkBoxActivity',
            currentSlide: evt.currentSlide
        });
    });
             
    stage.on('item_coloured', function(evt) {
        stage.fire('answer_given', {
            isCorrect: true,
            activityType: 'colouringActivity',
            currentSlide: evt.currentSlide
        });
    });
    
    stage.on('line_joined', function(evt) {
        stage.fire('answer_given', {
            isCorrect: true,
            activityType: 'joinDotsActivity',
            currentSlide: evt.currentSlide
        });
        // TODO: throw event from custom events with checks to see if line is correctly joined
    });

    stage.on('answer_given', function(evt) {
        if (evt.activityType === 'lineMatchActivity') {
            scoreParams.lineMatchActivitiy.totalMatched++;
            
            if(evt.isCorrect) {
                scoreParams.lineMatchActivitiy.correctlyMatched++;
                scoreParams.lineMatchActivitiy.customScore += evt.customScore;
                console.log(scoreParams.lineMatchActivitiy.customScore);
            }
        }
        
        if (evt.activityType === 'dragDropActivity') {
            scoreParams.dragDropActivity.totalDropped++;
            
            if(evt.isCorrect) {
                scoreParams.dragDropActivity.correctlyDropped++;
            }
        }
        
        if (evt.activityType === 'checkBoxActivity' && evt.isCorrect) {
            scoreParams.checkBoxActivity.totalChecked = 1;
        }
        
        if (evt.activityType === 'colouringActivity' && evt.isCorrect) {
            scoreParams.colouringActivity.colouredItems++;
        }
        
        if (evt.activityType === 'joinDotsActivity') {
            scoreParams.joinDotsActivity.dotsJoinedCorrectly = evt.isCorrect;
        }
        
        stage.fire('update_score', {
            can_submit: evt.currentSlide.completeCriteria(scoreParams), 
            score: previousScore + evt.currentSlide.scoreCalculator(scoreParams),       
        })
    });
}