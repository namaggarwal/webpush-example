const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const webpush = require('web-push');


webpush.setVapidDetails(
  'mailto:web-push-book@gauntface.com',
  'BEBIPpr427Qo-uGG0jus7sdZ7Wb4IiSY-L823PAWMT8_cp9TQe2wpJba-SOmQNNrmQIpshuhSzO3rarJEEksMwo',
  '20X7Pf-TN2vgacSwx-iGOVqonm1W5qcAqCdUpCNHzxs'
);

// const subscription = {
//   endpoint: 'https://fcm.googleapis.com/fcm/send/eB5wAw42QkQ:APA91bGJ8vtHIwAfcyrSGz3Kcb_4k_PZFMSd2CQREr_LD8TCNydguW-Sw5bkyTaQZI5tyWVRjyjLZZquloCJzPvDfGzkxlmfRuMDWiKF7yO52xgx1elpV-XKiYXQQHVizNO8h19zvhIz',
//   expirationTime: null,
//   keys:
//   {
//     p256dh: 'BPtV8NcXeH7f51ydLum52fQ8sGQm1r0xSHMhZRL0kX4-0bTTAudAMzGyU3cswO0EzXjyHHRbuRRj2f-KyqlehPY',
//     auth: 'TkDvuwD8D3s-tL7z0I-mVg'
//   }
// };

const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/eB5wAw42QkQ:APA91bGJ8vtHIwAfcyrSGz3Kcb_4k_PZFMSd2CQREr_LD8TCNydguW-Sw5bkyTaQZI5tyWVRjyjLZZquloCJzPvDfGzkxlmfRuMDWiKF7yO52xgx1elpV-XKiYXQQHVizNO8h19zvhIz',
  expirationTime: null,
  keys:
  {
    p256dh: 'BPtV8NcXeH7f51ydLum52fQ8sGQm1r0xSHMhZRL0kX4-0bTTAudAMzGyU3cswO0EzXjyHHRbuRRj2f-KyqlehPY',
    auth: 'TkDvuwD8D3s-tL7z0I-mVg'
  }
}


app.use(express.static('public'))
app.use(bodyParser.json());

app.post('/api/save-credentials', (req, res) => {
  console.log(req.body);
  res.statusCode = 201;
  res.end();
});

app.post('/api/trigger', (req, res) => {
  webpush.sendNotification(subscription, JSON.stringify(req.body))
    .catch((err) => {
      console.log(err)
    });
  res.statusCode = 201;
  res.end();
});


app.listen(port, () => console.log(`WebPush app listening on port ${port}!`))