import {PptPres} from '../templates/PptPres';

export function MakeClosingPresentation(event) {
    let doc = new PptPres(event.title, event.pageFormat, event.sponsors.nationals);

    let awardsCon = ["Robot Design", "Robot Performance", "Core Values",
        "Project", "Champion's"];
    let awardsFull = ["Mechanical Design", "Programming", "Strategy & Innovation",
        "Robot Performance", "Teamwork", "Inspiration", "Gracious Professionalism",
        "Research", "Innovative Solution", "Presentation", "Champion's"];

    doc.addTitle("Closing & Awards Ceremony");

    for (let i = 0; i < event.judgesAwards; i++) {
        doc.addTitle("_______ Judges Award");
        doc.addWinner("_______ Judges Award");
    }

    (event.consolidatedAwards ? awardsCon : awardsFull).forEach(a => {
        // margin: [left, top, right, bottom]
        doc.addTitle(a + " Award");
        doc.addWinner(a + " Award");
    });

    doc.addTitle("Closing & Awards Ceremony");

    doc.filename = "closing-slides";

    return doc;
}