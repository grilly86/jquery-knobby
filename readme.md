#jquery.knobby.js

a jquery plugin to convert number input elements into knobs that can be adjusted by cyclic dragging with mouse or fingers.

##[Demo](http://codeblock.at/jquery-knobby/demo/)
You'll find the demo files in the `demo/` directory.

## Installation 


Load the Javascript file by including the script **after** jQuery has been included:
`<script src="jquery.knobby.js"></script>`


Add the styles from one of the stylesheets to your CSS file or link it with
`<link rel="stylesheet" href="jquery.knobby.css">`



## Usage

You need to have an input like the following

HTML:

    <input type="number" name="input_name" min="0" max="10" value="5" />



To change **all** inputs with the `type` of `number` on a page to knobby-knobs use:

    $("input[type=number]").knobby();
    
You can pass options to configure knobby with: 

    $(".high-pass").knobby({
        min:0,
        max:10000,
        turn:3,
        step:.5
    });

##Options

The following options can be served as attributes or as options - if both is present **attribute wins**.

|attribute | description    |
|-----|-----|
| min | (default = 0)    |
| max | (default = 100)  |
| step | the minimun value change |
| turn | number of full circles from min to max |