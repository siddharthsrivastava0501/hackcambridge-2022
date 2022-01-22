navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'})
    const socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', 
    '8ab30cfaef2caa33afda2dfe260d35fb86b17952'])

    socket.onopen = () => {
        mediaRecorder.addEventListener('dataavailable', event => {
            socket.send(event.data)
        })

        mediaRecorder.start(250)
    }

    socket.onmessage = message => {
        const data = JSON.parse(message.data)
        const transcript = data.channel.alternatives[0].transcript
        if (transcript && data.is_final) {
            document.querySelector('p').textContent += ' ' + transcript
        } 
    }
})