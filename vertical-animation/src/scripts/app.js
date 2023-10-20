import HTMLVersion from "./HTMLVersion"
import CanvasVersion from "./CanvasVersion"

ready(function() {

  CanvasVersion()

})

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}