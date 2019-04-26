import React from 'react';

import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import ReactTooltip from 'react-tooltip'

import MdInfoOutline from 'react-icons/lib/md/info-outline'
import MdFileDownload from 'react-icons/lib/md/file-download'
import MdFileUpload from 'react-icons/lib/md/file-upload'

import firstlogo from "../resources/firstlogo.png"

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            advanced: false,
        };

        this.toggle = this.toggle.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onFileChange(e, f) {
      let file = f || e.target.files[0];
      let reader = new FileReader();
      console.log(file);

      reader.onload = () => {
         this.props.onLoad(reader.result);
      };
      reader.readAsText(file);
      // reader.readAsDataURL(file);
    }

    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand><img alt="" width="80px" src={firstlogo}/></NavbarBrand>
                <NavbarBrand>FLL Scheduler <small>Version {this.props.version}</small></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink>
                            </NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle data-tip="Info" nav caret>
                                <MdInfoOutline size={20}/>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <a target="_blank" rel="noopener noreferrer" href={"https://github.com/frewes/scheduler"}>
                                    <DropdownItem>Manual</DropdownItem>
                                </a>
                                <a target="_blank" rel="noopener noreferrer" href={"https://goo.gl/forms/rJOM0xa24MVZqVhh2"}>
                                    <DropdownItem>Report an issue...</DropdownItem>
                                </a>
                                <DropdownItem divider />
                                <a target="_blank" rel="noopener noreferrer" href="mailto:fred@firstaustralia.org">
                                    <DropdownItem>Contact developer</DropdownItem>
                                </a>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem data-tip="Save current progress" onClick={() => {this.props.onSave();}}><NavLink><MdFileDownload size={20}/></NavLink></NavItem>
                        <ReactTooltip place="bottom" type="light" effect="solid"/>
                        <NavItem data-tip="Load previous schedule" ><NavLink><label><MdFileUpload size={20}/><input type="file" accept=".schedule" onChange={this.onFileChange} hidden ref="input" /></label></NavLink></NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
