(function() {
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var config = {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Data for the prevous 30 days",
                    backgroundColor: 'rgba(215,34,89,0.5)',
                    borderColor: 'rgba(215,34,89,0.3)',
                    data: [34, 5, 78, 23, 15, 65, 78, 23, 98, 12],
                    fill: true,
                }],
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

    // pie chart
    var pieConfig = {
        type: 'pie',
        data: {
            datasets: [{
                data: [23, 45, 67, 12, 87, 43, 67, 34, 90, 65, 124, 765],
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
            labels: MONTHS,
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
})();