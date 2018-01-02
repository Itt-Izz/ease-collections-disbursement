// self calling function
((window, document, undefined) => {
    let ctx = document.querySelector('#drepcnvs')

    let progress = document.getElementById('anim')
    let progText = document.getElementById('progText')

    // request previous 30 days collection
    fetch('/data/merchantCollections')
        .then(res => res.json())
        .then(data => {
            let lbls = []
            let dataRes = []
            for (let i = 0; i < data.length; i++) {
                lbls.push((data[i].date).substr(0, 10))
                dataRes.push(data[i].amount)
            }
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: lbls,
                    datasets: [{
                        label: 'Previous 30 days collections',
                        data: dataRes,
                        backgroundColor: [
                            'rgba(215,34,89,0.4)'
                        ],
                        borderColor: [
                            'rgba(215,34,89,0.4)'
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
                    },
                    animation: {
                        duration: 1000,
                        onProgress: (animation) => {
                            progText.innerText = 'Plotting data.....'
                            progress.value = animation.currentStep / animation.numSteps
                        },
                        onComplete: (animation) => {
                            window.setTimeout(() => {
                                progress.value = 0;
                                progText.innerText = 'Complete!'
                            }, 1000)
                        }
                    },
                }
            })
        })

    document.querySelector('button._qs').addEventListener('click', () => {
        let q = document.querySelector('input.q')
        if (q.value.length < 5) {
            q.focus()
            q.classList.add('is-invalid')
        } else {
            q.classList.remove('is-invalid')
            fetch('/data/qRequestChartData', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ q: q.value.trim() })
                })
                .then(res => res.json())
                .then(data => {
                    let lbls = []
                    let dataRes = []
                    let _cl = document.querySelector('div._clientdata')
                    let ctx = document.createElement('canvas')

                    let exSpan = _cl.querySelector('span')
                    let exCanvas = _cl.querySelector('canvas')
                    if (typeof(exSpan != undefined) && exSpan != null) {
                        exSpan.parentNode.removeChild(exSpan)
                    }
                    if (typeof(exCanvas != undefined) && exCanvas != null) {
                        exCanvas.parentNode.removeChild(exCanvas)
                    }
                    if (data.length > 0) {
                        let label = data[0].cl_phone

                        // plot chart here
                        for (let i = 0; i < data.length; i++) {
                            lbls.push(data[i].server_date.substr(0, 10))
                            dataRes.push(data[i].cl_amount)
                        }

                        _cl.appendChild(ctx).classList.add('animated', 'zoomIn')

                        new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: lbls,
                                datasets: [{
                                    label: `Client data graph for ${label}`,
                                    data: dataRes,
                                    backgroundColor: ['rgba(251, 21, 145,0.4)'],
                                    borderColor: ['rgba(251, 21, 145,0.4)'],
                                    borderWidth: 0
                                }]
                            },
                            options: {
                                animation: {
                                    duration: 1000,
                                    onProgress: (animation) => {
                                        progText.innerText = 'Plotting data.....'
                                        progress.value = animation.currentStep / animation.numSteps
                                    },
                                    onComplete: (animation) => {
                                        window.setTimeout(() => {
                                            progress.value = 0
                                            progText.innerText = 'Complete!'
                                        }, 1000)
                                    }
                                },
                                responsive: true,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }
                        })
                    } else {
                        let span = document.createElement('span')
                        span.classList.add('animated', 'pulse')
                        let stext = document.createTextNode('The phone number you provided can\'t be found')
                        span.appendChild(stext)
                        _cl.appendChild(span).classList.add('alert', 'alert-danger')
                    }
                })
        }
    })
})(window, document)