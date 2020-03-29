class Person {
  constructor({
    gender,
    age,
    profession,
    household,
    social,
    shop,
    hospital,
    work,
    school,
    university,
    publicTransport
  }) {
    this.gender = gender;
    this.age = age;
    this.profession = profession;

    this.household = household;
    this.social = social;
    this.shop = shop;
    this.hospital = hospital;
    this.work = work;
    this.school = school;
    this.university = university;
    this.publicTransport = publicTransport;

    this.infected = false;
    this.everInfected = false;
    this.isolated = false;
  }

  infect() {
    // determine
    // start of infectiousness
    // if symptoms(age)
    // start of symptoms
    // if critical(age)
    // start of critical
    // if death without treatment
    // start of death
  }

  runDay(day) {
    this.determineSymptoms();
    this.determineIsolation(day);
    this.determineInfection(day);
  }

  determineInfection(day) {
    if (this.infected && this.everInfected) {
      let infectionOccurs = false;

      if (infectionOccurs) {
        this.infect(day);
      }
    }
  }

  determineHospitalization() {}

  determineDeath() {}
}

class Household {
  constructor({ people }) {
    this.people = people;
    this.totalInfected = 0;
  }

  getStartOfDayTotal() {
    this.totalInfected = 0;
    this.people.forEach(person => {
      if (person.infected) {
        this.totalInfected++;
      }
    });
  }

  determineInfection() {
    if (this.totalInfected === 0) {
      return false;
    }
    const probabilityInfection =
      1 - Math.pow(1 - pHouseholdInfection, this.totalInfected);
    return Math.random() < probabilityInfection;
  }
}

class Social {
  constructor({ people }) {
    this.people = people;
  }

  determineInfection() {}
}

class Work {
  constructor({ people, hospital, shop }) {
    this.people = people;
    this.hospital = hospital;
    this.shop = shop;
  }

  determineInfection() {
    // Look at colleagues
    // Look at locations which are customer facing
    if (this.shop) {
    }

    if (this.hospital) {
      if (this.hospital.totalInfected) {
      }
    }
  }
}
