


const EntityPlayer = new Ob({
  name: "Player",
}, [
  new Sprite("duck/1"),
  new Duck(),
  new PlayerInput(),
  new AudioSource(),
]);