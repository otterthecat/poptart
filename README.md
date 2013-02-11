# Poptart

A history popState Controller

## Usage
Use Poptart's .set() method. First argument is he url of an existing anchor tag - this will be used as the identifier.
Second argument is the function you want called when the linke is cliked, and you may pass Poptart's data object (which contains the information contained when pushing the history state, as well as ajax response)  into this function like so:

	poptart.set('/my/link', function(data){

		document.getElementById('myTarget').innerHTML = data.response;
	});

## License
Copyright (c) 2013 Otter  
Licensed under the MIT, GPL licenses.
