import React from 'react';
import TextInput from '../inputs/TextInput';
import NumberInput from '../inputs/NumberInput';
//import BooleanInput from '../inputs/BooleanInput';

import {EventParams} from '../api/EventParams';

import {Container, Table, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu,
  FormGroup, Label, Col} from 'reactstrap';

import ReactDataSheet from 'react-datasheet';

export default class BasicsForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: this.getDataGrid(),
            selectedIdx: EventParams.AWARD_STYLES.findIndex((x) => {return x === this.props.event.awardStyle})
        }

        this.updateTitle = this.updateTitle.bind(this);
        this.updateMinTravel = this.updateMinTravel.bind(this);
        this.updateExtraTime = this.updateExtraTime.bind(this);
        this.updateNDays = this.updateNDays.bind(this);
        this.updateDays = this.updateDays.bind(this);
        this.updateJudgesAwards = this.updateJudgesAwards.bind(this);
        this.updateAwardStyle = this.updateAwardStyle.bind(this);
        this.updateConsolidatedAwards = this.updateConsolidatedAwards.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getDataGrid = this.getDataGrid.bind(this);
    }

    getDataGrid() {
        let grid = [];
        for (let i = 0; i < this.props.event.days.length; i++) {
            grid.push([]);
            grid[i].push({value: "Day " + (i + 1), readOnly: true});
            grid[i].push({value: this.props.event.days[i]});
        }
        return grid;
    }

    updateTitle(newTitle) {
        let data = this.props.event;
        data.title = newTitle;
        this.handleChange(data);
    }

    updateMinTravel(value) {
        let data = this.props.event;
        data.minTravel = value;
        this.handleChange(data);
    }

    updateJudgesAwards(value) {
        let data = this.props.event;
        data.judgesAwards = value;
        this.handleChange(data);
    }

    updateConsolidatedAwards(value) {
        let data = this.props.event;
        data.consolidatedAwards = value;
        this.handleChange(data);
    }

    updateAwardStyle(value) {
        let data = this.props.event;
        data.awardStyleIdx = value;
        this.setState({selectedIdx: value})
        this.handleChange(data);
    }

    updateExtraTime(value) {
        let data = this.props.event;
        data.extraTime = value;
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
        this.setState({grid: this.getDataGrid()});
        this.handleChange(E);
    }

    handleChange(data) {
        this.props.onChange(data);
    }

    render() {
        let dayInput = (
            <div>
                {/*<NumberInput label="Number of days" large value={this.props.event.days.length} onChange={this.updateNDays}/>*/}
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
            </div>
        );
        return (
            <Container>
                <TextInput large label="Title: " value={this.props.event.title} onChange={this.updateTitle}/>
                <hr/>
                <FormGroup row>
                <Label sm={2} for={"awardStyleDropDown"}>Award style</Label>
                    <Col sm={10}>
                        <UncontrolledDropdown>
                          <DropdownToggle caret>
                            {EventParams.AWARD_STYLES[this.state.selectedIdx]}
                          </DropdownToggle>
                          <DropdownMenu>
                            {EventParams.AWARD_STYLES.map((x,i) => {
                              return <DropdownItem key={i} onClick={() => {this.updateAwardStyle(i)}}>{x}</DropdownItem>;
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                    </Col>
                </FormGroup>
                {/*<BooleanInput large label="Award format" value={this.props.event.consolidatedAwards}
                              onChange={this.updateConsolidatedAwards}/>*/}
                <NumberInput large label="Number of judges awards" value={this.props.event.judgesAwards}
                             onChange={this.updateJudgesAwards} min={0}/>
                {this.props.event.awardPerc}% of teams will receive awards
                 <hr/>
                {this.props.cosmetic || <NumberInput label="Min. travel (mins)" large value={this.props.event.minTravel}
                                                     onChange={this.updateMinTravel}/>}
                {(this.props.advanced && !this.props.cosmetic) &&
                <NumberInput label="Extra time (mins)" large value={this.props.event.extraTime}
                             onChange={this.updateExtraTime}/>}
                {dayInput}
            </Container>
        );
    }
}
