(function() {
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    /**
     * previous 30 days data to plot the line comparative graph, for
     * collections and payment made from farmers requests
     */

    fetch('/admin/data/previousMonth')
        .then(res => res.json())
        .then(data => {
            let dateLbls = [];
            let valData = [];
            data.forEach(item => {
                dateLbls.push((item.date).substr(0, 10));
                valData.push(item.amount);
            });
            let config = {
                    type: 'line',
                    data: {
                        labels: dateLbls,
                        datasets: [{
                                label: "Data collection 30 days in litres",
                                backgroundColor: 'rgba(215,34,89,0.4)',
                                borderColor: 'rgba(215,34,89,0.4)',
                                data: valData,
                                fill: true,
                            },
                            {
                                label: "Data payment 30 days in '000",
                                backgroundColor: 'rgba(3,0,219,0.4)',
                                borderColor: 'rgba(3,0,219,0.4)',
                                data: [98, 7, 43],
                                fill: true,
                            }
                        ],
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: '30 days Line Chart'
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: true,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Month'
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Value'
                                    }
                                }]
                            }
                        }
                    }
                }
                // init line graph
            let ctx = document.getElementById('line_30').getContext('2d');
            new Chart(ctx, config);
        });


    /**
     * previous 12 months data to plot the pie chart , for
     * collections made from farmers 
     */
    fetch('/admin/data/previousYear')
        .then(res => res.json())
        .then(data => {
            let lbls = [];
            let lblData = [];
            data.forEach(item => {
                lbls.push(item.month);
                lblData.push(item.amount);
            });

            lbls = lbls.map((e) => {
                return MONTHS[e - 1];
            }, false)
            let pieConfig = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: lblData,
                        backgroundColor: [
                            'rgba(23,167,43,0.8)',
                            'rgba(213,17,43,0.8)',
                            'rgba(23,17,143,0.8)',
                            'rgba(2,67,43,0.8)',
                            'rgba(30,197,143,0.8)',
                            'rgba(221,167,3,0.8)',
                            'rgba(211,17,103,0.8)',
                            'rgba(103,17,39,0.8)',
                            'rgba(98,67,213,0.8)',
                            'rgba(46,219,213,0.8)',
                            'rgba(3,0,219,0.8)',
                            'rgba(215,34,89,0.8)',
                        ],
                        label: 'Data for previous 12 months'
                    }],
                    labels: lbls,
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Data for previous 12 months'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: true,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                }
            };
            let pctx = document.getElementById('pie').getContext('2d');
            new Chart(pctx, pieConfig);
        });

})();