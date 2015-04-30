#jquery.knobby.js

a jquery plugin to convert number input elements into **turnable knobs** that can be adjusted by cyclic dragging with mouse or fingers.

 [![Image of jquery.knobby.js result (dark theme)](http://codeblock.at/wp-content/uploads/2015/04/knobby-dark.png)](http://codeblock.at/jquery-knobby/demo/dark.html) [![Image of jquery.knobby.js result (light theme)](http://codeblock.at/wp-content/uploads/2015/04/knobby-bright.png)](http://codeblock.at/jquery-knobby/demo/)


##[Demo](http://codeblock.at/jquery-knobby/demo/)
You'll find the demo files in the `demo/` directory.

## Installation 

Load the Javascript file by including the script **after** jQuery has been included:

    <script src="jquery.knobby.js"></script>


Add the styles from one of the stylesheets to your CSS file or link it with

    <link rel="stylesheet" href="jquery.knobby.css">



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

The following options can be served as attributes or passed as options - if both is present **attribute wins**.

|attribute | description    |  type |
|-----|-----|-----|
| min | (default = 0)    | float |
| max | (default = 100)  | float |
| step | the minimun value change | float |
| turn | number of full circles from min to max | float |
