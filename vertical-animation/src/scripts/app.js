import HTMLVersion from "./HTMLVersion"

ready(function() {

  HTMLVersion()

})

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}