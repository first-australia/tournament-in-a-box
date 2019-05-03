import { TYPES } from '../api/SessionTypes';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {PdfDoc} from "../templates/PdfDoc";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfGenerator {
  constructor(event) {
    this._event = event;
  }

  get event() { return this._event; }

  makePDFs(fname) {
    let download = true;
    if (!fname) fname = this.event.title.replace(/ /g,"-");
    this.makeAllPDFs(fname, download);
  }

  makeAllPDFs(prefix, download) {
    let PDFs = [];
    PDFs.push(this.sessionPdf(TYPES.JUDGING,prefix));
    PDFs.push(this.sessionPdf(TYPES.MATCH_ROUND,prefix));
    PDFs.push(this.sessionPdf(TYPES.MATCH_ROUND_PRACTICE,prefix));
    PDFs.push(this.sessionPdf(TYPES.TYPE_MATCH_FILLER,prefix));
    PDFs.push(this.sessionPdf(TYPES.TYPE_MATCH_FILLER_PRACTICE,prefix));
    PDFs.push(this.teamListPdf(this.event.teams, prefix));
    PDFs.push(this.daySchedulePdf(prefix));
    PDFs.push(this.allTeamsPdf(prefix));
    PDFs.push(this.indivTeamsPdf(prefix));
    PDFs.filter(D=>D!=null).forEach(D => {
      try {
          download ? D.download() : D.open();
      } catch (err) {
          alert("Error " + (download?"printing":"opening") + ": " + D.filename + "; " + err.message);
      }
    })
  }
  getAllPDFs(prefix, zip) {
    let PDFs = [];
    PDFs.push(this.sessionPdf(TYPES.JUDGING,prefix));
    PDFs.push(this.sessionPdf(TYPES.MATCH_ROUND,prefix));
    PDFs.push(this.sessionPdf(TYPES.MATCH_ROUND_PRACTICE,prefix));
    PDFs.push(this.sessionPdf(TYPES.TYPE_MATCH_FILLER,prefix));
    PDFs.push(this.sessionPdf(TYPES.TYPE_MATCH_FILLER_PRACTICE,prefix));
    PDFs.push(this.teamListPdf(this.event.teams, prefix));
    PDFs.push(this.daySchedulePdf(prefix));
    PDFs.push(this.allTeamsPdf(prefix));
    PDFs.push(this.indivTeamsPdf(prefix));

    PDFs.filter(D=>D!=null).forEach(D => {
      try {
        zip.file(D.filename, D.getBlobPromise());
      } catch (err) {
          alert("Error saving: " + D.filename + "; " + err.message);
      }
    });
  }

  sessionPdf(type, prefix) {
    let maxLocs = 0;
    this.event.sessions.filter(s=>s.type===type).forEach((session) => maxLocs=Math.max(maxLocs,session.nLocs));
    let doc = new PdfDoc(this.event.pageFormat, this.event.title, maxLocs > 4);

    this.event.sessions.filter(s=>s.type===type).forEach((session) => {
      try {
        doc.addContent({text: session.name + " Schedule", style:'header2',margin:[0,10]});
        doc.addContent(this.sessionPage(session));
        doc.addPageBreak();
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
    if (doc.empty()) return null;
    // Delete the last page break
    doc.chomp();
    doc.filename = (prefix+"-"+type.name+"-schedule.pdf").replace(/ /g, "-");
    return doc;
  }

    sessionPage(session) {
        let data = this.event.getSessionDataGrid(session.id, true);
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

  teamListPdf(teams, prefix) {
      let doc = new PdfDoc(this.event.pageFormat, this.event.title, false);

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

      teams.forEach(x => {
          let row = [];
          row.push({text:x.number, alignment: 'center'});
          row.push({text:x.name});
          row.push({text:x.affiliation});
          row.push({text:x.pitNum});
          t.body.push(row);
      });

      doc.addContent({text: "Team List", style:'header2',margin:[0,10]});
      doc.addContent({table: t, layout: 'lightHorizontalLines'});

      doc.filename = (prefix+"-team-list.pdf").replace(/ /g, "-");
      return doc;
  }

  daySchedulePdf(prefix) {
    let doc = new PdfDoc(this.event.pageFormat, this.event.title, false);

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

    let sorted = this.event.sessions.sort((a,b) => { return a.actualStartTime.mins - b.actualStartTime.mins});
    for (let i = 0; i < sorted.length; i++) {
      let row = [];
      row.push(sorted[i].actualStartTime.time);
      row.push(sorted[i].actualEndTime.time);
      row.push(sorted[i].name);
      t.body.push(row);
    }
    doc.addContent({text: "Day Schedule", style:'header2',margin:[0,10]});
    doc.addContent({table: t, layout: 'lightHorizontalLines'});

    doc.filename = (prefix+"-day-schedule.pdf").replace(/ /g, "-");
    return doc;
  }

  allTeamsPdf(prefix) {
    let doc = new PdfDoc(this.event.pageFormat, this.event.title, true);

    doc.addContent({text: "All Team Schedule", style:'header2',margin:[0,10]});

    let data = this.event.getIndivDataGrid(true);
    console.log(data);
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

    doc.filename = (prefix+"-individual-schedule.pdf").replace(/ /g, '-');
    return doc;
  }

  indivTeamsPdf(prefix) {
    let doc = new PdfDoc(this.event.pageFormat, this.event.title, false);

    this.event.teams.forEach(t => {
        doc.addContent({text: t.number + ": " + t.name, style:'header2',margin:[0,10]});
        doc.addContent(this.teamPage(t));
        doc.addContent({text: " ", pageBreak:'after'});
    });
    // Delete the last page break
    doc.chomp();
    doc.filename = (prefix+"-team-schedule.pdf").replace(/ /g, '-');
    return doc;
  }

  teamPage(team) {
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
      if (this.event.getSession(schedule[i].session_id).type === TYPES.BREAK && this.event.getSession(schedule[i].session_id).appliesTo.length > 0) continue;
      let row = [];
      let spot = schedule[i].teams.indexOf(team.id);
      let num =" ("+schedule[i].num+")";
      if ((schedule[i].teams.length - schedule[i].teams.indexOf((team.id))) <= schedule[i].surrogates) num = " ("+schedule[i].num+", surrogate)";
      if (this.event.getSession(schedule[i].session_id).type === TYPES.BREAK) num ="";

      let loc = this.event.getSession(schedule[i].session_id).locations[spot+schedule[i].loc];
      // if (this.event.getSession(schedule[i].session_id).type === TYPES.BREAK) loc = this.event.getSession(schedule[i].session_id).locations[0];
      if (this.event.getSession(schedule[i].session_id).type === TYPES.BREAK) loc = "";
      if (!loc) loc = "";
      row.push({text: schedule[i].time.time+num});
      row.push({text: this.event.getSession(schedule[i].session_id).name});
      row.push({text: ""+loc});
      t.body.push(row);
    }

    return {table: t, layout: 'lightHorizontalLines'};
  }
}