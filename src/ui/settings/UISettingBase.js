class UISettingBase extends UIBase {
  constructor(props) {
    super(props);
    this.interactable = true;

    this.value = props.value;

    this.name = props.name;
    this.displayName = props.displayName;
  }


  initChildren() {}


  setValue(newValue) {
    this.value = newValue;
  }

  fireInput() {
    this.fire("input", this.value);
  }
  fireChange() {
    this.fire("change", this.value);
  }
}