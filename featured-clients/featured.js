const images = new Map();

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

  await cacheImages();
  selectClient(clients[0]);
});

async function cacheImages() {
  for (const client of clients) {
    for (const image of client.images) {
      await fetch("https://raw.githubusercontent.com/WonderlandLibrary/featured-clients/main/images/" + image.file)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            images.set(image.file, base64data);
          };
        });
    }
  }
}

async function selectClient(client) {
  const panel = document.querySelector(".client-panel.active");
  panel.innerHTML = "";

  const clientNameElement = document.createElement("h2");
  clientNameElement.innerHTML = client.name;

  const minecraftVersionElement = document.createElement("h3");
  minecraftVersionElement.innerHTML = client.clientType + " - " + client.minecraftVersion;

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
    imageElement.src = images.get(image.file);
    imageElement.alt = image.name;
    imagesElement.appendChild(imageElement);
  }

  panel.appendChild(imagesElement);
}
