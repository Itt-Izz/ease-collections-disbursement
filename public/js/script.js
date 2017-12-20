(() => {
    /**
     * 
     * check url for any matching params
     * @param {string} credentials_phone_access
     */
    let url = window.location.href
    let span = document.querySelector('._notifs small')
    if (url.indexOf("empty-query") != -1) {
        span.innerHTML = 'Merchant code not found or empty'
    } else if (url.indexOf("auth-failed") != -1) {
        span.innerHTML = 'Authentication failed'
    }

})()