
//js som alla sidor ska ha för när man trcyker på login eller logga ut icon (i admin)

document.addEventListener('DOMContentLoaded', ()=>{
    let token= localStorage.getItem('AccessToken')
    let userId= localStorage.getItem('userId')
    function loggaut(){
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('RefreshToken')
        localStorage.removeItem('loggedIn')
        localStorage.removeItem('isAdmin')
    }

    let loggautBtns= document.querySelectorAll('.loggautBtn')
    loggautBtns.forEach((btn)=>{
        if(!token || !userId){
            btn.textContent='Login'
        }else{
            btn.textContent='Log out'
        }
        btn.addEventListener('click', loggaut)
    })


    let profileBtns= document.querySelectorAll('.profilBtn')
    profileBtns.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            if(!token || !userId){
            window.location.href='register.html'
            }else if(token && userId){
                window.location.href=`customerprofile.html?id=${userId}`
            }else{
                alert('Cannot redirect')
            }
        })
    })
})