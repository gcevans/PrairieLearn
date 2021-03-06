
define(['underscore', 'backbone', 'mustache', 'renderer', 'spinController', 'text!QuestionGradingView.html'], function(_, Backbone, Mustache, renderer, spinController, questionGradingViewTemplate) {

    var QuestionGradingView = Backbone.View.extend({

        tagName: 'div',

        events: {
            "click #retrySubmit": "retrySubmit"
        },

        initialize: function() {
            this.listenTo(this.model, "change:submitted change:score change:submitError", this.render);
            this.render();
        },

        render: function() {
            var data = {
                submitted: this.model.get("submitted"),
                submitError: this.model.get("submitError"),
                showResult: false,
            };
            var score = this.model.get("score");
            if (score != null) {
                data.showResult = true;
                data.scoreLabel = renderer.scoreLabel(score) + ((score >= 0.5) ? " Correct!" : " Incorrect.");
            }
            var html = Mustache.render(questionGradingViewTemplate, data);
            this.$el.html(html);
            if (this.spinner) {
                spinController.stopSpinner(this.spinner);
            }
            var els = this.$("#qgrading-spinner").get();
            if (els.length > 0) {
                this.spinner = spinController.startSpinner(els[0]);
            }
        },

        close: function() {
            this.remove();
        },

        retrySubmit: function() {
            this.model.submitAnswer({retry: true});
        }
    });

    return {
        QuestionGradingView: QuestionGradingView
    };
});
