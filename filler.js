document.addEventListener('DOMContentLoaded', async function() {
    const listURL = (() => {
      switch (document.title) {
        case "Client Sources":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-sources/main/available";
        case "Client JARs":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-jars/main/available";
        case "Plugin Sources":
          return "https://raw.githubusercontent.com/WonderlandLibrary/plugin-sources/main/available";
        case "Plugin JARs":
          return "https://raw.githubusercontent.com/WonderlandLibrary/plugin-jars/main/available";
      }
    })();

    const folderURL = (() => {
      switch (document.title) {
        case "Client Sources":
          return "https://github.com/WonderlandLibrary/client-sources/tree/main/sources";
        case "Client JARs":
          return "https://github.com/WonderlandLibrary/client-jars/tree/main/jars";
      	case "Plugin Sources":
          return "https://github.com/WonderlandLibrary/plugin-sources/tree/main/sources";
        case "Plugin JARs":
          return "https://github.com/WonderlandLibrary/plugin-jars/tree/main/jars";
	}
    })();

    // Buttons
    const response = await fetchWebsiteContent(listURL);
    const clients = response.split(/\r?\n|\r|\n/g);
    let output = [];

    for (let i = 0; i < clients.length; i++) {
      output[i] = {name: clients[i], url: `${folderURL}/${clients[i]}/`};
    }

    // Get the button grid container
    const buttonGrid = document.querySelector('.button-grid');

    // Loop through client sources and create buttons
    output.forEach(source => {
        const a = document.createElement('a');
        a.href = source.url;
        a.className = 'client-button';
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
        console.error('Error fetching website content:', error);
        return "Error";
    }
}
