/* jshint esnext:true */
/* global Meteor, Mongo, SimpleSchema, Roles */
"use strict";

import { _ } from 'app-deps';

// This file contains definitions of models and collections. They will be
// placed into the `Collections` namespace so they can be accessed in code on
// either the client or the server.

// We use SimpleSchema and Collection2 from the `aldeed:collection2` package to
// define schemata and collection validation.


var Entry = new SimpleSchema({
    reading: {
        type: Number,
        label: "Reading",
        optional: true
    },
    insulin_food: {
        type: String,
        label: "Insulin Food",
        optional: true
    },
    insulin_correction: {
        type: String,
        label: "Insulin Correction",
        optional: true
    },
    insulin_long_acting: {
        type: String,
        label: "Insulin Long Acting",
        optional: true
    },
    carbs: {
        type: Number,
        label: "Carbs",
        optional: true
    },
    meal: {
        type: Object,
        label: "Meals",
        optional: true
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

export var Entries = new Mongo.Collection("Entries");
Entries.attachSchema(Entry);
Entries.allow({
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

    Meteor.publish("entries", function () {
        if (!this.userId) {
            return;
        }

        return Entries.find({user_id: this.userId});
    });
}
