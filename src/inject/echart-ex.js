
var data = [{
  fixed: true,
  x: myChart.getWidth() / 2,
  y: myChart.getHeight() / 2,
  symbolSize: 10,
  id: '-1'
}];

option = {
  series: [{
      type: 'graph',
      layout: 'force',
      animation: false,
      data: data,
      force: {
          initLayout: 'circular',
          gravity: .1,
          repulsion: 20,
          edgeLength: 5
      },
      edges: edges
  }]
};

setInterval(function () {
  data.push({
      id: data.length
  });

  myChart.setOption({
      series: [{
          roam: true,
          data: data,
          edges: false,
          draggable: true,
          tooltip: {
            show: true,
            position: 'top'
          }
      }]
  });

}, 500);