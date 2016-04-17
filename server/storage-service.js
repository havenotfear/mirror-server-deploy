var storage = require('node-persist');
var constants = require('./constants');
var currentUser = null;
var _ = require('lodash');

module.exports = function () {
    var module = {
        init: function () {
            storage.initSync();
            currentUser = storage.getItem(constants.CURRENT_USER);
            if (!currentUser) {
                currentUser = constants.SYSTEM_USER;
            }
        },
        deleteUser: function(users) {
            if (user != constants.SYSTEM_USER) {
                users = _.without(user, currentUser);
                storage.setItem(constants.USERS, users);
            }
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
                user = currentUser;
            }
            storage.setItemSync(user, dashboard);
        },
        getUsers: function () {
            return storage.getItem(constants.USERS);
        },
        currentUser: currentUser,
        switchUser: function (user) {
            currentUser = user;
            storage.setItemSync(constants.CURRENT_USER, currentUser);
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

