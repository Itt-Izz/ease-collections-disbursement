/**
 * 
 * session store, similar to express-session, but uses req object's ip address
 * session data will be lost on server reload
 * @default session `null` 
 */
class Session {
    constructor() {
        /**
         * session data will be stored in this object
         */
        this.own = []
    }

    /**
     * 
     * uses the ip address to create session
     * @param {string} ip ip address
     * @param {any} params session variables
     */
    init(ip, params) {
        // check if there's a similar saved session
        if (this.own.find(obj => obj.ipAddrr === ip)) {
            return
        } else {
            // create new session variable with supplied credentials
            this.own.push({
                ipAddrr: ip,
                params
            })
        }
    }

    /**
     * 
     * destroy the session variables
     * @param {string} ip address
     * @param {Function} action  callback function
     */
    destroy(ip, action) {
        let index = this.own.findIndex(obj => obj.ipAddrr === ip)
        if (this.own.splice(index, 1)) {
            return action(true)
        } else {
            return action(false)
        }
    }

    /**
     * 
     * return requested session data
     * @param {string} ip
     * @param {Function} callback
     */
    getSess(ip, callback) {
        let index = this.own.findIndex(obj => obj.ipAddrr === ip)
        return callback(this.own[index])
    }
}

// expose Session 
module.exports = new Session()