document.addEventListener('DOMContentLoaded', function() {
    const listURL = (() => {
      switch (document.title) {
        case "Client Sources":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-sources/main/available";
        case "Client JARs":
          return "https://raw.githubusercontent.com/WonderlandLibrary/client-jars/main/available";
      }
    })();

    // Buttons
    const clientSources = [
        { name: listURL, url: "https://www.google.com" },
        { name: "Google 1", url: "https://www.google.com" },
        { name: "Google 2", url: "https://www.google.com" },
        { name: "Google 3", url: "https://www.google.com" },
        { name: "Google 4", url: "https://www.google.com" },
        { name: "Google 5", url: "https://www.google.com" },
        { name: "Google 44", url: "https://www.google.com" }
    ];

    // Get the button grid container
    const buttonGrid = document.querySelector('.button-grid');

    // Loop through client sources and create buttons
    clientSources.forEach(source => {
        const a = document.createElement('a');
        a.href = source.url;
        a.className = 'client-button';
        a.innerHTML = `${source.name}<span class="button-text">Click to view</span>`;
        buttonGrid.appendChild(a);
    });
});
