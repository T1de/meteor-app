/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import { _, ReactBootstrap, ReactRouterBootstrap, Router, moment } from 'app-deps';

export default React.createClass({
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
        };
    },
    getConnectionStatus: function() {

        var stat, animatedClass, connectionClass;
        var component = this;

        if(this.state.connectionStatus === 'connecting'){
            animatedClass =' animated slideInDown';
            connectionClass = 'connecting' + animatedClass;
        }
        else if(this.state.connectionStatus === 'connected') {
            animatedClass =' animated slideInDown';
            connectionClass = 'connected' + animatedClass;
        }
        else if(this.state.connectionStatus === 'waiting') {
            animatedClass =' animated slideInDown';
            connectionClass = 'waiting' + animatedClass;
        }

        this.setState(
            {
                connectionStatus: Meteor.status().status,
                connectionClass: connectionClass
            }
        );
    },
    startPolling: function() {
        var self = this;
        setTimeout(function() {
            if (!self.isMounted()) { return; } // abandon
            self.getConnectionStatus(); // do it once and then start it up ...
            self._timer = setInterval(self.getConnectionStatus.bind(self), 1000);
        }, 1000);
    },
    componentDidMount: function() {
        this.startPolling();
    },
    componentWillUnmount: function() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    },

    render: function() {

        return (
            <div className={'status-bar ' + this.state.connectionStatus}>{this.state.connectionStatus}</div>
        );
    },

});
