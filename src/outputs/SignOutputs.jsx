import { PdfDoc } from "../templates/PdfDoc";
import { TYPES } from "../api/SessionTypes";
import { EventParams } from "../api/EventParams";

export function MakePitSignsPdf(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, true);
  event.teams.forEach((t) => {
    // margin: [left, top, right, bottom]
    doc.addContent({
      text: t.name,
      style: "signTitle",
      margin: [0, 40, 0, 10],
    });
    doc.addContent({
      text: "Team " + t.number,
      style: "signSubtitle",
      margin: [0, 10],
    });
    doc.addPageBreak();
  });
  doc.chomp();
  doc.filename = "pit-signs".replace(/ /g, "-");
  return doc;
}

export function MakeLocationSignsPdf(event) {
  let baseLocations = [
    "Coaches meeting",
    "Judge check-in",
    "No teams allowed past here",
    "Pit admin",
    "Practice table",
    "Queueing",
    "Quiet room",
    "Robot game",
    "Team registration",
    "Volunteer room",
  ];
  let doc = new PdfDoc(event.pageFormat, event.title, true);
  event.sessions
    .filter((x) => x.type === TYPES.JUDGING)
    .forEach((s) => {
      s.locations.forEach((loc, i) => {
        // margin: [left, top, right, bottom]
        doc.addContent({
          text: s.name + " Room " + (i + 1),
          style: "signTitle",
          margin: [0, 40, 0, 10],
        });
        doc.addContent({ text: loc, style: "signSubtitle", margin: [0, 10] });
        doc.addPageBreak();
      });
    });
  let s = event.sessions.find((x) => x.type === TYPES.MATCH_ROUND);
  s.locations.forEach((loc) => {
    // margin: [left, top, right, bottom]
    doc.addContent({ text: loc, style: "signTitle", margin: [0, 40, 0, 10] });
    doc.addPageBreak();
  });
  baseLocations.forEach((loc) => {
    // margin: [left, top, right, bottom]
    doc.addContent({ text: loc, style: "signTitle", margin: [0, 40, 0, 10] });
    doc.addPageBreak();
  });
  doc.chomp();
  doc.filename = "location-signs".replace(/ /g, "-");
  return doc;
}

export function MakeAwardCertPdf(event) {
  let F = event.pageFormat.footerText;
  event.pageFormat.footerText = "";
  let doc = new PdfDoc(event.pageFormat, "", true);
  event.pageFormat.footerText = F;
  // for (let i = 0; i < event.judgesAwards; i++) {
  //   doc.addContent({
  //     text: 'Judges Award',
  //     style: 'signTitle',
  //     margin: [0, 40, 0, 10]
  //   });
  //   doc.addContent({
  //     text: '____________________',
  //     style: 'signTitle',
  //     margin: [0, 40, 0, 10]
  //   });
  //   doc.addContent({
  //     text: event.title,
  //     style: 'signSubtitle',
  //     margin: [0, 10]
  //   });
  //   doc.addPageBreak();
  // }
  console.log(event.awards);
  // console.log(EventParams.AWARD_NAMES[event.awardStyleIdx]);
  event.awards.forEach((a) => {
    // margin: [left, top, right, bottom]
    doc.addContent({ text: a, style: "certTitle", margin: [0, 60, 0, 10] });
    doc.DrawLine();
    doc.addContent({
      text: event.title,
      style: "certSubtitle",
      margin: [0, 10],
    });
    doc.addPageBreak();
  });
  doc.chomp();
  doc.filename = "award-certificates".replace(/ /g, "-");
  return doc;
}

export function MakeParticipationCertPdf(event) {
  let F = event.pageFormat.footerText;
  event.pageFormat.footerText = "";
  let doc = new PdfDoc(event.pageFormat, "", true);
  event.pageFormat.footerText = F;
  event.teams.forEach((t) => {
    // margin: [left, top, right, bottom]
    doc.addContent({
      text: "Certificate of Participation",
      style: "certTitle",
      margin: [0, 60, 0, 10],
    });
    doc.DrawLine();
    doc.addContent({
      text: event.title,
      style: "certSubtitle",
      margin: [0, 10],
    });
    doc.addContent({ text: t.name, style: "certSubtitle", margin: [0, 10] });
    doc.addPageBreak();
  });
  doc.chomp();
  doc.filename = "participation-certificates".replace(/ /g, "-");
  return doc;
}
