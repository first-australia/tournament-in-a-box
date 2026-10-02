import React from 'react';
import ReactDataSheet from 'react-datasheet';

import {Table} from 'reactstrap';


export default class SingleScheduleView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            swapee: null
        }

        this.select = this.select.bind(this);
    }

    select(i, j) {
        if (!this.props.editable) return; // Only swap if "editable"
        if (i === 0 || j < 2) return; // Don't swap headers or times
        let g = this.props.data;
        let x = g[i][j];
        if (!this.state.swapee) {
            this.setState({swapee: x});
        } else if (this.state.swapee === x) {
            this.setState({swapee: null});
        } else {
            // SWAP
            this.props.onSwap(this.props.id, this.state.swapee, x);
            this.setState({swapee: null});
            // alert("Not yet implemented");
        }
    }

    renderAsDataGrid() {
        return (
            <div>
                <strong>{this.props.session.name}</strong>
                <ReactDataSheet
                    data={this.props.data}
                    valueRenderer={(cell) => cell.value}
                    sheetRenderer={(props) => (
                        <Table className="datagrid-custom">
                            <tbody>
                            {props.children}
                            </tbody>
                        </Table>
                    )}
                />
            </div>
        );
    }

    renderAsTable() {
        return (
            <div>
                <strong>{this.props.session.name}</strong>
                <Table className={this.props.editable ? "datagrid-custom unselectable" : "datagrid-custom"}>
                    <tbody>
                    {this.props.data.map((x, i) =>
                        <tr key={i}>{x.map((y, j) =>
                            <td onClick={() => this.select(i, j)} colSpan={y.colSpan}
                                className={(this.state.swapee === y) ? y.className + " selected" : y.className}
                                key={j}>{y.value}</td>)
                        }</tr>)
                    }
                    </tbody>
                </Table>
            </div>
        );

    }

    render() {
        return this.renderAsTable();
    }
}