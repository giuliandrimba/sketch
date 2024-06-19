import css from "./index.css";
import App from "./app/App";

export let props = {
  radius: {
    value: 100,
    params: {
      min: 1,
      max: 100,
      step: 0.1
  }
  },
};

let app;

export let load = ({ publicPath }) => {
  return new Promise((resolve) => {
    resolve();
  });
};

export let init = ({
  canvas,
  context,
  width,
  height,
  pixelRatio,
  clear,
  ...params
}) => {
  app = new App({ canvas, context, width, height, pixelRatio, clear, ...params });
};

export let update = ({
  context,
  width,
  height,
  pixelRatio,
  time,
  deltaTime,
  frame,
  playhead,
  playcount,
  ...params
}) => {
  app.update();
};

export let resize = ({
  canvas,
  context,
  width,
  height,
  pixelRatio,
  ...params
}) => {
  app.resize(width, height);
  app.update();
};

export let exportDir = "../dist";

export let rendering = '2d'
export let renderer = () => import("../fragment/SVGRenderer");

