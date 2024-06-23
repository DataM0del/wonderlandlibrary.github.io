const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const repo = urlParams.get("repo");

document.addEventListener("DOMContentLoaded", async function () {
  const listURL = `https://raw.githubusercontent.com/WonderlandLibrary/${repo}/main/available`;
  const folderURL = `https://github.com/WonderlandLibrary/${repo}/tree/main/sources`;

  // Buttons
  const response = await fetchWebsiteContent(listURL);
  const clients = response.split(/\r?\n|\r|\n/g);
  let output = [];

  for (let i = 0; i < clients.length; i++) {
    output[i] = { name: clients[i], url: `${folderURL}/${clients[i]}/` };
  }

  // Getting the information in the header based on the selected repository
  header = (() => {
    switch (repo) {
      case "client-sources":
        return {
          name: "Client Sources",
          description: "Archived Client sources. Not all are buildable and some may be infected.",
        };

      case "client-jars":
        return {
          name: "Client JARs",
          description: "Archived Client JARs. Not all are runnable and some may be infected.",
        };

      case "plugin-sources":
        return {
          name: "Plugin Sources",
          description: "Archived Plugin JARs. Not all are runnable and some may be infected.",
        };

      case "plugin-jars":
        return {
          name: "Plugin JARs",
          description: "Archived Plugin sources. Not all are buildable and some may be infected.",
        };

      default:
        return {
          name: "¯\\_(ツ)_/¯",
          description: "Unknown"
        };
    }
  })();

  // Modifying the "info"'s div html and adding the header information
  const info = document.querySelector(".info");
  info.innerHTML =
    `<h1>${header.name}</h1> <h3>${header.description}</h3>`;

  // Get the button grid container
  const buttonGrid = document.querySelector(".button-grid");

  // Loop through client sources and create buttons
  output.forEach((source) => {
    const a = document.createElement("a");
    a.href = source.url;
    a.className = "client-button";
    a.innerHTML = `${source.name}<span class="button-text">Click to view</span>`;
    buttonGrid.appendChild(a);
  });
});

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
