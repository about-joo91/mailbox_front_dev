// Register event listener for the 'push' event.

self.addEventListener('load', function (event) {
    console.log("야발")
    // Retrieve the textual payload from event.data (a PushMessageData object).
    // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
    // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const head = data.head;
    console.log(data)
    const body = data.body;
    const icon = data.icon;

    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        self.registration.showNotification(head, {
            body: body,
            icon: icon
        })
    );
});