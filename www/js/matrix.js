let cols = 25,
    rows = 30,
    fontSiz = 20,
    cellWidth = window.innerWidth/rows,
    cellHeight = window.innerHeight/cols,
    canvas = document.getElementById("example"),
    ctx = canvas.getContext('2d'),
    letters = 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя',
    shitHeap = [
    'Неважно, кто мы такие, важно то, какой у нас план',
    'Я сам творю свою удачу',
    'Не проблемы должны толкать вас в спину, а вперед вести мечты',
    'Пессимист видит трудность в любой возможности; оптимист – видит возможность в любой трудности',
    'Мы — рабы своих привычек. Измени свои привычки, и изменится твоя жизнь',
    'Нельзя казнить помиловать'
    ],
    initialShit = shitHeap[random(0, shitHeap.length - 1)];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class Board {
    static get context() {
        return Board._context;
    }
    static set context(value) {
        Board._context = value;
    }

    static get fontSize() {
        return Board._fontSize;
    }

    static set fontSize(value) {
        Board._fontSize = value;
    }

    static get cellWidth() {
        return Board._cellWidth;
    }
    static set cellWidth(value) {
        Board._cellWidth = value;
    }

    static get cellHeight() {
        return Board._cellHeight;
    }
    static set cellHeight(value) {
        Board._cellHeight = value;
    }

    constructor(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters) {
        Board.context = context;

        this.initialShit = initialShit || 'ELIFTECH';
        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        Board.fontSize = fontSize || 20;
        Board.cellWidth = cellWidth || Board.fontSize*2;
        Board.cellHeight = cellHeight || Board.fontSize*2;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        this.cols = [];

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.erase();

        this.setPhrase(this.initialShit);
    }

    rebuild() {
        for (let i = 0; i < this.colsNum; i += 1) {
            for (let j = 0; j < this.rowsNum; j += 1) {
                this.cols[i].letters[j].set(Board.letters[random(0, Board.letters.length - 1)].toUpperCase());
            }
        }

        return this;
    }

    draw() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index].erase().draw();
        }

        return this;
    }

    erase() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index].erase();
        }

        return this;
    }

    enable() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index]
                .enable();
        }

        return this;
    }

    disable() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index]
                .disable();
        }

        return this;
    }

    setPhrase(phrase) {
        this
            .rebuild()
            .disable()
            .draw();


        phrase = phrase.replace(/,\s/gi, ",");
        phrase = phrase.replace(/\.\s/gi, ".");

        /*
        Replace this part
         */
        let parts = phrase.split(' ');

        let rows = [];
        for(let i = 0, j = 0; i < parts.length; i += 1){
            if(!rows[j]){
                rows[j] = '';
            }

            if((rows[j] + parts[i]).length < this.colsNum){
                rows[j] += parts[i] + ' ';
            }
            else{
                rows[j] = rows[j].trim();
                j += 1;

                rows[j] = parts[i] + ' ';
            }
        }

        for(let i = 0; i < rows.length; i += 1){
            rows[i] = rows[i].trim();
        }
        /*
         End replace
         */

        console.info(rows, 'rows');

        let paragraph = rows;

        let startY = Math.ceil(this.rowsNum/2) - Math.ceil(paragraph.length/2);

        for (let y = startY, i = 0; y < startY + paragraph.length; y += 1, i += 1) {
            let startX = Math.ceil(this.colsNum/2) - Math.ceil(paragraph[i].length/2);

            for(let x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1){
                if(paragraph[i][j] === ',' || paragraph[i][j] === '.'){
                    this.cols[x].letters[y]
                        .set('')
                        .erase()
                        .draw();

                    continue;
                }

                if(paragraph[i][j+1] === ','){
                    this.cols[x].letters[y].setPunctuation(',');
                }

                if(paragraph[i][j+1] === '.'){
                    this.cols[x].letters[y].setPunctuation('.');
                }

                this.cols[x].letters[y]
                    .set(paragraph[i][j])
                    .erase()
                    .enable()
                    .draw();
            }
        }
    }
}

class Column {
    constructor(index, length){
        this.index = index;
        this.length = length || 25;
        this.letters = [];

        for(let index = 0; index < this.length; index += 1) {
            this.letters[index] = new Letter(
                this,
                index,
                Board.letters[random(0, Board.letters.length - 1)].toUpperCase(),
                false
            );
        }
    }

    draw() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index].erase().draw();
        }

        return this;
    }

    erase() {
        Board.context.fillStyle = 'rgb(238,232,170)';
        Board.context.fillRect(Board.cellWidth*this.index, 0, Board.cellWidth, Board.cellHeight*this.length);

        return this;
    }

    enable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index]
                .erase()
                .enable()
                .draw();
        }

        return this;
    }

    disable() {
        for(let index = 0; index < this.length; index += 1) {
            this.letters[index]
                .erase()
                .disable()
                .draw();
        }

        return this;
    }
}

class Letter{
    static get font(){
        return Letter._font;
    }
    static set font(value){
        Letter._font = value;
    }

    static get enabledFillStyle(){
        return Letter._enabledFillStyle;
    }
    static set enabledFillStyle(value){
        Letter._enabledFillStyle = value;
    }

    static get disabledFillStyle(){
        return Letter._disabledFillStyle;
    }
    static set disabledFillStyle(value){
        Letter._disabledFillStyle = value;
    }

    constructor(parent, index, letter, punctuation){
        this.col = parent;
        this.index = index;
        this.name = letter || '';
        this.punctuation = punctuation || false;

        Letter.font = Board.fontSize + "px monospace";
        Letter.enabledFillStyle = '#000';
        Letter.disabledFillStyle = 'rgba(0,0,0,0.2)';

        this.disable();
    }

    drawSymbol(){

    }

    set(value) {
        this.name = value.toUpperCase();

        return this;
    }

    setPunctuation(value){
        this.punctuation = value;

        return this;
    }

    enable(){
        this.drawSymbol = this._drawEnabledSymbol;

        return this;
    }

    disable() {
        this.drawSymbol = this._drawDisabledSymbol;

        return this;
    }

    draw() {
        this.drawSymbol();

        if(this.punctuation){
            Board.context.fillText(this.punctuation, this.col.index * Board.cellWidth + Board.cellWidth/2, this.index*Board.cellHeight + Board.fontSize);
        }

        return this;
    }

    _drawEnabledSymbol() {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.enabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index*Board.cellHeight + Board.fontSize);
    }

    _drawDisabledSymbol() {
        Board.context.font = Letter.font;
        Board.context.fillStyle = Letter.disabledFillStyle;
        Board.context.fillText(this.name, this.col.index * Board.cellWidth, this.index*Board.cellHeight + Board.fontSize);
    }

    erase() {
        Board.context.fillStyle = 'rgb(238,232,170)';
        Board.context.fillRect(Board.cellWidth*this.col.index, Board.cellHeight*this.index, Board.cellWidth, Board.cellHeight);

        return this;
    }
}

let board = new Board(ctx, initialShit, cols, rows, fontSiz, cellWidth, cellHeight, letters);

console.log('board', board);

// board.draw();
