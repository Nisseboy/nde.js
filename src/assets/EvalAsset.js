let unloadedEvalAssets = [];

class EvalAsset extends Asset {
  constructor() {
    super();

    this.name = undefined;
  }

  load({path, name}) {
    this.name = name; 

    return new Promise((resolve) => {
      fetch(path).then(async res => {
        let data = await res.text();
          this.data = data;
        if (nde.hasStarted) this.eval();
        else unloadedEvalAssets.push(this);

        resolve(this);
      }).catch(e => {
        console.error(`"${path}" not found`);

        resolve(this);
      });

      
      if (!nde.assets) nde.assets = {};
      nde.assets[name] = undefined;
    });
  }

  eval() {
    let ob = eval(this.data);
    nde.assets[this.name] = ob;
    return ob;
  }
}