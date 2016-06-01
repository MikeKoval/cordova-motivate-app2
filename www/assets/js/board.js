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

    static get paddingLeft() {
        return this._paddingLeft;
    }
    static set paddingLeft(value) {
        this._paddingLeft = value;
    }

    constructor(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, letters) {
        Board.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        Board.fontSize = fontSize || 20;
        Board.cellWidth = cellWidth || Board.fontSize*2;
        Board.cellHeight = cellHeight || Board.fontSize*2;
        Board.paddingLeft = paddingLeft;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        this.cols = [];

        this.offset = 0;

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(index, this.rowsNum);
        }

        this.startY =  this.setPhrase(this.initialShit);
    }

    clearBackground(){
        Board.context.clearRect(0, 0,  Board.cellWidth * this.colsNum, Board.cellHeight * this.rowsNum);
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
        this.clearBackground();

        for(let index = 0; index < this.colsNum; index += 1) {

            this.cols[index].draw();
        }

        this.drawGradient();

        return this;
    }

    drawGradient() {
        var grd;

        grd = Board.context.createLinearGradient(0, 0, 0, Board.cellHeight * this.rowsNum / 4);
        grd.addColorStop(0, 'rgba(250, 249, 231, 0.9)');
        grd.addColorStop(0.7, 'rgba(250, 249, 231, 0.5)');
        grd.addColorStop(1, 'rgba(250, 249, 231 ,0)');

        Board.context.fillStyle = grd;
        Board.context.fillRect(0, 0, Board.cellWidth * this.colsNum, Board.cellHeight * this.rowsNum / 4);

        grd = Board.context.createLinearGradient(0, Board.cellHeight * (this.rowsNum - this.rowsNum / 4), 0, Board.cellHeight * (this.rowsNum - this.rowsNum / 4) + Board.cellHeight * this.rowsNum / 4);

        grd.addColorStop(0, 'rgba(250, 249, 231 ,0)');
        grd.addColorStop(0.3, 'rgba(250, 249, 231, 0.5)');
        grd.addColorStop(1, 'rgba(250, 249, 231, 0.9)');

        Board.context.fillStyle = grd;
        Board.context.fillRect(0, Board.cellHeight * (this.rowsNum - this.rowsNum / 4), Board.cellWidth * this.colsNum, Board.cellHeight * this.rowsNum / 4);
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

        // console.info(rows, 'rows');

        return rows;
    }

    setPhrase(phrase) {
        this.phrase = phrase;

        this
            .rebuild();




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
        for(let i = 0; i < this.colsNum; i += 1){
            this.cols[i].shift(step);
        }

        return this;
    }
}