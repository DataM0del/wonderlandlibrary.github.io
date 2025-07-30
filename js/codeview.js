let files = {};

window.addEventListener('load', async () => {
    const loadingText = document.getElementById("loading-text");
    const loadingStates = ["Loading", "Loading.", "Loading..", "Loading..."];
    let loadingIndex = 0;

    const loadingInterval = setInterval(() => {
        loadingText.textContent = loadingStates[loadingIndex];
        loadingIndex = (loadingIndex + 1) % loadingStates.length;
    }, 500);

    const url = getDownloadUrlFromQuery();
    if (!isValidZipUrl(url)) {
        alert("Invalid or missing ZIP URL.");
        return;
    }

    try {
        const zip = await fetchAndLoadZip(url);
        files = await extractFiles(zip);

        document.getElementById("loading-wrapper").remove();
        clearInterval(loadingInterval);
        const element = document.getElementById("content-wrapper");

        const filesBox = document.createElement("div");
        filesBox.classList.add("box");
        filesBox.classList.add("box-files");
        filesBox.id = "filetree";
        element.appendChild(filesBox);

        const codeBox = document.createElement("div");
        codeBox.classList.add("box");
        codeBox.classList.add("box-code");
        codeBox.id = "code"
        element.appendChild(codeBox);

        const fileTree = collapseTree(buildTree(Object.keys(files).sort()));
        renderFileTree(fileTree);
    } catch (err) {
        console.error("Error loading ZIP:", err);
        alert("Failed to load ZIP archive.");
    }
});

function getDownloadUrlFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return decodeURIComponent(params.get('url') || '');
}

function isValidZipUrl(url) {
    return url.startsWith("https://wonderland.sigmaclient.cloud/download.php?type=") && url.endsWith(".zip");
}

async function fetchAndLoadZip(url) {
    const response = await fetch(url);
    const zipData = await response.arrayBuffer();
    return await JSZip.loadAsync(zipData);
}

async function extractFiles(zip) {
    const extracted = {};
    for (const [name, file] of Object.entries(zip.files)) {
        if (!file.dir) {
            extracted[name] = await file.async('string');
        }
    }
    return extracted;
}

function buildTree(paths) {
    const root = {};
    for (const path of paths) {
        const parts = path.split('/');
        let node = root;
        parts.forEach((part, index) => {
            if (!node[part]) {
                node[part] = index === parts.length - 1 ? null : {};
            }
            node = node[part] || {};
        });
    }
    return root;
}

function collapseTree(node) {
    const result = {};
    for (const key in node) {
        let currentKey = key;
        let child = node[key];

        while (
            child && typeof child === 'object' &&
            Object.keys(child).length === 1 &&
            child[Object.keys(child)[0]] !== null
            ) {
            const [nextKey] = Object.keys(child);
            currentKey += '/' + nextKey;
            child = child[nextKey];
        }

        result[currentKey] = (child && typeof child === 'object') ? collapseTree(child) : child;
    }
    return result;
}

function renderFileTree(tree) {
    const container = document.getElementById('filetree');
    container.innerHTML = '';
    container.appendChild(renderTree(tree, '', 0));
}

function renderTree(node, currentPath, depth) {
    const ul = document.createElement('ul');

    const entries = Object.entries(node).sort(([aName, aVal], [bName, bVal]) => {
        const aIsDir = aVal !== null;
        const bIsDir = bVal !== null;

        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return aName.localeCompare(bName);
    });

    for (const [name, child] of entries) {
        const li = document.createElement('li');

        if (child) {
            const dir = document.createElement('span');
            dir.classList.add('directory');

            const indicator = document.createElement('span');
            indicator.classList.add('expand-indicator');
            indicator.textContent = '▶';

            const dirName = document.createElement('span');
            dirName.textContent = name;
            dirName.classList.add('dir-name');

            processColors(dirName, name, true);
            if (depth === 0) dirName.classList.add('color_top');

            dir.append(indicator, dirName);

            const nested = renderTree(child, `${currentPath}${name}/`, depth + 1);
            nested.classList.add('nested');

            dir.addEventListener('click', () => {
                nested.classList.toggle('active');
                indicator.classList.toggle('expanded');
            });

            li.append(dir, nested);
        } else {
            const fileEl = document.createElement('span');
            fileEl.textContent = name;
            fileEl.classList.add('file');

            processColors(fileEl, name, false);
            console.log(currentPath + name);
            fileEl.addEventListener('click', () => displayFileContent(currentPath + name, name));

            li.appendChild(fileEl);
        }

        ul.appendChild(li);
    }

    return ul;
}
function displayFileContent(fullPath, filename) {
    let content = files[fullPath];

    function isProbablyBinary(str) {
        const sample = str.slice(0, 1000);
        let nonPrintable = 0;
        for (let i = 0; i < sample.length; i++) {
            const charCode = sample.charCodeAt(i);
            if (charCode < 9 || (charCode > 13 && charCode < 32) || charCode === 65533) {
                nonPrintable++;
            }
        }
        const ratio = nonPrintable / sample.length;
        return ratio > 0.1;
    }

    const extension = filename.split('.').pop().toLowerCase();

    const languageMap = {
        js: 'javascript', mjs: 'javascript', cjs: 'javascript',
        ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
        json: 'json', java: 'java', class: 'java',
        py: 'python', rb: 'ruby', php: 'php', pl: 'perl',
        sh: 'bash', bash: 'bash', zsh: 'bash', bat: 'batch',
        ps1: 'powershell', c: 'c', h: 'c', cpp: 'cpp',
        cc: 'cpp', cxx: 'cpp', hpp: 'cpp', cs: 'csharp',
        go: 'go', rs: 'rust', swift: 'swift', kt: 'kotlin',
        kotlin: 'kotlin', scala: 'scala', sql: 'sql',
        html: 'markup', xml: 'markup', svg: 'markup',
        css: 'css', scss: 'scss', sass: 'sass', less: 'less',
        yaml: 'yaml', yml: 'yaml', ini: 'ini', toml: 'toml',
        md: 'markdown', markdown: 'markdown', txt: 'clike',
        dockerfile: 'docker', makefile: 'makefile', cmake: 'cmake',
        asm: 'asm6502', lua: 'lua', r: 'r', vb: 'vbnet',
        tex: 'latex', graphql: 'graphql'
    };

    let lang = languageMap[extension] || 'clike';

    const codeDiv = document.getElementById('code');
    if (!content || isProbablyBinary(content)) {
        lang = "markdown";
        content = `Unable to display ${filename}`;
    }

    codeDiv.innerHTML = `<pre class="code-container"><code class="language-${lang}">${Prism.highlight(content, Prism.languages[lang] || Prism.languages.clike, lang)}</code></pre>`;
}


function processColors(el, name, isDir) {
    if (name.startsWith('.')) el.classList.add('color_hidden');

    if (isDir) {
        if (name === 'src' || name.startsWith('src')) el.classList.add('color_src');
        if (name === 'gradle') el.classList.add('color_gradle');
    } else {
        const gradleFiles = new Set([
            "build.gradle",
            "gradle.properties",
            "gradlew",
            "gradlew.bat",
            "settings.gradle",
            "gradle-wrapper.jar",
            "gradle-wrapper.properties"
        ]);

        if (gradleFiles.has(name)) el.classList.add('color_gradle');
        if (name.endsWith('.java')) el.classList.add('color_java');
    }
}
