(() => {
    /**
     * data related to regions manipulation
     */
    let rg = document.getElementById('reg_no'); // number of regions
    let rs = document.getElementById('reg_sub'); // number of sub regions
    let h_pPr = document.getElementById('h_pPr'); // highest productive region
    let h_pSr = document.getElementById('h_pSr'); // highest productive sub region

    function r(d, c) {
        fetch(`/admin/data/${arguments[0]}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    c.innerHTML = data[0].number;
                    if (Object.keys(data[0]).length > 1) {
                        c.innerHTML = `${data[0].constituency_name} ${data[0].amount}`;
                    }
                }
            });
    }

    // total number of regions
    r('allregions', rg);
    // total number of sub regions
    r('subregions', rs);
    // highest productive region
    r('hprodRegion', h_pPr);
    // highest productive sub region
    r('hprodSubreg', h_pSr);


    let _fr = document.forms.add_reg;
    document.getElementById('add_prompt').onclick = function() {
        this.style.display = 'none';
        // display the input form
        document.getElementById('add_r_cont').style.display = 'inline-block';
        document.getElementById('add_subrg').style.display = 'none';
        // populate county select
        fetch('/admin/data/allCounties')
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    _fr.county_id.append(new Option(data[i].county_name, data[i].id))
                }
            })

    };


    let _fsub = document.forms.add_sub;
    document.getElementById('add_subrg').onclick = function() {
        this.style.display = 'none'
        document.getElementById('add_prompt').style.display = 'none';
        // display the input form
        document.getElementById('add_sub').classList.remove('d-none');

        fetch('/admin/data/allRegionsToadd')
            .then(res => res.json())
            .then(data => {

                for (let i = 0; i < data.length; i++) {
                    _fsub.reg_id.append(new Option(data[i].constituency_name, data[i].id))
                }
            })

    }

    function rr(f, url) {
        let _regdata = Object.assign(...Array.from(new FormData(f), ([x, y]) => ({
            [x]: y
        })));

        // prevent submission if select box empty
        if (Object.keys(_regdata).length < 2) {
            f.querySelector('select').classList.add('is-invalid', 'animated', 'shake', 'text-danger');
        } else {
            f.querySelector('select').classList.remove('is-invalid', 'animated', 'bounce', 'text-danger');
            fetch(`/admin/data/${url}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(_regdata)
                })
                .then(res => res.json())
                .then(data => {
                    f.reset();
                    let _r = document.querySelector('small.reg_status');
                    _r.style.display = 'none';
                    if (data.message == 'success') {
                        _r.innerHTML = `<span class='alert alert-success animated pulse'>Success!</span>`;
                    } else {
                        _r.innerHTML = `<span class='alert alert-danger animated pulse'>Twice registration failed!</span>`;
                    }
                    _r.style.display = 'inline-block';
                })
        }
    }

    // take the region name and register
    _fr.onsubmit = function(e) {
        e.preventDefault();
        rr(_fr, 'addRegion');
    }
    // take the sub region name and register
    _fsub.onsubmit = function(e) {
        e.preventDefault();
        rr(_fsub, 'addSubregion');
    }

    let d = document.getElementById('list_data');
    document.getElementById('get').onclick = () => {

    };
    // fetch all regions total  for the past 30 days
    fetch('/admin/data/allRegionsTotal')
        .then(res => res.json())
        .then(data => {
            let li = '';
            for (let i = 0; i < data.length; i++) {
                let n = data[i].region_name;
                let c = data[i].merch_code;
                let a = data[i].amount;
                let t = (data[i].time.split(',')).shift();
                li += `
                    <li class="list-group-item p-0 py-2">
                        <div class="row">
                            <div class="col-2"></div>
                            <div class="col-3">${n}</div>
                            <div class="col-3"><a href="javascript:void(0)">${c}</a></div>
                            <div class="col-2">${a}</div>
                            <div class="col-2">${t}</div>
                        </div>
                    </li>
                    `;
            }
            d.innerHTML = li;
            t(d);
        });

    function t(cont) {
        // filter to manage search
        let _dd = cont.querySelectorAll('div.row');
        document.getElementById('filter_input').onkeyup = function(e) {
            let _v = this.value.toLowerCase();
            for (let i = 0; i < _dd.length; i++) {
                if (_dd[i].textContent.toLowerCase().indexOf(_v) > -1) {
                    _dd[i].closest('li').classList.remove('d-none');
                } else {
                    _dd[i].closest('li').classList.add('d-none');
                }
            }
        }
    }

    // data comparison for regions within the last 6 days
    fetch('/admin/data/lastSixDays')
        .then(res => res.json())
        .then(data => {
            let l = ''
            let regions = [];
            for (let i = 0; i < data.length; i++) {
                if (regions.length < 1) {
                    regions.push({
                        name: data[i].region_name,
                        code: data[i].merch_code,
                        amount: [data[i].amount],
                        date: [(data[i].date).substr(0, 10)]
                    });
                } else {
                    function findATTR(a, atr, vl) {
                        for (let j = 0; j < a.length; j++) {
                            if (a[j][atr] === vl) {
                                return j;
                            }
                        }
                        return -1;
                    }
                    let ix = findATTR(regions, 'name', data[i].region_name);
                    if (ix != -1) {
                        regions[ix].amount.push(data[i].amount);
                        regions[ix].date.push((data[i].date).substr(0, 10));
                    } else {
                        regions.push({
                            name: data[i].region_name,
                            code: data[i].merch_code,
                            amount: [data[i].amount],
                            date: [(data[i].date).substr(0, 10)]
                        });
                    }
                }
            }
            // data now available in regions array
            let li = ''
            for (let i = 0; i < regions.length; i++) {
                let am = ''
                for (let b = 0; b < regions[i].amount.length; b++) {
                    am += `
                        <div class="col-1">${regions[i].amount[b]}</div>
                        `;
                }
                li += `
                        <li class="list-group-item">
                            <div class="row">
                                <div class="col-3 text-left">${regions[i].code}</div>
                                <div class="col-3">${regions[i].name}</div>
                                ${am}
                            </div>
                        </li>
                    `;
            }
            document.getElementById('data_cont').innerHTML = li;
        })
})();
