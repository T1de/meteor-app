/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment } from 'app-deps';

var { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem, Glyphicon, Row } = ReactBootstrap;
var { Link } = Router;
var { NavItemLink, MenuItemLink } = ReactRouterBootstrap;

// Meteor components for navigation. Uses ReactBootstrap and
// ReactRouterBootstrap to manage the state of which tab is highlighted.

export default React.createClass({
    displayName: 'TopNav',
    mixins: [ReactMeteorData, Router.Navigation],

    getMeteorData: function() {
        // Reactive data fetch for Meteor user data. Requires `ReactMeteorData` mixin.
        // the returned object is now accessible under `this.data`.
        var user = Meteor.user();
        return {
            user: user,
            isAdmin: user? Roles.userIsInRole(user, ['admin']) : false,
        };
    },

    render: function() {

        return (
            <Row>
                <Navbar brand={<Link to="home"><Glyphicon glyph="menu-hamburger" /></Link>}  fixedTop toggleNavKey={0} className="navbar-tide">
                </Navbar>
            </Row>
        );
    },

    linkClick: function(event) {
        // Close menu when we click a link
        this.refs.userMenu.setDropdownState(false);
    },

    logout: function(e) {
        e.preventDefault();
        Meteor.logout();

        this.transitionTo("login");
    }

});
