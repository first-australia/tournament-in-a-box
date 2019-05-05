import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfDoc {
    constructor(format, title, landscape) {
        this._format = format;
        this.imageDict = {
            header: this._format.header,
            logo1: this._format.logoTopLeft,
            logo2: this._format.logoTopRight,
            logo3: this._format.logoBotLeft,
            logo4: this._format.logoBotRight
        };
        this.styleDict = {
            header: {fontSize: this._format.titleFontSize,bold: true,alignment: 'center'},
            footer: {fontSize: this._format.baseFontSize+2,bold: true,alignment: 'center',color: 'grey'},
            header2: {fontSize: this._format.titleFontSize+2,bold: true,alignment: 'center'},
            signTitle: {fontSize: 64,bold: true,alignment: 'center'},
            signSubtitle: {fontSize: 44,bold: true,alignment: 'center',color: 'grey'},
            certTitle: {fontSize: 52,bold: true,alignment: 'center'},
            certSubtitle: {fontSize: 36,bold: true,alignment: 'center',color: 'grey'},
            tablebody: {fontSize: this._format.baseFontSize-4,alignment:'center'},
            extraTime: {alignment: 'center',color: 'red'},
            tablehead: {fontSize: this._format.baseFontSize-2,bold: true,alignment:'center'},
            breakrow: {bold: true,alignment:'center',fillColor: '#eeeeee'},
            teamEntry:{fontSize:this._format.baseFontSize, alignment:'center'}
        };
        // "Doc" object is used by pdf generator.
        this.doc = {};
        this.doc.content = [];
        this.doc.header = {
            text: title,
            style: 'header',
            //Left, top, right, bottom
            margin: [0,50,0,20]
        };
        this.doc.background = this.portraitBackground();
        this.doc.footer={
            text: this.format.footerText,
            style: 'footer',
            margin:[0,50,0,0]
        };
        this.doc.pageMargins = [40,120,40,130];
        this.doc.pageSize = 'A4';
        this.doc.images = this.imageDict;
        this.doc.styles = this.styleDict;
        if (landscape)  {
            this.doc.pageOrientation='landscape';
            this.doc.background = this.landscapeBackground();
        }
        this.filename = "file";
        this.blob = null;
    }

    get format() { return this._format; }

    addContent(content) {
        this.doc.content.push(content);
    }

    set filename(x) {this._filename = x;}
    get filename() {return this._filename;}

    empty() {
        return this.doc.content.length === 0;
    }

    addPageBreak() {
        this.doc.content.push({text: " ", pageBreak:'after'});
    }

    DrawLine() {
      this.doc.content.push({canvas: [{ type: 'line', x1: 100, y1: 5, x2: 660, y2: 5, lineWidth: 3 }],
        margin: [0, 60, 0, 10]});
    }

    download(filename) {
        if (!filename) filename = this.filename;
        try {
            pdfMake.createPdf(this.doc).download(filename);
        } catch (err) {
            alert ("Error printing: " + err.message);
        }
    }

    open() {
        try {
            pdfMake.createPdf(this.doc).open();
        } catch (err) {
            alert ("Error opening: " + err.message);
        }
    }

    getBlobPromise() {
        return new Promise((resolve, reject) => {
            pdfMake.createPdf(this.doc).getBlob((blob) => {
                resolve(blob);
            });
        });
    }

    chomp() {
        this.doc.content.splice(this.doc.content.length-1);
    }

    portraitBackground() {
        return [
            // margin: [left, top, right, bottom]
            {image: 'header', width: 530, height: 20, alignment: 'center', margin: [0,10,0,0]},
            {
                table: {
                    widths: ['*','auto','*'],
                    body: [
                        [ {image: 'logo1', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
                            {text: ""},
                            {image: 'logo2', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
                        ] ]
                },
                layout: 'noBorders',
            },
            {text: "", margin: 310, alignment: 'center'},
            {
                table: {
                    widths: ['*','auto','*'],
                    body: [
                        [ {image: 'logo3', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
                            {text: ""},
                            {image: 'logo4', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
                        ] ]
                },
                layout: 'noBorders',
            },
            {image: 'header', width: 530, height: 20, alignment: 'center'}
        ];
    }

    landscapeBackground () {
        return [
            // margin: [left, top, right, bottom]
            {image: 'header', width: 800, height: 20, alignment: 'center', margin: [0,10,0,0]},
            {
                table: {
                    widths: ['*','auto','*'],
                    body: [
                        [ {image: 'logo1', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
                            {text: ""},
                            {image: 'logo2', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
                        ] ]
                },
                layout: 'noBorders',
            },
            {text: "", margin: 190, alignment: 'center'},
            {
                table: {
                    widths: ['*','auto','*'],
                    body: [
                        [ {image: 'logo3', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
                            {text: ""},
                            {image: 'logo4', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
                        ] ]
                },
                layout: 'noBorders',
            },
            {image: 'header', width: 800, height: 20, alignment: 'center'}
        ];
    }
}
