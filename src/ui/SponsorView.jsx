import React, {Component} from 'react';

import {Container, Row, Alert, Card} from 'reactstrap';

export default class SponsorView extends Component {
    constructor(props) {
        super(props);
        this.addSponsor = this.addSponsor.bind(this);
        this.deleteSponsor = this.deleteSponsor.bind(this);
    }

    addSponsor(e, f) {
        let file = f || e.target.files[0];
        console.log(file);
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            let arr = file.name.split('.');
            let extension = arr.pop();
            E.addLocalSponsor({
                name: arr.join('.'),
                data: reader.result,
                extension: extension
            });
            console.log(E.sponsors);
            this.props.handleChange(E.sponsors);
        };
        reader.readAsDataURL(file);
    }

    deleteSponsor(i) {
        // let i = e.target.idx;
        // console.log(e.target);
        console.log(i);
        let E = this.props.data;
        E.deleteLocalSponsor(i);
        this.props.handleChange(E.sponsors);
    }

    render() {
        return (
            <Container>
                <Row><h1>National sponsors</h1></Row>
                <Row>
                    {this.props.data.sponsors.national.map((img, i) => {
                        return (
                            <Card key={i} sm={3}>
                                <img idx={i} alt={img.name} src={img.data} height={100}/>
                            </Card>
                        );
                    })}
                    <br/>
                </Row>
                <Row><h1>Local sponsors</h1></Row>
                <Row>
                    <small>Click logo to delete (local only)</small>
                </Row>
                <Row>
                    {this.props.data.sponsors.local.map((img, i) => {
                        return (
                            <Card onClick={() => this.deleteSponsor(i)} key={i} sm={12}>
                                <img idx={i} alt={img.name} src={img.data} height={100}/>
                            </Card>
                        );
                    })}
                </Row>
                <Row sm={12}>
                    <label>
                        <Alert color="success">Add!</Alert>
                        <input type="file" accept="image/*" hidden ref="input" onChange={this.addSponsor}/>
                    </label>
                </Row>
            </Container>
        );
    }
}
