import {PdfDoc} from "../templates/PdfDoc";
import {TYPES} from "../api/SessionTypes";

export function MakePitSignsPdf(event) {
    let doc = new PdfDoc(event.pageFormat, event.title, true);
    event.teams.forEach(t => {
        // margin: [left, top, right, bottom]
        doc.addContent({text: t.name, style: 'signTitle', margin: [0, 40, 0, 10]});
        doc.addContent({text: "Team " + t.number, style: 'signSubtitle', margin: [0, 10]});
        doc.addPageBreak();
    });
    doc.chomp();
    doc.filename = ("pit-signs").replace(/ /g, '-');
    return doc;
}

export function MakeLocationSignsPdf(event) {
    let baseLocations = [
        "Pit admin", "Queueing", "Judge check-in", "Robot game",
        "Coaches meeting", "Volunteer Room", "Practice table"
    ];
    let doc = new PdfDoc(event.pageFormat, event.title, true);
    event.sessions.filter(x => x.type === TYPES.JUDGING).forEach(s => {
        s.locations.forEach((loc, i) => {
            // margin: [left, top, right, bottom]
            doc.addContent({text: s.name + " Room " + (i + 1), style: 'signTitle', margin: [0, 40, 0, 10]});
            doc.addContent({text: loc, style: 'signSubtitle', margin: [0, 10]});
            doc.addPageBreak();
        });
    });
    let s = event.sessions.find(x => x.type === TYPES.MATCH_ROUND);
    s.locations.forEach(loc => {
        // margin: [left, top, right, bottom]
        doc.addContent({text: loc, style: 'signTitle', margin: [0, 40, 0, 10]});
        doc.addPageBreak();
    });
    baseLocations.forEach(loc => {
        // margin: [left, top, right, bottom]
        doc.addContent({text: loc, style: 'signTitle', margin: [0, 40, 0, 10]});
        doc.addPageBreak();
    });
    doc.chomp();
    doc.filename = ("location-signs").replace(/ /g, '-');
    return doc;
}

export function MakeAwardCertPdf(event) {

    let awardsCon = ["Robot Design", "Robot Performance", "Core Values",
        "Project", "Champion's"];
    let awardsFull = ["Mechanical Design", "Programming", "Strategy & Innovation",
        "Robot Performance", "Teamwork", "Inspiration", "Gracious Professionalism",
        "Research", "Innovative Solution", "Presentation", "Champion's"];
    let F = event.pageFormat.footerText;
    event.pageFormat.footerText = "";
    let doc = new PdfDoc(event.pageFormat, "", true);
    event.pageFormat.footerText = F;
    for (let i = 0; i < event.judgesAwards; i++) {
        doc.addContent({text: "Judges Award", style: 'signTitle', margin: [0, 40, 0, 10]});
        doc.addContent({text: "_______________________________________", style: 'signTitle', margin: [0, 40, 0, 10]});
        doc.addContent({text: event.title, style: 'signSubtitle', margin: [0, 10]});
        doc.addPageBreak();
    }
    (event.consolidatedAwards ? awardsCon : awardsFull).forEach(a => {
        // margin: [left, top, right, bottom]
        doc.addContent({text: a + " Award", style: 'certTitle', margin: [0, 60, 0, 10]});
        doc.DrawLine();
        doc.addContent({text: event.title, style: 'certSubtitle', margin: [0, 10]});
        doc.addPageBreak();
    });
    doc.chomp();
    doc.filename = ("award-certificates").replace(/ /g, '-');
    return doc;
}

export function MakeParticipationCertPdf(event) {
    let F = event.pageFormat.footerText;
    event.pageFormat.footerText = "";
    let doc = new PdfDoc(event.pageFormat, "", true);
    event.pageFormat.footerText = F;
    event.teams.forEach(t => {
        // margin: [left, top, right, bottom]
        doc.addContent({text: "Certificate of Participation", style: 'certTitle', margin: [0, 60, 0, 10]});
        doc.DrawLine();
        doc.addContent({text: event.title, style: 'certSubtitle', margin: [0, 10]});
        doc.addContent({text: t.name, style: 'certSubtitle', margin: [0, 10]});
        doc.addPageBreak();
    });
    doc.chomp();
    doc.filename = ("participation-certificates").replace(/ /g, '-');
    return doc;
}
