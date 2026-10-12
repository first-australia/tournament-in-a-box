import React from 'react';

import {Table} from 'reactstrap';

import { TYPES } from '../api/SessionTypes';

export default class DayScheduleView extends React.Component {
    constructor(props) {
        super(props);
        this.getItems = this.getItems.bind(this);
    }


    getItems() {
        let sessions = this.props.event.sessions;
        let sorted = sessions.sort((a, b) => {
            return a.actualStartTime.mins - b.actualStartTime.mins
        });
        let items = [];
        for (let i = 0; i < sorted.length; i++) {
            items.push({
                _id: i + 1,
                sTime: sorted[i].actualStartTime.time,
                eTime: sorted[i].actualEndTime.time,
                contents: sorted[i].name,
                break: sorted[i].type === TYPES.BREAK
            });
        }
        return items;
    }

    render() {
        let items = this.getItems();
        return (<div>
            <Table>
                <thead>
                <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Event</th>
                </tr>
                </thead>
                <tbody>
                {items.map(x => {
                    return (
                        <tr key={x._id} className={x.break ? "break" : ""}>
                            <td>{x.sTime}</td>
                            <td>{x.eTime}</td>
                            <td>{x.contents}</td>
                        </tr>);
                })}
                </tbody>
            </Table>
        </div>)
    }
}
