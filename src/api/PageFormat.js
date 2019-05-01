import {toDataUrl} from "../scheduling/utilities";
import header from "../resources/FIRST_header.png";
import flllogo from "../resources/flllogo.jpg";
import gamelogo from "../resources/gamelogo.jpg";
import mqlogo from "../resources/mqlogo.png";
import firstlogo from "../resources/firstlogo.png";

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

        toDataUrl(header, (base) => {if (!this.header) this.header= base;});
        toDataUrl(flllogo, (base) => {if (!this.logoTopLeft) this.logoTopLeft = base;});
        toDataUrl(gamelogo, (base) => {if (!this.logoTopRight) this.logoTopRight = base;});
        toDataUrl(mqlogo, (base) => {if (!this.logoBotLeft) this.logoBotLeft = base;});
        toDataUrl(firstlogo, (base) => {if (!this.logoBotRight) this.logoBotRight = base;});
    }

    get footerText() {return this._footer;}
    set footerText(x) {this._footer = x;}
    get baseFontSize() {return this._baseFontSize;}
    set baseFontSize(x) {this._baseFontSize = x;}
    get titleFontSize() {return this._titleFontSize;}
    set titleFontSize(x) {this._titleFontSize = x;}

    get logoTopLeft() {return this._logoTopLeft}
    set logoTopLeft(x) {this._logoTopLeft = x;}
    get logoBotLeft() {return this._logoBotLeft}
    set logoBotLeft(x) {this._logoBotLeft = x;}
    get logoTopRight() {return this._logoTopRight}
    set logoTopRight(x) {this._logoTopRight = x;}
    get logoBotRight() {return this._logoBotRight}
    set logoBotRight(x) {this._logoBotRight = x;}
    get header() {return this._header}
    set header(x) {this._header= x;}

    static freeze(o) {
        return {
            _titleFontSize: o._titleFontSize,
            _baseFontSize: o._baseFontSize,
            _logoTopLeft: o._logoTopLeft,
            _logoBotLeft: o._logoBotLeft,
            _logoTopRight: o._logoTopRight,
            _logoBotRight: o._logoBotRight,
            _footer: o._footer
        };
    }

    static thaw(o) {
        let E = new PageFormat();
        E._baseFontSize = o._baseFontSize;
        E._titleFontSize = o._titleFontSize;
        E._logoTopLeft = o._logoTopLeft;
        E._logoBotLeft = o._logoBotLeft;
        E._logoTopRight = o._logoTopRight;
        E._logoBotRight = o._logoBotRight;
        E._footer = o._footer;
        return E;
    }

}