class UISettingBase extends UIBase {
  constructor(props) {
    super(props);
    this.interactable = true;

    this.value = props.value;
    this.lastValue = this.value;
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
    if (JSON.stringify(this.lastValue) == JSON.stringify(this.value)) return;
    this.lastValue = this.value;

    this.fire("change", this.value, wasSubmitted);
  }
}