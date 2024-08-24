class ButtonBase {
  constructor(pos, size, callback) {
    this.pos = pos;
    this.size = size;
    this.callback = callback;

    this.hovered = false;

    this.defaultStyle = {
      padding: 0,

      fill: 0,
      stroke: 0,
    };

    this.style = {hover: {}};
  }

  fillStyle(style) {
    function f(style, parent, defaultStyle) {
      for (let i in defaultStyle) {
        let s = style[i];
        parent[i] = s;

        if (typeof s == "object" && !Array.isArray(s) && i != "hover") {
          f(s, parent[i], defaultStyle[i]);
        } else {
          if (parent[i] == undefined) parent[i] = defaultStyle[i];
        }
      }
    }

    f(style, this.style, this.defaultStyle);

    f(style.hover, this.style.hover, this.style);
  }

  render() {
    this.hovered = false;
    if (
      mouse.x > this.pos.x && 
      mouse.x < this.pos.x + this.size.x + this.style.padding * 2 &&
      mouse.y > this.pos.y && 
      mouse.y < this.pos.y + this.size.y + this.style.padding * 2
    ) {
      this.hovered = true;
      hoveredButton = this;
    }

    renderer.applyStyles(this.hovered ? this.style.hover : this.style);
    
    renderer.rect(this.pos, this.size._add(this.style.padding * 2));    
  }
}