function runSimpleCompartmentModel(settings) {
  const recoverRate =
    1 - Math.exp(Math.log(0.5) / settings.medianTimeUntilRecovery);

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
    let infectionRate = settings.infectionRate;
    if (
      day >= settings.interventionStart &&
      day < settings.interventionStart + settings.interventionDuration
    ) {
      infectionRate =
        (1 - settings.interventionInfectionRateReduction / 100) *
        settings.infectionRate;
    }

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
      newlyRecovered: roundedFraction(newlyRecovered),
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
