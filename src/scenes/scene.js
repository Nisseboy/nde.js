class Scene {
  constructor() {
    this.hasStarted = false;    
  }

  start() {} /* when entered */
  stop() {} /* when exited */
 
  windowResized(e) {} /* when screen resized */
 
  keydown(e) {} /* when key pressed */
  keyup(e) {} /* when key released */
 
  mousemove(e) {} /* when mouse moved */
  mousedown(e) {} /* when mouse pressed */
  mouseup(e) {} /* when mouse released */
  scroll(e) {} /* when mouse scrolled */
 
  update(dt) {} /* called once per frame with delta time */
  render() {} /* called after update */
}