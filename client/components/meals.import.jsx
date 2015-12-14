/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap } from 'app-deps';
import Loading from 'client/components/loading';
import { Readings } from 'lib/models';

var { Input, Button, ButtonToolbar, Grid, Row, Col, Glyphicon } = ReactBootstrap;

// An example of an application-specific component.

export default React.createClass({
    displayName: 'Meals',
    //mixins: [ReactMeteorData],
    getInitialState: function() {
        return {
            value: ''
        };
    },
    //getMeteorData: function() {
    //    // Start a subscription and then fetch data. Return value will be
    //    // available under `this.data`, and when a reactive change happens
    //    // in Meteor, the function will be re-run and the component re-rendered.
    //
    //    var user = Meteor.user();
    //    var subscriptionHandle = Meteor.subscribe("meals");
    //
    //    return {
    //        loading: !subscriptionHandle.ready(),
    //        readings: Readings.find().fetch(),
    //        canWrite: user? Roles.userIsInRole(user, ['write', 'admin']) : false,
    //    };
    //},

    render: function() {
        // Show loading indicator if subscriptions are still downloading
        return (
            <div className="app-body">
                <Row className='tide-form'>
                    <Col xs={12}>
                        <NutritionSearch/>
                    </Col>
                </Row>
            </div>
        );
    },

});

var NutritionSearch = React.createClass({
    getInitialState: function() {
        return {
            value: '',
            search: [{}],
            searchTimeout: ''
        };
    },
    setInitialState: function() {
        return {
            value: '',
            search: [{}],
            searchTimeout: ''
        };
    },
    performSearch: function() {

        var timeoutId = '';

        var searchValue = this.refs.nux_search.getValue();

        var component = this;

        if(component.state.searchTimeout) {
            console.log('timeoutId: ' + component.state.searchTimeout);
            clearTimeout(component.state.searchTimeout);
        }
        else {

            timeoutId = setTimeout(function () {

                component.setState({
                    value: component.refs.nux_search.getValue(),
                    search: component.state.search,
                    searchTimeout: ''
                });
                Meteor.call('search', component.refs.nux_search.getValue(),
                    function (error, data) {
                        console.log(data.data);
                        component.setState(
                            {value: component.refs.nux_search.getValue(), search: data.data.hits, searchTimeout: ''}
                        );

                    }
                );
            }, 400);
        }

        this.setState({value: searchValue, search: this.state.search, searchTimeout: timeoutId});
    },


    render: function() {
        return (
            <div className="tide-input" style={{color: 'white'}}>
                <div className="tide-row">
                    <Glyphicon glyph="search"/>

                    <Input
                        type="text"
                        value={this.state.value}
                        placeholder="Search for food item"
                        ref="nux_search"
                        groupClassName="tide-input"
                        labelClassName="laabel-class"
                        style={{display: 'inline-block'}}
                        onChange={this.performSearch}/>
                    <NutritionList results={this.state.search}/>
                </div>
            </div>
        );
    }
});

var NutritionList = React.createClass({
    displayName: "NutritionList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        results: React.PropTypes.object
    },

    render: function() {
        return (
            <table className="table table-striped">
                <tbody>
                {this.props.results.map(function(t){
                    return (
                        <NutritionItem item={t}/>
                    );
                })}
                </tbody>
            </table>
        );
    }
});

var NutritionItem = React.createClass({
    selectItem: function(itemId) {
        Meteor.call('getItem',  itemId,
            function(error, data){
                console.log(data.data.nf_total_carbohydrate);
            }
        );

        console.log(itemId);
    },

    render: function() {
        if(!this.props.item.fields){
            return (<tr><td></td></tr>);
        }
        else {
            return (
                <tr>
                    <td key={this.props.item._id}>{this.props.item.fields.item_name}</td>
                    <td>
                        <button className="btn btn-primary" onClick={() => this.selectItem(this.props.item.fields.item_id)}>
                            Select
                        </button>
                    </td>
                </tr>
            );
        }
    }
});