import React from 'react';

import { Col, FormGroup, Label } from 'reactstrap';
import uniqueId from 'react-html-id';

export default class TextAreaInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    uniqueId.enableUniqueIds(this);
  }

  handleChange(event) {
    const val = event.target.value;
    this.props.onChange(val);
  }

  render() {
    return (
      <FormGroup row>
        <Label
          hidden={this.props.nolabel}
          sm={this.props.large ? 2 : 6}
          for={this.nextUniqueId()}
        >
          {this.props.label}
        </Label>
        <Col sm={this.props.nolabel ? 12 : this.props.large ? 10 : 6}>
          <textarea
            id={this.lastUniqueId()}
            style={{ width: '100%' }}
            rows={this.props.rows}
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
          />
        </Col>
      </FormGroup>
    );
  }
}
