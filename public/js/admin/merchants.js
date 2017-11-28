(() => {

    let _rForm = document.forms.rfm;
    let _recpwd = document.forms.rec_pwd;

    // prompt options, hide and display the form
    document.querySelector('button#add').onclick = function() {
        document.querySelector('div#prompt').classList.add('d-none');
        document.querySelector('div#m_reg').classList.remove('d-none');
        // populate the select options
        fetch('/admin/data/regionsRetrieve')
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    _rForm.reg_id.append(new Option(data[i].region_name, data[i].id))
                }
            });
    }

    // register toggle classes
    document.getElementById('reg').onclick = function() {
        this.classList.add('text-info')
        document.getElementById('rec').classList.remove('text-info')
        document.getElementById('recover').style.display = 'none'
        document.getElementById('register').style.display = 'block'
    }

    function merchCodes() {
        // retrieve merchant codes
        fetch('/admin/data/merchantCodes')
            .then(res => res.json())
            .then(data => {
                data.forEach(elem => {
                    _recpwd.m_code.append(new Option(elem.merch_code, elem.merch_code));
                });
            })
    }
    merchCodes();
    document.getElementById('rec').onclick = function() {
        this.classList.add('text-info')
        document.getElementById('reg').classList.remove('text-info')
        document.getElementById('register').style.display = 'none'
        document.getElementById('recover').style.display = 'block'
    };

    // phone number validation
    _rForm.querySelector('input[type="tel"]').onblur = function(e) {
        if (this.value.trim().length < 10 || this.value.trim().length > 10) {
            this.classList.add('text-danger')
            _rForm.querySelector('button[type="submit"]').disabled = true;
        } else {
            this.classList.remove('text-danger');
            _rForm.querySelector('button[type="submit"]').disabled = false;
        }
    };

    // member registration
    let rs = document.getElementById('reg_rec_st');
    _rForm.onsubmit = function(e) {
        e.preventDefault();
        let _dataobj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y.trim()
        })));

        if (Object.keys(_dataobj).length < 5) {
            _rForm.querySelector('select').classList.add('animated', 'shake', 'text-danger');
        } else {
            fetch('/admin/auth/merchantRegister', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(_dataobj)
                })
                .then(res => res.json())
                .then(data => {
                    rs.classList.add('animated', 'flash')
                        // check response
                    if (data.message == 'record_exists') {
                        rs.textContent = 'Error! Merchant exists in the records.'
                    }
                    if (data.message == 'network_problem') {
                        rs.textContent = 'Error! Internal server error occured.'
                    }
                    if (data.message == 'success') {
                        rs.textContent = 'Success! Merchant code and login password has been sent to phone number provided.'
                    }
                })
            rs.classList.remove('animated', 'flash');
        }
    }

    // password recovery
    _recpwd.onsubmit = function(e) {
        e.preventDefault();
        let _dataobj = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y.trim()
        })));
        if (Object.keys(_dataobj).length < 3) {
            // do nothing
        } else {
            fetch(`/admin/auth/recoverMerchPwd/${JSON.stringify(_dataobj)}`)
                .then(res => res.text())
                .then(data => {
                    console.log(data);
                })
        }
    }
})();