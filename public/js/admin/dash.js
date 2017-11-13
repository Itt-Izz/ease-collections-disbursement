(() => {
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
    let ctx = document.getElementById('ctx');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: 'Collections analytics',
                data: [12, 19, 3, 5, 2, 3],
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
})();