// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')

console.log('loaded dist file')

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }



var	weatherModel = Backbone.Model.extend({
// is the "Model" that is created when the API is fetched
		url:"https://api.forecast.io/forecast/057470c3fbde84644bd0fdad110dc863/29.7604270,-95.3698030",

		parse: function(responseData){
			console.log(responseData)
			return responseData
		}


})


var currentView = Backbone.View.extend({

	el: "#container",

	render: function(){
		console.log("putting stuff up")
		displayCurrent()
	},

	initialize: function(){
		console.log("Everything is loaded")
		this.listenTo(this.model, 'sync', this.render)
	},

	displayCurrent: function(){
		console.log("here comes the model")
		console.log(this.model)
		var currentWeather = this.model.attributes.currently
		this.$el.html(`
				<ul>
					<li>It is currently ${currentWeather.temperature} degrees</li>
					<li>It feels like ${currentWeather.apparentTemperature}, because the humidity is ${currentWeather.humidity}</li>
				</ul>`)
	}

})


var routeWeather = Backbone.Router.extend({

	routes:{
		'homepage' : 'showDefault'
	},

	initialize: function() {
		this.wm = new weatherModel()
		this.lv = new currentView({model: this.wm})
		Backbone.history.start()
	},

	showDefault: function() {
		var self = this
		console.log("showing the default.")
		this.wm.fetch({
			dataType: 'jsonp',
			// success: function(){console.log('exito!');console.log(self.wm)}
		})
	}
})

var routeThis = new routeWeather()

