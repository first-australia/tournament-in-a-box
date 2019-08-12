import {PptPres} from '../templates/PptPres';
import {EventParams} from '../api/EventParams';
export function MakeClosingPresentation(event) {
    let doc = new PptPres(event.title, event.pageFormat, event.sponsors.nationals);

    doc.addTitle("Closing & Awards Ceremony");

    for (let i = 0; i < event.judgesAwards; i++) {
        doc.addTitle("_______ Judges Award");
        doc.addWinner("_______ Judges Award");
    }

    (EventParams.AWARD_NAMES[event.awardStyleIdx]).forEach(a => {
        // margin: [left, top, right, bottom]
        doc.addTitle(a);
        doc.addWinner(a);
    });

    doc.addTitle("Closing & Awards Ceremony");

    doc.filename = "closing-slides";

    return doc;
}
