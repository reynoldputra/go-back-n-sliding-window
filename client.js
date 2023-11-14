const net = require('net');
const fs = require('fs')

const client = new net.Socket();

const hexBuffer = Buffer.from(fs.readFileSync("./test.txt")).toString('hex')

client.connect(3000, 'localhost', () => {
  console.log('Client connected');

  let timeoutId 
  let N = 4;
  let TIMEOUT = 2000;
  const ranges = splitString(hexBuffer, 4)
  let _window = []

  console.log(hexBuffer);

  function resetTimeout(){
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      console.log("Timeout, retransmitting...");
      sendWindowPacket()
    }, TIMEOUT);
  }

  function sendWindowPacket() {
    if(!ranges.length) {
      sendPacket("%%EOF;")
      clearTimeout(timeoutId)
      client.end()
      return
    }

    while(_window.length < N && ranges.length){
      _window.push(ranges.shift())
    }

    const msg = _window.map(p => {
      const payload = p.index + ":" + p.string + ";"
      console.log("Sending" , p)
      return payload
    })

    console.log(msg.join(""))

    client.write(msg.join(""))

    resetTimeout()
  }

  function sendPacket (p) {
    const payload = p.index + ":" + p.string + ";"
    client.write(payload)
    resetTimeout()
  }

  client.on('data', (data) => {
    const acks = data.toString().split(";")
    acks.pop()
    acks.forEach((ack) => {
      console.log(_window, ack)
      if(ack == _window[0].index) {
        resetTimeout()
        console.log("ack success", _window[0])
        _window.shift()
        if(ranges.length) {
          const p = ranges.shift()
          _window.push(p)
          sendPacket(p)
        } else {
          client.write("%%EOF;")
          clearTimeout(timeoutId)
          client.end()
        }
      } else {
        console.log("ack error ", _window[0])
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

function splitString(str, chunkSize) {
  var result = [];
  let j = 0;
  for (var i = 0; i < str.length; i += chunkSize) {
    result.push({index : j, string : str.slice(i, i + chunkSize)});
    j++
  }
  return result;
}
