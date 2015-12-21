/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment, FontAwesome } from 'app-deps';

export default React.createClass({
    mixins: [ReactMeteorData],
    displayName: 'ConnectionStatus',
    getInitialState: function() {
        return {
            connectionStatus: 'connecting',
            connectionClass: 'connecting animated slideInDown'
        }
    },
    getMeteorData: function() {
        // Reactive data fetch for Meteor user data. Requires `ReactMeteorData` mixin.
        // the returned object is now accessible under `this.data`.
        var user = Meteor.user();
        return {
            user: user,
            isAdmin: user? Roles.userIsInRole(user, ['admin']) : false,
            connectionStatus: Meteor.status().status
        };
    },
    getConnectionStatus: function() {

        var stat, animatedClass, connectionClass;
        var component = this;

        if(this.state.connectionStatus === 'connecting'){
            animatedClass =' animated slideInDown';
            connectionClass = 'connecting';
        }
        else if(this.state.connectionStatus === 'connected') {
            animatedClass =' animated slideInDown';
            connectionClass = 'connected';
        }
        else if(this.state.connectionStatus === 'waiting') {
            animatedClass =' animated slideInDown';
            connectionClass = 'waiting';
        }

        this.setState(
            {
                connectionStatus: Meteor.status().status,
                connectionClass: connectionClass + animatedClass
            }
        );
    },
    componentDidMount: function() {
        //this.startPolling();
    },
    componentWillUnmount: function() {

    },
    render: function() {

        return (
            <div className={'status-bar ' + this.data.connectionStatus}>{this.data.connectionStatus}
            </div>
        );
    },

});
