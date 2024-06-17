import css from "./index.css";
import App from "./app/App";

export let props = {
  radius: {
    value: 100,
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
  ...params
}) => {
  app = new App({ canvas, context, width, height, pixelRatio, ...params });
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
}) => {};

export let exportDir = "../dist";

export let renderer = () => import("../fragment/SVGRenderer");
