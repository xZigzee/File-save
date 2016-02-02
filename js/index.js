//global variables
var filetext  = "";
var fileBinding;
var fileEntry;

console.log("setting up events");

//setup event listeners
$(document).on("pagecreate","#pageone", onPageCreated);


// once jQuery page 'pageone' has been created 
function onPageCreated() {
	
	//setup listener for device API load
	document.addEventListener("deviceready", onDeviceReady, false);
	
	console.log("page created");
	
	//setup buttons
	$('#writeFile').on("click", writeFile);
	$('#deleteFile').on("click", deleteFile);
	
	// setup RactiveJS binding

	//binding between variable 'filetext' and the template 
	var fileBinding = new Ractive({
		el: 'container',
		template: '#template',
		data: { filetext: filetext}
	});


	//detects changes in the text box and updates the 'filetext' value with the new value
	fileBinding.observe( 'filetext', function ( newValue, oldValue ) {
  		filetext = newValue; 
	});

}

function onDeviceReady() {
	//setup access to filesystem
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

//get access to file and CREATE if does not exists
function gotFS(fileSystem) {
 	fileSystem.root.getFile("test.txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

//get file entry
function gotFileEntry(fileEntry) {
	console.log("got file entry");
	this.fileEntry = fileEntry
	fileEntry.file(gotFile, fail);
}

//get file itself
function gotFile(file){
	readAsText(file);
}

//READ text from file - assumes that the file contains 
function readAsText(file) {
	
	var reader = new FileReader();
	
	//assigns a callback function to be run once the file has been completely read
	reader.onloadend = function(evt) {
	
		//store the new string in 'filetext'
		filetext = evt.target.result;
		
		//update the binding 
		fileBinding.set({ filetext: filetext });
    };
	
	//begin reading the file
   	reader.readAsText(file);
}


//UDPATE file contents - called when submit button is pressed
function writeFile()
{
	fileEntry.createWriter(
		function (writer) { 
			writer.write(filetext);
		}, 
		fail
	);
}

//DELETE file
function deleteFile()
{
	
	fileEntry.remove(
		function () {
			alert("Deleted file");
		}, 
		fail
	);
	
	//reload file system
  	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function fail(error) {
	alert("Cannot use file: " + error.message);
}


