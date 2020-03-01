const withSass = require('@zeit/next-sass');
const withImages = require('next-images');

const plugins = [withSass, withImages];



function runPlugins(plugin, index){
	if (index === plugins.length){
		return plugin;
	}
	return runPlugins(plugins[index](plugin), index + 1);
}

module.exports = runPlugins({}, 0);
