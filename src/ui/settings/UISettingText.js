let activeSettingText = undefined;

class UISettingText extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      cursor: "text",

      editor: {
        blinkTime: 1,
        clickTime: 0.5,
        multiLine: false,
        numberOnly: false,
      },

      text: {
        fill: "rgb(255, 255, 255)",

        font: "25px monospace",
        textAlign: ["left", "top"],
      },
    };
    this.fillStyle(props.style);

    
    //this.style.maxSize.from(this.style.minSize);
    
    this.children = [
      new UIText({
        style: {...this.style,
          minSize: vecZero,
        },
        text: "",
      }),
    ];

    this.setValue("" + this.value);
    

    this.focused = false;

    this.cursor = new Vec(0, 0);
    this.cursor2 = undefined;
    this.cursorTimer = new TimerTime(1000000000);
    this.cursorTimer.loop = true;
    this.maxCursorX = 0;

    this.clicksInRow = 0;
    this.lastCharPos = new Vec(0, 0);


    this.rendererTransform = undefined;
    this.mousedownGlobalFunc = e => {this.mousedownGlobal(e)}
    this.mousemoveGlobalFunc = e => {this.mousemoveGlobal(e)}
    this.mouseupGlobalFunc = e => {this.mouseupGlobal(e)}
    this.keydownGlobalFunc = e => {return this.keydownGlobal(e)}
    this.on("mousedown", e=>{
      if (!this.focused) {
        nde.on("mousedown", this.mousedownGlobalFunc, true);
        nde.on("keydown", this.keydownGlobalFunc, true);
      }
      this.focused = true;

      let charPos = this.getCharPos(this.getMousePos());

      if (this.cursorTimer.elapsedTime >= this.style.editor.clickTime || !this.lastCharPos.isEqualTo(charPos)) {
        this.clicksInRow = 0;
      } else {
        this.clicksInRow++;
      }

      this.lastCharPos = charPos;
      this.cursor.from(charPos);
      this.cursor2 = undefined;
      this.cursorTimer.elapsedTime = 0;
      this.maxCursorX = 0;

      if (this.clicksInRow == 1) {
        this.cursor2 = this.cursor._();
        this.fillCursorLeft(this.cursor);
        this.fillCursorRight(this.cursor2);
      }

      if (this.clicksInRow == 2) {
        this.cursor.x = 0;
        this.cursor2 = new Vec(this.getLines()[this.cursor.y].length, this.cursor.y);
      }

      if (this.clicksInRow == 3) {
        let lines = this.getLines();
        this.cursor.set(0, 0);
        this.cursor2 = new Vec(lines[lines.length - 1].length, lines.length - 1);
        
      }

      if (activeSettingText && activeSettingText != this) activeSettingText.endFocus();
      activeSettingText = this;
      this.forceHover = true;
      nde.on("mousemove", this.mousemoveGlobalFunc, true);
      nde.on("mouseup", this.mouseupGlobalFunc, true);
    });
  }
  
  setValue(newValue) {
    super.setValue(newValue);
    this.value = "" + this.value;
    
    this.recalculateSize();
  }

  recalculateSize() {
    this.children[0].text = this.value;
    this.children[0].calculateSize();
    this.calculateSize();
  }

  mousedownGlobal(e) {
    this.endFocus();
  }
  mousemoveGlobal(e) {        
    if (this.clicksInRow != 0) return;

    let charPos = this.getCharPos(this.getMousePos());
    this.cursor2 = charPos;

    if (this.cursor.isEqualTo(this.cursor2)) {
      this.cursor2 = undefined;
    }
  }
  mouseupGlobal(e) {
    this.forceHover = false;
    nde.off("mousemove", this.mousemoveGlobalFunc);
    nde.off("mouseup", this.mouseupGlobalFunc);
  }

  keydownGlobal(e) {
    if (["Control", "Shift", "Alt", "AltGraph"].includes(e.key)) return;
    this.cursorTimer.elapsedTime = this.style.editor.blinkTime;

    let ctrl = e.ctrlKey;
    let shift = e.shiftKey;


    if (e.key == "Backspace") {
      if (this.cursor2 != undefined) this.removeSelected();
      else {
        if (ctrl && this.cursor.x != 0) {
          this.cursor2 = this.cursor._();
          this.fillCursorLeft(this.cursor);
          this.removeSelected();
        } else {
          this.removeAtCursor(this.cursor);
        }
      }

      this.recalculateSize()
    
      this.moveScreenToCursor(this.cursor);
    }
    if (e.key == "Delete") {
      if (this.cursor2 != undefined) this.removeSelected();
      else {
        if (ctrl) {
          this.cursor2 = this.cursor._();
          this.fillCursorRight(this.cursor2);
          this.removeSelected();
        } else {
          if (this.moveCursorRight(this.cursor))
            this.removeAtCursor(this.cursor);
        }
      }

      this.recalculateSize()

      this.moveScreenToCursor(this.cursor);
    }
    if (e.key == "Escape") {
      this.endFocus();
      return;
    }
    if (ctrl) {
      let key = e.key.toLowerCase();
      let lines = this.getLines();

      if (e.key == "a") {
        this.cursor.set(0, 0);
        this.cursor2 = new Vec(lines[lines.length - 1].length, lines.length - 1);
      }

      if (["c", "x"].includes(key)) {
        let oldCursorPos = undefined;

        if (this.cursor2 == undefined) {
          oldCursorPos = this.cursor._();

          this.cursor.x = 0;
          this.cursor2 = new Vec(lines[this.cursor.y].length, this.cursor.y);
        }

        let string = "";
        if (key == "c") {
          string = this.getChars(this.cursor, this.cursor2);

          if (oldCursorPos) {
            this.cursor = oldCursorPos;
            this.cursor2 = undefined;
            string += "\n";
          }
        }
        if (key == "x") {
          string = this.removeSelected();

          if (oldCursorPos) {
            this.cursor2 = undefined;
            string += "\n";

            this.moveCursorRight(this.cursor);
            this.removeAtCursor(this.cursor);
          }
        }

        navigator.clipboard.writeText(string);
        
      }
      if (key == "v") {
        navigator.clipboard.readText().then(string => {
          if (this.cursor2 != undefined) {
            this.removeSelected();
          }
          this.addAtCursor(this.cursor, string);
          this.moveScreenToCursor(this.cursor);
          
          this.recalculateSize()
        });
      }



      if (["a", "c", "v", "x"].includes(key)) return;
    }

    if (e.key.startsWith("Arrow")) {
      let lines = this.getLines();

      let cursor = this.cursor;
      let unselected = false;
      if (shift) {
        if (this.cursor2 == undefined) this.cursor2 = this.cursor._();

        cursor = this.cursor2;
      } else {
        let old = this.cursor;
        if (this.cursor2 != undefined) this.cursor = this.cursor2;
        this.cursor2 = undefined;
        cursor = this.cursor;

        unselected = true;
        if (old.isEqualTo(this.cursor)) unselected = false;
      }


      this.maxCursorX = Math.max(cursor.x, this.maxCursorX);

      if (e.key == "ArrowUp") {
        if (cursor.y == 0){
          cursor.x = 0;
          this.maxCursorX = 0;
        } else {
          cursor.y--;
          cursor.x = Math.min(this.maxCursorX, lines[cursor.y].length);
        }
      }
      if (e.key == "ArrowDown") {
        if (cursor.y == lines.length - 1){
          cursor.x = lines[cursor.y].length;
        } else {
          cursor.y++;
          cursor.x = Math.min(this.maxCursorX, lines[cursor.y].length);
        }
      }
      if (e.key == "ArrowLeft") {
        this.maxCursorX = 0;

        if (ctrl) {
          let x = this.fillCursorLeft(cursor);
          if (x == 0) {
            this.moveCursorLeft(cursor);
            this.fillCursorLeft(cursor);
          }
        } else {
          if (unselected) return;
          this.moveCursorLeft(cursor);
        }
      }
      if (e.key == "ArrowRight") {
        this.maxCursorX = 0;

        if (ctrl) {
          let x = this.fillCursorRight(cursor);
          if (x == 0) {
            this.moveCursorRight(cursor);
            this.fillCursorRight(cursor);
          }
        } else {
          if (unselected) return;
          this.moveCursorRight(cursor);
        }
      }

      this.moveScreenToCursor(cursor);
    } else {
      this.maxCursorX = 0;
    }


    let newText = "";
    
    if (e.key == "Enter") {
      if (this.style.editor.multiLine) {
        newText = "\n";
      } else {
        this.endFocus();
      }
    }
    if (e.key.length == 1) newText = e.key;

    if (this.style.editor.numberOnly && !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "*", "/", "+", "-", "(", ")"].includes(newText)) return;




    if (newText) {
      if (this.cursor2 != undefined) this.removeSelected();
      this.addAtCursor(this.cursor, newText);
      
      this.recalculateSize()
      this.moveScreenToCursor(this.cursor);
    }


    this.fireInput();

    return false;
  }

  endFocus() {
    nde.off("mousedown", this.mousedownGlobalFunc);
    nde.off("keydown", this.keydownGlobalFunc);
    this.focused = false;
    this.fireChange();
  }

  getMousePos() {
    let mousePoint = new DOMPoint(nde.mouse.x, nde.mouse.y);
    let transformedMousePoint = mousePoint.matrixTransform(this.rendererTransform.inverse());
    return new Vec(transformedMousePoint.x, transformedMousePoint.y).subV(this.pos).sub(this.style.padding).addV(this.scroll);
  }
  getCharPos(pos) {
    nde.renderer.setAll(this.hovered ? this.style.hover.text : this.style.text);
    let size = nde.renderer.measureText("a");
    
    let p = pos._divV(size);

    let split = this.getLines();
    p.y = Math.max(Math.min(Math.floor(p.y), split.length - 1), 0);
    p.x = Math.max(Math.min(Math.round(p.x), split[p.y].length), 0);
    
    return p;
  }
  getCharActualPos(charPos) {
    let size = nde.renderer.measureText("a");

    return charPos._mulV(size).addV(this.pos).add(this.style.padding).subV(this.scroll);
  }

  getMinPos(pos1, pos2) {
    let top = pos1;
    let bottom = pos2;
    if (bottom.y < top.y || (bottom.y == top.y && bottom.x < top.x)) {
      let t = top;
      top = bottom;
      bottom = t;
    }

    return top;
  }

  moveCursorRight(cursor) {
    let lines = this.getLines();

    if (cursor.x == lines[cursor.y].length) {
      if (cursor.y == lines.length - 1) return false;

      cursor.y++;
      cursor.x = 0;
    } else {
      cursor.x++;
    }
    return true;
  }
  moveCursorLeft(cursor) {
    let lines = this.getLines();

    if (cursor.x == 0) {
      if (cursor.y == 0) return false;

      cursor.y--;
      cursor.x = lines[cursor.y].length;
    } else {
      cursor.x--;
    }
    return true;
  }

  getLines() {
    return this.value.split("\n");
  }
  getCharSpans(pos1, pos2) {
    let split = this.getLines();

    let top = pos1;
    let bottom = pos2;
    if (bottom.y < top.y || (bottom.y == top.y && bottom.x < top.x)) {
      let t = top;
      top = bottom;
      bottom = t;
    }

    let spans = [];
    for (let y = top.y; y <= bottom.y; y++) {
      let span = new Vec(0, y, 0);

      if (y == top.y) span.x = top.x; 
      else span.x = 0;

      if (y == bottom.y) span.z = Math.min(bottom.x, split[y].length) - span.x;
      else span.z = split[y].length - span.x;

      spans.push(span);
    }

    return spans;
  }
  getChars(pos1, pos2) {
    let lines = this.getLines();
    let spans = this.getCharSpans(pos1, pos2);

    let strings = [];
    for (let span of spans) {
      strings.push(lines[span.y].substr(span.x, span.x + span.z));
    }
    return strings.join("\n");
  }
  getCharIndex(pos) {
    let lines = this.getLines();

    let index = pos.x;
    for (let y = 0; y < pos.y; y++) {
      index += lines[y].length + 1;
    }

    return index;
  }
  
  isCursorEmpty(cursor) {
    let line = this.getLines()[cursor.y];

    return ((cursor.x == 0 || !isAlphaNumeric(line[cursor.x - 1])) && (cursor.x == line.length || !isAlphaNumeric(line[cursor.x])))
  }
  fillCursorLeft(cursor) {
    let line = this.getLines()[cursor.y];
    let isEmpty = this.isCursorEmpty(cursor);

    for (let x = 0; x < 1000; x++) {      
      if (cursor.x == 0) return x;

      let charIsEmpty = !isAlphaNumeric(line[cursor.x - 1]);
      if (isEmpty != charIsEmpty) return x;

      cursor.x--;
    }
    return 1000;
  }
  fillCursorRight(cursor) {
    let line = this.getLines()[cursor.y];
    let isEmpty = this.isCursorEmpty(cursor);

    for (let x = 0; x < 1000; x++) {      
      if (cursor.x == line.length) return x;    

      let charIsEmpty = !isAlphaNumeric(line[cursor.x]);
      if (isEmpty != charIsEmpty) return x;

      cursor.x++;
    }
    return 1000;
  }

  removeAtCursor(cursor) {
    let lines = this.getLines();
    let line = lines[cursor.y];

    let char = "";

    if (cursor.x == 0) {
      if (cursor.y == 0) return char;

      cursor.x = lines[cursor.y - 1].length;
      lines[cursor.y - 1] += line;
      lines.splice(cursor.y, 1);
      cursor.y--;

      char = "\n";
    } else {
      lines[cursor.y] = line.slice(0, cursor.x - 1) + line.slice(cursor.x, line.length);
      cursor.x--;
      char = line.slice(cursor.x - 1, cursor.x);
    }

    this.value = lines.join("\n");
    
    return char;
  }
  removeSelected() {
    let i1 = this.getCharIndex(this.cursor);
    let i2 = this.getCharIndex(this.cursor2);

    let top = Math.min(i1, i2);
    let bottom = Math.max(i1, i2);

    let string = this.value.slice(top, bottom);
    this.value = this.value.slice(0, top) + this.value.slice(bottom, this.value.length);

    this.cursor = this.getMinPos(this.cursor, this.cursor2);
    this.cursor2 = undefined;

    return string;
  }

  addAtCursor(cursor, text) {
    let lines = this.getLines();
    let line = lines[cursor.y];

    lines[cursor.y] = line.slice(0, cursor.x) + text + line.slice(cursor.x, line.length);
    this.value = lines.join("\n");

    for (let i = 0; i < text.length; i++) {
      this.moveCursorRight(cursor);
    }

    
    return;
  }


  moveScreenToCursor(cursor) {
    let pos = this.getCharActualPos(cursor).subV(this.pos).addV(this.scroll);
    let size = nde.renderer.measureText("i").y;
    
    this.scroll.x = Math.max(Math.min(this.scroll.x, pos.x - this.style.padding * 2), pos.x - this.size.x + this.style.padding * 2);
    this.scroll.y = Math.max(Math.min(this.scroll.y, pos.y - this.style.padding * 2), pos.y - this.size.y + this.style.padding * 2 + size);
    
    this.constrainScroll();
    this.positionChildren();
  }

  render() {        
    this.rendererTransform = nde.renderer.getTransform();

    super.render();    
    nde.renderer.setAll(this.hovered ? this.style.hover.text : this.style.text);

    let cursor = this.cursor2 || this.cursor;
    let cursorPos = this.getCharActualPos(cursor);
    let cursorSize = nde.renderer.measureText("i");
    cursorSize.x = cursorSize.x * 0.15;
    cursorPos.x -= cursorSize.x / 2;

    nde.renderer.clipRect(this.pos._add(this.style.padding), this.size._sub(this.style.padding * 2), () => {
      this.children[0].text = this.value;

      if (this.focused) {
        if ((this.cursorTimer.elapsedTime / this.style.editor.blinkTime) % 1 < 0.5) {
          nde.renderer.rect(cursorPos, cursorSize);
        }

        if (this.cursor2 != undefined) {
          nde.renderer.set("filter", "opacity(20%)");
          let spans = this.getCharSpans(this.cursor, this.cursor2);
          let size = nde.renderer.measureText("a");
          for (let i = 0; i < spans.length; i++) {
            let span = spans[i];
            if (i < spans.length - 1) span.z++;
            nde.renderer.rect(this.getCharActualPos(span), new Vec(size.x * span.z, size.y));
          }
        }
      }
    });
  }
}



//https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function isAlphaNumeric(char) {
  let code = char.charCodeAt(i);
  return ((code > 47 && code < 58) || // numeric (0-9)
      (code > 64 && code < 91) || // upper alpha (A-Z)
      (code > 96 && code < 123)) // lower alpha (a-z)
  
};