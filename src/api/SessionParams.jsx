import { TYPES } from "./SessionTypes";

export default class SessionParams {
  constructor(
    uid,
    type,
    name,
    nLocs = 4,
    startTime = null,
    endTime = null,
    noPractice = false
  ) {
    this._id = uid;
    this._type = type;

    this.name = name ? name : this.type.defaultTitle + " " + this._id;
    this._noprac = noPractice;

    let A = [];
    for (let i = 1; i <= nLocs; i++) A.push(this.type.defaultLocs + " " + i);
    this.locations = A;

    this.universal = false;

    this.startTime = startTime;
    this.endTime = endTime;
    if (this.startTime) this.actualStartTime = startTime.clone();
    if (this.endTime) this.actualEndTime = endTime.clone();

    this.nSims = this.locations.length;
    this.len = 30;
    this.buf = 15;
    this.overlap = 0;

    this.schedule = []; // To be filled in later
    this.errors = 0;

    this.instances = 1; // Can be changed in later versions, specifically for TYPE_MATCH_FILLER.
    this.extraTimeFirst = false; // Should the first round be a little longer?
    this.extraTimeEvery = 0; // Extra time every N round
    this.appliesTo = []; // Which sessions a break applies to
    this.usesSurrogates = false;
  }

  // These are immutable
  get type() {
    return this._type;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get nLocs() {
    return this._locations.length;
  }

  set nLocs(value) {
    while (this.nLocs < value)
      this._locations.push(this.type.defaultLocs + " " + (this.nLocs + 1));
    while (this.nLocs > value) this._locations.pop();
    if (this.type === TYPES.JUDGING) this.nSims = this.nLocs;
  }

  get locations() {
    return this._locations;
  }

  set locations(value) {
    this._locations = value;
  }

  get schedule() {
    return this._schedule;
  }

  set schedule(value) {
    this._schedule = value;
  }

  get nSims() {
    return this._nSims;
  }

  set nSims(value) {
    this._nSims = value;
  }

  get startTime() {
    return this._startTime;
  }

  // TODO clone value here so we don't have to everywhere else.
  set startTime(value) {
    this._startTime = value;
    if (value) this._actualStartTime = value.clone();
  }

  get endTime() {
    return this._endTime;
  }

  set endTime(value) {
    this._endTime = value;
  }

  get actualEndTime() {
    if (this.type === TYPES.BREAK) return this._endTime;
    return this._actualEndTime;
  }

  set actualEndTime(value) {
    this._actualEndTime = value;
  }

  get actualStartTime() {
    if (this.type === TYPES.BREAK) return this._startTime;
    return this._actualStartTime;
  }

  set actualStartTime(value) {
    this._actualStartTime = value;
  }

  get len() {
    return this._type === TYPES.BREAK ? 0 : this._len;
  }

  set len(value) {
    this._len = value;
  }

  get overlap() {
    return this._overlap;
  }

  set overlap(value) {
    if (value >= 0) this._overlap = value;
  }

  get buf() {
    return this._type === TYPES.BREAK
      ? this.endTime.mins - this.startTime.mins
      : this._buf;
  }

  set buf(value) {
    this._buf = value;
  }

  get errors() {
    return this._errors;
  }

  set errors(value) {
    this._errors = value;
  }

  get instances() {
    return this._instances;
  }

  set instances(value) {
    this._instances = value;
  }

  get extraTimeFirst() {
    return this._extraTimeFirst;
  }

  set extraTimeFirst(value) {
    this._extraTimeFirst = value;
  }

  get extraTimeEvery() {
    return this._extraTimeEvery;
  }

  set extraTimeEvery(value) {
    this._extraTimeEvery = value;
  }

  get universal() {
    return this._universal;
  }

  set universal(value) {
    this._universal = value;
  }

  get appliesTo() {
    return this._appliesTo;
  }

  set appliesTo(value) {
    this._appliesTo = value;
  }

  get noPractice() {
    return this._noprac;
  }

  set noPractice(value) {
    this._noprac = value;
  }

  // Does this session apply to id?
  applies(id) {
    if (this.universal) return true;
    else return this.appliesTo.includes(id);
  }

  get usesSurrogates() {
    return this._usesSurrogates;
  }

  set usesSurrogates(value) {
    this._usesSurrogates = value;
  }

  static freeze(o) {
    return {
      _class: "SessionParams",
      _id: o._id,
      _type: o._type,
      _name: o._name,
      _locations: o._locations,
      _universal: o._universal,
      _startTime: o._startTime,
      _endTime: o._endTime,
      _actualStartTime: o._actualStartTime,
      _actualEndTime: o._actualEndTime,
      _nSims: o._nSims,
      _len: o._len,
      _buf: o._buf,
      _overlap: o._overlap,
      _schedule: o._schedule,
      _errors: o._errors,
      _instances: o._instances,
      _extraTimeFirst: o._extraTimeFirst,
      _extraTimeEvery: o._extraTimeEvery,
      _appliesTo: o._appliesTo,
      _noprac: o._noprac,
      _usesSurrogates: o._usesSurrogates,
    };
  }

  static thaw(o) {
    let S = new SessionParams(o._id, o._type, o._name);
    S._locations = o._locations;
    S._universal = o._universal;
    S._startTime = o._startTime;
    S._endTime = o._endTime;
    if (S._endTime.mins === null && o._actualEndTime.mins === null)
      S._endTime = S._startTime.clone(30);
    else if (S._endTime.mins === null) {
      S._endTime = o._actualEndTime.clone();
    }
    S._actualStartTime = o._actualStartTime;
    S._actualEndTime = o._actualEndTime;
    S._nSims = o._nSims;
    S._len = o._len;
    S._buf = o._buf;
    S._overlap = o._overlap;
    if (typeof o._overlap === "undefined") S._overlap = 0;
    S._schedule = o._schedule;
    S._errors = o._errors;
    S._instances = o._instances;
    S._extraTimeFirst = o._extraTimeFirst;
    S._extraTimeEvery = o._extraTimeEvery;
    S._appliesTo = o._appliesTo;
    S._noprac = o._noprac;
    S._usesSurrogates = o._usesSurrogates;
    return S;
  }
}
