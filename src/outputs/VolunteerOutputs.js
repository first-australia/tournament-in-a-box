import { PdfDoc } from "../templates/PdfDoc";

export function MakeVolunteerListPdf(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  let t = {headerRows: 1, dontBreakRows: true};
  t.widths = new Array(2);
  t.widths[0] = 200;
  t.widths[1] = 300;
  t.body = [];
  t.body.push(["Role", "Name"]);

  let colorDark = false;
  event.volunteers.forEach(v => {
    colorDark = !colorDark;
      v.staff.forEach((s,i) => {
        if (s === "") return;
        t.body.push([
          {text: (i === 0 ? v.name : ""), fillColor: (colorDark?"#eee":"#fff")},
          {text: s, fillColor: (colorDark?"#eee":"#fff")}]);
      });
  });

  doc.addContent({text: "Volunteer List", style:'header2',margin:[0,10]});
  doc.addContent({table: t, layout: 'lightHorizontalLines'});

  doc.filename = ("vol-list").replace(/ /g, "-");
  return doc;
}

export function MakeSigninPdf(event) {
  let doc = new PdfDoc(event.pageFormat, event.title, false);

  let t = {headerRows: 1, dontBreakRows: true};
  t.widths = new Array(3);
  t.widths[0] = 100;
  t.widths[1] = 200;
  t.widths[2] = 200;
  t.body = [];
  let header = [];
  header.push({text:"Name"});
  header.push({text:"Role/s"});
  header.push({text:"Signed in?"});
  t.body.push(header);

  // Reorganise volunteers into a dict.
  let data = {};
  event.volunteers.forEach(v => {
    v.staff.forEach(s => {
      let name = s;
      if (name === "")
        name = "[UNDEFINED]";
      if (data[name])
        data[name] = data[name] + ", " + v.name;
      else
        data[name] = v.name;
    });
  });

  Object.keys(data).sort().forEach(k => {
    let row = [];
    if (k === "[UNDEFINED]") {
      return;
    } else {
      row.push({text: k});
      row.push({text: data[k]});
      row.push({text: ""});
    }
    t.body.push(row);
  });

  doc.addContent({text: "Volunteer Sign-on sheet", style:'header2',margin:[0,10]});
  doc.addContent({table: t, layout: 'lightHorizontalLines'});
  // === UNASSIGNED === //
  /*
  doc.addPageBreak();
  doc.addContent({text: "Unassigned volunteers", style:'header2',margin:[0,10]});

  if (data["[UNDEFINED]"]) {

    t = {headerRows: 1, dontBreakRows: true};
    t.widths = new Array(3);
    t.widths[0] = 100;
    t.widths[1] = 200;
    t.widths[2] = 200;
    t.body = [];
    let header = [];
    header.push({text:"Role"});
    header.push({text:"Signed in?"});
    t.body.push(header);


    // t.body.push({text: "Unassigned roles", colSpan: 3, color: "grey"})
    t.body.push([{text: "Unassigned roles"}, {text: ""}, {text: ""}]);
    let undef = data["[UNDEFINED]"].split(", ").sort();
    undef.forEach(r => {
      t.body.push([{text: r}, {text: ""}, {text: ""}]);
    });
  }
  doc.addContent({table: t, layout: 'lightHorizontalLines'});
  */
  doc.filename = ("vol-sign-in").replace(/ /g, "-");
  return doc;
}
