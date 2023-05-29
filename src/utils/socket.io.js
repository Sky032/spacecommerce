import MessageModel from '../dao/mongo/models/message.model.js';


export default (io) => {
    let messages = [];
    io.on('connection', async(socket) => {
        console.log(`New client connected, ID:`, socket.id);
    
        socket.on('message', data => {
            console.log(`From index.js:`, data);
        })
    
        socket.emit('message', `Esto viene desde app.js`);
    
        // Escucha los mensajes de un user
        socket.on('message', data => {
            messages.push(data) // Guardamos el mensaje
            const saveMessage = MessageModel(data);
            saveMessage.save();
    
            // Emitimos el mensaje para los demas
            io.emit('messageLogs', messages)
        });
    })

}
