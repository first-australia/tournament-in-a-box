import { TeamParams } from "./TeamParams";
import { TYPES } from "./SessionTypes";
import { DateTime } from "./DateTime";
import SessionParams from "./SessionParams";

//import {toDataUrl} from "../scheduling/utilities";

import Instance from "../scheduling/Instance";
import { overlaps, shuffle } from "../scheduling/utilities";

import { PageFormat } from "./PageFormat";

// National sponsors
// import mqlogo from "../resources/national-sponsors/mq.png";
// import fordlogo from "../resources/national-sponsors/ford.png";
// import googlelogo from "../resources/national-sponsors/google.jpg";
// import legoedlogo from "../resources/national-sponsors/legoEd.png";
import PreComputedImages from "../resources/images.json";
import Volunteers from "../templates/volunteers.json";

export class EventParams {
  static AWARD_STYLES = [
    "Champion only",
    "Required only",
    "Required and optional (winner only)",
    "Required and optional (1 finalist )",
    "Required and optional (2 finalist )",
    "Required and optional (3 finalist )",
  ];

  static AWARD_NAMES = [
    ["Champion's Award"],
    [
      "Coach/Mentor Award",
      "Robot Performance Award",
      "Robot Design Award",
      "Innovation Project Award",
      "Core Values Award",
      "Champion's Award",
    ],
    [
      "Motivate Award",
      "Rising All-Star Award",
      "Engineering Excellence Award",
      "Breakthrough Award",
      "Coach/Mentor Award",
      "Robot Performance Award",
      "Robot Design Award",
      "Innovation Project Award",
      "Core Values Award",
      "Champion's Award",
    ],
    [
      "Motivate Award Finalist",
      "Motivate Award Winner",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Winner",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Winner",
      "Breakthrough Award Finalist",
      "Breakthrough Award Winner",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Winner",
      "Robot Performance Award Finalist",
      "Robot Performance Award Winner",
      "Robot Design Award Finalist",
      "Robot Design Award Winner",
      "Innovation Project Award Finalist",
      "Innovation Project Award Winner",
      "Core Values Award Finalist",
      "Core Values Award Winner",
      "Champion's Award Finalist",
      "Champion's Award Winner",
    ],
    [
      "Motivate Award Finalist",
      "Motivate Award Finalist",
      "Motivate Award Winner",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Winner",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Winner",
      "Breakthrough Award Finalist",
      "Breakthrough Award Finalist",
      "Breakthrough Award Winner",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Winner",
      "Robot Performance Award Finalist",
      "Robot Performance Award Finalist",
      "Robot Performance Award Winner",
      "Robot Design Award Finalist",
      "Robot Design Award Finalist",
      "Robot Design Award Winner",
      "Innovation Project Award Finalist",
      "Innovation Project Award Finalist",
      "Innovation Project Award Winner",
      "Core Values Award Finalist",
      "Core Values Award Finalist",
      "Core Values Award Winner",
      "Champion's Award Finalist",
      "Champion's Award Finalist",
      "Champion's Award Winner",
    ],
    [
      "Motivate Award Finalist",
      "Motivate Award Finalist",
      "Motivate Award Finalist",
      "Motivate Award Winner",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Finalist",
      "Rising All-Star Award Winner",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Finalist",
      "Engineering Excellence Award Winner",
      "Breakthrough Award Finalist",
      "Breakthrough Award Finalist",
      "Breakthrough Award Finalist",
      "Breakthrough Award Winner",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Finalist",
      "Coach/Mentor Award Winner",
      "Robot Performance Award Finalist",
      "Robot Performance Award Finalist",
      "Robot Performance Award Finalist",
      "Robot Performance Award Winner",
      "Robot Design Award Finalist",
      "Robot Design Award Finalist",
      "Robot Design Award Finalist",
      "Robot Design Award Winner",
      "Innovation Project Award Finalist",
      "Innovation Project Award Finalist",
      "Innovation Project Award Finalist",
      "Innovation Project Award Winner",
      "Core Values Award Finalist",
      "Core Values Award Finalist",
      "Core Values Award Finalist",
      "Core Values Award Winner",
      "Champion's Award Finalist",
      "Champion's Award Finalist",
      "Champion's Award Finalist",
      "Champion's Award Winner",
    ],
  ];

  constructor(
    version,
    title = "Tournament",
    nTeams = 24,
    startTime = new DateTime(9 * 60),
    endTime = new DateTime(9 * 17)
  ) {
    this._version = version;
    this.title = title;
    let id = Math.floor(Math.random() * 100 + 1);
    let A = [];
    while (nTeams > 0) {
      A.push(new TeamParams(id, nTeams));
      nTeams--;
      id += Math.floor(Math.random() * 100 + 1);
    }

    this.uid_counter = 1;

    this.teams = A.sort((a, b) => {
      return parseInt(a.number, 10) - parseInt(b.number, 10);
    });

    this.startTime = startTime;
    this.endTime = endTime;

    this.minTravel = 10;
    this.extraTime = 5;
    this.sessions = [];
    this.days = ["Day 1"];
    this.startTime.days = this.days;
    this.endTime.days = this.days;
    this.pilot = false;
    this.consolidatedAwards = false;
    this.awardStyle = EventParams.AWARD_STYLES[2];
    this.judgesAwards = 0;
    this.awards = EventParams.AWARD_NAMES[2];
    this.nTables = 4;
    this.nPracs = 0;
    this.sponsors = {
      national: [],
      local: [],
    };
    PreComputedImages.nationalSponsors.forEach((x) =>
      this.addNationalSponsor(x)
    );

    this._volunteers = null;
    this.tempNames = null;
    this.pageFormat = null;

    // console.log(this.logoBotRight);
    this.errors = Infinity;
    // this.populateFLL();
  }

  populateFLL() {
    // Set team names
    if (this.tempNames) {
      let lines = this.tempNames.split("\n");
      this.teams.forEach((t) => {
        let savedName = t.name;
        let savedNum = t.number;
        let savedAffil = t.affiliation;
        let savedPit = t.pitNum;
        if (lines.length > 0) {
          let l = lines.shift().replace(/,/g, "\t");
          let fields = l.split("\t");
          if (fields.length > 3) {
            t.number = fields[0];
            t.name = fields[1];
            t.affiliation = fields[2];
            t.pitNum = fields[3];
          } else if (fields.length > 2) {
            t.number = fields[0];
            t.name = fields[1];
            t.affiliation = fields[2];
          } else if (fields.length > 1) {
            t.number = fields[0];
            t.name = fields[1];
          } else {
            t.name = l;
          }
        }
        if (t.name === "") t.name = savedName;
        if (t.number === "") t.number = savedNum;
        if (t.affiliation === "") t.affiliation = savedAffil;
        if (t.pitNum === "") t.pitNum = savedPit;
      });
    }
    // toDataUrl(mqlogo, (base) => {this.addNationalSponsor(base);});
    // toDataUrl(googlelogo, (base) => {this.addNationalSponsor(base);});
    // toDataUrl(fordlogo, (base) => {this.addNationalSponsor(base);});
    // toDataUrl(legoedlogo, (base) => {this.addNationalSponsor(base);});
    this.pageFormat = new PageFormat();
    console.log("B");

    this.teams = this.teams.sort((a, b) => {
      return parseInt(a.number, 10) - parseInt(b.number, 10);
    });

    const nAwardsNeeded = this.nTeams * 0.4;
    const distances = EventParams.AWARD_NAMES.map((a) =>
      Math.abs(a.length - nAwardsNeeded)
    );
    console.log(distances);
    const closestIdx = distances.findIndex((d) => d === Math.min(...distances));
    this.awardStyleIdx = closestIdx;
    // this.consolidatedAwards = this.nTeams * 0.4 < 8;
    // console.log(this.consolidatedAwards);
    // console.log(this.nTeams * 0.4);
    // let nCoreAwards = this.consolidatedAwards ? 4 : 10;
    // this.judgesAwards = Math.min(
    //   Math.max(Math.ceil(this.nTeams * 0.4) - nCoreAwards, 0),
    //   6
    // );

    // First guesses at all schedule parameters.  User can then tweak to their hearts' content without auto updates
    let actualStart = this.startTime.clone(30);
    let actualEnd = this.endTime.clone(this.consolidatedAwards ? -30 : -60);
    let nLocs = Math.ceil(this.nTeams / 4); // At a guess, see 4 teams each
    let nJudgings = Math.ceil(this.nTeams / nLocs);

    let startLunch = new DateTime(
      Math.max(actualStart.mins + nJudgings * 15, 12 * 60),
      this.days
    );
    let endLunch = startLunch.clone(30);

    this.sessions.push(
      new SessionParams(
        this.uid_counter++,
        TYPES.BREAK,
        "Opening Ceremony",
        1,
        this.startTime.clone(),
        actualStart.clone(),
        true
      )
    );
    this.getSession(this.uid_counter - 1).universal = true;
    this.sessions.push(
      new SessionParams(
        this.uid_counter++,
        TYPES.BREAK,
        "Lunch" + (this.nDays > 1 ? " 1" : ""),
        1,
        startLunch.clone(),
        endLunch.clone()
      )
    );
    this.getSession(this.uid_counter - 1).universal = true;
    this.sessions.push(
      new SessionParams(
        this.uid_counter++,
        TYPES.BREAK,
        "Closing Ceremony",
        1,
        actualEnd.clone(),
        this.endTime.clone(),
        true
      )
    );
    this.getSession(this.uid_counter - 1).universal = true;

    let nightStart = new DateTime(this.endTime.mins % (24 * 60), this.days);
    let nightEnd = this.startTime.clone();

    for (let i = 1; i < this.days.length; i++) {
      nightEnd = nightEnd.clone(24 * 60);
      this.sessions.push(
        new SessionParams(
          this.uid_counter++,
          TYPES.BREAK,
          "Night" + (this.nDays > 2 ? " " + i : ""),
          1,
          nightStart.clone(),
          nightEnd.clone(),
          true
        )
      );
      this.getSession(this.uid_counter - 1).universal = true;
      nightStart = nightStart.clone(24 * 60);

      this.sessions.push(
        new SessionParams(
          this.uid_counter++,
          TYPES.BREAK,
          "Lunch " + (i + 1),
          1,
          startLunch.clone(24 * 60),
          endLunch.clone(24 * 60)
        )
      );
      this.getSession(this.uid_counter - 1).universal = true;
    }

    let timeAvailable = this.endTime.mins - this.startTime.mins;
    this.sessions
      .filter((s) => s.type === TYPES.BREAK)
      .forEach((s) => {
        timeAvailable = timeAvailable - (s.endTime.mins - s.startTime.mins);
      });

    if (this.pilot) {
      // let rdLen = matchLen + matchBuf;
      // let rdBuf = 0;
      let rdLen = 10;
      let rdBuf = 5;
      let rdOverlap =
        this.nTables === 2 ? 0 : 15 - Math.ceil(30 / this.nTables);

      timeAvailable =
        timeAvailable - (this.nTeams / 2) * (rdLen + rdBuf - rdOverlap);
      let timePerMatch = Math.floor(
        timeAvailable / ((this.nTeams * (2 + this.nPracs)) / 2)
      );

      let matchLen = Math.min(timePerMatch, 4);
      let matchBuf = Math.max(timePerMatch - matchLen - 1, 0);
      let matchOverlap = 0; //If matches need an overlap, set it here.

      let nSims = 2;
      for (let i = 1; i <= this.nPracs; i++) {
        let S = new SessionParams(
          this.uid_counter++,
          TYPES.MATCH_ROUND_PRACTICE,
          "Practice Round " + i,
          this.nTables,
          actualStart.clone(),
          actualEnd.clone()
        );
        S.nSims = nSims;
        S.len = matchLen;
        S.buf = matchBuf;
        S.overlap = 0;
        this.sessions.push(S);
      }
      for (let i = 1; i <= 3; i++) {
        let S = new SessionParams(
          this.uid_counter++,
          TYPES.MATCH_ROUND,
          "Round " + i,
          this.nTables,
          actualStart.clone(),
          actualEnd.clone()
        );
        S.nSims = nSims;
        S.len = i === 1 ? rdLen : matchLen;
        S.buf = i === 1 ? rdBuf : matchBuf;
        S.overlap = i === 1 ? rdOverlap : matchOverlap;
        this.sessions.push(S);
      }
      let roundOneLength = (rdLen + rdBuf - rdOverlap) * (this.nTeams / 2);
      let roundOneEnd = actualStart.mins + roundOneLength;
      console.log(this.sessions[1]);
      console.log(roundOneEnd);
      let dif = Math.ceil(roundOneEnd - this.sessions[1].startTime.mins);
      console.log(dif);
      if (dif > 0) {
        this.sessions[1].startTime = this.sessions[1].startTime.clone(dif);
        this.sessions[1].endTime = this.sessions[1].endTime.clone(dif);
      }
    } else {
      let timePerMatch = Math.floor(
        timeAvailable / ((this.nTeams * (3 + this.nPracs)) / 2)
      );

      let matchLen = Math.min(timePerMatch, 4);
      let matchBuf = Math.max(timePerMatch - matchLen - 1, 0);
      let matchOverlap = 0; //If matches need an overlap, set it here.

      let bufDiff = 3 + this.nPracs - 1; // Make the first round slower than the rest

      let nSims = 2;
      let first = true;
      for (let i = 1; i <= this.nPracs; i++) {
        let S = new SessionParams(
          this.uid_counter++,
          TYPES.MATCH_ROUND_PRACTICE,
          "Practice Round " + i,
          this.nTables,
          actualStart.clone(),
          actualEnd.clone()
        );
        S.nSims = nSims;
        S.len = matchLen;
        S.buf = first ? matchBuf + bufDiff : matchBuf - 1;
        S.overlap = matchOverlap;
        this.sessions.push(S);
        first = false;
      }
      for (let i = 1; i <= 3; i++) {
        let S = new SessionParams(
          this.uid_counter++,
          TYPES.MATCH_ROUND,
          "Round " + i,
          this.nTables,
          actualStart.clone(),
          actualEnd.clone()
        );
        S.nSims = nSims;
        S.len = matchLen;
        S.buf = first ? matchBuf + bufDiff : matchBuf - 1;
        S.overlap = matchOverlap;
        this.sessions.push(S);
        first = false;
      }
      // this.sessions.push(new SessionParams(this.uid_counter++, TYPES.JUDGING, "Robot Design Judging", nLocs,
      //     actualStart.clone(), actualEnd.clone()));
      // this.sessions.push(new SessionParams(this.uid_counter++, TYPES.JUDGING, "Core Values Judging", nLocs,
      //     actualStart.clone(), actualEnd.clone()));
    }
    this.sessions.push(
      new SessionParams(
        this.uid_counter++,
        TYPES.JUDGING,
        "Judging",
        nLocs,
        actualStart.clone(),
        actualEnd.clone()
      )
    );

    this.sessions.sort((a, b) => {
      return a.startTime === b.startTime
        ? a.id - b.id
        : a.startTime.mins - b.startTime.mins;
    });

    this.volunteers = [];
    this.buildVolunteerSheet();
  }

  buildVolunteerSheet(nJudges) {
    if (!nJudges) {
      nJudges = this.sessions.find((s) => {
        return s.type === TYPES.JUDGING;
      }).nLocs;
    }
    // NOTE: Have to make sure that if volunters have already been designed, we just update the numbers.
    if (this.volunteers.length > 0) {
      // Just recalculate the number of volunteers
      this.volunteers.forEach((v) => {
        let numberOfVols = v.count;
        if (v.per === "1") numberOfVols *= 1;
        else if (v.per === "RDJ")
          // Volunteers per robot design judging session
          numberOfVols *= nJudges;
        else if (v.per === "CVJ")
          // Volunteers per core values judging session
          numberOfVols *= nJudges;
        else if (v.per === "RPJ")
          // Volunteers per project judging session
          numberOfVols *= nJudges;
        else if (v.per === "J")
          // Volunteers per project judging session
          numberOfVols *= nJudges;
        else if (v.per === "T")
          // Volunteers per robot table
          numberOfVols *= this.nTables;
        nJudges = this.sessions.find((s) => {
          return s.type === TYPES.JUDGING;
        }).nLocs;
        while (v.staff.length < numberOfVols) v.staff.push("");
        while (v.staff.length > numberOfVols) {
          let S = v.staff.pop();
          if (S !== "") {
            v.staff.push(S);
            break;
          }
        }
      });
    } else {
      Volunteers.roles.forEach((v) => {
        let vol = { name: v.name, count: v.count, per: v.per };
        vol.staff = [];
        let numberOfVols = v.count;
        if (v.per === "1") numberOfVols *= 1;
        else if (v.per === "RDJ")
          // Volunteers per robot design judging session
          numberOfVols *= nJudges;
        else if (v.per === "CVJ")
          // Volunteers per core values judging session
          numberOfVols *= nJudges;
        else if (v.per === "RPJ")
          // Volunteers per project judging session
          numberOfVols *= nJudges;
        else if (v.per === "T")
          // Volunteers per robot table
          numberOfVols *= this.nTables;
        for (let i = 0; i < numberOfVols; i++) vol.staff.push("");
        this.volunteers.push(vol);
      });
    }
  }

  get nJudges() {
    return this.sessions.find((s) => {
      return s.type === TYPES.JUDGING;
    }).nLocs;
  }

  get nTeams() {
    return this._teams.length;
  }

  //Given a new number of teams, update things...
  set nTeams(value) {
    while (this.teams.length < value) {
      let maxId = 0;
      this.teams.forEach((t) => {
        maxId = maxId > t.id ? maxId : t.id;
      });
      maxId += Math.floor(Math.random() * 100 + 1);
      this.teams.push(new TeamParams(maxId, this.teams.length + 1));
    }
    while (this.teams.length > value) this.teams.pop();
    this.teams = this.teams.sort((a, b) => {
      return parseInt(a.number, 10) - parseInt(b.number, 10);
    });
  }

  getTeam(id) {
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].id === id) return this.teams[i];
    }
    return null;
  }

  getSession(id) {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].id === id) return this.sessions[i];
    }
    return null;
  }

  getSessions(type) {
    let A = [];
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].type === type) A.push(this.sessions[i]);
    }
    return A;
  }

  getSessionDataGrid(id, pdf = false) {
    let session = this.getSession(id);
    let grid = [];
    let cols = [{ value: "#" }, { value: "Time" }];
    session.locations.forEach((x) => cols.push({ value: x }));
    grid.push(cols);

    let applyingBreaks = [];
    this.sessions
      .filter((S) => S.type === TYPES.BREAK && S.applies(session.id))
      .forEach((S) => {
        if (overlaps(S, session)) applyingBreaks.push(S);
      });
    let schedule = session.schedule.slice();
    applyingBreaks.forEach((br) =>
      schedule.push(new Instance(br.id, "", br.actualStartTime, null))
    );

    schedule
      .sort((a, b) => a.time.mins - b.time.mins)
      .forEach((instance) => {
        let A = [];
        A.push({ value: instance.num });
        A.push({ value: instance.time.time });
        if (this.getSession(instance.session_id).type === TYPES.BREAK) {
          A.push({
            value: this.getSession(instance.session_id).name,
            colSpan: session.nLocs,
          });
          grid.push(A);
        } else {
          let diff = session.nLocs;
          for (let dummy = 0; dummy < instance.loc; dummy++) {
            diff--;
            A.push({ value: "" });
          }
          for (let i = 0; i < instance.teams.length; i++) {
            let x = instance.teams[i];
            diff--;
            if (pdf)
              A.push({
                value: x
                  ? this.getTeam(x).number + "\n" + this.getTeam(x).name
                  : " X ",
              });
            else
              A.push({
                value: x ? this.getTeam(x).number : " X ",
                id: x ? x : null,
              });
          }
          while (diff-- > 0) A.push({ value: "" });
          grid.push(A);
        }
      });
    return grid;
  }

  getPilotDataGrid() {
    let T = [];
    this.teams.forEach((t) => T.push(t));
    shuffle(T);
    let grid = [];
    let w = this.nJudges;
    while (T.length > 0) {
      let row = [];
      for (let i = 0; i < w; i++) {
        let x = T.pop();
        row.push({ value: x ? x.number + "\n" + x.name : " X " });
      }
      grid.push(row);
    }
    return grid;
  }

  getIndivDataGrid(compact = false) {
    // Always sort before doing things if you need a particular order.
    this.teams.sort((a, b) => a.number - b.number);
    this.sessions.sort((a, b) => {
      return a.id - b.id;
    });
    this.teams.forEach((team) => {
      team.schedule.sort((a, b) => {
        return (
          this.getSession(a.session_id).id - this.getSession(b.session_id).id
        );
      });
    });

    let grid = [];
    let usesSurrogates = false;
    this.sessions.forEach((s) => {
      if (s.usesSurrogates) usesSurrogates = true;
    });
    grid[0] = [{ value: "Team", colSpan: 2 }];
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].type === TYPES.BREAK) continue;
      grid[0].push({ colSpan: compact ? 2 : 3, value: this.sessions[i].name });
    }
    grid[0].push({ value: "Min. Travel time" });
    if (usesSurrogates)
      grid[0].push({ colSpan: compact ? 2 : 3, value: "Surrogate" });
    grid[1] = [{ value: "#" }, { value: "Name" }];
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions[i].type === TYPES.BREAK) continue;
      for (let j = 0; j < this.sessions[i].instances; j++) {
        if (!compact) grid[1].push({ value: "#" });
        grid[1].push({ value: "Time" });
        grid[1].push({ value: "Loc" });
      }
    }
    grid[1].push({ value: "" });
    if (usesSurrogates) {
      if (!compact) grid[1].push({ value: "#" });
      grid[1].push({ value: "Time" });
      grid[1].push({ value: "Loc" });
    }

    for (let i = 0; i < this.teams.length; i++) {
      let row = [];
      let team = this.teams[i];
      row.push({ value: team.number });
      row.push({ value: team.name });
      for (let j = 0; j < team.schedule.length; j++) {
        if (this.getSession(team.schedule[j].session_id).type === TYPES.BREAK)
          continue;
        if (
          team.schedule[j].teams &&
          team.schedule[j].teams.length -
            team.schedule[j].teams.indexOf(team.id) <=
            team.schedule[j].surrogates
        )
          continue; // Surrogate
        if (!team.schedule[j].teams) {
          row.push({ value: "" });
          row.push({ value: "" });
          row.push({ value: "" });
        } else {
          if (!compact) row.push({ value: team.schedule[j].num });
          row.push({ value: team.schedule[j].time.time });
          if (team.schedule[j].loc === -1) row.push({ value: "--" });
          else
            row.push({
              value: this.getSession(team.schedule[j].session_id).locations[
                team.schedule[j].teams.indexOf(team.id) + team.schedule[j].loc
              ],
            });
        }
      }
      // row.push({value: "?"});
      row.push({ value: "" + this.minTravelTime(team) });
      let hadASurrogate = false;
      for (let j = 0; j < team.schedule.length; j++) {
        if (!team.schedule[j].teams) continue;
        if (
          !(
            team.schedule[j].teams.length -
              team.schedule[j].teams.indexOf(team.uid) >
            team.schedule[j].surrogates
          )
        ) {
          hadASurrogate = true;
          if (!compact) row.push({ value: team.schedule[j].num });
          row.push({ value: team.schedule[j].time.time });
          if (team.schedule[j].loc === -1) row.push({ value: "--" });
          else
            row.push({
              value: this.getSession(team.schedule[j].session_id).locations[
                team.schedule[j].teams.indexOf(team.id) + team.schedule[j].loc
              ],
            });
        }
      }
      if (!hadASurrogate && usesSurrogates) {
        if (!compact) row.push({ value: "" });
        row.push({ value: "" });
        row.push({ value: "" });
      }
      grid.push(row);
    }
    return grid;
  }

  /**
     Increments given time, skipping breaks.
     @return Returns the incremented time.
     */
  timeInc(time, inc, sessionID) {
    let filt = sessionID
      ? (x) => x.type === TYPES.BREAK && x.applies(sessionID)
      : (x) => x.type === TYPES.BREAK;
    let newMins = time.mins + inc;
    this.sessions.filter(filt).forEach((x) => {
      if (
        time.mins + inc >= x.actualStartTime.mins &&
        time.mins < x.actualEndTime.mins
      )
        newMins = x.actualEndTime.mins;
    });
    return newMins;
  }

  /**
     Increments given time, ceremonies and nights.
     @return Returns the incremented time.
     */
  timeIncPrac(time, inc) {
    let filt = (x) => x.type === TYPES.BREAK && x.noPractice;
    let newMins = time.mins + inc;
    this.sessions.filter(filt).forEach((x) => {
      if (
        time.mins + inc >= x.actualStartTime.mins &&
        time.mins < x.actualEndTime.mins
      )
        newMins = x.actualEndTime.mins;
    });
    return newMins;
  }

  /** Assuming the given session has the most up-to-date location names, synchronise other session to this **/
  syncLocs(S) {
    console.log("Sync");
    if (S.type !== TYPES.MATCH_ROUND && S.type !== TYPES.MATCH_ROUND_PRACTICE)
      return;
    this.sessions
      .filter(
        (x) =>
          x.type === TYPES.MATCH_ROUND || x.type === TYPES.MATCH_ROUND_PRACTICE
      )
      .forEach((x) => {
        x.locations = S.locations;
        console.log(x);
      });
  }

  get version() {
    return this._version;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get startTime() {
    return this._startTime;
  }

  set startTime(value) {
    this._startTime = value;
  }

  get endTime() {
    return this._endTime;
  }

  set endTime(value) {
    this._endTime = value;
  }

  get sessions() {
    return this._sessions;
  }

  set sessions(value) {
    this._sessions = value;
  }

  get teams() {
    return this._teams;
  }

  set teams(value) {
    this._teams = value;
  }

  get awards() {
    return this._awards;
  }

  set awards(value) {
    this._awards = value;
  }

  get judgesAwards() {
    return this._judgesAwards;
  }

  set judgesAwards(value) {
    this._judgesAwards = value;
  }

  get consolidatedAwards() {
    return this._consolidatedAwards;
  }

  set consolidatedAwards(value) {
    this._consolidatedAwards = value;
  }

  get awardStyle() {
    return this._awardStyle;
  }

  set awardStyle(value) {
    this._awardStyle = value;
  }

  get awardStyleIdx() {
    return EventParams.AWARD_STYLES.findIndex((x) => {
      return x === this._awardStyle;
    });
  }

  set awardStyleIdx(value) {
    console.log(value);
    this._awardStyle = EventParams.AWARD_STYLES[value];
    this._awards = EventParams.AWARD_NAMES[value];
    console.log(this._awards);
  }

  get awardPerc() {
    let idx = this.awardStyleIdx;
    console.log("Award style index: " + this.awardStyleIdx);
    console.log("Award style: " + this._awardStyle);

    let nTrophies = this.awards.length;
    //   EventParams.AWARD_NAMES[this.awardStyleIdx].length + this.judgesAwards;
    return Math.round((100 * nTrophies) / this.nTeams);
  }

  get minTravel() {
    return this._minTravel;
  }

  set minTravel(value) {
    this._minTravel = value;
  }

  get extraTime() {
    return this._extraTime;
  }

  set extraTime(value) {
    this._extraTime = value;
  }

  get nTables() {
    return this._nTables;
  }

  set nTables(value) {
    this._nTables = value;
  }

  get display() {
    return this._display;
  }

  set display(d) {
    this._display = d;
  }

  get pilot() {
    return this._pilot;
  }

  set pilot(p) {
    this._pilot = p;
  }

  get volunteers() {
    return this._volunteers;
  }

  set volunteers(p) {
    this._volunteers = p;
  }

  get nDays() {
    return this._days.length;
  }

  set nDays(value) {
    let A = this.days;
    while (A.length < value) A.push("Day " + (this.days.length + 1));
    while (A.length > value) A.pop();
    this.days = A;
  }

  get days() {
    return this._days;
  }

  // When changing the days, we have to make sure every DateTime gets the updated reference.
  set days(value) {
    this._days = value;
    this.startTime.days = this._days;
    this.endTime.days = this._days;
    this.sessions.forEach((S) => {
      S.startTime.days = this._days;
      S.actualStartTime.days = this._days;
      S.endTime.days = this._days;
      S.actualEndTime.days = this._days;
    });
    this.teams.forEach((T) => {
      T.startTime.days = this._days;
      T.endTime.days = this._days;
    });
  }

  addLocalSponsor(value) {
    this.sponsors.local.push(value);
  }

  addNationalSponsor(value) {
    this.sponsors.national.push(value);
  }

  deleteLocalSponsor(idx) {
    this.sponsors.local.splice(idx, 1);
  }

  static freeze(o) {
    return {
      _class: "EventParams",
      _version: o._version,
      _title: o._title,
      _teams: o._teams,
      uid_counter: o.uid_counter,
      _startTime: o._startTime,
      _endTime: o._endTime,
      _sessions: o._sessions,
      _days: o._days,
      _pilot: o._pilot,
      _nTables: o._nTables,
      errors: o.errors,
      _extraTime: o._extraTime,
      _minTravel: o._minTravel,
      _judgesAwards: o._judgesAwards,
      _awards: o._awards,
      _consolidatedAwards: o._consolidatedAwards,
      _awardStyle: o._awardStyle,
      _volunteers: o._volunteers,
      pageFormat: o.pageFormat,
      sponsors: o.sponsors.local,
    };
  }

  static thaw(o) {
    let E = new EventParams(o._version, o._title);
    console.log("Saved object:");
    console.log(o);
    E._teams = o._teams;
    E.uid_counter = o.uid_counter;
    E._startTime = o._startTime;
    E._endTime = o._endTime;
    E._minTravel = o._minTravel;
    E._extraTime = o._extraTime;
    E._sessions = o._sessions;
    E._days = o._days;
    E._pilot = o._pilot;
    E._nTables = o._nTables || 4;
    E.errors = o.errors;
    E._judgesAwards = o._judgesAwards;
    E._awards = o._awards;
    E._consolidatedAwards = o._consolidatedAwards;
    E._awardStyle = o._awardStyle || EventParams.AWARD_STYLES[2];
    E._volunteers = o._volunteers;
    E.sponsors.local = o.sponsors;
    E.pageFormat = o.pageFormat;
    if (!E.errors) E.errors = Infinity;
    console.log(E);
    return E;
  }

  /** ========================== UTILITIES ========================== **/

  /**
     Return true if the team can do the given instance.
     Returns false if they don't have time to come from a previous instance or go to a later one.
     if 'excl' is given, do not consider that session ID when checking this.
     **/
  canDo(team, instance, excl) {
    if (
      team.extraTime &&
      !instance.extra &&
      this.getSession(instance.session_id).type !== TYPES.BREAK
    )
      return false;
    if (
      team.excludeJudging &&
      this.getSession(instance.session_id).type === TYPES.JUDGING
    )
      return false;
    for (let i = 0; i < team.schedule.length; i++) {
      if (this.getSession(team.schedule[i].session_id).type === TYPES.BREAK) {
        if (
          !this.getSession(team.schedule[i].session_id).applies(
            instance.session_id
          )
        )
          continue;
        if (this.getSession(instance.session_id).type === TYPES.BREAK) continue;
      }
      let startA = team.schedule[i].time.mins;
      if (excl && team.schedule[i].session_id === excl) continue;
      let extra = 0;
      if (team.schedule[i].extra) extra = this.extraTime;
      let endA = 0;
      if (this.getSession(team.schedule[i].session_id).type === TYPES.BREAK)
        endA = startA + this.getSession(team.schedule[i].session_id).len;
      else
        endA =
          startA +
          this.getSession(team.schedule[i].session_id).len +
          extra +
          this.minTravel;
      let startB = instance.time.mins;
      extra = 0;
      if (instance.extra) extra = this.extraTime;

      let endB = 0;
      if (this.getSession(team.schedule[i].session_id).type === TYPES.BREAK)
        endB = startB + this.getSession(instance.session_id).len;
      else
        endB =
          startB +
          this.getSession(instance.session_id).len +
          this.minTravel +
          extra;
      if (
        (team.startTime.mins && startB < team.startTime.mins) ||
        (team.endTime.mins && endB > team.endTime.mins)
      )
        return false;
      if (
        startA === startB ||
        (startA < startB && endA > startB) ||
        (startB < startA && endB > startA)
      )
        return false;
    }
    return true;
  }

  swapTeams(sId, teamA, teamB) {
    let a = this.getTeam(teamA);
    let b = this.getTeam(teamB);
    let iA = null;
    let iB = null;
    let canA = false;
    let canB = false;
    console.log(a);
    a.schedule.forEach((i) => {
      if (i.session_id === sId) iA = i;
    });
    console.log(b);
    b.schedule.forEach((i) => {
      if (i.session_id === sId) iB = i;
    });

    if (this.canDo(a, iB, sId)) canA = true;
    if (this.canDo(b, iA, sId)) canB = true;

    if (canA && canB) {
      let locA = iA.teams.indexOf(teamA);
      let locB = iB.teams.indexOf(teamB);
      iA.teams[locA] = teamB;
      iB.teams[locB] = teamA;
      a.schedule.splice(a.schedule.indexOf(iA), 1);
      a.schedule.push(iB);
      b.schedule.splice(b.schedule.indexOf(iB), 1);
      b.schedule.push(iA);
      console.log(iA.teams);
      console.log(iB.teams);
      return null;
    } else if (canA) {
      return "Team " + b.number + " can't do that swap.";
    } else if (canB) {
      return "Team " + a.number + " can't do that swap.";
    } else {
      return "Neither team can do that";
    }
  }

  minTravelTime(team) {
    let minTravel = Infinity;
    team.schedule
      .filter((i) => this.getSession(i.session_id).type !== TYPES.BREAK)
      .forEach((i) => {
        team.schedule
          .filter((i) => this.getSession(i.session_id).type !== TYPES.BREAK)
          .forEach((j) => {
            if (i !== j) {
              let sA = i.time.mins;
              let eA =
                i.time.mins +
                this.getSession(i.session_id).len +
                (i.extraTime ? this.extraTime : 0);
              let sB = j.time.mins;
              let eB =
                j.time.mins +
                this.getSession(j.session_id).len +
                (i.extraTime ? this.extraTime : 0);
              let dA = sB - eA;
              let dB = sA - eB;
              let d = dA < 0 ? dB : dA;
              minTravel = minTravel > d ? d : minTravel;
            }
          });
      });
    return minTravel;
  }
}
