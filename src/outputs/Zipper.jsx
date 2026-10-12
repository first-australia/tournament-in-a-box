import { TYPES } from '../api/SessionTypes';
import {
  MakeSessionPDF,
  MakeDaySchedulePdf,
  MakePracticeTableSignupPdf
  // MakeCoreValuesAllocationsPDF
} from './SessionOutputs';
import {
  MakeTeamListPDF,
  MakeAllTeamsPDF,
  MakeIndivTeamsPDF
} from './TeamOutputs';
import {
  MakePitSignsPdf,
  MakeLocationSignsPdf,
  MakeAwardCertPdf,
  MakeParticipationCertPdf
} from './SignOutputs';
import { MakeScoringSystemCSV, MakeAppImportCsv } from './DataOutputs';
import { MakeVolunteerListPdf, MakeSigninPdf } from './VolunteerOutputs';
import { MakeClosingPresentation } from '../outputs/PresentationOutput';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export class Zipper {
  constructor(event, saveFunc) {
    this._event = event;
    this.save = saveFunc;
    this._idx = 0;
    this.zipname = this.event.title.replace(' ', '_');
    this.funcs = [
      () =>
        this.zipPDF(
          MakeSessionPDF(event, TYPES.JUDGING),
          '',
          2 * this.event.nJudges + 5
        ),
      // () => this.zipPDF(MakeCoreValuesAllocationsPDF(event), "", this.event.nJudges + 2),
      () => this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND), '', 20),
      () =>
        this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND_PRACTICE), '', 20),
      // () => this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_FILLER), "", 20),
      // () => this.zipPDF(MakeSessionPDF(event, TYPES.MATCH_FILLER_PRACTICE), "", 20),
      () => this.zipPDF(MakeTeamListPDF(event), '', 20),
      () =>
        this.zipPDF(
          MakeDaySchedulePdf(event),
          '',
          this.event.nTeams + 20 + 2 * this.event.nJudges
        ),
      () => this.zipPDF(MakeAllTeamsPDF(event), '', 4),
      () => this.zipPDF(MakeIndivTeamsPDF(event), '', 2),
      () => this.zipPDF(MakePitSignsPdf(event), 'signage', 2),
      () => this.zipPDF(MakeVolunteerListPdf(event), 'volunteers', 2),
      () => this.zipPDF(MakeLocationSignsPdf(event), 'signage', 2),
      () => this.zipPDF(MakeSigninPdf(event), 'volunteers', 2),
      () => this.zipPDF(MakePracticeTableSignupPdf(event), 'signage', 4),
      () => this.zipPDF(MakeAwardCertPdf(event), 'certificates', 2),
      () => this.zipPDF(MakeParticipationCertPdf(event), 'certificates', 10),
      () => this.zipCSV(MakeScoringSystemCSV(event), 'scoring-system'),
      () => this.zipCSV(MakeAppImportCsv(event), 'app-import'),
      () => this.zipSponsors(this.event.sponsors.national, 'scoring-system'),
      () => this.zipSponsors(this.event.sponsors.local, 'scoring-system'),
      () => this.zipPPT(MakeClosingPresentation(event))
    ];
    this.zip = new JSZip();
  }

  ProcessNext() {
    this.funcs[this._idx++]();
  }

  ProcessGiven(idx) {
    console.log('Processing ' + idx);
    this.funcs[idx]();
    this._idx = idx;
  }

  DownloadZip() {
    this.zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, this.zipname + '.zip');
    });
  }

  zipPDF(pdf, folder, count) {
    if (!pdf) return;
    let loc = folder ? this.zip.folder(folder) : this.zip;
    try {
      console.log("Zipping " + pdf.filename);
      loc.file(pdf.filename + '_' + count + '.pdf', pdf.getBlobPromise());
    } catch (err) {
      alert('Error saving: ' + pdf.filename + '; ' + err.message);
    }
  }

  zipCSV(csv, folder) {
    if (!csv) return;
    console.log(csv);
    let loc = folder ? this.zip.folder(folder) : this.zip;
    try {
      loc.file(
        csv.filename + '.csv',
        new Blob([csv.data], { type: 'application/csv' })
      );
    } catch (err) {
      alert('Error saving: ' + csv.filename + '.csv ; ' + err.message);
    }
  }

  zipSponsors(sponsors, folder) {
    if (sponsors.length === 0) return false;
    let loc = folder ? this.zip.folder(folder) : this.zip;
    this.zipAllLogos(sponsors, loc);
    return true;
  }

  zipPPT(ppt, folder) {
    if (!ppt) return;
    let loc = folder ? this.zip.folder(folder) : this.zip;
    try {
      loc.file(ppt.filename + '.pptx', ppt.getBlobPromise());
    } catch (err) {
      alert('Error saving: ' + ppt.filename + '; ' + err.message);
    }
  }

  zipAllLogos(logos, zip) {
    logos.forEach(im => {
      var uri = im.data;
      var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
      var content = uri.substring(idx);
      zip.file(im.name + '.' + im.extension, content, { base64: true });
    });
  }

  get event() {
    return this._event;
  }

  get length() {
    return this.funcs.length;
  }

  get FilesLeft() {
    return this.funcs.length - this._idx;
  }

  get idx() {
    return this._idx;
  }
}
