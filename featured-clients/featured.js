const images = new Map();

let loaded = false;
let imageCount = 0;
let loadedImageCount = 0;

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
      if (loaded)
        selectClient(client);
    };
    buttons.appendChild(button);
  }

  updateLoad();
  await cacheImages();
  selectClient(clients[0]);
});

async function cacheImages() {
  for (const client of clients) {
    for (const image of client.images) {
      imageCount++;
    }
  }

  for (const client of clients) {
    for (const image of client.images) {
        const fileUrl = "https://raw.githubusercontent.com/WonderlandLibrary/featured-clients/main/images/" + image.file;
        const base64data = await fetchWebsiteContent(fileUrl);
        images.set(image.file, base64data);

        loadedImageCount++;

        updateLoad();
    }
  }

  loaded = true;
}

async function updateLoad() {
  if (loaded) {
    console.warn("Attempted to call updateLoad after website has been loaded!");
    return;
  }

  const panel = document.querySelector(".client-panel.active");
  panel.innerHTML = "";

  const loading = document.createElement("div");
  loading.className = "loading";

  const title = document.createElement("h2");
  title.innerHTML = "Loading Information";

  const desc = document.createElement("h3");
  desc.innerHTML = `Loaded ${loadedImageCount}/${imageCount}`;

  loading.appendChild(title);
  loading.append(desc);

  panel.appendChild(loading);
}

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
    imageElement.src = images.get(image.file);
    imageElement.alt = image.name;
    imagesElement.appendChild(imageElement);
  }

  panel.appendChild(imagesElement);
}

async function fetchWebsiteContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching website content:", error);
    return "Error! View console for logs.";
  }
}
