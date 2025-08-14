const net = require('net');
const fs = require('fs')

const server = net.createServer((socket) => {
  console.log('Server connected');
  let err = -1

  let result = ""

  socket.on('data', (data) => {
    const packets = data.toString().split(";") 
    packets.pop()

    for(let idx in packets) {
      const p = packets[idx].split(":")


      if(err == -1) {
        if(p[0] == "%%EOF") {
          console.log(result)
          const buffer = Buffer.from(result, 'hex');
          console.log(buffer)
          fs.writeFileSync("./res.txt", buffer);
          break;
        }
        if(Math.random() < 0.2) {
          console.log("Packet loss",  p[0])
          err = parseInt(p[0])
          continue
        }
        console.log(`Received packet`, p);
        socket.write(`${p[0]};`);
        console.log(`Send ack`, p);
        result += p[1] ?? ""
      } else {
        if(parseInt(p) == err) {
          console.log(`Received packet`, p);
          socket.write(`${p[0]};`);
          console.log(`Send ack`, p);
          result += p[1] ?? ""
          err = -1
        } else {
          console.log("Discarded ", p)
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

