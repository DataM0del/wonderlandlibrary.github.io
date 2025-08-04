/*
    This is what the url component should be like:
    {
    "component": "blablabla";
    "files": [
            {
                "name: "File McFileface von Filenstadt",
                "url": "https://wonderland.sigmaclient.cloud/...",
                "md5": "blablabla",
                "dateUploaded": "11.09.2001"
            },
            {
                "name: "File McFileface von Filenstadt",
                "url": "https://wonderland.sigmaclient.cloud/...",
                "md5": "blablabla",
                "dateUploaded": "11.09.2001"
            }
        ]
    }
    encoded in base64
 */

/*
    <div class="box">
        <div class="file-data">
            <p class="title">File McFileface von Filestadt</p>
            <p class="sub">MD5: 649B1AF10B4C526EABB236E6303418FD</p>
            <p class="sub">Date added: 11.09.2001</p>
            <p class="sub">Download valid until: 12:05</p>
        </div>

        <div class="buttons">
            <button>Download</button>
            <button>Share</button>
        </div>
    </div>
 */

window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search);
    const files = decodeURIComponent(params.get('files') || '');

    if (!files)
        return;

    const filesDecoded = JSON.parse(atob(files));

    console.log(filesDecoded);

    for (const fileObject of filesDecoded) {
        if (!fileObject.url.startsWith('download.php'))
            return;

        const boxDiv = document.createElement('div');
        boxDiv.className = 'box';

        const fileDataDiv = document.createElement('div');
        fileDataDiv.className = 'file-data';

        const name = document.createElement('p');
        name.className = 'title';
        name.textContent = fileObject.name;

        const dateUploaded = document.createElement('p');
        dateUploaded.className = 'sub';
        dateUploaded.textContent = "Date uploaded: " + formatEpochTime(fileObject.dateUploaded);

        const hash = document.createElement('p');
        hash.className = 'sub';
        hash.textContent = "MD5: " + fileObject.md5;

        fileDataDiv.append(name, dateUploaded, hash);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'buttons';

        const downloadButtonWrapper = document.createElement('a');
        const downloadButton = document.createElement('button');
        downloadButton.innerText = "Download";
        downloadButtonWrapper.href = "https://wonderland.sigmaclient.cloud/" + fileObject.url;
        downloadButtonWrapper.appendChild(downloadButton);

        const shareButtonWrapper = document.createElement('a');
        const shareButton = document.createElement('button');
        shareButton.innerText = "Share";
        shareButtonWrapper.href = "javascript:share()"
        shareButtonWrapper.appendChild(shareButton);

        buttonsDiv.append(downloadButtonWrapper, shareButtonWrapper);

        boxDiv.append(fileDataDiv, buttonsDiv);

        document.getElementById("box-container").appendChild(boxDiv);
    }
});

function share() {
    navigator.clipboard.writeText(window.location.search).then(function() {
        window.alert('URL copied to clipboard!');
    }, function(err) {
        console.error('Failed to copy URL to clipboard! ', err);
    });
}

function formatEpochTime(epochTime, format = 'short') {
    const date = new Date(epochTime * 1000);

    const userLocale = navigator.language || 'en_GB';
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const options = {
        timeZone: userTimeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };

    if (format === 'short') {
        options.year = '2-digit';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    } else if (format === 'long') {
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.second = 'numeric';
    } else if (format === 'full') {
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.weekday = 'long';
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.second = 'numeric';
    }

    const formatter = new Intl.DateTimeFormat(userLocale, options);

    return formatter.format(date);
}