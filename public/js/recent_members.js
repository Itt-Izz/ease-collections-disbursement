(() => {
    /*
     * request members info from database
     */

    let preloader = `<div id="preloader_cont" class="pt-5">
                        <div id="preloader">
                            <img src="/images/processing.gif" alt="preloader">
                        </div>
                    </div>`;
    document.getElementById('m_cont').innerHTML = preloader;

    setTimeout(function() {
        fetch('/data/new_members')
            .then((res) => res.text())
            .then(data => {
                document.getElementById('m_cont').innerHTML = data;
            });

        let q = document.getElementById('q');



        q.onkeyup = function(e) {
            /*
             * make request for the member data
             */
            fetch('/data/member_info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'q': this.value })
                })
                .then(res => res.text())
                .then(data => {
                    document.getElementById('m_cont').innerHTML = data;
                })
        }
    }, 1000);
})();