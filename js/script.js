var cnt = 50
var interval = 1
var value = []
var color = []
var prev = []
const tclr = ['#4b5de4', '#ff4500', '#90ee90']
const f = 0.66702
var min = -10
var len = 0
var its = 0
var canvas = $('#mycanvas')[0]
var width = canvas.width;
var height = canvas.height;
canvas = canvas.getContext('2d')
var avcnt = 0
var dist = []
var fret = []
var plotf = 1

function restart() {
    cnt = Math.round($('#cnt').val())
    value = []
    color = []
    prev = []
    min = -10
    len = 0
    its = 0
    avcnt = 0
    dist = []
    fret = []
    for (i = 0; i < cnt; i++) {
        value.push(Math.random());
        prev.push(0);
        color.push(tclr[0]);
    }
    timer = setInterval(step, interval);

}

function add(a, x) {
    while (a.length <= x) {
        a.push(0);
    }
    a[x] += 1;
}

function step() {
    its++;
    $('#it').html(its);
    for (i = 0; i < cnt; i++) {
        color[i] = tclr[0]
    }
    for (i = cnt - 1; i < cnt + 2; i++) {
        value[(min + i) % cnt] = Math.random();
        color[(min + i) % cnt] = tclr[2];
    }
    pmin = min;
    min = 0
    for (i = 1; i < cnt; i++) {
        if (value[i] < value[min]) {
            min = i;
        }
    }
    if (value[min] > f) {
        avcnt++;
        $('#av').html(avcnt);
    }
    t = Math.abs(pmin - min)
    t = Math.min(t, cnt - t)
    add(dist, t)
    add(fret, its - prev[min])
    prev[min] = its;
    if (plotf) {
        distplot.replot({data: [dist]}); 
        fretplot.replot({data: [fret]});
    }
    
    color[min] = tclr[1];
    draw();
}

function draw() {
    canvas.fillStyle = 'white';
    canvas.fillRect(0, 0, width, height);
    for (i = 0; i < cnt; i++) {
        canvas.fillStyle = color[i];
        canvas.fillRect(width * i / cnt, height - Math.round(height * value[i]), Math.ceil(width / cnt), Math.round(height * value[i]));
    }
    canvas.beginPath();
    canvas.strokeStyle = 'red';
    canvas.moveTo(0, height * (1 - f));
    canvas.lineTo(width, height * (1 - f));
    canvas.stroke();
}

$('#slider').change(function() {
    clearInterval(timer);
    interval = 1000 - $('#slider').val();
    timer = setInterval(step, interval);
});

$('#donotplot').change(function() {
    plotf = ! $('#donotplot').prop('checked');
});

distplot = $.jqplot('distdiv', [[1, 0]], {
    title: 'Распределение расстояния между последующими минимумами',
    axes: {
        xaxis: {
            //label: 'Расстояние между минимумами',
            renderer: $.jqplot.LogAxisRenderer,
        },
        yaxis: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            renderer: $.jqplot.LogAxisRenderer,
        },
    },
    series: [{
        color: '#5555EE',
        //showLine: false,
        markerOptions: {
            size: 5
        }

    }]
});

fretplot = $.jqplot('fretdiv', [[1, 0]], {
    title: 'Распределение времени первого возврата',
    axes: {
        xaxis: {
            //label: 'Время первого возврата',
            renderer: $.jqplot.LogAxisRenderer,
        },
        yaxis: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
            renderer: $.jqplot.LogAxisRenderer,
        },
    },
    series: [{
        color: '#5555EE',
        showLine: false,
        markerOptions: {
            size: 5
        }

    }]
});