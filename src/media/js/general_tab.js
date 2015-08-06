var drawGeneralRevenueChart = function(container_id){
    var $chartContainer = $('#' + container_id);
    $chartContainer.css('height', parseInt($chartContainer.attr('data-height'))).html('');
    var chart = createRevenueChart();
    chart.container(container_id);
    chart.draw();
    return chart;
};

var setGeneralRevenueData = function(chart, data){
    var data_set = anychart.data.set(data);
    chart.getSeries(0).data(data_set.mapAs({value: [1], x: [0]}));
    tooltipContentForChart(chart.getSeries(0), 'revenue-sold', data);

    chart.getSeries(1).data(data_set.mapAs({value: [2], x: [0]}));
    tooltipContentForChart(chart.getSeries(1), 'revenue-sold', data);
};

var drawGeneralKeyMetricTable = function(container_id){
    var $chartContainer = $('#' + container_id);
    $chartContainer.css('height', parseInt($chartContainer.attr('data-height'))).html('');

    var stage = anychart.graphics.create(container_id);
    var table = anychart.ui.table();
    table.cellBorder(null);

    table.fontFamily("'Verdana', Helvetica, Arial, sans-serif")
        .fontSize(11)
        .useHtml(true)
        .fontColor(darkAccentColor)
        .vAlign('middle');
    table.getRow(0).cellBorder().bottom('1px #dedede');
    table.getRow(0).vAlign('bottom');
    table.contents([
        ['Last 12 months', null, 'Metric', 'Variance from plan', 'Current']
    ]);

    table.getRow(0).height(35);
    table.getCol(1).width(20);
    table.getCol(3).hAlign('center');
    table.getCol(4).hAlign('right');
    table.getCol(2).width(70);
    table.getCol(4).width(80);
    table.container(stage).draw();
    return table
};

var setGeneralKeyMetricData = function(table, data){
    table.contents([
        [
            'Last 12 months',
            null,
            'Metric',
            'Variance from plan',
            'Current'
        ],
        [
            createSparkLine(data['revenue']['last']),
            null,
            'Revenue',
            createBulletChart(-50, 50, data['revenue']['value'], data['revenue']['target'], data['revenue']['invert']),
            '$' + data['revenue']['value']
        ],
        [
            createSparkLine(data['profit']['last']),
            null,
            'Profit',
            createBulletChart(-50, 50, data['profit']['value'], data['profit']['target'], data['profit']['invert']),
            '$' + data['profit']['value']
        ],
        [
            createSparkLine(data['expenses']['last']),
            null,
            'Expenses',
            createBulletChart(-50, 50, data['expenses']['value'], data['expenses']['target'], data['expenses']['invert']),
            '$' + data['expenses']['value']
        ],
        [
            createSparkLine(data['order_size']['last']),
            null,
            'Average <br/>order size',
            createBulletChart(-50, 50, data['order_size']['value'], data['order_size']['target'], data['order_size']['invert']),
            data['order_size']['value'] + ' bottles'
        ],
        [
            createSparkLine(data['customers']['last']),
            null,
            'New <br/>customers',
            createBulletChart(-50, 50, data['customers']['value'], data['customers']['target'], data['customers']['invert']),
            data['customers']['value']
        ],
        [
            createSparkLine(data['market_share']['last']),
            null,
            'Market<br/>share',
            createBulletChart(-50, 50, data['market_share']['value'], data['market_share']['target'], data['market_share']['invert']),
            data['market_share']['value'] + '%'
        ],
        [
            null,
            null,
            null,
            createBulletScale(50, -50, 50, '%'),
            null
        ]
    ]);
    table.getRow(7).vAlign('top');
    table.getRow(7).height(20);
};

var draw5TopChart = function(container_id){
    var $chartContainer = $('#' + container_id);
    $chartContainer.css('height', parseInt($chartContainer.attr('data-height'))).html('');
    return acgraph.create(container_id);
};

var changeDataFor5Top = function(stage, data, type, old_chart){
    if (old_chart) old_chart.dispose();

    var label_src = './src/media/i/bar.jpg';
    var new_type = 'bar';
    if (type == 'bar'){
        label_src = './src/media/i/pie.jpg';
        new_type = 'pie';
        var bar_data = data.slice(0, data.length - 1);
        var chart = anychart.bar();
        chart.yAxis().enabled(false);
        chart.xAxis().title().enabled(false);
        chart.xAxis().labels().padding(0,5,0,0).fontSize(11);
        chart.padding(0, 12, 0, 0);
        var series = chart.bar(bar_data);
        series.pointWidth('50%');
        tooltipContentForChart(series, 'with_percent');
    } else {
        chart = anychart.pie(data);
        chart.stroke('3 #fff');
        chart.radius('30%');
        chart.padding(0);
        chart.hoverStroke(null);
        chart.labels().fontSize(11).position('o');
        chart.labels().textFormatter(function(){return this.x});
        tooltipContentForChart(chart, 'with_percent');
    }
    var label = chart.label();
    label.enabled(true)
        .position('rightTop').anchor('rightTop')
        .width(25).height(25).text('')
        .background({enabled: true, fill: {src: label_src}, stroke: null});

    label.listen('click', function () {
        changeDataFor5Top(stage, data, new_type, chart);
    });
    chart.title(null);
    chart.container(stage);
    chart.legend().enabled(false);
    chart.background(null);
    chart.draw();
    return chart;
};