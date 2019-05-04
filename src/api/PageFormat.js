//import {toDataUrl} from "../scheduling/utilities";
// import header from "../resources/FIRST_header.png";
// import flllogo from "../resources/flllogo.jpg";
// import gamelogo from "../resources/gamelogo.jpg";
// import mqlogo from "../resources/mqlogo.png";
// import firstlogo from "../resources/firstlogo.png";

import PreComputedImages from "../resources/images.json";

export class PageFormat {
    constructor() {
        this._header = null;
        this.logoTopLeft = null;
        this.logoTopRight = null;
        this.logoBotLeft = null;
        this.logoBotRight = null;
        this.titleFontSize = 22;
        this.baseFontSize = 12;
        this.footerText = 'www.firstaustralia.org';

        if (PreComputedImages.header)
            this._header = PreComputedImages.header;
         // else
         //    toDataUrl(header, (base) => {this.header= base;});
        if (PreComputedImages.flllogo)
            this._logoTopLeft = PreComputedImages.flllogo;
        // else
        //     toDataUrl(flllogo, (base) => {this.logoTopLeft = base;});
        if (PreComputedImages.gamelogo)
            this._logoTopRight = PreComputedImages.gamelogo;
        // else
        //     toDataUrl(gamelogo, (base) => {this.logoTopRight = base;});
        if (PreComputedImages.mqlogo)
            this._logoBotLeft = PreComputedImages.mqlogo;
         // else
         //    toDataUrl(mqlogo, (base) => {this.logoBotLeft = base;});
        if (PreComputedImages.firstlogo)
            this._logoBotRight = PreComputedImages.firstlogo;
        // else
        //     toDataUrl(firstlogo, (base) => {this.logoBotRight = base;});

        this.customLogos = false;

        console.log(this.customLogos);
    }

    get footerText() {return this._footer;}
    set footerText(x) {this._footer = x;}
    get baseFontSize() {return this._baseFontSize;}
    set baseFontSize(x) {this._baseFontSize = x;}
    get titleFontSize() {return this._titleFontSize;}
    set titleFontSize(x) {this._titleFontSize = x;}

    get logoTopLeft() {return this._logoTopLeft}
    set logoTopLeft(x) {this.customLogos = (this._logoTopLeft !== x || this.customLogos); this._logoTopLeft = x;}
    get logoBotLeft() {return this._logoBotLeft}
    set logoBotLeft(x) {this.customLogos = (this._logoBotLeft !== x || this.customLogos); this._logoBotLeft = x;}
    get logoTopRight() {return this._logoTopRight}
    set logoTopRight(x) {this.customLogos = (this._logoTopRight !== x || this.customLogos); this._logoTopRight = x;}
    get logoBotRight() {return this._logoBotRight}
    set logoBotRight(x) {this.customLogos = (this._logoBotRight !== x || this.customLogos); this._logoBotRight = x;}
    get header() {return this._header}
    set header(x) {this.customLogos = (this._header !== x || this.customLogos); this._header= x;}

    static freeze(o) {
        console.log("Custom logos" + o.customLogos);
        return o.customLogos ? {
            _class : 'PageFormat',
            _titleFontSize: o._titleFontSize,
            _baseFontSize: o._baseFontSize,
            _header: o._header,
            _logoTopLeft: o._logoTopLeft,
            _logoBotLeft: o._logoBotLeft,
            _logoTopRight: o._logoTopRight,
            _logoBotRight: o._logoBotRight,
            _footer: o._footer
        } : {
            _class : 'PageFormat',
            _titleFontSize: o._titleFontSize,
            _baseFontSize: o._baseFontSize,
            _footer: o._footer
        };
    }

    static thaw(o) {
      console.log("THAW");
        console.log(o);
        console.log(o._header);
        let E = new PageFormat();
        E._baseFontSize = o._baseFontSize;
        E._titleFontSize = o._titleFontSize;
        if (o._header) E._header = o._header;
        if (o._logoTopLeft) E._logoTopLeft = o._logoTopLeft;
        if (o._logoBotLeft) E._logoBotLeft = o._logoBotLeft;
        if (o._logoTopRight) E._logoTopRight = o._logoTopRight;
        if (o._logoBotRight) E._logoBotRight = o._logoBotRight;
        E._footer = o._footer;
        return E;
    }

}
