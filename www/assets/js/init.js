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
    
    setInterval(function(){
        for(let i = 0; i < board.colsNum; i += 1){
            board.cols[i].shift(step);
        }
    }, 50);


    // Board.context.drawImage(Board.context,0,0,canvas.width, canvas.height)
};

canvas.width = width;
canvas.height = height;

let board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters);

console.log('board', board);

board.draw();
initEvents();

