import React, { Component } from 'react';
import InitForm from './ui/InitForm'
import { EventParams } from "./api/EventParams";
import DetailView from "./ui/DetailView";
import TopBar from './ui/TopBar';
import { DateTime } from './api/DateTime';

import { Scheduler } from './scheduling/Scheduler';

import { freeze, thaw, saveToFile_json} from './scheduling/utilities';

import { Container, Jumbotron, Button, Row, Col } from 'reactstrap';
import DayScheduleView from "./ui/DayScheduleView";
import FullScheduleView from "./ui/FullScheduleView";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-datasheet/lib/react-datasheet.css';
import './react-datagrid-custom.css';

// Should set this up as github.io page under the firstaustralia repo
// That way github manages load balancing and doesn't crash

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'Initialise',
            eventParams: new EventParams( this.props.version,
                "2018 FLL Competition", 24, new DateTime(8.5*60), new DateTime(17*60)),
            processing: false
        };
        this.initSchedule= this.initSchedule.bind(this);
        this.handleScheduleChange = this.handleScheduleChange.bind(this);
        this.customise = this.customise.bind(this);
        this.generate = this.generate.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.updatePDFSettings = this.updatePDFSettings.bind(this);
        this.update = this.update.bind(this);
    }

    initSchedule(initState) {
        let E = new EventParams( this.props.version,
            initState.title, initState.nTeams, initState.startTime, initState.endTime);

        this.setState({
            eventParams: E,
        });
    }

    handleScheduleChange(E) {
        this.setState({
            eventParams: E
        });
        // I don't love this way of doing it...
        let S = new Scheduler(E);
        S.buildAllTables();

    }

    customise() {
        this.state.eventParams.populateFLL();
        let S = new Scheduler(this.state.eventParams);
        S.buildAllTables();
        this.setState({display: 'Customise'});
    }

    generate() {
        console.log("GENERATING");
        this.setState({processing: true})
        setTimeout((() => {
            let S = new Scheduler(this.state.eventParams);
            let count = 500;
            do {
                S.buildAllTables();
                S.fillAllTables();
                S.evaluate();
            } while (this.state.eventParams.errors > 0 && count-- > 0);
            if (this.state.eventParams.errors > 0) alert("Schedule generated with errors! Please adjust parameters");
            this.setState ({display: 'Review'});
            this.setState({processing: false});
        }), 50);
    }

    onSave(fname) {
      let filename=fname;
      if (!filename) filename=prompt("Enter filename", this.state.eventParams.title.replace(/ /g, '_'));
      // let json_str = JSON.stringify(this.state.eventParams,freeze);
      let json_str = JSON.stringify(this.state,freeze);
      if (filename != null) saveToFile_json(filename+".schedule",json_str);
      // Write to file
    }

    onLoad(json_str) {
      let E = JSON.parse(json_str,thaw);
      console.log(E);
      // let disp = 'Customise';
      // if (E.schedule !== null) disp = 'Review';
      this.setState(E);
    }

    updatePDFSettings(S) {
        let E = this.state.eventParams;
        E.titleFontSize = S.titleFontSize;
        E.baseFontSize = S.baseFontSize;
        E.logoTopLeft = S.logoTopLeft;
        E.logoTopRight = S.logoTopRight;
        E.logoBotLeft = S.logoBotLeft;
        E.logoBotRight = S.logoBotRight;
        E.footerText = S.footerText;
        this.setState({eventParams: E});
    }

    update(event) {
        // let E = this.state.eventParams;
        // E.teams = event.teams;
        // for (let i = 0; i < E.sessions.length; i++) {
        //     E.sessions = event.sessions;
        // }
        // console.log(this.state.eventParams.sessions[6].schedule[0].teams.map(x => this.state.eventParams.getTeam(x).number));
        // console.log(event.sessions[6].schedule[0].teams.map(x => event.getTeam(x).number));
        this.setState({eventParams: event});
    }

    render() {
        let mainWindow = <h1>An error occurred</h1>;
        if (this.state.display === 'Initialise') {
            mainWindow = (
                <Jumbotron>
                    <h1 className="App-intro">
                        Basic setup
                    </h1>
                    <InitForm event={this.state.eventParams} onChange={this.handleScheduleChange}/>
                    <Button color="warning" onClick={this.customise}>Customise</Button>&nbsp;
                    <Button color="success" onClick={()=> {
                        this.state.eventParams.populateFLL();
                        this.generate();
                    }}>{this.state.processing ? "Generating..." : "Generate"}</Button>

                </Jumbotron>
            );
        } else if (this.state.display === 'Customise') {
            mainWindow = (
                <Row>
                    <Col lg="3">
                        &nbsp;
                        <br/>
                        <Button color="success" onClick={this.generate}>{this.state.processing ? "Generating..." : "Run Schedule Generation"}</Button>
                        <br/>
                        &nbsp;
                        <DayScheduleView event={this.state.eventParams}/>
                    </Col>
                    <Col lg="9">
                        <Jumbotron>
                            <DetailView onChange={this.handleScheduleChange} event={this.state.eventParams}/>
                        </Jumbotron>
                    </Col>
                </Row>
            )
        } else if (this.state.display === 'Review') {
            mainWindow = (
                <Row>
                    <Col lg="3">
                        &nbsp;
                        <br/>
                        <Button color="warning" onClick={() => this.setState({display: 'Customise'})}>Change parameters</Button>&nbsp;
                        <br/>
                        &nbsp;
                        <DayScheduleView event={this.state.eventParams}/>
                    </Col>
                    <Col lg="9">
                        <Jumbotron>
                            <FullScheduleView event={this.state.eventParams} save={this.onSave} onChange={this.updatePDFSettings} onSwap={this.update}/>
                        </Jumbotron>
                    </Col>
                </Row>
            )
        }

        return (
            <Container fluid className="App">
                <TopBar version={this.props.version} onSave={this.onSave} onLoad={this.onLoad}/>
                {mainWindow}
            </Container>
        );
  }
}

export default App;
