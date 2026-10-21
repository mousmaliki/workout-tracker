# LiftLab

A dependency-free workout tracker for Windows and Android browsers. Routines, exercise definitions, in-progress sessions, and workout history are stored in the browser's local storage on the current device. The starter Monday, Wednesday, and Friday routines are editable examples; they are not workout records.

For an overview of the code layers and ideas for safe first modifications, see [LEARNING_GUIDE.md](LEARNING_GUIDE.md).

## Run on Windows

Double-click `index.html` to open the app in your browser. The app uses classic scripts so its buttons work when opened directly from disk; it does not need Node.js for this.

To serve it locally instead, install Node.js, open a terminal in this folder, and run `npm start`. Then open `http://localhost:4173`.

For an Android phone on the same Wi-Fi, install Node.js and run `npm run start:network`, then open `http://<this-computer's-local-IP>:4173` on the phone. Allow the private-network firewall prompt if Windows displays one. For internet access outside your home network, deploy the static files to a web host that serves HTTPS.

## Install on Android

The app is now set up as a PWA: it has an app manifest, 192px/512px app icons, an install button, and a service worker that caches the app files for offline launch. To install it on Android, publish `index.html`, `app.js`, `core.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, and the `icons/` folder to an HTTPS web host, then open that URL in Chrome on your phone. Tap **Install app** in the page when it appears, or use Chrome's menu and choose **Install app** / **Add to Home screen**. Browsers may label the option differently. Chromium recommends 192px and 512px manifest icons for installability. [Chrome installability guidance](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest/)

Opening `index.html` directly on Windows is useful for development but cannot register the service worker or install the PWA. The `start:network` server uses plain HTTP for Wi-Fi testing; it is not a secure origin for Android service workers. Use an HTTPS-hosted URL for the installable and offline-ready version. Open the hosted app once while online so it can cache its files.

Each device keeps its own local data. Use **Export data** on one device and **Import** on the other to transfer a backup; importing replaces the current device's data.

## Progression rule

Exercises have a rep range. If every set reaches the top of that range with at least 2 reps in reserve (RIR), the next target adds 2.5 kg and returns to the range minimum. Otherwise, keep the load and aim for one more rep per set, capped at the range maximum. This is a transparent suggestion; adjust the increment to match the equipment you use.

Estimated 1RM uses Epley's formula, `weight × (1 + reps / 30)`. Weekly volume is the sum of `weight × reps` across logged sets. These are tracking estimates, not medical advice.

## Tests

Run `npm test` to check progression calculations and local data persistence behavior.
