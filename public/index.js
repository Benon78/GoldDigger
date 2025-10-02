
const statusEl = document.getElementById('connection-status')

const eventSource = new EventSource('/events')
eventSource.onmessage = function(event){
    const data = JSON.parse(event.data)
    if(data.online){
        statusEl.textContent = 'Live Price 🟢'
    }else{
        statusEl.textContent = 'Disconnected 🔴'
    }
}