(() => {

    // prompt options, hide and display the form
    document.querySelector('button#add').onclick = function() {
        document.querySelector('div#prompt').classList.add('d-none');
        document.querySelector('div#m_reg').classList.remove('d-none')
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