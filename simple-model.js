class Person {
  constructor() {
    this.infectionStatus = 0; // 0 = susceptible, 1 = infected, 2 = recovered
    this.connections = [];
  }

  addConnection(connection) {
    this.connections.push(connection);
  }

  infect(day) {
    if (this.infectionStatus === 0) {
      this.nextInfectionStatus = 1;
      this.infectionEnd = day + 21;
    }
  }

  runDay(day, infectionProbability) {
    // Determine if the person has recovered
    if (day > this.infectionEnd) {
      this.infectionStatus = 2; // No longer infective
    }

    // Determine the infections that this person is responsible for
    if (this.infectionStatus === 1) {
      this.connections.forEach(connection => {
        if (Math.random() < infectionProbability) {
          connection.infect(day);
        }
      });
    }
  }

  finalizeDay() {
    // we finalize the day separately such that all the infection statuses are updated at once
    if (this.nextInfectionStatus !== this.infectionStatus) {
      this.infectionStatus = this.nextInfectionStatus;
    }
  }

  getInfectionStatus() {
    return this.infectionStatus;
  }
}

function runSimpleModel() {
  const numberOfPeople = 25000;
  const infectionProbability = 0.3;

  console.log("About to create people");

  // Create people in the model
  const people = [];
  for (let i = 0; i < numberOfPeople; i++) {
    people.push(new Person());
  }

  console.log("Joining users");

  // Join users
  // We'll choose numberOfPeople * 10 connections because that means that each person will have 20 connections
  for (let i = 0; i < numberOfPeople * 10; i++) {
    // Choose two people at random
    const person1Number = Math.floor(numberOfPeople * Math.random());
    const person2Number = Math.floor(numberOfPeople * Math.random());
    const person1 = people[person1Number];
    const person2 = people[person2Number];
    person1.addConnection(person2);
    person2.addConnection(person1);
  }

  console.log("Initial infections");

  // Start people off with 100 infected
  for (let i = 0; i < 100; i++) {
    // Choose two people at random
    const person1Number = Math.floor(numberOfPeople * Math.random());
    const person1 = people[person1Number];
    person1.infect(0);
    person1.finalizeDay();
  }

  console.log("Starting model");

  // Run the model
  for (let day = 0; day < 10; day++) {
    // Run infections
    people.forEach(person => {
      person.runDay(day, infectionProbability);
    });
    // Finalize infections for this step
    people.forEach(person => {
      person.finalizeDay(day);
    });
    let susceptible = 0;
    let infected = 0;
    let recovered = 0;
    people.forEach(person => {
      const status = person.getInfectionStatus();
      if (status === 0) {
        susceptible++;
      } else if (status === 1) {
        infected++;
      } else if (status === 2) {
        recovered++;
      } else {
        console.log(status);
      }
    });
    console.log(people.length);
    console.log(day, ", ", susceptible, ", ", infected, ", ", recovered);
  }
}
