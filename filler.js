document.addEventListener('DOMContentLoaded', async function() {
    const listURL = (() => {
      switch (document.title) {
        case "Client Sources":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-sources/main/available";
        case "Client JARs":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-jars/main/available";
      }
    })();

    // Buttons
    const response = await fetchWebsiteContent(listURL);
    const clients = response.split(/\r?\n|\r|\n/g);
    let output = [];

    for (let i = 0; i < clients.length; i++) {
      output[i] = {name: clients[i], url: "https://google.com"};
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
