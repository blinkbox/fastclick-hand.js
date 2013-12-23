## fastclick-hand.js

#### FastClick implementation for [PointerEvents](http://www.w3.org/TR/pointerevents/)
#### Based on Google's [FastButton](https://developers.google.com/mobile/articles/fast_buttons) implementation

### Usage

    <script>
        var button = document.querySelector(".button");
        new PointerEventsFastClick.FastClick(button, function(){
			// run some code
    	});
    </script>

### Optional jQuery plugin, when jQuery is avalaible

    <script>
        $('.button').FastClick(function() {
			// run some code
    	});
    </script>
