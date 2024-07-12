const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const clientParam = urlParams.get("client");

let data;

document.addEventListener("DOMContentLoaded", async function () {
  await fetch("https://wonderlandlibrary.github.io/featured/data.json")
    .then(response => response.json())
    .then(json => data = json);

  const container = document.querySelector(".downloads-container");

  let clients = data.clients;

  let client;

  for (const it of clients) {
    const name = it.name;
    if (name.toLowerCase() == clientParam)
      client = it;
  }

  if (client == undefined) {
    const clientName = document.createElement("h1");
    clientName.innerHTML = "Unknown";

    const description = document.createElement("h3");
    description.innerHTML = "Attempted to access data that doesn't exist"

    container.appendChild(clientName);
    container.appendChild(description);

    const buttonGrid = document.createElement("div");
    buttonGrid.className = "button-grid";

    const button = document.createElement("a");

    button.href = "https://wonderlandlibrary.github.io/";

    button.className = "download-button";
    button.innerHTML =  "Go Back";
    buttonGrid.appendChild(button);

    container.appendChild(buttonGrid);

    return;
  }

  if (client.downloadType == "standard") {
    const clientName = document.createElement("h1");
    clientName.innerHTML = client.name;

    const description = document.createElement("h3");
    description.innerHTML = `Download different versions of the ${client.name} client`;

    container.appendChild(clientName);
    container.appendChild(description);

    const buttonGrid = document.createElement("div");
    buttonGrid.className = "button-grid";

    for (const download of client.links) {
      const button = document.createElement("a");

      let link = download.link;

      if (link.startsWith("https")) {
        button.href = link;
      } else {
        button.href = "https://wonderlandlibrary.github.io/featured/clients/" + link;
      }

      button.className = "download-button";
      button.innerHTML = download.name + "<span class=\"button-text\">Click to download</span>";
      buttonGrid.appendChild(button);
    }

    container.appendChild(buttonGrid);
  } else if (client.downloadType == "comingsoon") {
    const h1 = document.createElement("h1");
    h1.innerHTML = "Coming soon";
    const gif = document.createElement("img");
    gif.src = "https://wonderlandlibrary.github.io/featured/images/cat.gif";
    gif.alt = "Kitty cat gif";

    container.appendChild(h1);
    container.appendChild(gif);
  }
});
