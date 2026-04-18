
let submitC= document.querySelector('.submitContact')

let forum=[]

submitC.addEventListener('click', () => {
    let namnC= document.querySelector('.nameContact')
    let emailC= document.querySelector('.emailContact')
    let commC=document.querySelector('.textarea')
    const namn = namnC.value.trim()
    const email = emailC.value.trim()
    const comm = commC.value.trim()
    if (namn === '' || email === '' || comm === '') {
        alert('Make sure you entered the correct values!')
        return
    }
    let asker = {
        namn:namnC.value,
        email:emailC.value,
        comm:commC.value
    }
    forum.push(asker)
    console.log(asker)
    console.log(forum)
    namnC.value = ''
    emailC.value = ''
    commC.value = ''
    let myEmail='eventra.grupp3.support@gmail.com'
    const subject = encodeURIComponent(`${asker.namn} has a question:`)
    const body = encodeURIComponent(`Name: ${asker.namn}\nYour email: ${asker.email}\nComment: ${asker.comm}`)
    window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent)
    if (isMobile){
        alert('If your email app does not open, please copy the message and send it manually.')
    }
    window.location.href = mailtoLink
})