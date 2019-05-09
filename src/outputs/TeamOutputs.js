import { PdfDoc } from "../templates/PdfDoc";
import { TYPES } from '../api/SessionTypes';


export function MakeTeamListPDF(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  let t = {headerRows: 1, dontBreakRows: true};
  t.widths = new Array(4);
  t.widths[0] = 100;
  t.widths[1] = 200;
  t.widths[2] = 100;
  t.widths[3] = 50;
  t.body = [];
  let header = [];
  header.push({text:"Number", alignment: 'center'});
  header.push({text:"Name"});
  header.push({text:"Affiliation"});
  header.push({text:"Pit num"});
  t.body.push(header);

  event.teams.forEach(x => {
    let row = [];
    row.push({text:x.number, alignment: 'center'});
    row.push({text:x.name});
    row.push({text:x.affiliation});
    row.push({text:x.pitNum});
    t.body.push(row);
  });

  doc.addContent({text: "Team List", style:'header2',margin:[0,10]});
  doc.addContent({table: t, layout: 'lightHorizontalLines'});

  doc.filename = ("team-list").replace(/ /g, "-");
  return doc;
}

export function MakeAllTeamsPDF(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, true);

  doc.addContent({text: "All Team Schedule", style:'header2',margin:[0,10]});

  let data = event.getIndivDataGrid(true);
  let N = data[3].length;
  let t = {headerRows: 2, dontBreakRows: true, keepWithHeaderRows: 1};
  t.widths = [];
  let w = 500/N;
  for (let i = 0; i < N; i++) {
    t.widths[i] = w;
  }
  t.widths[1] = '*';
  t.body = [];
  for (let k = 0; k < data.length; k++) {
    t.body[k] = [];
    let curStyle = (k<2)?"tablehead":"tablebody";
    let col = "blue";
    for (let i = 0; i < data[k].length; i++) {
      // Hack way to calculate alternating colours.  TODO: Fix
      col = (i%4 > 1) ? 'blue' : 'black';
      if (k === 0) col = (i%2 === 1) ? 'blue' : 'black';
      if (data[k][i].colSpan) {
        t.body[k].push({colSpan:data[k][i].colSpan, text:data[k][i].value.toString(),color:col,style:curStyle});
        for (let dummy = 1; dummy < data[k][i].colSpan; dummy++) t.body[k].push({});
      } else t.body[k].push({text:data[k][i].value.toString()+"",color:col,style:curStyle});
    }
  }
  doc.addContent({table: t, layout: 'lightHorizontalLines', alignment:'center'});

  doc.filename = ("individual-schedule").replace(/ /g, '-');
  return doc;
}

export function MakeIndivTeamsPDF(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  event.teams.forEach(t => {
    doc.addContent({text: t.number + ": " + t.name, style:'header2',margin:[0,10]});
    doc.addContent(teamPage(event, t));
    doc.addContent({text: " ", pageBreak:'after'});
  });
  // Delete the last page break
  doc.chomp();
  doc.filename = ("team-schedule").replace(/ /g, '-');
  return doc;
}

function teamPage(event, team) {
  let schedule = [];
  for (let i = 0; i < team.schedule.length; i++)
  if (team.schedule[i].teams) schedule.push(team.schedule[i]);
  schedule.sort(function(a,b) {
    return a.time.mins - b.time.mins;
  });

  let t = {headerRows:1, dontBreakRows:true};
  t.widths = new Array(3);
  for (let i = 0; i < 3; i++) {
    t.widths[i] = (i<-1) ? 'auto':'*';
  }
  t.body = [];
  t.body[0] = [];
  t.body[0][0] = {text: "Time (#)"};
  t.body[0][1] = {text:"Event"};
  t.body[0][2] = {text:"Location"};
  for (let i = 0; i < schedule.length; i++) {
    // If it's a break that applies to specific sessions, don't put it in.
    if (event.getSession(schedule[i].session_id).type === TYPES.BREAK && event.getSession(schedule[i].session_id).appliesTo.length > 0) continue;
    let row = [];
    let spot = schedule[i].teams.indexOf(team.id);
    let num =" ("+schedule[i].num+")";
    if ((schedule[i].teams.length - schedule[i].teams.indexOf((team.id))) <= schedule[i].surrogates) num = " ("+schedule[i].num+", surrogate)";
    if (event.getSession(schedule[i].session_id).type === TYPES.BREAK) num ="";

    let loc = event.getSession(schedule[i].session_id).locations[spot+schedule[i].loc];
    // if (event.getSession(schedule[i].session_id).type === TYPES.BREAK) loc = event.getSession(schedule[i].session_id).locations[0];
    if (event.getSession(schedule[i].session_id).type === TYPES.BREAK) loc = "";
    if (!loc) loc = "";
    row.push({text: schedule[i].time.time+num});
    row.push({text: event.getSession(schedule[i].session_id).name});
    row.push({text: ""+loc});
    t.body.push(row);
  }
  return {table: t, layout: 'lightHorizontalLines'};
}
