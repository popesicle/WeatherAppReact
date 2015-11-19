// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone'),
	React = require('react')

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



var	WeatherModel = Backbone.Model.extend({
// is the "Model" that is created when the API is fetched
		url:"https://api.forecast.io/forecast/057470c3fbde84644bd0fdad110dc863/29.7604270,-95.3698030",

		parse: function(responseData){
			console.log("ninja turtles")
			// console.log(responseData)
			return responseData
		}


});

var CurrentView = React.createClass({

	render: function(){

		var theWeatherNow = this.props.currentWeather.attributes.currently
		return (
			<span>
			<h2>It's currently {theWeatherNow.temperature} degrees, with a {Math.floor(theWeatherNow.precipProbability * 100)}% chance of rain.</h2>
			<h4>Outside it feels like {theWeatherNow.apparentTemperature} degrees, due to a humidity of {Math.floor(theWeatherNow.humidity * 100)}%,</h4>
			</span>
			)
	}
});

var HourView = React.createClass({


	_hourlyWeather: function(hour){

		return(
			<HoursWeather
				hourweather={hour}
				hours={this.props.weatherdata.attributes.hourly.data.slice(0,8)}
				/>
			)

	},


	render: function(){
		console.log('hourstuff',this.props.weatherdata)
		var hoursWeather = this.props.weatherdata.attributes.hourly.data.slice(0,8);
		console.log(hoursWeather);

		return(
			<div>
				<h2>The next 8 hours</h2>
				<div id='hoursWeather'>
				{hoursWeather.map(this._hourlyWeather)}
				</div>
				<WeatherButtons />
			</div>	
			)
	}
});

var HoursWeather = React.createClass({

	render: function(){
		var hour = this.props.hourweather;
		var humidity = Math.floor(hour.humidity * 100) +'%'

		return(
			<li>
				<p>{hour.summary}, {hour.temperature} degrees, with {humidity} humidity</p>
			</li>	
			)
	}

});

var DaysWeather = React.createClass({

	render:function(){
	
		console.log(this.props.day)

		var day = this.props.day;
		var humidity = Math.floor(this.props.day.humidity*100) + '%';
		var chanceOfRain = Math.floor(this.props.day.precipProbability*100) + '%';
		

		return(
			<li>
				<p>{day.summary}. Humidity is at {humidity}, with a {chanceOfRain}</p>
			</li>
			)

	}	
});

var WeeklyView = React.createClass({

	_listWeek: function(day){

		return(


			<DaysWeather 
				day={day}
				week={this.props.weatherdata}
				/>

			)


	},


	render:function(){
		console.log('weeks', this.props.weatherdata)
		var theWeek = this.props.weatherdata.attributes.daily.data.slice(0,7)

		return(
			<div>
				<h2>Here's your week</h2>
				<div id='weeklyDisplay'>
					{theWeek.map(this._listWeek)}
				</div>
				<WeatherButtons />
			</div>	)
	}
});

var WeatherButtons = React.createClass({

	loadWeekly: function(){
		location.hash = 'Weekly'
	},

	loadHourly: function(){
		location.hash = 'Hourly'
	},

	loadCurrent: function(){
		location.hash = 'Currently'
	},

	render: function(){
		return(
			<div className='buttonbar'>
				<button onClick={this.loadWeekly} className='buttons'>Weekly Weather</button>
				<button onClick={this.loadCurrent} className='buttons'>Current Weather</button>
				<button onClick={this.loadHourly} className='buttons'>Hourly Weather</button>
			</div>
			)
	}

});

var WeatherBar = React.createClass({

	getInitialState: function(){
		return {
			data: 'none'
		}
	},

	render: function(){
		console.log('i want to show you the world',this.props.weatherdata.attributes)

		
		return(
			<div id='theEnd'>	
				<CurrentView currentWeather={this.props.weatherdata}/>
				<WeatherButtons />
			</div>
			)
	}
});

var Clock = React.createClass({


	_getTime: function(){
		var theTime = new Date();
		var clockTime = document.getElementById('time');
	    var hours = theTime.getHours()
	    	if(hours < 10) hours= "0" + hours;
	    //Gets the hour of the day, if less than 10 adds a 0 in front of the number. 
	    var minutes = theTime.getMinutes()
	    	if(minutes < 10) minutes = "0" + minutes;
	    //Same as the hours. 
	    var seconds = theTime.getSeconds()
	    	if(seconds < 10) seconds = "0" + seconds;
	    //Same as the seconds. 
	    var currentTime = (hours + ":" + minutes + ":" + seconds)	
    	// function above pulls the time and spits it out in a 00:00:00 format.
    	clockTime.innerHTML=currentTime;

    },	

	render: function(){

		this._getTime();
		setInterval(this._getTime, 1000);
		return
		(<h2>{this._getTime}</h2>)

	}

})

		

var RouteWeather = Backbone.Router.extend({

	routes:{
		'homepage' : 'initialWeather',
		'Weekly' : 'getWeekly',
		'Currently' : 'initialWeather',
		'Hourly' : 'getHourly'
	},	

	

	initialize: function() {
		this.wm = new WeatherModel()
		console.log('farts',this.wm)
		Backbone.history.start()
	},


	getHourly: function(){
		var self = this
		self.wm.fetch({
			dataType: 'jsonp',
			processData: true
		}).done(function(){
			console.log('getting hourly')
			React.render(<HourView weatherdata={self.wm}/>,document.getElementById("container"))
		})
	},

	getWeekly: function(){
		var self = this
		self.wm.fetch({
			dataType: 'jsonp',
			processData: true
		}).done(function(){
		console.log('getting weekly')
		React.render(<WeeklyView weatherdata={self.wm}/>,document.getElementById("container"))
		})
	},

	initialWeather: function(){
		console.log('getting weather')
		var self = this
		self.wm.fetch({
			dataType: 'jsonp',
			processData: true
		}).done(function(){
			React.render(<WeatherBar weatherdata={self.wm}/>,document.getElementById("container"))
			React.render(<Clock/>, document.getElementById("clock"))
		})
	}
});

var route = new RouteWeather

