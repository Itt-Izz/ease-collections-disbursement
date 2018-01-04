/**
 * admin authentication and communication to the server
 */
(() => {
    let logForm = document.forms['auth_form']

    // request server for admin details
    fetch(`/admin/auth/checkAdmin`)
        .then(res => res.json())
        .then(data => {
            if (data.message == 'set_admin') {
                // popop admin set details form
                let fd = document.createElement('div');
                // style fDiv
                Object.assign(fd.style, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    'background-color': 'rgba(0,0,0,0.5)',
                    'z-index': '999',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                })

                // create form
                let sf = document.createElement('form')
                sf.setAttribute('name', 'setAdminDetails')
                sf.setAttribute('id', 'setAdminForm')
                sf.classList.add('card')
                Object.assign(sf.style, {
                    width: (document.body.clientWidth) < 720 ? '90%' : '500px',
                    padding: '20px'
                })
                let sm = document.createElement('small')
                sm.innerText = 'Admin details not set yet!'
                sm.classList.add('alert', 'alert-danger')
                sf.appendChild(sm)

                let i = document.createElement('small')
                i.style.paddingBottom = '10px'
                i.innerText = 'Ensure you have access to your phone and email address. Authentication code and password will be sent to credentials provided.'
                sf.appendChild(i)

                function crInputElem(icon, type, name, plc, req) {
                    let ad = document.createElement('div')
                    ad.classList.add('form-group')
                    let bd = document.createElement('div')
                    bd.classList.add('input-group')
                    let sp = document.createElement('span')
                    sp.classList.add('input-group-addon')
                    let is = document.createElement('span')
                    is.classList.add('mdi', icon)
                    sp.appendChild(is)
                    let i = document.createElement('input')
                    i.classList.add('form-control', 'form-control-sm')
                    i.setAttribute('type', type)
                    i.setAttribute('name', name)
                    i.setAttribute('placeholder', plc)
                    i.setAttribute('required', req)
                    bd.appendChild(sp)
                    bd.appendChild(i)
                    ad.appendChild(bd)
                    sf.appendChild(ad)
                }
                crInputElem('mdi-phone', 'tel', 'adminPhone', 'Phone number', true)
                crInputElem('mdi-gmail', 'email', 'adminEmail', 'Email address e.g. someone@example.com', true)

                let b = document.createElement('button')
                b.classList.add('btn', 'btn-info')
                b.setAttribute('type', 'submit')
                let bt = document.createTextNode('Save admin info')
                let bs = document.createElement('span')
                bs.classList.add('mdi', 'mdi-content-save')
                bs.style.paddingLeft = '10px'
                b.appendChild(bt)
                b.appendChild(bs)
                sf.appendChild(b)

                // append main form container
                fd.appendChild(sf)
                document.getElementById('body').appendChild(fd)
                setAdmin()
            }
        })

    function setAdmin() {
        let admForm = document.getElementById('setAdminForm')
        admForm.addEventListener('submit', function(e) {
            e = e || window.event
            e.preventDefault()
            let admDetails = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
                [x]: y.trim()
            })))
            fetch('/admin/auth/initiateAdmin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(admDetails)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.message == 'successfull') {
                        alert('You will receive code and password to login.')
                        location.reload()
                    } else if (data.message == 'network_problem') {
                        alert('Your internet connection is down.Try again!')
                    } else if (data.message == 'failed') {
                        alert('Server error! Contact the developer.')
                    }
                })
                .catch(err => {
                    console.log(new Error(err))
                })
        })
    }

    // admin authentication form
    logForm.onsubmit = function(e) {
        e.preventDefault()
        let credObj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y
        })))
        fetch('/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credObj)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.message == 'authenticated') {
                    // set cookies here
                    function setCookie(cname, cvalue, duration = 0) {
                        var d = new Date()
                        d.setTime(d.getTime() + (duration * 60 * 60))
                        var expires = "expires=" + d.toUTCString()
                        document.cookie = cname + "=" + cvalue + ";" + ";path=/"
                        return
                    }
                    var _encCode = window.btoa(data.credentials.params.admin.code)
                    var _encEmail = window.btoa(data.credentials.params.admin.email)
                    var _encPhone = window.btoa(data.credentials.params.admin.phone)
                    setCookie("i6udhcd", _encCode, 10)
                    setCookie("i7udhem", _encEmail, 10)
                    setCookie("i8udhph", _encPhone, 10)

                    // redirect
                    location.href = '/admin/auth/dashboard'
                } else if (data.message == 'unauthorized') {
                    history.pushState(null, 'Password mismatch', '?wrong-password')
                } else if (data.message == 'mismatch') {
                    history.pushState(null, 'Both code and password mismatch', '?wrong-credentials')
                }
            })
    }
})();