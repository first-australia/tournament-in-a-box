import PptxGenJS from 'pptxgenjs';
import PreComputedImages from "../resources/images.json";

export class PptPres {
    constructor(title, pageFormat, logos) {
        this.pptx = new PptxGenJS();
        this.pptx.setLayout('LAYOUT_WIDE');

        this.pptx.defineSlideMaster({
            title: 'PRESENTATION_BASIC',
            bkgd: 'FFFFFF',
            objects: [
                {
                    'image': {
                        data: PreComputedImages.gamelogo,
                        // path: '../resources/gamelogo.jpg', //Doesn't work
                        x: 13.3 * 0.4, y: 0, w: 13.3 * 0.2, h: 13.3 * 0.2,
                        sizing: 'contain'
                    }
                },
                {
                    'placeholder': {
                        options: {
                            name: 'heading', type: 'body',
                            x: '10%', y: '40%', w: '80%', h: '20%', fontSize: 66,
                            align: 'center', fontFace: 'Palatino', autoFit: 'true'
                        },
                        text: '___ Award'
                    }
                },
                {
                    'text': {
                        text: title, options: {
                            x: '20%', y: '80%', h: '10%', w: '60%', fontSize: 36,
                            align: 'center', fontFace: 'Palatino', autoFit: 'true'
                        }
                    }
                },
                // { 'image': {
                //         data: pageFormat.header, // Doesn't work
                //         // path: '../resources/FIRST_header.png',
                //         x: 0, y: '90%', h: '10%', w: '100%'
                //     } }
                {'rect': {x: 0.1, y: 7, w: 3, h: 0.5, fill: '00a651'}},
                {'rect': {x: 3.5, y: 7, w: 3, h: 0.5, fill: 'ed1c24'}},
                {'rect': {x: 6.9, y: 7, w: 3, h: 0.5, fill: 'f57e25'}},
                {'rect': {x: 10.3, y: 7, w: 3, h: 0.5, fill: '009cd7'}},
            ]
        });
        this.pptx.defineSlideMaster({
            title: 'PRESENTATION_WINNER',
            bkgd: 'FFFFFF',
            objects: [
                {
                    'image': {
                        data: PreComputedImages.gamelogo,
                        // path: '../resources/gamelogo.jpg', //Doesn't work
                        x: 13.3 * 0.4, y: 0, w: 13.3 * 0.2, h: 13.3 * 0.2,
                        sizing: 'contain'
                    }
                },
                {
                    'placeholder': {
                        options: {
                            name: 'winner', type: 'body',
                            x: '10%', y: '40%', w: '80%', h: '20%', fontSize: 66,
                            align: 'center', fontFace: 'Palatino', autoFit: 'true'
                        },
                        text: '_________'
                    }
                },
                {
                    'placeholder': {
                        options: {
                            name: 'award', type: 'body',
                            x: '10%', y: '60%', w: '80%', h: '10%', fontSize: 36, color: 'bbbbbb',
                            align: 'center', fontFace: 'Palatino', autoFit: 'true'
                        },
                        text: '___ Award'
                    }
                },
                {
                    'text': {
                        text: title, options: {
                            x: '20%', y: '80%', h: '10%', w: '60%', fontSize: 36,
                            align: 'center', fontFace: 'Palatino', autoFit: 'true'
                        }
                    }
                },
                // { 'image': {
                //         data: pageFormat.header, // Doesn't work
                //         // path: '../resources/FIRST_header.png',
                //         x: 0, y: '90%', h: '10%', w: '100%'
                //     } }
                {'rect': {x: 0.1, y: 7, w: 3, h: 0.5, fill: '00a651'}},
                {'rect': {x: 3.5, y: 7, w: 3, h: 0.5, fill: 'ed1c24'}},
                {'rect': {x: 6.9, y: 7, w: 3, h: 0.5, fill: 'f57e25'}},
                {'rect': {x: 10.3, y: 7, w: 3, h: 0.5, fill: '009cd7'}},
            ]
        });

    }

    addTitle(title) {
        let slide = this.pptx.addNewSlide('PRESENTATION_BASIC');
        slide.addText(title, {placeholder: 'heading'});
    }

    addWinner(title, winner) {
        let slide = this.pptx.addNewSlide('PRESENTATION_WINNER');
        slide.addText(title, {placeholder: 'award'});
        if (winner) slide.addText(winner, {placeholder: 'winner'});
    }

    download() {
        this.pptx.save();
    }

    getBlobPromise() {
        return new Promise((resolve, reject) => {
            this.pptx.save('jszip', (blob) => resolve(blob), 'blob');
        });
    }

}