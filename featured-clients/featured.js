let clients;

document.addEventListener("DOMContentLoaded", async function () {
  await fetch("https://raw.githubusercontent.com/WonderlandLibrary/featured-clients/main/data.json")
    .then(response => response.json())
    .then(json => clients = json.clients);

  const buttons = document.querySelector(".tablist");

  for (const client of clients) {
    const button = document.createElement("button");
    button.className = "tab-button";
    button.innerHTML = client.name;
    button.onclick = function () {
        selectClient(client);
    };
    buttons.appendChild(button);
  }

  selectClient(clients[0]);
});

async function selectClient(client) {
  const panel = document.querySelector(".client-panel.active");
  panel.innerHTML = "";

  const clientNameElement = document.createElement("h2");
  clientNameElement.innerHTML = client.name;

  const clientVersionElement = document.createElement("h3");
  clientVersionElement.innerHTML = client.version;

  const minecraftVersionElement = document.createElement("h4");
  minecraftVersionElement.innerHTML = client.minecraftVersion;

  const clientDescriptionElement = document.createElement("p");
  clientDescriptionElement.innerHTML = client.description;

  panel.appendChild(clientNameElement);
  panel.appendChild(clientVersionElement);
  panel.appendChild(minecraftVersionElement);
  panel.appendChild(clientDescriptionElement);

  const imagesElement = document.createElement("div");
  imagesElement.className = "client-images";

  for (image of client.images) {
    const imageElement = document.createElement("img");
    imageElement.src = "https://raw.githubusercontent.com/WonderlandLibrary/featured-clients/main/images/" + image.file;
    imageElement.alt = image.name;
    imagesElement.appendChild(imageElement);
  }

  panel.appendChild(imagesElement);
}
