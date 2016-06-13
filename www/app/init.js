'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Letter = function () {
    _createClass(Letter, [{
        key: 'x',
        get: function get() {
            return this.col.board.paddingLeft + this.col.index * this.col.board.fontSize * 0.6;
        }
    }, {
        key: 'y',
        get: function get() {
            return this.index * this.col.board.cellHeight + this.col.board.fontSize + this.col.board.paddingTop;
        }
    }, {
        key: 'punctuationX',
        get: function get() {
            return this.col.board.paddingLeft + this.col.index * this.col.board.fontSize * 0.6 + this.col.board.fontSize / 2;
        }
    }], [{
        key: 'font',
        get: function get() {
            return Letter._font;
        },
        set: function set(value) {
            Letter._font = value;
        }
    }, {
        key: 'enabledFillStyle',
        get: function get() {
            return Letter._enabledFillStyle;
        },
        set: function set(value) {
            Letter._enabledFillStyle = value;
        }
    }, {
        key: 'disabledFillStyle',
        get: function get() {
            return Letter._disabledFillStyle;
        },
        set: function set(value) {
            Letter._disabledFillStyle = value;
        }
    }]);

    function Letter(parent, index, letter, punctuation) {
        _classCallCheck(this, Letter);

        this.col = parent;
        this.index = index;
        this.name = letter || '';
        this.punctuation = punctuation || '';
        this.context = this.col.board.context;

        Letter.font = this.col.board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = '#C6C6BA';

        this.disable();
    }

    _createClass(Letter, [{
        key: 'drawSymbol',
        value: function drawSymbol() {}
    }, {
        key: 'set',
        value: function set(value) {
            this.name = value.toUpperCase();

            return this;
        }
    }, {
        key: 'setPunctuation',
        value: function setPunctuation(value) {
            this.punctuation = value;

            return this;
        }
    }, {
        key: 'enable',
        value: function enable() {
            this.drawSymbol = this._drawEnabledSymbol;

            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.drawSymbol = this._drawDisabledSymbol;

            return this;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.drawSymbol();

            if (this.punctuation) {
                this.context.fillText(this.punctuation, this.punctuationX, this.y);
            }

            return this;
        }
    }, {
        key: '_drawEnabledSymbol',
        value: function _drawEnabledSymbol() {
            this.context.font = Letter.font;
            this.context.fillStyle = Letter.enabledFillStyle;
            this.context.fillText(this.name, this.x, this.y);
        }
    }, {
        key: '_drawDisabledSymbol',
        value: function _drawDisabledSymbol() {
            this.context.font = Letter.font;
            this.context.fillStyle = Letter.disabledFillStyle;
            this.context.fillText(this.name, this.x, this.y);
        }
    }]);

    return Letter;
}();

var Column = function () {
    function Column(board, index, length) {
        _classCallCheck(this, Column);

        this.board = board;
        this.index = index;
        this.length = length;
        this.letters = [];

        for (var _index = 0; _index < this.length; _index += 1) {
            this.letters[_index] = new Letter(this, _index, Board.letters[Board.random(0, Board.letters.length - 1)].toUpperCase(), false);
        }
    }

    _createClass(Column, [{
        key: 'draw',
        value: function draw() {
            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].draw();
            }

            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].disable();
            }

            return this;
        }
    }]);

    return Column;
}();

var Board = function () {
    _createClass(Board, [{
        key: 'context',
        get: function get() {
            return Board._context;
        },
        set: function set(value) {
            Board._context = value;
        }
    }, {
        key: 'fontSize',
        get: function get() {
            return Board._fontSize;
        },
        set: function set(value) {
            Board._fontSize = value;
        }
    }, {
        key: 'cellWidth',
        get: function get() {
            return Board._cellWidth;
        },
        set: function set(value) {
            Board._cellWidth = value;
        }
    }, {
        key: 'cellHeight',
        get: function get() {
            return Board._cellHeight;
        },
        set: function set(value) {
            Board._cellHeight = value;
        }
    }, {
        key: 'phrase',
        get: function get() {
            return this._phrase;
        },
        set: function set(value) {
            this._phrase = value;
        }
    }, {
        key: 'offset',
        get: function get() {
            return this._offset;
        },
        set: function set(value) {
            this._offset = value;
        }
    }, {
        key: 'startY',
        get: function get() {
            return this._startY;
        },
        set: function set(value) {
            this._startY = value;
        }
    }, {
        key: 'paddingLeft',
        get: function get() {
            return this._paddingLeft;
        },
        set: function set(value) {
            this._paddingLeft = value;
        }
    }, {
        key: 'initPaddingTop',
        get: function get() {
            return this._initPaddingTop;
        },
        set: function set(value) {
            this._initPaddingTop = value;
        }
    }, {
        key: 'paddingTop',
        get: function get() {
            return this._paddingTop;
        },
        set: function set(value) {
            this._paddingTop = value;
        }
    }], [{
        key: 'random',
        value: function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }]);

    function Board(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, paddingTop, letters) {
        _classCallCheck(this, Board);

        this.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        this.fontSize = fontSize || 20;
        this.cellWidth = cellWidth || this.fontSize * 2;
        this.cellHeight = cellHeight || this.fontSize * 2;
        this.paddingLeft = paddingLeft;
        this.paddingTop = paddingTop;
        this.initPaddingTop = paddingTop;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        // console.info(paddingTop, 'padidngTop');

        this.cols = [];

        this.offset = 0;

        for (var index = 0; index < this.colsNum; index += 1) {
            this.cols[index] = new Column(this, index, this.rowsNum);
        }

        this.startY = this.setPhrase(this.initialShit);
    }

    _createClass(Board, [{
        key: 'clearBackground',
        value: function clearBackground() {
            this.context.clearRect(0, this.paddingTop, this.cellWidth * this.colsNum, this.cellHeight * this.rowsNum);
        }
    }, {
        key: 'rebuild',
        value: function rebuild() {
            for (var i = 0; i < this.colsNum; i += 1) {
                for (var j = 0; j < this.rowsNum; j += 1) {
                    this.cols[i].letters[j].set(Board.letters[Board.random(0, Board.letters.length - 1)].toUpperCase());
                    this.cols[i].letters[j].setPunctuation('');
                }
            }

            return this;
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.clearBackground();

            for (var index = 0; index < this.colsNum; index += 1) {

                this.cols[index].draw();
            }

            // this.drawGradient();

            return this;
        }
    }, {
        key: 'drawGradient',
        value: function drawGradient() {
            var grd;

            grd = this.context.createLinearGradient(0, 0, 0, this.cellHeight * this.rowsNum / 4);
            grd.addColorStop(0, 'rgba(250, 249, 231, 0.9)');
            grd.addColorStop(0.7, 'rgba(250, 249, 231, 0.5)');
            grd.addColorStop(1, 'rgba(250, 249, 231 ,0)');

            this.context.fillStyle = grd;
            this.context.fillRect(0, 0, this.cellWidth * this.colsNum, this.cellHeight * this.rowsNum / 4);

            grd = this.context.createLinearGradient(0, this.cellHeight * (this.rowsNum - this.rowsNum / 4), 0, this.cellHeight * (this.rowsNum - this.rowsNum / 4) + this.cellHeight * this.rowsNum / 4);

            grd.addColorStop(0, 'rgba(250, 249, 231 ,0)');
            grd.addColorStop(0.3, 'rgba(250, 249, 231, 0.5)');
            grd.addColorStop(1, 'rgba(250, 249, 231, 0.9)');

            this.context.fillStyle = grd;
            this.context.fillRect(0, this.cellHeight * (this.rowsNum - this.rowsNum / 4), this.cellWidth * this.colsNum, this.cellHeight * this.rowsNum / 4);
        }
    }, {
        key: 'enablePhrase',
        value: function enablePhrase() {
            var paragraph = this.buildParagraph();

            for (var y = this.startY, i = 0; y < this.startY + paragraph.length; y += 1, i += 1) {
                var startX = Math.ceil(this.colsNum / 2) - Math.ceil(paragraph[i].length / 2);

                for (var x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1) {
                    this.cols[x].letters[y].enable();
                }
            }

            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            for (var index = 0; index < this.colsNum; index += 1) {
                this.cols[index].disable();
            }

            return this;
        }
    }, {
        key: 'buildParagraph',
        value: function buildParagraph() {
            var phrase = this.phrase;

            phrase = phrase.replace(/,\s/gi, ",");
            phrase = phrase.replace(/\.\s/gi, ".");

            /*
             Replace this part
             */
            var parts = phrase.split(' ');

            var rows = [];
            for (var i = 0, j = 0; i < parts.length; i += 1) {
                if (!rows[j]) {
                    rows[j] = '';
                }

                if ((rows[j] + parts[i]).length < this.colsNum) {
                    rows[j] += parts[i] + ' ';
                } else {
                    rows[j] = rows[j].trim();
                    j += 1;

                    rows[j] = parts[i] + ' ';
                }
            }

            for (var _i = 0; _i < rows.length; _i += 1) {
                rows[_i] = rows[_i].trim();
            }
            /*
             End replace
             */

            // console.info(rows, 'rows');

            return rows;
        }
    }, {
        key: 'setPhrase',
        value: function setPhrase(phrase) {
            this.phrase = phrase;

            this.rebuild().disable();

            var paragraph = this.buildParagraph();

            var startY = Math.ceil((this.rowsNum - paragraph.length) / 2);

            this.offset = startY;

            for (var y = startY, i = 0; y < startY + paragraph.length; y += 1, i += 1) {
                var startX = Math.ceil(this.colsNum / 2) - Math.ceil(paragraph[i].length / 2);

                for (var x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1) {
                    if (paragraph[i][j] === ',' || paragraph[i][j] === '.') {
                        this.cols[x].letters[y].set('');

                        continue;
                    }

                    if (paragraph[i][j + 1] === ',') {
                        this.cols[x].letters[y].setPunctuation(',');
                    }

                    if (paragraph[i][j + 1] === '.') {
                        this.cols[x].letters[y].setPunctuation('.');
                    }

                    this.cols[x].letters[y].set(paragraph[i][j]).enable();
                }
            }

            return startY;
        }
    }, {
        key: 'shift',
        value: function shift(step) {
            for (var i = 0; i < this.colsNum; i += 1) {
                this.cols[i].shift(step);
            }

            return this;
        }
    }]);

    return Board;
}();

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();

(function () {

    if ("performance" in window == false) {
        window.performance = {};
    }

    Date.now = Date.now || function () {
        // thanks IE8
        return new Date().getTime();
    };

    if ("now" in window.performance == false) {

        var nowOffset = Date.now();

        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart;
        }

        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }
})();

var getWindowSizes = function getWindowSizes() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return {
        width: x,
        height: y
    };
};

var cols = 27;
var rows = 20;
var width = getWindowSizes().width;
var height = getWindowSizes().height;
var cellWidth = width / cols;
var cellHeight = height / rows;
var fontSize = 18;
var drawingAreaWidth = cols * fontSize * 0.6;
var paddingLeft = (width - drawingAreaWidth) / 2;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';
var dictionary = ['Неважно, кто мы такие, важно то, какой у нас план', 'Я сам творю свою удачу', 'Не проблемы должны толкать вас в спину, а вперед вести мечты', 'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности', 'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь', 'Нельзя казнить помиловать'];
var initialShit = dictionary[Board.random(0, dictionary.length - 1)];
var boardElm = document.getElementById('canvas');
var hammertime = new Hammer(boardElm, {});
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
hammertime.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

var mc = new Hammer.Manager(boardElm);

mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL }));
mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_VERTICAL })).recognizeWith(mc.get('pan'));

var initSwipeEvent = function initSwipeEvent() {
    mc.on("swipe", swipeEventHandler);
    mc.on("pan", panEventHendler);
};

var removeSwipeEvent = function removeSwipeEvent() {
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

var boardQueue = [];
var boardQueueSize = 10;
var animationDuration = 1000;

canvas.width = width;
canvas.height = height;

var EasingFunctions = {
    b: function b(t) {
        return t <= .5 ? t : 1 - t;
    },
    // no easing, no acceleration
    linear: function linear(t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function easeInQuad(t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function easeOutQuad(t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function easeInCubic(t) {
        return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function easeOutCubic(t) {
        return --t * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function easeInQuart(t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function easeOutQuart(t) {
        return 1 - --t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function easeInQuint(t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function easeOutQuint(t) {
        return 1 + --t * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
};

var swipeEventHandler = function swipeEventHandler(ev) {
    var dir = ev.velocity < 0,
        velocity = Math.abs(ev.velocity);

    // ev.velocity = 0.5;

    var boardSpinNumber = Math.round(velocity);

    // console.info(dir == true);

    console.info(ev.velocity, dir);

    if (boardSpinNumber) {
        animate({
            duration: animationDuration,
            timing: EasingFunctions.easeInOutQuint,
            draw: function draw(progress) {
                removeSwipeEvent();

                for (var i = 0; i <= boardQueueSize * 2; i += 1) {
                    if (dir) {
                        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop - boardSpinNumber * height * progress;
                    } else {
                        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop + boardSpinNumber * height * progress;
                    }
                }

                for (var _i2 = 0; _i2 <= boardQueueSize * 2; _i2 += 1) {
                    boardQueue[_i2].draw();
                }

                if (progress >= 1) {
                    for (var _i3 = 0; _i3 <= boardQueueSize * 2; _i3 += 1) {
                        boardQueue[_i3].initPaddingTop = boardQueue[_i3].paddingTop;
                    }

                    if (dir) {
                        appendBoards(boardSpinNumber);
                        // console.info(boardQueue, 'append');
                    } else {
                            prependBoards(boardSpinNumber);
                            // console.info(boardQueue, 'prepend');
                        }

                    // generateBoards(boardSpinNumber);
                    initSwipeEvent();
                }

                boardQueue[boardQueueSize].drawGradient();
            }
        });
    } else {}
};

var panEventHendler = function panEventHendler(ev) {
    // console.log(ev);

    for (var i = 0; i <= boardQueueSize * 2; i += 1) {
        boardQueue[i].paddingTop = boardQueue[i].initPaddingTop + ev.deltaY;
    }

    for (var _i4 = 0; _i4 <= boardQueueSize * 2; _i4 += 1) {
        boardQueue[_i4].draw();
    }

    var absoluteDistance = Math.abs(ev.deltaY / height);

    // console.info(absoluteDistance, 'absoluteDistance');

    boardQueue[boardQueueSize].drawGradient();

    if (ev.isFinal) {
        // console.info(ev.isFinal);
        animate({
            duration: animationDuration,
            timing: EasingFunctions.easeInOutQuint,
            draw: function draw(progress) {
                removeSwipeEvent();

                for (var _i5 = 0; _i5 <= boardQueueSize * 2; _i5 += 1) {
                    boardQueue[_i5].paddingTop = boardQueue[_i5].initPaddingTop + ev.deltaY - ev.deltaY * progress;
                }

                for (var _i6 = 0; _i6 <= boardQueueSize * 2; _i6 += 1) {
                    boardQueue[_i6].draw();
                }

                if (progress >= 1) {
                    for (var _i7 = 0; _i7 <= boardQueueSize * 2; _i7 += 1) {
                        boardQueue[_i7].initPaddingTop = boardQueue[_i7].paddingTop;
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

var generateBoards = function generateBoards() {
    for (var i = 0, j = -boardQueueSize; i <= boardQueueSize * 2; i++, j++) {
        if (i) {
            initialShit = dictionary[Board.random(0, dictionary.length - 1)];

            while (true) {
                initialShit = dictionary[Board.random(0, dictionary.length - 1)];

                if (initialShit !== boardQueue[i - 1].phrase) {
                    break;
                }
            }
        }

        // console.info(j, cellHeight, rows, 'generateBoard');

        var board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.push(board);
        board.draw();

        if (i === boardQueueSize) {
            boardQueue[boardQueueSize].drawGradient();
        }
    }
};

var prependBoards = function prependBoards(number) {
    for (var i = 0; i < number; i += 1) {
        boardQueue.pop();
    }

    for (var _i8 = number; _i8 > 0; _i8 -= 1) {
        var j = -boardQueueSize + _i8 - 1;

        initialShit = dictionary[Board.random(0, dictionary.length - 1)];

        // while(true){
        //     initialShit = dictionary[Board.random(0, dictionary.length - 1)];
        //
        //     if(initialShit !== boardQueue[i + 1].phrase){
        //         break;
        //     }
        // }

        // console.info(j, cellHeight, rows, 'prepend');

        var board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.unshift(board);
        board.draw();
    }
};

var appendBoards = function appendBoards(number) {
    for (var i = 0; i < number; i += 1) {
        boardQueue.shift();
    }

    for (var _i9 = number; _i9 > 0; _i9 -= 1) {
        var j = boardQueueSize - _i9 + 1;

        initialShit = dictionary[Board.random(0, dictionary.length - 1)];

        // while(true){
        //     initialShit = dictionary[Board.random(0, dictionary.length - 1)];
        //
        //     if(initialShit !== boardQueue[i - 1].phrase){
        //         break;
        //     }
        // }

        var board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, j * cellHeight * rows, letters);
        boardQueue.push(board);
        board.draw();
    }
};

generateBoards(boardQueueSize);

// prependBoards(3);

initSwipeEvent();