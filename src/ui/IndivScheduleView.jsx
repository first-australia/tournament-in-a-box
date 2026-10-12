import React from 'react';
import ReactDataSheet from 'react-datasheet';

import {Table} from 'reactstrap';


export default class IndivScheduleView extends React.Component {

    renderAsDataSheet() {
        return (
            <div>
                <strong>Individual Schedules</strong>
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
                <strong>Individual Schedules</strong>
                <Table className={"datagrid-custom"}>
                    <tbody>
                    {this.props.data.map((x, i) =>
                        <tr key={i}>{x.map((y, j) =>
                            <td colSpan={y.colSpan} className={y.className} key={j}>{y.value}</td>)
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