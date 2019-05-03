import React, { Component } from 'react';

import { Container, FormGroup, Alert, Col, Row } from 'reactstrap';
import BooleanInput from "../inputs/BooleanInput";
import VolunteerInput from "../inputs/VolunteerInput";

export default class VolunteerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          editable: false
        };

        this.toggleEditable = this.toggleEditable.bind(this);
        this.onChange = this.onChange.bind(this);
        this.deleteVol = this.deleteVol.bind(this);
    }

    toggleEditable() {
        this.setState({editable: !this.state.editable});
    }

    onChange(v, i) {
      let V = this.props.data;

      V[i] = v;
      this.props.onChange(V);
    }

    deleteVol(idx) {
      let V = this.props.data;
      V.splice(idx,1);
      this.props.onChange(V);
    }

    importVols(event) {
      alert("Not yet implemented!")
    }

    render () {
        return (
            <Container>
            <br/>
                <FormGroup>
                <Row>
                <Col sm={6}>
                  <Alert onClick={this.toggleEditable} color={this.state.editable ? "success" : "danger"}>Editable?</Alert>
                 </Col>
                 <Col sm={6}>
                   <label>
                       <Alert>Import...</Alert>
                       <input type="file" accept=".csv" hidden ref="input" onChange={this.importVols}/>
                   </label>
                 </Col>
                 </Row>
                {this.props.data.map((vol,i) => {

                          return (
                            <VolunteerInput key={i} vol={vol} editable={this.state.editable} onDelete={() => this.deleteVol(i)} onChange={(v) => this.onChange(v,i)}/>
                        );})}
                        </FormGroup>
            </Container>
        );
    }
}
