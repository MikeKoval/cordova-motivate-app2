import {Column} from './column';

export 
class Board {
    static random(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    get context() {
        return Board._context;
    }
    set context(value) {
        Board._context = value;
    }

    get fontSize() {
        return Board._fontSize;
    }

    set fontSize(value) {
        Board._fontSize = value;
    }

    get cellWidth() {
        return Board._cellWidth;
    }
    set cellWidth(value) {
        Board._cellWidth = value;
    }

    get cellHeight() {
        return Board._cellHeight;
    }
    set cellHeight(value) {
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

    get paddingLeft() {
        return this._paddingLeft;
    }
    set paddingLeft(value) {
        this._paddingLeft = value;
    }

    get initPaddingTop() {
        return this._initPaddingTop;
    }
    set initPaddingTop(value) {
        this._initPaddingTop = value;
    }

    get paddingTop() {
        return this._paddingTop;
    }
    set paddingTop(value) {
        this._paddingTop = value;
    }


    constructor(context, initialShit, cols, rows, fontSize, cellWidth, cellHeight, paddingLeft, paddingTop, letters) {
        this.context = context;

        this.colsNum = cols || 15;
        this.rowsNum = rows || 25;
        this.initialShit = initialShit || 'HELLO';
        this.fontSize = fontSize || 20;
        this.cellWidth = cellWidth || this.fontSize*2;
        this.cellHeight = cellHeight || this.fontSize*2;
        this.paddingLeft = paddingLeft;
        this.paddingTop = paddingTop;
        this.initPaddingTop = paddingTop;
        Board.letters = letters || 'aбвгдеежзийклмнопрстуфхцчшщїыьеюя';

        console.info(paddingTop, 'padidngTop');

        this.cols = [];

        this.offset = 0;

        for(let index = 0; index < this.colsNum; index += 1){
            this.cols[index] = new Column(this, index, this.rowsNum);
        }

        this.startY =  this.setPhrase(this.initialShit);
    }

    clearBackground(){
        this.context.clearRect(0, this.paddingTop,  this.cellWidth * this.colsNum, this.cellHeight * this.rowsNum);
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

        // this.drawGradient();

        return this;
    }

    drawGradient() {
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

        // console.info(rows, 'rows');

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
        for(let i = 0; i < this.colsNum; i += 1){
            this.cols[i].shift(step);
        }

        return this;
    }
}