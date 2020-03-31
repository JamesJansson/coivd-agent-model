function runSimpleCompartmentModel({
  numberOfPeople,
  initialInfected,
  infectionRate,
  recoverRate
}) {
  // const numberOfPeople = 100000;
  // const initialInfected = 1000;
  // const infectionRate = 0.479;
  // const recoverRate = 0.065;

  let susceptible = numberOfPeople - initialInfected;
  let infected = initialInfected;
  let recovered = 0;

  const results = [
    {
      day: 0,
      susceptible,
      infected,
      recovered,
      newlyInfected: 0,
      newlyRecovered: 0
    }
  ];
  // Run the model
  for (let day = 1; day <= 100; day++) {
    const proportionOfPeopleSusceptible =
      susceptible / (susceptible + infected + recovered);
    const newlyInfected =
      infectionRate * infected * proportionOfPeopleSusceptible;
    const newlyRecovered = recoverRate * infected;

    susceptible = susceptible - newlyInfected;
    infected = infected + newlyInfected - newlyRecovered;
    recovered = recovered + newlyRecovered;

    results.push({
      day,
      susceptible,
      infected,
      recovered,
      newlyInfected,
      newlyRecovered
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
        newlyInfected +
        ", " +
        newlyRecovered
    );
  }
  return results;
}
