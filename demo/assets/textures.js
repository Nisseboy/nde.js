let tex = {};
let aud = {};

function preloadTextures() {
  //Load all the textures
  for (let i = 0; i < texturesPaths.length; i++) {
    tex[texturesPaths[i]] = nde.loadImg("assets/textures/" + texturesPaths[i] + ".png");
  }

  //Split all the spritemaps from files named for example "1,2,3,4" and makes "1", "2", "3", "4"
  for (textureName in tex) {
    let s1 = textureName.split("/");
    let fileName = s1.splice(s1.length - 1, 1)[0];
    let pathName = s1.join("/");

    let s2 = fileName.split(",");
    if (s2.length <= 1) continue;

    for (let i = 0; i < s2.length; i++) {
      let newImg = new Img(new Vec(1, 1));
      newImg.loading = true;
      tex[pathName + "/" + s2[i]] = newImg;
    }      

    let img = tex[textureName];
    delete tex[textureName];
      
    img.onload = () => {
      let size = new Vec(img.size.x / s2.length, img.size.y);
      
      for (let i = 0; i < s2.length; i++) {
        let newImg = tex[pathName + "/" + s2[i]];
        newImg.resize(size);
        newImg.ctx.putImageData(img.ctx.getImageData(size.x * i, 0, size.x, size.y), 0, 0);
        
        newImg.loading = false;
      }    
    }
  }

  //Make all the animations from folder named for example "rot,t,0.1,1" and makes animation named rot with files in the folder with TimerTime with 0.1s, that loops
  let animFolders = [];
  let animPaths = [];
  for (textureName in tex) {
    let s = textureName.split("/");
    if (s.length <= 1) continue;

    let folderName = s[s.length - 2];
    let path = "";
    for (let i = 0; i < s.length - 2; i++) path += s[i] + "/";
    
    if (folderName.split(",").length > 1 && !animFolders.includes(folderName)) {
      animFolders.push(folderName); 
      animPaths.push(path);
    }
  }
  for (i in animFolders) {
    let folderName = animFolders[i];
    let path = animPaths[i];

    let s = folderName.split(",");
    let name = s[0];
    let loop = !!parseInt(s[3]);
    let timer = new (s[1] == "t" ? TimerTime : TimerFrames)(parseFloat(s[2]));

    let path2 = path + folderName + "/";
    let path3 = path + name + "/";

    let anim = new ImgAnimation([], timer, loop);  
    tex[path + name] = anim; 

    nde.registerEvent("beforeSetup", () => {
      for (let n in tex) {
        let s = n.split(path2);
        if (s.length == 1) continue;
        
        tex[path3 + s[1]] = tex[n];

        anim.texs.push(tex[n]);
        delete tex[n];
      }
      
      timer.reset();
    });
  }

  //Load all the audios
  for (let i = 0; i < audiosPaths.length; i++) {
    aud[audiosPaths[i]] = nde.loadAud("assets/audios/" + audiosPaths[i] + ".mp3");
  }
}