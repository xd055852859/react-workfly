const traditionalDate = {
  madd: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
  tgString: '甲乙丙丁戊己庚辛壬癸',
  dzString: '子丑寅卯辰巳午未申酉戌亥',
  numString: '一二三四五六七八九十',
  monString: '正二三四五六七八九十冬腊',
  weekString: '日一二三四五六',
  sx: '鼠牛虎兔龙蛇马羊猴鸡狗猪',
  cYear: 0,
  cMonth: 0,
  cDay: 0,
  TheDate: 0,
  calendarData: [
    0xa4b,
    0x5164b,
    0x6a5,
    0x6d4,
    0x415b5,
    0x2b6,
    0x957,
    0x2092f,
    0x497,
    0x60c96,
    0xd4a,
    0xea5,
    0x50da9,
    0x5ad,
    0x2b6,
    0x3126e,
    0x92e,
    0x7192d,
    0xc95,
    0xd4a,
    0x61b4a,
    0xb55,
    0x56a,
    0x4155b,
    0x25d,
    0x92d,
    0x2192b,
    0xa95,
    0x71695,
    0x6ca,
    0xb55,
    0x50ab5,
    0x4da,
    0xa5b,
    0x30a57,
    0x52b,
    0x8152a,
    0xe95,
    0x6aa,
    0x615aa,
    0xab5,
    0x4b6,
    0x414ae,
    0xa57,
    0x526,
    0x31d26,
    0xd95,
    0x70b55,
    0x56a,
    0x96d,
    0x5095d,
    0x4ad,
    0xa4d,
    0x41a4d,
    0xd25,
    0x81aa5,
    0xb54,
    0xb6a,
    0x612da,
    0x95b,
    0x49b,
    0x41497,
    0xa4b,
    0xa164b,
    0x6a5,
    0x6d4,
    0x615b4,
    0xab6,
    0x957,
    0x5092f,
    0x497,
    0x64b,
    0x30d4a,
    0xea5,
    0x80d65,
    0x5ac,
    0xab6,
    0x5126d,
    0x92e,
    0xc96,
    0x41a95,
    0xd4a,
    0xda5,
    0x20b55,
    0x56a,
    0x7155b,
    0x25d,
    0x92d,
    0x5192b,
    0xa95,
    0xb4a,
    0x416aa,
    0xad5,
    0x90ab5,
    0x4ba,
    0xa5b,
    0x60a57,
    0x52b,
    0xa93,
    0x40e95,
  ],
  formatTraditional(targetDate) {
    // calendar = new Date();
    // month = calendar.getMonth();
    // date = calendar.getDate();
    // if (month == 0 && date == 1) document.write('元旦');
    // if (month == 2 && date == 12) document.write('植树节');
    // if (month == 3 && date == 5) document.write('清明节');
    // if (month == 4 && date == 1) document.write('国际劳动节');
    // if (month == 4 && date == 4) document.write('青年节');
    // if (month == 5 && date == 1) document.write('国际儿童节');
    // if (month == 7 && date == 1) document.write('建军节');
    // if (month == 7 && date == 16) document.write('七夕情人节');
    // if (month == 9 && date == 1) document.write('国庆节/国际音乐节/国际老人节');
    // if (month == 11 && date == 24) document.write('平安夜');
    // if (month == 11 && date == 25) document.write('圣诞节');
    /*农历部分*/
  },
  GetBit(m, n) {
    return (m >> n) & 1;
  },
  e2c() {
    this.TheDate =
      arguments.length !== 3 ?
      new Date() :
      new Date(arguments[0], arguments[1], arguments[2]);
    let total, m, n, k;
    let isEnd = false;
    let tmp = this.TheDate.getYear();
    if (tmp < 1900) {
      tmp += 1900;
    }
    total =
      (tmp - 1921) * 365 +
      Math.floor((tmp - 1921) / 4) +
      this.madd[this.TheDate.getMonth()] +
      this.TheDate.getDate() -
      38;
    if (this.TheDate.getYear() % 4 === 0 && this.TheDate.getMonth() > 1) {
      total++;
    }
    for (m = 0;; m++) {
      k = this.calendarData[m] < 0xfff ? 11 : 12;
      for (n = k; n >= 0; n--) {
        if (total <= 29 + this.GetBit(this.calendarData[m], n)) {
          isEnd = true;
          break;
        }
        total = total - 29 - this.GetBit(this.calendarData[m], n);
      }
      if (isEnd) break;
    }
    this.cYear = 1921 + m;
    this.cMonth = k - n + 1;
    this.cDay = total ;
    if (k === 12) {
      if (this.cMonth === Math.floor(this.calendarData[m] / 0x10000) + 1) {
        this.cMonth = 1 - this.cMonth;
      }
      if (this.cMonth > Math.floor(this.calendarData[m] / 0x10000) + 1) {
        this.cMonth--;
      }
    }
  },
  GetcDateString() {
    let tmp = ['', '', ''];
    tmp[0] += this.tgString.charAt((this.cYear - 4) % 10);
    tmp[0] += this.dzString.charAt((this.cYear - 4) % 12);
    tmp[0] += '(';
    tmp[0] += this.sx.charAt((this.cYear - 4) % 12);
    tmp[0] += ')年 ';
    if (this.cMonth < 1) {
      tmp[0] += '(闰)';
      tmp[1] += this.monString.charAt(-this.cMonth - 1);
    } else {
      tmp[1] += this.monString.charAt(this.cMonth - 1);
    }
    tmp[1] += '月';
    tmp[2] +=
      this.cDay < 11 ?
      '初' :
      this.cDay < 20 ?
      '十' :
      this.cDay < 30 ?
      '廿' :
      this.cDay === 20 ?
      '二十' :
      '三十';
    if (this.cDay % 10 !== 0 || this.cDay === 10) {
      tmp[2] += this.numString.charAt((this.cDay - 1) % 10);
    }
    // if (this.cMonth == 0 && this.cDay == 1) tmp[2] = '元旦';
    // if (this.cMonth == 2 && this.cDay == 12) tmp[2] = '植树节';
    // if (this.cMonth == 3 && this.cDay == 5) tmp[2] = '清明节';
    // if (this.cMonth == 4 && this.cDay == 1) tmp[2] = '国际劳动节';
    // if (this.cMonth == 4 && this.cDay == 4) tmp[2] = '青年节';
    // if (this.cMonth == 5 && this.cDay == 1) tmp[2] = '国际儿童节';
    // if (this.cMonth == 7 && this.cDay == 1) tmp[2] = '建军节';
    // if (tmp[1] + tmp[2] === '七月初七') tmp[2] = '七夕情人节';
    // if (this.cMonth == 9 && this.cDay == 1) tmp[2] = '国庆节';
    // if (this.cMonth == 11 && this.cDay == 24) tmp[2] = '平安夜';
    // if (this.cMonth == 11 && this.cDay == 25) tmp[2] = '圣诞节';
    return tmp;
  },
  GetLunarDay(targetDate) {
    let solarYear = targetDate.year();
    let solarMonth = targetDate.month() + 1;
    let solarDay = targetDate.date();
    // let ww = D.getDay();
    // let ss = parseInt(D.getTime() / 1000);
    //solarYear = solarYear<1900?(1900+solarYear):solarYear;
    solarMonth = solarMonth > 0 ? solarMonth - 1 : 11;
    this.e2c(solarYear, solarMonth, solarDay);
    return this.GetcDateString();

  },
  // let D = new Date();
  // let yy = D.getFullYear();
  // let mm = D.getMonth() + 1;
  // let dd = D.getDate();
  // let ww = D.getDay();
  // let ss = parseInt(D.getTime() / 1000);
  // if (yy < 100) yy = '19' + yy;
  // function showCal() {
  //   document.write(GetLunarDay(yy, mm, dd));
  // }
  // showCal();
};
export default traditionalDate;