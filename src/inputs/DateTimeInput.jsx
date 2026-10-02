import React from 'react';

import { Input, Col, FormGroup, Label } from 'reactstrap';
import uniqueId from 'react-html-id';

import { DateTime } from '../api/DateTime';

export default class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.buildInput = this.buildInput.bind(this);

    uniqueId.enableUniqueIds(this);
  }

  handleTimeChange(event) {
    let x = this.props.value;
    if (!x) x = new DateTime(0);
    if (event.target.value) x.time = event.target.value;
    this.props.onChange(x);
  }

  handleDateChange(event) {
    let x = this.props.value;
    x.day = event.target.value;
    this.props.onChange(x);
  }

  buildInput() {
    if (this.props.value.days.length > 1) {
      return (
        <FormGroup>
          <Input
            type='select'
            name='select'
            onChange={this.handleDateChange}
            value={
              this.props.value.days[
                Math.floor(this.props.value.mins / (24 * 60))
              ]
            }
          >
            {this.props.value.days.map((d, idx) => (
              <option key={idx}>{d}</option>
            ))}
          </Input>
          <Input
            type='time'
            id={this.lastUniqueId()}
            pattern='[0-2][0-9]:[0-5][0-9]'
            step='900'
            value={this.props.value.mins ? this.props.value.timeValue : null}
            onChange={this.handleTimeChange}
          />
        </FormGroup>
      );
    } else {
      return (
        <Input
          type='time'
          id={this.lastUniqueId()}
          pattern='[0-2][0-9]:[0-5][0-9]'
          step='900'
          value={this.props.value.mins ? this.props.value.timeValue : null}
          onChange={this.handleTimeChange}
        />
      );
    }
  }

  render() {
    return (
      <FormGroup row>
        <Label sm={this.props.large ? 2 : 6} for={this.nextUniqueId()}>
          {this.props.label}
        </Label>
        <Col sm={this.props.large ? 10 : 6}>
          {this.props.immutable ? this.props.value.time : this.buildInput()}
        </Col>
      </FormGroup>
    );
  }
}
