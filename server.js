const fs = require('fs');
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Server connected');
  let err = -1
  //nyimpan semua buffers
  var buffers = [];

  socket.on('data', (data) => {
    const packets = data.toString().split(":")
    packets.pop();

    for (let idx in packets) {
      const p = packets[idx]
      if (err == -1) {
        if (Math.random() < 0.2) {
          console.log("Error response data " + p)
          err = parseInt(p)
          continue
        }
        console.log(`Received packet ${p}`);
        socket.write(`${p}:`);
        buffers.push(p)
        console.log(`Send ack ${p}`);
      } else {
        if (parseInt(p) == err) {
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
    // write to file
    // buffers.join()
    // const decodedString = buffers.toString('utf-8');
    // fs.writeFile('server.txt', decodedString, (err) => {
    //   if (err) {
    //     console.error('Error writing to file:', err);
    //   } else {
    //     console.log('File written successfully.');
    //   }
    // });
    console.log('Server disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});

