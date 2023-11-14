const fs = require('fs')
const net = require('net');

const client = new net.Socket();
client.readableHighWaterMark


client.connect(3001, 'localhost', () => {
  let timeoutId;
  let TIMEOUT = 2000;
  let N = 4;
  let _window = [];
  const filePath = './test.txt';

  const binary = Buffer.from(fs.readFileSync(filePath), 'base64');

  let ranges = [];

  for (let i = 0; i < binary.length; i++) {
    ranges.push(`${i + 1}:${binary.slice(i, i + 4)};`)
  }

  function sendWindowPacket() {
    if (!ranges.length) {
      clearTimeout(timeoutId)
      client.end()
      return
    }

    while (_window.length < N && ranges.length) {
      _window.push(ranges.shift())
    }

    const msg = _window.map(p => {
      const payload = p + ":"
      console.log("Sending " + p)
      return payload
    })

    client.write(msg.join(""))
  }

  function sendPacket(p) {
    client.write(p.toString() + ":")
  }

  client.on('data', (data) => {
    timeoutId = setTimeout(() => {
      console.log("Timeout, retransmitting...");
      sendWindowPacket()
    }, TIMEOUT);

    const acks = data.toString().split(":")
    acks.pop()
    acks.forEach((ack) => {
      console.log(_window, ack)
      if (ack == _window[0]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          console.log("Timeout, retransmitting...");
          sendWindowPacket()
        }, TIMEOUT);
        console.log("ack success " + _window[0])
        _window.shift()
        if (ranges.length) {
          const p = ranges.shift()
          _window.push(p)
          sendPacket(p)
        } else {
          clearTimeout(timeoutId)
        }
      } else {
        console.log("ack error " + _window[0])
      }
    })
  });

  sendWindowPacket();
});

client.on('close', () => {
  console.log('Client disconnected');
});

function range(start, end) {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }

  return ans;
}

