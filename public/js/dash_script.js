(() => {
    /*
     * Author: Danny Sofftie
     * @params
     *      c_l-collections link
     *      p_t-pending transfers link
     *      r_m-recent members link
     *      r_s-review collections
     *      a_b-absentees
     *      r_p-reports section link
     */

    let m = document.getElementById('menu_toggler');
    let c = document.getElementById('close_button');
    let d = document.getElementById('dashboard_content');
    let s = document.getElementById('side_nav');
    let r = document.getElementById('request_collection');
    let a = document.getElementById('add_members');
    let da = document.getElementById('data_container');
    let c_l = document.getElementById('c_l')
    let p_t = document.getElementById('p_t')
    let r_m = document.getElementById('r_m')
    let r_s = document.getElementById('r_s')
    let ab = document.getElementById('ab')
    let r_p = document.getElementById('re_S')

    // refresh window
    document.getElementById('refresh_icon').onclick = () => {
        window.location.reload(true)
    };

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
    // side navigation customization
    let si = Array.from(document.getElementsByClassName('list-group-item'))
    si.forEach(function (elem) {

        elem.onpointerenter = (e) => {
            elem.classList.remove('list-group-item-info');
            elem.classList.add('list-group-item-secondary')
        }
        elem.onpointerleave = (e) => {
            elem.classList.remove('list-group-item-secondary');
            elem.classList.add('list-group-item-info');
        }
    });
    let preloader = `<div id="preloader_cont" class="pt-5">
                        <div id="preloader">
                            <img src="/images/processing.gif" alt="preloader">
                        </div>
                    </div>`;

    function fetch_htm(url, rep_url, scripts) {
        history.replaceState(null, null, rep_url);
        da.innerHTML = preloader;
        let arr = Array.from(scripts.trim())
        if (arr.length !== 0) {
            fetch(url)
                .then((res) => res.text())
                .then((data) => {
                    setTimeout(function () {
                        let script = document.createElement('script')
                        script.type = 'text/javascript'
                        script.async = true
                        script.src = `/js/${scripts}.js`
                        let s = document.getElementsByTagName('script')[0]
                        s.parentNode.insertBefore(script, s)
                        da.innerHTML = data;
                    }, 10);
                });
        } else {
            fetch(url)
                .then((res) => res.text())
                .then((data) => {
                    setTimeout(function () {
                        da.innerHTML = data;
                    }, 10);
                });
        }
    };

    // request collection
    r.onclick = () => {
        fetch_htm('/auth/request_collection', '?todays-collection', 'data_entry')
    }
    a.onclick = (e) => {
        fetch_htm('/auth/add_members', '?add-members', 'member_script')
    }

    // collections
    c_l.onclick = (e) => {
        /*
         * read from local storage, similar to pending transfers,
         * but this switches to edit mode
         */
        fetch_htm('/data/local_collections', '?advanced-collections', 'local_col')
    };
    // pending transfers
    p_t.onclick = (e) => {
        /*
         * this read from the local storage but for review purposes only,
         * entries cannot be edited
         */
        fetch_htm('/data/pending_trans', '?pending-transfers', 'pending_trans')
    };
    // recent members
    r_m.onclick = (e) => {
        /*
         * this retrieves recent members from the database,
         * gives advanced options, like sending tutorials to member's phone,
         * e.g. how to check balance and make withdrawals
         */
        fetch_htm('/data/recent_members', '?recent-members-tut', 'recent_members')
    };
    // review after send
    r_s.onclick = (e) => {
        /*
         * fetch todays submissions from the server
         * mode: read-only
         */
        fetch_htm('/data/remote_review', '?review-collections', '')
    };
    // view absentees
    ab.onclick = (e) => {
        /*
         * will view a list of members
         * advanced options will be available,
         * e.g. send a reminder notification to farmers
         */
        fetch_htm('/data/defaulters', '?defaulters|defectors', 'defaulters')
    };
    // reports section
    r_p.onclick = (e) => {
        /*
         * give a visual graphical data representation for a given period of time
         * e.g. bar graphs, pie-charts, doughnut charts and such
         *    *************
         * also allow to visualize data of specific farmer
         */
        fetch_htm('/data/reports', '?graphical--v-data', '')
    };

    setInterval(() => {
        document.getElementById('col_length').innerHTML = localStorage.length;
        document.getElementById('pend_len').innerHTML = localStorage.length;
    }, 2000)

    // read cookies to update merchant code in dashboard
    /**
     * ("i3udhw8", _encCode, 0.5)
       ("i4udhsy", _encName, 0.5)
       ("i5udhwrs", _encPhone, 0.5)
     */
    let mr = document.querySelector('.navbar-brand')
    let ckk = decodeURIComponent(document.cookie).split(";")

    function getCookie(ckName) {
        var name = ckName + "="
        for (var i = 0; i < ckk.length; i++) {
            var c = ckk[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return "";
    }

    mr.innerHTML = `Merchant: ${window.atob(getCookie('i4udhsy'))} Code: ${window.atob(getCookie('i3udhw8'))} `

})();