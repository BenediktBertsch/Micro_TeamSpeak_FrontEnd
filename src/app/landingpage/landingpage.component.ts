import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { CheckAuthService } from '../check-auth.service'
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { Translate } from '../translate.service'
import { environment } from '../../environments/environment';
interface translationLandingpage {
  Title: string,
  Toplist: string,
  Percentage: string,
  Users: string
}
interface chart {
  username: string,
  times: string,
  percentage: BigInteger,
  dates: string,
  usersperdate: string
}
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  constructor(private title: Title, public http: HttpClient, private router: Router, private snackBar: MatSnackBar, public translate: TranslateService) { }
  translation = new Translate(this.translate)
  translationready = false
  Highcharts = Highcharts
  chartMaxtime = {}
  chartPercentage = {}
  chartUsersperday = {}
  charts = false
  theme = {}
  chartTime: any
  time = Number 
  minutes = Number 
  hours = Number
  seconds = Number
  checkService = new CheckAuthService(this.translate, this.router, this.snackBar)
  ngOnInit() {
    this.setTheme()
    this.checkService.checking()
    this.getData()
    window.setInterval(() => {
      this.checkService.checking()
      this.getData()
      this.changeTheme()
    }, 60000);
  }
  getData() {
    this.translate.get('Landingpage').subscribe((value: translationLandingpage) => {
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
      this.http
        .get(environment.apiAddress + '/v1/pagedata', {
        })
        .subscribe((res: chart) => {
          this.chartTime = {
            chart: {
              type: 'column',
              height: 445, //300
              width: window.innerWidth/2, //470
              borderRadius: 5,
            },
            title: {
              text: value.Toplist
            },
            xAxis: {
              labels: false
            },
            tooltip: {
              formatter: function() {
                function format(time: string | number){
                  if(time < 10){
                    return '0' + time
                  }
                  if(time < 1){
                    return '00'
                  }
                  else{
                    return time
                  }
                }
                this.time = this.y
                this.seconds = this.time/1000
                this.hours = Math.round(this.seconds/3600)
                this.seconds = this.seconds % 3600
                this.minutes = Math.round(this.seconds/60)
                this.seconds = this.seconds % 60
                return  '<b>' + this.series.name +'</b><br/>' + format(this.hours) + ':' + format(this.minutes) + ':' + format(this.seconds)
              }
          },
            yAxis:
            {
              title: {
                text: 'Time (hh:mm:ss)'
              },
              type: 'datetime',
              showFirstLabel: false,
              labels: {
                formatter: function () {
                  var hours, mins, secs
                  var charthours = Math.floor(this.value / 3600000)
                  var chartmins = Math.floor((this.value % 3600000) / 60000)
                  var chartsecs = Math.floor(((this.value % 3600000) % 60000) / 1000)
                  if (charthours < 10) { hours = '0' + charthours } else { hours = charthours }
                  if (chartmins < 10) { mins = '0' + chartmins } else { mins = chartmins }
                  if (chartsecs < 10) { secs = '0' + chartsecs } else { secs = chartsecs }
                  if (charthours < 1 && chartmins < 1) {
                    return '00:00:' + secs
                  } else {
                    if (charthours < 1) {
                      return '00:' + mins + ':' + secs
                    }
                    else {
                      return hours + ':' + mins + ':' + secs
                    }
                  }
                }
              }
            },
            credits: {
              enabled: false
            },
            plotOptions: {
              line: {
                dataLabels: {
                  enabled: true
                },
                enableMouseTracking: false
              }
            },
            series: [{
              name: [res.username[0]],
              data: [res.times[0]],
              color: '#00B247'
            }, {
              name: [res.username[1]],
              data: [res.times[1]],
              color: '#B2651E'
            }, {
              name: [res.username[2]],
              data: [res.times[2]],
              color: '#1A3BB2'
            }, {
              name: [res.username[3]],
              data: [res.times[3]],
              color: '#0065B2'
            }, {
              name: [res.username[4]],
              data: [res.times[4]],
              color: '#00B2B2'
            },]
          }
          this.chartPercentage = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              type: 'pie',
              height: 400, //300
              width: window.innerWidth/2.5, //470
              borderRadius: 5,
            },
            title: {
              text: value.Percentage
            },
            credits: {
              enabled: false
            },
            tooltip: {
              formatter: function() {
                return  '<b>' + this.series.name +'</b><br/>' + Math.round(this.y)
              }
          },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: false
                },
                showInLegend: true
              }
            },
            series: [{
              name: 'Percentage',
              data: [{
                name: 'Registered',
                y: res.percentage[0],
                color: '#EE964B'
              },
              {
                name: 'Unregistered',
                y: res.percentage[1],
                color: '#F4D35E'
              }],
              color: '#68B684'
            }]
          };
          this.chartUsersperday = {
            chart: {
              type: 'line',
              height: 500, //300
              width: window.innerWidth, //470
              borderRadius: 5,
            },
            title: {
              text: value.Users
            },
            xAxis: {
              categories: res.dates
            },
            yAxis:{
              title: {
                text: 'Number of Users'
              },
            },
            credits: {
              enabled: false
            },
            plotOptions: {
              line: {
                dataLabels: {
                  enabled: true
                },
                enableMouseTracking: false
              }
            },
            series: [{
              name: [res.dates[0] + ' - ' + res.dates[res.dates.length - 1]],
              data: res.usersperdate,
              color: '#D9FE0F'
            }]
          };
          this.charts = true;
        })
    })
  }
  ngOnDestroy() {
    if (window.setInterval) {
      window.clearInterval()
    }
  }
  changeTheme(){
    this.setTheme()
    this.chartTime.yAxis.isDirty = true
    this.chartTime.redraw()
  }
  setTheme() {
    if (localStorage.getItem('theme') == 'dark') {
      this.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
          '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
          backgroundColor: '#424242',
          style: {
            fontFamily: '\'Unica One\', sans-serif',
            fontSize: '13px'
          },
          plotBorderColor: '#606063'
        },
        title: {
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '13px'
          }
        },
        subtitle: {
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase'
          }
        },
        xAxis: {
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          title: {
            style: {
              color: '#A0A0A3'

            }
          }
        },
        yAxis: {
          gridLineColor: '#707073',
          labels: {
            style: {
              color: '#E0E0E3',
              fontSize: '13px'
            }
          },
          lineColor: '#707073',
          minorGridLineColor: '#505053',
          tickColor: '#707073',
          tickWidth: 1,
          title: {
            style: {
              color: '#A0A0A3'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: {
            color: '#F0F0F0'
          }
        },
        plotOptions: {
          series: {
            dataLabels: {
              color: '#B0B0B3'
            },
            marker: {
              lineColor: '#333'
            }
          },
          boxplot: {
            fillColor: '#505053'
          },
          candlestick: {
            lineColor: 'white'
          },
          errorbar: {
            color: 'white'
          }
        },
        legend: {
          itemStyle: {
            color: '#E0E0E3'
          },
          itemHoverStyle: {
            color: '#FFF'
          },
          itemHiddenStyle: {
            color: '#606063'
          }
        },
        credits: {
          style: {
            color: '#666'
          }
        },
        labels: {
          style: {
            color: '#707073'
          }
        },
        drilldown: {
          activeAxisLabelStyle: {
            color: '#F0F0F3'
          },
          activeDataLabelStyle: {
            color: '#F0F0F3'
          }
        },
        navigation: {
          buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
              fill: '#505053'
            }
          }
        },
        // scroll charts
        rangeSelector: {
          buttonTheme: {
            fill: '#505053',
            stroke: '#000000',
            style: {
              color: '#CCC'
            },
            states: {
              hover: {
                fill: '#707073',
                stroke: '#000000',
                style: {
                  color: 'white'
                }
              },
              select: {
                fill: '#000003',
                stroke: '#000000',
                style: {
                  color: 'white'
                }
              }
            }
          },
          inputBoxBorderColor: '#505053',
          inputStyle: {
            backgroundColor: '#333',
            color: 'silver'
          },
          labelStyle: {
            color: 'silver'
          }
        },
        navigator: {
          handles: {
            backgroundColor: '#666',
            borderColor: '#AAA'
          },
          outlineColor: '#CCC',
          maskFill: 'rgba(255,255,255,0.1)',
          series: {
            color: '#7798BF',
            lineColor: '#A6C7ED'
          },
          xAxis: {
            gridLineColor: '#505053'
          }
        },
        scrollbar: {
          barBackgroundColor: '#808083',
          barBorderColor: '#808083',
          buttonArrowColor: '#CCC',
          buttonBackgroundColor: '#606063',
          buttonBorderColor: '#606063',
          rifleColor: '#FFF',
          trackBackgroundColor: '#404043',
          trackBorderColor: '#404043'
        },
        // special colors for some of the
        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
      };
    } else {
      this.theme = {
        colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
          '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
          backgroundColor: null,
          style: {
            fontFamily: 'Dosis, sans-serif'
          }
        },
        title: {
          style: {
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }
        },
        tooltip: {
          borderWidth: 0,
          backgroundColor: 'rgba(219,219,216,0.8)',
          shadow: false
        },
        legend: {
          itemStyle: {
            fontWeight: 'bold',
            fontSize: '13px'
          }
        },
        xAxis: {
          gridLineWidth: 1,
          labels: {
            style: {
              fontSize: '13px'
            }
          }
        },
        yAxis: {
          minorTickInterval: 'auto',
          title: {
            style: {
              textTransform: 'uppercase',
              fontSize: '13px'
            }
          },
          labels: {
            style: {
              fontSize: '13px'
            }
          }
        },
        plotOptions: {
          candlestick: {
            lineColor: '#404048'
          }
        },
        // General
        background2: '#F0F0EA'
      }
    }
    Highcharts.setOptions(this.theme);
    
  }
}
