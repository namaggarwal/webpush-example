
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (reg) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', reg.scope);
      askPermission();
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
      subscribeUserToPush()
      .then((sub) => {
        if(sub) {
          sendSubscription(sub);
        }
      });
    });
}

function subscribeUserToPush() {
  //or use the registration above
  return navigator.serviceWorker.register('service-worker.js')
    .then(function (registration) {
      const subscribeOptions = {
        //it has to be true
        userVisibleOnly: true,
        //npx web-push generate-vapid-keys
        // required for chrome / optional for firefox
        applicationServerKey: urlBase64ToUint8Array(
          'BEBIPpr427Qo-uGG0jus7sdZ7Wb4IiSY-L823PAWMT8_cp9TQe2wpJba-SOmQNNrmQIpshuhSzO3rarJEEksMwo'
        )
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription;
    });
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')
    ;
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function sendSubscription(pushSubscription) {
  fetch('/api/save-credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pushSubscription)
  })
    .then((response) => {
      if (response.status === 201) {
        console.log('Subscription sent to server successfully');
      }else{
        throw new Error('Error sending subscription to server');
      }

    }).catch((err) => {
      console.log('Error sending subscription to server ' + err);
    });
}

function attachListener(){
 document.getElementById('btnSend').addEventListener('click', onButtonClick);
}

(function(){
  attachListener();
})();

function onButtonClick() {
  const textBox = document.getElementById('txtNotification');
   fetch('/api/trigger', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: textBox.value,
  })
    .then((response) => {
      if (response.status === 201) {
        console.log('Trigger sent to server successfully');
      }else{
        throw new Error('Error sending subscription to server');
      }

    }).catch((err) => {
      console.log('Error sending subscription to server ' + err);
    });
}