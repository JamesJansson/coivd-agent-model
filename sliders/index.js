function sliderHandler() {
  const sliderIds = [
    "modelDurationSlider",
    "numberOfPeopleSlider",
    "initialInfectedSlider",
    "connectionsPerPersonSlider",
    "medianTimeUntilRecoverySlider",
    "infectionProbabilitySlider",
    "infectionRateSlider",
    "interventionStartSlider",
    "interventionDurationSlider",
    "interventionConnectionsPerPersonSlider",
    "interventionInfectionProbabilitySlider",
    "interventionInfectionRateSlider",
  ];

  for (let i = 0; i < sliderIds.length; i++) {
    const slider = document.getElementById(sliderIds[i]);
    const output = document.getElementById(`${sliderIds[i]}Val`);
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
      output.innerHTML = slider.value;
    };
  }
}

sliderHandler();
