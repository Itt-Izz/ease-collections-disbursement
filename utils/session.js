/**
 * 
 * session store, similar to express-session, but uses req object's ip address
 * session data will be lost on server reload
 * @property session `takes the session varibale`
 * @default session `null`
 * 
 */

class Session {

    /**
     * session data will be stored in this object
     */
    constructor(session) {
        this.own = []
    }

    /**
     * 
     * uses the ip address to maintain sessions
     * @param ip {string} ip address
     * @param params {Object} session variables
     */
    init(ip, params) {
        // check if there's a similar saved session
        if (this.own.find(obj => obj.ipAddrr === ip)) {
            return
        } else {
            this.own.push({
                ipAddrr: ip,
                params
            })
        }
    }

    /**
     * 
     * destroy the session variables
     * @param ip {string} ip address
     * @param action {Function} callback function
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
     * 
     */
}

// expose Session to other files
module.exports = new Session()