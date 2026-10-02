import React from 'react';
import TextInput from '../inputs/TextInput';
import NumberInput from '../inputs/NumberInput';
//import BooleanInput from '../inputs/BooleanInput';
import DateTimeInput from '../inputs/DateTimeInput';

import {Container, Form, Table} from 'reactstrap';

import ReactDataSheet from 'react-datasheet';
import TextAreaInput from "../inputs/TextAreaInput";

export default class InitForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....
        this.state = {
            grid: this.getDataGrid()
        };

        this.getDataGrid = this.getDataGrid.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateNTeams = this.updateNTeams.bind(this);
        this.updateNTables = this.updateNTables.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.updateNDays = this.updateNDays.bind(this);
        this.updateDays = this.updateDays.bind(this);
        this.updatePilot = this.updatePilot.bind(this);
        this.updateTeamNames = this.updateTeamNames.bind(this);
        this.updateNPracs = this.updateNPracs.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.event.days.length; i++) {
            grid.push([]);
            grid[i].push({value: "Name of Day " + (i + 1), readOnly: true});
            grid[i].push({value: this.props.event.days[i]});
        }
        return grid;
    }

    updateTitle(newTitle) {
        let data = this.props.event;
        data.title = newTitle;
        this.handleChange(data);
    }

    updateNTeams(newN) {
        let data = this.props.event;
        data.nTeams = newN;
        this.handleChange(data);
    }

    updateNPracs(newN) {
        let data = this.props.event;
        data.nPracs = newN;
        this.handleChange(data);
    }

    updateStartTime(newTime) {
        let data = this.props.event;
        data.startTime = newTime;
        this.handleChange(data);
    }

    updateEndTime(newTime) {
        let data = this.props.event;
        data.endTime = newTime;
        this.handleChange(data);
    }

    updateDays(changes) {
        const grid = this.state.grid.map(row => [...row]);
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
        });
        this.setState({grid});
        let A = [];
        for (let i = 0; i < grid.length; i++) {
            A.push(grid[i][1].value);
        }
        let S = this.props.event;
        S.days = A;
        this.props.onChange(S);
    }

    updateNDays(value) {
        let E = this.props.event;
        E.nDays = value;
        E.endTime.mins = (E.endTime.mins % (24 * 60)) + ((value - 1) * 24 * 60);
        this.setState({grid: this.getDataGrid()});
        this.handleChange(E);
    }

    updateNTables(value) {
        let E = this.props.event;
        E.nTables = value;
        this.handleChange(E);
    }

    updatePilot(value) {
        let E = this.props.event;
        E.pilot = value;
        this.handleChange(E);
    }

    updateTeamNames(e) {
        let E = this.props.event;
        E.tempNames = e;
        this.handleChange(E);
    }

    handleChange(data) {
        if (this.props.onChange) this.props.onChange(data);
    }

    render() {
        return (
            <Container>
                <Form onSubmit={this.handleSubmit}>
                    <TextInput large label="Title: " value={this.props.event.title} onChange={this.updateTitle}/>
                    <NumberInput large min="4" label="Number of teams: " value={this.props.event.nTeams}
                                 onChange={this.updateNTeams}/>
                    <NumberInput large min="2" step="2" label="Number of competition tables: "
                                 value={this.props.event.nTables} onChange={this.updateNTables}/>
                    <NumberInput large min="0" step="1" label="Number of practice rounds: "
                                 value={this.props.event.nPracs} onChange={this.updateNPracs}/>
                    {/*<BooleanInput label="Pilot judging program?" large value={this.props.event.pilot}
                                  onChange={this.updatePilot}/>*/}
                    <NumberInput label="Number of days" large min={1} value={this.props.event.days.length}
                                 onChange={this.updateNDays}/>
                    <ReactDataSheet
                        data={this.state.grid}
                        valueRenderer={(cell) => cell.value}
                        sheetRenderer={(props) => (
                            <Table className="datagrid-custom">
                                <tbody>
                                {props.children}
                                </tbody>
                            </Table>
                        )}
                        onCellsChanged={(changes) => this.updateDays(changes)}
                    />
                    <DateTimeInput large label="Start time: " value={this.props.event.startTime}
                                   onChange={this.updateStartTime}/>
                    <DateTimeInput large label="End time: " value={this.props.event.endTime}
                                   onChange={this.updateEndTime}/>
                    <TextAreaInput large label="Team names:" rows={10}
                                   placeholder="List of teams: (Name) OR (Number,Name) OR (Number,Name,Affiliation) OR (Number,Name,Affiliation,Pit)"
                                   onChange={this.updateTeamNames}/>
                </Form>
            </Container>
        );
    }
}
