import { PdfDoc } from "../templates/PdfDoc";
import { DateTime } from "../api/DateTime";

export function MakeSessionPDF(event, type) {
  let maxLocs = 0;
  event.sessions.filter(s=>s.type===type).forEach((session) => maxLocs=Math.max(maxLocs,session.nLocs));
  let doc = new PdfDoc(event.pageFormat, event.title, maxLocs > 4);

  event.sessions.filter(s=>s.type===type).forEach((session) => {
    try {
      doc.addContent({text: session.name + " Schedule", style:'header2',margin:[0,10]});
      doc.addContent(sessionPage(session, event.getSessionDataGrid(session.id, true)));
      doc.addPageBreak();
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
  if (doc.empty()) return null;
  // Delete the last page break
  doc.chomp();
  doc.filename = (type.name+"-schedule").replace(/ /g, "-");
  return doc;
}

function sessionPage(session, data) {
  // headers are automatically repeated if the table spans over multiple pages
  // you can declare how many rows should be treated as headers
  let t = {headerRows: 1,dontBreakRows: true};
  t.widths = new Array(session.nLocs+2);
  let w = 475/(session.nLocs+2);
  for (let i = 0; i < session.nLocs+2; i++) t.widths[i] = (i<2) ? 'auto':'*';
  t.widths[0] = w;
  t.body = [];
  //Header row
  let header = [];
  for (let i = 0; i < data[0].length; i++) header.push({text:data[0][i].value,alignment:'center'});
  t.body.push(header);

  // All individual rows
  for (let i = 1; i < data.length; i++) {
    let row = [];
    row.push({text:data[i][0].value.toString(),alignment:'center'});
    row.push({text:data[i][1].value.toString(),alignment:'center'});
    if (data[i][2].colSpan) {
      row.push({colSpan:data[i][2].colSpan,style:'breakrow',text:""+data[i][2].value.toString()});
      t.body.push(row);
      continue;
    }
    // let diff = session.nLocs;
    for (let j = 2; j < data[i].length; j++) {
      if (data[i][j] === null) row.push({});
      else row.push({text:data[i][j].value.toString(),style: 'teamEntry'});
    }
    t.body.push(row);
  }
  // if (session.usesSurrogates && session.fillerPolicy === USE_SURROGATES)
  //   this.doc.content.push({text:"\n* Surrogate team; results not counted",alignment:'center'});
  return {table: t, layout: 'lightHorizontalLines'};
}


export function MakeDaySchedulePdf(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  let t = {headerRows: 1, dontBreakRows: true};
  t.widths = new Array(3);
  t.widths[0] = 100;
  t.widths[1] = 100;
  t.widths[2] = 300;
  t.body = [];
  let header = [];
  header.push({text:"Start"});
  header.push({text:"End"});
  header.push({text:"Event"});
  t.body.push(header);

  let sorted = event.sessions.sort((a,b) => { return a.actualStartTime.mins - b.actualStartTime.mins});
  for (let i = 0; i < sorted.length; i++) {
    let row = [];
    row.push(sorted[i].actualStartTime.time);
    row.push(sorted[i].actualEndTime.time);
    row.push(sorted[i].name);
    t.body.push(row);
  }
  doc.addContent({text: "Day Schedule", style:'header2',margin:[0,10]});
  doc.addContent({table: t, layout: 'lightHorizontalLines'});

  doc.filename = ("day-schedule").replace(/ /g, "-");
  return doc;
}

export function MakePracticeTableSignupPdf(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  let t = {headerRows: 1, dontBreakRows: true};
  t.widths = ['auto','*'];
  t.body = [];
  t.body.push(["Time", "Team"]);

  let now = event.startTime.clone();
  while (now.mins < event.endTime.mins-1) {
    now = new DateTime(event.timeIncPrac(now,10));
    t.body.push([now.displayTime(), '']);
  }

  doc.addContent({text: "Practice table signup sheet", style:'header2', margin:[0,10]});
  doc.addContent({table: t, layout: 'lightHorizontalLines'});
  doc.addContent({text: "* Don't book too much fam", style:'footer'});

  doc.filename = ("practice-tables").replace(/ /g, "-");
  return doc;
}
