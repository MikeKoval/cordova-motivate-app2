import {Board} from './board';

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

let cols = 25,
    rows = 30,
    width = getWindowSizes().width,
    height = getWindowSizes().height,

    cellWidth = width / cols,
    cellHeight = height / rows,
    fontSize = 22,//cellWidth < cellHeight ? cellWidth/2 : cellHeight/2,
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
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL }),
        self = board;

    var mc = new Hammer.Manager(boardElm, {
        recognizers: [
            // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
            [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL }],
        ]
    });

    mc.on("swipe", function(ev) {
        var direction = ev.velocity < 0 ? 1 : -1,
            velocity = Math.abs(ev.velocity);
        console.log('velocity', velocity);
        console.log('direction', direction);

        self.setPhrase(dictionary[Board.random(0, dictionary.length - 1)]);
        loop(velocity, direction);
    });
};

let loop = (velocity, direction) => {
    //Board.context.transform(1, 0, 0, 1, canvas.width, canvas.height/2);
    //
    let step = direction === 'up' ? 1 : -1;

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

let board = new Board(ctx, 'SWIPE', cols, rows, fontSize, cellWidth, cellHeight, letters);

console.log('board', board);

board.draw();
initEvents();

function bounce(timeFraction) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}

function animate(options) {
    var start = performance.now();

    var time;

    var interval = setInterval(() => {
        if(options.acceleration > 1){
            time++;
            options.acceleration -= 0.05;
        }
        else{
            clearInterval(interval);
        }
    }, 10);

    requestAnimationFrame(function anim(time) {
        var timeFraction = (time - start) / options.duration;
        start = performance.now();
        if (timeFraction < 0) timeFraction = 0.5;

        console.log(Math.ceil(options.acceleration));

        board.shift(- Math.ceil(options.acceleration));

        if(options.acceleration > 2){
            requestAnimationFrame(anim);
        }
        else if(board.offset != board.startY) {
            requestAnimationFrame(anim);
        }

    });
}

animate({
    duration: 100,
    acceleration: 5
});
