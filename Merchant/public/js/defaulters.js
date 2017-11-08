(() => {

    /*
     * request/retrieve defaulters
     */
    let cont = document.getElementById('list_data');
    let selectopt = document.getElementById('selectopt');
    selectopt.onchange = () => {
        let period = selectopt.options[selectopt.selectedIndex].value;

        fetch(`/data/getdefaulters/${period}/${document.getElementById('q').value}`)
            .then((res) => res.json())
            .then((data) => {
                let list = '';
                data.forEach(function(elem) {
                    list += `
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-3 text-left"> 
                                <a href='javascript:void(0)'>
                                    <span class="mdi mdi-account" aria-hidden="true">${elem.first_name} ${elem.last_name}</span>
                                </a> 
                            </div>
                            <div class="col-3" style="">${elem.phone}</div>
                            <div class="col-2" style="">${elem.id_number}</div>
                            <div class="col-2" style="">${elem.cl_amount}</div>
                            <div class="col-2" style="">${parseInt(period)-(elem.cl_amount)}</div>
                        </div>
                    </li>
                    `;
                }, this);
                // load the data to page
                cont.innerHTML = list;
            });
    }

})();