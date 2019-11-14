import { TYPES } from '../api/SessionTypes';

export function MakeScoringSystemCSV(event) {
  let csv = 'Version Number,1\n';
  csv += 'Block Format,1\n';
  csv += 'Number of Teams,' + event.nTeams + '\n';

  event.teams.forEach(t => {
    csv += t.number + ',' + t.name + ',' + t.affiliation + ',\n';
  });

  csv += 'Block Format,2\n';
  let rankingMatches = 0;
  let allRounds = event.getSessions(TYPES.MATCH_ROUND);
  allRounds.forEach(S => {
    rankingMatches += S.schedule.length;
  });
  csv += 'Number of Ranking Matches,' + rankingMatches + '\n';
  csv += 'Number of Tables,' + allRounds[0].nLocs + '\n';
  csv += 'Number of Teams per Table,2\n';
  csv +=
    'Number of Simultaneous Tables,' +
    Math.floor(allRounds[0].nLocs / 2 / allRounds[0].nSims) +
    '\n';
  csv += 'Table Names,';
  allRounds[0].locations.forEach(l => {
    csv += l.replace(' ', '-') + ',';
  });
  csv += '\n';
  allRounds.forEach(round => {
    round.schedule.forEach(instance => {
      csv += instance.num + ',';
      csv += TimeToExcel(instance.time) + ',';
      let extra = 0;
      if (instance.extra) extra = event.extraTime;
      let tmp = instance.time.clone();
      tmp.mins = tmp.mins + round.len + extra;
      csv += TimeToExcel(tmp) + ',';
      for (let dummy = 0; dummy < instance.loc; dummy++) csv += ',';
      instance.teams.forEach(t => {
        csv += event.getTeam(t).number + ',';
      });
      for (
        let dummy = instance.loc + instance.teams.length;
        dummy < allRounds[0].nLocs;
        dummy++
      )
        csv += ',';
      csv += '\n';
    });
  });

  let allJudging = event.getSessions(TYPES.JUDGING);
  csv += 'Block Format,3\n';
  csv += 'Number of Judged Events,' + allJudging.length + '\n';
  csv += 'Number of Event Time Slots,' + allJudging[0].schedule.length + '\n';
  csv += 'Number of Judging Teams,' + allJudging[0].nLocs + '\n';

  allJudging.forEach(session => {
    csv += 'Event Name,' + session.name + '\n';
    csv += 'Room Names,';
    session.locations.forEach(loc => {
      csv += loc + ',';
    });
    csv += '\n';
    session.schedule.forEach(instance => {
      csv += instance.num + ',';
      csv += TimeToExcel(instance.time) + ',';
      let extra = 0;
      if (instance.extra) extra = event.extraTime;
      let tmp = instance.time.clone();
      tmp.mins = tmp.mins + session.len + extra;
      csv += TimeToExcel(tmp) + ',';
      for (let dummy = 0; dummy < instance.loc; dummy++) csv += ',';
      instance.teams.forEach(t => {
        csv += event.getTeam(t).number + ',';
      });
      csv += '\n';
    });
  });

  let practiceMatches = 0;
  let allPRounds = event.getSessions(TYPES.MATCH_ROUND_PRACTICE);
  if (allPRounds.length === 0) return { data: csv, filename: 'scoring_import' };
  allPRounds.forEach(S => {
    practiceMatches += S.schedule.length;
  });
  csv += 'Block Format,4\n';
  csv += 'Number of Practice Matches,' + practiceMatches + '\n';
  csv += 'Number of Tables,' + allRounds[0].nLocs / 2 + '\n';
  csv += 'Number of Teams per Table,2\n';
  csv +=
    'Number of Simultaneous Tables,' +
    Math.floor(allRounds[0].nLocs / 2 / allRounds[0].nSims) +
    '\n';
  csv += 'Table Names,';
  allRounds[0].locations.forEach(l => {
    csv += l.replace(' ', '-') + ',';
  });
  csv += '\n';
  allPRounds.forEach(round => {
    round.schedule.forEach(instance => {
      csv += instance.num + ',';
      csv += TimeToExcel(instance.time) + ',';
      let extra = 0;
      if (instance.extra) extra = event.extraTime;
      let tmp = instance.time.clone();
      tmp.mins = tmp.mins + round.len + extra;
      csv += TimeToExcel(tmp) + ',';
      for (let dummy = 0; dummy < instance.loc; dummy++) csv += ',';
      instance.teams.forEach(t => {
        csv += event.getTeam(t).number + ',';
      });
      for (
        let dummy = instance.loc + instance.teams.length;
        dummy < allRounds[0].nLocs;
        dummy++
      )
        csv += ',';
      csv += '\n';
    });
  });
  return { data: csv, filename: 'scoring_import' };
}

// Excel represents time decimally as follows:
// Time = x.yyyyyyyy
// Where x = Number of days since 1/1/1900
// and	 y = Proportion of day (mins/(24*60))
export function TimeToExcel(x) {
  let t = x.time.replace(/$/, ':00');
  if (x.mins % (24 * 60) < 12 * 60) t = t + ' AM';
  else t = t + ' PM';
  return t;
  // var millenium = new Date();
  // sd = new String(sd);
  // millenium.setFullYear(1900,0,1);
  // var tourn = new Date();
  // tourn.setFullYear(sd.split("-")[0],sd.split("-")[1]-1,sd.split("-")[2]);
  // if (tournament.days.length > 1) {
  // 	console.log(Date.daysBetween(millenium,tourn)+(m/(24*60)));
  // 	return Date.daysBetween(millenium,tourn)+(m/(24*60));
  // } else return m/(24*60);
}
