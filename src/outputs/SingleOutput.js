import {TYPES} from '../api/SessionTypes';
import {
    MakeSessionPDF,
    MakeDaySchedulePdf,
    MakePracticeTableSignupPdf
    // MakeCoreValuesAllocationsPDF
} from "./SessionOutputs";
import {MakeTeamListPDF, MakeAllTeamsPDF, MakeIndivTeamsPDF} from "./TeamOutputs";
import {MakePitSignsPdf, MakeLocationSignsPdf, MakeAwardCertPdf, MakeParticipationCertPdf} from "./SignOutputs";
import {MakeScoringSystemCSV} from "./DataOutputs";
import {MakeVolunteerListPdf, MakeSigninPdf} from "./VolunteerOutputs";
import {MakeClosingPresentation} from "../outputs/PresentationOutput";

import {Zipper} from "./Zipper";
import {saveToFile_csv} from "../scheduling/utilities";

export class SingleOutput {
    constructor(event, saveFunc) {
        this._event = event;
        this.save = saveFunc;
        this.funcs = [
            () => this.getPDF(MakeSessionPDF(event, TYPES.JUDGING), 2 * this.event.nJudges + 5),
            // () => this.getPDF(MakeCoreValuesAllocationsPDF(event), "", this.event.nJudges + 2),
            () => this.getPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND), 20),
            () => this.getPDF(MakeSessionPDF(event, TYPES.MATCH_ROUND_PRACTICE), 20),
            // () => this.getPDF(MakeSessionPDF(event, TYPES.MATCH_FILLER), 20),
            // () => this.getPDF(MakeSessionPDF(event, TYPES.MATCH_FILLER_PRACTICE), 20),
            () => this.getPDF(MakeTeamListPDF(event), 20),
            () => this.getPDF(MakeDaySchedulePdf(event), this.event.nTeams + 20 + 2 * this.event.nJudges),
            () => this.getPDF(MakeAllTeamsPDF(event), 4),
            () => this.getPDF(MakeIndivTeamsPDF(event), 2),
            () => this.getPDF(MakePitSignsPdf(event), 2),
            () => this.getPDF(MakeVolunteerListPdf(event), 2),
            () => this.getPDF(MakeLocationSignsPdf(event), 2),
            () => this.getPDF(MakeSigninPdf(event), 2),
            () => this.getPDF(MakePracticeTableSignupPdf(event), 4),
            () => this.getPDF(MakeAwardCertPdf(event), 2),
            () => this.getPDF(MakeParticipationCertPdf(event), 10),
            () => this.getCSV(MakeScoringSystemCSV(event)),
            () => this.getSponsors(this.event.sponsors.national, "scoring-system"),
            () => this.getSponsors(this.event.sponsors.local, "scoring-system"),
            () => this.getPPT(MakeClosingPresentation(event))
        ];

    }

    static funcNames = [ // Must be the same order as "func" above
        "Judging schedule",
        // () => this.getPDF(MakeCoreValuesAllocationsPDF(event), "", this.event.nJudges + 2),
        "Match schedule",
        "Practice match schedule",
        // "Filler match schedule",
        // "Filler practice match schedule",
        "Team list",
        "Day schedule",
        "All-team schedule",
        "Individual team schedule",
        "Pit signs",
        "Volunteer list",
        "Location signs",
        "Volunteer sign in sheet",
        "Practice table sign up sheet",
        "Award certificates",
        "Participation certificates",
        "Scoring system import file",
        "National sponsors",
        "Local sponsors",
        "Closing ceremony powerpoint"
    ];


    get(idx) {
      this.funcs[idx]();
    }

    getPDF(pdf, count) {
        if (!pdf) return;
        try {
            pdf.download(pdf.filename+"_"+count+".pdf");
        } catch (err) {
            alert("Error saving: " + pdf.filename + "; " + err.message);
        }
    }

    getSponsors(sponsors, name) {
      let z = new Zipper(this._event, this.save);
      if (z.zipSponsors(sponsors, name))
        z.DownloadZip();
    }

    getCSV(csv) {
        if (!csv) return;
        console.log(csv);
        try {
            saveToFile_csv(csv.filename + ".csv", csv.data);
        } catch (err) {
            alert("Error saving: " + csv.filename + ".csv ; " + err.message);
        }
    }

    getPPT(ppt) {
        if (!ppt) return;
        try {
            ppt.download(); //(ppt.filename + ".pptx", ppt.getBlobPromise());
        } catch (err) {
            alert("Error saving: " + ppt.filename + "; " + err.message);
        }
    }
    get event() {
        return this._event;
    }

    get length() {
        return this.funcs.length;
    }
}
