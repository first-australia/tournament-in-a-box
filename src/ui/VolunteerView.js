import React, { Component } from 'react';

import { Container, FormGroup } from 'reactstrap';
import VolunteerInput from "../inputs/VolunteerInput";
import Volunteers from "../templates/volunteers.json";
import ToggleButton from 'react-toggle-button';

export default class VolunteerView extends Component {
    constructor(props) {
        super(props);
        this.state = {editable: false};

        this.toggleEditable = this.toggleEditable.bind(this);
    }

    toggleEditable() {
        this.setState({editable: !this.state.editable});
    }

    render () {
        return (
            <Container>
                <FormGroup sm={12} row>
                    <div onClick={this.toggleEditable}>
                        <small className="not-text">Editable</small>
                       <ToggleButton value={this.state.editable} onToggle={this.toggleEditable}/>
                    </div>
                </FormGroup>
                {Volunteers.roles.map((vol,i) => {
                          return (
                            <VolunteerInput key={i} vol={vol} editable={this.state.editable}/>
                        );})}
            </Container>
        );
    }
}
