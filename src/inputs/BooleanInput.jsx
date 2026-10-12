import React from 'react';

import { FormGroup, Label, Button, Col } from 'reactstrap';
import uniqueId from 'react-html-id';

export default class BooleanInput extends React.Component {
  constructor(props) {
    super(props);

    this.toggleChecked = this.toggleChecked.bind(this);
    uniqueId.enableUniqueIds(this);
  }

  toggleChecked() {
    this.props.onChange(!this.props.value);
  }

  render() {
    return (
      <FormGroup row>
        <Label sm={this.props.large ? 2 : 6} for={this.nextUniqueId()}>
          {this.props.label}
        </Label>
        <Col sm={this.props.large ? 10 : 6}>
          <Button
            disabled={this.props.disabled}
            color={this.props.value ? 'success' : 'danger'}
            onClick={this.toggleChecked}
          >
            {this.props.value ? 'Yes' : 'No'}
          </Button>
        </Col>
      </FormGroup>
    );
  }
}
