/* jshint esnext:true */
/* global Meteor, React, ReactMeteorData, Roles */
"use strict";

import  { _, moment, bootbox, ReactBootstrap, Swipeable, SwipeToRevealOptions } from 'app-deps';
import Loading from 'client/components/loading';
import { Entries } from 'lib/models/entryModel';

var { Input, Button, ButtonToolbar, Glyphicon } = ReactBootstrap;

// An example of an application-specific component.

export default React.createClass({
    displayName: 'Entries',
    mixins: [ReactMeteorData],
    getInitialState: function() {
        return {
            showForm: false
        };
    },
    setInitialState: function() {
        return {
            showForm: false
        };
    },
    getMeteorData: function() {
        // Start a subscription and then fetch data. Return value will be
        // available under `this.data`, and when a reactive change happens
        // in Meteor, the function will be re-run and the component re-rendered.

        var user = Meteor.user();
        var subscriptionHandle = Meteor.subscribe("entries");

        return {
            loading: !subscriptionHandle.ready(),
            entries: Entries.find({}, {sort: {created_at: -1}}).fetch(),
            canWrite: user? Roles.userIsInRole(user, ['write', 'admin']) : false,
        };
    },
    showForm: function() {
        if(this.state.showForm) {
            this.setState({showForm: false});
        }
        else {
            this.setState({showForm: true});
        }

    },
    render: function() {

        // Show loading indicator if subscriptions are still downloading

        if(this.data.loading) {
            return <Loading />;
        }

        return (
            <div className="app-body">
                <BGForm showForm={this.state.showForm} hideOnClick={this.showForm}/>
                <div className="center-text" style={{paddingTop: '30px'}}>
                    <button className="rounded-btn" onClick={this.showForm}><Glyphicon glyph="plus"/> Add Entry</button>
                </div>
                <div className="reading-rows" style={{marginBottom: "20px"}}>
                    <EntriesList entries={this.data.entries} />
                </div>
            </div>
        );
    },

});

var EntriesList = React.createClass({
    displayName: "EntriesList",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        entries: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <div style={{marginTop: '30px'}}>
            {this.props.entries.map(t => {
                return (
                    <ReadingRow reading={t} key={t._id}/>
                );
            })}
            </div>
        );
    }

});

var ReadingRow = React.createClass({
    displayName: "EntryRow",

    getInitialState: function() {
        return {
            open: 'hide'
        }
    },

    componentWillUnmount: function() {
      this.setState({
          open: 'hide'
      });
    },

    editReading: function() {
        Entries.remove(this.props.reading._id);
    },
    deleteReading: function() {
        Entries.remove(this.props.reading._id);
    },

    getReadingClass: function(){
        var min = Meteor.user().profile.min_bg_limit;
        var max = Meteor.user().profile.max_bg_limit;

        if(this.props.reading.reading <= parseInt(max) && this.props.reading.reading >= parseInt(min)){
            return 'success';
        }
        else if (this.props.reading.reading > parseInt(max) || this.props.reading.reading < parseInt(min)) {
            return 'danger';
        }
    },

    readingDetails: function() {

        if(this.state.open == 'hide'){
            this.setState({open: 'show'});
        }
        else {
            this.setState({open: 'hide'});
        }
    },

    leftOptions: [{
        label: 'Trash',
        class: 'trash',
        action: function() {
            if(this.state.open == 'hide'){
                this.setState({open: 'show'});
            }
            else {
                this.setState({open: 'hide'});
            }
        }
    }],
    rightOptions: [{
        label: 'Edit',
        class: 'move',
        action: function() {console.log('This is awesome')}

    }],
    callActionWhenSwipingFarLeft: true,
    callActionWhenSwipingFarRight: true,

    testMessage: function(option) {

    },

    render: function() {
        return (
            // TODO - Add view todo details
            <SwipeToRevealOptions
                leftOptions={this.leftOptions}
                rightOptions={this.rightOptions}
                callActionWhenSwipingFarRight={this.callActionWhenSwipingFarRight}
                callActionWhenSwipingFarLeft={this.callActionWhenSwipingFarLeft}
                onRightClick={(option)=>this.readingDetails()}
                onLeftClick={()=>this.deleteReading()}>
                <div className="reading-row">
                    <div className="reading-body" >
                        <div className={this.getReadingClass() + ' reading'}>{this.props.reading.reading}<span className="reading-label">mg/dl</span></div>
                        <div className="" style={{display: 'inline-block', width: 'auto', padding: '20px'}}>
                            <div className="">{this.props.reading.note}</div>
                            <div className={this.getReadingClass() + ''}>{moment(this.props.reading.created_at).fromNow()}</div>
                        </div>
                    </div>
                    <div className={this.state.open + ' reading-details'}>
                        <div className="reading-details-row">
                            <div className="left">Note:</div>
                            <div className="right">{this.props.reading.note}</div>
                        </div>
                        <div className="reading-details-row">
                            <div>
                            <button className="tide-btn btn-half" onClick={this.editReading}>
                                Edit
                            </button>
                            <button className="tide-btn btn-half danger" onClick={this.deleteReading}>
                                Delete
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </SwipeToRevealOptions>

        );
    }
});

var RecordNewButton = React.createClass({
    displayName: "RecordNewButton",
    mixins: [React.addons.PureRenderMixin],

    render: function() {
        return (
            <Button className="rounded-btn" type='submit' bsStyle='success'>Save</Button>
        );
    }
});

var Overlay = React.createClass({
    displayName: "Overlay",
    getInitialState: function() {
        return {
            class: 'overlay-page hide',
        };
    },

    componentWillReceiveProps: function(nextProps) {

        var cssClass = '';

        if(nextProps.showForm){
            cssClass = 'overlay-page show animated slideInUp';
        }
        else {
            cssClass = 'overlay-page animated slideOutDown';
        }

        this.setState({class: cssClass});
    },

    render: function() {
        return (
          <div className={this.state.class}>
              <div style={{width: '100%', textAlign: 'left', paddingLeft: '25px'}}>
                  <Glyphicon glyph="remove" onClick={this.props.hideOnClick}/>
              </div>
              {this.props.children}
          </div>

        );
    }
});

var BGForm = React.createClass({
        getInitialState: function() {
            return {
                value: '',
                note: '',
                insulin_food: '',
                insulin_correction: ''
            };
        },

        setInitialState: function() {
          return {
              value: '',
              note: ''
          };
        },

        validationState: function() {
            let length = this.state.value.length;
            if(length > 10) return 'success';
            else if(length > 5) return 'warning';
            else if(length > 5) return 'error';
        },

        handleChange: function() {
            this.setState({
                value: this.refs.input.getValue(),
                note: this.refs.note.getValue(),
                carbs: this.refs.carbs.getValue(),
                insulin_food: this.refs.insulin_food.getValue(),
                insulin_correction: this.refs.insulin_correction.getValue(),
            });
        },

        getCss: function() {
            if(this.props.showForm){
                return 'overlay-page show animated slideInUp';
            }
            else {
                return 'overlay-page hide';
            }
        },

        render: function() {
            return (
                <Overlay showForm={this.props.showForm} hideOnClick={this.props.hideOnClick}>
                    <form onSubmit={this.newReading} style={{textAlign: 'center'}}>
                        <label>Blood Glucose</label>
                        <Input
                            type="number"
                            value={this.state.value}
                            placeholder="0"
                            hasFeedback
                            ref="input"
                            groupClassName="group-class tide-input large"
                            labelClassName="label-class"
                            onChange={this.handleChange}
                            className="reading-input"
                            />

                        <label>Carbs</label>
                        <Input
                            type="text"
                            value={this.state.carbs}
                            placeholder="25g"
                            hasFeedback
                            ref="carbs"
                            groupClassName="group-class tide-input"
                            labelClassName="label-class"
                            onChange={this.handleChange}
                            className="reading-input"
                            />

                        <label>Note</label>
                        <Input
                            type="text"
                            value={this.state.note}
                            placeholder="Note"
                            hasFeedback
                            ref="note"
                            groupClassName="group-class tide-input"
                            labelClassName="label-class"
                            onChange={this.handleChange}
                            className="reading-input"
                            />

                        <label>Insulin (Food)</label>
                        <Input
                            type="text"
                            value={this.state.insulin_food}
                            placeholder="Units"
                            hasFeedback
                            ref="insulin_food"
                            groupClassName="group-class tide-input"
                            labelClassName="label-class"
                            onChange={this.handleChange}
                            className="reading-input"
                            />

                        <label>Insulin (Correction)</label>
                        <Input
                            type="text"
                            value={this.state.insulin_correction}
                            placeholder="Units"
                            hasFeedback
                            ref="insulin_correction"
                            groupClassName="group-class tide-input"
                            labelClassName="label-class"
                            onChange={this.handleChange}
                            className="reading-input"
                            />
                        <RecordNewButton onClick={this.newReading} />
                    </form>
                </Overlay>
            );
        },

        newReading: function(e) {
            e.preventDefault();
            var now = new Date();

            if(this.state.value == '') {

            }
            else {
                Entries.insert({
                    created_at: now,
                    label: '',
                    note: this.state.note,
                    carbs: this.state.carbs,
                    reading: this.state.value,
                    insulin_food: this.state.insulin_food,
                    insulin_correction: this.state.insulin_correction,
                    user_id: Meteor.userId()
                });

                this.state.value = '';
                this.state.note = '';
                this.state.carbs = '';
                this.state.insulin_food = '';
                this.state.insulin_correction = '';

                this.props.hideOnClick();
            }


        }
});

var ClearButton = React.createClass({
    displayName: "ClearButton",
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        entries: React.PropTypes.arrayOf(Date).isRequired
    },

    render: function() {
        return (
            <Button bsStyle='danger' onClick={this.clearAll}>Clear all</Button>
        );
    },

    clearAll: function() {
        bootbox.confirm("Are you sure?", result => {
            if (result) {
                this.props.entries.forEach(t => {
                    Entries.remove(t._id);
                });
            }
        });
    }

});
