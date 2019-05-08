import { TYPES } from '../api/SessionTypes';
import { MakeSessionPDF, MakeDaySchedulePdf, MakePracticeTableSignupPdf } from "./SessionOutputs";
import { MakeTeamListPDF, MakeAllTeamsPDF, MakeIndivTeamsPDF } from "./TeamOutputs";
import { MakePitSignsPdf, MakeLocationSignsPdf, MakeAwardCertPdf, MakeParticipationCertPdf } from "./SignOutputs";
import { MakeScoringSystemCSV } from "./DataOutputs";
import { MakeVolunteerListPdf, MakeSigninPdf } from "./VolunteerOutputs";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export class Zipper {
  constructor(event, saveFunc) {
    this._event = event;
    this.save = saveFunc;
    this._idx = 0;
    this.zipname = this.event.title.replace(' ','_');
    this.funcs = [
      () => this.zipPDF(MakeSessionPDF(event, TYPES.JUDGING), "judging"),
      () => this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND), "field"),
      () => this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND_PRACTICE), "field"),
      () => this.zipPDF(MakeSessionPDF(event, TYPES.TYPE_MATCH_FILLER), "field"),
      () => this.zipPDF(MakeSessionPDF(event, TYPES.TYPE_MATCH_FILLER_PRACTICE), "field"),
      () => this.zipPDF(MakeTeamListPDF(event)),
      () => this.zipPDF(MakeDaySchedulePdf(event)),
      () => this.zipPDF(MakeAllTeamsPDF(event)),
      () => this.zipPDF(MakeIndivTeamsPDF(event), "teams"),
      () => this.zipPDF(MakePitSignsPdf(event), "signage"),
      () => this.zipPDF(MakeVolunteerListPdf(event), "volunteers"),
      () => this.zipPDF(MakeLocationSignsPdf(event), "signage"),
      () => this.zipPDF(MakeSigninPdf(event), "volunteers"),
      () => this.zipPDF(MakePracticeTableSignupPdf(event), "signage"),
      () => this.zipPDF(MakeAwardCertPdf(event), "certificates"),
      () => this.zipPDF(MakeParticipationCertPdf(event), "certificates"),
      () => this.zipCSV(MakeScoringSystemCSV(event), "scoring-system"),
      () => this.zipSponsors(this.event.sponsors.national, "scoring-system"),
      () => this.zipSponsors(this.event.sponsors.local, "scoring-system"),
    ];
    this.zip = new JSZip();
  }

  ProcessNext() {
    this.funcs[this._idx++]();
  }

  DownloadZip() {
    this.zip.generateAsync({type:"blob"})
      .then((content) => {
          saveAs(content, this.zipname+".zip");
    });
  }

  zipPDF(pdf, folder) {
    if (!pdf) return;
    let loc = (folder) ? this.zip.folder(folder) : this.zip;
    try {
      loc.file(pdf.filename, pdf.getBlobPromise());
    } catch (err) {
        alert("Error saving: " + pdf.filename + "; " + err.message);
    }
  }

  zipCSV(csv, folder) {
    if (!csv) return;
    console.log(csv);
    let loc = (folder) ? this.zip.folder(folder) : this.zip;
    try {
      loc.file(csv.filename+".csv", new Blob([csv.data], {type : 'application/csv'}));
    } catch (err) {
        alert("Error saving: " + csv.filename + ".csv ; " + err.message);
    }
  }

  zipSponsors(sponsors, folder) {
    let loc = (folder) ? this.zip.folder(folder) : this.zip;
    this.zipAllLogos(sponsors, loc);
  }

  zipAllLogos(logos, zip) {
    logos.forEach(im => {
      var uri = im.data;
      var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
      var content = uri.substring(idx);
      zip.file(im.name+"."+im.extension, content, {base64: true});
    });
  }

  get event() { return this._event; }
  get length() { return this.funcs.length; }
  get FilesLeft() { return this.funcs.length - this._idx; }
  get idx() { return this._idx; }
}
