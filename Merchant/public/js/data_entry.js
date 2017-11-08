(() => {
    document.getElementById('r_cache').onclick = () => {
        document.getElementById('pg_cont').style.display = 'inline-block';
        start();
    };
    document.getElementById('e_integrity').onclick = () => {
        document.getElementById('pg_cont').style.display = 'inline-block';
        start();
    };
    document.getElementById('r_storage').onclick = () => {
        document.getElementById('pg_cont').style.display = 'inline-block';
        start();
    };

    function start() {
        let count = 0;
        let pg = document.getElementById('progressbar');
        pg.max = 100;
        timer = setInterval(function() {
            count++;
            pg.value = count;
            document.getElementById('pgvalue').innerHTML = `${pg.value} %`;
            if (count >= 100) {
                clearInterval(timer);
                pg.value = 0;
                document.getElementById('pg_cont').style.display = 'none';
            }
        }, 35)
    };
    start();
    // initialize datepicker
    $('.datepicker').datepicker({
        setDate: new Date(),
        todayHighlight: true,
        daysOfWeekHighlighted: "0",
        autoclose: true,
        startDate: '-1d',
        endDate: '+1d'
    });

    /*
     * populate table with clients information
     */
    let _tbody = document.querySelector('tbody');
    let _day = parseInt((eval(new Date().getDay() + 2) == 2) ? 9 : (eval(new Date().getDay() + 2)));
    fetch('/data/client_list', {
            method: 'GET'
        })
        .then(res => res.text())
        .then((data) => {
            _tbody.innerHTML = data;
            /*
             * HAVE EACH ROW REQUEST THEIR OWN DATA TO POPULATE DAYS STARTING FROM MONDAY
             * OF EVERY CALENDAR WEEK
             */
            let rowIdsArr = [];
            document.querySelectorAll('tr').forEach(function(row) {
                rowIdsArr.push(row.getAttribute('data-id'));
            }, this);
            rowIdsArr = rowIdsArr.filter((v) => v);
            rowIdsArr.forEach(function(rowPhone) {
                let rowQ = document.querySelector(`tr[data-id="${rowPhone}"]`);
                let inputQ = Array.from(rowQ.querySelectorAll(`input[type="text"]`)).slice(0, (_day - 3));

                fetch('/data/requestValueByRow', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 'phone': rowPhone })
                    })
                    .then(resp => resp.json())
                    .then(rowValues => {
                        for (let i = 0; i < inputQ.length; i++) {
                            if (rowValues[i] == undefined) inputQ[i].value = 0;
                            else inputQ[i].value = rowValues[i].cl_amount;
                        }
                    });
            }, this);
        });

    // delay DOM
    setTimeout(() => {
        /*
         * A DEAD SIMPLE AND STUPID WAY TO TRICK DATATABLES INITIALIZATION
         */
        $('#data_entry_table').dataTable({
            // datatables customization options
        });

        setTimeout(function() {
            // hide preloader
            let preloader = document.querySelector('div#preloader_cont');
            preloader.style.width = '0%';
        }, 600);

        /*
         * write to localstorage,
         * key-value pairs of the data collected
         */
        let tbl = document.getElementById('data_entry_table');
        let cells = tbl.querySelectorAll('td');
        cells.forEach((elem) => {
            let _i = elem.querySelectorAll('input[type="text"]');
            if (_i.length !== 0) {
                _i.forEach((input) => {
                    /*
                     *MANIPULATE THE INPUT AS DESIRED, DISABLE, SETATTRIBUTE, AND OBTAIN THEIR VALUES
                     */
                    input.readOnly = true;
                })
            }
        });

        // enable write mode for the inputs marked today
        let _r = Array.from(tbl.querySelectorAll('tr'));
        for (let i = 2; i < _r.length; i++) {
            // loop through the cells starting from index 3
            let _c = _r[i].cells[_day];
            let input = _c.querySelectorAll('input[type="text"]');
            input.forEach((i) => {
                i.classList.add("is-valid");
                i.readOnly = false;
                /*
                 *monitor key strokes and save the value
                 */
                let kinLs = i.closest('tr').getAttribute('data-id');

                if (localStorage.getItem(kinLs)) {
                    i.value = JSON.parse(localStorage.getItem(kinLs)).amount;
                }

                i.onkeyup = function(event) {
                    this.value = this.value.replace(/[^\d+\.+\d{1,2}]/g, '');
                    if (this.value.length > 4 || (this.value.match(/\./g) || []).length > 1) {
                        this.classList.add('is-invalid');
                    } else {
                        this.classList.remove('is-invalid');
                        this.classList.add('is-valid');
                    }
                    let _key = this.closest('tr').getAttribute('data-id');
                    let _name = this.closest('tr').getAttribute('data-name');
                    let _code = this.closest('tr').getAttribute('data-rep');
                    let _am_value = this.value;
                    let _val = {
                        code: _code,
                        name: _name,
                        amount: _am_value,
                        time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                    };
                    // check if key exists in localstorage
                    if (localStorage.getItem(_key) === null) {
                        /*
                         * write to localstorage, key and value
                         */
                        localStorage.setItem(_key, JSON.stringify(_val));

                    } else {
                        /*
                         * rewrite the existing value of the key specified
                         */
                        localStorage.setItem(_key, JSON.stringify(_val));

                    }
                }
            })
        };
    }, 3000);
})();