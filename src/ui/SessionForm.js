import React from 'react';
// import ReactDOM from 'react-dom';
import { TYPES } from '../api/SessionTypes';

import MdRemoveCircleOutline from 'react-icons/lib/md/remove-circle-outline';

import { Form, Table, Button } from 'reactstrap';
import TextInput from '../inputs/TextInput';
import DateTimeInput from "../inputs/DateTimeInput";
import NumberInput from "../inputs/NumberInput";
import BooleanInput from "../inputs/BooleanInput";

import ReactDataSheet from 'react-datasheet';

export default class SessionForm extends React.Component {
    constructor(props) {
        super(props);
        // Default values....
        this.updateName = this.updateName.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
        this.updateEndTime = this.updateEndTime.bind(this);
        this.updateLen = this.updateLen.bind(this);
        this.updateOverlap = this.updateOverlap.bind(this);
        this.updateBuf = this.updateBuf.bind(this);
        this.updateNSims = this.updateNSims.bind(this);
        this.updateNLocs = this.updateNLocs.bind(this);
        this.updateExtraFirst = this.updateExtraFirst.bind(this);
        this.updateExtraEvery = this.updateExtraEvery.bind(this);
        this.getDataGrid = this.getDataGrid.bind(this);
        this.updateLocs = this.updateLocs.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    updateName(value) {
        let S = this.props.session;
        S.name = value;
        this.props.onChange(S);
    }

    updateStartTime(value) {
        let S = this.props.session;
        S.startTime = value;
        this.props.onChange(S);
    }

    updateEndTime(value) {
        let S = this.props.session;
        S.endTime = value;
        this.props.onChange(S);
    }

    updateLen(value) {
        let S = this.props.session;
        S.len = value;
        S.overlap = Math.floor(Math.min(S.overlap, (S.len + S.buf) - (S.len + S.buf)*S.nSims/S.nLocs));
        this.props.onChange(S);
    }

    updateOverlap(value) {
        let S = this.props.session;

        // If overlap means matches will happen too quickly, don't update it.
        if (value > (S.len + S.buf) - (S.len + S.buf)*S.nSims/S.nLocs) {
            alert("Overlap is too large");
        } else {
            S.overlap = value;
            this.props.onChange(S);
        }
    }

    updateBuf(value) {
        let S = this.props.session;
        S.buf = value;
        S.overlap = Math.floor(Math.min(S.overlap, (S.len + S.buf) - (S.len + S.buf)*S.nSims/S.nLocs));
        this.props.onChange(S);
    }

    updateNSims(value) {
        let S = this.props.session;
        S.nSims = value;
        S.overlap = Math.floor(Math.min(S.overlap, (S.len + S.buf) - (S.len + S.buf)*S.nSims/S.nLocs));
        this.props.onChange(S);
    }

    updateNLocs(value) {
        let S = this.props.session;
        S.nLocs = value;

        S.overlap = Math.floor(Math.min(S.overlap, (S.len + S.buf) - (S.len + S.buf)*S.nSims/S.nLocs));
        this.setState({grid: this.getDataGrid()});
        this.props.onChange(S);
    }

    updateExtraFirst(value) {
        let S = this.props.session;
        S.extraTimeFirst = value;
        this.props.onChange(S);
    }

    updateExtraEvery(value) {
        let S = this.props.session;
        S.extraTimeEvery = value;
        this.props.onChange(S);
    }

    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.session.nLocs; i++) {
            grid.push([]);
            grid[i].push({value: "Name of " + this.props.session.type.defaultLocs + " " + (i+1), readOnly: true});
            grid[i].push({value: this.props.session.locations[i]});
        }
        return grid;
    }

    updateLocs(changes) {
        const grid = this.getDataGrid().map(row => [...row]);
        changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
        });
        this.setState({grid});
        let A = [];
        for (let i = 0; i < grid.length; i++) {
            A.push(grid[i][1].value);
        }
        let S = this.props.session;
        S.locations = A;
        this.props.onChange(S);
    }

    handleDelete() {
      this.props.onDelete(this.props.session);
    }

    render() {
        let truth = this.props.session.startTime.mins < this.props.session.actualStartTime.mins;
        if (this.props.cosmetic) {
            return (
                <div className="session-form">
                    <Form>
                        <TextInput label="Title" nolabel value={this.props.session.name} onChange={this.updateName}/>
                        {this.props.session.type !== TYPES.BREAK && <ReactDataSheet
                            data={this.getDataGrid()}
                            valueRenderer={(cell) => cell.value}
                            sheetRenderer={(props) => (
                                <Table className="datagrid-custom">
                                    <tbody>
                                    {props.children}
                                    </tbody>
                                </Table>
                            )}
                            onCellsChanged={(changes) => this.updateLocs(changes)}
                        />}

                    </Form>
                </div>
            );
        } else {
            return (
                <div className="session-form">
                    <Form>
                        {this.props.advanced ?
                            <TextInput label="Title" nolabel value={this.props.session.name}
                                       onChange={this.updateName}/> :
                            <h3>{this.props.session.name}</h3>
                        }
                        <DateTimeInput label={"Start time" + ((truth) ? "*" : "")} value={this.props.session.startTime}
                                       onChange={this.updateStartTime}/>
                        <DateTimeInput label="Will be done by" immutable={this.props.session.type !== TYPES.BREAK}
                                       value={(this.props.session.type !== TYPES.BREAK)?this.props.session.actualEndTime:this.props.session.endTime} onChange={this.updateEndTime}/>
                        {this.props.session.type !== TYPES.BREAK &&
                        <NumberInput label="Duration (mins)" min={1} value={this.props.session.len}
                                     onChange={this.updateLen}/>}
                        {this.props.session.type !== TYPES.BREAK &&
                        <NumberInput label="Buffer/cleanup time (mins)" min={0} value={this.props.session.buf}
                                     onChange={this.updateBuf}/>}
                        {(this.props.session.type === TYPES.MATCH_ROUND || this.props.session.type === TYPES.MATCH_ROUND_PRACTICE) &&
                        <NumberInput label="Overlap (mins)" min={0} value={this.props.session.overlap}
                                     onChange={this.updateOverlap}/>}
                        {this.props.session.type !== TYPES.BREAK && (
                            this.props.session.type === TYPES.JUDGING ?
                                <NumberInput label="Number of rooms" min={1} value={this.props.session.locations.length}
                                             onChange={this.updateNLocs}/> :
                                <NumberInput label="Number of tables" min={1}
                                             value={this.props.session.locations.length} onChange={this.updateNLocs}/>)}
                        {(this.props.session.type === TYPES.MATCH_ROUND || this.props.session.type === TYPES.MATCH_ROUND_PRACTICE) &&
                        <NumberInput label="Simultaneous Teams" min={1} value={this.props.session.nSims}
                                     onChange={this.updateNSims}/>
                        }
                        {this.props.advanced && this.props.session.type !== TYPES.BREAK &&
                        <BooleanInput label="Extra time first?" value={this.props.session.extraTimeFirst}
                                      onChange={this.updateExtraFirst}/>}
                        {this.props.advanced && this.props.session.type !== TYPES.BREAK  &&
                        <NumberInput label="Extra time every N" value={this.props.session.extraTimeEvery} min={0}
                                     onChange={this.updateExtraEvery}/>}
                        {this.props.session.type !== TYPES.BREAK && <strong>Locations</strong>}
                        {this.props.session.type !== TYPES.BREAK && <ReactDataSheet
                            data={this.getDataGrid()}
                            valueRenderer={(cell) => cell.value}
                            sheetRenderer={(props) => (
                                <Table className="datagrid-custom">
                                    <tbody>
                                    {props.children}
                                    </tbody>
                                </Table>
                            )}
                            onCellsChanged={(changes) => this.updateLocs(changes)}
                        />}
                        {this.props.session.type === TYPES.BREAK &&
                        <Button color='primary' onClick={this.props.onToggle}>Break applies to...</Button>}
                        {truth && <span>* Will actually start at {this.props.session.actualStartTime.time}</span>}
                        <br/>
                        {this.props.advanced && <Button onClick={this.handleDelete} color='danger'><MdRemoveCircleOutline/> Delete</Button>}

                    </Form>
                    <br/>
                </div>
            );
        }
    }
}
