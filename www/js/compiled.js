'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getWindowSizes() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { width: x, height: y };
}

var cols = 25,
    rows = 30,
    width = getWindowSizes().width,
    height = getWindowSizes().height,
    cellWidth = width / cols,
    cellHeight = height / rows,
    fontSiz = cellWidth < cellHeight ? cellWidth / 2 : cellHeight / 2,
    canvas = document.getElementById("example"),
    ctx = canvas.getContext('2d'),
    letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя',
    shitHeap = ['Неважно, кто мы такие, важно то, какой у нас план', 'Я сам творю свою удачу', 'Не проблемы должны толкать вас в спину, а вперед вести мечты', 'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности', 'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь', 'Нельзя казнить помиловать'],
    initialShit = shitHeap[random(0, shitHeap.length - 1)];

canvas.width = width;
canvas.height = height;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Board = function () {
    _createClass(Board, [{
        key: 'phrase',
        get: function get() {
            return this._phrase;
        },
        set: function set(value) {
            this._phrase = value;
        }
    }], [{
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

        for (var index = 0; index < this.colsNum; index += 1) {
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.erase();

        this.setPhrase(this.initialShit);

        this.initEvents();
    }

    _createClass(Board, [{
        key: 'rebuild',
        value: function rebuild() {
            for (var i = 0; i < this.colsNum; i += 1) {
                for (var j = 0; j < this.rowsNum; j += 1) {
                    this.cols[i].letters[j].set(Board.letters[random(0, Board.letters.length - 1)].toUpperCase());
                    this.cols[i].letters[j].setPunctuation('');
                }
            }

            return this;
        }
    }, {
        key: 'draw',
        value: function draw() {
            for (var index = 0; index < this.colsNum; index += 1) {
                this.cols[index].erase().draw();
            }

            return this;
        }
    }, {
        key: 'erase',
        value: function erase() {
            for (var index = 0; index < this.colsNum; index += 1) {
                this.cols[index].erase();
            }

            return this;
        }
    }, {
        key: 'enable',
        value: function enable() {
            for (var index = 0; index < this.colsNum; index += 1) {
                this.cols[index].enable();
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
        key: 'setPhrase',
        value: function setPhrase(phrase) {
            this.phrase = phrase;

            this.rebuild().disable().draw();

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

            var paragraph = rows;

            var startY = Math.ceil((this.rowsNum - paragraph.length) / 2);

            for (var y = startY, _i2 = 0; y < startY + paragraph.length; y += 1, _i2 += 1) {
                var startX = Math.ceil(this.colsNum / 2) - Math.ceil(paragraph[_i2].length / 2);

                for (var x = startX, _j = 0; x < startX + paragraph[_i2].length; x += 1, _j += 1) {
                    if (paragraph[_i2][_j] === ',' || paragraph[_i2][_j] === '.') {
                        this.cols[x].letters[y].set('').erase().draw();

                        continue;
                    }

                    if (paragraph[_i2][_j + 1] === ',') {
                        this.cols[x].letters[y].setPunctuation(',');
                    }

                    if (paragraph[_i2][_j + 1] === '.') {
                        this.cols[x].letters[y].setPunctuation('.');
                    }

                    this.cols[x].letters[y].set(paragraph[_i2][_j]).erase().enable().draw();
                }
            }
        }
    }, {
        key: 'initEvents',
        value: function initEvents() {
            var boardElm = document.getElementById('example'),
                hammertime = new Hammer(boardElm, {});
            hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL }), self = this;

            var mc = new Hammer.Manager(boardElm, {
                recognizers: [
                // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
                [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }]]
            });

            mc.on("swipe", function (ev) {
                var direction = ev.velocity < 0 ? 1 : -1,
                    velocity = Math.abs(ev.velocity);
                console.log('velocity', velocity);
                console.log('direction', direction);

                self.setPhrase(shitHeap[random(0, shitHeap.length - 1)]);
                self.loop(velocity, direction);
            });
        }
    }, {
        key: 'loop',
        value: function loop(velocity, direction) {
            //Board.context.transform(1, 0, 0, 1, canvas.width, canvas.height/2);
            //
            var step = direction === 'up' ? 1 : -1;

            var _loop = function _loop(i) {
                setInterval(function () {
                    board.cols[i].shift(step);
                }, random(10, 20));
            };

            for (var i = 0; i < board.colsNum; i += 1) {
                _loop(i);
            }

            // Board.context.drawImage(Board.context,0,0,canvas.width, canvas.height)
        }
    }]);

    return Board;
}();

var Column = function () {
    function Column(index, length) {
        _classCallCheck(this, Column);

        this.index = index;
        this.length = length || 25;
        this.letters = [];

        for (var _index = 0; _index < this.length; _index += 1) {
            this.letters[_index] = new Letter(this, _index, Board.letters[random(0, Board.letters.length - 1)].toUpperCase(), false);
        }
    }

    _createClass(Column, [{
        key: 'draw',
        value: function draw() {
            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].erase().draw();
            }

            return this;
        }
    }, {
        key: 'erase',
        value: function erase() {
            Board.context.fillStyle = 'rgb(238,232,170)';
            Board.context.fillRect(Board.cellWidth * this.index, 0, Board.cellWidth, Board.cellHeight * this.length);

            return this;
        }
    }, {
        key: 'enable',
        value: function enable() {
            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].erase().enable().draw();
            }

            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].erase().disable().draw();
            }

            return this;
        }
    }, {
        key: 'shift',
        value: function shift(count) {
            this.letters = this.letters.slice(count).concat(this.letters.slice(0, count));

            for (var index = 0; index < this.length; index += 1) {
                this.letters[index].index = index;
            }

            this.erase().draw();

            return this;
        }
    }]);

    return Column;
}();

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
        value: function draw() {
            this.drawSymbol();

            if (this.punctuation) {
                Board.context.fillText(this.punctuation, this.col.index * Board.cellWidth + Board.cellWidth / 2, this.index * Board.cellHeight + Board.fontSize);
            }

            return this;
        }
    }, {
        key: '_drawEnabledSymbol',
        value: function _drawEnabledSymbol() {
            Board.context.font = Letter.font;
            Board.context.fillStyle = Letter.enabledFillStyle;
            Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index * Board.cellHeight + Board.fontSize);
        }
    }, {
        key: '_drawDisabledSymbol',
        value: function _drawDisabledSymbol() {
            Board.context.font = Letter.font;
            Board.context.fillStyle = Letter.disabledFillStyle;
            Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index * Board.cellHeight + Board.fontSize);
        }
    }, {
        key: 'erase',
        value: function erase() {
            Board.context.fillStyle = 'rgb(238,232,170)';
            Board.context.fillRect(Board.cellWidth * this.col.index, Board.cellHeight * this.index, Board.cellWidth, Board.cellHeight);

            return this;
        }
    }]);

    return Letter;
}();

var board = new Board(ctx, initialShit, cols, rows, fontSiz, cellWidth, cellHeight, letters);

console.log('board', board);

// board.draw();
