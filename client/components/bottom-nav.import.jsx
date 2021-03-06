/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment } from 'app-deps';

var { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem, Glyphicon } = ReactBootstrap;
var { Link } = Router;
var { NavItemLink, MenuItemLink } = ReactRouterBootstrap;

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
                <div className="container">
                    <div className={this.state.menu} style={{position: "relative", overflow: 'hidden'}}>
                        <button onClick={() => this.handleClick('readings')} style={{borderRadius: '75px', width: '75px', height: '75px', display: 'block', margin: '10px auto', fontSize: '24px'}}
                                className="circle-btn toggleNav"><Glyphicon glyph="tint" />
                        </button>
                        <button style={{borderRadius: '75px', width: '75px', height: '75px', display: 'block', margin: '10px auto', fontSize: '24px'}}
                                className="circle-btn toggleNav2"
                                onClick={() => this.handleClick('profile')}><Glyphicon glyph="user" />
                        </button>
                        <button style={{borderRadius: '75px', width: '75px', height: '75px', display: 'block', margin: '10px auto', fontSize: '24px'}}
                                className="circle-btn toggleNav3"
                                onClick={() => this.handleClick('meals')}><Glyphicon glyph="apple" />
                        </button>
                    </div>
                </div>
                <div className="bottom-nav-bar">
                    <button
                        style={{borderRadius: '75px', width: '75px', height: '75px', margin: '10px 0', fontSize: '24px'}}
                        className="circle-btn"
                        onClick={() => this.toggleMenuState()}><Glyphicon glyph="menu-hamburger" /></button>
                </div>

            </footer>
        );

    }
});
