import React from 'react';

import ReactDataSheet from 'react-datasheet';

import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { TeamParams } from '../api/TeamParams';

import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';
import FaCheckCircleO from "react-icons/lib/fa/check-circle-o";
import FaTimesCircleO from "react-icons/lib/fa/times-circle-o";
import BooleanInput from "./BooleanInput";
import DateTimeInput from "./DateTimeInput";

export default class TeamList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toAdd: 1,
            selectedTeam: 0,
            modal: false
        };

        this.toggle=this.toggle.bind(this);

        this.updateCells = this.updateCells.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
        this.changeToAdd = this.changeToAdd.bind(this);
        this.addTeams = this.addTeams.bind(this);

        this.setTeamExclude = this.setTeamExclude.bind(this);
        this.setTeamExtra = this.setTeamExtra.bind(this);
        this.setTeamStartTime = this.setTeamStartTime.bind(this);
        this.setTeamEndTime = this.setTeamEndTime.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    changeToAdd(ev) {
        this.setState({
            toAdd: ev.target.value
        });
    }

    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.teams.length; i++) {
            grid.push([]);
            grid[i].push({value: this.props.teams[i].number});
            grid[i].push({value: this.props.teams[i].name});
            grid[i].push({value: this.props.teams[i].affiliation});
            grid[i].push({value: this.props.teams[i].pitNum});
            if (this.props.advanced) {
                grid[i].push({value: this.props.teams[i].excludeJudging ? <FaCheckCircleO size={20}/> : <FaTimesCircleO size={20}/>});
                grid[i].push({value: this.props.teams[i].extraTime ? <FaCheckCircleO size={20}/> : <FaTimesCircleO size={20}/>});
                grid[i].push({value: this.props.teams[i].startTime ? this.props.teams[i].startTime.time : "--"});
                grid[i].push({value: this.props.teams[i].endTime ? this.props.teams[i].endTime.time : "--"});
            }
        }
        return grid;
    }

    updateCells(changes) {
        const grid = this.getDataGrid().map(row => [...row]);
        let T = this.props.teams;
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value};
        });
        for (let row = 0; row < grid.length; row++) {
            T[row].number = grid[row][0].value;
            T[row].name = grid[row][1].value;
            T[row].affiliation = grid[row][2].value;
        }
        this.props.onChange(T);
    }

    addTeams() {
        let T = this.props.teams;
        for (let i = 0; i < this.state.toAdd; i++) {
            T.push(new TeamParams(T.length+1));
        }
        this.props.onChange(T);
        this.setState({grid: this.getDataGrid()});
    }

    deleteTeam(idx) {
        let T = this.props.teams;
        T.splice(idx,1);
        this.props.onChange(T);
        this.setState({grid: this.getDataGrid()});
    }

    setTeamExclude(b) {
        let T = this.props.teams;
        T[this.state.selectedTeam].excludeJudging = b;
        this.props.onChange(T);
    }

    setTeamExtra (b) {
        let T = this.props.teams;
        T[this.state.selectedTeam].extraTime = b;
        this.props.onChange(T);
    }

    setTeamStartTime(t) {
        let T = this.props.teams;
        T[this.state.selectedTeam].startTime = t;
        this.props.onChange(T);
    }

    setTeamEndTime(t) {
        let T = this.props.teams;
        T[this.state.selectedTeam].endTime = t;
        this.props.onChange(T);
    }

    buildModal(team) {
        return (
            <div>
                {team.number}: {team.name}
                <BooleanInput label="Exclude from judging?" value={team.excludeJudging} onChange={this.setTeamExclude}/>
                <BooleanInput label="Extra time needed?" value={team.extraTime} onChange={this.setTeamExtra}/>
                <DateTimeInput label="Arrives at: " value={team.startTime} onChange={this.setTeamStartTime}/>
                <DateTimeInput label="Must leave by: " value={team.endTime} onChange={this.setTeamEndTime}/>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Advanced edit</ModalHeader>
                    <ModalBody>
                        {this.buildModal(this.props.teams[this.state.selectedTeam])}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>

                {this.props.cosmetic || (<div><Button onClick={this.addTeams}><MdAddCircleOutline/> Add</Button>&nbsp;
                        <input type="number" value={this.state.toAdd} min="1" onChange={this.changeToAdd}/>&nbsp;
                        team{this.state.toAdd>1 && "s"}&nbsp;
                        <br/>
                        Number of teams: {this.props.teams.length}
                        <br/>
                    </div>)}
                &nbsp;
            <ReactDataSheet
                data={this.getDataGrid()}
                valueRenderer={(cell) => cell.value}
                sheetRenderer={(props) => (
                    <Table className="datagrid-custom">
                        <thead>
                            <tr>
                                <th>Team number</th>
                                <th>Team name</th>
                                <th>Affiliation</th>
                                <th>Pit No</th>
                                {this.props.advanced && <th>Exclude from judging?</th>}
                                {this.props.advanced && <th>Extra time?</th>}
                                {this.props.advanced && <th>Arrives</th>}
                                {this.props.advanced && <th>Leaves</th>}
                                {this.props.advanced && <th>Advanced</th>}
                                {this.props.cosmetic || <th width="20"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {props.children}
                        </tbody>
                    </Table>
                    )}
                rowRenderer={(props) => (
                    <tr>
                        {props.children}
                        {this.props.advanced && <td className='cell'>
                            <Button className="btn-sm" onClick={() => {this.setState({selectedTeam:props.row}); this.toggle()}}>Edit...</Button>
                        </td>}
                        {this.props.cosmetic || <td className='cell'>
                            <Button color='danger' className='btn-sm' onClick={() => this.deleteTeam(props.row)}><FaTimesCircleO size={20}/></Button>
                        </td>}
                    </tr>
                )}
                onCellsChanged={(changes) => this.updateCells(changes)}
            />
            </div>
        )
    }
}