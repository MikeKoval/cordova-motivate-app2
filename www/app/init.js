'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Letter = function () {
    _createClass(Letter, null, [{
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

        Letter.font = Board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = 'rgba(0,0,0,0.2)';

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
        value: function draw(y) {

            Board.context.fillStyle = 'rgb(238,232,170)';
            Board.context.fillRect(Board.cellWidth * this.col.index, y, Board.cellWidth, Board.cellHeight);

            this.drawSymbol(y);

            if (this.punctuation) {
                Board.context.fillText(this.punctuation, this.col.index * Board.cellWidth + Board.cellWidth / 2, this.index * Board.cellHeight + Board.fontSize);
            }

            return this;
        }
    }, {
        key: '_drawEnabledSymbol',
        value: function _drawEnabledSymbol(y) {
            Board.context.font = Letter.font;
            Board.context.fillStyle = Letter.enabledFillStyle;
            Board.context.fillText(this.name, this.col.index * Board.cellWidth, y + Board.fontSize);
        }
    }, {
        key: '_drawDisabledSymbol',
        value: function _drawDisabledSymbol(y) {
            Board.context.font = Letter.font;
            Board.context.fillStyle = Letter.disabledFillStyle;
            Board.context.fillText(this.name, this.col.index * Board.cellWidth, y + Board.fontSize);
        }
    }]);

    return Letter;
}();

var Column = function () {
    function Column(index, length) {
        _classCallCheck(this, Column);

        this._shift = 0;
        this.index = index;
        this.length = length || 25;
        this.letters = [];

        for (var _index = 0; _index < this.length; _index += 1) {
            this.letters[_index] = new Letter(this, _index, Board.letters[Board.random(0, Board.letters.length - 1)].toUpperCase(), false);
        }
    }

    _createClass(Column, [{
        key: 'draw',
        value: function draw() {
            var y = this._shift,
                height = this.length * Board.cellHeight;

            if (y < 0) {
                y += height;
            }
            if (y > height) {
                y %= height;
            }

            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].draw(y - height);
                this.letters[index].draw(y);
                y += Board.cellHeight;
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
    }, {
        key: 'shift',
        value: function shift(value) {
            this._shift = value;
        }
    }]);

    return Column;
}();

var Board = function () {
    _createClass(Board, [{
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
    }], [{
        key: 'random',
        value: function random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }, {
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
    }]);

    function Board(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters) {
        _classCallCheck(this, Board);

        Board.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        Board.fontSize = fontSize || 20;
        Board.cellWidth = cellWidth || Board.fontSize * 2;
        Board.cellHeight = cellHeight || Board.fontSize * 2;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        this.cols = [];

        this.offset = 0;

        for (var index = 0; index < this.colsNum; index += 1) {
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.startY = this.setPhrase(this.initialShit);
    }

    _createClass(Board, [{
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
            for (var index = 0; index < this.colsNum; index += 1) {
                this.cols[index].draw();
            }

            return this;
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

            console.info(rows, 'rows');

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
            //step = step % this.rowsNum;

            for (var i = 0; i < this.colsNum; i += 1) {
                this.cols[i].shift(step);
            }
            /*
                    this.offset = (this.offset - step) % this.rowsNum;
            
                    if(this.offset < 0){
                        this.offset = this.rowsNum + this.offset;
                    }
            
                    if(this.offset >= this.rowsNum){
                        this.offset = this.rowsNum - this.offset;
                    }*/
            return this;
        }
    }]);

    return Board;
}();

alert(1);

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

var cols = 17;
var rows = 20;
var width = getWindowSizes().width;
var height = getWindowSizes().height;
var cellWidth = width / cols;
var cellHeight = height / rows;
var fontSize = 20;
var canvas = document.getElementById("example");
var ctx = canvas.getContext('2d');
var letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';
var dictionary = ['Неважно, кто мы такие, важно то, какой у нас план', 'Я сам творю свою удачу', 'Не проблемы должны толкать вас в спину, а вперед вести мечты', 'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности', 'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь', 'Нельзя казнить помиловать'];
var initialShit = dictionary[Board.random(0, dictionary.length - 1)];
var initEvents = function initEvents() {
    var boardElm = document.getElementById('example'),
        hammertime = new Hammer(boardElm, {});
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL }), self = board;

    var mc = new Hammer.Manager(boardElm, {
        recognizers: [
        // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]]
    });

    mc.on("swipe", function (ev) {
        var dir = ev.velocity < 0 ? 1 : -1,
            velocity = Math.abs(ev.velocity);

        time = 0;
        shift = 0;
        direction = -dir;
        // self.setPhrase(dictionary[Board.random(0, dictionary.length - 1)]);
        //loop(velocity, direction);
    });
};

canvas.width = width;
canvas.height = height;

alert(requestAnimationFrame);

var board = new Board(ctx, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters);

console.log('board', board);

alert(2);

initEvents();

function easeOutBack(x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

var time;
var shift = height;
var direction = 1;
var hasNewPhrase = false;
console.info(height);

var interval = setInterval(function () {
    if (Math.abs(shift) <= height) {
        time += 10;

        if (Math.abs(shift) >= height / 2 && !hasNewPhrase) {
            // board.setPhrase();

            var newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

            while (true) {
                newPhrase = dictionary[Board.random(0, dictionary.length - 1)];

                if (newPhrase !== board.phrase) {
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
    } else if (Math.abs(shift) >= height && hasNewPhrase) {
        // console.info(shift, 'shift');
        hasNewPhrase = false;
        // clearInterval(interval);
    }
}, 10);

function animate(options) {
    board.draw();
    requestAnimationFrame(animate);
}
animate();