import React from 'react';

import { Input, Col, FormGroup, Label } from 'reactstrap';
import uniqueId from 'react-html-id';

export default class NumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    uniqueId.enableUniqueIds(this);
  }

  handleChange(event) {
    const val = Number.parseInt(event.target.value, 10);
    this.props.onChange(val);
  }

  render() {
    return (
      <FormGroup row>
        <Label sm={this.props.large ? 2 : 6} for={this.nextUniqueId()}>
          {this.props.label}
        </Label>
        <Col sm={this.props.large ? 10 : 6}>
          <Input
            type='number'
            min={this.props.min}
            step={this.props.step || 1}
            max={this.props.max}
            id={this.lastUniqueId()}
            value={this.props.value}
            onChange={this.handleChange}
          />
        </Col>
      </FormGroup>
    );
  }
}
