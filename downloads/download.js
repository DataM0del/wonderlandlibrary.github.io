//             <a href="list/list.html?repo=client-jars" class="client-button">Client JARs<span class="button-text">Click to view</span></a>
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const clientParam = urlParams.get("client");

let clients;

document.addEventListener("DOMContentLoaded", async function () {
  await fetch("https://raw.githubusercontent.com/WonderlandLibrary/featured-clients/main/data.json")
    .then(response => response.json())
    .then(json => clients = json.clients);

  const container = document.querySelector(".downloads-container");

  let client;

  for (const it of clients) {
    const name = it.name;
    if (name.toLowerCase() == clientParam)
      client = it;
  }

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
    button.href = download.link;
    button.className = "download-button";
    button.innerHTML = download.name + "<span class=\"button-text\">Click to download</span>";
    buttonGrid.appendChild(button);
  }

  container.appendChild(buttonGrid);
});
