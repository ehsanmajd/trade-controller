import React, { useEffect } from 'react';

const WS: React.FC = () => {

  useEffect(
    () => {
      var ws = new WebSocket('https://mybasket.trade/socket?basketId=123456');

      ws.onopen = function () {
        console.log('websocket is connected ...')
        ws.send('connected')
      }

      ws.onmessage = function (ev) {
        console.log(ev);
      }
    },
    []
  )

  return (
    <div>connecting...</div>
  )
}

export default WS;