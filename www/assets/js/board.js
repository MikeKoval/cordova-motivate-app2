import {Column} from './column';

export 
class Board {
    static random(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    get phrase() {
        return this._phrase;
    }
    set phrase(value) {
        this._phrase = value;
    }

    get offset() {
        return this._offset;
    }
    set offset(value) {
        this._offset = value;
    }

    get startY() {
        return this._startY;
    }
    set startY(value) {
        this._startY = value;
    }

    constructor(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, letters) {
        Board.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        Board.fontSize = fontSize || 20;
        Board.cellWidth = cellWidth || Board.fontSize*2;
        Board.cellHeight = cellHeight || Board.fontSize*2;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        this.cols = [];

        this.offset = 0;

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.startY =  this.setPhrase(this.initialShit);
    }

    rebuild() {
        for (let i = 0; i < this.colsNum; i += 1) {
            for (let j = 0; j < this.rowsNum; j += 1) {
                this.cols[i].letters[j].set(Board.letters[Board.random(0, Board.letters.length - 1)].toUpperCase());
                this.cols[i].letters[j].setPunctuation('');
            }
        }

        return this;
    }

    draw() {
        for(let index = 0; index < this.colsNum; index += 1) {
            this.cols[index].draw();
        }

        return this;
    }

    enablePhrase() {
        let paragraph = this.buildParagraph();

        for (let y = this.startY, i = 0; y < this.startY + paragraph.length; y += 1, i += 1) {
            let startX = Math.ceil(this.colsNum/2) - Math.ceil(paragraph[i].length/2);

            for(let x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1){
                this.cols[x].letters[y]
                    .enable();
            }
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

    buildParagraph() {
        let phrase = this.phrase;

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

        return rows;
    }

    setPhrase(phrase) {
        this.phrase = phrase;

        this
            .rebuild()
            .disable();




        let paragraph = this.buildParagraph();

        let startY = Math.ceil((this.rowsNum - paragraph.length)/2);

        this.offset = startY;

        for (let y = startY, i = 0; y < startY + paragraph.length; y += 1, i += 1) {
            let startX = Math.ceil(this.colsNum/2) - Math.ceil(paragraph[i].length/2);

            for(let x = startX, j = 0; x < startX + paragraph[i].length; x += 1, j += 1){
                if(paragraph[i][j] === ',' || paragraph[i][j] === '.'){
                    this.cols[x].letters[y]
                        .set('');

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
                    .enable();
            }
        }

        return startY;
    }

    shift(step) {
        //step = step % this.rowsNum;

        for(let i = 0; i < this.colsNum; i += 1){
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
}