let name = null;
let entries = null;
let currentType = null;
let buttonMap = new Map();

function prepareData(type) {
    currentType = type;
    switch (type) {
        case 'cb':
            name = "Client Binaries";
            break;
        case 'cs':
            name = "Client Sources";
            break;
        case 'pb':
            name = "Plugin Binaries";
            break;
        case 'ps':
            name = "Plugin Sources";
            break;
        default:
            throw "Unknown type " + type;
    }

    fetch('https://jelloprg.sigmaclient.cloud/wonderland/getlist.php?type=' + type)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        }).then(data => {
            entries = data.split(/\r?\n/);
            writeDataToUi();
        })
        .catch(error => {
            console.error('Error fetching featured clients:', error);
        });
}

const entryGrid = document.getElementById('entry-grid');

function writeDataToUi() {
    document.getElementById('header').innerText = name;

    entryGrid.innerHTML = "";

    for (const [, value] of Object.entries(entries)) {
        const trimmedValue = value.trim();
        if (!trimmedValue) continue;

        const button = getButton(trimmedValue, trimmedValue);
        entryGrid.appendChild(button);
        buttonMap.set(trimmedValue, button);
    }
}

function getButton(name, fileName) {
    const wrapper = document.createElement('a');
    const button = document.createElement("button");
    button.innerText = name;
    wrapper.append(button);

    const isSource = currentType === 'cs' || currentType === 'ps';
    const endpoint = isSource ? 'download.php' : 'get.php';

    const url = `https://jelloprg.sigmaclient.cloud/wonderland/${endpoint}?type=${currentType}&folder=&file=${encodeURIComponent(fileName)}`;
    wrapper.href = url;

    return wrapper;
}

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("input", () => {
    const searchTerm = searchBar.value.trim();

    if (searchTerm && searchTerm.length >= 1) {
        for (const [name, button] of buttonMap) {
            if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                button.style.display = "block";
            } else {
                button.style.display = "none";
            }
        }
    } else {
        for (const [, button] of buttonMap) {
            button.style.display = "block";
        }
    }
});

window.addEventListener('load', () => {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);

    const type = searchParams.get('type');

    prepareData(type);
});
