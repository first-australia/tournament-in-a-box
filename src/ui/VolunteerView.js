import React, { Component } from 'react';

import { Container, FormGroup, Alert, Col, Row } from 'reactstrap';
import VolunteerInput from "../inputs/VolunteerInput";
import { saveToFile_csv } from "../scheduling/utilities.js";

export default class VolunteerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          editable: false
        };

        this.toggleEditable = this.toggleEditable.bind(this);
        this.onChange = this.onChange.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);
        this.deleteVol = this.deleteVol.bind(this);
        this.importVols = this.importVols.bind(this);
    }

    toggleEditable() {
        this.setState({editable: !this.state.editable});
    }

    onChange(v, i) {
      let V = this.props.data;

      V[i] = v;
      this.props.onChange(V);
    }

    downloadTemplate() {
      let content="role,names\n";
      this.props.data.forEach(v => {
        content += v.name + ","
        v.staff.forEach((s,i) => {
          if (s === "")
            content += "Name " + (i+1) + ",";
          else
            content += s + ","
        });
        content += "\n";
      });
      saveToFile_csv("volunteer_template.csv",content);
    }

    deleteVol(idx) {
      let V = this.props.data;
      V.splice(idx,1);
      this.props.onChange(V);
    }

    importVols(e, f) {
      let file = f || e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
          let V = [];
          let lines = reader.result.split("\n");
          if (lines[0].startsWith("role,names"))
            lines.shift();
          lines.forEach(l => {
            let fields=l.split(',');
            if (!fields) return;
            console.log(fields);
            let name = fields.shift();
            console.log(fields);
            if (!name) return;
            V.push({name: name, staff: fields.filter(f=>f !== "")});
          });
          console.log(lines);
          this.props.onChange(V);
      };
      reader.readAsText(file);
    }

    render () {
        return (
            <Container>
            <br/>
                <FormGroup>
                <Row>
                <Col sm={4}>
                  <Alert onClick={this.toggleEditable} color={this.state.editable ? "success" : "danger"}>Editable?</Alert>
                 </Col>
                 <Col sm={4}>
                   <label onClick={this.downloadTemplate}>
                       <Alert color="info">Download sample template</Alert>
                   </label>
                 </Col>
                 <Col sm={4}>
                   <label>
                       <Alert>Import from template</Alert>
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
