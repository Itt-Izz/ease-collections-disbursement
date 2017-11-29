/**
 * admin authentication and communication to the server
 */
(() => {
    document.forms['auth_form'].onsubmit = function(e) {
        e.preventDefault();
        let credObj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y
        })));
        /*
         * submit cred and request authorization
         */
        fetch('/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credObj)
            })
            .then(res => res.json())
            .then(data => {
                if (data.message == 'authenticated') {
                    location.href = '/admin/auth/dashboard'
                } else {
                    console.log('failed');
                }
            })
    }
})();