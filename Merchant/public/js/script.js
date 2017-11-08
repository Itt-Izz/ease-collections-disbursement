(() => {
    let auth_form = document.getElementById('auth_form')
    auth_form.addEventListener('submit', (e) => {
        e.preventDefault();
        // pick merchant_code and password for log in
        let auth_form_input = new FormData(auth_form).entries();
        let auth_form_obj = Object.assign(...Array.from(auth_form_input, ([x, y]) => ({
            [x]: y
        })));

        // request login credentials
        fetch('/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(auth_form_obj)
            })
            .then((res) => res.json())
            .then((data) => {
                // use the data
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].name);
                }
            });
    });
})(); 