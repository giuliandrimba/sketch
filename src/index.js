import App from "./app/App";

export let props = {
  radius: {
    value: 20
  }
};

let app;

export let init = ({ canvas, context, width, height, pixelRatio, ...params }) => {
  app = new App(props)
};

export let update = ({ context, width, height, pixelRatio, time, deltaTime, frame, playhead, playcount, ...params }) => {
  app.update()
};


export let resize = ({ canvas, context, width, height, pixelRatio, ...params }) => {

};

export let exportDir = '../dist';
export let rendering = "2d";
