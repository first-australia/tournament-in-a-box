export class DateTime {
  constructor(mins, days = ['Day 1']) {
    this.mins = mins;
    this.days = days;
  }

  displayTime() {
    if (!this.mins) return '--:--';
    let x = this.mins % (24 * 60);
    let d = Math.floor(this.mins / (24 * 60));
    let h = Math.floor(x / 60);
    let m = x % 60;
    let zh = h < 10 ? '0' : '';
    let zm = m < 10 ? '0' : '';
    return (
      (this.days.length > 1 ? this.days[d] + ' ' : '') + zh + h + ':' + zm + m
    );
  }

  justDay() {
    let d = Math.floor(this.mins / (24 * 60));
    return this.days[d];
  }

  justTime() {
    let x = this.mins % (24 * 60);
    let h = Math.floor(x / 60);
    let m = x % 60;
    let zh = h < 10 ? '0' : '';
    let zm = m < 10 ? '0' : '';
    return zh + h + ':' + zm + m;
  }

  get mins() {
    return this._mins;
  }

  set mins(value) {
    this._mins = value;
  }

  get time() {
    return this.displayTime();
  }

  set time(value) {
    let res = value.split(':');
    this._mins =
      parseInt(res[0], 10) * 60 + parseInt(res[1], 10) + this.dayIdx * 24 * 60;
  }

  get dayIdx() {
    return Math.floor(this._mins / (24 * 60));
  }

  get timeValue() {
    return this.justTime();
  }

  get day() {
    return this._days[this.dayIdx];
  }

  set day(value) {
    if (this.days.includes(value))
      this.mins =
        (this.mins ? this.mins % (24 * 60) : 0) +
        this.days.indexOf(value) * 24 * 60;
  }

  get days() {
    return this._days;
  }

  set days(value) {
    this._days = value;
  }

  clone(inc = 0) {
    return new DateTime(this.mins + inc, this.days);
  }

  static freeze(o) {
    return {
      _class: 'DateTime',
      mins: o.mins,
      days: o.days
    };
  }

  static thaw(o) {
    return new DateTime(o.mins, o.days);
  }
}
