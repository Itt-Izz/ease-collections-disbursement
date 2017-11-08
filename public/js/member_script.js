(() => {
    /*
     *Author: DAnny Sofftie
     *Date: Oct 26 2017
     *@param: m contains an iterable list of all properties required during member registration
     */

    let m = document.forms.add_m_form;
    let _a = document.getElementById('authorization_area')
    _a.style.display = 'none';

    fetch('/data/get_regions')
        .then((res) => res.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                m.region_code.append(new Option(data[i].region_name, data[i].region_code))
            }
        });

    let _b = m.querySelector('button')
    let _i = m.querySelector('input#id_number');
    let _p = m.querySelector('input#phone')
    _i.onkeyup = () => {
        if (_i.value.trim().length < 6 || _i.value.trim().length > 8) {
            _i.classList.add('is-invalid')
            _b.disabled = true;
        } else {
            _i.classList.remove('is-invalid')
            _b.disabled = false;
        }
    };
    _p.onkeyup = () => {
        if (_p.value.trim().length != 10) {
            _p.classList.add('is-invalid')
            _b.disabled = true;
        } else {
            _p.classList.remove('is-invalid')
            _b.disabled = false;
        }
    };
    let phoneMap = new Map();
    // request membership
    m.addEventListener('submit', (e) => {
        e.preventDefault();

        let _f = new FormData(m).entries();
        let _j = Object.assign(...Array.from(_f, ([x, y]) => ({
            [x]: y
        })));
        phoneMap.set('phone', `${_j.phone}`);
        /* 
         *  send the details with body as
         *  JSON.Stringify(jsonobject)
         *  
         */
        fetch('/auth/request_membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(_j)
            })
            .then((res) => res.text())
            .then((data) => {
                /*
                 * request complete, check message and message code
                 * @param: error, error_code
                 * @param: success, success_message, success_status, success_rate
                 * as data.@param
                 */
                data = JSON.parse(data)
                console.log(data)
                if (data.message == 'registered') {
                    _a.style.display = 'inline-block'
                } else {
                    _a.style.display = 'none'
                }
            })
    });

    let app_m = document.forms.app_m;
    let auth_code = app_m.querySelector('input')
    let res_auth = app_m.querySelector('button#res_auth');
    let btn_sub = app_m.querySelector('button[type="submit"]')
    res_auth.onclick = () => {
        /*
         * prompt server to resend the code
         */
        fetch('/auth/res_auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'phone': phoneMap.get('phone') })
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
            });
    };

    btn_sub.disabled = true;
    auth_code.onkeyup = () => {
        if (auth_code.value.trim().length < 4) {
            btn_sub.disabled = true;
        } else {
            btn_sub.disabled = false;
        }
    };

    app_m.onsubmit = (e) => {
        e.preventDefault();
        /*
         * member proven identity and authorized
         * send the auth code
         */

    }

})()