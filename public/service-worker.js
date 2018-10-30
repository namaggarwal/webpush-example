// self.addEventListener('push', function(event) {
//   if (event.data) {
//     console.log('This push event has data: ', event.data.text());
//   } else {
//     console.log('This push event has no data.');
//   }
// });

// self.addEventListener('push', function(event) {
//   const promiseChain = self.registration.showNotification('Hello, World.');
//   event.waitUntil(promiseChain); //Wait so browser does not terminate this s/w
// });

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const promiseChain = self.registration.showNotification(data.title, {
      body: data.message,
    });
    event.waitUntil(promiseChain); //If promise chain throws error and showNotification is not called, browser shows default notification
  } else {
    console.log('This push event has no data.');
  }
});
