<article>
<div id="app"></div>
    <div>
    Existing content
</div>
<div class="replaceable">
    Some content that we want ember to replace
</div>
</article>

<script type="text/x-handlebars">
    <h2> Welcome!</h2>

<div>
<button {{action "showStuff"}}>Click me!</button>
<button {{action "loadPosts"}}>Load posts</button>
</div>

{{someText}}
</script>

<script type="text/x-handlebars" data-template-name="posts">
    {{#each posts}}
<div>Post: {{title}}</div>
{{else}}
LOADING POSTS
{{/each}}
</script>




var FakeAjax = function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {

    });
};


var App = Ember.Application.create({
    rootElement: "#incidentList"
});
//dont use ember routing
App.Router.reopen({
    location: 'none',
    model: function () {
        return ajax('url', options);
    }
});

App.ApplicationController = Ember.Controller.extend({

});




function ajax (url, options) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
        setTimeout(function() {
            data = {posts: [{title: "one potato"}, {title: 'two potato'}]};
            resolve(data);
        }, 10);

        Ember.$.ajax(options);
    });
}
