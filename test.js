async function openCLientConnection(channelName, readerUuid) {
    const pathToSocket= socketPath(channelName, readerUuid);
    const client= new net.Socket(); //object
    return new Promise((res, rej)=> {
        client.connect(pathToSocket,
            ()=>res(client)
    );
    client.on('error', err=>rej(err));

}
