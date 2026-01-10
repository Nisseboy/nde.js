class UISettingBase extends UIBase {
  constructor(props) {
    super(props);
    this.interactable = true;

    this.value = props.value;
    this.focused = false;

    this.name = props.name;
    this.displayName = props.displayName;
  }


  initChildren() {}


  setValue(newValue) {
    this.value = newValue;
  }
  setFocus(newFocus) {
    this.focused = newFocus;

    if (!newFocus) {
      this.fireChange(false);
    }
  }

  fireInput() {
    this.fire("input", this.value);
  }
  fireChange(wasSubmitted = true) {    
    this.fire("change", this.value, wasSubmitted);
  }
}