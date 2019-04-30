import React from 'react';

import { Input, Col, FormGroup, Label, Container } from 'reactstrap';
import uniqueId from 'react-html-id'

export default class VolunteerInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          volunteers: [],
          name: this.props.vol.name,
          count: this.props.vol.count
        }
        this.handleChange = this.handleChange.bind(this);
        this.updateVol = this.updateVol.bind(this);

        uniqueId.enableUniqueIds(this)
    }

    handleChange(event) {
        const val = Number.parseInt(event.target.value,10);
        if (!val) return;
        let V = this.state.volunteers.slice(0,val);

        this.setState({count: val, volunteers: V});
    }

    updateVol(key, event) {
        let V = this.state.volunteers;
        V[key] = event.target.value;
        this.setState({volunteers: V});
    }

    render() {
        return this.props.editable ? 
        (
            <FormGroup>
                <FormGroup row>
                    <Label sm={3} for={this.nextUniqueId()}>{this.state.name}</Label>
                    <Col sm={3}>
                        <Input type="number" min={1} id={this.lastUniqueId()}
                                value={this.state.count} onChange={this.handleChange}/>
                    </Col>
                    <Col sm={6}>
                        {[...Array(this.state.count).keys()].map(i => {
                          return (
                            <Input key={i} type="text" 
                                value={this.state.volunteers[i] ? this.state.volunteers[i] : ""}
                                onChange={e => {this.updateVol(i,e)}}/>
                        );})}
                    </Col>
                </FormGroup>
            </FormGroup>
        ) : (
            <FormGroup>
                <FormGroup row>
                    <Label sm={4} for={this.nextUniqueId()}>{this.state.name} ({this.state.count})</Label>
                    <Col sm={8}>
                        {[...Array(this.state.count).keys()].map(i => {
                          return (
                            <Input key={i} type="text" 
                                value={this.state.volunteers[i] ? this.state.volunteers[i] : ""}
                                onChange={e => {this.updateVol(i,e)}}/>
                        );})}
                    </Col>
                </FormGroup>
            </FormGroup>
        );
    }
}
