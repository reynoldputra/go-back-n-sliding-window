const net = require('net');

const server = net.createServer((socket) => {
  console.log('Server connected');
  let err = -1

  socket.on('data', (data) => {
    const packets = data.toString().split(":") 
    packets.pop()

    for(let idx in packets) {
      const p = packets[idx]
      if(err == -1) {
        if(Math.random() < 0.2) {
          console.log("Error response data " + p)
          err = parseInt(p)
          continue
        }
        console.log(`Received packet ${p}`);
        socket.write(`${p}:`);
        console.log(`Send ack ${p}`);
      } else {
        if(parseInt(p) == err) {
          console.log(`Received packet ${p}`);
          socket.write(`${p}:`);
          console.log(`Send ack ${p}`);
          err = -1
        } else {
          console.log("Discarded " + p)
        }
      }
    }
  });

  socket.on('end', () => {
    console.log('Server disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

