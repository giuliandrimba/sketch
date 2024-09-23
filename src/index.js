import "./index.css";
import App from "./app/App";

export let props = {
  radius: {
    value: 200,
    params: {
      min: 1,
      max: 200,
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

export let init = (params) => {
  app = new App(params);
};

export let update = (params) => {
  app.update(params);
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

