import HTMLVersion from "./HTMLVersion"
import CanvasVersion from "./CanvasVersion"

ready(function() {

  if(/canvas/.test(window.location.href.toString())) {
    CanvasVersion()
  } else {
    HTMLVersion()
  }

  if(/quart/.test(window.location.href.toString())) {
    window.easingName = Quart.easeInOut
  } else {
    window.easingName = Expo.easeInOut
  }

})

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}