/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles, ScrollMagic, Avatar */
"use strict";

import  { _, moment, bootbox, ReactBootstrap, Router } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';
var { Link } = Router;

var { Input, Button, ButtonToolbar, Image, Row, Glyphicon } = ReactBootstrap;

export default React.createClass({
    displayName: "Profile",
    componentDidMount: function() {

    },
    getInitialState: function() {
        return {
            first_name: Meteor.user().profile.first_name || '',
            last_name: Meteor.user().profile.last_name  || '',
            max_bg_limit: Meteor.user().profile.max_bg_limit  || 0,
            min_bg_limit: Meteor.user().profile.min_bg_limit || 0
        };
    },

    updateFirstName: function(event) {
        var firstName = event.target.value;
        this.setState({first_name: firstName});

        Meteor.call('Profile.update.firstName', firstName, function(err, res) {
           if(err){
               console.log(err);
           }
        });
    },

    updateLastName: function(event) {
        var lastName = event.target.value;
        this.setState({last_name: lastName});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.last_name": lastName}})
    },

    updateMaxBgLimit: function(event) {

        var maxBgLimit, inputValue;

        inputValue = event.target.value;

        if(inputValue != ''){
            maxBgLimit= parseInt(event.target.value);
        }
        else {
            maxBgLimit = event.target.value;
        }

        this.setState({max_bg_limit: maxBgLimit});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.max_bg_limit": maxBgLimit}})
    },

    updateMinBgLimit: function(event) {
        var minBgLimit = parseInt(event.target.value);
        this.setState({min_bg_limit: minBgLimit});
        Meteor.users.update({_id:Meteor.user()._id}, {$set:{"profile.min_bg_limit": minBgLimit}})
    },

    logout: function(e) {
        e.preventDefault();
        Meteor.logout();

        window.location.replace("/login");
    },

    render: function() {
        return (
        <div className='app-body profile-page'>
            <div className="profile-info">
                <div className="tide-row tide-expand">
                    General
                    <Glyphicon glyph="menu-down" style={{float: 'right'}}/>
                </div>
                <div className="profile">
                    <div className="form-horizontal tide-input">
                        <div className="form-group">
                            <div className="col-xs-5">
                                <label>First Name</label>
                            </div>
                            <div className="col-xs-7">
                                <input
                                    value={this.state.first_name}
                                    type="text"
                                    placeholder="First Name"
                                    onChange={this.updateFirstName}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="col-xs-5">
                                <label>Last Name</label>
                            </div>
                            <div className="col-xs-7">
                                <input
                                    value={this.state.last_name}
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={this.updateLastName}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="col-xs-5">
                                <label>Max Target Range</label>
                            </div>
                            <div className="col-xs-7">
                                <input
                                    value={this.state.max_bg_limit}
                                    type="number"
                                    placeholder="Blood Glucose Max Target"
                                    onChange={this.updateMaxBgLimit}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="col-xs-5">
                                <label>Min Target Range</label>
                            </div>
                            <div className="col-xs-7">
                                <input
                                    value={this.state.min_bg_limit}
                                    type="number"
                                    placeholder="Blood Glucose Min Target"
                                    onChange={this.updateMinBgLimit}/>
                            </div>
                        </div>

                        <button className="login" onClick={this.logout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>

        );
    }
});

export var ProfileBlock = React.createClass({
    displayName: "Profile",

    render: function(){
        return (
            <div className="profile-block">
            </div>
        );
    }
});
