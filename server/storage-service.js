var storage = require('node-persist');
var constants = require('./constants');
var _ = require('lodash');

module.exports = function () {
    var module = {
        init: function () {
            storage.initSync();
            var currentUser = storage.getItem(constants.CURRENT_USER);
            if (!currentUser) {
                storage.setItem(constants.CURRENT_USER, constants.SYSTEM_USER);
            }
        },
        deleteUser: function(users) {
            if (user != constants.SYSTEM_USER) {
                users = _.without(user, currentUser);
                storage.setItem(constants.USERS, users);
            }
        },
        getRotation: function() {
            var rotation = storage.getItem(constants.ROTATION);
            if (!rotation) {
                rotation  = 0;
                module.setRotation(rotation);
            }
            return rotation;
        },
        setRotation: function(rotation) {
            storage.setItemSync(constants.ROTATION, rotation);
        },
        checkUser: function(user) {
            if (!user) {
                return;
            }
            var users = storage.getItem(constants.USERS);
            if (!_.includes(users, user)) {
                users.push(user);
                storage.setItem(constants.USERS, users);
            }
        },
        getDashboard: function (user) {
            return storage.getItem(user);
        },
        saveDashboard:function (user, dashboard) {
            if (!user) {
                user = module.getCurrentUser();
            }
            storage.setItemSync(user, dashboard);
        },
        getUsers: function () {
            if (!storage.getItem(constants.USERS)) {
                storage.setItem(constants.USERS, []);
            }
            return storage.getItem(constants.USERS);
        },
        getCurrentUser: function() {
            return storage.getItem(constants.CURRENT_USER);
        },
        switchUser: function (user) {
            storage.setItemSync(constants.CURRENT_USER, user);
        },
        userCaptured: function (user) {
            var users = module.getUsers();
            if (!_.contains(users, user)) {
                users.push(user);
                storage.setItem(constants.USERS, users);
            }
        },
        getMirrorName: function() {
            var name = storage.getItem(constants.MIRROR_NAME);
            return name ? name : "Adept Smart Mirror";
        },
        saveMirrorName: function(name) {
            storage.setItem(constants.MIRROR_NAME, name);
        }
    };

    return module;
};

