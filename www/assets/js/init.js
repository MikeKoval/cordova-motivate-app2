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
    canvas = document.getElementById("example"),
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

var boardElm = document.getElementById('example'),
    hammertime = new Hammer(boardElm, {});
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
let self = board;

var mc = new Hammer.Manager(boardElm, {
    recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL }],
    ]
});

function bounce(timeFraction) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
        }
    }
}

// преобразователь в easeOut
function makeEaseOut(timing) {
    return function(timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}

var bounceEaseOut = makeEaseOut(bounce);

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

    // console.log(bounceEaseOut);

    animate({
        duration: 1000,
        timing: bounceEaseOut,
        draw: function(progress) {
            mc.off('swipe');

            boardQueue[0].paddingTop = - height * progress;
            boardQueue[1].paddingTop = height - height * progress;
            boardQueue[0].draw();
            boardQueue[1].draw();

            console.log(progress);

            if(progress === 1){
                generateNewBoard();
                initEvents();
            }
        }
    });
};

function generateNewBoard(){
    // board1 = board2;
    let board1 = boardQueue.shift();

    let newPhrase;
    while(true){
        newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

        if(newPhrase !== board1.phrase){
            break;
        }
    }

    let board2 = new Board(ctx, newPhrase, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, cellHeight*rows, letters);

    boardQueue.push(board2);

    board2.draw();

    console.log(boardQueue);
}

let initEvents = () => {
    mc.on("swipe", swipeEventHandler);
};

canvas.width = width;
canvas.height = height * 2;

let boardQueue = [];

let board1 = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, 0, letters);
boardQueue.push(board1);

let newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

while(true){
    newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

    if(newPhrase !== board1.phrase){
        break;
    }
}

// board.setPhrase(newPhrase);

let board2 = new Board(ctx, newPhrase, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, cellHeight*rows, letters);
boardQueue.push(board2);

board1.draw();
board2.draw();

// board2.draw();
initEvents();

