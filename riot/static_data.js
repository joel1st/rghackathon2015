var riot = require('./riot.js');
var mongoose = require('mongoose');
var champions = require('../models/champions.js');
var items = require('../models/items.js');

module.exports = {

	updateChampionData: function() {
		riot.getChampionData(function(err, response){
			if(!err) {
				var version = response.version;
				var champion_data = response.data;
				for(var champion in champion_data) {
				    if (!champion_data.hasOwnProperty(champion)) {
				        continue;
				    }
				    champions.update({id: champion_data[champion].id}, {
				    	name: champion_data[champion].name, 
			    		id: champion_data[champion].id, 
			    		title: champion_data[champion].title, 
			    		key: champion_data[champion].key, 
			    		image: champion_data[champion].image.full, 
			    		version: version
			    	}, 
			    	{ upsert: true }, function(){});
				}
				console.log("Champion data updated.");
			} else {
				// something went wrong
			}
		});
	},

	updateItemData: function() {
		riot.getItemData(function(err, response){
			if(!err) {
				var version = response.version;
				var item_data = response.data;
				for(var item in item_data) {
				    if (!item_data.hasOwnProperty(item)) {
				        continue;
				    }
				    items.update({id: item_data[item].id}, {
				    	name: item_data[item].name, 
				    	id: item_data[item].id, 
				    	image: item_data[item].image.full,
				    	version: version
				    }, 
				    { upsert: true }, function(){});
				}
				console.log("Item data updated.");
			}
		});
	}

};