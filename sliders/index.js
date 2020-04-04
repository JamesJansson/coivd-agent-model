function sliderHandler() {
  const sliderIDs = [
    "numberOfPeopleSlider",
    "initialInfectedSlider",
    "connectionsPerPersonSlider",
    "medianTimeUntilRecoverySlider",
    "infectionProbabilitySlider",
    "infectionRateSlider",
    "interventionStartSlider",
    "interventionDurationSlider",
  ];

  for (let i = 0; i < sliderIDs.length; i++) {
    const slider = document.getElementById(sliderIDs[i]);
    const output = document.getElementById(`${sliderIDs[i]}Val`);
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
      output.innerHTML = slider.value;
    };
  }
}

sliderHandler();
