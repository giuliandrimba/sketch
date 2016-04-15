import moment from "moment";
window.moment = moment;

export default class Grid {
  constructor(parent, month) {
    this.parent = parent;
    this.month = month;
    this.ORIGINAL_WIDTH = 1920;
    this.ORIGINAL_HEIGHT = 1080;
    this.TOTAL_DAYS = 15;
    this.days = [];

    this.el = undefined;
    this.buildDays()
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

    for(var i = 0; i <= this.TOTAL_DAYS; i++) {

      let num = this.days[i];

      if(parseInt(num) < 10) {
        num = `0${num}`
      }

      let text = new PIXI.Text(num,{font : `${fontSize}px Helvetica`, fill : 0xFFFFFF});
      text.alpha = 0.3;
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

  buildDays() {

    var diff = moment().month() - this.month;
    var date = moment().subtract(14 * diff, 'days')

    this.days[7] = date.date()

    for(var i = 6; i > -1; i--) {
      var a = date.clone();
      this.days[i] = a.subtract(7 - i, 'days').date()
    }

    for(var i = 8; i < this.TOTAL_DAYS; i++) {
      var a = date.clone();
      this.days[i] = a.add(i - 7, 'days').date()
    }
  }

  resize() {
    this.el.removeChildren()
    this.el.addChild(this.buildTexts());
  }
}