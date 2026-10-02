export class SessionType {
  constructor(
    uid,
    name,
    priority,
    defaultTitle,
    defaultLocs,
    fillerPolicy = POLICIES.blank
  ) {
    this._name = name;
    this._priority = priority;
    this._defaultTitle = defaultTitle;
    this._fillerPolicy = fillerPolicy;
    this._defaultLocs = defaultLocs;
  }

  get name() {
    return this._name;
  }

  get priority() {
    return this._priority;
  }

  get defaultTitle() {
    return this._defaultTitle;
  }

  get fillerPolicy() {
    return this._fillerPolicy;
  }

  get defaultLocs() {
    return this._defaultLocs;
  }

  static freeze(o) {
    return {
      _class: 'SessionType',
      _name: o.name
    };
  }

  static thaw(o) {
    // console.log(TYPES);
    // console.log(Object.keys(TYPES));
    console.log('Object name:');
    console.log(o._name);
    let V = null;
    Object.values(TYPES).forEach(v => {
      if (o._name === v.name) console.log('MATCH');
      if (o._name === v.name) V = v;
    });
    return V;
  }
}

export const POLICIES = { blank: 'Leave blanks', surrogates: 'Use surrogates' };

export const TYPES = {
  JUDGING: new SessionType(16, 'Judging', 8, 'Judging', 'Room'),
  INSPECTION: new SessionType(24, 'Inspection', 12, 'Inspection', 'Room'),
  MATCH_ROUND: new SessionType(
    32,
    'Rounds',
    16,
    'Round',
    'Table',
    POLICIES.surrogates
  ),
  MATCH_ROUND_PRACTICE: new SessionType(
    33,
    'Practice Rounds',
    128,
    'Practice Round',
    'Table',
    POLICIES.surrogates
  ),
  MATCH_FILLER: new SessionType(
    48,
    'Matches',
    32,
    'Qualifying Match',
    'Field',
    POLICIES.surrogates
  ),
  MATCH_FILLER_PRACTICE: new SessionType(
    49,
    'Practice Matches',
    129,
    'Practice Match',
    'Field',
    POLICIES.surrogates
  ),
  BREAK: new SessionType(64, 'Breaks', 0, 'Break', 'Everywhere')
};
