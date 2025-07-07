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
            name = "Server tool Binaries";
            break;
        case 'ps':
            name = "Server tool Sources";
            break;
        case 'ut':
            name = "User Tools";
            break;
        case 'dt':
            name = "Development Tools";
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

function getButton(name, entryName) {
    const wrapper = document.createElement('a');
    const button = document.createElement("button");
    button.innerText = name;
    wrapper.append(button);

    const isSource = currentType === 'cs' || currentType === 'ps' || currentType === 'ut' || currentType === 'dt';

    wrapper.href = function () {
        if (isSource) {
            return `https://jelloprg.sigmaclient.cloud/wonderland/download.php?type=${currentType}&folder=&file=${entryName}`
        } else {
            return `https://jelloprg.sigmaclient.cloud/wonderland/get.php?type=${currentType}&folder=${entryName}`
        }
    }();

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
