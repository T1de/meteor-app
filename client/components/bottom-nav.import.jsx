/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment, FontAwesome } from 'app-deps';

var { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem, Glyphicon } = ReactBootstrap;
var { Link } = Router;
var { NavItemLink, MenuItemLink } = ReactRouterBootstrap;
import ConnectionStatus from 'client/components/connection-status';

// Meteor components for navigation. Uses ReactBootstrap and
// ReactRouterBootstrap to manage the state of which tab is highlighted.

export default React.createClass({
    displayName: 'BottomNav',
    mixins: [ReactMeteorData, Router.Navigation],

    getInitialState: function() {

        return {
            menu: 'hide'
        };
    },


    getMeteorData: function() {
        // Reactive data fetch for Meteor user data. Requires `ReactMeteorData` mixin.
        // the returned object is now accessible under `this.data`.
        var user = Meteor.user();
        return {
            user: user,
            isAdmin: user? Roles.userIsInRole(user, ['admin']) : false,
        };
    },
    toggleMenuState: function() {
        if(this.state.menu == 'hide')
            this.setState({menu: 'show'});
        else
            this.setState({menu: 'hide'});
    },

    handleClick: function(link) {
        this.transitionTo('/' + link);
        this.toggleMenuState();
    },

    render: function() {
        return (
            <footer>
                <div className="bottom-nav-bar">
                    <button onClick={() => this.handleClick('readings')} className="bottom-nav-btn">
                        <Glyphicon glyph="tint" />
                    </button>
                    <button className="bottom-nav-btn" onClick={() => this.handleClick('profile')}>
                        <Glyphicon glyph="user" />
                    </button>
                    <button className="bottom-nav-btn" onClick={() => this.handleClick('meals')}>
                        <Glyphicon glyph="apple" />
                    </button>
                </div>
                <ConnectionStatus />
            </footer>
        );

    }
});
