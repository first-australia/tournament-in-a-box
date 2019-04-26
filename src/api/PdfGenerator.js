import { TYPES } from '../api/SessionTypes';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export class PdfGenerator {
  constructor(event) {
    this._event = event;
    this.imageDict = {
        header: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlQAAABDCAYAAABa1JsjAAAACXBIWXMAAAsSAAALEgHS3X78AAABpElEQVR42u3ZMWoCURSG0V+ZyipgYWuKQLIK95AmreAGZglmIS4gjWtwCdMlkMK0U9imfdZiITNOCOI5/XvI9XH5YEallAAA0N/YCAAABBUAgKACABBUAACCCgAAQQUAIKgAAAQVAICgAgBAUAEACCoAAEEFACCoAAAQVAAAggoAQFABAAgqAAAEFQCAoAIAEFQAAIIKAABBBQDwx6ohLpl9vC6TLI3z7jXt27bueujw+LIzOpLU0/1n0+XA7/rJ7iFJmsn6u/PumW2+7B6SpG5Xz821l1QD/Zh5koX/hJ68HZLkwe7B7uFGds8Zn/wAAAQVAICgAgAQVAAAggoAAEEFACCoAAAEFQCAoAIAQFABAAgqAABBBQAgqAAAEFQAAIIKAEBQAQAIKgAABBUAgKACALgJ1UD37IySJD89z70bHT3fj92D3cN/vZ8To1KKUQIAXMEnPwAAQQUAIKgAAAQVAICgAgBAUAEACCoAAEEFACCoAAAQVAAAggoAQFABAAgqAAAEFQCAoAIAEFQAAIIKAABBBQAgqAAABBUAgKACAOCiI+CgIeNabmdzAAAAAElFTkSuQmCC',
        logo1: this._event.logoTopLeft,
        logo2: this._event.logoTopRight,
        logo3: this._event.logoBotLeft,
        logo4: this._event.logoBotRight,
    };
    this.styleDict = {
        header: {fontSize: this._event.titleFontSize,bold: true,alignment: 'center'},
        footer: {fontSize: this._event.baseFontSize+2,bold: true,alignment: 'center',color: 'grey'},
        header2: {fontSize: this._event.titleFontSize+2,bold: true,alignment: 'center'},
        tablebody: {fontSize: this._event.baseFontSize-4,alignment:'center'},
        extraTime: {alignment: 'center',color: 'red'},
        tablehead: {fontSize: this._event.baseFontSize-2,bold: true,alignment:'center'},
        breakrow: {bold: true,alignment:'center',fillColor: '#eeeeee'},
        teamEntry:{fontSize:this._event.baseFontSize, alignment:'center'}
    };
    console.log("Style Dictionary");
    console.log(this.styleDict);
  }

  get event() { return this._event; }

  makePDFs(fname) {
    let prefix=fname;
    let download = true;
    if (download && !fname) {
      prefix=prompt("File name prefix", this.event.title.replace(/ /g,"-"));
      if (prefix === null) return;
    }
    // for (let i = 0; i < this.event.teams.length; i++) {
    //   if (this.event.teams[i].name.length > 12) this.styleDict.teamEntry.fontSize -= 1;
    //   if (this.event.teams[i].name.length > 16) this.styleDict.teamEntry.fontSize -= 2;
    //   if (this.event.teams[i].name.length > 20) this.styleDict.teamEntry.fontSize -= 3;
    // }
    this.sessionPdf(TYPES.JUDGING,download,prefix);
    this.sessionPdf(TYPES.MATCH_ROUND,download,prefix);
    this.sessionPdf(TYPES.MATCH_ROUND_PRACTICE,download,prefix);
    this.sessionPdf(TYPES.TYPE_MATCH_FILLER,download,prefix);
    this.sessionPdf(TYPES.TYPE_MATCH_FILLER_PRACTICE,download,prefix);
    this.teamListPage(this.event.teams, download, prefix);
    this.daySchedulePage(download, prefix);
    this.allTeamsPdf(download,prefix);
    this.indivTeamsPdf(download,prefix);
  }

  sessionPdf(type, download,prefix) {
    this.buildDoc();
    this.event.sessions.filter(s=>s.type===type).forEach((session) => {
      try {
        if (session.nLocs > 4) {
          this.doc.pageOrientation='landscape';
          this.doc.background = this.landscapeBackground;
        }
        this.sessionPage(session);
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
    if (this.doc.content.length === 0) return;
    // Delete the last page break
    this.doc.content.splice(this.doc.content.length-1);
    try {
      if (download) pdfMake.createPdf(this.doc).download((prefix+"-"+type.name+"-schedule.pdf").replace(/ /g, "-"));
      else pdfMake.createPdf(this.doc).open();
    } catch (err) {
      alert ("Error printing: " + err.message);
    }
  }

  teamListPage(teams, download, prefix) {
      this.buildDoc();
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

      this.doc.content.push({text: "Team List", style:'header2',margin:[0,10]});
      this.doc.content.push({table: t,layout: 'lightHorizontalLines'});

      try {
          if (download) pdfMake.createPdf(this.doc).download((prefix+"-team-list.pdf").replace(/ /g, "-"));
          else pdfMake.createPdf(this.doc).open();
      } catch (err) {
          alert("Error printing: " + err.message);
      }
  }

  daySchedulePage(download, prefix) {
    this.buildDoc();
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
    this.doc.content.push({text: "Day Schedule", style:'header2',margin:[0,10]});
    this.doc.content.push({table: t,layout: 'lightHorizontalLines'});

    try {
        if (download) pdfMake.createPdf(this.doc).download((prefix+"-day-schedule.pdf").replace(/ /g, "-"));
        else pdfMake.createPdf(this.doc).open();
    } catch (err) {
        alert("Error printing: " + err.message);
    }
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
    this.doc.content.push({text: session.name + " Schedule", style:'header2',margin:[0,10]});
    this.doc.content.push({table: t,layout: 'lightHorizontalLines'});
    // if (session.usesSurrogates && session.fillerPolicy === USE_SURROGATES)
    //   this.doc.content.push({text:"\n* Surrogate team; results not counted",alignment:'center'});
    this.doc.content.push({text: " ", pageBreak:'after'});
  }

  allTeamsPdf(download,prefix) {
    this.buildDoc();
    this.doc.pageOrientation='landscape';
    this.doc.background = this.landscapeBackground;
    this.doc.content.push({text: "All Team Schedule", style:'header2',margin:[0,10]});
    let data = this.event.getIndivDataGrid(true);
    console.log(data);
    let N = data[3].length;
    let t = {headerRows: 2,dontBreakRows: true,keepWithHeaderRows: 1};
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
    this.doc.content.push({table: t, layout: 'lightHorizontalLines',alignment:'center'});
    if (download) pdfMake.createPdf(this.doc).download((prefix+"-individual-schedule.pdf").replace(/ /g, '-'));
    else pdfMake.createPdf(this.doc).open();
  }

  indivTeamsPdf(download,prefix) {
    this.buildDoc();
    this.event.teams.forEach(t => this.teamPage(t));
    // Delete the last page break
    this.doc.content.splice(this.doc.content.length-1);
    if (download) pdfMake.createPdf(this.doc).download((prefix+"-team-schedule.pdf").replace(/ /g, '-'));
    else pdfMake.createPdf(this.doc).open();
  }

  teamPage(team) {
    let schedule = [];
    for (let i = 0; i < team.schedule.length; i++)
    if (team.schedule[i].teams) schedule.push(team.schedule[i]);
    schedule.sort(function(a,b) {
      return a.time.mins - b.time.mins;
    });

    this.doc.content.push({text: team.number + ": " + team.name, style:'header2',margin:[0,10]});
    let t = {headerRows:1,dontBreakRows:true};
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
    this.doc.content.push({table: t, layout: 'lightHorizontalLines'});
    this.doc.content.push({text: " ", pageBreak:'after'});
  }


  buildDoc() {
    this.doc = {};
    this.doc.content = [];
    this.doc.header = {
      text: this.event.title,
      style: 'header',
      //Left, top, right, bottom
      margin: [0,50,0,20]
    };
    this.doc.background = function() {return [
      // margin: [left, top, right, bottom]
      {image: 'header', width: 530, height: 20, alignment: 'center', margin: [0,10,0,0]},
      {
        table: {
          widths: ['*','auto','*'],
          body: [
            [ {image: 'logo1', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
            {text: ""},
            {image: 'logo2', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
          ] ]
        },
        layout: 'noBorders',
      },
      {text: "", margin: 310, alignment: 'center'},
      {
        table: {
          widths: ['*','auto','*'],
          body: [
            [ {image: 'logo3', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
            {text: ""},
            {image: 'logo4', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
          ] ]
        },
        layout: 'noBorders',
      },
      {image: 'header', width: 530, height: 20, alignment: 'center'}
    ];};
    this.doc.footer={
      text: this.event.footerText,
      style: 'footer',
      margin:[0,50,0,0]
    };
    this.doc.pageMargins = [40,120,40,130];
    this.doc.pageSize = 'A4';
    this.doc.images = this.imageDict;
    this.doc.styles = this.styleDict;
  }

  landscapeBackground () {
    return [
      // margin: [left, top, right, bottom]
      {image: 'header', width: 800, height: 20, alignment: 'center', margin: [0,10,0,0]},
      {
        table: {
          widths: ['*','auto','*'],
          body: [
            [ {image: 'logo1', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
            {text: ""},
            {image: 'logo2', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
          ] ]
        },
        layout: 'noBorders',
      },
      {text: "", margin: 190, alignment: 'center'},
      {
        table: {
          widths: ['*','auto','*'],
          body: [
            [ {image: 'logo3', fit: [100,65], margin: [50,0,0,0], alignment: 'left'}, // Top left?
            {text: ""},
            {image: 'logo4', fit: [100,65], margin: [50,0,0,0], alignment: 'right'} // Top right
          ] ]
        },
        layout: 'noBorders',
      },
      {image: 'header', width: 800, height: 20, alignment: 'center'}
    ];
  }

}