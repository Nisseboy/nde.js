class UISettingText extends UISettingBase {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      text: {
        fill: "rgb(255, 255, 255)",

        font: "25px monospace",
        textAlign: ["left", "top"],
      },

      editor: {
        blinkTime: 1,
        clickTime: 0.5,
        multiLine: false,
        numberOnly: false,
      },
    };
    this.fillStyle(props.style);
    
    this.setValue("" + this.value);
    

    this.focused = false;

    this.cursor = new Vec(0, 0);
    this.cursor2 = undefined;
    this.cursorTimer = new TimerTime(1000000000);
    this.cursorTimer.loop = true;
    this.maxCursorX = 0;

    this.clicksInRow = 0;
    this.lastCharPos = new Vec(0, 0);

    this.scroll = new Vec(0, 0);


    this.rendererTransform = undefined;
    this.mousedownGlobalFunc = e => {this.mousedownGlobal(e)}
    this.mousemoveGlobalFunc = e => {this.mousemoveGlobal(e)}
    this.mouseupGlobalFunc = e => {this.mouseupGlobal(e)}
    this.keydownGlobalFunc = e => {return this.keydownGlobal(e)}
    this.registerEvent("mousedown", e=>{
      if (!this.focused) {
        nde.registerEvent("mousedown", this.mousedownGlobalFunc);
        nde.registerEvent("keydown", this.keydownGlobalFunc);
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
        this.cursor2 = new Vec(this.value.split("\n")[this.cursor.y].length, this.cursor.y);
      }

      if (this.clicksInRow == 3) {
        let lines = this.value.split("\n");
        this.cursor.set(0, 0);
        this.cursor2 = new Vec(lines[lines.length - 1].length, lines.length - 1);
        
      }

      this.forceHover = true;
      nde.registerEvent("mousemove", this.mousemoveGlobalFunc);
      nde.registerEvent("mouseup", this.mouseupGlobalFunc);
    });
  }
  
  setValue(newValue) {
    super.setValue(newValue);
    this.value = "" + this.value;
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
    nde.unregisterEvent("mousemove", this.mousemoveGlobalFunc);
    nde.unregisterEvent("mouseup", this.mouseupGlobalFunc);
  }

  keydownGlobal(e) {
    if (["Control", "Shift", "Alt", "AltGraph"].includes(e.key)) return;
    this.cursorTimer.elapsedTime = this.style.editor.blinkTime;

    let ctrl = e.ctrlKey;
    let shift = e.shiftKey;


    if (e.key == "Backspace") {
      if (this.cursor2 != undefined) this.removeSelected();
      else {
        if (ctrl) {
          this.cursor2 = this.cursor._();
          this.fillCursorLeft(this.cursor);
          this.removeSelected();
        } else {
          this.removeAtCursor(this.cursor);
        }
      }
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
    }
    if (e.key == "Escape") {
      this.endFocus();
    }

    if (e.key.startsWith("Arrow")) {
      let lines = this.value.split("\n");

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

        if (unselected) return;
        if (cursor.x == 0) {
          if (cursor.y == 0) return;

          cursor.y--;
          cursor.x = lines[cursor.y].length;
        } else {
          cursor.x--;
        }
      }
      if (e.key == "ArrowRight") {
        this.maxCursorX = 0;
        if (unselected) return;

        this.moveCursorRight(cursor);
      }
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
    }


    this.fireInput();

    return false;
  }

  endFocus() {
    nde.unregisterEvent("mousedown", this.mousedownGlobalFunc);
    nde.unregisterEvent("keydown", this.keydownGlobalFunc);
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

    let split = this.value.split("\n");
    p.y = Math.max(Math.min(Math.floor(p.y), split.length - 1), 0);
    p.x = Math.max(Math.min(Math.round(p.x), split[p.y].length), 0);
    
    return p;
  }
  getCharActualPos(charPos) {
    let size = nde.renderer.measureText("a");

    return charPos._mulV(size);
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
    let lines = this.value.split("\n");

    if (cursor.x == lines[cursor.y].length) {
      if (cursor.y == lines.length - 1) return false;

      cursor.y++;
      cursor.x = 0;
    } else {
      cursor.x++;
    }
    return true;
  }

  getCharSpans(pos1, pos2) {
    let split = this.value.split("\n");

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
    let lines = this.value.split("\n");
    let spans = this.getCharSpans(pos1, pos2);

    let strings = [];
    for (let span of spans) {
      strings.push(lines[span.y].substr(span.x, span.x + span.z));
    }
    return strings.join("\n");
  }
  getCharIndex(pos) {
    let lines = this.value.split("\n");

    let index = pos.x;
    for (let y = 0; y < pos.y; y++) {
      index += lines[y].length + 1;
    }

    return index;
  }
  
  isCursorEmpty(cursor) {
    let line = this.value.split("\n")[cursor.y];

    return ((cursor.x == 0 || line[cursor.x - 1] == " ") && (cursor.x == line.length || line[cursor.x] == " "))
  }
  fillCursorLeft(cursor) {
    let line = this.value.split("\n")[cursor.y];
    let isEmpty = this.isCursorEmpty(cursor);

    for (let x = 0; x < 100; x++) {      
      if (cursor.x == 0) return;

      let charIsEmpty = line[cursor.x - 1] == " ";
      if (isEmpty != charIsEmpty) return;

      cursor.x--;
    }
  }
  fillCursorRight(cursor) {
    let line = this.value.split("\n")[cursor.y];
    let isEmpty = this.isCursorEmpty(cursor);

    for (let x = 0; x < 100; x++) {      
      if (cursor.x == line.length) return;

      let charIsEmpty = line[cursor.x] == " ";
      if (isEmpty != charIsEmpty) return;

      cursor.x++;
    }
  }

  removeAtCursor(cursor) {
    let lines = this.value.split("\n");
    let line = lines[cursor.y];

    if (cursor.x == 0) {
      if (cursor.y == 0) return;

      cursor.x = lines[cursor.y - 1].length;
      lines[cursor.y - 1] += line;
      lines.splice(cursor.y, 1);
      cursor.y--;
    } else {
      lines[cursor.y] = line.slice(0, cursor.x - 1) + line.slice(cursor.x, line.length);
      cursor.x--;
    }

    this.value = lines.join("\n");
    
    return;
  }
  removeSelected() {
    let i1 = this.getCharIndex(this.cursor);
    let i2 = this.getCharIndex(this.cursor2);

    let top = Math.min(i1, i2);
    let bottom = Math.max(i1, i2);

    this.value = this.value.slice(0, top) + this.value.slice(bottom, this.value.length);

    this.cursor = this.getMinPos(this.cursor, this.cursor2);
    this.cursor2 = undefined;
  }

  addAtCursor(cursor, text) {
    let lines = this.value.split("\n");
    let line = lines[cursor.y];

    lines[cursor.y] = line.slice(0, cursor.x) + text + line.slice(cursor.x, line.length);
    cursor.x++;

    if (text == "\n") {
      cursor.x = 0;
      cursor.y++;
    }

    this.value = lines.join("\n");
    
    return;
  }

  render() {    
    this.rendererTransform = nde.renderer.getTransform();

    super.render();    
    this.textSize = nde.renderer.measureText(this.value);

    let pos = this.pos._add(this.style.padding);

    nde.renderer.setAll(this.hovered ? this.style.hover.text : this.style.text);
    nde.renderer.text(this.value, pos);

    if (this.focused) {
      let cursor = this.cursor2 || this.cursor;

      if ((this.cursorTimer.elapsedTime / this.style.editor.blinkTime) % 1 < 0.5) {
        let cursorPos = this.getCharActualPos(cursor).addV(pos);
        let cursorSize = nde.renderer.measureText("i");
        cursorSize.x = cursorSize.x * 0.15;
        nde.renderer.rect(cursorPos, cursorSize);
      }

      if (this.cursor2 != undefined) {
        nde.renderer.set("filter", "opacity(20%)");
        let spans = this.getCharSpans(this.cursor, this.cursor2);
        let size = nde.renderer.measureText("a");
        for (let i = 0; i < spans.length; i++) {
          let span = spans[i];
          if (i < spans.length - 1) span.z++;
          nde.renderer.rect(this.getCharActualPos(span).addV(pos), new Vec(size.x * span.z, size.y));
        }
      }
    }
  }
}


