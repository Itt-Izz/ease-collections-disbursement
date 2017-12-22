(() => {

    // check internet connection
    setInterval(() => {
        if (navigator.onLine) {
            document.getElementById('netstats').style.display = 'none'
        } else {
            document.getElementById('netstats').style.display = 'flex'
        }
    }, 4000);
    document.getElementById('reload').onclick = () => {
        location.reload();
    };
    /**
     * update notifications count
     */
    let nc = document.getElementById('errors');
    let nt = document.getElementById('notifs');
    let msg = document.getElementById('messages');
    let type = 'count'
    setInterval(
        () => {
            fetch(`/admin/data/notifs/${type}`)
                .then((res) => res.json())
                .then((data) => {
                    // populate the notifications pane
                    nc.innerHTML = data[0].count;
                    nt.innerHTML = data[2].count;
                    msg.innerHTML = data[1].count;
                })
        }, 8000);

    function f(u, c, t, icon) {
        fetch(`/admin/data/notifications/${u}`)
            .then(res => res.json())
            .then(data => {
                let li = "";
                for (let i = 0; i < data.length; i++) {
                    li += `
                        <small class="list-group-item px-0 py-2" data-id="${data[i].id}">
                            <span class="mdi ${icon}"></span>&nbsp;${data[i].info}
                        </small>
                    `;
                }
                let ul = `
                    <ul class="list-group-flush p-0 m-0" id="popover">
                        ${li}
                    </ul>
                `;
                // create the dropdown popover
                $(c).popover({
                    delay: 0,
                    placement: "bottom",
                    title: t,
                    html: true,
                    content: ul
                })
                let sm = document.querySelectorAll('#popover small')
                sm.forEach(s => {
                    s.onclick = function() {
                        let id = this.getAttribute('data-id')
                    }
                })
            })
    }
    document.getElementById('get_errors').onclick = function() {
        // retrieve notifs of type error
        f('ERROR', this, "Errors reported today", "mdi-alert text-danger")
    };
    document.getElementById('get_notifs').onclick = function() {
        // retrieve notifs of type notifs
        f('HELP', this, "Notifications from merchants", "mdi-bell-plus text-success")
    };
    document.getElementById('get_messages').onclick = function() {
        // retrieve notifs of type error
        f('MESSAGE', this, "Messages from merchants", "mdi-message text-info")
    };

    $('#acc_options').popover({
        delay: 0,
        placement: "bottom",
        title: "Account options",
        html: true,
        content: () => {
            return (
                `<div>
                    <a href="/admin/auth/logout" class="list-group-item">Sign Out &nbsp;<span class="mdi mdi-logout-variant"></span></a>
                 </div>
                `
            )
        }
    });

    /**
     * admin dashboard
     */
    let c = document.querySelector('span.close');
    let m = document.querySelector('span.mdi-menu');
    let s = document.querySelector('div#side_nav');
    let d = document.querySelector('div#dashboard_content');
    // collapse side menu
    c.onclick = (e) => {
        e.preventDefault();
        side_nav.style.width = '0vw';
        d.style.width = '100vw';
        m.style.display = 'block';
    };
    // reveal side menu
    m.onclick = (e) => {
        e.preventDefault();
        s.style.width = '16vw'
        d.style.width = '84vw'
        m.style.display = 'none'
    };

    // side navigation options
    let da = document.getElementById('content_wrapper');
    let preloader = `<div id="preloader_cont" class="pt-5">
                        <div id="preloader">
                            <img src="/images/processing.gif" alt="preloader">
                        </div>
                    </div>`;

    function fetch_htm(url, title, rep_url, scripts) {
        document.querySelectorAll('.nav_options').forEach((e) => {
            e.classList.remove('bg-info', 'text-white');
        });

        // top_loader
        let count = 0;
        let timer = setInterval(function() {
            count++;
            document.querySelector('div.top_loader').style.width = `${count}%`;
            if (count >= 100) {
                clearInterval(timer);
                document.querySelector('div.top_loader').style.width = 0;
            }
        }, 20);

        history.pushState(null, title, rep_url);
        da.innerHTML = preloader;
        let arr = Array.from(scripts.trim())
        if (arr.length !== 0) {
            fetch(url)
                .then((res) => res.text())
                .then((data) => {
                    setTimeout(function() {
                        let script = document.createElement('script')
                        script.type = 'text/javascript'
                        script.async = true
                        script.src = `/js/admin/${scripts}.js`
                        let s = document.getElementsByTagName('script')[0]
                        s.parentNode.insertBefore(script, s)
                        da.innerHTML = data;
                    }, 100);
                });
        } else {
            fetch(url)
                .then((res) => res.text())
                .then((data) => {
                    setTimeout(function() {
                        da.innerHTML = data;
                    }, 100);
                });
        }
    };
    let db = document.getElementById('dashboard');
    let rp = document.getElementById('reports');
    let rg = document.getElementById('regions');
    let mr = document.getElementById('merchants');
    let cf = document.getElementById('config');
    let sc = document.getElementById('secure');
    db.onclick = function() {
        location.reload();
        history.replaceState(null, 'Dashboard | Data summary', '?dashboard--data-summary');
    }
    rp.onclick = function() {
        /*
         * load the reports html and js files
         */
        fetch_htm('/admin/data/reports', 'Reports | Detailed data', '?reports--data-indepth', 'reports');
        this.classList.add('bg-info', 'text-white')
    }
    rg.onclick = function() {
        /*
         * load the regions html and js files
         */
        fetch_htm('/admin/data/regions', 'Regions | Manage data', '?regions--manage-re', 'regions');
        this.classList.add('bg-info', 'text-white')
    }

    mr.onclick = function() {
        /*
         * load the merchants html and js files
         */
        fetch_htm('/admin/data/merchants', 'Merchants | Manage data', '?merchants--manage-m', 'merchants');
        this.classList.add('bg-info', 'text-white')
    };
    cf.onclick = function() {
        /*
         * load the merchants html and js files
         */
        fetch_htm('/admin/data/conf', 'Configuration | Manage data', '?configuration--manage-c', 'conf');
        this.classList.add('bg-info', 'text-white')
    };
    sc.onclick = function() {
        /*
         * load the merchants html and js files
         */
        fetch_htm('/admin/data/secure', 'Secure | Manage data', '?secure--manage-s', 'secure');
        this.classList.add('bg-info', 'text-white')
    };

    // plot today's data
    fetch('/admin/data/todayColls')
        .then(res => res.json())
        .then(result => {
            // filter data to plot 
            let lbls = [];
            let dataRes = [];
            for (let i = 0; i < result.length; i++) {
                lbls.push(result[i].region_name);
                dataRes.push(result[i].amount);
            }

            // sum of all todays input to update todays total
            let total = dataRes.reduce((a, b) => {
                return a + b;
            }, 0);
            document.getElementById('tod_total').textContent = `${total} L`;

            /**
             * arrays filled, plot the graph now
             */

            let ctx = document.getElementById('ctx');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: lbls,
                    datasets: [{
                        label: 'Collections analytics for today',
                        data: dataRes,
                        backgroundColor: [
                            'hsla(180, 53%, 33%, 0.618)'
                        ],
                        borderColor: [
                            'hsla(180, 53%, 33%, 0.818)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        });

    let by_reg = document.getElementById('by_reg');
    let by_sub = document.getElementById('by_sub');
    let by_coun = document.getElementById('by_coun');

    /**
     * bottom section to group collections by 
     * @function  fetch(url:String)
     * @argument (county,regions & sub regions)
     */
    function regData(region) {
        fetch(`/admin/data/organizeByReg/${region}`)
            .then(res => res.json())
            .then(data => {
                /*
                 * json data, populate the region or sub-region selected/requested
                 */
                let li = '';
                if (data.length < 1) {
                    li += `
                        <div class='text-danger text-center'>No data has been submitted today yet <span class='mdi mdi-emoticon'></span></div>
                    `;
                }
                data.forEach((elem) => {
                    li += `
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-5 text-left"><small>${elem.region_name}</small></div>
                            <div class="col-6 text-left text-success"><small>${elem.amount} L</small></div>
                        </div>
                    </li>
                    `;
                })
                document.getElementById('data_disp').innerHTML = li;
            });
    }

    by_reg.onclick = function() {
        regData('regions');
    }
    by_sub.onclick = function() {
        regData('subcounties');
    }
    by_coun.onclick = function() {
        regData('county');
    }
})();