const screens = [];
const buttons = new Map();

let scrollIndex = 0;
let isHovering = false;
let scrollInterval = null;
let scroll = true;
let lastChange = Date.now();

const container = document.getElementById('clients');
const progressBarWrapper = document.getElementById("progress-bar-wrapper");
const progressBar = document.getElementById("progress-bar-selected");

container.addEventListener('mouseenter', () => {
    isHovering = true;
    progressBarWrapper.style.display = "none";
});

container.addEventListener('mouseleave', () => {
    scrollInterval.reset();
    lastChange = Date.now();
    isHovering = false;
    updateProgressBar();

    if (scroll)
        progressBarWrapper.style.display = "block";
});

class Timer {
    constructor(callback, interval) {
        this.callback = callback;
        this.interval = interval;
        this.timer = setInterval(callback, interval);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        return this;
    }

    start() {
        if (!this.timer) {
            this.timer = setInterval(this.callback, this.interval);
        }
        return this;
    }

    reset(newInterval = this.interval) {
        this.interval = newInterval;
        return this.stop().start();
    }
}

function startAutoScroll() {
    scrollInterval = new Timer(() => {
        if (scroll && !isHovering) {
            scrollIndex = (scrollIndex + 1) % screens.length;
            showScreen(scrollIndex);
            lastChange = Date.now();
        }
    }, 5000);

    setInterval(() => {
        if (scroll && !isHovering) {
            updateProgressBar();
        }
    }, 10);
}

function updateProgressBar() {
    const progress = ((Date.now() - lastChange) / 5000) * 100;
    progressBar.style.width = `${progress}%`;
}

function createSidebar() {
    const sidebar = document.getElementById("sidebar");

    screens.forEach((screen, index) => {
        const btn = document.createElement("button");
        btn.innerHTML = `<span>${screen.name}</span>`;
        btn.className = "side-btn";
        btn.onclick = () => {
            scroll = false;
            progressBarWrapper.style.display = "none";
            showScreen(index);
        };

        buttons.set(btn, index);
        sidebar.appendChild(btn);
    });

    showScreen(0);
}

function showScreen(index) {
    const screen = screens[index];

    document.getElementById("screen-title").textContent = screen.name;
    document.getElementById("screen-description").textContent = screen.description;
    document.getElementById("screen-image-1").src = screen.imageUrl1;
    document.getElementById("screen-image-2").src = screen.imageUrl2;
    document.getElementById("get-button-container").href = screen.link;
    document.getElementById("get-button").innerHTML =
        screen.price === 0 ? "GET (FREE)" : `GET (${screen.price}€)`;

    buttons.forEach((btnIndex, btn) => {
        if (btnIndex === index) {
            btn.classList.add("selected");
        } else {
            btn.classList.remove("selected");
        }
    });
}

function getScreenFromJsonClient(client) {
    const baseUrl = "https://wonderland.sigmaclient.cloud/data/";
    return {
        name: client.name,
        description: client.description,
        price: client.price,
        link: client.link === "discord" ? "https://discord.gg/BZhQFWYbhR" : client.link,
        imageUrl1: baseUrl + client.images[0],
        imageUrl2: baseUrl + client.images[1]
    };
}

window.addEventListener('load', () => {
    fetch('https://wonderland.sigmaclient.cloud/data/clients.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            screens.push(...data.clients.map(getScreenFromJsonClient));
            createSidebar();
            startAutoScroll();
        })
        .catch(error => {
            console.error('Error fetching featured clients:', error);
        });
});
