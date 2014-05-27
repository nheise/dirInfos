
var fs = require("fs");

exports.stat = function( path, callback ) {
	new DirInfo( path, callback ).read();
}

function DirInfo( path, callback ) {
	var dirInfo = [];	
	var fileCount;

	return {
		read : readDir,
		readStatReady : readStatReady
	}

	function readDir() {
		fs.readdir( path, readDirReady );
	}

	function readDirReady( error, files ) {
		fileCount = files.length;
		for( file in files ) {
			var filename = files[file];
			new FileInfo( path, filename, readStatReady ).readStats();
		}
	}

	function readStatReady( error, fileInfo ) {
		dirInfo.push( fileInfo );
		if( dirInfo.length == fileCount ) {
			callback( error, dirInfo );
		} 
	}
}

function FileInfo( path, filename, callback ) {
	var filePath = path + "/" + filename;

	return {
		readStats : readStats
	}

	function readStats() {
		fs.stat( filePath, readStatReady );
	}

	function readStatReady( error, stats ) {
		var fileType = getFileType( stats );
		callback( error, { name : filename, type : fileType } );
	}

	function getFileType( stats ) {
		if( stats.isDirectory() ) {
			return "d";
		}
		else if( stats.isFile() ) {
			return "f";
		}
		else {
			return "unknown";
		}
	}
}
/*
new DirInfo( ".", function( error, dirInfo ) {
	console.log( JSON.stringify( dirInfo ) );
}).read();
new DirInfo( "./video", function( error, dirInfo ) {
	console.log( JSON.stringify( dirInfo ) );
}).read();
*/
