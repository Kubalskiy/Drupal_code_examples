(function ($) {
  Drupal.behaviors.kubalskiy_zeroClipboard = {
    attach: function(context) {
		ZeroClipboard.config({
			swfPath: Drupal.settings.kubalskiy_zeroclipboard_settings.moviePath,
			forceHandCursor: true,
		});
		
		for (var i in Drupal.settings.kubalskiy_zeroclipboard_settings.selectorsToProcess) {
			var selectorData = Drupal.settings.kubalskiy_zeroclipboard_settings.selectorsToProcess[i];
			Drupal.kubalskiy_zeroClipboard.process(selectorData.selector, selectorData.value, {});
		}
    }
  };

  Drupal.kubalskiy_zeroClipboard = {};
  Drupal.kubalskiy_zeroClipboard.clips = {};
  Drupal.kubalskiy_zeroClipboard.currentIndex = 0;

  Drupal.kubalskiy_zeroClipboard.process = function(selector, datatoclip, containerStyle) {
    $(selector).not('.zeroclipboard-processed').each(function() {
      var elementID = $(this).attr('id');
    
      // If the element to be processed doesn't already have an ID, generate one for it
      if (!elementID) {
        elementID = 'zeroclipboard-dynamic-id-' + Drupal.kubalskiy_zeroClipboard.currentIndex;
        $(this).attr('id', elementID);
        Drupal.kubalskiy_zeroClipboard.currentIndex++;
      }
	  
	  
      $(this).wrap('<span id="'  + elementID + '-zeroclipboard-wrapper"/>');
	  $(this).parent().parent().parent().append('<div id="aftercopymessage' + elementID + '" style="display:none"><center>' + Drupal.settings.kubalskiy_zeroclipboard_settings.copiedtext + '</center></div>');
	  	  
      // These styles seem to be good make sure the flash is placed exactly over the selected element
      // It can still be overriden by the options sent for the container style
      var style = {position: 'relative', float: 'left'};
      if (containerStyle != null) {
        style = $.extend({position: 'relative', float: 'left'}, containerStyle);
      }
      $('#' + elementID + '-zeroclipboard-wrapper').css(style);
      $('#'  + elementID + '-zeroclipboard-wrapper').after('<div style="clear:both;"></div>');
  
      Drupal.kubalskiy_zeroClipboard.clips[elementID] = new ZeroClipboard();
      Drupal.kubalskiy_zeroClipboard.clips[elementID].clip($('#' + elementID), $('#' + elementID + '-zeroclipboard-wrapper'));
      Drupal.kubalskiy_zeroClipboard.clips[elementID].on( "copy", function (event) {
		clipboard = event.clipboardData;
		var newClipText = '';
		newClipText = $(datatoclip).val();
		clipboard.setData( "text/plain", newClipText);
	  });
	  Drupal.kubalskiy_zeroClipboard.clips[elementID].on( "aftercopy", function(event) {
	    var estyles = {
		  position: 'absolute',
		  left: $(datatoclip).position().left + 'px',
		  top: $(datatoclip).position().top +'px',
		  padding: $(datatoclip).height()/2 + 'px 0 0 0',
		  backgroundColor: 'yellow',
	    };
	    $('#aftercopymessage' + elementID).css(estyles);
		$('#aftercopymessage' + elementID).width($(datatoclip).width());
		$('#aftercopymessage' + elementID).height($(datatoclip).height()/2);
		$('#aftercopymessage' + elementID).fadeIn(800).fadeOut(800);
	  });

      // Mark this element as processed to prevent re-processing
      $(this).addClass('zeroclipboard-processed');
    });
  };
})(jQuery);
