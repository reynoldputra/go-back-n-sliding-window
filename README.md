# go-back-n-sliding-window
Assigment Data Communication and Computer Network Class

Go-Back-N (GBN) is an automatic repeat request (ARQ) protocol used in data communication. It is a sliding window protocol that allows for multiple frames to be in transit simultaneously. The "sliding window" refers to the range of sequence numbers that a sender can send without waiting for an acknowledgment.

![image](https://github.com/reynoldputra/go-back-n-sliding-window/assets/87769109/9caf8bce-e3fc-4bd3-89d8-699c4513fa95)


## Details
- I create two javascript program that communicate using socket programming
- Client.js as message sender
- Server.js as message receiver
- After message received by server, then server will send back acknowledge message to client
- If the client does not receive a message during the time out then the message sent afterward will be discarded and then repeated in the current window

![image](https://github.com/reynoldputra/go-back-n-sliding-window/assets/87769109/9fa94848-ed5d-4be1-992b-f1ffa19bdf11)
