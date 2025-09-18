let backgroundCol = "rgb(19, 19, 19)";
function setBackgroundCol() {
  if (settings.overrideBackground) {
    backgroundCol = renderer.parseColor([settings.backgroundR, settings.backgroundG, settings.backgroundB]);
  } else {
    backgroundCol = "rgba(19, 19, 19, 255)";
  }
}

let buttonCol = "rgb(25, 25, 25)";
let buttonHoveredCol = "rgb(40, 40, 40)";


let buttonStyle = {
  minSize: new Vec(30, 30),
  padding: 5,


  fill: buttonCol,
  text: {font: "25px monospace"},
  
  
  scroll: {
    fill: "rgb(60, 60, 60)",
  },

  slider: {
    padding: 5,
    minSize: new Vec(300, 30),

    fill: buttonCol,
  },

  number: {
    fill: buttonCol,
  },

  hover: {
    fill: buttonHoveredCol,

    
    slider: {
      fill: buttonHoveredCol,
      active: {
        fill: "rgb(255, 0, 0)",
        stroke: "rgb(255, 0, 0)",
      }
    },
    number: {
      fill: buttonHoveredCol,
    }
  }
};

let rangeStyle = {...buttonStyle,
  padding: 0,
};


let rootStyle = {
  size: new Vec(1600, 900),
  scroll: {...buttonStyle.scroll,
    width: buttonStyle.padding,
  },
};


function createDefaultUIRoot(children) {
  return new UIRoot({
    pos: new Vec(0, 0),

    style: rootStyle,
    
    children: [
      new UIBase({
        style: {
          direction: "column",
          padding: 50,
          gap: 10,
        },

        children: children,
      })],
  });   
}