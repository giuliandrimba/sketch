export default class Grid {
  constructor(parent) {
    this.parent = parent;
    this.ORIGINAL_WIDTH = 1920;
    this.ORIGINAL_HEIGHT = 1080;
    this.TOTAL_DAYS = 15;

    this.el = undefined;

    this.render()
  }

  render() {
    this.el = new PIXI.Container()
    this.el.addChild(this.buildTexts());
    this.parent.addChild(this.el);
  }

  buildTexts() {
    var marginLeft = Math.round(200 * window.innerWidth / this.ORIGINAL_WIDTH);
    var marginBottom = Math.round(200 * window.innerHeight / this.ORIGINAL_HEIGHT);
    var fontSize = Math.round(120 * window.innerWidth / this.ORIGINAL_WIDTH);

    var col = 0;
    var row = 0;

    var container = new PIXI.Container()

    for(var i = 0; i < this.TOTAL_DAYS; i++) {

      let num = i;

      if(num < 10) {
        num = `0${i}`
      }

      let text = new PIXI.Text(num,{font : `${fontSize}px Helvetica`, fill : 0xff1010});
      text.x = col * (marginLeft + text.width);
      text.y = row * (marginBottom + text.height);

      col++;
      if(col > 4) {
        col = 0;
        row++;
      }

      container.y = window.innerHeight / 2 - container.height / 2
      container.x = window.innerWidth / 2 - container.width / 2
      container.addChild(text);
    }

    return container;
  }
}