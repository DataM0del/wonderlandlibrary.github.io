let clients;

document.addEventListener("DOMContentLoaded", async function () {
  await fetch("https://wonderlandlibrary.github.io/featured/data.json")
    .then(response => response.json())
    .then(json => clients = json.clients);

  const buttons = document.querySelector(".tablist");

  for (const client of clients) {
    if (client.hiddenOnWebsite)
	     continue;

    const button = document.createElement("button");
    button.className = "tab-button";
    button.innerHTML = client.name;
    button.onclick = function () {
      selectClient(client);
    };
    buttons.appendChild(button);
  }

  for (const client of clients) {
    if (client.hiddenOnWebsite)
       continue;

    selectClient(client);
    break;
  }
});


async function selectClient(client) {
  const panel = document.querySelector(".client-panel.active");
  panel.innerHTML = "";

  const clientNameElement = document.createElement("h2");
  const clientNameLinkElement = document.createElement("a");
  clientNameLinkElement.innerHTML = client.name;
  clientNameLinkElement.href = "downloads/download.html?client=" + client.name.toLowerCase();
  clientNameElement.appendChild(clientNameLinkElement);

  const minecraftVersionElement = document.createElement("h3");
  minecraftVersionElement.innerHTML = `${client.clientType} - ${client.minecraftVersion}`;

  const clientVersionElement = document.createElement("h4");
  clientVersionElement.innerHTML = client.version;

  const clientDescriptionElement = document.createElement("p");
  clientDescriptionElement.innerHTML = client.description;

  panel.appendChild(clientNameElement);
  panel.appendChild(clientVersionElement);
  panel.appendChild(minecraftVersionElement);
  panel.appendChild(clientDescriptionElement);

  const imagesElement = document.createElement("div");
  imagesElement.className = "client-images";

  for (const image of client.images) {
    const imageElement = document.createElement("img");
    imageElement.src = "https://wonderlandlibrary.github.io/featured/images/" + image.file;
    imageElement.alt = image.name;
    imagesElement.appendChild(imageElement);
  }

  panel.appendChild(imagesElement);
}
