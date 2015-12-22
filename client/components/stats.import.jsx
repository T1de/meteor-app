/* jshint esnext:true */
/* global Meteor, React */
"use strict";

import { _, Router, Chart, moment, D3 } from 'app-deps';
import { Entries } from 'lib/models/entryModel';
var { Line } = Chart;
var { ScatterChart } = D3;

// React component corresponding to the default route for the app, i.e. the
// home page.

var CustomChart = React.createClass({

    getInitialState: function() {
        console.log(this.props);
        return {
            data: this.props.data
        }
    },
    componentWillReceiveProps: function(nextProps) {
        console.log(nextProps);

        this.setState(
            {
                data: nextProps.data
            }
        );
    },

    render: function() {
        return (
            <div>
            <ScatterChart
                data={this.state.data}
                width={375}
                height={400}
                circleRadius={10}
                />
            </div>
        );
    }

});



export default React.createClass({
    displayName: 'Stats',
    mixins: [ReactMeteorData],
    getMeteorData: function() {
        var user = Meteor.user();
        var subscriptionHandle = Meteor.subscribe("entries");

        let entry_dates = [];
        let readings = [];
        let bg_readings = [];
        let carbs = [];
        let carbs2 = [];

        var entries = Entries.find({}, {sort: {created_at: 1}, limit: 5}).fetch();
        _.forEach(entries, function(n) {

            //var date = moment(n.created_at).format('MM/DD/YYYY');
            var date = new Date(n.created_at);

            entry_dates.push(date);
            readings.push(n.reading);

            if(n.reading){
                bg_readings.push({x: date, y: n.reading});
            }

            if(n.carbs) {
                carbs2.push({x: date, y: n.carbs});
            }

        });

        return {
            scatterData: [{
                name: "Carbs",
                values: carbs2
            },
            {
                name: "BG",
                values: bg_readings
            }]
        };
    },
    getRadius: function(d) {
        console.log(d);
        return Math.sqrt(d);
    },
    render: function() {
        return (
            <div className="app-body">
                <CustomChart data={this.data.scatterData} />
            </div>
        );
    }

});
