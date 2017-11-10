/**
 * admin authentication and communication to the server
 */
(() => {
    document.forms['auth_form'].onsubmit = function(e) {
        e.preventDefault();
        let cred = new FormData(this);
        let credObj = Object.assign(...Array.from(cred, ([x, y]) => ({
            [x]: y
        })));

        /*
         * submit cred and request authorization
         */

    }
})();