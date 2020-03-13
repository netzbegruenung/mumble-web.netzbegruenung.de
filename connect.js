
function popupc(username) {
  var width = 900;
  var height = 600;
  var left = (screen.width/2)-(width/2);
  var top = (screen.height/2)-(height/2);

  return window.open("/client.html?username=" + encodeURIComponent(username), "mumble", "width="+width+",height="+height+",top="+top+", left="+left);
}

function deUmlaut(value){
  value = value.toLowerCase();
  value = value.replace(/ä/g, 'ae');
  value = value.replace(/ö/g, 'oe');
  value = value.replace(/ü/g, 'ue');
  value = value.replace(/ß/g, 'ss');
  value = value.replace(/ /g, '-');
  value = value.replace(/\./g, '');
  value = value.replace(/,/g, '');
  value = value.replace(/\(/g, '');
  value = value.replace(/\)/g, '');
  return value;
}

var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
jQuery(document).ready(function() {

function shake() {
  jQuery('#connect').css({'animation': 'shake 1000ms infinite'});
  setTimeout(function() {
    jQuery('#connect').css({'animation': ''});
  }, 1000);
}

function defaultFailed() {
  jQuery('#allowmedia').hide();
  jQuery('#failed').show();
  shake();
}

function requestMedia(success, failed) {
  if (typeof success == 'undefined') {
    success = function() {};
  }
  if (typeof failed == 'undefined') {
    failed = defaultFailed;
  }
  if (typeof getUserMedia != 'undefined') {
    getUserMedia.call(navigator, {audio:true}, function() {
      jQuery('#allowmedia').hide();
      success();
    }, failed);
  } else {
    jQuery('#allowmedia').hide();
    jQuery('#nomedia').show();
    success();
  }
}

requestMedia();

if (navigator.userAgent.indexOf('Firefox') !== -1) {
  jQuery('#recommendedbrowser').hide();
}

  jQuery(document).on('submit', '#connect', function(e) {
    e.preventDefault();
    function connect() {
      var username = jQuery('#username').val();
      jQuery('p.error').hide();
      jQuery('#username').removeClass('error');
      if (username == '') {
        jQuery('p.error').show();
        jQuery('#username').addClass('error');
        jQuery('#username').focus();
        shake();
        return;
      }
      var username = deUmlaut(username).replace(/[^a-zA-Z]+/g, "_");
      var ui = popupc(username);
      var iv = setInterval(function() {
        if (typeof ui.mumbleUi != 'undefined' && typeof ui.mumbleUi.connectDialog != 'undefined' && ui.document.querySelector('.loading-container.loaded')) {
          clearInterval(iv);
          ui.mumbleUi.connectDialog.connect();
        }
      }, 100);  
    };

    connect();
  });
});