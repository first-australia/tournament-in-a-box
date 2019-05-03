import React, { Component } from 'react';
import { PdfGenerator } from '../api/PdfGenerator';
import { CsvGenerator } from '../api/CsvGenerator';

import { Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col, Button, Card, CardText, CardTitle } from 'reactstrap';
import NumberInput from "../inputs/NumberInput";
import TextInput from "../inputs/TextInput";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default class OutputGenView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pdf_modal: false,
            title_size: this.props.data.pageFormat.titleFontSize,
            base_size: this.props.data.pageFormat.baseFontSize,
            footer: this.props.data.pageFormat.footerText,
            tl_logo: this.props.data.pageFormat.logoTopLeft,
            tr_logo: this.props.data.pageFormat.logoTopRight,
            bl_logo: this.props.data.pageFormat.logoBotLeft,
            br_logo: this.props.data.pageFormat.logoBotRight
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
      let value = this.props.data.title.replace(/ /g,"-");

      let zip = new JSZip();
      this.generatePDF(value,zip);
      this.generateCSV(value,zip);
      this.props.save(value,zip);
      zip.generateAsync({type:"blob"})
        .then((content) => {
            saveAs(content, value+".zip");
      });
    }


    generatePDF(fname,zip) {
        let p = new PdfGenerator(this.props.data);
        p.getAllPDFs(fname, zip);
    }

    generateCSV(fname,zip) {
        let c = new CsvGenerator(this.props.data);
        c.zipCSV(fname,zip);
    }

    updateTitleSize(value) {
        let E = this.props.data;
        E.pageFormat.titleFontSize = value;
        this.props.handleChange(E);
        this.setState({
            title_size: value
        });
    }

    updateFooter(value) {
        let E = this.props.data;
        E.pageFormat.footerText = value;
        this.props.handleChange(E);
        this.setState({
            footer: value
        });
    }

    updateBaseSize(value) {
        let E = this.props.data;
        E.pageFormat.baseFontSize = value;
        this.props.handleChange(E);
        this.setState({
            base_size: value
        });
    }

    onTLChange(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.pageFormat.logoTopLeft = reader.result;
            this.props.handleChange(E);
            this.setState({tl_logo: E.pageFormat.logoTopLeft});
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
            this.setState({tr_logo: E.pageFormat.logoTopRight});
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
            this.setState({bl_logo: E.pageFormat.logoBotLeft});
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
            this.setState({br_logo: E.pageFormat.logoBotRight});
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
                                    <img alt={"Top Left Logo"} src={this.state.tl_logo} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Top Right Logo"} src={this.state.tr_logo} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onTRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <NumberInput min={4} value={this.state.title_size} label={"Title font size"} onChange={this.updateTitleSize}/>
                            <br/>
                            <NumberInput min={2} value={this.state.base_size} label={"Base font size"} onChange={this.updateBaseSize}/>
                            <br/>
                            <Row>
                                <Col><label>
                                    <img alt={"Bottom Left Logo"} src={this.state.bl_logo} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBLChange}/>
                                </label></Col>
                                <Col><label>
                                    <img alt={"Bottom Right Logo"} src={this.state.br_logo} height={100}/>
                                    <input type="file" accept="image/*" hidden ref="input" onChange={this.onBRChange}/>
                                </label></Col>
                            </Row>
                            <br/>
                            <TextInput value={this.state.footer} label={"Footer Text"} onChange={this.updateFooter}/>
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
                            <Button color="success" onClick={this.downloadAll}>Go!</Button>
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
