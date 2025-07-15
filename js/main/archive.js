window.addEventListener('load', async () => {
  // Main
  const grid1 = document.getElementById("button-grid-1");

  const cbButton = createButton("Client Binaries", "Loading...", "browse.html?type=cb", "icons/minecraft.webp");
  const pbButton = createButton("Server tool Binaries", "Loading...", "browse.html?type=pb", "icons/minecraft.webp");
  const utButton = createButton("User Tools", "Loading...", "browse.html?type=ut", "icons/minecraft.webp");

  const csButton = createButton("Client Sources", "Loading...", "browse.html?type=cs", "icons/code.webp");
  const psButton = createButton("Server tool Sources", "Loading...", "browse.html?type=ps", "icons/code.webp");
  const dtButton = createButton("Development Tools", "Loading...", "browse.html?type=dt", "icons/code.webp");

  grid1.appendChild(cbButton);
  grid1.appendChild(pbButton);
  grid1.appendChild(utButton);
  grid1.appendChild(csButton);
  grid1.appendChild(psButton);
  grid1.appendChild(dtButton);

  // Scripts
  const grid2 = document.getElementById("button-grid-2");

  const liquidBounceButton = createButton("LiquidBounce", "Loading...", "browse.html?type=s_lb", null, "icons/liquidbounce.png");
  const astolfoButton = createButton("Astolfo", "Loading...", "browse.html?type=s_ao", null, "icons/astolfo.png");
  const ravenButton = createButton("Raven", "Loading...", "browse.html?type=s_rn", null, "icons/raven.png");

  grid2.appendChild(liquidBounceButton);
  grid2.appendChild(astolfoButton);
  grid2.appendChild(ravenButton);

  // Updating descriptions after all the buttons have been added
  modifyDescription(cbButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cb")} entries and counting!`);
  modifyDescription(pbButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=pb")} entries and counting!`);
  modifyDescription(utButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=ut")} entries and counting!`);
  modifyDescription(csButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cs")} entries and counting!`);
  modifyDescription(psButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=ps")} entries and counting!`);
  modifyDescription(dtButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=dt")} entries and counting!`);

  modifyDescription(liquidBounceButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=s_lb")} entries and counting!`);
  modifyDescription(astolfoButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=s_ao")} entries and counting!`);
  modifyDescription(ravenButton, `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=s_rn")} entries and counting!`);
});

function createButton(name, description, link, imgSrc = null, iconSrc = null) {
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

  if (imgSrc) {
    const image = document.createElement("img");
    image.src = imgSrc;
    image.alt = "icon";
    image.className = "button-img";

    element.appendChild(image);
  }

  if (iconSrc) {
    const image = document.createElement("img");
    image.src = iconSrc;
    image.alt = "icon";
    image.className = "button-icon";

    element.appendChild(image);
  }

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
