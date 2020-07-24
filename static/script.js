normalFont = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
normalFontColor = '#212529'
orange = "#2F6CA2"
    //Chart.defaults.global.defaultFontColor = 'red';

Chart.defaults.global.defaultFontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function toColor(str) {
    hue = rand(0, 360)
    saturation = rand(0, 100)
    lightness = rand(35, 80)
    return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)'
}


function post(endpoint, body, user, alertId) {

    // first hide all alerts
    var x = document.getElementsByClassName("login-alert");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }


    fetch(endpoint, {
        method: "POST",
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    }).then(resp => {
        if (resp.status == 200) {
            return resp.json()
        } else if (resp.status == 400) {
            return resp.text()
        } else {
            return "Bad server status code: " + resp.status
        }
    }).then(newData => {
        if (typeof(newData) === "object") {
            if (JSON.stringify(newData) !== JSON.stringify(window.data || {})) {
                data = newData
                console.log("new data")
                console.log(data)
                draw(user, newData)
            }
        } else {
            document.getElementById(alertId).style.display = "block"
            document.getElementById(alertId).innerHTML = escapeHtml(newData)
        }
    })
}

function register() {
    window.viaRegister = true
    window.user = document.getElementById("reg_user").value
    var password = document.getElementById("reg_password").value
    var body = "user=" + encodeURIComponent(user) + '&password=' + encodeURIComponent(password)
    post("/register", body, user, "alert_register")
}

function login() {
    window.viaRegister = false
    window.user = document.getElementById("login_user").value
    var password = document.getElementById("login_password").value
    var body = "user=" + encodeURIComponent(user) + '&password=' + encodeURIComponent(password)
    post("/dashboard", body, user, "alert_login")
}

function alwaysUpdate() {
    window.setInterval(function() {
        var password = viaRegister ? document.getElementById("reg_password").value : document.getElementById("login_password").value
        var body = "user=" + encodeURIComponent(user) + '&password=' + encodeURIComponent(password)
        post("/dashboard", body, user, "alert_login")
    }, 5000);
}

function showTrackingCode() {
    document.getElementById("tracking-code").style.display = "block"
    document.getElementById("tracking-code-button").innerHTML = "Hide tracking code"
}

function hideTrackingCode() {
    document.getElementById("tracking-code").style.display = "none"
    document.getElementById("tracking-code-button").innerHTML = "Display tracking code"
}

function toggleTrackingCode() {
    var elem = document.getElementById("tracking-code")
    if (elem.style.display === "none") {
        showTrackingCode()
    } else {
        hideTrackingCode()
    }
}


function escapeHtml(unsafe) {
    return (unsafe + "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function demo() {
    document.getElementById("login_user").value = "simple-web-analytics.com"
    document.getElementById("login_user").focus()
    document.getElementById("login_password").value = "simple-web-analytics.com" //XXXXXXXXXXXXXXXXXXXXXXXXXXX
    document.getElementById("login_button").click()
}




function getUTCMinusElevenNow() {
    var date = new Date();
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    d = new Date(now_utc);
    d.setHours(d.getHours() - 11)
    return d
}

function commaFormat(x) {
    return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function kFormat(num) {
    num = Math.floor(num)
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'K' : Math.sign(num) * Math.abs(num) + ""
}

function sum(array) {
    return array.reduce((acc, next) => acc + next, 0)

}

function drawUsername(user) {
    var x = document.getElementsByClassName("username");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].innerHTML = escapeHtml(user)
    }
}

function drawUTCOffsetVar() {
    offset = Math.round(-1 * new Date().getTimezoneOffset() / 60)
    document.getElementById("utcoffset").innerHTML = offset
}

function drawList(elem_id, dataItem, title, maxEntries, usePercent, useLink) {
    var elem = document.getElementById(elem_id)

    var showAll = elem.getAttribute("data-showall", "1")

    elem.innerHTML = "<h5>" + escapeHtml(title) + "</h5>"
    if (Object.keys(dataItem).length === 0 && dataItem.constructor === Object) {
        elem.innerHTML += '<span class="text-muted">Empty</span>'
        return
    }

    var completeList = [];
    for (var key in dataItem) {
        completeList.push([key, dataItem[key]]);
    }

    completeList.sort(function(a, b) {
        return b[1] - a[1];
    });

    if (showAll) {
        var list = completeList
    } else {
        var list = completeList.slice(0, maxEntries)
    }

    listTotal = 0
    for (var i = 0; i < completeList.length; i++) {
        listTotal += completeList[i][1]
    }

    html = '<table class="list">'
    for (var i = 0; i < list.length; i++) {
        var percent = list[i][1] / listTotal * 100
        html += '<tr>'
        if (usePercent) {
            var val = Math.round(percent) + "%"
            if (val === "0%") {
                continue
            }
        } else {
            var val = kFormat(list[i][1])
        }
        html += '<th style="padding-right: 0.5em; white-space: nowrap;">' + escapeHtml(val) + '</th>'
        html += '<td style="position: relative; z-axis: 100; width: 100%;">'
        html += '<div style="position: absolute; bottom: 0px; width: ' + percent + '%; height: 3px; background-color: #2F6CA2; pointer-events: none;"></div>'
        var key = escapeHtml(list[i][0])
        if (useLink) {
            if (!key.includes("://")) {
                var link = "//" + key
            } else {
                var link = key
            }
            html += "<a target='_blank' href='" + link + "'>" + key + '</a>'
        } else {
            html += key
        }
        html += "</td></tr>"
    }
    html += "</table>"

    if (completeList.length > maxEntries) {
        if (!showAll) {
            html += '<a href="#" onclick=\'document.getElementById("' + elem_id + '").setAttribute("data-showall", "1"); draw(user, data); return false\'>More</a>'
        } else {
            html += '<a href="#" onclick=\'document.getElementById("' + elem_id + '").removeAttribute("data-showall"); draw(user, data); return false\'>Less</a>'
        }
    }

    elem.innerHTML += html
}


function splitObject(obj, sort_keys) {
    var sortable = [];
    for (var key in obj) {
        sortable.push([key, obj[key]]);
    }
    if (sort_keys) {
        sortable.sort(function(a, b) {
            return a[0] - b[0];
        });
    } else {
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
    }

    return [sortable.map(x => x[0]), sortable.map(x => x[1])]
}


function resolveCountry(code) {
    entry = JQVMap.maps["world_en"].paths[code]
    if (entry) {
        return entry["name"]
    } else {
        return "Unknown"
    }
}



function drawLog(maxEntries) {

    var showAll = document.getElementById("log_body").getAttribute("data-showall", "1")

    var completeLines = Object.keys(data.log).reverse()

    if (showAll) {
        var lines = completeLines
    } else {
        var lines = completeLines.slice(0, maxEntries)
    }

    var html = ''
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        match = (/\[(.*?) (.*?):..\] (.*?) (.*?) (.*)/g).exec(line)
        if (match === null) {
            continue
        }
        var logDate = match[1]
        var logTime = match[2]
        var logCountry = match[3].toLowerCase()
        var logReferrer = match[4]
        var logUserAgent = match[5]

        // UGLY HACK, remove in a couple of months or so: June 2020
        if (logReferrer === "Mozilla/5.0") {
            logReferrer = ""
            logUserAgent = "Mozilla/5.0 " + logUserAgent
        }

        html += "<tr>"
        html += "<td>" + escapeHtml(logDate) + "</td>"
        html += "<td>" + escapeHtml(logTime) + "</td>"

        if (logCountry === '' || logCountry === 'xx') {
            html += '<td>-</td>'
        } else {
            html += '<td> <img title="' + escapeHtml(resolveCountry(logCountry)) + '" src="/famfamfam_flags/gif/' + escapeHtml(logCountry) + '.gif"></img></td>'
        }

        if (logReferrer === "") {
            html += "<td>-</td>"
        } else {
            try {
                var url = new URL(logReferrer)
            } catch (err) {
                var url = null
            }
            if (url === null) {
                html += '<td>?</td>'
            } else {
                html += '<td><a target="_blank" href="' + escapeHtml(logReferrer) + '">' + escapeHtml(url.host) + '</a></td>'
            }

        }
        html += "<td>" + escapeHtml(logUserAgent) + "</td>"
        html += "</tr>"

    }
    if (html !== "") {

        if (completeLines.length > maxEntries) {
            if (!showAll) {
                html += '<a href="#" onclick=\'document.getElementById("log_body").setAttribute("data-showall", "1"); draw(user, data); return false\'>More</a>'
            } else {
                html += '<a href="#" onclick=\'document.getElementById("log_body").removeAttribute("data-showall"); draw(user, data); return false\'>Less</a>'
            }
        }

        document.getElementById("log_body").innerHTML = html
    }

}

function drawMap() {
    jQuery('#world').vectorMap({
        map: 'world_en',
        backgroundColor: '#fff',
        color: '#ffffff',
        hoverOpacity: 0.7,
        selectedColor: null,
        enableZoom: false,
        showTooltip: true,
        borderOpacity: 0.8,
        color: '#eee',
        values: data.country,
        scaleColors: ['#C8EEFF', '#006491'],
        normalizeFunction: 'polynomial',
        onLabelShow: function(event, label, region) {
            label[0].innerHTML += (
                '&nbsp;<img title="' + escapeHtml(region) +
                '" src="/famfamfam_flags/gif/' +
                escapeHtml(region) +
                '.gif"></img> </br>' +
                (data.country[region] || "0") +
                " Visits")
        }
    });
}


function drawTitle(user) {
    document.title = "Simple Web Analytics for " + user
}


function drawCountries(elemId, countries) {
    var elem = document.getElementById(elemId)
    elem.innerHTML = "<h5>Countries</h5>"

    if (Object.keys(countries).length === 0 && countries.constructor === Object) {
        elem.innerHTML += '<span class="text-muted">Empty</span>'
        return
    }

    var list = [];
    for (var key in countries) {
        list.push([key, countries[key]]);
    }
    list.sort(function(a, b) {
        return b[1] - a[1];
    });

    html = '<table class="top">'
    for (var i = 0; i < list.length; i++) {
        var percent = list[i][1] / listTotal * 100
        html += '<tr>'
        var val = kFormat(list[i][1])
        html += '<th style="padding-right: 0.5em; white-space: nowrap;">' + escapeHtml(val) + '</th>'
        html += '<td style="position: relative; z-axis: 100; width: 100%;">'
            //html += '<div style="position: absolute; bottom: 0px; width: ' + percent + '%; height: 100%; background-color: rgba(25, 72, 115, 0.25); pointer-events: none;"></div>'
        var key = escapeHtml(list[i][0])
        html += '<img class="inline-block pr-1" src="/famfamfam_flags/gif/' + escapeHtml(key) + '.gif"/>'
        html += resolveCountry(key)
        html += "</td></tr>"
    }
    html += "</table>"

    elem.innerHTML += html
}

function drawPie(elemId, entries, title) {
    var list = [];
    for (var key in entries) {
        list.push([key, entries[key]]);
    }
    list.sort(function(a, b) {
        return b[1] - a[1];
    });

    new Chart(document.getElementById(elemId), {
        type: 'pie',
        data: {
            labels: list.map(x => x[0]),
            datasets: [{
                borderWidth: 4,
                borderColor: 'white',
                data: list.map(x => x[1]),
                //backgroundColor: list.map(x => toColor(x[0])),
                backgroundColor: ['#6a4c93', '#1982c4', '#8ac926', '#ef476f'],
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            tooltips: {
                mode: 'index'
            },
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: 'true'
                },
                align: 'center'
            },
            title: {
                display: true,
                text: title
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    }
                }, ],
            },
        },
    })

}


function sumHours(arr) {
    var sum = 0
    arr.forEach(el => sum += (data.hour[el] || 0))
    return sum
}


function drawTime() {
    new Chart(document.getElementById("time"), {
        type: 'bar',
        data: {
            labels: [
                'Morning',
                'Afternoon',
                'Evening',
                'Night',
            ],
            datasets: [{
                maxBarThickness: 10,
                data: [
                    sumHours([5, 6, 7, 8, 9, 10, 11]),
                    sumHours([12, 13, 14, 15]),
                    sumHours([16, 17, 18, 19, 20, 21]),
                    sumHours([22, 23, 24, 0, 1, 2, 3, 4]),
                ],
                backgroundColor: [
                    orange,
                    orange,
                    orange,
                    orange,
                ],
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index'
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Visits by time",
                position: "top",
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true,
                    }
                }, ],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                    }
                }, ],
            },
        },
    })
}


function drawRefChart() {
    var palette = ['#e9c46a', '#f4a261', '#e76f51']
    var otherColor = '#2a9d8f'
    var directColor = 'rgba(38, 70, 83, 0.1)'

    var topRefs = dGroupData(data.ref, 3)
    var total = sum(Object.values(data.date))
    var ref = sum(Object.values(data.ref))
    var direct = total - ref
    topRefs["Direct"] = direct

    var entries = []
    for (const [key, value] of Object.entries(topRefs)) {
        if (key === "Direct") {
            var color = directColor
        } else if (key === "Other") {
            var color = otherColor
        } else {
            var color = palette.pop()
        }
        entries.push({
            label: key,
            value: value,
            color: color
        })
    }

    new Chart(document.getElementById("ref_chart"), {
        type: 'pie',
        data: {
            labels: entries.map(x => x.label),
            datasets: [{
                borderWidth: 0.5,
                borderColor: 'black',
                data: entries.map(x => x.value),
                backgroundColor: entries.map(x => x.color),
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index'
            },
            legend: {
                position: 'left',
                labels: {
                    usePointStyle: 'true'
                },
                align: 'center'
            },
            title: {
                display: true,
                text: "Top Traffic Sources",
                position: "top",
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        display: false,
                    }
                }, ],
                yAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true,
                        display: false,
                    }
                }, ],
            },
        },
    })
}


function drawLastDays(elemId, date_keys, date_vals) {
    var num = 7
    var ctx = document.getElementById(elemId).getContext("2d")
    var gradientStroke = ctx.createLinearGradient(0, 0, 0, 200);
    gradientStroke.addColorStop(0, "rgba(47, 108, 162, 0.7)");
    gradientStroke.addColorStop(1, "rgba(47, 108, 162, 0.1)");


    new Chart(document.getElementById(elemId), {
        type: 'line',
        data: {
            labels: date_keys.slice(-1 * num).map(x => moment(x).format("DD MMMM")),
            datasets: [{
                data: date_vals.slice(-1 * num),
                label: 'Visits',
                backgroundColor: gradientStroke,
                borderColor: orange,
                //pointBorderColor: 'rgba(47, 108, 162, 0.5)',
                pointBackgroundColor: 'rgba(47, 108, 162, 1)',
                pointBorderWidth: 2,
            }, ],
        },
        options: {
            elements: {
                line: {
                    tension: 0
                }
            },
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "Last 7 days"
            },
            tooltips: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
            scales: {
                yAxes: [{
                    "scaleLabel": {
                        display: true,
                        labelString: "Visits",
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        userCallback: function(label) {
                            if (Math.floor(label) === label) return kFormat(label);
                        },
                    },
                    gridLines: {
                        display: true,
                    },
                }, ],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                }, ]
            },
            legend: {
                display: false
            },
        },
    })

}


function draw(user, data) {
    console.log("redrawing")
    document.getElementById("page-index").setAttribute('style', 'display: none !important');
    document.getElementById("page-graphs").style.display = "block"

    if (!window._inited) {
        alwaysUpdate()
        if (Object.keys(data.date).length === 0) {
            showTrackingCode()
        } else {
            hideTrackingCode()
        }
        window._inited = true
    }

    drawUsername(user)
    drawUTCOffsetVar()
    drawMap()
    drawTitle(user)
    drawTime()
    drawRefChart()


    var daysRange = function(s, e) {
        s = new Date(s)
        e = new Date(e)
        o = {}
        for (var a = [], d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            o[new Date(d).toISOString().substring(0, 10)] = 0;
        }
        return o;
    };

    function getNormalizedDateData() {
        keys = Object.keys(data.date)
        keys.sort((a, b) => {
            return a > b;
        });


        calc_min = getUTCMinusElevenNow()
        calc_min.setDate(calc_min.getDate() - 7)
        calc_min = calc_min.toISOString().substring(0, 10)

        if (keys.length != 0) {
            data_min = keys[0]
            if (new Date(data_min).getTime() < new Date(calc_min).getTime()) {
                min = data_min
            } else {
                min = calc_min
            }
        } else {
            min = calc_min
        }


        max = getUTCMinusElevenNow().toISOString().substring(0, 10)
        date_data = {...daysRange(min, max),
            ...data.date
        }

        return splitObject(date_data, true)
    }

    var date_keys;
    var date_vals;
    [date_keys, date_vals] = getNormalizedDateData()

    drawList("list_ref", data.ref, "All refferals", 5, false, true)
    drawList("list_loc", data.loc, "Landing pages", 5, false, false)
    drawCountries("world_list", data.country)
    drawLastDays("last_days_chart", date_keys, date_vals)
    drawPie("browser", dGroupData(data.browser, 3), "Browsers")
    drawPie("platform", dGroupData(data.platform, 3), "Platforms")
    drawPie("device", dGroupData(data.device, 3), "Devices")
    drawList("list_origin", data.origin, "Origins", 5, false, true)
    drawLog(5)

    //document.getElementById('val_visits').innerHTML = escapeHtml(date_vals.slice(-1)[0])

    var ctx = document.getElementById("graph").getContext("2d")
    var gradientStroke = ctx.createLinearGradient(0, 0, 0, 200);
    gradientStroke.addColorStop(0, "rgba(47, 108, 162, 0.5)");
    gradientStroke.addColorStop(1, "rgba(47, 108, 162, 1)");

    new Chart(document.getElementById("graph"), {
        type: 'bar',
        data: {
            labels: date_keys.map(x => x),
            datasets: [{
                maxBarThickness: 15,
                data: date_vals,
                label: 'Visits',
                backgroundColor: gradientStroke,
                borderColor: orange,
                pointBorderColor: orange,
                pointBackgroundColor: orange,
            }, ],
        },
        options: {
            title: {
                display: true,
                text: "All days"
            },
            tooltips: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: true,
                    },
                    "scaleLabel": {
                        display: true,
                        labelString: "Visits",
                    },
                    ticks: {
                        beginAtZero: true,
                        userCallback: function(label) {
                            if (Math.floor(label) === label) return kFormat(label);
                        },
                    },
                }, ],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    type: 'time',
                    time: {
                        unit: 'week'
                    },
                    "scaleLabel": {
                        display: false,
                        //labelString: "Date",
                    },
                }, ]
            },
            legend: {
                display: false
            },
        },
    })

    new Chart(document.getElementById("hour"), {
        type: 'radar',
        data: {
            labels: [
                "24",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
                "13",
                "14",
                "15",
                "16",
                "17",
                "18",
                "19",
                "20",
                "21",
                "22",
                "23",
            ],
            datasets: [{
                data: [
                    data['hour'][24] || 0,
                    data['hour'][0] || 0,
                    data['hour'][1] || 0,
                    data['hour'][2] || 0,
                    data['hour'][3] || 0,
                    data['hour'][4] || 0,
                    data['hour'][5] || 0,
                    data['hour'][6] || 0,
                    data['hour'][7] || 0,
                    data['hour'][8] || 0,
                    data['hour'][9] || 0,
                    data['hour'][10] || 0,
                    data['hour'][11] || 0,
                    data['hour'][12] || 0,
                    data['hour'][13] || 0,
                    data['hour'][14] || 0,
                    data['hour'][15] || 0,
                    data['hour'][16] || 0,
                    data['hour'][17] || 0,
                    data['hour'][18] || 0,
                    data['hour'][19] || 0,
                    data['hour'][20] || 0,
                    data['hour'][21] || 0,
                    data['hour'][22] || 0,
                    data['hour'][23] || 0,
                ],
                backgroundColor: orange,
                pointRadius: 1,
            }, ],
        },
        options: {
            title: {
                display: true,
                text: "Visits by hour",
                position: "top",
            },
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index'
            },
            legend: {
                display: false
            },
            scale: {
                gridLines: {
                    display: false,
                },
                ticks: {
                    display: false,
                }
            },
        },
    })

    new Chart(document.getElementById("weekday"), {
        type: 'radar',
        data: {
            labels: ['Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.', 'Su.'],
            datasets: [{
                data: [
                    data['weekday'][0] || 0,
                    data['weekday'][1] || 0,
                    data['weekday'][2] || 0,
                    data['weekday'][3] || 0,
                    data['weekday'][4] || 0,
                    data['weekday'][5] || 0,
                    data['weekday'][6] || 0,
                ],
                backgroundColor: orange,
            }, ],
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Visits by weekday',
                position: "top",
            },
            tooltips: {
                mode: 'index'
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true
                    }
                }, ],
                yAxes: [{
                    ticks: {
                        display: false,
                    },
                    gridLines: {
                        display: false,
                    },
                }, ],
            },
        },
    })
}

function dGroupData(entries, cutAt) {
    var entrs = Object.entries(entries)
    entrs = entrs.sort((a, b) => b[1] - a[1])
    entrs = entrs.sort((a, b) => a[0] === "Other" ? 1 : -1)
    var top = entrs.slice(0, cutAt)
    var bottom = entrs.slice(cutAt, -1)

    otherVal = 0
    bottom.forEach(el => otherVal += el[1])
    if (otherVal) {
        top.push(["Other", otherVal])
    }

    var res = Object.fromEntries(top)
    if ("Unknown" in res) {
        res["Other"] = (res["Other"] || 0) + res["Unknown"]
        delete res["Unknown"]
    }
    return res
}


function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function downloadData() {
    var csv = ""
    Object.keys(data).forEach(function(namespace, _) {
        Object.keys(data[namespace]).forEach(function(key, _) {
            var val = data[namespace][key]
            csv += (namespace + ',').padEnd(12, ' ') + (key + ',').padEnd(12, ' ') + val + '\n'
        });
    });
    download("swa-" + user + "-data.csv", csv)
}
