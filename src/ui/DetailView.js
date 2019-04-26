import React from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane,
    Container, Col, Row, Button,
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

import { TYPES } from '../api/SessionTypes';
import BasicsForm from "./BasicsForm";
import SessionForm from "./SessionForm"
import TeamList from "../inputs/TeamList";
import BooleanInput from "../inputs/BooleanInput";
import SessionParams from "../api/SessionParams";

import ToggleButton from 'react-toggle-button';

export default class DetailView extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'judging',
            advanced: false,
            modal: false,
            selectedSession: null
        };

        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.updateSessions = this.updateSessions.bind(this);
        this.updateTeams = this.updateTeams.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleApplies = this.toggleApplies.bind(this);
        this.updateUniversal = this.updateUniversal.bind(this);
        this.deleteSession = this.deleteSession.bind(this);
        this.addSession = this.addSession.bind(this);
    }

    toggleAdvanced() {
        this.setState({
            advanced:!this.state.advanced
        });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleScheduleChange(s) {
        this.props.onChange(s);
    }

    updateTeams(T) {
        let E = this.props.event;
        E.teams = T;
        this.props.onChange(E);
        console.log(this.props.event);
    }

    updateSessions(S) {
        let E = this.props.event;
        for (let i = 0; i < E.sessions.length; i++) {
            if (E.sessions[i].id === S.id) {
                E.sessions[i] = S;
                break;
            }
        }
        E.syncLocs(S);
        this.props.onChange(E);
    }

    toggleModal(session) {
        let value = !this.state.modal;
        let s = (value) ? session : null;
        this.setState({modal: value, selectedSession: s});
    }

    toggleApplies(container,session,include) {
        if (include && !container.applies(session.id)) {
            container.appliesTo.push(session.id);
        }
        if (!include && container.applies(session.id)) {
            container.appliesTo.splice(container.appliesTo.indexOf(session.id), 1);
        }
        this.updateSessions(container);
    }

    updateUniversal(value) {
        let S = this.state.selectedSession;
        if (!S) return;
        S.universal = value;
        this.updateSessions(S);
    }

    deleteSession(S) {
        let E = this.props.event;
        console.log(S);
        E.sessions.splice(E.sessions.indexOf(S),1);
        this.props.onChange(E);
    }

    addSession() {
      let E = this.props.event;
      let S = null;
      if (this.state.activeTab === 'judging')
        S = new SessionParams(E.uid_counter+1, TYPES.JUDGING, "Judging", 4, E.startTime.clone(), E.endTime.clone());
      else if (this.state.activeTab === 'rounds') {
          S = new SessionParams(E.uid_counter + 1, TYPES.MATCH_ROUND, "Round X", 4, E.startTime.clone(), E.endTime.clone());
          S.locations = E.sessions.filter(s => s.type === TYPES.MATCH_ROUND)[0].locations;
      }
      else if (this.state.activeTab === 'breaks') {
        S = new SessionParams(E.uid_counter+1, TYPES.BREAK, "Break", 1, E.startTime.clone(), E.endTime.clone());
        S.universal = true;
      } else if (this.state.activeTab === 'practice') {
          S = new SessionParams(E.uid_counter + 1, TYPES.MATCH_ROUND_PRACTICE, "Practice Round X", 4, E.startTime.clone(), E.endTime.clone());
          S.locations = E.sessions.filter(s => s.type === TYPES.MATCH_ROUND)[0].locations;
      }
      else return;
      E.sessions.push(S);
      E.uid_counter = E.uid_counter+1;
      this.props.onChange(E);
    }

    buildModal() {
        let S = this.state.selectedSession;
        if (!S) return;
        return (
            <div>
                {S.name} applies to...<br/>
                {S.type === TYPES.BREAK && <BooleanInput label="All?" value={S.universal} onChange={this.updateUniversal}/>}
                <hr/>
                {this.props.event.sessions.filter(S=>S.type!==TYPES.BREAK).map(session =>
                    <BooleanInput key={session.id} disabled={S.universal} label={session.name}
                        value={S.applies(session.id)} onChange={(x) => this.toggleApplies(S,session,x)}/>
                )}
            </div>
        );
    }


    renderSessions(type) {
        return (
            <Row>
                {this.props.event.sessions.filter(S=>S.type === type).sort((a,b) => {return a.id-b.id;}).map(S => (
                    <Col lg={6} md={12} key={S.id}>
                        <SessionForm onDelete={this.deleteSession} onToggle={() => this.toggleModal(S)} advanced={this.state.advanced}
                                     session={S} onChange={this.updateSessions}/>
                    </Col>
                ))}
            </Row>
        )
    }

    render() {
        return (
            <Container>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModal}>Advanced edit</ModalHeader>
                    <ModalBody>
                        {this.buildModal()}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>

                <Nav pills>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'basics') ? "active" : ""}
                                 onClick={() => {this.toggle('basics')}}>
                            Basics
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'teams') ? "active" : ""}
                                 onClick={() => {this.toggle('teams')}}>
                            Teams
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'judging') ? "active" : ""}
                                 onClick={() => {this.toggle('judging')}}>
                            Judging
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={this.state.activeTab === 'rounds' ? "active" : ""}
                                 onClick={() => {this.toggle('rounds')}}>
                            Rounds
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={this.state.activeTab === 'practice' ? "active" : ""}
                                 onClick={() => {this.toggle('practice')}}>
                            Practice
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#" className={(this.state.activeTab === 'breaks') ? "active" : ""}
                                 onClick={() => {this.toggle('breaks')}}>
                            Breaks
                        </NavLink>
                    </NavItem>
                    &nbsp;
                    <div onClick={this.toggleAdvanced}>
                        <small className="not-text">Advanced</small>
                        <ToggleButton value={this.state.advanced} onToggle={this.toggleAdvanced}/>
                    </div>
                    {this.state.advanced && this.state.activeTab !== 'basics' && this.state.activeTab !== 'teams' && (
                      <NavItem>
                        <NavLink href="#" onClick={this.addSession}>
                          <MdAddCircleOutline/>
                        </NavLink>
                      </NavItem>)
                    }

                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="basics">
                        &nbsp;
                        <BasicsForm advanced={this.state.advanced} event={this.props.event} onChange={this.handleScheduleChange}/>
                    </TabPane>
                    <TabPane tabId="teams">
                        &nbsp;
                        <TeamList advanced={this.state.advanced} teams={this.props.event.teams} onChange={this.updateTeams}/>
                    </TabPane>
                    <TabPane tabId="judging">
                        &nbsp;
                            {this.renderSessions(TYPES.JUDGING)}
                    </TabPane>
                    <TabPane tabId="rounds">
                        &nbsp;
                        {this.renderSessions(TYPES.MATCH_ROUND)}
                    </TabPane>
                    <TabPane tabId="practice">
                        &nbsp;
                        {this.renderSessions(TYPES.MATCH_ROUND_PRACTICE)}
                    </TabPane>
                    <TabPane tabId="breaks">
                        &nbsp;
                        {this.renderSessions(TYPES.BREAK)}
                        </TabPane>
                </TabContent>
            </Container>
        );
    }
}
