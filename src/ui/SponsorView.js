import React, { Component } from 'react';

import { Container, FormGroup } from 'reactstrap';

export default class SponsorView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nationals: this.props.data.sponsors.national,
            locals: this.props.data.sponsors.local
        };
        this.addSponsor = this.addSponsor.bind(this);
        this.deleteSponsor = this.deleteSponsor.bind(this);
    }

    addSponsor(e, f) {
        let file = f || e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let E = this.props.data;
            E.addLocalSponsor(reader.result);
            console.log(E.sponsors);
            this.props.handleChange(E.sponsors);
            this.setState({locals: E.sponsors.local});
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
        this.setState({locals: E.sponsors.local});
    }

    render () {
        return (
            <Container>
                {this.state.locals.map((img,i) => {
                          return (
                            <FormGroup onClick={() => this.deleteSponsor(i)} key={i} sm={12} row><img idx={i} alt={"Logo " + {i}} src={img} height={100}/></FormGroup>
                        );})}
                <FormGroup sm={12} row>
                    <label>
                        Add!
                        <input type="file" accept="image/*" hidden ref="input" onChange={this.addSponsor}/>
                    </label>
                </FormGroup>
            </Container>
        );
    }
}
