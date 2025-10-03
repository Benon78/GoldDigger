
const statusEl = document.getElementById('connection-status')
const priceDisplay = document.getElementById('price-display')
const investBtn = document.getElementById('invest-btn')
const investmentValue = document.getElementById('investment-amount')
const dialog = document.querySelector("dialog");
const summaryText = document.getElementById("investment-summary");
const closeBtn = dialog.querySelector("button");

let newGoldPrice = null;

const eventSource = new EventSource('/events')
eventSource.onmessage = function(event){
    const data = JSON.parse(event.data)
    if(data.online){
        statusEl.textContent = 'Live Price 🟢'
        priceDisplay.textContent = data.goldPrice
        newGoldPrice = data.goldPrice
    }else{
        statusEl.textContent = 'Disconnected 🔴'
        priceDisplay.textContent = '----.--'
    }
}

investBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const amount = parseFloat(investmentValue.value)
    const timeStamp = new Date().toISOString()

    if(investmentValue.value === '') return
    if(isNaN(amount) || amount <= 0 ){
        alert('Please enter a valid amount')
        investmentValue.value = ""
        return
    }
    
    // calculate the ounces
    const goldSold = amount / newGoldPrice

    const data = {
        timeStamp,
        amountPaid: amount,
        pricePerOz: newGoldPrice,
        goldSold: goldSold.toFixed(2),
        email: 'benjaminadina82@gmail.com'
    }

    try {
        const res = await fetch('/api/purchase',{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })

        const result = await res.json()

        if(result.success){
            summaryText.textContent = `You just bought ${goldSold.toFixed(2)} ounces (ozt) for £${amount.toFixed(2)}. \n You will receive documentation shortly.`
            dialog.showModal();
        }
        else{
            alert('Purchase failed. Try again!')
        }
        
    } catch (error) {
        console.error(error)
    }

    // dialog.showModal()
})

closeBtn.onclick = () => {
    dialog.close()
    investmentValue.value = ''
}