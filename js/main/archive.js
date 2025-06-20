window.addEventListener('load', async () => {
  const grid = document.getElementById("button-grid");

  grid.appendChild(createButton("Client Binaries", `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cb")} entries and counting!`, "browse.html?type=cb", "icons/minecraft.webp"));
  grid.appendChild(createButton("Plugin Binaries", `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=pb")} entries and counting!`, "browse.html?type=pb", "icons/minecraft.webp"));
  grid.appendChild(createButton("User Tools", "Coming soon!", "#", "icons/minecraft.webp"));

  grid.appendChild(createButton("Client Sources", `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=cs")} entries and counting!`, "browse.html?type=cs", "icons/code.webp"));
  grid.appendChild(createButton("Plugin Sources", `${await getEntries("https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=ps")} entries and counting!`, "browse.html?type=ps", "icons/code.webp"));
  grid.appendChild(createButton("Development tools", "Coming soon!", "#", "icons/code.webp"));

  document.body.appendChild(grid);
});

function createButton(name, description, link, iconSrc) {
  const wrapper = document.createElement("a");
  wrapper.href = link;

  const element = document.createElement("button");

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

async function getEntries(url) {
  let response = await fetch(url);
  return (await response.text()).split(/\r?\n/).length;
}
