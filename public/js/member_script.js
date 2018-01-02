(() => {
    /*
     * Author: Danny Sofftie
     * Date: Oct 26 2017
     * Handle member registration and phone number verification
     */

    let m = document.querySelector('form#add_members')
    let btnGrant = document.getElementById('grantbtn')

    let _b = m.querySelector('button')
    let _i = m.querySelector('input#id_number')
    let _p = m.querySelector('input#phone')

    let regInfo = document.getElementById('regInfo')
    let phoneMap = new Map()

    let pop = document.querySelector('div.__popover')

    let aCont = document.getElementById('res_auth_cont')
    let app_m = document.querySelector('form#app_m')
    let res_auth = app_m.querySelector('button#res_auth')

    let authForm = document.getElementById('grantAccess')

    fetch('/data/get_regions')
        .then((res) => res.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                m.region_code.append(new Option(data[i].region_name, data[i].id))
            }
        })

    _i.onkeyup = () => {
        if (_i.value.trim().length < 6 || _i.value.trim().length > 8) {
            _i.classList.add('is-invalid')
            _b.disabled = true
        } else {
            _i.classList.remove('is-invalid')
            _b.disabled = false
        }
    }
    _p.onkeyup = () => {
        if (_p.value.trim().length != 10) {
            _p.classList.add('is-invalid')
            _b.disabled = true
        } else {
            _p.classList.remove('is-invalid')
            _b.disabled = false
        }
    }

    // request membership
    m.addEventListener('submit', function(e) {
        e.preventDefault()
        let _j = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y
        })))
        phoneMap.set('phone', `${_j.phone}`)

        fetch('/auth/request_membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(_j)
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.message == 'registered') {
                    regInfo.innerText = 'Success. Verify to approve phone number';
                    // approve membership
                    btnGrant.click()
                } else if (data.message == 'in_records') {
                    regInfo.innerText = 'User exists in records'
                } else if (data.message == 'network_problem') {
                    regInfo.innerText = 'Could not send verification code, resend.';
                    // resend auth code for phone verification
                    aCont.style.display = 'block'
                }
            })
    })

    res_auth.addEventListener('click', function(e) {
        fetch('/auth/res_auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'phone': phoneMap.get('phone') })
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
            })
    })

    // display popover for auth code verification
    btnGrant.addEventListener('click', function(e) {
        e = e || window.event

        authForm.querySelector('input#phoneNumber').value = phoneMap.get('phone')
        authForm.querySelector('input#accessCode').focus()
        Object.assign(pop.style, {
            display: 'block',
            position: 'fixed',
            'margin-top': '30px',
            top: e.clientY + 'px',
            left: (document.body.clientWidth - e.clientX) > 170 ?
                e.clientX + 'px' : '87.6%'
        })
    })

    authForm.addEventListener('submit', function(e) {
        e.preventDefault()
        let obj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y.trim()
        })))
        console.log(obj)
    })

})()