/**
Step 1
Pehle Problem Samjho
Chal ek real scenario soch--
Tujhe ek WhatsApp jaisi chat app banani hai.
Aur abhi tujhe sirf HTTp pata hai(request->response).
soch-- message receive karne ke liye kya karega?
optionA:: Har 1 second mein server se poochhunga -- "koi naya message aaya?"
optionB:: Server khud mujhe bata de jab message aaye.

Option A ko "Polling" kehte hain. Yahi sab log pehle karte the.
Problem kya hai polling mein?
1000 users*har second ek request = 1000 requests/second -- sirf "koi message aaya?" poochhne ke liye
99% requests ka jawab hoga — "nahi aaya kuch"
Bandwidth waste, server pe load, battery drain

Step 2 — WebSocket kya hai?
WebSocket ek permanent, two-way connection hai client aur server ke beech.

HTTP mein:
Client: "Bhai koi message?"  →→→  Server
Client: "Bhai koi message?"  ←←←  Server: "Nahi"
Client: "Bhai koi message?"  →→→  Server
(har baar naya connection)

WebSocket mein:
Client ←————— permanent line —————→ Server

Server: "Tera message aaya!" (jab bhi aaye)
Server: "Aur ek aaya!"
Client: "Maine reply kiya"
(ek hi connection, dono side se kab bhi bol sakte hain)

Step 3 — Technically Kaise Kaam Karta Hai?
WebSocket connection 3 steps mein hota hai:
Step 1 — HTTP se hi shuru hota hai (Handshake)
Client → Server:
GET /chat HTTP/1.1
Upgrade: websocket          ← "Bhai, connection upgrade kar"
Connection: Upgrade
Sec-WebSocket-Key: xyz123

Step 2 — Server agree karta hai
Server → Client:
HTTP/1.1 101 Switching Protocols   ← "Haan bhai, theek hai"
Upgrade: websocket
Connection: Upgrade

Step 3 — Ab dono freely baat karte hain
Connection open hai permanently.
Dono side se kab bhi data bhej sakte hain.
Koi naya request nahi, koi naya connection nahi.
 */
// Server.js
const WebSocket = required('ws');
const wss = new WebSocket.Server({port:8080});
wss.on('connection',(ws)=>{
  console.log('Naya client connected!');
  // Client ne kuch bheja
  ws.on('message',(message)=>{
    console.log("Aaya:", message);
    // sab connected clients ko bhejo (broadcast)
    wss.clients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN){
        client.send(message.toString());
      }
    });
  });

  ws.on('close',()=>{
    console.log('Client disconnect ho gaya');
  })
})

// client side (browser)
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () =>{
  console.log('Connected!');
  ws.send('Hello server!');
};
ws.onmessage = (event)=>{
  console.log('Server ne bheja:', event.data);
};
ws.onclose = () => {
  console.log('Connection band ho gayi');
};

/**
 Sert 5 -- Http vs WebSocket
           HTTP                      WebSocket
Connection  Harrequest pe naya       Ek baar permanent 
Direction   Client → Server sirf     Dono side se
Speed       Slow (overhead zyada)    Fast
Use case     REST API, webpage load  Chat, live score, trading


Socket.io -- WebSocket ka powerFull Version h
Raw WebSocket mein problems hain:

Agar client ka browser WebSocket support nahi karta? ❌
Connection toot jaaye toh? Auto-reconnect nahi hota ❌
Alag alag "rooms" banana ho (jaise WhatsApp groups)? ❌
Socket.io yahi sab handle karta hai automatically.
 */
// server
const io = required('socket.io')(server);
io.on('connection',(socket)=>{
  console.Console.log('User connected:', socket.id);

  socket.on('message',(data)=>{
    io.emit('message',data);
  });
});

// client
const socket = io('http://localhost:3000');
socket.emit('message',"hello!");
socket.on('message',(data)=>{
  console.log(data);
});

/**
Socket.io kya hai?
Socket.io = WebSocket+Extra Feaatures
Bas itna hi hai. WebSocket ek bare metal tool hai. Socket.io uske uper ek wrapper hai jo life easy banata hai.

Real life analogy:
WebSocket = Kaccha road — kaam chalta hai, lekin pothole hain

Socket.io = Highway — same destination, but smooth, fast, safe
Kya Extra Milta Hai Socket.io Mein?
Problem (Raw WebSocket mein)                Socket.io mein 
1. Connection toot gayi?                    Auto-reconnect Khud handle karo                                 khud jud jaata hai
  
2.Browser support nahi?                    Fallback-HTTP use karta 
App toot jaayega                           hai automatically

3.Sirf ek group mein bhejni                Rooms--built-in group 
hai message? Khud logic likho              system

4.Specific user ko bhejni hai?               socket.id -- har user 
Khud track karo                               ka unique ID

Ek Example -- Farak Dekhte Hain
Row WebSocket mein sirf ek room ko message bhejnaa:
*/
// Khud track karna padega kaun kis room mein hai
const rooms = {};
ws.on('message',(data)=>{
  const {room,message} = JSON.parse(data);
  // Manually dhundho room ke sab users
  rooms[room].forEach(client=>{
    client.send(message); //Manually bhejo
  });
});

// Socket.io mein same kaam
io.to('roomName').emit('message','Hello room!');
/**
 Socket.io ne sab boilerplate chhupaaya hai ander - tujhe sirf business logic likhna hai.

 Socket.io ke 4 Core Concepts
 Concept1. emit(Message Bhejna)
 emit--bhejo

 socket.emit('event',data) //shirf ek ko bhejo
 io.emit('event',data) //Sabko bhejo

 Concept 2 — Rooms (Groups)
 Room = WhatsApp Group jaisa
//  User ko room mein daalo
socket.join('cricket-room');
// us room ke sirf logon ko bhejo
io.to('cricket-room').emit('message','India ne wicket li!');
// Room chhodo
socket.leave('cricket-room');

Ek user multiple rooms mein bhi ho sakta hai -- jaise tu whatsApp pe multiple groups mein hota hai.

Concept 3 — socket.id (Specific User)
Har connected user ka ek unique ID hota hai automatically
io.on('connection',(socket)=>{
  console.log(socket.id); //"xK92mNpQ3r..." jaisa kuch
  io.to(socket.id).emit('message','Sirf tujhe bheja!');
  });

Concept 4 — Broadcast
"Mere aalaava sabko bhejo"
socket.broadcast.emit('message','Naya user aaya!');
// Jo message bhej raha hai usse CHHOD KAR baaki sabko jaayega

Ab Teeno Scenarios Clear Karte Hain
WhatsApp Individual Chat (2 log)
io.to(receiverSocketId).emit('message',"Hello!");

WhatsApp Group Chat
Group join karo
socket.join('group-123');
// group ke sabko bhejo
io.to('group-123').emit('message','Group mein aaya!');

Broadcast (Sabko)
// Literally sabko
io.emit('message',"App update aa gaya!");

Poora Flow Ek Baar Dekho
socket.id      →  Specific ek user ko
socket.broadcast →  Mere alawa sab ko 
io.to(room)    →  Ek group ko
io.emit        →  Sabko

emit=bhejo
bas itna hi hai. Koi bhi data bhejni ho - emit kar do.
socket.emit('event-name',data);
//         kya hua?      kya bheja?
Real Example:
socket.emit('message','Hello!');
socket.emit('message',{text:'Hello',from:"Ritu"});
socket.emit('user-joined',{name:'Ritu',time:'10:30'})


Q1.socket.emit('message','hello World');
Yahan 'message' kya hai aur 'Hello World' kya hai?
Ans: message event name h or hello World data h.

Q2.socket.emit('user-joined',{name:'Rahul',age:22});
Yahan event name kya hai aur data kya hai?
Ans:esme event user-joined and data h { name: 'Rahul', age: 22 }

Q3."Ritu ne login kiya" — yeh event emit karna hai, data mein naam aur city bhejna hai.
socket.emit('login',{name:"Ritu",city:"Surat"})

Q4.socket.emit('login', { username: 'Aryan' });
Yeh line client side pe likhenge ya server side pe?
Ans: Client par
 */

