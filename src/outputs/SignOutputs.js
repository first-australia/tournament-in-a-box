import { PdfDoc } from "../templates/PdfDoc";

export function MakePitSignsPdf(event, prefix) {
  let doc = new PdfDoc(event.pageFormat, event.title, true);
  event.teams.forEach(t => {
    // margin: [left, top, right, bottom]
    doc.addContent({text: t.name, style:'headerHuge',margin:[0,40,0,10]});
    doc.addContent({text: "Team " + t.number, style:'subHeaderHuge',margin:[0,10]});
    doc.addPageBreak();
  });
  doc.chomp();
  doc.filename = (prefix+"-pit-signs.pdf").replace(/ /g, '-');
  return doc;
}
