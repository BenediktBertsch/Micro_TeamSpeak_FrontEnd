import { Component, OnInit, Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'
import * as moment from 'moment'
import * as Highcharts from 'highcharts'
import { CheckAuthService } from '../check-auth.service'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { Translate } from '../translate.service'
import { environment } from '../../environments/environment'
interface translationDashboard {
  Title: string,
  Logpanel: string,
  Type: string,
  Types: {
    connect: string,
    disconnect: string
  }
  Activepanel: {
    title: string,
    activity: string,
    left: string
  },
  Informationpanel: {
    Information: string,
    Name: string,
    Rank: string,
    Frontpageswitch: string,
    DeleteAccount: string,
    Update: string,
    UpdateNow: string,
    Password: string
  },
  DeleteSuccess: string,
  UpdateSuccess: string
}
interface UserData {
  date: string[];
  times: number[];
  typelog: string[];
  timelog: string[];
  timeperday: number[];
  userdata: {
    username: string,
    rank: string,
    teamspeakid: string,
    profileURL: string,
    showbool: number
  }
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
@Injectable()
export class DashboardComponent implements OnInit {
  constructor(private translate: TranslateService, private title: Title, public http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }
  translation = new Translate(this.translate)
  Highcharts = Highcharts
  chartOptions = {}
  checkService = new CheckAuthService(this.translate, this.router, this.snackBar)
  name:string
  rank:string
  teamspeakid:string
  profileurl:string
  password:string
  showbool:boolean
  timelogs = []
  timeperdayformat = []
  timeperday = []
  typelog = []
  date = []
  times = []
  chart = []
  logready = false
  chartready = false
  language = null
  type:string
  typeconnect:string
  typedisconnect:string
  chartActivityTitle:string
  chartActivityActive:string
  chartActivityLeft:string
  deletesuccess:string
  updatesuccess:string
  theme = {}
  ngOnInit() {
    this.translate.get('Dashboard').subscribe((value: translationDashboard) => {
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
      this.setTheme()
      Highcharts.setOptions(this.theme);
      this.password = value.Informationpanel.Password
      this.type = value.Type
      this.typeconnect = value.Types.connect
      this.typedisconnect = value.Types.disconnect
      this.chartActivityActive = value.Activepanel.activity
      this.chartActivityLeft = value.Activepanel.left
      this.chartActivityTitle = value.Activepanel.title
      this.deletesuccess = value.DeleteSuccess
      this.updatesuccess = value.UpdateSuccess
    })
    this.GetUserData()
    this.GetLanguage()
    //every minute 
    window.setInterval(() => {
      //Check if Token is still valid
      this.checkService.checking()
      //Getting userdata
      if (localStorage.getItem('auth-token') != null) {
        this.GetUserData()
      }
    }, 60000);
  }
  GetUserData() {
    this.http
      .get(environment.apiAddress + '/v1/getuserdata?userid=' + localStorage.getItem('userid'), {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
      })
      .subscribe((res: UserData) => {
        this.name = res.userdata.username
        this.rank = res.userdata.rank
        this.teamspeakid = res.userdata.teamspeakid
        if (res.userdata.profileURL == null) {
          this.profileurl = "https://www.flynz.co.nz/wp-content/uploads/profile-placeholder.png"
        } else {
          this.profileurl = res.userdata.profileURL
        }
        this.timeperday = res.timeperday
        this.timelogs = res.timelog
        this.typelog = res.typelog
        this.times = res.times
        this.date = res.date
        if (res.userdata.showbool == 1) {
          this.showbool = true;
        } else {
          this.showbool = false;
        }
        this.chartOptions = {
          chart: {
            type: 'column',
            height: 300, //300
            width: window.innerWidth/3, //470
            borderRadius: 5,
          },
          title: {
            text: this.chartActivityTitle
          },
          xAxis: {
            categories: this.date
          },
          tooltip: {
            formatter: function() {
              function format(time){
                if(time < 10){
                  return '0' + time
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
              text: this.chartActivityLeft
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
            name: this.chartActivityActive,
            data: this.times,
            color: '#D9FE0F'
          }]
        };
        this.chartready = true;
        if (this.language == null) {
          moment.locale('en')
        }
        else {
          moment.locale(this.language)
        }
        for (let index = this.timelogs.length; index > -1; index--) {
          if (this.timelogs[index] != undefined) {
            if (this.typelog[index] == 'c') {
              this.timelogs[index] = moment(this.timelogs[index]).format('llll') + ' ' + this.type + ' : ' + this.typeconnect
            } else {
              this.timelogs[index] = moment(this.timelogs[index]).format('llll') + ' ' + this.type + ' : ' + this.typedisconnect
            }
          }
        }
        this.logready = true;
      });
  }
  OnUpdateButton(password: string, username: string, teamspeakid: string, profileurl: string): void {
    if (password != '') {
      this.http
        .post(environment.apiAddress + '/v1/updatepassword?userid=' + localStorage.getItem('userid') + '&password=' + password, {}, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
        }).subscribe(res => {

        })
    }
    if (username != '') {
      this.http
        .post(environment.apiAddress + '/v1/updateusername?userid=' + localStorage.getItem('userid') + '&username=' + username, {}, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
        }).subscribe(res => {

        })
    }
    if (teamspeakid != '') {
      this.http
        .post(environment.apiAddress + '/v1/updateteamspeakid?userid=' + localStorage.getItem('userid') + '&teamspeakid=' + teamspeakid, {}, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
        }).subscribe(res => {

        })
    }
    if (profileurl != '') {
      this.http
        .post(environment.apiAddress + '/v1/updateprofileurl?userid=' + localStorage.getItem('userid') + '&profileurl=' + profileurl, {}, {
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
        }).subscribe(res => {

        })
    }
    this.snackBar.open(this.updatesuccess, 'x', { duration: 2000 })
    this.GetUserData()
  }
  OnDeleteButton() {
    this.http
      .post(environment.apiAddress + '/v1/deleteuser?userid=' + localStorage.getItem('userid'), {}, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
      }).subscribe(res => {

      })
    this.snackBar.open(this.deletesuccess, 'x', { duration: 2000 })
    localStorage.removeItem('auth-token')
    localStorage.removeItem('userid')
    this.router.navigate(['/'])
  }
  updateShow() {
    var helper;
    if (this.showbool) {
      helper = 1
    } else {
      helper = 0
    }
    this.http
      .post(environment.apiAddress + '/v1/updateshow?userid=' + localStorage.getItem('userid') + '&showbool=' + helper, {}, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('auth-token')),
      }).subscribe(res => {

      })
  }
  GetLanguage() {
    this.language = navigator.language
  }
  ngOnDestroy() {
    if (window.setInterval) {
      window.clearInterval()
    }
  }
  setTheme(){
    if (localStorage.getItem('theme') == 'dark') {
      this.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
          '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
          backgroundColor: '#424242',
          style: {
            fontFamily: '\'Unica One\', sans-serif'
          },
          plotBorderColor: '#606063'
        },
        title: {
          style: {
            color: '#E0E0E3',
            textTransform: 'uppercase',
            fontSize: '12px'
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
              color: '#E0E0E3'
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
              color: '#E0E0E3'
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
            fontSize: '12px',
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
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          minorTickInterval: 'auto',
          title: {
            style: {
              textTransform: 'uppercase'
            }
          },
          labels: {
            style: {
              fontSize: '12px'
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