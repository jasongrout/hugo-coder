const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Current mode tracks the user's choice: "light", "dark", or "auto"
let currentMode = localStorage.getItem("colorscheme") || "auto";

if (currentMode === "auto") {
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");
} else {
    setTheme(currentMode);
}

if (darkModeToggle) {
    updateToggleTitle();
    darkModeToggle.addEventListener('click', () => {
        // Cycle: light → dark → auto → light
        if (currentMode === "light") {
            currentMode = "dark";
        } else if (currentMode === "dark") {
            currentMode = "auto";
        } else {
            currentMode = "light";
        }

        if (currentMode === "auto") {
            localStorage.removeItem("colorscheme");
            setTheme(darkModeMediaQuery.matches ? "dark" : "light");
        } else {
            localStorage.setItem("colorscheme", currentMode);
            setTheme(currentMode);
        }
        updateToggleTitle();
    });
}

darkModeMediaQuery.addEventListener('change', (event) => {
    if (currentMode === "auto") {
        setTheme(event.matches ? "dark" : "light");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let node = document.querySelector('.preload-transitions');
    node.classList.remove('preload-transitions');
});

function setTheme(theme) {
    body.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    body.classList.remove('colorscheme-' + inverse);
    body.classList.add('colorscheme-' + theme);
    document.documentElement.style['color-scheme'] = theme;

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    if (theme === 'dark') {
        const message = {
            type: 'set-theme',
            theme: 'github-dark'
        };
        waitForElm('.utterances-frame').then((iframe) => {
            iframe.contentWindow.postMessage(message, 'https://utteranc.es');
        })
        
    }
    else {
        const message = {
            type: 'set-theme',
            theme: 'github-light'
        };
        waitForElm('.utterances-frame').then((iframe) => {
            iframe.contentWindow.postMessage(message, 'https://utteranc.es');
        })
        
    }

    function sendMessage(message) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
      }
      sendMessage({
        setConfig: {
          theme: theme,
        },
      });
    
    // Create and send event
    const event = new Event('themeChanged');
    document.dispatchEvent(event);
}

function updateToggleTitle() {
    if (darkModeToggle) {
        const labels = { light: "Light", dark: "Dark", auto: "Auto (system)" };
        const icons = { light: "fa-sun", dark: "fa-moon", auto: "fa-circle-half-stroke" };
        darkModeToggle.title = "Color scheme: " + labels[currentMode];
        const icon = darkModeToggle.querySelector("i");
        if (icon) {
            icon.className = "fa-solid " + icons[currentMode] + " fa-fw";
        }
    }
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}
