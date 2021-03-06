/* jshint esnext:true */
/* global Meteor, Mongo, SimpleSchema, Roles */
"use strict";

import { _ } from 'app-deps';

// This file contains definitions of models and collections. They will be
// placed into the `Collections` namespace so they can be accessed in code on
// either the client or the server.

// We use SimpleSchema and Collection2 from the `aldeed:collection2` package to
// define schemata and collection validation.


var Reading = new SimpleSchema({
    reading: {
        type: String,
        label: "Reading"
    },
    note: {
        type: String,
        label: "Note",
        optional: true
    },
    label: {
        type: String,
        label: "Label",
        optional: true
    },
    created_at: {
        type: Date,
        label: "Created At"
    },
    user_id: {
        type: String,
        label: "User ID"
    }
});

export var Readings = new Mongo.Collection("Readings");
Readings.attachSchema(Reading);
Readings.allow({
    insert: function(userId, doc) {
        return (userId && Roles.userIsInRole(userId, ['write', 'admin']));
    },
    update: function(userId, doc, fields, modifier) {
        return (userId && Roles.userIsInRole(userId, ['write', 'admin']));
    },
    remove: function(userId, doc) {
        return (userId && Roles.userIsInRole(userId, ['write', 'admin']));
    }
});

// We publish two publications: `timestamps`, which we will subscribe to on a
// per-component basis, and `userData`, which we globally subscribe to on the
// client.

if(Meteor.isServer) {

    Meteor.publish("readings", function () {
        if (!this.userId) {
            return;
        }

        return Readings.find({user_id: this.userId});
    });
}
