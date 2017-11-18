(() => {

    // prompt options, hide and display the form
    document.querySelector('button#add').onclick = function() {
        document.querySelector('div#prompt').classList.add('d-none');
        document.querySelector('div#m_reg').classList.remove('d-none');

        // populate the select box
        let _rForm = document.forms.form_merchant;
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
    document.getElementById('rec').onclick = function() {
        this.classList.add('text-info')
        document.getElementById('reg').classList.remove('text-info')
        document.getElementById('register').style.display = 'none'
        document.getElementById('recover').style.display = 'block'
    }

})();