(() => {
    /*
     * this utilizes the local storage to retrieve values before submitting to server
     */
    let _tbl = document.getElementById('tbl_b_send');
    let _tbdy = document.createElement('tbody');

    for (let i = 0; i < localStorage.length; i++) {
        let _k = `0${localStorage.key(i).slice(-9)}`;
        let _v = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let _tr = document.createElement('tr');
        /*
         * create and append td and their textNode
         */
        let _td = document.createElement('td');
        let _td_name = document.createElement('td');
        let _td_phone = document.createElement('td');
        let _td_time = document.createElement('td');
        let _td_amount = document.createElement('td');
        /*
         * create textNodes
         */
        let _td_text = document.createTextNode(_v.code);
        let _td_n_text = document.createTextNode(_v.name);
        let _td_p_text = document.createTextNode(_k);
        let _td_t_text = document.createTextNode(_v.time);
        let _td_a_text = document.createTextNode(_v.amount);
        /*
         * append textNodes
         */
        _td.appendChild(_td_text);
        _td_name.appendChild(_td_n_text);
        _td_phone.appendChild(_td_p_text)
        _td_time.appendChild(_td_t_text)
        _td_amount.appendChild(_td_a_text);
        /*
         * append td elements
         */
        _tr.appendChild(_td);
        _tr.appendChild(_td_name);
        _tr.appendChild(_td_phone)
        _tr.appendChild(_td_time)
        _tr.appendChild(_td_amount);

        _tbdy.appendChild(_tr);
    }

    _tbl.appendChild(_tbdy);
    $('#tbl_b_send').dataTable();

    let _c = document.getElementById('col_discard')
    let _s = document.getElementById('sub_confirm')

    if (localStorage.length < 1) {
        _s.disabled = true;
    }

    _c.onclick = () => {
        let __ = confirm('Discarding collections will delete all entries. Are you sure?')
        __ ? localStorage.clear() : ''
    };

    /*
     * read from the local storage,
     * generate data objects with keys and values,
     * convert to json and send to the server
     */
    _s.onclick = () => {
        document.getElementById('confirm_code').style.display = 'flex';
    };

    document.getElementById('reveal').onclick = function() {
        this.style.display = 'none';
        document.getElementById('data_actions').style.opacity = '1';
    };
    document.querySelector('button.close').onclick = function() {
        document.querySelector('div.confirm-code-dialog').style.display = 'none'
    };

    let frm_ = document.forms.modal_form;
    let m_code = document.querySelector('#merchant_code');
    let back = frm_.querySelector('button#back');

    back.onclick = () => {
        document.querySelector('div.confirm-code-dialog').style.display = 'none'
    }

    // detect caps lock
    m_code.onkeyup = (event) => {
        if (!(event.getModifierState && event.getModifierState('CapsLock'))) {
            m_code.value.replace(/\s+/g, '');
            m_code.classList.add('is-invalid');
            frm_.querySelector('button[type="submit"]').disabled = true;
        } else {
            m_code.classList.remove('is-invalid');
            m_code.classList.add('is-valid');
            frm_.querySelector('button[type="submit"]').disabled = false;
        }
    };



    frm_.onsubmit = function(e) {
        e.preventDefault();
        document.getElementById('processing_status').style.display = 'inline-block'
        let _obj_arr = [];
        for (let i = 0; i < localStorage.length; i++) {
            let _obj_data = {
                cl_phone: `+254${(localStorage.key(i)).slice(-9)}`,
                cl_code: JSON.parse(localStorage.getItem(localStorage.key(i))).code,
                cl_amount: JSON.parse(localStorage.getItem(localStorage.key(i))).amount,
                cl_time: JSON.parse(localStorage.getItem(localStorage.key(i))).time,
                cl_merch_id: m_code.value
            }
            _obj_arr.push(_obj_data);
        };

        // push code entered to beginning of object array
        _obj_arr.unshift(m_code.value);

        // _obj_arr accessible with data from localStorage
        fetch('/data/post_colls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(_obj_arr)
            })
            .then(res => res.json())
            .then((data) => {
                if (data.message === 'verified') {
                    document.getElementById('processing_status').innerHTML = "Collections saved."
                    setTimeout(function() {
                        document.getElementById('processing_status').style.display = 'none'
                        frm_.querySelector('button[type="submit"]').disabled = true;
                    }, 4000);
                    frm_.querySelector('button[type="submit"]').disabled = true;
                    m_code.readOnly = true;
                    m_code.classList.add('bg-success', 'text-white');
                    /*
                     * NOW CLEAR LOCALSTORAGE
                     */
                    localStorage.clear();
                } else {
                    document.getElementById('processing_status').innerHTML = "Seems as if you provided wrong code!"
                    setTimeout(function() {
                        document.getElementById('processing_status').style.display = 'none'
                    }, 4000);
                }
            })
    };
})();