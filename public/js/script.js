(() => {
    /**
     * 
     * check url for any matching params
     * @param {string} credentials_phone_access
     */

    let span = document.querySelector('._notifs small')
    let _lForm = document.querySelector('form#auth_form')
    _lForm.addEventListener('submit', function(e) {
        e.preventDefault()
        let _formObj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y.trim()
        })))
        fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(_formObj)
            })
            .then(res => res.json())
            .then(data => {
                // set cookies here
                function setCookie(cname, cvalue, exdays) {
                    var d = new Date()
                    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
                    var expires = "expires=" + d.toUTCString()
                    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
                }
                var _encCode = window.btoa(data.credentials.params.merchant.merchant_code)
                var _encName = window.btoa(data.credentials.params.merchant.merchant_name)
                var _encPhone = window.btoa(data.credentials.params.merchant.merch_phone)

                setCookie("i3udhw8", _encCode, 0.5)
                setCookie("i4udhsy", _encName, 0.5)
                setCookie("i5udhwrs", _encPhone, 0.5)

                if (data.message == 'authorized') {
                    history.replaceState(null, "Authentication successfull", "?redirecting.......")
                    window.location.href = '/auth/dashboard'
                }
                if (data.message == 'unauthorized') {
                    history.replaceState(null, "Authentication failed", "?wrong-supplied-credentials")
                    span.innerHTML = 'Authentication failed'
                }
                if (data.message == 'empty_query') {
                    history.replaceState(null, "Empty or wrong merchant code", "?empty-or-wrong-code")
                    span.innerHTML = 'Merchant code not found or empty'
                }
            })
    })

    // end of login and set cookies

})()