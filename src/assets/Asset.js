class Asset {
  constructor() {
    this.loading = false;
    this.path = "";
  }

  load({path, name}) {
    return new Promise((resolve) => {
      fetch(path).then(async res => {
        this.data = await res.text();
        resolve(this);
      }).catch(e => {
        console.error(`"${path}" not found`);

        resolve(this);
      });

      
      if (!nde.assets) nde.assets = {};
      nde.assets[name] = this;
    });
  }

  destroy() {}
}