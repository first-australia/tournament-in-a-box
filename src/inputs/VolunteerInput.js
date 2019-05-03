import React from 'react';

import { Input, Col, FormGroup, Label, Button } from 'reactstrap';
import uniqueId from 'react-html-id'
import FaTimesCircleO from "react-icons/lib/fa/times-circle-o";

export default class VolunteerInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.updateVol = this.updateVol.bind(this);

        uniqueId.enableUniqueIds(this)
    }

    handleCountChange(event) {
      let V = this.props.vol;
      V.count = event.target.value;
      V.staff.slice(0,event.target.value);
      this.props.onChange(V)
    }

    handleNameChange(event) {
      let V = this.props.vol;
      V.name = event.target.value;
      this.props.onChange(V);
    }

    updateVol(key, event) {
        let V = this.props.vol;
        V.staff[key] = event.target.value;
        this.props.onChange(V);
    }

    render() {
        return this.props.editable ?
        (
            <FormGroup>
                <FormGroup row>
                    <Col sm={3}>
                      <Input type="text" value={this.props.vol.name} onChange={this.handleNameChange}/>
                    </Col>
                    <Col sm={3}>
                        <Input type="number" min={1}
                                value={this.props.vol.count} onChange={this.handleCountChange}/>
                    </Col>
                    <Col sm={5}>
                        {[...Array(this.props.vol.count).keys()].map(i => {
                          return (
                            <Input key={i} type="text"
                                value={this.props.vol.staff[i] ? this.props.vol.staff[i] : ""}
                                onChange={e => {this.updateVol(i,e)}}/>
                        );})}
                    </Col>
                    <Col sm={1}>
                      <Button color="danger" onClick={this.props.onDelete}><FaTimesCircleO size={20}/></Button>
                    </Col>
                </FormGroup>
            </FormGroup>
        ) : (
            <FormGroup>
                <FormGroup row>
                    <Label sm={4} for={this.nextUniqueId()}>{this.props.vol.name} ({this.props.vol.count})</Label>
                    <Col sm={8}>
                        {[...Array(this.props.vol.count).keys()].map(i => {
                          return (
                            <Input key={i} type="text"
                                value={this.props.vol.staff[i] ? this.props.vol.staff[i] : ""}
                                onChange={e => {this.updateVol(i,e)}}/>
                        );})}
                    </Col>
                </FormGroup>
            </FormGroup>
        );
    }
}
