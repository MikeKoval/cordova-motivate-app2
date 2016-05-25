var matrix = [],
    cols = 25,
    rows = 20,i,j,
    letters = [
        'a', 'б', 'в', 'г', 'д',
        'е', 'е', 'ж', 'з', 'и',
        'й', 'к', 'л', 'м', 'н',
        'о', 'п', 'р', 'с', 'т',
        'у', 'ф', 'х', 'ц', 'ч',
        'ш', 'щ', 'ї', 'ы', 'ь',
        'е', 'ю', 'я'
    ], lettersLen = letters.length;

var shitHeap = [
    'Неважно, кто мы такие, важно то, какой у нас план.',
    'Я сам творю свою удачу!',
    'Не проблемы должны толкать вас в спину, а вперед вести мечты.',
    'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности.',
    'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь…'
], shitLength = shitHeap.length, initialShit = shitHeap[Math.floor(Math.random() * shitLength)],
    board = new Board();

console.log('board', board);

function Board(cols, rows) {
    this.colsNum = cols || 25;
    this.rowsNum = rows || 20;
    this.rows = [];
    var index;

    for(index=0;index<this.rowsNum;index++){
        this.rows[index] = new Row(this.colsNum);
    }
}

Board.prototype.rebuild = function(letters, shit) {
    var i, j;

    for (i = 0; i < board.rowsNum; i++) {
        for (j = 0; j < board.colsNum; j++) {
            board.rows[i].letters[j].set(letters[Math.floor(Math.random() * lettersLen)].toUpperCase());
        }
    }
    console.log(shit);
}


function Row(length) {
    this.length = length || 25,
    this.letters = [];
    var index;
    for(index=0;index<this.length;index++) {
        this.letters[index] = new Letter(this, letters[Math.floor(Math.random() * lettersLen)].toUpperCase());
    }
}

function Letter(parent, letter) {
    this.name = letter || '';
    this.row = parent;
}

Letter.prototype.set = function(letter) {
    this.name = letter;
}

Letter.prototype.draw = function() {
    // draw
}

Board.rebuild(letters, initialShit);

