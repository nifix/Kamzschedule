export default class Kamzdule {
  constructor(week) {
    this._dataFile = './assets/schedule.json';
    this._dataSchedule = null;
    this._week = week != null ? week : this.getCurrentWeek(new Date());

    this.changeHeader();
  }

  getCurrentWeek(curDate) {
    curDate = new Date(
      Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate())
    );
    let dayNum = curDate.getUTCDay() || 7;
    curDate.setUTCDate(curDate.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(curDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((curDate - yearStart) / 86400000 + 1) / 7);
  }

  changeHeader() {
    let curWeek = this.getWeek ? this.getWeek : this.getCurrentWeek(new Date());
    document.getElementById(
      'titleSchedule'
    ).innerHTML = `Kamz Schedule (Week ${curWeek})`;
    this.addEvents();
  }

  resetSchedule() {
    let elements = document.querySelectorAll("div[id^='schedule-'");
    for (let i = 0; i < elements.length; i++) {
      elements[i].innerHTML = '';
    }
  }

  addEvents() {
    let elements = document.querySelectorAll('input');
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', () => {
        this.resetSchedule();
        this.getSchedule(elements[i].attributes[2].nodeValue);
      });
    }
  }

  getData() {
    fetch(this._dataFile)
      .then(res => {
        return res.json();
      })
      .then(jsonop => {
        handleData(jsonop, this._week);
      });

    const handleData = data => {
      if (this._week) {
        let matsWeek = [];
        let dataEntries = Object.entries(data);
        for (const entry of dataEntries) {
          let matsEntries = Object.entries(entry[1]);
          for (const matsEntry of matsEntries) {
            if (matsEntry[1]['semaines']) {
              if (matsEntry[1]['semaines'].includes(this._week)) {
                matsWeek.push([entry[0], matsEntry[1]]);
              }
            }
          }
        }
        this.setScheduleData = matsWeek;
      }
    };
  }

  getSchedule(week) {
    if (week) this._week = parseInt(week);
    this._refresh = new Promise(resolve => {
      this.getData();
      setTimeout(() => {
        resolve(this.getScheduleData);
      }, 300);
    });
    this._refresh.then(resolve => {
      this.setdataSchedule;
      let day,
        mat,
        heureDeb,
        heureFin,
        semaine,
        lastDay,
        salle = null;
      for (let i = 0; i < resolve.length; i++) {
        if (i != 0) lastDay = resolve[i - 1][0];
        else lastDay = null;
        day = resolve[i][0];
        mat = resolve[i][1]['matiere'];
        heureDeb = resolve[i][1]['heureDebut'];
        heureFin = resolve[i][1]['heureFin'];
        salle = resolve[i][1]['salle'];
        semaine = kamzdu.getWeek;
        this.addScheduleText(
          day,
          mat,
          heureDeb,
          heureFin,
          salle,
          semaine,
          lastDay
        );
      }
    });
  }

  addScheduleText(day, mat, heureDeb, heureFin, salle, semaine, lastDay) {
    let defaultText = ``;
    if (lastDay === day) defaultText = ``;
    else {
      defaultText = `<h3>${day}</h3>`;
    }
    defaultText = `${defaultText}
      <ul>
        <li>Matière : ${mat}</li>
        <li>Heure début : ${heureDeb}</li>
        <li>Heure de fin : ${heureFin}</li>
        <li>Salle : ${salle}</li>
        <li>Semaine courante : ${semaine}</li>
      </ul>
      `;
    document.getElementById(`schedule-${day}`).innerHTML += defaultText;
  }

  set setScheduleData(data) {
    this._dataSchedule = data;
  }

  get getScheduleData() {
    return this._dataSchedule;
  }

  get getWeek() {
    return this._week;
  }
}

const kamzdu = new Kamzdule();

let result = kamzdu.getSchedule(48);
