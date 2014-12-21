# FAPush

This Firefox addon-sdk module implements a [https://wiki.mozilla.org/WebAPI/SimplePush/Protocol](SimplePush) client to allow 
receiving asynchronous push notifications.

## Installation

Simply copy `push.js` into the `./lib` directory of your addon

## Usage

The FAPush API is very similar to the [navigator.push](https://developer.mozilla.org/en-US/docs/Web/API/PushManager) API, with
a few differences:

- the service is obtained with `var push = require('./fapush.js')` instead of `var push = window.navigator.push`
- the service does not start automatically and must be launch using the `init(...)` method
- notifications are received in a callback passed to the `init(...)` method

### init([options])

`options` is an object that may hold the following members:

- `onmessage`: a callback function receiving 2 parameters:
	+ `type`: either 
		. `'push'`: regular push notification message  
		. or `'push-register'`: the client must re-register notifications
	+ `message`: the message content. If `type` is `'push'`, `message` contains `pushEndpoint` and `version`.

- `serverUrl`: the push server to connect to defaults to `'wss://push.services.mozilla.com'`
- `retryTimeout`: time before reconnecting to the push server in case the web socket closes (default `10000`, 10 seconds)
- `usePing`: keep alive using ping messages (default `false`, should be `true` according to SimplePush specs, but the current 
Mozilla push server doesn't seem to answer to pings)
- `pingTimeout`: time of inactivity before sending a ping message to the server (default `1800000`, 30 minutes)
- `pongTimeout`: time to expect answer to ping (default `10000`, 10 seconds)


## Example

```
var push = require('fapush.js');
var endpoint = null;
push.init({
  onmessage: function(type, message) {
    if(type=='push' && message.pushEndpoint==endpoint) {
      // do something with the notification like asking your server what the notification is about
      // and take appropriate action
    } else if(type=='push-register') // the server has forgotten us, we need to re-register
      RegisterPush();
  }
});

function RegisterPush() {
  var req = push.register();
  req.onsuccess = function(e) {
    endpoint = e.target.result;
    // tell out app server about the endpoint to be used to notify this client
  }
  req.onerror = function(err) {
    console.warn("Something went wrong",err);
  }
}

var req = push.notifications();
req.onsuccess = function(e) {
  var regs = e.target.result;
  if(regs.length==0)
  	RegisterPush();
  else {
    endpoint = regs[0].pushEndpoint;
    // we keep it simple here and only use one notification channel
    // so we unregister other existing channels (unlikely to exist with this sample code)
    for(var i=1;i<regs.length;i++)
      push.unregister(regs[i].pushEndpoint); 
  }
}
req.onerror = function(err) {
  console.warn("Something went wrong",err);
}
```

## License

This module is released under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/)

## Authors

Original author: Michel Gutierrez (mig@downloadhelper.net)


