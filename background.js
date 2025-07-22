/**
 * Chrome Artnet UDP web bridge
 * 
 * Chrome Apps can access a sockets API which includes UDP 
 * functionality. Normal Chrome pages and extensions don't
 * have access to this API, hence the need for this bridge
 * app. 
 * 
 * The app manifest must be set up to allow specific permissions 
 * and since Chrome Apps are techincally deprecated, they 
 * are limited to manifest v2 which does not support promises 
 * (and async/await as a result).
 * 
 * Chrome UDP sockets docs:
 * https://developer.chrome.com/docs/apps/reference/sockets/udp
 *
 * Chrome sockets manifest docs:
 * https://developer.chrome.com/docs/apps/manifest/sockets
 *
 * additional required manifest keys described here:
 * https://stackoverflow.com/questions/32073710/what-permission-is-needed-for-udp-in-a-chrome-app
 *
 * sample code showing data listeners and socket creation:
 * https://stackoverflow.com/questions/47480990/chrome-sockets-udp-how-to-successfully-broadcast
 *
 * Installation:
 * - Go to chrome://extensions/
 * - enable "Developer mode" (top right)
 * - click "Load unpacked" (top left)
 * - browse to this extension folder and select
 * 
 * Once the app is loaded it can be refreshed to pick up code 
 * changes using the refresh icon on the app card and the JS
 * console showing log output can be opened from the background
 * page link. 
 * 
 * sending UDP test data using netcat from the system shell:
 * $ echo "hi" | netcat -uc localhost 6577
 */

const UDP_PORT = 6577;

console.log('ArtNet UDP extension loaded');

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});

var socketId;
chrome.sockets.udp.create({}, (socketInfo) => {
    socketId = socketInfo.socketId;
    console.log(socketId);
    chrome.sockets.udp.bind(
      socketId,
      "0.0.0.0",
      UDP_PORT,
      () => {},
    );
});

chrome.sockets.udp.onReceive.addListener((data) => {
    const decoder = new TextDecoder('utf-8');
    const payload = decoder.decode(data.data);
    console.log(`received UDP data: ${payload}`);
});

chrome.sockets.udp.onReceiveError.addListener((data) => {
    console.log('received UDP error');
    console.log(data);
});
