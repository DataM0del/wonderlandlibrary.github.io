window.addEventListener('load', async () => {
  const grid = document.getElementById("button-grid");

  const cbButton = createButton("Client Binaries", "Loading...", "browse.html?type=cb", "icons/minecraft.webp");
  const pbButton = createButton("Server tool Binaries", "Loading...", "browse.html?type=pb", "icons/minecraft.webp");
  const utButton = createButton("User Tools", "Loading...", "browse.html?type=ut", "icons/minecraft.webp");

  const csButton = createButton("Client Sources", "Loading...", "browse.html?type=cs", "icons/code.webp");
  const psButton = createButton("Server tool Sources", "Loading...", "browse.html?type=ps", "icons/code.webp");
  const dtButton = createButton("Development Tools", "Loading...", "browse.html?type=dt", "icons/code.webp");

  grid.appendChild(cbButton);
  grid.appendChild(pbButton);
  grid.appendChild(utButton);
  grid.appendChild(csButton);
  grid.appendChild(psButton);
  grid.appendChild(dtButton);

  modifyDescription(cbButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cb")} entries and counting!`);
  modifyDescription(pbButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=pb")} entries and counting!`);
  modifyDescription(utButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=ut")} entries and counting!`);
  modifyDescription(csButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cs")} entries and counting!`);
  modifyDescription(psButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=ps")} entries and counting!`);
  modifyDescription(dtButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=dt")} entries and counting!`);
});

function createButton(name, description, link, iconSrc) {
  const wrapper = document.createElement("a");
  wrapper.href = link;

  const element = document.createElement("button");
  element.id = "button";

  const buttonText = document.createElement("div");
  buttonText.className = "button-text";

  const mainLabel = document.createElement("span");
  mainLabel.className = "label-main";
  mainLabel.innerHTML = name;
  buttonText.appendChild(mainLabel);

  const subLabel = document.createElement("span");
  subLabel.className = "label-sub";
  subLabel.innerHTML = description;
  buttonText.appendChild(subLabel);

  element.appendChild(buttonText);

  const icon = document.createElement("img");
  icon.src = iconSrc;
  icon.alt = "icon";
  icon.className = "button-icon";

  element.appendChild(icon);
  wrapper.appendChild(element);

  return wrapper;
}

function modifyDescription(button, description) {
  button.childNodes[0].childNodes[0].childNodes[1].textContent = description;
}

async function getEntries(url) {
  let response = await fetch(url);
  return (await response.text()).split(/\r?\n/).length;
}
