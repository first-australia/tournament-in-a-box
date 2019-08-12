import React, {Component} from 'react';
import {Zipper} from "../outputs/Zipper.js";
import {SingleOutput} from "../outputs/SingleOutput.js";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
    Row,
    Col,
    Button, ButtonGroup,
    Card, //CardText, CardTitle,
    // UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu,
    Form, FormGroup, Label, Input
} from 'reactstrap';
import NumberInput from "../inputs/NumberInput";
import TextInput from "../inputs/TextInput";

export default class OutputGenView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf_modal: false,
            running: false,
            selectedIdx: 0,
            checked: SingleOutput.funcNames.map((x,i) => {return true}), //return i<7
            progress: 0
        };
        this.toggle = this.toggle.bind(this);
        this.toggleChecked = this.toggleChecked.bind(this);
        this.downloadOne = this.downloadOne.bind(this);
        this.downloadSelected = this.downloadSelected.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.checkNone = this.checkNone.bind(this);
        this.updateBaseSize = this.updateBaseSize.bind(this);
        this.updateTitleSize = this.updateTitleSize.bind(this);
        this.updateFooter = this.updateFooter.bind(this);
        this.onTLChange = this.onTLChange.bind(this);
        this.onTRChange = this.onTRChange.bind(this);
        this.onBLChange = this.onBLChange.bind(this);
        this.downloadAll = this.downloadAll.bind(this);
        this.onBRChange = this.onBRChange.bind(this);
    }

    toggle() {
        this.setState({
            pdf_modal: !this.state.pdf_modal
        });
    }


    downloadOne() {
      if (this.props.data.errors > 0) alert("Errors in schedule!  This may not be a good output");
      if (this.state.running) return;
      let z = new SingleOutput(this.props.data, this.props.save);
      this.setState({running: true});
      setTimeout(() => {
        z.get(this.state.selectedIdx);
        this.setState({running: false});
      }, 50);
    }

    downloadSelected() {
      if (this.props.data.errors > 0) alert("Errors in schedule!  This may not be a good output");
      if (this.state.running) return;
      let N = this.state.checked.filter((x)=>x).length;
      if (N === 0) return;
      if (N === 1) {
        let z = new SingleOutput(this.props.data, this.props.save);
        this.setState({running: true});
        let toDo = 0;
        for (let i = 0; i < this.state.checked.length; i++)
          if (this.state.checked[i]) {
            toDo = i;
            break;
          }
        setTimeout(() => {
          z.get(toDo);
          this.setState({running: false});
        }, 50);
      } else {
        let z = new Zipper(this.props.data, this.props.save);
        this.setState({running: true});
        console.log(this.state.checked);
        setTimeout(() => {
            this.state.checked.forEach((x,i) => {if (x) z.ProcessGiven(i)});
            z.DownloadZip();
            this.setState({running: false});
        }, 50);
      }
    }

    downloadAll() {
        if (this.props.data.errors > 0) alert("Errors in schedule!  This may not be a good output");
        if (this.state.running) return;
        let z = new Zipper(this.props.data, this.props.save);
        this.setState({running: true});
        setTimeout(() => {
            while (z.FilesLeft > 0)
                z.ProcessNext();
            z.DownloadZip();
            this.setState({running: false});
        }, 50);
    }

    checkAll() {
      let C = this.state.checked.map((x) => {return true;});
      this.setState({checked: C});
    }

    checkNone() {
      let C = this.state.checked.map((x) => {return false;});
      this.setState({checked: C});
    }

    toggleChecked(idx) {
      let C = this.state.checked;
      C[idx] = !C[idx];
      this.setState({checked: C});
    }

    updateTitleSize(value) {
        let E = this.props.data;
        E.pageFormat.titleFontSize = value;
        this.props.handleChange(E);
    }

    updateFooter(value) {
        let E = this.props.data;
        E.pageFormat.footerText = value;
        this.props.handleChange(E);
    }

    updateBaseSize(value) {
        let E = this.props.data;
        E.pageFormat.baseFontSize = value;
        this.props.handleChange(E);
    }

    onTLChange(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.pageFormat.logoTopLeft = reader.result;
            this.props.handleChange(E);
        };
        reader.readAsDataURL(file);
    }

    onTRChange(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.pageFormat.logoTopRight = reader.result;
            this.props.handleChange(E);
        };
        reader.readAsDataURL(file);
    }

    onBLChange(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.pageFormat.logoBotLeft = reader.result;
            this.props.handleChange(E);
        };
        reader.readAsDataURL(file);
    }

    onBRChange(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.pageFormat.logoBotRight = reader.result;
            this.props.handleChange(E);
        };
        reader.readAsDataURL(file);
    }


    // To add image uploading...
    // https://codepen.io/hartzis/pen/VvNGZP

    render() {
        return (
            <Container>
                <Modal isOpen={this.state.pdf_modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit PDF Format</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col><label>
                                    <img alt={"Top Left Logo"} src={this.props.data.pageFormat.logoTopLeft}
                                         height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Top Right Logo"} src={this.props.data.pageFormat.logoTopRight}
                                         height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <NumberInput min={4} value={this.props.data.pageFormat.titleFontSize}
                                         label={"Title font size"} onChange={this.updateTitleSize}/>
                            <br/>
                            <NumberInput min={2} value={this.props.data.pageFormat.baseFontSize}
                                         label={"Base font size"} onChange={this.updateBaseSize}/>
                            <br/>
                            <Row>
                                <Col><label>
                                    <img alt={"Bottom Left Logo"} src={this.props.data.pageFormat.logoBotLeft}
                                         height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Bottom Right Logo"} src={this.props.data.pageFormat.logoBotRight}
                                         height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <TextInput value={this.props.data.pageFormat.footerText} label={"Footer Text"}
                                       onChange={this.updateFooter}/>
                        </Container>
                        <br/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>

                <strong>Outputs</strong>
                <hr/>
                <Row>
                    <Col lg="12">
                      <Button color="primary" block onClick={this.toggle}>Edit PDF format...</Button>
                      {/*<br/>
                      <Card body>
                        <CardTitle>All outputs</CardTitle>
                        <Button color={this.state.running ? "secondary" : "success"}
                                onClick={this.downloadAll}>{this.state.running ? "Please wait..." : "Download all!"}</Button>
                      </Card>
                      <br/>
                      <Card body>
                        <CardTitle>Single output</CardTitle>
                        <ButtonGroup>
                        <UncontrolledDropdown>
                          <DropdownToggle caret>
                            {SingleOutput.funcNames[this.state.selectedIdx]}
                          </DropdownToggle>
                          <DropdownMenu>
                            {SingleOutput.funcNames.map((x,i) => {
                              return <DropdownItem key={i} onClick={() => {this.setState({selectedIdx: i})}}>{x}</DropdownItem>;
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                        <Button color={this.state.running ? "secondary" : "success"}
                                onClick={this.downloadOne}>{this.state.running ? "Please wait..." : "Download one"}</Button>
                                </ButtonGroup>
                      </Card>
                      <br/>*/}
                      <Card body>
                        <Form>
                          <FormGroup row>
                          {SingleOutput.funcNames.map((x,i) => {
                            return (
                              <Col sm={{ size: 3 }} key={i}>
                              <FormGroup check>
                                <Label check>
                                  <Input type="checkbox" id="checkbox2" checked={this.state.checked[i]} onChange={() => this.toggleChecked(i)}/>{' '}
                                  {SingleOutput.funcNames[i]}
                                </Label>
                              </FormGroup>
                              </Col>
                            );
                          })}
                          </FormGroup>
                        </Form>
                        <ButtonGroup>
                          <Button onClick={this.checkAll} color="info">All</Button>
                          <Button onClick={this.checkNone} color="warning">None</Button>
                        </ButtonGroup>
                        <br/>
                        <Button color={this.state.running ? "secondary" : "success"}
                                onClick={this.downloadSelected}>{this.state.running ? "Please wait..." : "Download these"}</Button>
                      </Card>
                    </Col>
                </Row>
                <br/>
                {/*<Row>*/}
                {/*<Col lg="6">*/}
                {/*<Card body>*/}
                {/*<CardTitle>CSV only</CardTitle>*/}
                {/*<CardText>Export to CSV format used by the FLL scoring system</CardText>*/}
                {/*<Button color="success" onClick={this.generateCSV}>Go!</Button>*/}
                {/*</Card>*/}
                {/*</Col>*/}
                {/*<Col lg="6">*/}
                {/*<Card body>*/}
                {/*<CardTitle>PDF only</CardTitle>*/}
                {/*<CardText>Export ready-to-print formatted PDFs</CardText>*/}
                {/*<Button color="primary" block onClick={this.toggle}>Edit format...</Button>*/}
                {/*<Button color="success" block onClick={this.generatePDF}>Go!</Button>*/}
                {/*</Card>*/}
                {/*</Col>*/}
                {/*</Row>*/}
            </Container>
        );
    }
}
