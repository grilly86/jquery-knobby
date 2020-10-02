# jquery-knobby
is a jquery plugin to convert number input elements into **turnable knobs** that can be adjusted by cyclic dragging with mouse or fingers - **multi-touch** is now supported!
(**DEPRECATED:** behaviour and code is a bit wonky, should probably not use fantasy html attributes but data- attributes)

## [Demo](http://codeblock.at/jquery-knobby/demo/)
[![Image of jquery.knobby.js result (dark theme)](http://codeblock.at/wp-content/uploads/2015/04/knobby-dark.png)](http://codeblock.at/jquery-knobby/demo/dark.html) [![Image of jquery.knobby.js result (light theme)](http://codeblock.at/wp-content/uploads/2015/04/knobby-bright.png)](http://codeblock.at/jquery-knobby/demo/)

You'll find the demo files in the `demo/` directory of the repository.

## Installation 

Load the Javascript file by including the script **after** jQuery has been included:

    <script src="jquery.knobby.js"></script>

Also import the stylesheet:.

    <link rel="stylesheet" href="jquery.knobby.light.css">

The appearance of the plugin is fully customizable through CSS &ndash; you can add a background of your choice or [generate a noise background](http://codeblock.at/base64-noise-generator/) for example.
The stylesheets are intended as starting points rather than final states. 

## Usage
You need to have an input like the following

    <input type="number" name="input_name" min="0" max="10" value="5" />

To convert all inputs with a `type` of `number` on a page to *knobby-knobs* use:

    $("input[type=number]").knobby();
    
You can pass options to configure knobby - the numbers given are the default values: 

    $(".high-pass").knobby({
        min:0,
        max:100,
        turn:1,
        step:1,
        size:4,
        handleSize:1,
        handleGap:.25
    });

## Options
The following options can be served as attributes or passed as options - if both is present *attribute wins*.

|attribute | description    |  type |
|-----|-----|-----|
| min | minimum knob value &ndash; **must be smaller than the max-value**    | float |
| max | maximum knob value &ndash; **must be larger than the min-value** | float |
| step | the minimun change of the value; there should be an **normal number** of steps between min and max (`(max-min)/step` should result in an integer number) | float |
| turn | number of full circles from min to max | float |
| size | **radius** of the knob **in em** (relative to font-size) of `.knobby-knob` | float |
| handleSize | **diameter** of the handle **in em** | float |
| handleGap | gap between the **outer** border of the knob and the handle **in em** |  float |
