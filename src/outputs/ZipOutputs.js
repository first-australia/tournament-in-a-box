import { TYPES } from '../api/SessionTypes';
import { MakeSessionPDF, MakeDaySchedulePdf, MakePracticeTableSignupPdf } from "./SessionOutputs";
import { MakeTeamListPDF, MakeAllTeamsPDF, MakeIndivTeamsPDF } from "./TeamOutputs";
import { MakePitSignsPdf, MakeLocationSignsPdf, MakeAwardCertPdf, MakeParticipationCertPdf } from "./SignOutputs";
import { MakeScoringSystemCSV } from "./DataOutputs";
import { MakeVolunteerListPdf, MakeSigninPdf } from "./VolunteerOutputs";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function ZipAll(event, saveFunc) {
  let value = event.title.replace(/ /g,"-");
  let zip = new JSZip();
  let sponsors = zip.folder("sponsors");
  zipAllPDFs(event, value, zip);
  zipAllLogos(event, sponsors);
  zipAllCSVs(event, value, zip);
  saveFunc(value,zip);
  zip.generateAsync({type:"blob"})
    .then((content) => {
        saveAs(content, value+".zip");
  });
}

function zipAllCSVs(event, filename, zip) {
  let csv = MakeScoringSystemCSV(event);
  try {
    zip.file(filename+".csv", new Blob([csv], {type : 'application/csv'}));
  } catch (err) {
      alert("Error saving: " + filename + ".csv ; " + err.message);
  }
  // if (download) {
  //   saveToFile_csv(filename+".csv", csv);
  // }
}

function zipAllPDFs(event, prefix, zip) {
  let PDFs = [];
  PDFs.push(MakeSessionPDF(event, TYPES.JUDGING,prefix));
  PDFs.push(MakeSessionPDF(event, TYPES.MATCH_ROUND,prefix));
  PDFs.push(MakeSessionPDF(event, TYPES.MATCH_ROUND_PRACTICE,prefix));
  PDFs.push(MakeSessionPDF(event, TYPES.TYPE_MATCH_FILLER,prefix));
  PDFs.push(MakeSessionPDF(event, TYPES.TYPE_MATCH_FILLER_PRACTICE,prefix));
  PDFs.push(MakeTeamListPDF(event, prefix));
  PDFs.push(MakeDaySchedulePdf(event, prefix));
  PDFs.push(MakeAllTeamsPDF(event, prefix));
  PDFs.push(MakeIndivTeamsPDF(event, prefix));
  PDFs.push(MakePitSignsPdf(event, prefix));
  PDFs.push(MakeVolunteerListPdf(event, prefix));
  PDFs.push(MakeLocationSignsPdf(event, prefix));
  PDFs.push(MakeSigninPdf(event, prefix));
  PDFs.push(MakePracticeTableSignupPdf(event, prefix));
  PDFs.push(MakeAwardCertPdf(event, prefix));
  PDFs.push(MakeParticipationCertPdf(event, prefix));

  PDFs.filter(D=>D!=null).forEach(D => {
    try {
      zip.file(D.filename, D.getBlobPromise());
    } catch (err) {
        alert("Error saving: " + D.filename + "; " + err.message);
    }
  });
}

function zipAllLogos(event, zip) {
  event.sponsors.national.forEach(im => {
    var uri = im.data;
    var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
    var content = uri.substring(idx);
    zip.file(im.name+"."+im.extension, content, {base64: true});
  });
  event.sponsors.local.forEach(im => {
    var uri = im.data;
    var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
    var content = uri.substring(idx);
    zip.file(im.name+"."+im.extension, content, {base64: true});
  });
}
