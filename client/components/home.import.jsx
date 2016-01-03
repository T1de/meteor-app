/* jshint esnext:true */
/* global Meteor, React */
"use strict";

import { _, Router } from 'app-deps';

var { Link } = Router;

// React component corresponding to the default route for the app, i.e. the
// home page.

export default React.createClass({
    displayName: 'Home',

    getInitialState: function() {
      return {
          first_name: Meteor.user().profile.first_name || ''
      }
    },

    render: function() {
        return (
            <div className="app-body">
                <h1>Welcome, {this.state.first_name}</h1>
            </div>
        );
    }

});
