class Person {
  constructor() {
    this.infectionStatus = 0; // 0 = susceptible, 1 = infected, 2 = recovered
    this.connections = [];
  }

  addConnection(person, connectedInIntervention) {
    this.connections.push({ person, connectedInIntervention });
  }

  infect(day, stepSettings, data) {
    if (this.infectionStatus === 0) {
      this.nextInfectionStatus = 1;
      this.infectionEnd =
        day +
        stepSettings.medianTimeUntilRecovery +
        7 * (Math.random() * 2 - 1);
      if (data) {
        data.newlyInfected++;
      }
    }
  }

  runDay(day, stepSettings, data) {
    // Determine if the person has recovered
    if (this.infectionStatus === 1 && day > this.infectionEnd) {
      this.infectionStatus = 2; // No longer infective
      data.newlyRecovered++;
    }

    // Determine the infections that this person is responsible for
    if (this.infectionStatus === 1) {
      this.connections.forEach((connection) => {
        if (
          stepSettings.isIntervention &&
          connection.connectedInIntervention === false
        ) {
          return; // not connected in an intervention
        }
        if (Math.random() < stepSettings.infectionProbability) {
          connection.person.infect(day, stepSettings, data);
        }
      });
    }
    return data;
  }

  finalizeDay() {
    // we finalize the day separately such that all the infection statuses are updated at once
    if (this.infectionStatus === 0 && this.nextInfectionStatus === 1) {
      this.infectionStatus = this.nextInfectionStatus;
    }
  }

  getInfectionStatus() {
    return this.infectionStatus;
  }
}

function runSimpleAgentModel(settings) {
  console.log(settings);

  console.log("About to create people");

  // Create people in the model
  const people = [];
  for (let i = 0; i < settings.numberOfPeople; i++) {
    people.push(new Person());
  }

  console.log("Joining users");

  // Join users
  // For example, if connectionsPerPerson = 20, the number of connections we need to make is 10
  for (
    let i = 0;
    i < (settings.numberOfPeople * settings.connectionsPerPerson) / 2;
    i++
  ) {
    // Choose two people at random
    const person1Number = Math.floor(settings.numberOfPeople * Math.random());
    const person2Number = Math.floor(settings.numberOfPeople * Math.random());
    const person1 = people[person1Number];
    const person2 = people[person2Number];

    const connectedInIntervention =
      Math.random() < 1 - settings.interventionConnectionReduction / 100;

    person1.addConnection(person2, connectedInIntervention);
    person2.addConnection(person1, connectedInIntervention);
  }

  console.log("Initial infections");

  // Start people off with initial infected
  for (let i = 0; i < settings.initialInfected; i++) {
    // Choose people at random
    const personNumber = Math.floor(settings.numberOfPeople * Math.random());
    let person1 = people[personNumber];

    // If the person is already infected, it is likely that there are many people infected, so filter
    if (person1.infectionStatus === 1) {
      const arr = people.filter((p) => p.infectionStatus === 0);
      const supplementaryPersonNumber = Math.floor(arr.length * Math.random());
      person1 = arr[supplementaryPersonNumber];
    }
    person1.infect(0, settings);
    person1.finalizeDay();
  }

  console.log("Starting time");

  let susceptible = settings.numberOfPeople - settings.initialInfected;
  let infected = settings.initialInfected;
  let recovered = 0;

  const results = [
    {
      day: 0,
      susceptible,
      infected,
      recovered,
      newlyInfected: 0,
      newlyRecovered: 0,
    },
  ];
  // Run the model
  for (let day = 1; day <= settings.modelDuration; day++) {
    const data = {
      newlyInfected: 0,
      newlyRecovered: 0,
    };

    let stepSettings = {
      isIntervention: false,
      infectionProbability: settings.infectionProbability,
      medianTimeUntilRecovery: settings.medianTimeUntilRecovery,
    };

    if (
      settings.interventionStart > 0 && // Set to zero to have no intervention
      day >= settings.interventionStart &&
      day < settings.interventionStart + settings.interventionDuration
    ) {
      stepSettings = {
        isIntervention: true,
        infectionProbability:
          (1 - settings.interventionInfectionProbabilityReduction / 100) *
          settings.infectionProbability,
        medianTimeUntilRecovery: settings.medianTimeUntilRecovery,
      };
    }

    // Run infections
    people.forEach((person) => {
      person.runDay(day, stepSettings, data);
    });
    // Finalize infections for this step
    people.forEach((person) => {
      person.finalizeDay(day);
    });
    let susceptible = 0;
    let infected = 0;
    let recovered = 0;
    people.forEach((person) => {
      const status = person.getInfectionStatus();
      if (status === 0) {
        susceptible++;
      } else if (status === 1) {
        infected++;
      } else if (status === 2) {
        recovered++;
      }
    });
    results.push({
      day,
      susceptible,
      infected,
      recovered,
      newlyInfected: data.newlyInfected,
      newlyRecovered: data.newlyRecovered,
    });
    console.log(
      day +
        ", " +
        susceptible +
        ", " +
        infected +
        ", " +
        recovered +
        ", " +
        data.newlyInfected +
        ", " +
        data.newlyRecovered
    );
  }
  return results;
}
