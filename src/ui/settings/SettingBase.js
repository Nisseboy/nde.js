class SettingBase extends UIElementBase {
  constructor(pos, size, events, value) {
    super(pos, size, events);

    this.value = value;
  }

  setValue(newValue) {
    let old = this.value;
    this.value = newValue;

    if (old != this.value) this.fireEvent("input", this.value);
  }

  change() {
    this.fireEvent("change", this.value);
  }
}