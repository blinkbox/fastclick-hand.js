var PointerEventsFastClick = {};

!(function($){

    // event mapings:
    // pointerdown   --> touchstart
    // pointermove   --> touchmove
    // pointerup     --> touchend
    // pointercancel --> touchcancel
    // pointerenter  --> touchenter
    // pointerleave  --> touchleave
    // pointerout    --> ***
    // pointerover   --> ***

    /*var debugg = function() {
      this.start = this.start || new Date().getTime();
      this.curr = this.start - (new Date().getTime());

      console.log(Math.abs(this.curr), arguments);
    };*/
  
  PointerEventsFastClick.FastClick = function(element, handler) {
    this.element = element;
    this.handler = handler;

    element.addEventListener('pointerdown'/*'touchstart'*/, this, false);
    element.addEventListener('click', this, false);
  };

  PointerEventsFastClick.FastClick.prototype.handleEvent = function(event) {
    var evt = event.pointerType + ':' + event.type;
    //debugg("PointerEventsFastClick.FastClick.prototype.handleEvent", evt);
    switch (evt) {
      case 'touch:pointerdown'/*'touchstart'*/: this.onTouchStart(event); break;
      case 'touch:pointermove'/*'touchmove'*/: this.onTouchMove(event); break;
      case 'touch:pointerup'/*'touchend'*/: this.onClick(event); break;
      //case 'mouse:pointerdown' /*'click'*/: this.onClick(event); break; // browser click
      default:
        if (/:click$/.test(evt)) { 
          this.onClick(event);
        }
        break;
    }
  };

  PointerEventsFastClick.FastClick.prototype.onTouchStart = function(event) {
    //debugg('PointerEventsFastClick.FastClick.prototype.onTouchStart:', event.type, event.pointerType);
    event.stopPropagation();

    this.element.addEventListener('pointerup'/*'touchend'*/, this, false);
    document.body.addEventListener('pointermove'/*'touchmove'*/, this, false);

    this.startX = event/*.touches[0]*/.clientX;
    this.startY = event/*.touches[0]*/.clientY;
  };

  PointerEventsFastClick.FastClick.prototype.onTouchMove = function(event) {
    //debugg('PointerEventsFastClick.FastClick.prototype.onTouchMove:', event.type, event.pointerType);
    if (Math.abs(event/*.touches[0]*/.clientX - this.startX) > 10 ||
        Math.abs(event/*.touches[0]*/.clientY - this.startY) > 10) {
      this.reset();
    }
  };

  PointerEventsFastClick.FastClick.prototype.onClick = function(event) {
    //debugg('PointerEventsFastClick.FastClick.prototype.onClick:', event.type, event.pointerType);
    event.stopPropagation();
    this.reset();
    this.handler(event);

    if (event.type == 'pointerup'/*'touchend'*/ && event.pointerType == 'touch') {
      PointerEventsFastClick.clickbuster.preventGhostClick(this.startX, this.startY);
    }
  };

  PointerEventsFastClick.FastClick.prototype.reset = function() {
    this.element.removeEventListener('pointerup'/*'touchend'*/, this, false);
    document.body.removeEventListener('pointermove'/*'touchmove'*/, this, false);
  };

  PointerEventsFastClick.clickbuster = function() {};
  PointerEventsFastClick.clickbuster.preventGhostClick = function(x, y) {
    //debugg('PointerEventsFastClick.clickbuster.preventGhostClick:', event.type, event.pointerType);
    PointerEventsFastClick.clickbuster.coordinates.push(x, y);
    window.setTimeout(PointerEventsFastClick.clickbuster.pop, 2500);
  };

  PointerEventsFastClick.clickbuster.pop = function() {
    PointerEventsFastClick.clickbuster.coordinates.splice(0, 2);
  };


  PointerEventsFastClick.clickbuster.onClick = function(event) {
    //debugg('global click handler', event);
    for (var i = 0; i < PointerEventsFastClick.clickbuster.coordinates.length; i += 2) {
      var x = PointerEventsFastClick.clickbuster.coordinates[i];
      var y = PointerEventsFastClick.clickbuster.coordinates[i + 1];
      if (Math.abs(event.clientX - x) < 10 && Math.abs(event.clientY - y) < 10) {
        //debugg('Found', event);
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('click', PointerEventsFastClick.clickbuster.onClick, true);
  } else if (document.attachEvent) {
    document.attachEvent('onclick', PointerEventsFastClick.clickbuster.onClick);
  }
  
  PointerEventsFastClick.clickbuster.coordinates = [];

  // jquery wrapper
  $.fn.fastclick = function(cb) {
    return $(this).each(function(){
      new PointerEventsFastClick.FastClick($(this)[0], cb);
    });
  };

}(jQuery));