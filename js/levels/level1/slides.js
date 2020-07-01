slides = {
    slide1: {
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.lineMatchActivitiy.correctlyMatched * 50/10);
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.totalMatched == 10;
        },
        chanceLost: function(params) {
            return false;
        }
    },
    slide2: {
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return params.lineMatchActivitiy.correctlyMatched * 5;
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.totalMatched == 10;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide3: {
        resetScore: true,
        colouringEnabled: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * (100/6)) /*+ params.colouringActivity.colouredItems * 10/19)*/;
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 6 /*&& params.colouringActivity.colouredItems == 19*/;
        },
        chanceLost: function(params) {
            return false;
        }
    },
    slide4: {
        resetScore: true,
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return params.lineMatchActivitiy.correctlyMatched * 5;
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.totalMatched == 10;
        },
        chanceLost: function(params) {
            return false;
        }
    },
    slide5: {
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.lineMatchActivitiy.customScore); //Math.round(params.lineMatchActivitiy.correctlyMatched * 50/9);
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.totalMatched == 9;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide6: {
        resetScore: true,
        colouringEnabled: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * (100/6));/* + params.colouringActivity.colouredItems * 10/18);*/
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 6 /*&& params.colouringActivity.colouredItems == 18*/;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide7: {
        resetScore: true,
        drawLineEnabled: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) { 
                var score = Math.round(Math.min(params.lineMatchActivitiy.correctlyMatched, 5) * 15 + params.dragDropActivity.correctlyDropped * 12.5);
                if (params.lineMatchActivitiy.correctlyMatched > 5) {
                    score -= 15;
                }
                return score;
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.correctlyMatched == 5 && params.dragDropActivity.totalDropped == 2;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide8: {
        resetScore: true,
        dragEnabled: true,
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return params.lineMatchActivitiy.correctlyMatched * 10 + params.dragDropActivity.correctlyDropped * 15;
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.correctlyMatched == 7 && params.dragDropActivity.totalDropped == 2;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide9: {
        resetScore: true,
        drawLineEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.lineMatchActivitiy.correctlyMatched * 12.5);
        },
        completeCriteria: function(params) {
                return params.lineMatchActivitiy.totalMatched == 8;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide10: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 8;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide11: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return params.dragDropActivity.correctlyDropped * 5;
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 20;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide12: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 8;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide13: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 8;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide14: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);;
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 8;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide15: {
        resetScore: true,
        joinDotsEnabled: { dots: [
            {x: 698.72639406361, y: 220.4229607250755},
            {x: 701.0477442100007, y: 313.2326283987915},
            {x: 854.2568538717888, y: 422.2839879154078},
            {x: 800.8658005048021, y: 603.2628398791541},
            {x: 849.6141535790075, y: 656.6283987915407},
            {x: 554.8026849873846, y: 658.9486404833837},
            {x: 612.8364386471529, y: 607.9033232628399},
            {x: 550.1599846946032, y: 426.9244712990936}
        ]},
        scoreCalculator: function(params, callback) {
                return (params.joinDotsActivity.dotsJoinedCorrectly ? 25 : 0);
        },
        completeCriteria: function(params) {
                return true;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide16: {
        joinDotsEnabled: { dots: [
            {x: 491.28136347495865, y: 317.7931034482759},
            {x: 552.4367199241236, y: 230.19628647214853},
            {x: 650.9732286437667, y: 197.0261780104712},
            {x: 809.2892170106165, y: 242.41909814323608},
            {x: 850.0594546433932, y: 338.16445623342173},
            {x: 819.4817764188107, y: 378.9071618037135},
            {x: 750.1723724430905, y: 427.79840848806367},
            {x: 689.0170159939255, y: 437.9840848806366},
            {x: 595.2454694385392, y: 421.6870026525199}
        ]},
        scoreCalculator: function(params, callback) {
                return (params.joinDotsActivity.dotsJoinedCorrectly ? 25 : 0)
        },
        completeCriteria: function(params) {
                return true;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide17: {
        colouringEnabled: true,
        joinDotsEnabled: { dots: [
            {x: 206.44543517939303, y: 383.2629558541267},
            {x: 247.73452221527162, y: 396.5297504798465},
            {x: 209.39465568195578, y: 420.1151631477927},
            {x: 331.7873065383102, y: 511.5086372360845},
            {x: 429.1115831228812, y: 517.404990403071},
            {x: 485.1467726715736, y: 510.0345489443378},
            {x: 601.6409825228026, y: 443.700575815739},
            {x: 611.9632542817722, y: 424.53742802303265},
            {x: 647.3539003125253, y: 427.48560460652595}
        ]},
        scoreCalculator: function(params, callback) {
                return Math.round((params.joinDotsActivity.dotsJoinedCorrectly ? 12.5 : 0) + (params.colouringActivity.colouredItems == 1 ? 12.5 : 0));
        },
        completeCriteria: function(params) {
                return true;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide18: {
        colouringEnabled: true,
        joinDotsEnabled: { dots: [
            {x: 288.74955035305453, y: 505.7560975609756},
            {x: 177.93215535269306, y: 504.1951219512195},
            {x: 177.93215535269306, y: 380.8780487804878},
            {x: 358.98592746595966, y: 379.3170731707317},
            {x: 457.3168554240269, y: 271.609756097561},
            {x: 660.2219448613084, y: 270.0487804878049},
            {x: 719.5326633122062, y: 379.3170731707317},
            {x: 824.1068247914204, y: 380.8780487804878},
            {x: 825.6676331717073, y: 516.6829268292684}
        ]},
        scoreCalculator: function(params, callback) {
                return Math.round((params.joinDotsActivity.dotsJoinedCorrectly ? 12.5 : 0) + (params.colouringActivity.colouredItems == 1 ? 12.5 : 0));
        },
        completeCriteria: function(params) {
                return true;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide19: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 4;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide20: {
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.round(params.dragDropActivity.correctlyDropped * 12.5);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 4;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
    slide21: {
        resetScore: true,
        dragEnabled: true,
        scoreCalculator: function(params, callback) {
                return Math.floor(params.dragDropActivity.correctlyDropped * 100/18);
        },
        completeCriteria: function(params) {
                return params.dragDropActivity.totalDropped == 18;
        },
        chanceLost: function(params) {
            return params.score < 33;
        }
    },
}