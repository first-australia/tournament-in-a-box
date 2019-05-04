import React, { Component } from 'react';
import { PdfGenerator } from '../api/PdfGenerator';
import { CsvGenerator } from '../api/CsvGenerator';

import { Modal, ModalHeader, ModalBody, ModalFooter, Progress, Container, Row, Col, Button, Card, CardText, CardTitle } from 'reactstrap';
import NumberInput from "../inputs/NumberInput";
import TextInput from "../inputs/TextInput";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default class OutputGenView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf_modal: false,
            progress: 0,
            running: false
        };
        this.toggle=this.toggle.bind(this);
        this.generatePDF=this.generatePDF.bind(this);
        this.generateCSV=this.generateCSV.bind(this);
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

    downloadAll() {
      // TODO: Replace this with individual ZIP files.
      if (this.state.running) return;
      this.setState({running: true});

      let value = this.props.data.title.replace(/ /g,"-");

      let zip = new JSZip();
      this.generatePDF(value,zip,(x) => {this.setState({progress: x})});
      this.generateCSV(value,zip, (x) => {this.setState({progress: x})});
      let sponsors = zip.folder("sponsors");
      this.props.data.sponsors.national.forEach(im => {
        var uri = im.data;
        var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
        var content = uri.substring(idx);
        sponsors.file(im.name+"."+im.extension, content, {base64: true});
      });
      this.props.data.sponsors.local.forEach(im => {
        var uri = im.data;
        var idx = uri.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
        var content = uri.substring(idx);
        sponsors.file(im.name+"."+im.extension, content, {base64: true});
      });

      this.setState({progress: 100});
      this.props.save(value,zip);
      zip.generateAsync({type:"blob"})
        .then((content) => {
            saveAs(content, value+".zip");
      });
      this.setState({running: false});
    }

    generatePDF(fname,zip,update) {
        let p = new PdfGenerator(this.props.data);
        p.zipAllPDFs(fname, zip, update);
    }

    generateCSV(fname,zip,update) {
        let c = new CsvGenerator(this.props.data);
        c.zipCSV(fname,zip,update);
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

    render () {
        return (
            <Container>
                <Modal isOpen={this.state.pdf_modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Edit PDF Format</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col><label>
                                    <img alt={"Top Left Logo"} src={this.props.data.pageFormat.logoTopLeft} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Top Right Logo"} src={this.props.data.pageFormat.logoTopRight} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <NumberInput min={4} value={this.props.data.pageFormat.titleFontSize} label={"Title font size"} onChange={this.updateTitleSize}/>
                            <br/>
                            <NumberInput min={2} value={this.props.data.pageFormat.baseFontSize} label={"Base font size"} onChange={this.updateBaseSize}/>
                            <br/>
                            <Row>
                                <Col><label>
                                    <img alt={"Bottom Left Logo"} src={this.props.data.pageFormat.logoBotLeft} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Bottom Right Logo"} src={this.props.data.pageFormat.logoBotRight} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <TextInput value={this.props.data.pageFormat.footerText} label={"Footer Text"} onChange={this.updateFooter}/>
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
                        <Card body>
                            <CardTitle>Download all</CardTitle>
                            <CardText>Download PDFs, a CSV and a saved schedule file</CardText>
                            <Button color="primary" block onClick={this.toggle}>Edit PDF format...</Button>
                            <br/>
                            <Button color={this.state.running?"secondary":"success"} onClick={this.downloadAll}>Go!</Button>
                            <br/>
                            <Progress value={this.state.progress}/>
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
