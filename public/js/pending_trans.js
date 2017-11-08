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
})();