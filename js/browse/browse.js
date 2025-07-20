let name = null;
let secondary = null;
let entries = new Map();
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
            secondary = "https://gist.githubusercontent.com/ayaxperson/0e2e2e54558809fbbae3f2c9f1463c9b/raw/b1ce677e6be94d7e901d7a9c5104128ec1827d7a/gistfile1.txt";
            break;
        case 'ps':
            name = "Server tool Sources";
            secondary = "https://gist.githubusercontent.com/ayaxperson/0e2e2e54558809fbbae3f2c9f1463c9b/raw/b1ce677e6be94d7e901d7a9c5104128ec1827d7a/gistfile2.txt";
            break;
        case 'ut':
            name = "User Tools";
            break;
        case 'dt':
            name = "Development Tools";
            break;
        case "s_lb":
            name = "LiquidBounce scripts";
            break;
        case "s_rn":
            name = "Raven scripts";
            break;
        case "s_ao":
            name = "Astolfo scripts";
            break;
        default:
            throw "Unknown type " + type;
    }

    fetch('https://wonderland.sigmaclient.cloud/getlist.php?type=' + type)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        }).then(data => {
        for (let name of data.split(/\r?\n/)) {
            const isSource = currentType === 'cs' || currentType === 'ps' || currentType === 'ut' || currentType === 'dt';
            const link = function () {
                if (isSource) {
                    return `https://wonderland.sigmaclient.cloud/download.php?type=${currentType}&folder=&file=${name}`
                } else {
                    return `https://wonderland.sigmaclient.cloud/get.php?type=${currentType}&folder=${name}`
                }
            }();
            entries.set(name, link);
        }
        writeDataToUi();
        })
        .catch(error => {
            console.error('Error fetching featured clients:', error);
        });

    if (secondary != null) {
        fetch(secondary)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            }).then(data => {
            for (let line of data.split(/\r?\n/)) {
                const splitLine = line.split(":::");
                const name = splitLine[0];
                const link = splitLine[1];

                entries.set(name, link);
            }
            writeDataToUi();
        })
            .catch(error => {
                console.error('Error fetching featured clients:', error);
            });
    }
}

const entryGrid = document.getElementById('entry-grid');

function writeDataToUi() {
    document.getElementById('header').innerText = name;

    entryGrid.innerHTML = "";

    for (const [key, value] of sortMap(entries)) {
        const trimmedValue = key.trim();
        if (!trimmedValue) continue;

        const button = getButton(trimmedValue, trimmedValue, value);
        entryGrid.appendChild(button);
        buttonMap.set(trimmedValue, button);
    }
}

function sortMap(map) {
    return new Map([...map.entries()].sort((a, b) => {
        return a[0].localeCompare(b[0]);
    }));
}

function getButton(name, entryName, link) {
    const wrapper = document.createElement('a');
    const button = document.createElement("button");
    button.innerText = name;
    wrapper.append(button);
    wrapper.href = link;

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
