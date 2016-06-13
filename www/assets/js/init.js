import {Board} from './board';

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


(function(){

    if ("performance" in window == false) {
        window.performance = {};
    }

    Date.now = (Date.now || function () {  // thanks IE8
        return new Date().getTime();
    });

    if ("now" in window.performance == false){

        var nowOffset = Date.now();

        if (performance.timing && performance.timing.navigationStart){
            nowOffset = performance.timing.navigationStart
        }

        window.performance.now = function now(){
            return Date.now() - nowOffset;
        }
    }

})();

let getWindowSizes = () => {
    let w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    return {
        width: x,
        height: y
    };
};

let cols = 27,
    rows = 20,
    width = getWindowSizes().width,
    height = getWindowSizes().height,

    cellWidth = width / cols,
    cellHeight = height / rows,
    fontSize = 18,//cellWidth < cellHeight ? cellWidth/2 : cellHeight/2,
    drawingAreaWidth =  cols * fontSize * 0.6,
    paddingLeft = (width - drawingAreaWidth)/2,
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя',
    dictionary = [
        'Неважно, кто мы такие, важно то, какой у нас план',
        'Я сам творю свою удачу',
        'Не проблемы должны толкать вас в спину, а вперед вести мечты',
        'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности',
        'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь',
        'Нельзя казнить помиловать'
    ],
    initialShit = dictionary[Board.random(0, dictionary.length - 1)];

var boardElm = document.getElementById('canvas'),
    hammertime = new Hammer(boardElm, {});
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

var mc = new Hammer.Manager(boardElm);

mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_VERTICAL })).recognizeWith(mc.get('pan'));

let initSwipeEvent = () => {
    mc.on("swipe", swipeEventHandler);
    mc.on("pan", panEventHendler);
};

let removeSwipeEvent = () => {
    mc.off("swipe");
    mc.off("pan");
};

function animate(options) {
    var start = performance.now();

    requestAnimationFrame(function animate(time) {
        // from 0 to 1
        var timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;

        var progress = options.timing(timeFraction);

        options.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

let boardQueue = [];
let boardQueueSize = 10;
let animationDuration = 1000;

canvas.width = width;
canvas.height = height;

let EasingFunctions = {
    b: function(t) {
      return t<=.5 ? t : 1-t;
    },
    // no easing, no acceleration
    linear: function (t) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t) { return t*t },
    // decelerating to zero velocity
    easeOutQuad: function (t) { return t*(2-t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    // accelerating from zero velocity
    easeInCubic: function (t) { return t*t*t },
    // decelerating to zero velocity
    easeOutCubic: function (t) { return (--t)*t*t+1 },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    // accelerating from zero velocity
    easeInQuart: function (t) { return t*t*t*t },
    // decelerating to zero velocity
    easeOutQuart: function (t) { return 1-(--t)*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    // accelerating from zero velocity
    easeInQuint: function (t) { return t*t*t*t*t },
    // decelerating to zero velocity
    easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

let swipeEventHandler = function(ev) {
    var dir = ev.velocity < 0,
        velocity = Math.abs(ev.velocity);

    // ev.velocity = 0.5;
    
    let boardSpinNumber = Math.round(velocity);

    // console.info(dir == true);



    console.info(ev.velocity, dir);

    if(boardSpinNumber) {
        animate({
            duration: animationDuration,
            timing: EasingFunctions.easeInOutQuint,
            draw: function(progress) {
                removeSwipeEvent();

                for(let i = 0; i <= boardQueueSize * 2; i += 1){
                    if(dir) {
                        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop - boardSpinNumber * height * progress;
                    }
                    else{
                        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop + boardSpinNumber * height * progress;
                    }
                }

                for(let i = 0; i <= boardQueueSize * 2; i += 1){
                    boardQueue[i].draw();
                }

                if(progress >= 1){
                    for(let i = 0; i <= boardQueueSize * 2; i += 1){
                        boardQueue[i].initPaddingTop = boardQueue[i].paddingTop;
                    }

                    if(dir) {
                        appendBoards(boardSpinNumber);
                        // console.info(boardQueue, 'append');
                    }
                    else{
                        prependBoards(boardSpinNumber);
                        // console.info(boardQueue, 'prepend');
                    }

                    // generateBoards(boardSpinNumber);
                    initSwipeEvent();
                }

                boardQueue[boardQueueSize].drawGradient();
            }
        });
    }
    else {

    }
};

alert(1);

let panEventHendler = (ev) => {
    // console.log(ev);

    for(let i = 0; i <= boardQueueSize * 2; i += 1){
        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop + ev.deltaY;
    }

    for(let i = 0; i <= boardQueueSize * 2; i += 1) {
        boardQueue[i].draw();
    }

    let absoluteDistance = Math.abs(ev.deltaY / height);

    // console.info(absoluteDistance, 'absoluteDistance');

    boardQueue[boardQueueSize].drawGradient();

    if(ev.isFinal) {
        // console.info(ev.isFinal);
        animate({
            duration: animationDuration,
            timing: EasingFunctions.easeInOutQuint,
            draw: function(progress) {
                removeSwipeEvent();

                for(let i = 0; i <= boardQueueSize * 2; i += 1){
                    boardQueue[i].paddingTop = boardQueue[i].initPaddingTop + ev.deltaY - ev.deltaY * progress;
                }

                for(let i = 0; i <= boardQueueSize * 2; i += 1){
                    boardQueue[i].draw();
                }

                if(progress >= 1){
                    for(let i = 0; i <= boardQueueSize * 2; i += 1){
                        boardQueue[i].initPaddingTop = boardQueue[i].paddingTop;
                    }

                    console.log(progress);

                    initSwipeEvent();
                }

                // console.info(progress);

                boardQueue[boardQueueSize].drawGradient();
            }
        });
    }


};

let generateBoards = () => {
    for(let i = 0, j = -boardQueueSize; i <= boardQueueSize * 2; i++, j++) {
        if(i){
            initialShit = dictionary[Board.random(0, dictionary.length - 1)];

            while(true){
                initialShit = dictionary[Board.random(0, dictionary.length - 1)];

                if(initialShit !== boardQueue[i - 1].phrase){
                    break;
                }
            }
        }

        // console.info(j, cellHeight, rows, 'generateBoard');

        let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.push(board);
        board.draw();

        if(i === boardQueueSize){
            boardQueue[boardQueueSize].drawGradient();
        }
    }
};

let prependBoards = (number) => {
    for(let i = 0; i < number; i += 1) {
        boardQueue.pop();
    }

    for(let i = number; i > 0; i -= 1) {
        let j = -boardQueueSize + i - 1;

        initialShit = dictionary[Board.random(0, dictionary.length - 1)];

        // while(true){
        //     initialShit = dictionary[Board.random(0, dictionary.length - 1)];
        //
        //     if(initialShit !== boardQueue[i + 1].phrase){
        //         break;
        //     }
        // }

        // console.info(j, cellHeight, rows, 'prepend');

        let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.unshift(board);
        board.draw();
    }
};

let appendBoards = (number) => {
    for(let i = 0; i < number; i += 1) {
        boardQueue.shift();
    }

    for(let i = number; i > 0; i -= 1) {
        let j = boardQueueSize - i + 1;

        initialShit = dictionary[Board.random(0, dictionary.length - 1)];

        // while(true){
        //     initialShit = dictionary[Board.random(0, dictionary.length - 1)];
        //
        //     if(initialShit !== boardQueue[i - 1].phrase){
        //         break;
        //     }
        // }

        let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.push(board);
        board.draw();
    }
};

generateBoards(boardQueueSize);

// prependBoards(3);

initSwipeEvent();

