"use strict";

/* ============================================================
   EBM ECO RESCUE
   MAIN GAME INTERACTION

   File: script.js

   Loading order in index.html:
   1. gameData.js
   2. impactMatrix.js
   3. script.js

   Main responsibilities:
   - Register the player
   - Control screen navigation
   - Generate fictional EBM area cards
   - Run environmental scenarios
   - Manage Aspect, Impact, Rating and Control steps
   - Calculate player scores
   - Update Eco Score and environmental metrics
   - Manage area completion
   - Manage personal commitments
   - Display final results
   - Save game progress in the browser
   - Submit final results to Google Apps Script
============================================================ */


/* ============================================================
   1. APPLICATION CONFIGURATION
============================================================ */

const EBM_APP_CONFIG = Object.freeze({
  storageKey: "ebmEcoRescueGameStateV1",

  soundStorageKey: "ebmEcoRescueSoundV1",

  autoSaveEnabled: true,

  randomizeAnswerOptions: true,

  restoreSavedProgress: true,

  showCorrectAnswerAfterSubmission: true,

  allowAreaReplay: true,

  requireAllAreasBeforeCommitments: true,

  requiredCommitments: 3,

  toastDuration: 3500,

  transitionDelay: 180,

  submissionTimeout: 15000,

  /*
   * Replace this value after deploying appsScript.gs
   * as a Google Apps Script Web App.
   *
   * Example:
   * https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   */
  

  googleAppsScriptUrl:
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",

enableGoogleSheetSubmission: true


/* ============================================================
   2. SCREEN IDENTIFIERS
============================================================ */

const EBM_SCREEN_IDS = Object.freeze([
  "welcomeScreen",
  "missionBriefingScreen",
  "campusScreen",
  "areaIntroductionScreen",
  "scenarioScreen",
  "scenarioFeedbackScreen",
  "areaCompletionScreen",
  "ecoDashboardScreen",
  "commitmentScreen",
  "finalResultScreen",
  "thankYouScreen"
]);


/* ============================================================
   3. INITIAL GAME STATE
============================================================ */

/**
 * Creates the complete default application state.
 *
 * @returns {object}
 */
function createDefaultGameState() {
  const scoringState =
    typeof window.createInitialEnvironmentalScoreState === "function"
      ? window.createInitialEnvironmentalScoreState()
      : {
          totalScore: 0,
          maximumScore: 0,
          ecoScore: 0,
          completedAreaIds: [],
          completedScenarioIds: [],
          scenarioResults: [],
          areaResults: {},
          metrics: {},
          impactCounts: {
            low: 0,
            medium: 0,
            high: 0,
            compliancePriority: 0,
            significantTotal: 0
          },
          commitments: [],
          startedAt: null,
          completedAt: null
        };

  return {
    version: "1.0.0",

    player: {
      employeeName: "",
      employeeId: "",
      department: "",
      employmentType: ""
    },

    currentScreenId: "welcomeScreen",

    currentAreaId: null,

    currentScenarioIndex: 0,

    currentTaskStep: "aspect",

    selectedAnswers: {
      aspect: null,
      impact: null,
      consequence: null,
      occurrence: null,
      control: null
    },

    currentScenarioStepScores: {
      aspect: null,
      impact: null,
      rating: null,
      control: null
    },

    currentAreaSessionResults: [],

    scoring: scoringState,

    commitments: [],

    soundEnabled: true,

    finalSubmitted: false,

    startedAt: null,

    completedAt: null,

    lastSavedAt: null
  };
}


let gameState = createDefaultGameState();


/* ============================================================
   4. DOM ELEMENT CACHE
============================================================ */

const DOM = {};


/**
 * Returns a DOM element using its ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function byId(id) {
  return document.getElementById(id);
}


/**
 * Stores all frequently used page elements.
 */
function cacheDOMElements() {
  DOM.app = byId("app");

  DOM.screens = EBM_SCREEN_IDS.reduce(
    (screenMap, screenId) => {
      screenMap[screenId] = byId(screenId);
      return screenMap;
    },
    {}
  );

  DOM.globalProgressPanel =
    byId("globalProgressPanel");

  DOM.overallEcoScore =
    byId("overallEcoScore");

  DOM.mainProgressBar =
    byId("mainProgressBar");

  DOM.completedAreaCount =
    byId("completedAreaCount");

  DOM.totalAreaCount =
    byId("totalAreaCount");

  DOM.completedScenarioCount =
    byId("completedScenarioCount");

  DOM.soundToggleButton =
    byId("soundToggleButton");

  DOM.helpButton =
    byId("helpButton");

  DOM.restartButton =
    byId("restartButton");

  DOM.playerRegistrationForm =
    byId("playerRegistrationForm");

  DOM.employeeName =
    byId("employeeName");

  DOM.employeeId =
    byId("employeeId");

  DOM.departmentSelect =
    byId("departmentSelect");

  DOM.campaignConsent =
    byId("campaignConsent");

  DOM.employeeNameError =
    byId("employeeNameError");

  DOM.departmentError =
    byId("departmentError");

  DOM.employmentTypeError =
    byId("employmentTypeError");

  DOM.consentError =
    byId("consentError");

  DOM.briefingPlayerName =
    byId("briefingPlayerName");

  DOM.openCampusButton =
    byId("openCampusButton");

  DOM.campusPlayerName =
    byId("campusPlayerName");

  DOM.campusPlayerDepartment =
    byId("campusPlayerDepartment");

  DOM.areaCardGrid =
    byId("areaCardGrid");

  DOM.areaCardTemplate =
    byId("areaCardTemplate");

  DOM.viewScoreDashboardButton =
    byId("viewScoreDashboardButton");

  DOM.continueToCommitmentsButton =
    byId("continueToCommitmentsButton");

  DOM.backToCampusFromIntroButton =
    byId("backToCampusFromIntroButton");

  DOM.areaIntroductionVisual =
    byId("areaIntroductionVisual");

  DOM.areaIntroductionIcon =
    byId("areaIntroductionIcon");

  DOM.areaIntroductionKicker =
    byId("areaIntroductionKicker");

  DOM.areaIntroductionTitle =
    byId("areaIntroductionTitle");

  DOM.areaIntroductionDescription =
    byId("areaIntroductionDescription");

  DOM.areaScenarioTotal =
    byId("areaScenarioTotal");

  DOM.areaEstimatedTime =
    byId("areaEstimatedTime");

  DOM.areaMaximumScore =
    byId("areaMaximumScore");

  DOM.startAreaMissionButton =
    byId("startAreaMissionButton");

  DOM.exitScenarioButton =
    byId("exitScenarioButton");

  DOM.currentScenarioNumber =
    byId("currentScenarioNumber");

  DOM.scenarioCount =
    byId("scenarioCount");

  DOM.scenarioProgressBar =
    byId("scenarioProgressBar");

  DOM.currentAreaScore =
    byId("currentAreaScore");

  DOM.scenarioAreaName =
    byId("scenarioAreaName");

  DOM.scenarioTitle =
    byId("scenarioTitle");

  DOM.scenarioCategoryBadge =
    byId("scenarioCategoryBadge");

  DOM.scenarioScene =
    byId("scenarioScene");

  DOM.scenarioScenePlaceholder =
    byId("scenarioScenePlaceholder");

  DOM.scenarioSceneIcon =
    byId("scenarioSceneIcon");

  DOM.scenarioHotspotLayer =
    byId("scenarioHotspotLayer");

  DOM.scenarioObservation =
    byId("scenarioObservation");

  DOM.aspectOptionList =
    byId("aspectOptionList");

  DOM.impactOptionList =
    byId("impactOptionList");

  DOM.controlOptionList =
    byId("controlOptionList");

  DOM.answerOptionTemplate =
    byId("answerOptionTemplate");

  DOM.submitAspectButton =
    byId("submitAspectButton");

  DOM.submitImpactButton =
    byId("submitImpactButton");

  DOM.submitRatingButton =
    byId("submitRatingButton");

  DOM.submitControlButton =
    byId("submitControlButton");

  DOM.selectedImpactValue =
    byId("selectedImpactValue");

  DOM.selectedLikelihoodValue =
    byId("selectedLikelihoodValue");

  DOM.calculatedRatingValue =
    byId("calculatedRatingValue");

  DOM.calculatedImpactCategory =
    byId("calculatedImpactCategory");

  DOM.calculatedImpactBadge =
    byId("calculatedImpactBadge");

  DOM.calculatedImpactMessage =
    byId("calculatedImpactMessage");

  DOM.feedbackStatusIcon =
    byId("feedbackStatusIcon");

  DOM.feedbackKicker =
    byId("feedbackKicker");

  DOM.feedbackTitle =
    byId("feedbackTitle");

  DOM.feedbackSummary =
    byId("feedbackSummary");

  DOM.feedbackAspect =
    byId("feedbackAspect");

  DOM.feedbackImpact =
    byId("feedbackImpact");

  DOM.feedbackImpactRating =
    byId("feedbackImpactRating");

  DOM.feedbackImpactLevel =
    byId("feedbackImpactLevel");

  DOM.feedbackPointsEarned =
    byId("feedbackPointsEarned");

  DOM.feedbackAwarenessMessage =
    byId("feedbackAwarenessMessage");

  DOM.complianceAlertBox =
    byId("complianceAlertBox");

  DOM.nextScenarioButton =
    byId("nextScenarioButton");

  DOM.completeAreaButton =
    byId("completeAreaButton");

  DOM.areaCompletionTitle =
    byId("areaCompletionTitle");

  DOM.areaCompletionMessage =
    byId("areaCompletionMessage");

  DOM.areaCompletionScore =
    byId("areaCompletionScore");

  DOM.areaCorrectDecisionCount =
    byId("areaCorrectDecisionCount");

  DOM.areaEcoImprovement =
    byId("areaEcoImprovement");

  DOM.areaLearningPointList =
    byId("areaLearningPointList");

  DOM.returnToCampusButton =
    byId("returnToCampusButton");

  DOM.backToCampusFromDashboardButton =
    byId("backToCampusFromDashboardButton");

  DOM.commitmentForm =
    byId("commitmentForm");

  DOM.commitmentCardGrid =
    byId("commitmentCardGrid");

  DOM.selectedCommitmentCount =
    byId("selectedCommitmentCount");

  DOM.commitmentError =
    byId("commitmentError");

  DOM.submitCommitmentsButton =
    byId("submitCommitmentsButton");

  DOM.finalEcoScore =
    byId("finalEcoScore");

  DOM.finalResultBadge =
    byId("finalResultBadge");

  DOM.finalResultDescription =
    byId("finalResultDescription");

  DOM.finalAreasCompleted =
    byId("finalAreasCompleted");

  DOM.finalScenariosCompleted =
    byId("finalScenariosCompleted");

  DOM.finalCorrectDecisionPercentage =
    byId("finalCorrectDecisionPercentage");

  DOM.finalHighImpactCount =
    byId("finalHighImpactCount");

  DOM.finalCommitmentList =
    byId("finalCommitmentList");

  DOM.finalCommitmentItemTemplate =
    byId("finalCommitmentItemTemplate");

  DOM.submissionStatusBox =
    byId("submissionStatusBox");

  DOM.submissionStatusIcon =
    byId("submissionStatusIcon");

  DOM.submissionStatusMessage =
    byId("submissionStatusMessage");

  DOM.submitFinalResultButton =
    byId("submitFinalResultButton");

  DOM.playAgainButton =
    byId("playAgainButton");

  DOM.thankYouRestartButton =
    byId("thankYouRestartButton");

  DOM.helpModal =
    byId("helpModal");

  DOM.closeHelpModalButton =
    byId("closeHelpModalButton");

  DOM.restartConfirmationModal =
    byId("restartConfirmationModal");

  DOM.cancelRestartButton =
    byId("cancelRestartButton");

  DOM.confirmRestartButton =
    byId("confirmRestartButton");

  DOM.exitAreaConfirmationModal =
    byId("exitAreaConfirmationModal");

  DOM.cancelExitAreaButton =
    byId("cancelExitAreaButton");

  DOM.confirmExitAreaButton =
    byId("confirmExitAreaButton");

  DOM.loadingOverlay =
    byId("loadingOverlay");

  DOM.loadingTitle =
    byId("loadingTitle");

  DOM.loadingMessage =
    byId("loadingMessage");

  DOM.toastContainer =
    byId("toastContainer");

  DOM.toastTemplate =
    byId("toastTemplate");

  DOM.celebrationLayer =
    byId("celebrationLayer");
}


/* ============================================================
   5. DATA ACCESS HELPERS
============================================================ */

/**
 * Returns the complete area array.
 *
 * @returns {Array<object>}
 */
function getGameAreas() {
  return Array.isArray(
    window.EBM_GAME_DATA?.areas
  )
    ? window.EBM_GAME_DATA.areas
    : [];
}


/**
 * Returns an area by ID.
 *
 * @param {string} areaId
 * @returns {object|null}
 */
function getAreaById(areaId) {
  if (
    typeof window.getEBMAreaById ===
    "function"
  ) {
    return window.getEBMAreaById(areaId);
  }

  return (
    getGameAreas().find(
      (area) => area.id === areaId
    ) || null
  );
}


/**
 * Returns the current selected area.
 *
 * @returns {object|null}
 */
function getCurrentArea() {
  return getAreaById(
    gameState.currentAreaId
  );
}


/**
 * Returns the current scenario.
 *
 * @returns {object|null}
 */
function getCurrentScenario() {
  const area = getCurrentArea();

  if (
    !area ||
    !Array.isArray(area.scenarios)
  ) {
    return null;
  }

  return (
    area.scenarios[
      gameState.currentScenarioIndex
    ] || null
  );
}


/**
 * Returns the total number of scenarios.
 *
 * @returns {number}
 */
function getTotalScenarioCount() {
  if (
    typeof window.getEBMTotalScenarioCount ===
    "function"
  ) {
    return window.getEBMTotalScenarioCount();
  }

  return getGameAreas().reduce(
    (total, area) =>
      total +
      (
        Array.isArray(area.scenarios)
          ? area.scenarios.length
          : 0
      ),
    0
  );
}


/* ============================================================
   6. LOCAL STORAGE
============================================================ */

/**
 * Saves the current game state.
 */
function saveGameState() {
  if (
    EBM_APP_CONFIG.autoSaveEnabled !==
    true
  ) {
    return;
  }

  try {
    gameState.lastSavedAt =
      new Date().toISOString();

    localStorage.setItem(
      EBM_APP_CONFIG.storageKey,
      JSON.stringify(gameState)
    );
  } catch (error) {
    console.warn(
      "Unable to save game progress:",
      error
    );
  }
}


/**
 * Loads stored progress.
 *
 * @returns {object|null}
 */
function loadSavedGameState() {
  if (
    EBM_APP_CONFIG.restoreSavedProgress !==
    true
  ) {
    return null;
  }

  try {
    const stored =
      localStorage.getItem(
        EBM_APP_CONFIG.storageKey
      );

    if (!stored) {
      return null;
    }

    const parsed =
      JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn(
      "Unable to restore game progress:",
      error
    );

    return null;
  }
}


/**
 * Removes saved progress.
 */
function clearSavedGameState() {
  try {
    localStorage.removeItem(
      EBM_APP_CONFIG.storageKey
    );
  } catch (error) {
    console.warn(
      "Unable to clear saved game progress:",
      error
    );
  }
}


/**
 * Merges stored state with the latest default structure.
 *
 * @param {object} savedState
 * @returns {object}
 */
function mergeSavedState(savedState) {
  const defaultState =
    createDefaultGameState();

  return {
    ...defaultState,
    ...savedState,

    player: {
      ...defaultState.player,
      ...(savedState.player || {})
    },

    selectedAnswers: {
      ...defaultState.selectedAnswers,
      ...(savedState.selectedAnswers || {})
    },

    currentScenarioStepScores: {
      ...defaultState.currentScenarioStepScores,
      ...(
        savedState.currentScenarioStepScores ||
        {}
      )
    },

    scoring: {
      ...defaultState.scoring,
      ...(savedState.scoring || {}),

      scenarioResults:
        Array.isArray(
          savedState.scoring?.scenarioResults
        )
          ? savedState.scoring.scenarioResults
          : [],

      completedAreaIds:
        Array.isArray(
          savedState.scoring?.completedAreaIds
        )
          ? savedState.scoring.completedAreaIds
          : [],

      completedScenarioIds:
        Array.isArray(
          savedState.scoring?.completedScenarioIds
        )
          ? savedState.scoring.completedScenarioIds
          : [],

      areaResults: {
        ...(
          savedState.scoring?.areaResults ||
          {}
        )
      }
    },

    commitments:
      Array.isArray(savedState.commitments)
        ? savedState.commitments
        : []
  };
}


/* ============================================================
   7. SCREEN NAVIGATION
============================================================ */

/**
 * Displays one screen and hides all other screens.
 *
 * @param {string} screenId
 * @param {boolean} [scrollToTop]
 */
function showScreen(
  screenId,
  scrollToTop = true
) {
  EBM_SCREEN_IDS.forEach(
    (id) => {
      const screen = DOM.screens[id];

      if (!screen) {
        return;
      }

      const isActive =
        id === screenId;

      screen.classList.toggle(
        "active-screen",
        isActive
      );

      screen.setAttribute(
        "aria-hidden",
        String(!isActive)
      );
    }
  );

  gameState.currentScreenId =
    screenId;

  updateHeaderVisibility();
  updateGlobalProgressVisibility();

  if (scrollToTop) {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  saveGameState();
}


/**
 * Controls restart button visibility.
 */
function updateHeaderVisibility() {
  const isWelcomeScreen =
    gameState.currentScreenId ===
    "welcomeScreen";

  DOM.restartButton?.classList.toggle(
    "hidden",
    isWelcomeScreen
  );
}


/**
 * Controls global progress visibility.
 */
function updateGlobalProgressVisibility() {
  const hiddenScreens = [
    "welcomeScreen",
    "missionBriefingScreen",
    "thankYouScreen"
  ];

  const shouldHide =
    hiddenScreens.includes(
      gameState.currentScreenId
    );

  DOM.globalProgressPanel?.classList.toggle(
    "hidden",
    shouldHide
  );
}


/* ============================================================
   8. MODALS
============================================================ */

/**
 * Opens a modal.
 *
 * @param {HTMLElement|null} modal
 */
function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("hidden");
  document.body.classList.add(
    "modal-open"
  );

  const focusable =
    modal.querySelector(
      "button, input, select, [tabindex]:not([tabindex='-1'])"
    );

  focusable?.focus();
}


/**
 * Closes a modal.
 *
 * @param {HTMLElement|null} modal
 */
function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add("hidden");

  const openModalExists =
    document.querySelector(
      ".modal-overlay:not(.hidden)"
    );

  if (!openModalExists) {
    document.body.classList.remove(
      "modal-open"
    );
  }
}


/* ============================================================
   9. LOADING OVERLAY
============================================================ */

/**
 * Displays the loading overlay.
 *
 * @param {string} title
 * @param {string} message
 */
function showLoading(
  title = "Loading",
  message = "Please wait..."
) {
  if (DOM.loadingTitle) {
    DOM.loadingTitle.textContent =
      title;
  }

  if (DOM.loadingMessage) {
    DOM.loadingMessage.textContent =
      message;
  }

  DOM.loadingOverlay?.classList.remove(
    "hidden"
  );
}


/**
 * Hides the loading overlay.
 */
function hideLoading() {
  DOM.loadingOverlay?.classList.add(
    "hidden"
  );
}


/* ============================================================
   10. TOAST NOTIFICATIONS
============================================================ */

/**
 * Displays a toast notification.
 *
 * @param {string} message
 * @param {"success"|"error"|"warning"|"info"} [type]
 */
function showToast(
  message,
  type = "success"
) {
  if (
    !DOM.toastContainer ||
    !DOM.toastTemplate
  ) {
    return;
  }

  const clone =
    DOM.toastTemplate.content.cloneNode(
      true
    );

  const toast =
    clone.querySelector(
      ".toast-message"
    );

  const icon =
    clone.querySelector(
      ".toast-icon"
    );

  const text =
    clone.querySelector(
      ".toast-text"
    );

  const closeButton =
    clone.querySelector(
      ".toast-close-button"
    );

  const typeConfiguration = {
    success: {
      icon: "✓",
      className: "toast-success"
    },

    error: {
      icon: "!",
      className: "toast-error"
    },

    warning: {
      icon: "⚠",
      className: "toast-warning"
    },

    info: {
      icon: "i",
      className: "toast-info"
    }
  };

  const configuration =
    typeConfiguration[type] ||
    typeConfiguration.info;

  if (text) {
    text.textContent = message;
  }

  if (icon) {
    icon.textContent =
      configuration.icon;
  }

  toast?.classList.add(
    configuration.className
  );

  const removeToast = () => {
    toast?.remove();
  };

  closeButton?.addEventListener(
    "click",
    removeToast
  );

  DOM.toastContainer.appendChild(
    clone
  );

  window.setTimeout(
    removeToast,
    EBM_APP_CONFIG.toastDuration
  );
}


/* ============================================================
   11. SOUND
============================================================ */

/**
 * Reads the stored sound preference.
 *
 * @returns {boolean}
 */
function loadSoundPreference() {
  try {
    const stored =
      localStorage.getItem(
        EBM_APP_CONFIG.soundStorageKey
      );

    if (stored === null) {
      return true;
    }

    return stored === "true";
  } catch {
    return true;
  }
}


/**
 * Updates the sound control icon.
 */
function renderSoundState() {
  if (!DOM.soundToggleButton) {
    return;
  }

  DOM.soundToggleButton.setAttribute(
    "aria-pressed",
    String(gameState.soundEnabled)
  );

  const icon =
    DOM.soundToggleButton.querySelector(
      ".button-icon"
    );

  if (icon) {
    icon.textContent =
      gameState.soundEnabled
        ? "🔊"
        : "🔇";
  }
}


/**
 * Toggles sound.
 */
function toggleSound() {
  gameState.soundEnabled =
    !gameState.soundEnabled;

  try {
    localStorage.setItem(
      EBM_APP_CONFIG.soundStorageKey,
      String(gameState.soundEnabled)
    );
  } catch {
    // Sound preference is non-critical.
  }

  renderSoundState();

  showToast(
    gameState.soundEnabled
      ? "Sound enabled."
      : "Sound disabled.",
    "info"
  );
}


/**
 * Produces a small browser-generated tone.
 *
 * @param {"correct"|"incorrect"|"complete"|"click"} type
 */
function playSound(type) {
  if (
    gameState.soundEnabled !== true ||
    !window.AudioContext
  ) {
    return;
  }

  try {
    const audioContext =
      new AudioContext();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    const frequencyMap = {
      correct: 660,
      incorrect: 220,
      complete: 880,
      click: 440
    };

    oscillator.frequency.value =
      frequencyMap[type] || 440;

    oscillator.type =
      type === "incorrect"
        ? "sawtooth"
        : "sine";

    gain.gain.setValueAtTime(
      0.08,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.2
    );

    oscillator.connect(gain);
    gain.connect(
      audioContext.destination
    );

    oscillator.start();
    oscillator.stop(
      audioContext.currentTime + 0.2
    );
  } catch {
    // Sound is optional.
  }
}


/* ============================================================
   12. REGISTRATION
============================================================ */

/**
 * Clears registration validation messages.
 */
function clearRegistrationErrors() {
  if (DOM.employeeNameError) {
    DOM.employeeNameError.textContent =
      "";
  }

  if (DOM.departmentError) {
    DOM.departmentError.textContent =
      "";
  }

  if (DOM.employmentTypeError) {
    DOM.employmentTypeError.textContent =
      "";
  }

  if (DOM.consentError) {
    DOM.consentError.textContent =
      "";
  }
}


/**
 * Validates the player registration form.
 *
 * @returns {boolean}
 */
function validatePlayerRegistration() {
  clearRegistrationErrors();

  const employeeName =
    DOM.employeeName?.value.trim() || "";

  const department =
    DOM.departmentSelect?.value || "";

  const employmentType =
    document.querySelector(
      "input[name='employmentType']:checked"
    )?.value || "";

  const consent =
    DOM.campaignConsent?.checked === true;

  let valid = true;

  if (employeeName.length < 2) {
    valid = false;

    if (DOM.employeeNameError) {
      DOM.employeeNameError.textContent =
        "Please enter your name.";
    }
  }

  if (!department) {
    valid = false;

    if (DOM.departmentError) {
      DOM.departmentError.textContent =
        "Please select your department.";
    }
  }

  if (!employmentType) {
    valid = false;

    if (DOM.employmentTypeError) {
      DOM.employmentTypeError.textContent =
        "Please select your employment type.";
    }
  }

  if (!consent) {
    valid = false;

    if (DOM.consentError) {
      DOM.consentError.textContent =
        "Please confirm that you understand the activity purpose.";
    }
  }

  return valid;
}


/**
 * Saves player registration and starts the game.
 *
 * @param {SubmitEvent} event
 */
function handlePlayerRegistration(
  event
) {
  event.preventDefault();

  if (!validatePlayerRegistration()) {
    showToast(
      "Please complete the required registration fields.",
      "error"
    );

    return;
  }

  gameState.player = {
    employeeName:
      DOM.employeeName.value.trim(),

    employeeId:
      DOM.employeeId?.value.trim() || "",

    department:
      DOM.departmentSelect.value,

    employmentType:
      document.querySelector(
        "input[name='employmentType']:checked"
      )?.value || ""
  };

  gameState.startedAt =
    new Date().toISOString();

  gameState.scoring.startedAt =
    gameState.startedAt;

  if (DOM.briefingPlayerName) {
    DOM.briefingPlayerName.textContent =
      gameState.player.employeeName;
  }

  playSound("complete");

  showScreen(
    "missionBriefingScreen"
  );
}


/* ============================================================
   13. PLAYER INFORMATION
============================================================ */

/**
 * Updates visible player information.
 */
function renderPlayerInformation() {
  if (DOM.briefingPlayerName) {
    DOM.briefingPlayerName.textContent =
      gameState.player.employeeName ||
      "Eco Officer";
  }

  if (DOM.campusPlayerName) {
    DOM.campusPlayerName.textContent =
      gameState.player.employeeName ||
      "Player";
  }

  if (DOM.campusPlayerDepartment) {
    DOM.campusPlayerDepartment.textContent =
      gameState.player.department ||
      "Department";
  }
}


/* ============================================================
   14. AREA CARD GENERATION
============================================================ */

/**
 * Returns area completion information.
 *
 * @param {object} area
 * @returns {object}
 */
function getAreaProgress(area) {
  const scenarioResults =
    gameState.scoring.scenarioResults.filter(
      (result) =>
        result.areaId === area.id
    );

  const completedCount =
    scenarioResults.length;

  const totalCount =
    area.scenarios.length;

  const completed =
    completedCount >= totalCount;

  const started =
    completedCount > 0 &&
    !completed;

  return {
    completedCount,
    totalCount,
    completed,
    started,
    scenarioResults
  };
}


/**
 * Creates one environmental focus tag.
 *
 * @param {string} focusId
 * @returns {HTMLElement}
 */
function createFocusTag(focusId) {
  const focusData =
    window.EBM_GAME_DATA
      ?.focusAreas?.[focusId];

  const tag =
    document.createElement("span");

  tag.className =
    "focus-tag";

  tag.textContent =
    focusData
      ? `${focusData.icon} ${focusData.name}`
      : focusId;

  return tag;
}


/**
 * Generates all area cards.
 */
function renderAreaCards() {
  if (
    !DOM.areaCardGrid ||
    !DOM.areaCardTemplate
  ) {
    return;
  }

  DOM.areaCardGrid.innerHTML = "";

  getGameAreas().forEach(
    (area) => {
      const clone =
        DOM.areaCardTemplate.content
          .cloneNode(true);

      const card =
        clone.querySelector(
          ".area-card"
        );

      const icon =
        clone.querySelector(
          ".area-card-icon"
        );

      const statusBadge =
        clone.querySelector(
          ".area-status-badge"
        );

      const category =
        clone.querySelector(
          ".area-card-category"
        );

      const title =
        clone.querySelector(
          ".area-card-title"
        );

      const description =
        clone.querySelector(
          ".area-card-description"
        );

      const focusList =
        clone.querySelector(
          ".area-card-focus-list"
        );

      const progressText =
        clone.querySelector(
          ".area-card-progress-text"
        );

      const button =
        clone.querySelector(
          ".area-card-button"
        );

      const progress =
        getAreaProgress(area);

      if (icon) {
        icon.textContent =
          area.icon || "🏭";
      }

      if (category) {
        category.textContent =
          area.category ||
          "Environmental Zone";
      }

      if (title) {
        title.textContent =
          area.name;
      }

      if (description) {
        description.textContent =
          area.description;
      }

      if (focusList) {
        area.focus.forEach(
          (focusId) => {
            focusList.appendChild(
              createFocusTag(focusId)
            );
          }
        );
      }

      if (progressText) {
        progressText.textContent =
          `${progress.completedCount} of ${progress.totalCount} completed`;
      }

      if (progress.completed) {
        card?.classList.add(
          "completed"
        );

        if (statusBadge) {
          statusBadge.textContent =
            "Completed";
        }

        if (button) {
          button.innerHTML =
            EBM_APP_CONFIG.allowAreaReplay
              ? "Replay Area <span aria-hidden='true'>↻</span>"
              : "Completed <span aria-hidden='true'>✓</span>";

          button.disabled =
            !EBM_APP_CONFIG.allowAreaReplay;
        }
      } else if (progress.started) {
        card?.classList.add(
          "in-progress"
        );

        if (statusBadge) {
          statusBadge.textContent =
            "In Progress";
        }

        if (button) {
          button.innerHTML =
            "Continue Area <span aria-hidden='true'>→</span>";
        }
      } else {
        if (statusBadge) {
          statusBadge.textContent =
            "Not Started";
        }
      }

      button?.addEventListener(
        "click",
        () => {
          openAreaIntroduction(
            area.id
          );
        }
      );

      card?.setAttribute(
        "data-area-id",
        area.id
      );

      DOM.areaCardGrid.appendChild(
        clone
      );
    }
  );

  updateCommitmentButtonAvailability();
}


/* ============================================================
   15. AREA INTRODUCTION
============================================================ */

/**
 * Opens the introduction screen for an area.
 *
 * @param {string} areaId
 */
function openAreaIntroduction(areaId) {
  const area =
    getAreaById(areaId);

  if (!area) {
    showToast(
      "Unable to open this area.",
      "error"
    );

    return;
  }

  gameState.currentAreaId =
    area.id;

  if (DOM.areaIntroductionIcon) {
    DOM.areaIntroductionIcon.textContent =
      area.icon || "🏭";
  }

  if (DOM.areaIntroductionKicker) {
    DOM.areaIntroductionKicker.textContent =
      area.category ||
      "Area Mission";
  }

  if (DOM.areaIntroductionTitle) {
    DOM.areaIntroductionTitle.textContent =
      area.name;
  }

  if (DOM.areaIntroductionDescription) {
    DOM.areaIntroductionDescription.textContent =
      area.introduction ||
      area.description;
  }

  if (DOM.areaScenarioTotal) {
    DOM.areaScenarioTotal.textContent =
      String(area.scenarios.length);
  }

  if (DOM.areaEstimatedTime) {
    DOM.areaEstimatedTime.textContent =
      area.estimatedTime ||
      "4–5 min";
  }

  if (DOM.areaMaximumScore) {
    DOM.areaMaximumScore.textContent =
      String(
        area.scenarios.length * 100
      );
  }

  renderAreaIntroductionFocusTags(
    area
  );

  showScreen(
    "areaIntroductionScreen"
  );
}


/**
 * Updates the area introduction focus tags.
 *
 * @param {object} area
 */
function renderAreaIntroductionFocusTags(
  area
) {
  const container =
    document.querySelector(
      "#areaIntroductionScreen .area-focus-tags"
    );

  if (!container) {
    return;
  }

  container.innerHTML = "";

  area.focus.forEach(
    (focusId) => {
      container.appendChild(
        createFocusTag(focusId)
      );
    }
  );
}


/* ============================================================
   16. AREA MISSION START
============================================================ */

/**
 * Starts or replays the selected area.
 */
function startSelectedAreaMission() {
  const area =
    getCurrentArea();

  if (!area) {
    showToast(
      "No area has been selected.",
      "error"
    );

    return;
  }

  const existingResults =
    gameState.scoring.scenarioResults
      .filter(
        (result) =>
          result.areaId === area.id
      );

  const areaAlreadyCompleted =
    existingResults.length >=
    area.scenarios.length;

  if (
    areaAlreadyCompleted &&
    EBM_APP_CONFIG.allowAreaReplay
  ) {
    removeAreaResults(area.id);
  }

  gameState.currentScenarioIndex = 0;

  gameState.currentAreaSessionResults = [];

  resetScenarioState();

  renderCurrentScenario();

  showScreen("scenarioScreen");
}


/**
 * Removes previous results for a replayed area.
 *
 * @param {string} areaId
 */
function removeAreaResults(areaId) {
  gameState.scoring.scenarioResults =
    gameState.scoring.scenarioResults
      .filter(
        (result) =>
          result.areaId !== areaId
      );

  gameState.scoring.completedScenarioIds =
    gameState.scoring.completedScenarioIds
      .filter(
        (scenarioId) => {
          const area =
            getAreaById(areaId);

          return !area?.scenarios.some(
            (scenario) =>
              scenario.id === scenarioId
          );
        }
      );

  gameState.scoring.completedAreaIds =
    gameState.scoring.completedAreaIds
      .filter(
        (id) => id !== areaId
      );

  delete gameState.scoring.areaResults[
    areaId
  ];

  recalculateCompleteScoreState();
}


/* ============================================================
   17. SCENARIO STATE
============================================================ */

/**
 * Resets temporary selections and step scores.
 */
function resetScenarioState() {
  gameState.currentTaskStep =
    "aspect";

  gameState.selectedAnswers = {
    aspect: null,
    impact: null,
    consequence: null,
    occurrence: null,
    control: null
  };

  gameState.currentScenarioStepScores = {
    aspect: null,
    impact: null,
    rating: null,
    control: null
  };

  resetRatingInputs();
  setActiveTaskStep("aspect");

  if (DOM.submitAspectButton) {
    DOM.submitAspectButton.disabled =
      true;
  }

  if (DOM.submitImpactButton) {
    DOM.submitImpactButton.disabled =
      true;
  }

  if (DOM.submitRatingButton) {
    DOM.submitRatingButton.disabled =
      true;
  }

  if (DOM.submitControlButton) {
    DOM.submitControlButton.disabled =
      true;
  }
}


/**
 * Clears rating radio inputs.
 */
function resetRatingInputs() {
  document
    .querySelectorAll(
      "input[name='impactLevel'], input[name='likelihoodLevel']"
    )
    .forEach(
      (input) => {
        input.checked = false;
      }
    );

  if (DOM.selectedImpactValue) {
    DOM.selectedImpactValue.textContent =
      "—";
  }

  if (DOM.selectedLikelihoodValue) {
    DOM.selectedLikelihoodValue.textContent =
      "—";
  }

  if (DOM.calculatedRatingValue) {
    DOM.calculatedRatingValue.textContent =
      "—";
  }

  DOM.calculatedImpactCategory
    ?.classList.add("hidden");
}


/* ============================================================
   18. SCENARIO RENDERING
============================================================ */

/**
 * Renders the selected scenario.
 */
function renderCurrentScenario() {
  const area =
    getCurrentArea();

  const scenario =
    getCurrentScenario();

  if (!area || !scenario) {
    showToast(
      "Unable to load the environmental situation.",
      "error"
    );

    showScreen("campusScreen");
    return;
  }

  resetScenarioState();

  const scenarioPosition =
    gameState.currentScenarioIndex + 1;

  if (DOM.currentScenarioNumber) {
    DOM.currentScenarioNumber.textContent =
      String(scenarioPosition);
  }

  if (DOM.scenarioCount) {
    DOM.scenarioCount.textContent =
      String(area.scenarios.length);
  }

  const progressPercentage =
    (
      gameState.currentScenarioIndex /
      area.scenarios.length
    ) * 100;

  updateProgressBar(
    DOM.scenarioProgressBar,
    progressPercentage
  );

  if (DOM.scenarioAreaName) {
    DOM.scenarioAreaName.textContent =
      area.name;
  }

  if (DOM.scenarioTitle) {
    DOM.scenarioTitle.textContent =
      scenario.title;
  }

  if (DOM.scenarioCategoryBadge) {
    DOM.scenarioCategoryBadge.textContent =
      `${scenario.categoryIcon || ""} ${scenario.category}`.trim();
  }

  if (DOM.scenarioSceneIcon) {
    DOM.scenarioSceneIcon.textContent =
      scenario.scene?.icon ||
      area.icon ||
      "🌿";
  }

  if (DOM.scenarioScene) {
    DOM.scenarioScene.setAttribute(
      "aria-label",
      scenario.scene?.alt ||
      scenario.title
    );
  }

  if (DOM.scenarioObservation) {
    DOM.scenarioObservation.textContent =
      scenario.scene?.observation ||
      "";
  }

  renderScenarioImage(scenario);

  renderAnswerOptions({
    container:
      DOM.aspectOptionList,

    options:
      scenario.aspect.options,

    groupName:
      "aspectAnswer",

    onSelection:
      handleAspectOptionSelection
  });

  renderAnswerOptions({
    container:
      DOM.impactOptionList,

    options:
      scenario.impact.options,

    groupName:
      "impactAnswer",

    onSelection:
      handleImpactOptionSelection
  });

  renderAnswerOptions({
    container:
      DOM.controlOptionList,

    options:
      scenario.control.options,

    groupName:
      "controlAnswer",

    onSelection:
      handleControlOptionSelection
  });

  renderCurrentAreaScore();

  saveGameState();
}


/**
 * Displays scenario image if provided.
 *
 * @param {object} scenario
 */
function renderScenarioImage(scenario) {
  if (
    !DOM.scenarioScene ||
    !DOM.scenarioScenePlaceholder
  ) {
    return;
  }

  DOM.scenarioScene
    .querySelectorAll(
      ".generated-scenario-image"
    )
    .forEach(
      (image) => image.remove()
    );

  const imagePath =
    scenario.scene?.image;

  if (!imagePath) {
    DOM.scenarioScenePlaceholder
      .classList.remove("hidden");

    return;
  }

  const image =
    document.createElement("img");

  image.className =
    "generated-scenario-image";

  image.src =
    imagePath;

  image.alt =
    scenario.scene?.alt ||
    scenario.title;

  image.addEventListener(
    "load",
    () => {
      DOM.scenarioScenePlaceholder
        .classList.add("hidden");
    }
  );

  image.addEventListener(
    "error",
    () => {
      image.remove();

      DOM.scenarioScenePlaceholder
        .classList.remove("hidden");
    }
  );

  DOM.scenarioScene.prepend(image);
}


/* ============================================================
   19. ANSWER OPTION GENERATION
============================================================ */

/**
 * Renders selectable answer options.
 *
 * @param {object} input
 * @param {HTMLElement|null} input.container
 * @param {Array<string>} input.options
 * @param {string} input.groupName
 * @param {Function} input.onSelection
 */
function renderAnswerOptions(input) {
  const {
    container,
    options,
    groupName,
    onSelection
  } = input;

  if (
    !container ||
    !Array.isArray(options)
  ) {
    return;
  }

  container.innerHTML = "";

  const answerOptions =
    EBM_APP_CONFIG.randomizeAnswerOptions &&
    typeof window.shuffleEBMOptions ===
      "function"
      ? window.shuffleEBMOptions(options)
      : [...options];

  answerOptions.forEach(
    (option, index) => {
      const label =
        document.createElement("label");

      label.className =
        "answer-option";

      const inputElement =
        document.createElement("input");

      inputElement.type =
        "radio";

      inputElement.name =
        groupName;

      inputElement.value =
        option;

      const indicator =
        document.createElement("span");

      indicator.className =
        "answer-option-indicator";

      indicator.setAttribute(
        "aria-hidden",
        "true"
      );

      indicator.textContent =
        String.fromCharCode(
          65 + index
        );

      const text =
        document.createElement("span");

      text.className =
        "answer-option-text";

      text.textContent =
        option;

      label.append(
        inputElement,
        indicator,
        text
      );

      inputElement.addEventListener(
        "change",
        () => {
          clearAnswerOptionStates(
            container
          );

          label.classList.add(
            "selected-answer"
          );

          onSelection?.(option);
        }
      );

      container.appendChild(label);
    }
  );
}


/**
 * Clears visual answer states.
 *
 * @param {HTMLElement|null} container
 */
function clearAnswerOptionStates(
  container
) {
  container
    ?.querySelectorAll(
      ".answer-option"
    )
    .forEach(
      (option) => {
        option.classList.remove(
          "selected-answer",
          "correct-answer",
          "incorrect-answer"
        );
      }
    );
}


/**
 * Disables all inputs inside an answer list.
 *
 * @param {HTMLElement|null} container
 */
function disableAnswerOptions(
  container
) {
  container
    ?.querySelectorAll("input")
    .forEach(
      (input) => {
        input.disabled = true;
      }
    );
}


/**
 * Marks selected and correct answers visually.
 *
 * @param {HTMLElement|null} container
 * @param {string} selectedAnswer
 * @param {string} correctAnswer
 */
function showAnswerResult(
  container,
  selectedAnswer,
  correctAnswer
) {
  container
    ?.querySelectorAll(
      ".answer-option"
    )
    .forEach(
      (option) => {
        const input =
          option.querySelector(
            "input"
          );

        const optionValue =
          input?.value || "";

        const optionIsCorrect =
          isMatchingAnswer(
            optionValue,
            correctAnswer
          );

        const optionWasSelected =
          isMatchingAnswer(
            optionValue,
            selectedAnswer
          );

        if (optionIsCorrect) {
          option.classList.add(
            "correct-answer"
          );
        }

        if (
          optionWasSelected &&
          !optionIsCorrect
        ) {
          option.classList.add(
            "incorrect-answer"
          );
        }
      }
    );
}


/**
 * Compares two answers.
 *
 * @param {*} first
 * @param {*} second
 * @returns {boolean}
 */
function isMatchingAnswer(
  first,
  second
) {
  if (
    typeof window.isCorrectEBMAnswer ===
    "function"
  ) {
    return window.isCorrectEBMAnswer(
      first,
      second
    );
  }

  return (
    String(first || "")
      .trim()
      .toLowerCase() ===
    String(second || "")
      .trim()
      .toLowerCase()
  );
}


/* ============================================================
   20. TASK NAVIGATION
============================================================ */

/**
 * Sets the active task panel.
 *
 * @param {"aspect"|"impact"|"rating"|"control"} step
 */
function setActiveTaskStep(step) {
  const panelMap = {
    aspect: "aspectTaskPanel",
    impact: "impactTaskPanel",
    rating: "ratingTaskPanel",
    control: "controlTaskPanel"
  };

  Object.entries(
    panelMap
  ).forEach(
    ([stepName, panelId]) => {
      byId(panelId)?.classList.toggle(
        "active-task-panel",
        stepName === step
      );
    }
  );

  document
    .querySelectorAll(
      ".task-step"
    )
    .forEach(
      (button) => {
        button.classList.toggle(
          "active-task-step",
          button.dataset.taskStep ===
            step
        );
      }
    );

  gameState.currentTaskStep =
    step;

  saveGameState();
}


/* ============================================================
   21. ASPECT STEP
============================================================ */

/**
 * Handles aspect option selection.
 *
 * @param {string} value
 */
function handleAspectOptionSelection(
  value
) {
  gameState.selectedAnswers.aspect =
    value;

  if (DOM.submitAspectButton) {
    DOM.submitAspectButton.disabled =
      false;
  }

  playSound("click");
}


/**
 * Submits the environmental aspect answer.
 */
function submitAspectAnswer() {
  const scenario =
    getCurrentScenario();

  const selected =
    gameState.selectedAnswers.aspect;

  if (!scenario || !selected) {
    showToast(
      "Please select an environmental aspect.",
      "warning"
    );

    return;
  }

  const result =
    typeof window.scoreAspectSelection ===
    "function"
      ? window.scoreAspectSelection(
          selected,
          scenario.aspect.correct
        )
      : {
          isCorrect:
            isMatchingAnswer(
              selected,
              scenario.aspect.correct
            ),

          points:
            isMatchingAnswer(
              selected,
              scenario.aspect.correct
            )
              ? 20
              : 0,

          maximumPoints: 20
        };

  gameState.currentScenarioStepScores.aspect =
    result;

  disableAnswerOptions(
    DOM.aspectOptionList
  );

  if (
    EBM_APP_CONFIG
      .showCorrectAnswerAfterSubmission
  ) {
    showAnswerResult(
      DOM.aspectOptionList,
      selected,
      scenario.aspect.correct
    );
  }

  DOM.submitAspectButton.disabled =
    true;

  playSound(
    result.isCorrect
      ? "correct"
      : "incorrect"
  );

  showToast(
    result.isCorrect
      ? "Correct. You identified the environmental aspect."
      : `The environmental aspect is: ${scenario.aspect.correct}`,
    result.isCorrect
      ? "success"
      : "info"
  );

  window.setTimeout(
    () => {
      setActiveTaskStep("impact");
    },
    EBM_APP_CONFIG.transitionDelay
  );

  saveGameState();
}


/* ============================================================
   22. IMPACT STEP
============================================================ */

/**
 * Handles environmental impact selection.
 *
 * @param {string} value
 */
function handleImpactOptionSelection(
  value
) {
  gameState.selectedAnswers.impact =
    value;

  if (DOM.submitImpactButton) {
    DOM.submitImpactButton.disabled =
      false;
  }

  playSound("click");
}


/**
 * Submits the environmental impact answer.
 */
function submitImpactAnswer() {
  const scenario =
    getCurrentScenario();

  const selected =
    gameState.selectedAnswers.impact;

  if (!scenario || !selected) {
    showToast(
      "Please select an environmental impact.",
      "warning"
    );

    return;
  }

  const result =
    typeof window.scoreImpactSelection ===
    "function"
      ? window.scoreImpactSelection(
          selected,
          scenario.impact.correct
        )
      : {
          isCorrect:
            isMatchingAnswer(
              selected,
              scenario.impact.correct
            ),

          points:
            isMatchingAnswer(
              selected,
              scenario.impact.correct
            )
              ? 20
              : 0,

          maximumPoints: 20
        };

  gameState.currentScenarioStepScores.impact =
    result;

  disableAnswerOptions(
    DOM.impactOptionList
  );

  if (
    EBM_APP_CONFIG
      .showCorrectAnswerAfterSubmission
  ) {
    showAnswerResult(
      DOM.impactOptionList,
      selected,
      scenario.impact.correct
    );
  }

  DOM.submitImpactButton.disabled =
    true;

  playSound(
    result.isCorrect
      ? "correct"
      : "incorrect"
  );

  showToast(
    result.isCorrect
      ? "Correct. You identified the environmental impact."
      : `The environmental impact is: ${scenario.impact.correct}`,
    result.isCorrect
      ? "success"
      : "info"
  );

  window.setTimeout(
    () => {
      setActiveTaskStep("rating");
    },
    EBM_APP_CONFIG.transitionDelay
  );

  saveGameState();
}


/* ============================================================
   23. RATING STEP
============================================================ */

/**
 * Handles changes to consequence and occurrence ratings.
 */
function handleRatingSelection() {
  const consequence =
    Number(
      document.querySelector(
        "input[name='impactLevel']:checked"
      )?.value || 0
    );

  const occurrence =
    Number(
      document.querySelector(
        "input[name='likelihoodLevel']:checked"
      )?.value || 0
    );

  gameState.selectedAnswers.consequence =
    consequence || null;

  gameState.selectedAnswers.occurrence =
    occurrence || null;

  if (
    consequence &&
    occurrence
  ) {
    if (
      typeof window.renderLiveEnvironmentalRating ===
      "function"
    ) {
      window.renderLiveEnvironmentalRating(
        consequence,
        occurrence
      );
    } else {
      renderBasicLiveRating(
        consequence,
        occurrence
      );
    }

    if (DOM.submitRatingButton) {
      DOM.submitRatingButton.disabled =
        false;
    }
  } else {
    if (DOM.submitRatingButton) {
      DOM.submitRatingButton.disabled =
        true;
    }
  }

  saveGameState();
}


/**
 * Basic rating renderer fallback.
 *
 * @param {number} consequence
 * @param {number} occurrence
 */
function renderBasicLiveRating(
  consequence,
  occurrence
) {
  const score =
    consequence * occurrence;

  const category =
    score >= 12
      ? "High"
      : score >= 6
        ? "Medium"
        : "Low";

  if (DOM.selectedImpactValue) {
    DOM.selectedImpactValue.textContent =
      String(consequence);
  }

  if (DOM.selectedLikelihoodValue) {
    DOM.selectedLikelihoodValue.textContent =
      String(occurrence);
  }

  if (DOM.calculatedRatingValue) {
    DOM.calculatedRatingValue.textContent =
      String(score);
  }

  if (DOM.calculatedImpactBadge) {
    DOM.calculatedImpactBadge.textContent =
      category;
  }

  if (DOM.calculatedImpactMessage) {
    DOM.calculatedImpactMessage.textContent =
      category === "High"
        ? "Prompt action is required."
        : category === "Medium"
          ? "Action is required within a reasonable timeframe."
          : "Maintain current controls.";
  }

  DOM.calculatedImpactCategory
    ?.classList.remove("hidden");
}


/**
 * Submits the player's impact rating.
 */
function submitRatingAnswer() {
  const scenario =
    getCurrentScenario();

  const consequence =
    gameState.selectedAnswers.consequence;

  const occurrence =
    gameState.selectedAnswers.occurrence;

  if (
    !scenario ||
    !consequence ||
    !occurrence
  ) {
    showToast(
      "Please select both consequence and occurrence ratings.",
      "warning"
    );

    return;
  }

  let result;

  if (
    typeof window.scoreRatingSelection ===
    "function"
  ) {
    result =
      window.scoreRatingSelection({
        playerConsequence:
          consequence,

        playerOccurrence:
          occurrence,

        expectedConsequence:
          scenario.rating.consequence,

        expectedOccurrence:
          scenario.rating.occurrence
      });
  } else {
    const playerScore =
      consequence * occurrence;

    const expectedScore =
      scenario.rating.consequence *
      scenario.rating.occurrence;

    result = {
      consequenceCorrect:
        consequence ===
        scenario.rating.consequence,

      occurrenceCorrect:
        occurrence ===
        scenario.rating.occurrence,

      categoryCorrect:
        getSimpleImpactLevel(
          playerScore
        ) ===
        getSimpleImpactLevel(
          expectedScore
        ),

      points: 0,

      maximumPoints: 30
    };

    result.points =
      (
        result.consequenceCorrect
          ? 10
          : 0
      ) +
      (
        result.occurrenceCorrect
          ? 10
          : 0
      ) +
      (
        result.categoryCorrect
          ? 10
          : 0
      );
  }

  gameState.currentScenarioStepScores.rating =
    result;

  document
    .querySelectorAll(
      "input[name='impactLevel'], input[name='likelihoodLevel']"
    )
    .forEach(
      (input) => {
        input.disabled = true;
      }
    );

  DOM.submitRatingButton.disabled =
    true;

  const ratingCorrect =
    result.consequenceCorrect &&
    result.occurrenceCorrect;

  playSound(
    ratingCorrect
      ? "correct"
      : "incorrect"
  );

  showToast(
    ratingCorrect
      ? "Correct environmental impact rating."
      : `Expected rating: ${scenario.rating.consequence} × ${scenario.rating.occurrence} = ${scenario.rating.score} (${scenario.rating.level}).`,
    ratingCorrect
      ? "success"
      : "info"
  );

  window.setTimeout(
    () => {
      setActiveTaskStep("control");
    },
    EBM_APP_CONFIG.transitionDelay
  );

  saveGameState();
}


/**
 * Returns a basic impact level.
 *
 * @param {number} score
 * @returns {string}
 */
function getSimpleImpactLevel(score) {
  if (score >= 12) {
    return "High";
  }

  if (score >= 6) {
    return "Medium";
  }

  return "Low";
}


/* ============================================================
   24. CONTROL STEP
============================================================ */

/**
 * Handles environmental control selection.
 *
 * @param {string} value
 */
function handleControlOptionSelection(
  value
) {
  gameState.selectedAnswers.control =
    value;

  if (DOM.submitControlButton) {
    DOM.submitControlButton.disabled =
      false;
  }

  playSound("click");
}


/**
 * Submits the selected control and completes the scenario.
 */
function submitControlAnswer() {
  const scenario =
    getCurrentScenario();

  const selected =
    gameState.selectedAnswers.control;

  if (!scenario || !selected) {
    showToast(
      "Please select an environmental control.",
      "warning"
    );

    return;
  }

  const result =
    typeof window.scoreControlSelection ===
    "function"
      ? window.scoreControlSelection(
          selected,
          scenario.control.correct
        )
      : {
          isCorrect:
            isMatchingAnswer(
              selected,
              scenario.control.correct
            ),

          points:
            isMatchingAnswer(
              selected,
              scenario.control.correct
            )
              ? 20
              : 0,

          maximumPoints: 20
        };

  gameState.currentScenarioStepScores.control =
    result;

  disableAnswerOptions(
    DOM.controlOptionList
  );

  if (
    EBM_APP_CONFIG
      .showCorrectAnswerAfterSubmission
  ) {
    showAnswerResult(
      DOM.controlOptionList,
      selected,
      scenario.control.correct
    );
  }

  DOM.submitControlButton.disabled =
    true;

  playSound(
    result.isCorrect
      ? "correct"
      : "incorrect"
  );

  completeCurrentScenario();
}


/* ============================================================
   25. SCENARIO COMPLETION
============================================================ */

/**
 * Calculates and stores the completed scenario.
 */
function completeCurrentScenario() {
  const area =
    getCurrentArea();

  const scenario =
    getCurrentScenario();

  if (!area || !scenario) {
    return;
  }

  const scenarioScore =
    typeof window.calculateScenarioScore ===
    "function"
      ? window.calculateScenarioScore({
          selectedAspect:
            gameState.selectedAnswers.aspect,

          correctAspect:
            scenario.aspect.correct,

          selectedImpact:
            gameState.selectedAnswers.impact,

          correctImpact:
            scenario.impact.correct,

          playerConsequence:
            gameState.selectedAnswers.consequence,

          playerOccurrence:
            gameState.selectedAnswers.occurrence,

          expectedConsequence:
            scenario.rating.consequence,

          expectedOccurrence:
            scenario.rating.occurrence,

          selectedControl:
            gameState.selectedAnswers.control,

          correctControl:
            scenario.control.correct,

          completed: true
        })
      : calculateFallbackScenarioScore(
          scenario
        );

  const scenarioRecord = {
    areaId:
      area.id,

    areaName:
      area.name,

    scenarioId:
      scenario.id,

    scenarioTitle:
      scenario.title,

    category:
      scenario.category,

    metrics: {
      ...scenario.metrics
    },

    percentage:
      scenarioScore.percentage,

    totalScore:
      scenarioScore.totalScore,

    maximumScore:
      scenarioScore.maximumScore,

    correctDecisionCount:
      scenarioScore.correctDecisionCount,

    totalDecisionCount:
      scenarioScore.totalDecisionCount,

    selectedAnswers: {
      ...gameState.selectedAnswers
    },

    expectedAnswers: {
      aspect:
        scenario.aspect.correct,

      impact:
        scenario.impact.correct,

      consequence:
        scenario.rating.consequence,

      occurrence:
        scenario.rating.occurrence,

      control:
        scenario.control.correct
    },

    expectedRating: {
      consequence:
        scenario.rating.consequence,

      occurrence:
        scenario.rating.occurrence,

      score:
        scenario.rating.score,

      level:
        scenario.rating.level,

      classification:
        scenario.rating.classification
    },

    complianceObligation:
      scenario.complianceObligation ===
      true,

    completedAt:
      new Date().toISOString()
  };

  updateScenarioRecord(
    scenarioRecord
  );

  gameState.currentAreaSessionResults =
    gameState.scoring.scenarioResults
      .filter(
        (result) =>
          result.areaId === area.id
      );

  renderScenarioFeedback(
    scenario,
    scenarioScore
  );

  updateGlobalProgress();

  showScreen(
    "scenarioFeedbackScreen"
  );
}


/**
 * Fallback scenario score.
 *
 * @param {object} scenario
 * @returns {object}
 */
function calculateFallbackScenarioScore(
  scenario
) {
  const aspectCorrect =
    isMatchingAnswer(
      gameState.selectedAnswers.aspect,
      scenario.aspect.correct
    );

  const impactCorrect =
    isMatchingAnswer(
      gameState.selectedAnswers.impact,
      scenario.impact.correct
    );

  const consequenceCorrect =
    Number(
      gameState.selectedAnswers.consequence
    ) ===
    Number(
      scenario.rating.consequence
    );

  const occurrenceCorrect =
    Number(
      gameState.selectedAnswers.occurrence
    ) ===
    Number(
      scenario.rating.occurrence
    );

  const categoryCorrect =
    getSimpleImpactLevel(
      Number(
        gameState.selectedAnswers.consequence
      ) *
      Number(
        gameState.selectedAnswers.occurrence
      )
    ) ===
    scenario.rating.level;

  const controlCorrect =
    isMatchingAnswer(
      gameState.selectedAnswers.control,
      scenario.control.correct
    );

  const totalScore =
    (
      aspectCorrect ? 20 : 0
    ) +
    (
      impactCorrect ? 20 : 0
    ) +
    (
      consequenceCorrect ? 10 : 0
    ) +
    (
      occurrenceCorrect ? 10 : 0
    ) +
    (
      categoryCorrect ? 10 : 0
    ) +
    (
      controlCorrect ? 20 : 0
    ) +
    10;

  return {
    totalScore,
    maximumScore: 100,
    percentage: totalScore,
    correctDecisionCount: [
      aspectCorrect,
      impactCorrect,
      consequenceCorrect,
      occurrenceCorrect,
      categoryCorrect,
      controlCorrect
    ].filter(Boolean).length,
    totalDecisionCount: 6
  };
}


/**
 * Adds or replaces a scenario result.
 *
 * @param {object} scenarioRecord
 */
function updateScenarioRecord(
  scenarioRecord
) {
  const index =
    gameState.scoring.scenarioResults
      .findIndex(
        (result) =>
          result.scenarioId ===
          scenarioRecord.scenarioId
      );

  if (index >= 0) {
    gameState.scoring.scenarioResults[
      index
    ] = scenarioRecord;
  } else {
    gameState.scoring.scenarioResults
      .push(scenarioRecord);
  }

  recalculateCompleteScoreState();
}


/**
 * Recalculates overall scores and metrics.
 */
function recalculateCompleteScoreState() {
  const scenarioResults =
    gameState.scoring.scenarioResults;

  const totalScenarios =
    getTotalScenarioCount();

  const totalAreas =
    getGameAreas().length;

  const completedAreaIds =
    getGameAreas()
      .filter(
        (area) => {
          const areaResults =
            scenarioResults.filter(
              (result) =>
                result.areaId ===
                area.id
            );

          return (
            areaResults.length >=
            area.scenarios.length
          );
        }
      )
      .map(
        (area) => area.id
      );

  gameState.scoring.completedAreaIds =
    completedAreaIds;

  gameState.scoring.completedScenarioIds =
    [
      ...new Set(
        scenarioResults.map(
          (result) =>
            result.scenarioId
        )
      )
    ];

  const overall =
    typeof window.calculateOverallEcoScore ===
    "function"
      ? window.calculateOverallEcoScore(
          scenarioResults,
          totalScenarios
        )
      : calculateFallbackOverallScore(
          scenarioResults,
          totalScenarios
        );

  gameState.scoring.totalScore =
    overall.totalEarnedPoints;

  gameState.scoring.maximumScore =
    overall.totalAvailablePoints;

  gameState.scoring.ecoScore =
    overall.percentage;

  gameState.scoring.metrics =
    typeof window.calculateEnvironmentalMetricScores ===
    "function"
      ? window.calculateEnvironmentalMetricScores(
          scenarioResults
        )
      : {};

  gameState.scoring.impactCounts =
    typeof window.countEnvironmentalImpactCategories ===
    "function"
      ? window.countEnvironmentalImpactCategories(
          scenarioResults
        )
      : {
          low: 0,
          medium: 0,
          high: 0,
          compliancePriority: 0,
          significantTotal: 0
        };

  gameState.scoring.areaResults =
    getGameAreas().reduce(
      (areaMap, area) => {
        const results =
          scenarioResults.filter(
            (result) =>
              result.areaId === area.id
          );

        if (results.length > 0) {
          areaMap[area.id] =
            typeof window.calculateAreaScore ===
            "function"
              ? window.calculateAreaScore(
                  results
                )
              : {};
        }

        return areaMap;
      },
      {}
    );

  updateGlobalProgress();

  if (
    gameState.scoring.completedAreaIds
      .length === totalAreas
  ) {
    DOM.continueToCommitmentsButton
      ?.classList.remove("hidden");
  }

  saveGameState();
}


/**
 * Fallback overall score.
 *
 * @param {Array<object>} results
 * @param {number} totalScenarios
 * @returns {object}
 */
function calculateFallbackOverallScore(
  results,
  totalScenarios
) {
  const earned =
    results.reduce(
      (sum, result) =>
        sum +
        Number(
          result.totalScore || 0
        ),
      0
    );

  const maximum =
    totalScenarios * 100;

  return {
    totalEarnedPoints:
      earned,

    totalAvailablePoints:
      maximum,

    percentage:
      maximum > 0
        ? Math.round(
            (
              earned /
              maximum
            ) * 100
          )
        : 0
  };
}


/* ============================================================
   26. SCENARIO FEEDBACK SCREEN
============================================================ */

/**
 * Renders the scenario feedback.
 *
 * @param {object} scenario
 * @param {object} scenarioScore
 */
function renderScenarioFeedback(
  scenario,
  scenarioScore
) {
  const feedback =
    typeof window.generateScenarioFeedback ===
    "function"
      ? window.generateScenarioFeedback({
          scenario,
          scenarioScore
        })
      : {
          title:
            "Environmental Situation Reviewed",

          status:
            "good",

          icon:
            "✓",

          summary:
            `You earned ${scenarioScore.totalScore} out of ${scenarioScore.maximumScore} points.`,

          aspect:
            scenario.aspect.correct,

          impact:
            scenario.impact.correct,

          rating: {
            score:
              scenario.rating.score,

            finalLevel:
              scenario.rating.level,

            finalClassification:
              scenario.rating.classification
          },

          pointsEarned:
            scenarioScore.totalScore,

          awarenessMessage:
            scenario.awarenessMessage,

          complianceAlert:
            scenario.complianceObligation
        };

  if (DOM.feedbackStatusIcon) {
    DOM.feedbackStatusIcon.textContent =
      feedback.icon;
  }

  if (DOM.feedbackKicker) {
    DOM.feedbackKicker.textContent =
      "Situation Resolved";
  }

  if (DOM.feedbackTitle) {
    DOM.feedbackTitle.textContent =
      feedback.title;
  }

  if (DOM.feedbackSummary) {
    DOM.feedbackSummary.textContent =
      feedback.summary;
  }

  if (DOM.feedbackAspect) {
    DOM.feedbackAspect.textContent =
      feedback.aspect;
  }

  if (DOM.feedbackImpact) {
    DOM.feedbackImpact.textContent =
      feedback.impact;
  }

  if (DOM.feedbackImpactRating) {
    DOM.feedbackImpactRating.textContent =
      String(
        feedback.rating.score
      );
  }

  if (DOM.feedbackImpactLevel) {
    DOM.feedbackImpactLevel.textContent =
      `${feedback.rating.finalLevel} / ${feedback.rating.finalClassification}`;
  }

  if (DOM.feedbackPointsEarned) {
    DOM.feedbackPointsEarned.textContent =
      String(
        feedback.pointsEarned
      );
  }

  if (
    DOM.feedbackAwarenessMessage
  ) {
    DOM.feedbackAwarenessMessage.textContent =
      feedback.awarenessMessage;
  }

  DOM.complianceAlertBox?.classList.toggle(
    "hidden",
    !feedback.complianceAlert
  );

  const area =
    getCurrentArea();

  const finalScenario =
    area &&
    gameState.currentScenarioIndex >=
      area.scenarios.length - 1;

  DOM.nextScenarioButton?.classList.toggle(
    "hidden",
    Boolean(finalScenario)
  );

  DOM.completeAreaButton?.classList.toggle(
    "hidden",
    !finalScenario
  );
}


/**
 * Moves to the next scenario.
 */
function goToNextScenario() {
  const area =
    getCurrentArea();

  if (!area) {
    return;
  }

  if (
    gameState.currentScenarioIndex <
    area.scenarios.length - 1
  ) {
    gameState.currentScenarioIndex += 1;

    renderCurrentScenario();

    showScreen("scenarioScreen");

    return;
  }

  completeCurrentArea();
}


/* ============================================================
   27. AREA COMPLETION
============================================================ */

/**
 * Completes the selected area.
 */
function completeCurrentArea() {
  const area =
    getCurrentArea();

  if (!area) {
    return;
  }

  const areaResults =
    gameState.scoring.scenarioResults
      .filter(
        (result) =>
          result.areaId === area.id
      );

  const feedback =
    typeof window.generateAreaCompletionFeedback ===
    "function"
      ? window.generateAreaCompletionFeedback(
          area,
          areaResults
        )
      : {
          title:
            `${area.name} Restored`,

          message:
            "You completed the environmental situations in this area.",

          score:
            areaResults.reduce(
              (sum, result) =>
                sum +
                Number(
                  result.totalScore || 0
                ),
              0
            ),

          correctDecisionCount:
            areaResults.reduce(
              (sum, result) =>
                sum +
                Number(
                  result.correctDecisionCount ||
                  0
                ),
              0
            ),

          ecoImprovement:
            "+100%",

          learningPoints:
            area.learningObjectives || []
        };

  if (DOM.areaCompletionTitle) {
    DOM.areaCompletionTitle.textContent =
      feedback.title;
  }

  if (DOM.areaCompletionMessage) {
    DOM.areaCompletionMessage.textContent =
      feedback.message;
  }

  if (DOM.areaCompletionScore) {
    DOM.areaCompletionScore.textContent =
      String(feedback.score);
  }

  if (
    DOM.areaCorrectDecisionCount
  ) {
    DOM.areaCorrectDecisionCount.textContent =
      String(
        feedback.correctDecisionCount
      );
  }

  if (DOM.areaEcoImprovement) {
    DOM.areaEcoImprovement.textContent =
      feedback.ecoImprovement;
  }

  if (DOM.areaLearningPointList) {
    DOM.areaLearningPointList.innerHTML =
      "";

    feedback.learningPoints.forEach(
      (point) => {
        const item =
          document.createElement("li");

        item.textContent =
          point;

        DOM.areaLearningPointList
          .appendChild(item);
      }
    );
  }

  createCelebration();

  playSound("complete");

  showScreen(
    "areaCompletionScreen"
  );
}


/**
 * Returns from completion screen to campus.
 */
function returnToCampus() {
  gameState.currentAreaId = null;
  gameState.currentScenarioIndex = 0;
  gameState.currentAreaSessionResults = [];

  renderAreaCards();
  updateGlobalProgress();

  showScreen("campusScreen");
}


/* ============================================================
   28. CURRENT AREA SCORE
============================================================ */

/**
 * Updates the current area score display.
 */
function renderCurrentAreaScore() {
  const area =
    getCurrentArea();

  if (!area || !DOM.currentAreaScore) {
    return;
  }

  const areaResults =
    gameState.scoring.scenarioResults
      .filter(
        (result) =>
          result.areaId === area.id
      );

  const total =
    areaResults.reduce(
      (sum, result) =>
        sum +
        Number(
          result.totalScore || 0
        ),
      0
    );

  DOM.currentAreaScore.textContent =
    String(total);
}


/* ============================================================
   29. GLOBAL PROGRESS
============================================================ */

/**
 * Updates all global progress indicators.
 */
function updateGlobalProgress() {
  const totalAreas =
    getGameAreas().length;

  const completedAreas =
    gameState.scoring.completedAreaIds
      ?.length || 0;

  const completedScenarios =
    gameState.scoring
      .completedScenarioIds
      ?.length || 0;

  const totalScenarios =
    getTotalScenarioCount();

  const ecoScore =
    Math.round(
      Number(
        gameState.scoring.ecoScore || 0
      )
    );

  const completionPercentage =
    totalScenarios > 0
      ? Math.round(
          (
            completedScenarios /
            totalScenarios
          ) * 100
        )
      : 0;

  if (DOM.overallEcoScore) {
    DOM.overallEcoScore.textContent =
      `${ecoScore}%`;
  }

  if (DOM.completedAreaCount) {
    DOM.completedAreaCount.textContent =
      String(completedAreas);
  }

  if (DOM.totalAreaCount) {
    DOM.totalAreaCount.textContent =
      String(totalAreas);
  }

  if (DOM.completedScenarioCount) {
    DOM.completedScenarioCount.textContent =
      String(completedScenarios);
  }

  updateProgressBar(
    DOM.mainProgressBar,
    completionPercentage
  );
}


/**
 * Updates an accessible progress bar.
 *
 * @param {HTMLElement|null} element
 * @param {number} percentage
 */
function updateProgressBar(
  element,
  percentage
) {
  if (!element) {
    return;
  }

  const safePercentage =
    Math.max(
      0,
      Math.min(
        100,
        Number(percentage) || 0
      )
    );

  element.style.width =
    `${safePercentage}%`;

  element.setAttribute(
    "aria-valuenow",
    String(
      Math.round(safePercentage)
    )
  );
}


/* ============================================================
   30. ECO DASHBOARD
============================================================ */

/**
 * Opens and renders the Eco Dashboard.
 */
function openEcoDashboard() {
  renderEcoDashboard();

  showScreen(
    "ecoDashboardScreen"
  );
}


/**
 * Renders the environmental metrics and impact counts.
 */
function renderEcoDashboard() {
  if (
    typeof window.renderEnvironmentalMetricScores ===
    "function"
  ) {
    window.renderEnvironmentalMetricScores(
      gameState.scoring.metrics || {}
    );
  } else {
    renderFallbackMetricScores();
  }

  if (
    typeof window.renderEnvironmentalImpactCounts ===
    "function"
  ) {
    window.renderEnvironmentalImpactCounts(
      gameState.scoring.impactCounts ||
      {}
    );
  } else {
    renderFallbackImpactCounts();
  }
}


/**
 * Fallback metric rendering.
 */
function renderFallbackMetricScores() {
  const metricMap = {
    water: [
      "waterMetricScore",
      "waterMetricBar"
    ],

    energy: [
      "energyMetricScore",
      "energyMetricBar"
    ],

    waste: [
      "wasteMetricScore",
      "wasteMetricBar"
    ],

    ghg: [
      "ghgMetricScore",
      "ghgMetricBar"
    ],

    paper: [
      "paperMetricScore",
      "paperMetricBar"
    ],

    nature: [
      "natureMetricScore",
      "natureMetricBar"
    ]
  };

  Object.entries(
    metricMap
  ).forEach(
    ([metricId, elementIds]) => {
      const percentage =
        Number(
          gameState.scoring.metrics
            ?.[metricId]?.percentage || 0
        );

      const scoreElement =
        byId(elementIds[0]);

      const barElement =
        byId(elementIds[1]);

      if (scoreElement) {
        scoreElement.textContent =
          `${Math.round(percentage)}%`;
      }

      updateProgressBar(
        barElement,
        percentage
      );
    }
  );
}


/**
 * Fallback impact count rendering.
 */
function renderFallbackImpactCounts() {
  const counts =
    gameState.scoring.impactCounts ||
    {};

  const map = {
    low:
      "lowImpactDecisionCount",

    medium:
      "mediumImpactDecisionCount",

    high:
      "highImpactDecisionCount"
  };

  Object.entries(map).forEach(
    ([key, id]) => {
      const element = byId(id);

      if (element) {
        element.textContent =
          String(counts[key] || 0);
      }
    }
  );
}


/* ============================================================
   31. COMMITMENT AVAILABILITY
============================================================ */

/**
 * Shows or hides the commitment button.
 */
function updateCommitmentButtonAvailability() {
  const completedAreas =
    gameState.scoring.completedAreaIds
      ?.length || 0;

  const totalAreas =
    getGameAreas().length;

  const allAreasCompleted =
    completedAreas >= totalAreas;

  const canContinue =
    EBM_APP_CONFIG
      .requireAllAreasBeforeCommitments
      ? allAreasCompleted
      : completedAreas > 0;

  DOM.continueToCommitmentsButton
    ?.classList.toggle(
      "hidden",
      !canContinue
    );
}


/**
 * Opens the commitment screen.
 */
function openCommitmentScreen() {
  const completedAreas =
    gameState.scoring.completedAreaIds
      ?.length || 0;

  const totalAreas =
    getGameAreas().length;

  if (
    EBM_APP_CONFIG
      .requireAllAreasBeforeCommitments &&
    completedAreas < totalAreas
  ) {
    showToast(
      `Complete all ${totalAreas} areas before selecting commitments.`,
      "warning"
    );

    return;
  }

  restoreCommitmentSelections();

  showScreen("commitmentScreen");
}


/* ============================================================
   32. COMMITMENTS
============================================================ */

/**
 * Returns selected commitment checkbox values.
 *
 * @returns {Array<string>}
 */
function getSelectedCommitments() {
  return [
    ...document.querySelectorAll(
      "input[name='commitment']:checked"
    )
  ].map(
    (input) => input.value
  );
}


/**
 * Handles commitment checkbox changes.
 *
 * @param {Event} event
 */
function handleCommitmentSelection(event) {
  const selected =
    getSelectedCommitments();

  const maximum =
    EBM_APP_CONFIG.requiredCommitments;

  if (
    event.target.checked &&
    selected.length > maximum
  ) {
    event.target.checked = false;

    showToast(
      `You can select only ${maximum} commitments.`,
      "warning"
    );
  }

  const finalSelected =
    getSelectedCommitments();

  if (DOM.selectedCommitmentCount) {
    DOM.selectedCommitmentCount.textContent =
      String(finalSelected.length);
  }

  if (DOM.submitCommitmentsButton) {
    DOM.submitCommitmentsButton.disabled =
      finalSelected.length !== maximum;
  }

  if (DOM.commitmentError) {
    DOM.commitmentError.textContent =
      finalSelected.length === maximum
        ? ""
        : `Select exactly ${maximum} commitments.`;
  }
}


/**
 * Restores prior commitment selections.
 */
function restoreCommitmentSelections() {
  const stored =
    gameState.commitments || [];

  document
    .querySelectorAll(
      "input[name='commitment']"
    )
    .forEach(
      (input) => {
        input.checked =
          stored.includes(input.value);
      }
    );

  const count =
    getSelectedCommitments().length;

  if (DOM.selectedCommitmentCount) {
    DOM.selectedCommitmentCount.textContent =
      String(count);
  }

  if (DOM.submitCommitmentsButton) {
    DOM.submitCommitmentsButton.disabled =
      count !==
      EBM_APP_CONFIG.requiredCommitments;
  }
}


/**
 * Confirms commitments and opens final result.
 *
 * @param {SubmitEvent} event
 */
function submitCommitments(event) {
  event.preventDefault();

  const selected =
    getSelectedCommitments();

  if (
    selected.length !==
    EBM_APP_CONFIG.requiredCommitments
  ) {
    if (DOM.commitmentError) {
      DOM.commitmentError.textContent =
        `Select exactly ${EBM_APP_CONFIG.requiredCommitments} commitments.`;
    }

    showToast(
      `Please select exactly ${EBM_APP_CONFIG.requiredCommitments} commitments.`,
      "warning"
    );

    return;
  }

  gameState.commitments =
    [...selected];

  gameState.scoring.commitments =
    [...selected];

  gameState.completedAt =
    new Date().toISOString();

  gameState.scoring.completedAt =
    gameState.completedAt;

  renderFinalResult();

  createCelebration();

  playSound("complete");

  showScreen("finalResultScreen");
}


/* ============================================================
   33. FINAL RESULT
============================================================ */

/**
 * Generates and displays the final game result.
 */
function renderFinalResult() {
  const summary =
    typeof window.generateFinalGameSummary ===
    "function"
      ? window.generateFinalGameSummary({
          scenarioResults:
            gameState.scoring.scenarioResults,

          totalAvailableScenarios:
            getTotalScenarioCount(),

          areasCompleted:
            gameState.scoring
              .completedAreaIds.length,

          totalAvailableAreas:
            getGameAreas().length,

          commitments:
            gameState.commitments
        })
      : generateFallbackFinalSummary();

  gameState.finalSummary =
    summary;

  if (
    typeof window.renderFinalEcoScoreCircle ===
    "function"
  ) {
    window.renderFinalEcoScoreCircle(
      summary.ecoScore
    );
  } else if (DOM.finalEcoScore) {
    DOM.finalEcoScore.textContent =
      `${summary.ecoScore}%`;
  }

  if (DOM.finalResultBadge) {
    DOM.finalResultBadge.textContent =
      `${summary.resultLevel.icon || ""} ${summary.resultLevel.level}`.trim();
  }

  if (DOM.finalResultDescription) {
    DOM.finalResultDescription.textContent =
      summary.resultLevel.description;
  }

  if (DOM.finalAreasCompleted) {
    DOM.finalAreasCompleted.textContent =
      String(summary.areasCompleted);
  }

  if (DOM.finalScenariosCompleted) {
    DOM.finalScenariosCompleted.textContent =
      String(summary.scenariosCompleted);
  }

  if (
    DOM.finalCorrectDecisionPercentage
  ) {
    DOM.finalCorrectDecisionPercentage.textContent =
      `${summary.correctDecisionPercentage}%`;
  }

  if (DOM.finalHighImpactCount) {
    DOM.finalHighImpactCount.textContent =
      String(summary.highImpactCount);
  }

  renderFinalCommitmentList(
    summary.commitments
  );

  updateSubmissionStatus(
    gameState.finalSubmitted
      ? "success"
      : "ready"
  );
}


/**
 * Generates a fallback final summary.
 *
 * @returns {object}
 */
function generateFallbackFinalSummary() {
  const scenarios =
    gameState.scoring.scenarioResults;

  const ecoScore =
    gameState.scoring.ecoScore || 0;

  const correct =
    scenarios.reduce(
      (sum, result) =>
        sum +
        Number(
          result.correctDecisionCount ||
          0
        ),
      0
    );

  const decisions =
    scenarios.reduce(
      (sum, result) =>
        sum +
        Number(
          result.totalDecisionCount ||
          0
        ),
      0
    );

  const resultLevel =
    ecoScore >= 85
      ? {
          level: "Eco Guardian",
          icon: "🌍",
          description:
            "Excellent environmental awareness."
        }
      : ecoScore >= 70
        ? {
            level: "Eco Champion",
            icon: "🌳",
            description:
              "Strong environmental awareness."
          }
        : ecoScore >= 50
          ? {
              level: "Eco Supporter",
              icon: "🌿",
              description:
                "Good environmental progress."
            }
          : {
              level: "Eco Learner",
              icon: "🌱",
              description:
                "Continue developing your environmental awareness."
            };

  return {
    ecoScore,

    resultLevel,

    areasCompleted:
      gameState.scoring.completedAreaIds
        .length,

    scenariosCompleted:
      scenarios.length,

    correctDecisionPercentage:
      decisions > 0
        ? Math.round(
            (
              correct /
              decisions
            ) * 100
          )
        : 0,

    highImpactCount:
      gameState.scoring.impactCounts
        ?.high || 0,

    commitments:
      [...gameState.commitments]
  };
}


/**
 * Displays selected commitments.
 *
 * @param {Array<string>} commitments
 */
function renderFinalCommitmentList(
  commitments
) {
  if (!DOM.finalCommitmentList) {
    return;
  }

  DOM.finalCommitmentList.innerHTML =
    "";

  commitments.forEach(
    (commitment) => {
      const item =
        document.createElement("li");

      item.innerHTML =
        `<span class="commitment-check" aria-hidden="true">✓</span>
         <span class="final-commitment-text"></span>`;

      const text =
        item.querySelector(
          ".final-commitment-text"
        );

      if (text) {
        text.textContent =
          commitment;
      }

      DOM.finalCommitmentList
        .appendChild(item);
    }
  );
}


/* ============================================================
   34. FINAL SUBMISSION
============================================================ */

/**
 * Updates final submission status.
 *
 * @param {"ready"|"submitting"|"success"|"error"} status
 * @param {string} [customMessage]
 */
function updateSubmissionStatus(
  status,
  customMessage = ""
) {
  const configurations = {
    ready: {
      icon: "⏳",
      message:
        "Your campaign result is ready to submit."
    },

    submitting: {
      icon: "↻",
      message:
        "Submitting your campaign result..."
    },

    success: {
      icon: "✓",
      message:
        "Your campaign result has been submitted successfully."
    },

    error: {
      icon: "!",
      message:
        "The result could not be submitted. Your progress remains saved in this browser."
    }
  };

  const configuration =
    configurations[status] ||
    configurations.ready;

  if (DOM.submissionStatusIcon) {
    DOM.submissionStatusIcon.textContent =
      configuration.icon;
  }

  if (DOM.submissionStatusMessage) {
    DOM.submissionStatusMessage.textContent =
      customMessage ||
      configuration.message;
  }

  if (DOM.submitFinalResultButton) {
    DOM.submitFinalResultButton.disabled =
      status === "submitting" ||
      status === "success";
  }
}


/**
 * Builds the result payload for Google Sheets.
 *
 * @returns {object}
 */
function buildSubmissionPayload() {
  const summary =
    gameState.finalSummary ||
    generateFallbackFinalSummary();

  const metrics =
    gameState.scoring.metrics || {};

  return {
    gameId:
      window.EBM_GAME_DATA?.config
        ?.gameId ||
      "ebm-eco-rescue-2026",

    campaignName:
      window.EBM_GAME_DATA?.config
        ?.campaignName ||
      "World Nature Conservation Day & Water Awareness Campaign",

    submittedAt:
      new Date().toISOString(),

    startedAt:
      gameState.startedAt,

    completedAt:
      gameState.completedAt,

    employeeName:
      gameState.player.employeeName,

    employeeId:
      gameState.player.employeeId,

    department:
      gameState.player.department,

    employmentType:
      gameState.player.employmentType,

    areasCompleted:
      summary.areasCompleted,

    totalAreas:
      getGameAreas().length,

    scenariosCompleted:
      summary.scenariosCompleted,

    totalScenarios:
      getTotalScenarioCount(),

    ecoScore:
      summary.ecoScore,

    resultLevel:
      summary.resultLevel.level,

    correctDecisionPercentage:
      summary.correctDecisionPercentage,

    waterScore:
      metrics.water?.percentage || 0,

    energyScore:
      metrics.energy?.percentage || 0,

    wasteScore:
      metrics.waste?.percentage || 0,

    ghgScore:
      metrics.ghg?.percentage || 0,

    paperScore:
      metrics.paper?.percentage || 0,

    natureScore:
      metrics.nature?.percentage || 0,

    lowImpactCount:
      gameState.scoring.impactCounts
        ?.low || 0,

    mediumImpactCount:
      gameState.scoring.impactCounts
        ?.medium || 0,

    highImpactCount:
      gameState.scoring.impactCounts
        ?.high || 0,

    compliancePriorityCount:
      gameState.scoring.impactCounts
        ?.compliancePriority || 0,

    commitments:
      [...gameState.commitments],

    commitment1:
      gameState.commitments[0] || "",

    commitment2:
      gameState.commitments[1] || "",

    commitment3:
      gameState.commitments[2] || "",

userAgent:
  navigator.userAgent,

    scenarioResults:
      gameState.scoring.scenarioResults
  };
}


/**
 * Submits the final result.
 */
async function submitFinalResult() {
  if (gameState.finalSubmitted) {
    showToast(
      "Your result has already been submitted.",
      "info"
    );

    return;
  }

  const payload =
    buildSubmissionPayload();

  if (
    EBM_APP_CONFIG
      .enableGoogleSheetSubmission !==
      true ||
    !EBM_APP_CONFIG.googleAppsScriptUrl
  ) {
    /*
     * Development mode:
     * Keep the result locally and allow the game flow to continue.
     */
    console.info(
      "EBM Eco Rescue result payload:",
      payload
    );

    gameState.finalSubmitted = true;

    saveGameState();

    updateSubmissionStatus(
      "success",
      "Result saved successfully in this browser. Google Sheets submission can be enabled after the Apps Script URL is added."
    );

    showToast(
      "Result saved successfully.",
      "success"
    );

    window.setTimeout(
      () => {
        showScreen("thankYouScreen");
      },
      900
    );

    return;
  }

  updateSubmissionStatus(
    "submitting"
  );

  showLoading(
    "Submitting Result",
    "Please wait while your environmental awareness result is recorded."
  );

  try {
    await postResultToAppsScript(
      payload
    );

    gameState.finalSubmitted =
      true;

    saveGameState();

    updateSubmissionStatus(
      "success"
    );

    showToast(
      "Your campaign result has been submitted.",
      "success"
    );

    hideLoading();

    window.setTimeout(
      () => {
        showScreen("thankYouScreen");
      },
      900
    );
  } catch (error) {
    console.error(
      "Final submission failed:",
      error
    );

    hideLoading();

    updateSubmissionStatus(
      "error"
    );

    showToast(
      "Submission failed. Your result remains saved in this browser.",
      "error"
    );
  }
}


/**
 * Posts the result to Google Apps Script.
 *
 * @param {object} payload
 */
async function postResultToAppsScript(
  payload
) {
  const controller =
    new AbortController();

  const timeoutId =
    window.setTimeout(
      () => {
        controller.abort();
      },
      EBM_APP_CONFIG.submissionTimeout
    );

  try {
    /*
     * text/plain avoids some Apps Script CORS preflight issues.
     * appsScript.gs should parse e.postData.contents as JSON.
     */
    const response =
      await fetch(
        EBM_APP_CONFIG.googleAppsScriptUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(payload),

          signal:
            controller.signal,

          redirect:
            "follow"
        }
      );

    if (!response.ok) {
      throw new Error(
        `Submission returned HTTP ${response.status}.`
      );
    }

    const responseText =
      await response.text();

    if (!responseText) {
      return {
        success: true
      };
    }

    try {
      const responseData =
        JSON.parse(responseText);

      if (
        responseData.success === false
      ) {
        throw new Error(
          responseData.message ||
          "Apps Script returned an error."
        );
      }

      return responseData;
    } catch (parseError) {
      /*
       * Apps Script may return a non-JSON redirect response.
       * A successful HTTP response is accepted.
       */
      return {
        success: true,
        rawResponse: responseText
      };
    }
  } finally {
    window.clearTimeout(
      timeoutId
    );
  }
}


/* ============================================================
   35. CELEBRATION EFFECT
============================================================ */

/**
 * Creates a short confetti effect.
 */
function createCelebration() {
  if (!DOM.celebrationLayer) {
    return;
  }

  const pieces = 45;

  for (
    let index = 0;
    index < pieces;
    index += 1
  ) {
    const piece =
      document.createElement("span");

    piece.className =
      "confetti-piece";

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.top =
      `${-10 - Math.random() * 20}px`;

    piece.style.animationDelay =
      `${Math.random() * 0.6}s`;

    piece.style.animationDuration =
      `${2 + Math.random() * 1.8}s`;

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    piece.style.background =
      [
        "#0f6b45",
        "#2f956c",
        "#d9a227",
        "#3c8fd8",
        "#6b73c9"
      ][
        Math.floor(
          Math.random() * 5
        )
      ];

    DOM.celebrationLayer
      .appendChild(piece);

    window.setTimeout(
      () => {
        piece.remove();
      },
      4200
    );
  }
}


/* ============================================================
   36. RESTART
============================================================ */

/**
 * Opens restart confirmation.
 */
function requestRestart() {
  openModal(
    DOM.restartConfirmationModal
  );
}


/**
 * Completely resets the game.
 */
function restartGame() {
  closeModal(
    DOM.restartConfirmationModal
  );

  closeModal(
    DOM.exitAreaConfirmationModal
  );

  clearSavedGameState();

  gameState =
    createDefaultGameState();

  gameState.soundEnabled =
    loadSoundPreference();

  DOM.playerRegistrationForm?.reset();
  DOM.commitmentForm?.reset();

  clearRegistrationErrors();

  if (DOM.selectedCommitmentCount) {
    DOM.selectedCommitmentCount.textContent =
      "0";
  }

  if (DOM.submitCommitmentsButton) {
    DOM.submitCommitmentsButton.disabled =
      true;
  }

  renderSoundState();
  renderAreaCards();
  updateGlobalProgress();

  showScreen("welcomeScreen");

  showToast(
    "The game has been restarted.",
    "info"
  );
}


/* ============================================================
   37. EXIT AREA
============================================================ */

/**
 * Opens the exit-area confirmation.
 */
function requestExitArea() {
  openModal(
    DOM.exitAreaConfirmationModal
  );
}


/**
 * Exits the current area.
 */
function confirmExitArea() {
  closeModal(
    DOM.exitAreaConfirmationModal
  );

  gameState.currentAreaId = null;
  gameState.currentScenarioIndex = 0;
  gameState.currentAreaSessionResults = [];

  resetScenarioState();

  renderAreaCards();

  showScreen("campusScreen");
}


/* ============================================================
   38. RESTORE PREVIOUS SESSION
============================================================ */

/**
 * Restores player form values.
 */
function restorePlayerForm() {
  if (DOM.employeeName) {
    DOM.employeeName.value =
      gameState.player.employeeName || "";
  }

  if (DOM.employeeId) {
    DOM.employeeId.value =
      gameState.player.employeeId || "";
  }

  if (DOM.departmentSelect) {
    DOM.departmentSelect.value =
      gameState.player.department || "";
  }

  if (
    gameState.player.employmentType
  ) {
    const radio =
      document.querySelector(
        `input[name='employmentType'][value="${CSS.escape(
          gameState.player
            .employmentType
        )}"]`
      );

    if (radio) {
      radio.checked = true;
    }
  }
}


/**
 * Restores the correct application screen.
 */
function restoreApplicationView() {
  renderPlayerInformation();
  renderAreaCards();
  updateGlobalProgress();
  renderSoundState();

  if (
    !gameState.player.employeeName
  ) {
    showScreen(
      "welcomeScreen",
      false
    );

    return;
  }

  const safeScreen =
    EBM_SCREEN_IDS.includes(
      gameState.currentScreenId
    )
      ? gameState.currentScreenId
      : "campusScreen";

  if (
    safeScreen === "scenarioScreen" &&
    gameState.currentAreaId
  ) {
    renderCurrentScenario();
  }

  if (
    safeScreen === "areaIntroductionScreen" &&
    gameState.currentAreaId
  ) {
    openAreaIntroduction(
      gameState.currentAreaId
    );

    return;
  }

  if (
    safeScreen === "ecoDashboardScreen"
  ) {
    renderEcoDashboard();
  }

  if (
    safeScreen === "commitmentScreen"
  ) {
    restoreCommitmentSelections();
  }

  if (
    safeScreen === "finalResultScreen"
  ) {
    renderFinalResult();
  }

  showScreen(
    safeScreen,
    false
  );
}


/* ============================================================
   39. EVENT LISTENERS
============================================================ */

/**
 * Registers application event listeners.
 */
function registerEventListeners() {
  DOM.playerRegistrationForm
    ?.addEventListener(
      "submit",
      handlePlayerRegistration
    );

  DOM.openCampusButton
    ?.addEventListener(
      "click",
      () => {
        renderAreaCards();
        showScreen("campusScreen");
      }
    );

  DOM.soundToggleButton
    ?.addEventListener(
      "click",
      toggleSound
    );

  DOM.helpButton
    ?.addEventListener(
      "click",
      () => {
        openModal(DOM.helpModal);
      }
    );

  DOM.closeHelpModalButton
    ?.addEventListener(
      "click",
      () => {
        closeModal(DOM.helpModal);
      }
    );

  DOM.restartButton
    ?.addEventListener(
      "click",
      requestRestart
    );

  DOM.cancelRestartButton
    ?.addEventListener(
      "click",
      () => {
        closeModal(
          DOM.restartConfirmationModal
        );
      }
    );

  DOM.confirmRestartButton
    ?.addEventListener(
      "click",
      restartGame
    );

  DOM.backToCampusFromIntroButton
    ?.addEventListener(
      "click",
      () => {
        renderAreaCards();
        showScreen("campusScreen");
      }
    );

  DOM.startAreaMissionButton
    ?.addEventListener(
      "click",
      startSelectedAreaMission
    );

  DOM.exitScenarioButton
    ?.addEventListener(
      "click",
      requestExitArea
    );

  DOM.cancelExitAreaButton
    ?.addEventListener(
      "click",
      () => {
        closeModal(
          DOM.exitAreaConfirmationModal
        );
      }
    );

  DOM.confirmExitAreaButton
    ?.addEventListener(
      "click",
      confirmExitArea
    );

  DOM.submitAspectButton
    ?.addEventListener(
      "click",
      submitAspectAnswer
    );

  DOM.submitImpactButton
    ?.addEventListener(
      "click",
      submitImpactAnswer
    );

  DOM.submitRatingButton
    ?.addEventListener(
      "click",
      submitRatingAnswer
    );

  DOM.submitControlButton
    ?.addEventListener(
      "click",
      submitControlAnswer
    );

  document
    .querySelectorAll(
      "input[name='impactLevel'], input[name='likelihoodLevel']"
    )
    .forEach(
      (input) => {
        input.addEventListener(
          "change",
          handleRatingSelection
        );
      }
    );

  DOM.nextScenarioButton
    ?.addEventListener(
      "click",
      goToNextScenario
    );

  DOM.completeAreaButton
    ?.addEventListener(
      "click",
      completeCurrentArea
    );

  DOM.returnToCampusButton
    ?.addEventListener(
      "click",
      returnToCampus
    );

  DOM.viewScoreDashboardButton
    ?.addEventListener(
      "click",
      openEcoDashboard
    );

  DOM.backToCampusFromDashboardButton
    ?.addEventListener(
      "click",
      () => {
        renderAreaCards();
        showScreen("campusScreen");
      }
    );

  DOM.continueToCommitmentsButton
    ?.addEventListener(
      "click",
      openCommitmentScreen
    );

  document
    .querySelectorAll(
      "input[name='commitment']"
    )
    .forEach(
      (input) => {
        input.addEventListener(
          "change",
          handleCommitmentSelection
        );
      }
    );

  DOM.commitmentForm
    ?.addEventListener(
      "submit",
      submitCommitments
    );

  DOM.submitFinalResultButton
    ?.addEventListener(
      "click",
      submitFinalResult
    );

  DOM.playAgainButton
    ?.addEventListener(
      "click",
      requestRestart
    );

  DOM.thankYouRestartButton
    ?.addEventListener(
      "click",
      restartGame
    );

  document
    .querySelectorAll(
      ".modal-overlay"
    )
    .forEach(
      (modal) => {
        modal.addEventListener(
          "click",
          (event) => {
            if (
              event.target === modal
            ) {
              closeModal(modal);
            }
          }
        );
      }
    );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const openModalElement =
        document.querySelector(
          ".modal-overlay:not(.hidden)"
        );

      if (openModalElement) {
        closeModal(
          openModalElement
        );
      }
    }
  );
}


/* ============================================================
   40. INITIAL DATA VALIDATION
============================================================ */

/**
 * Validates required game data and scoring functions.
 *
 * @returns {boolean}
 */
function validateApplicationDependencies() {
  const errors = [];

  if (
    !window.EBM_GAME_DATA ||
    !Array.isArray(
      window.EBM_GAME_DATA.areas
    )
  ) {
    errors.push(
      "gameData.js did not load correctly."
    );
  }

  if (
    !window.EBM_IMPACT_MATRIX
  ) {
    errors.push(
      "impactMatrix.js did not load correctly."
    );
  }

  if (errors.length > 0) {
    console.error(
      "EBM Eco Rescue dependency errors:",
      errors
    );

    showToast(
      "The game files did not load correctly. Check the browser console.",
      "error"
    );

    return false;
  }

  return true;
}


/* ============================================================
   41. APPLICATION INITIALIZATION
============================================================ */

/**
 * Initializes EBM Eco Rescue.
 */
function initializeEBMEcoRescue() {
  cacheDOMElements();

  gameState.soundEnabled =
    loadSoundPreference();

  const savedState =
    loadSavedGameState();

  if (savedState) {
    gameState =
      mergeSavedState(savedState);

    gameState.soundEnabled =
      loadSoundPreference();
  }

  registerEventListeners();

  validateApplicationDependencies();

  restorePlayerForm();

  renderPlayerInformation();

  renderAreaCards();

  recalculateCompleteScoreState();

  restoreApplicationView();

  console.info(
    `EBM Eco Rescue initialized with ${getGameAreas().length} areas and ${getTotalScenarioCount()} scenarios.`
  );
}


/* ============================================================
   42. START APPLICATION
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  initializeEBMEcoRescue
);