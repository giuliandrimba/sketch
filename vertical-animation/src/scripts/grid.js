export default class Grid {
  constructor() {

    this.ORIGINAL_WIDTH = 1920;
    this.ORIGINAL_HEIGHT = 1080;
    this.TOTAL_DAYS = 15;

    this.el = undefined

    this.render()
  }

  render() {
    this.el = this.parseHTML(this.buildHTML())
    document.getElementById("main").appendChild(this.el);
  }

  parseHTML(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    let elements = div.firstChild;
    return elements;
  }

  buildHTML() {
    var marginLeft = Math.round(200 * window.innerWidth / this.ORIGINAL_WIDTH);
    var marginBottom = Math.round(200 * window.innerHeight / this.ORIGINAL_HEIGHT);
    var fontSize = Math.round(120 * window.innerWidth / this.ORIGINAL_WIDTH);

    var tmpl = `<div class='grid' style='margin-left:${marginLeft}px; padding-top:${marginBottom}px'><ul>`;

    for(var i = 0; i < this.TOTAL_DAYS; i++) {
      let clear = "";
      let num = i;

      if(i % 5 === 0) {
        clear += "clear: both;"
      }

      if(num < 10) {
        num = `0${i}`
      }

      let li = `<li style='margin-right:${marginLeft}px; margin-bottom:${marginBottom}px; font-size:${fontSize}px; ${clear}'>${num}</li>`
      tmpl += li;
    }

    tmpl += "</li></div>";
    return tmpl;
  }
}