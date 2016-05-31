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

let cols = 17,
    rows = 20,
    width = getWindowSizes().width,
    height = getWindowSizes().height,

    cellWidth = width / cols,
    cellHeight = height / rows,
    fontSize = 20,//cellWidth < cellHeight ? cellWidth/2 : cellHeight/2,
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

let initEvents = () => {
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

    mc.on("swipe", function(ev) {
        var dir = ev.velocity < 0 ? 1 : -1,
            velocity = Math.abs(ev.velocity);

        time = 0;
        shift = 0;
        direction = -dir;
        // self.setPhrase(dictionary[Board.random(0, dictionary.length - 1)]);
        //loop(velocity, direction);
    });
};

let loop = (velocity, dir) => {
    //Board.context.transform(1, 0, 0, 1, canvas.width, canvas.height/2);



    // var spinNumber = 0;
    // var timer = (spinNumber, speed, nextTimer) => {
    //     var interval = setInterval(() => {
    //         if(!spinNumber){
    //             clearInterval(interval);
    //             if(nextTimer)
    //                 nextTimer();
    //             return false;
    //         }
    //
    //         for(let i = 0; i < board.colsNum; i += 1){
    //             board.cols[i].shift(step);
    //         }
    //
    //         spinNumber--;
    //     }, speed)
    // };


    // timer(120, 70);
    // timer(60, 90);
    // Board.context.drawImage(Board.context,0,0,canvas.width, canvas.height)
};

canvas.width = width;
canvas.height = height;

let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters);

console.log('board', board);

initEvents();

function easeOutBack(x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

var time,
    shift = height,
    acceleration = 10,
    direction = 1,
    hasNewPhrase = false;

console.info(height);

var interval = setInterval(() => {
    if (Math.abs(shift) <= height){
        time+=1;

        if(Math.abs(shift) >= height / 2 && !hasNewPhrase){
            // board.setPhrase();


            let newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

            while(true){
                newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

                if(newPhrase !== board.phrase){
                    break;
                }
            }

            board.setPhrase(newPhrase);

            // console.info(newPhrase + ' ' + board.phrase);

            hasNewPhrase = true;
        }

        // console.log(easeOutBack(null, time, 0, height, 1000));
        // shift += direction * bounceEaseOut(time / 1000) * 1000;
        shift = direction * easeOutBack(null, time, 0, height, 1000);
        board.shift(shift);
    }
    else if(Math.abs(shift) >= height && hasNewPhrase) {
        // console.info(shift, 'shift');
        hasNewPhrase = false;
        // clearInterval(interval);
    }
}, 50);

function animate(options) {
    board.draw();
    requestAnimationFrame(animate);
}
animate();

