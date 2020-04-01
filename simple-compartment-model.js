function runSimpleCompartmentModel({
  numberOfPeople,
  initialInfected,
  infectionRate,
  medianTimeUntilRecovery
}) {
  const recoverRate = 1 - Math.exp(Math.log(0.5) / medianTimeUntilRecovery);

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
      susceptible: roundedFraction(susceptible),
      infected: roundedFraction(infected),
      recovered: roundedFraction(recovered),
      newlyInfected: roundedFraction(newlyInfected),
      newlyRecovered: roundedFraction(newlyRecovered)
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

function roundedFraction(val) {
  if (val === Math.round(val)) {
    return val;
  } else {
    return Math.round(val * 10) / 10;
  }
}
