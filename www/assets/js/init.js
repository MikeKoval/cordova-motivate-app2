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

var mc = new Hammer.Manager(boardElm, {
    recognizers: [
        [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL }]
    ]
});

let initSwipeEvent = () => {
    mc.on("swipe", swipeEventHandler);
};

let removeSwipeEvent = () => {
    mc.off("swipe");
};

function animate(options) {

    var start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction от 0 до 1
        var timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;

        // текущее состояние анимации
        var progress = options.timing(timeFraction);

        options.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

let swipeEventHandler = function(ev) {
    var dir = ev.velocity < 0 ? 1 : -1,
        velocity = Math.abs(ev.velocity);

    console.info(velocity, 'velocity');
    
    let boardSpinNumber = Math.round(velocity);

    console.log(boardSpinNumber);

    animate({
        duration: 2000,
        timing: function(timeFraction) {
            return timeFraction;
        },
        draw: function(progress) {
            removeSwipeEvent();

            for(let i = 0; i < boardQueueSize; i += 1){
                boardQueue[i].paddingTop = boardQueue[i].initPaddingTop - boardSpinNumber * height * progress;
            }

            for(let i = 0; i < boardQueueSize; i += 1){
                boardQueue[i].draw();
            }

            // console.log(progress);

            if(progress === 1){
                for(let i = 0; i < boardQueueSize; i += 1){
                    boardQueue[i].initPaddingTop = boardQueue[i].paddingTop;
                }

                generateBoards(boardSpinNumber);
                initSwipeEvent();
            }
        }
    });
};

let generateBoards = (boardNumber) => {
    for(let i = 0; i < boardNumber; i += 1){
        boardQueue.shift();
    }

    for(let i = boardQueueSize - boardNumber; i < boardQueueSize; i += 1){
        console.log(boardQueueSize);
        if(i){
            initialShit = dictionary[Board.random(0, dictionary.length - 1)];

            while(true){
                initialShit = dictionary[Board.random(0, dictionary.length - 1)];

                if(initialShit !== boardQueue[i - 1].phrase){
                    break;
                }
            }
        }

        let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, i * cellHeight * rows, letters);
        boardQueue.push(board);

        board.draw();
    }
};

let boardQueue = [];
let boardQueueSize = 10;

canvas.width = width;
canvas.height = height;

generateBoards(boardQueueSize);

initSwipeEvent();

