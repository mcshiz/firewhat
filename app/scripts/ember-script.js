var FakeAjax = function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
        setTimeout(function() {
            data = {posts: [{title: "one potato"}, {title: 'two potato'}]};
            resolve(data);
        }, 1000);
    });
};


var App = Ember.Application.create({
    rootElement: "#app"
});

App.Router.reopen({
    location: 'none'
});

App.ApplicationController = Ember.Controller.extend({
    buttonVisible: false,
    someText: 'It sucks to not be clicked.',
    posts: [],

    actions: {
        showStuff: function() {
            this.set('someText', 'Sweet click bro.');
        },
        loadPosts: function() {
            var controller = this;
            var view = Ember.View.create({
                templateName: 'posts',
                context: controller
            });
            view.replaceIn('.replaceable');
            FakeAjax().then(function(data) {
                controller.set('posts', data.posts);
            });
        }
    }
});
