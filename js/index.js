var options = {
    render: {
        //绘制图形
        canvas: function (name) {

        },
        refresh: function (name) {

        }
    },
    style: {
        container: {
            'background-color': '#EEEEEE',
        },
        title: {
            //height: 22
        },
        line: {
            width: 10,
            height: 10,
            'background-color': 'xxx',
            'border': 'xxx'
        },
        row: {
            'background-color': 'xxx',
            'border': 'xxx'
        },
        column: {
            'background-color': 'xxx',
            'border': 'xxx'
        },
    },
    //布局
    layout: [
        {
            id: '1',
            height: 70,
            canvas: 'canvas name',
            cascade: ['ccc', 'nnn'],
            columns: [{
                id: '1-1',
                width: '25%',
                canvas: 'canvas name',
            }, {
                id: '1-2',
                width: '25%',
                canvas: 'canvas name',
            }, {
                id: '1-3',
                width: '25%',
                canvas: 'canvas name',
            }, {
                id: '1-4',
                width: '25%',
                canvas: 'canvas name',
            }]
        },
        {
            height: 250,
            columns: [{
                //id: 'ccc',
                width: 260,
                canvas: 'canvas name',
                rows: [{
                    id: '2-1',
                    height: 60,
                    canvas: 'canvas name'
                }, {
                    id: '2-2',
                    height: 60,
                    canvas: 'canvas name'
                }]
            }, {
                id: 'nnn',
                width: 'auto',
                canvas: 'canvas name',
                title: '关键任务状态-进展图'
            }]
        }
        , {
            height: 'auto',
            columns: [{
                id: 'ddd',
                width: 260,
                canvas: 'canvas name',
                title: '关键任务进展-进度列表'
            }, {
                id: 'mmm',
                width: 'auto',
                canvas: 'canvas name',
                title: '执行项目分类统计-柱状图 '
            }]
        }
    ]
};

$('#board').board(options);

setTimeout(function () {
    $('#board').board('load', [
        {
            height: 250,
            columns: [{
                //id: 'ccc',
                width: 260,
                canvas: 'canvas name',
                rows: [{
                    id: '2-1',
                    height: 60,
                    canvas: 'canvas name'
                }, {
                    id: '2-2',
                    height: 60,
                    canvas: 'canvas name'
                }]
            }, {
                id: 'nnn',
                width: 'auto',
                canvas: 'canvas name',
                title: '关键任务状态-进展图'
            }]
        }
        , {
            height: 'auto',
            columns: [{
                id: 'ddd',
                width: 260,
                canvas: 'canvas name',
                title: '关键任务进展-进度列表'
            }, {
                id: 'mmm',
                width: 'auto',
                canvas: 'canvas name',
                title: '执行项目分类统计-柱状图 '
            }]
        }
    ]);

    //$('#board').board('destroy');
    $('#board').board(options);

}, 2000);
