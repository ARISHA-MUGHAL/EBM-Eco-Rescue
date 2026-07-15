"use strict";

/* ============================================================
   EBM ECO RESCUE
   ENVIRONMENTAL SCORING AND IMPACT MATRIX

   File: impactMatrix.js

   Loading order:
   1. gameData.js
   2. impactMatrix.js
   3. script.js

   Core environmental calculation:

   Environmental Impact Rating =
   Consequence × Probability / Occurrence / Consumption

   EBM rating categories:

   1–4   = Low / Acceptable
   6–9   = Medium / Tolerable
   12–16 = High / Significant

   Important compliance rule:

   An environmental aspect connected with an applicable
   compliance obligation must receive priority even when its
   numerical impact rating is not High.
============================================================ */


/* ============================================================
   1. ENVIRONMENTAL MATRIX CONFIGURATION
============================================================ */

const EBM_IMPACT_MATRIX_CONFIG = Object.freeze({
  minimumRatingValue: 1,

  maximumRatingValue: 4,

  minimumMatrixScore: 1,

  maximumMatrixScore: 16,

  ratingFormula:
    "Consequence × Probability / Occurrence / Consumption",

  categoryThresholds: Object.freeze({
    low: Object.freeze({
      minimum: 1,
      maximum: 4,
      level: "Low",
      classification: "Acceptable",
      priority: 1,
      colorClass: "low",
      badgeClass: "impact-low",
      action:
        "Maintain the current controls and continue routine monitoring."
    }),

    medium: Object.freeze({
      minimum: 6,
      maximum: 9,
      level: "Medium",
      classification: "Tolerable",
      priority: 2,
      colorClass: "medium",
      badgeClass: "impact-medium",
      action:
        "Action is required within a reasonable timeframe to reduce the environmental impact."
    }),

    high: Object.freeze({
      minimum: 12,
      maximum: 16,
      level: "High",
      classification: "Significant",
      priority: 3,
      colorClass: "high",
      badgeClass: "impact-high",
      action:
        "Prompt action is required to reduce the environmental impact to an acceptable level."
    })
  }),

  scoring: Object.freeze({
    correctAspect: 20,
    correctImpact: 20,
    correctConsequence: 10,
    correctOccurrence: 10,
    correctOverallRating: 10,
    correctControl: 20,
    completionBonus: 10,

    maximumScenarioScore: 100,

    partialRatingTolerance: 1
  }),

  finalResultLevels: Object.freeze([
    Object.freeze({
      minimum: 0,
      maximum: 49,
      level: "Eco Learner",
      icon: "🌱",
      className: "eco-learner",
      description:
        "You have started your environmental awareness journey. Review the learning messages and replay the missions to strengthen your understanding."
    }),

    Object.freeze({
      minimum: 50,
      maximum: 69,
      level: "Eco Supporter",
      icon: "🌿",
      className: "eco-supporter",
      description:
        "You understand several important environmental practices. Continue improving how you identify impacts and select controls."
    }),

    Object.freeze({
      minimum: 70,
      maximum: 84,
      level: "Eco Champion",
      icon: "🌳",
      className: "eco-champion",
      description:
        "You demonstrated strong environmental awareness and selected effective controls in most situations."
    }),

    Object.freeze({
      minimum: 85,
      maximum: 100,
      level: "Eco Guardian",
      icon: "🌍",
      className: "eco-guardian",
      description:
        "You demonstrated excellent understanding of environmental aspects, impacts, significance and controls."
    })
  ])
});


/* ============================================================
   2. VALID MATRIX VALUES

   A 4 × 4 matrix produces only these values:

   1, 2, 3, 4, 6, 8, 9, 12 and 16

   Values such as 5, 7, 10, 11, 13, 14 and 15 are not produced
   by multiplying whole-number ratings from 1 to 4.
============================================================ */

const EBM_VALID_MATRIX_SCORES = Object.freeze([
  1,
  2,
  3,
  4,
  6,
  8,
  9,
  12,
  16
]);


/* ============================================================
   3. CONSEQUENCE DEFINITIONS
============================================================ */

const EBM_CONSEQUENCE_CRITERIA = Object.freeze([
  Object.freeze({
    value: 1,
    name: "Minor",
    shortName: "Minor",
    description:
      "Minor or negligible effect on people, the environment or natural resources.",
    examples: Object.freeze([
      "Minor amount of resource wastage",
      "Small isolated waste issue",
      "Negligible short-term environmental effect",
      "Minor seepage without wider contamination"
    ])
  }),

  Object.freeze({
    value: 2,
    name: "Moderate",
    shortName: "Moderate",
    description:
      "Moderate short-term environmental effect or medium resource wastage.",
    examples: Object.freeze([
      "Moderate threat or harm to the environment",
      "Medium amount of water or energy wastage",
      "Short-term environmental disturbance",
      "Moderate spill contained within a limited area"
    ])
  }),

  Object.freeze({
    value: 3,
    name: "Major",
    shortName: "Major",
    description:
      "Major, significant or long-term environmental effect.",
    examples: Object.freeze([
      "High amount of resource wastage",
      "Major environmental contamination potential",
      "Significant long-term environmental impact",
      "Major chemical or wastewater spill"
    ])
  }),

  Object.freeze({
    value: 4,
    name: "Severe",
    shortName: "Severe",
    description:
      "Severe, widespread, life-threatening or potentially irreversible environmental effect.",
    examples: Object.freeze([
      "Severe environmental harm",
      "Widespread land or groundwater contamination",
      "Large uncontrolled environmental release",
      "Major long-term impact on people or ecosystems"
    ])
  })
]);


/* ============================================================
   4. OCCURRENCE / CONSUMPTION DEFINITIONS
============================================================ */

const EBM_OCCURRENCE_CRITERIA = Object.freeze([
  Object.freeze({
    value: 1,
    name: "Rare",
    shortName: "Unlikely / Rare",
    description:
      "The event or uncontrolled release is unlikely or occurs only a few times in a year.",
    frequencyHint:
      "Few times in a year"
  }),

  Object.freeze({
    value: 2,
    name: "Sometimes",
    shortName: "Possible / Sometimes",
    description:
      "The event, release or resource use occurs periodically or a few times in a week.",
    frequencyHint:
      "Few times in a week"
  }),

  Object.freeze({
    value: 3,
    name: "Intermittent",
    shortName: "Likely / Intermittent",
    description:
      "The event, release or resource use occurs several times in a day.",
    frequencyHint:
      "Several times in a day"
  }),

  Object.freeze({
    value: 4,
    name: "Continuous",
    shortName: "Very Likely / Continuous",
    description:
      "The release or resource consumption continues throughout a shift or day.",
    frequencyHint:
      "Continuous during a shift or day"
  })
]);


/* ============================================================
   5. ENVIRONMENTAL METRIC CONFIGURATION
============================================================ */

const EBM_METRIC_CONFIG = Object.freeze({
  water: Object.freeze({
    id: "water",
    name: "Water Efficiency",
    icon: "💧",
    scoreElementId: "waterMetricScore",
    barElementId: "waterMetricBar",
    description:
      "Leakage, overflow, controlled cleaning, effluent and reuse."
  }),

  energy: Object.freeze({
    id: "energy",
    name: "Energy Efficiency",
    icon: "⚡",
    scoreElementId: "energyMetricScore",
    barElementId: "energyMetricBar",
    description:
      "Electricity, compressed air, steam, fuel and idle equipment."
  }),

  waste: Object.freeze({
    id: "waste",
    name: "Waste Management",
    icon: "♻️",
    scoreElementId: "wasteMetricScore",
    barElementId: "wasteMetricBar",
    description:
      "Waste prevention, segregation, reuse, recycling and disposal."
  }),

  ghg: Object.freeze({
    id: "ghg",
    name: "GHG Awareness",
    icon: "☁️",
    scoreElementId: "ghgMetricScore",
    barElementId: "ghgMetricBar",
    description:
      "Direct and indirect greenhouse-gas emissions."
  }),

  paper: Object.freeze({
    id: "paper",
    name: "Paper Reduction",
    icon: "📄",
    scoreElementId: "paperMetricScore",
    barElementId: "paperMetricBar",
    description:
      "Digital review, double-sided printing and responsible paper use."
  }),

  nature: Object.freeze({
    id: "nature",
    name: "Nature Protection",
    icon: "🌳",
    scoreElementId: "natureMetricScore",
    barElementId: "natureMetricBar",
    description:
      "Protection of land, water, trees, soil, flora and fauna."
  })
});


/* ============================================================
   6. BASIC VALIDATION HELPERS
============================================================ */

/**
 * Checks whether a value is a finite number.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isFiniteEBMNumber(value) {
  return Number.isFinite(Number(value));
}


/**
 * Converts a value to a number and restricts it to a range.
 *
 * @param {*} value
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
function clampEBMNumber(value, minimum, maximum) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(minimum, numericValue)
  );
}


/**
 * Converts a value to a percentage between 0 and 100.
 *
 * @param {*} value
 * @returns {number}
 */
function normalizeEBMPercentage(value) {
  return Math.round(
    clampEBMNumber(value, 0, 100)
  );
}


/**
 * Confirms that an impact or occurrence rating is an integer
 * from 1 to 4.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isValidEBMRatingValue(value) {
  const numericValue = Number(value);

  return (
    Number.isInteger(numericValue) &&
    numericValue >=
      EBM_IMPACT_MATRIX_CONFIG.minimumRatingValue &&
    numericValue <=
      EBM_IMPACT_MATRIX_CONFIG.maximumRatingValue
  );
}


/**
 * Throws an informative error if an impact matrix input is not
 * valid.
 *
 * @param {*} value
 * @param {string} fieldName
 */
function assertValidEBMRatingValue(value, fieldName) {
  if (!isValidEBMRatingValue(value)) {
    throw new RangeError(
      `${fieldName} must be a whole number from 1 to 4. Received: ${value}`
    );
  }
}


/* ============================================================
   7. CORE IMPACT RATING CALCULATION
============================================================ */

/**
 * Calculates the environmental impact rating.
 *
 * Formula:
 * consequence × occurrence
 *
 * @param {number} consequence
 * @param {number} occurrence
 * @returns {number}
 */
function calculateEnvironmentalImpactRating(
  consequence,
  occurrence
) {
  assertValidEBMRatingValue(
    consequence,
    "Consequence"
  );

  assertValidEBMRatingValue(
    occurrence,
    "Occurrence"
  );

  return Number(consequence) * Number(occurrence);
}


/**
 * Safe calculation that does not throw an error.
 *
 * @param {*} consequence
 * @param {*} occurrence
 * @returns {{
 *   valid: boolean,
 *   score: number|null,
 *   error: string|null
 * }}
 */
function tryCalculateEnvironmentalImpactRating(
  consequence,
  occurrence
) {
  try {
    const score =
      calculateEnvironmentalImpactRating(
        consequence,
        occurrence
      );

    return {
      valid: true,
      score,
      error: null
    };
  } catch (error) {
    return {
      valid: false,
      score: null,
      error: error.message
    };
  }
}


/* ============================================================
   8. IMPACT CATEGORY CALCULATION
============================================================ */

/**
 * Returns the base impact category from the numerical rating.
 *
 * @param {number} score
 * @returns {{
 *   minimum: number,
 *   maximum: number,
 *   level: string,
 *   classification: string,
 *   priority: number,
 *   colorClass: string,
 *   badgeClass: string,
 *   action: string
 * }}
 */
function getEnvironmentalImpactCategory(score) {
  const numericScore = Number(score);

  if (
    !Number.isFinite(numericScore) ||
    numericScore <
      EBM_IMPACT_MATRIX_CONFIG.minimumMatrixScore ||
    numericScore >
      EBM_IMPACT_MATRIX_CONFIG.maximumMatrixScore
  ) {
    throw new RangeError(
      `Impact score must be between 1 and 16. Received: ${score}`
    );
  }

  if (numericScore >= 12) {
    return {
      ...EBM_IMPACT_MATRIX_CONFIG.categoryThresholds.high
    };
  }

  if (numericScore >= 6) {
    return {
      ...EBM_IMPACT_MATRIX_CONFIG.categoryThresholds.medium
    };
  }

  return {
    ...EBM_IMPACT_MATRIX_CONFIG.categoryThresholds.low
  };
}


/**
 * Returns a category safely without throwing.
 *
 * @param {*} score
 * @returns {object|null}
 */
function tryGetEnvironmentalImpactCategory(score) {
  try {
    return getEnvironmentalImpactCategory(score);
  } catch (error) {
    console.error(
      "Unable to determine impact category:",
      error
    );

    return null;
  }
}


/* ============================================================
   9. COMPLIANCE-OBLIGATION OVERRIDE
============================================================ */

/**
 * Applies the EBM compliance significance rule.
 *
 * The numerical category remains visible, but compliance-related
 * scenarios receive significant priority.
 *
 * Example:
 * Numerical score: 8
 * Base category: Medium
 * Final management priority: Significant – Compliance
 *
 * @param {number} score
 * @param {boolean} hasComplianceObligation
 * @returns {object}
 */
function evaluateEnvironmentalSignificance(
  score,
  hasComplianceObligation = false
) {
  const baseCategory =
    getEnvironmentalImpactCategory(score);

  const complianceRequired =
    hasComplianceObligation === true;

  if (!complianceRequired) {
    return {
      numericalScore: Number(score),

      baseLevel: baseCategory.level,

      baseClassification:
        baseCategory.classification,

      finalLevel: baseCategory.level,

      finalClassification:
        baseCategory.classification,

      priority: baseCategory.priority,

      isSignificant:
        baseCategory.level === "High",

      isComplianceSignificant: false,

      colorClass: baseCategory.colorClass,

      badgeClass: baseCategory.badgeClass,

      action: baseCategory.action,

      complianceMessage: null
    };
  }

  return {
    numericalScore: Number(score),

    baseLevel: baseCategory.level,

    baseClassification:
      baseCategory.classification,

    finalLevel:
      baseCategory.level === "High"
        ? "High"
        : "Compliance Priority",

    finalClassification: "Significant",

    priority: 3,

    isSignificant: true,

    isComplianceSignificant: true,

    colorClass: "high",

    badgeClass: "impact-compliance",

    action:
      "This aspect must be addressed through adequate controls because an applicable compliance obligation has been identified.",

    complianceMessage:
      "Compliance obligation identified. Treat this aspect as significant regardless of its base numerical rating."
  };
}


/* ============================================================
   10. COMPLETE MATRIX EVALUATION
============================================================ */

/**
 * Evaluates consequence, occurrence and compliance together.
 *
 * @param {object} input
 * @param {number} input.consequence
 * @param {number} input.occurrence
 * @param {boolean} [input.complianceObligation]
 * @returns {object}
 */
function evaluateEnvironmentalImpact(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError(
      "Environmental impact evaluation requires an input object."
    );
  }

  const consequence = Number(
    input.consequence
  );

  const occurrence = Number(
    input.occurrence
  );

  const score =
    calculateEnvironmentalImpactRating(
      consequence,
      occurrence
    );

  const consequenceDetails =
    EBM_CONSEQUENCE_CRITERIA.find(
      (item) => item.value === consequence
    );

  const occurrenceDetails =
    EBM_OCCURRENCE_CRITERIA.find(
      (item) => item.value === occurrence
    );

  const significance =
    evaluateEnvironmentalSignificance(
      score,
      input.complianceObligation === true
    );

  return {
    consequence,
    occurrence,
    score,

    formula:
      `${consequence} × ${occurrence} = ${score}`,

    consequenceDetails:
      consequenceDetails || null,

    occurrenceDetails:
      occurrenceDetails || null,

    ...significance
  };
}


/* ============================================================
   11. PLAYER RATING COMPARISON
============================================================ */

/**
 * Compares the player's consequence and occurrence selections
 * with the expected scenario rating.
 *
 * @param {object} input
 * @param {number} input.playerConsequence
 * @param {number} input.playerOccurrence
 * @param {number} input.expectedConsequence
 * @param {number} input.expectedOccurrence
 * @returns {object}
 */
function comparePlayerImpactRating(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError(
      "Player rating comparison requires an input object."
    );
  }

  const playerConsequence =
    Number(input.playerConsequence);

  const playerOccurrence =
    Number(input.playerOccurrence);

  const expectedConsequence =
    Number(input.expectedConsequence);

  const expectedOccurrence =
    Number(input.expectedOccurrence);

  assertValidEBMRatingValue(
    playerConsequence,
    "Player consequence"
  );

  assertValidEBMRatingValue(
    playerOccurrence,
    "Player occurrence"
  );

  assertValidEBMRatingValue(
    expectedConsequence,
    "Expected consequence"
  );

  assertValidEBMRatingValue(
    expectedOccurrence,
    "Expected occurrence"
  );

  const playerScore =
    calculateEnvironmentalImpactRating(
      playerConsequence,
      playerOccurrence
    );

  const expectedScore =
    calculateEnvironmentalImpactRating(
      expectedConsequence,
      expectedOccurrence
    );

  const playerCategory =
    getEnvironmentalImpactCategory(
      playerScore
    );

  const expectedCategory =
    getEnvironmentalImpactCategory(
      expectedScore
    );

  const consequenceCorrect =
    playerConsequence === expectedConsequence;

  const occurrenceCorrect =
    playerOccurrence === expectedOccurrence;

  const exactScoreCorrect =
    playerScore === expectedScore;

  const categoryCorrect =
    playerCategory.level ===
    expectedCategory.level;

  const scoreDifference =
    Math.abs(playerScore - expectedScore);

  let accuracyLevel = "Incorrect";

  if (
    consequenceCorrect &&
    occurrenceCorrect
  ) {
    accuracyLevel = "Exact";
  } else if (exactScoreCorrect) {
    accuracyLevel = "Equivalent Score";
  } else if (categoryCorrect) {
    accuracyLevel = "Correct Category";
  } else if (
    scoreDifference <=
    EBM_IMPACT_MATRIX_CONFIG.scoring
      .partialRatingTolerance
  ) {
    accuracyLevel = "Close";
  }

  return {
    playerConsequence,
    playerOccurrence,
    playerScore,
    playerCategory,

    expectedConsequence,
    expectedOccurrence,
    expectedScore,
    expectedCategory,

    consequenceCorrect,
    occurrenceCorrect,
    exactScoreCorrect,
    categoryCorrect,
    scoreDifference,
    accuracyLevel,

    fullyCorrect:
      consequenceCorrect &&
      occurrenceCorrect
  };
}


/* ============================================================
   12. NORMALIZED TEXT COMPARISON

   Used to compare player selections with correct options.
============================================================ */

/**
 * Normalizes text for reliable option comparison.
 *
 * @param {*} value
 * @returns {string}
 */
function normalizeEBMAnswerText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


/**
 * Checks whether two answer strings match.
 *
 * @param {*} selectedAnswer
 * @param {*} correctAnswer
 * @returns {boolean}
 */
function isCorrectEBMAnswer(
  selectedAnswer,
  correctAnswer
) {
  return (
    normalizeEBMAnswerText(selectedAnswer) ===
    normalizeEBMAnswerText(correctAnswer)
  );
}


/* ============================================================
   13. SCENARIO SCORE CALCULATION
============================================================ */

/**
 * Calculates the player's score for one scenario.
 *
 * Maximum:
 *
 * Aspect                  20
 * Impact                  20
 * Consequence             10
 * Occurrence              10
 * Overall rating/category 10
 * Control                 20
 * Completion bonus        10
 * --------------------------------
 * Total                  100
 *
 * @param {object} input
 * @param {*} input.selectedAspect
 * @param {*} input.correctAspect
 * @param {*} input.selectedImpact
 * @param {*} input.correctImpact
 * @param {number} input.playerConsequence
 * @param {number} input.playerOccurrence
 * @param {number} input.expectedConsequence
 * @param {number} input.expectedOccurrence
 * @param {*} input.selectedControl
 * @param {*} input.correctControl
 * @param {boolean} [input.completed]
 * @returns {object}
 */
function calculateScenarioScore(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError(
      "Scenario scoring requires an input object."
    );
  }

  const scoreConfig =
    EBM_IMPACT_MATRIX_CONFIG.scoring;

  const aspectCorrect =
    isCorrectEBMAnswer(
      input.selectedAspect,
      input.correctAspect
    );

  const impactCorrect =
    isCorrectEBMAnswer(
      input.selectedImpact,
      input.correctImpact
    );

  const controlCorrect =
    isCorrectEBMAnswer(
      input.selectedControl,
      input.correctControl
    );

  const ratingComparison =
    comparePlayerImpactRating({
      playerConsequence:
        input.playerConsequence,

      playerOccurrence:
        input.playerOccurrence,

      expectedConsequence:
        input.expectedConsequence,

      expectedOccurrence:
        input.expectedOccurrence
    });

  const breakdown = {
    aspect:
      aspectCorrect
        ? scoreConfig.correctAspect
        : 0,

    impact:
      impactCorrect
        ? scoreConfig.correctImpact
        : 0,

    consequence:
      ratingComparison.consequenceCorrect
        ? scoreConfig.correctConsequence
        : 0,

    occurrence:
      ratingComparison.occurrenceCorrect
        ? scoreConfig.correctOccurrence
        : 0,

    overallRating:
      ratingComparison.categoryCorrect
        ? scoreConfig.correctOverallRating
        : 0,

    control:
      controlCorrect
        ? scoreConfig.correctControl
        : 0,

    completionBonus:
      input.completed !== false
        ? scoreConfig.completionBonus
        : 0
  };

  const rawScore = Object.values(
    breakdown
  ).reduce(
    (total, value) => total + value,
    0
  );

  const totalScore = clampEBMNumber(
    rawScore,
    0,
    scoreConfig.maximumScenarioScore
  );

  const percentage =
    normalizeEBMPercentage(
      (
        totalScore /
        scoreConfig.maximumScenarioScore
      ) * 100
    );

  const correctDecisionCount = [
    aspectCorrect,
    impactCorrect,
    ratingComparison.consequenceCorrect,
    ratingComparison.occurrenceCorrect,
    ratingComparison.categoryCorrect,
    controlCorrect
  ].filter(Boolean).length;

  return {
    totalScore,
    maximumScore:
      scoreConfig.maximumScenarioScore,

    percentage,

    breakdown,

    answers: {
      aspectCorrect,
      impactCorrect,
      controlCorrect
    },

    rating: ratingComparison,

    correctDecisionCount,

    totalDecisionCount: 6,

    allCoreAnswersCorrect:
      aspectCorrect &&
      impactCorrect &&
      ratingComparison.fullyCorrect &&
      controlCorrect
  };
}


/* ============================================================
   14. SIMPLE STEP-BY-STEP SCORE FUNCTIONS

   These functions can be used while the player progresses
   through Aspect, Impact, Rating and Control.
============================================================ */

/**
 * Scores the aspect step.
 *
 * @param {*} selected
 * @param {*} correct
 * @returns {object}
 */
function scoreAspectSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(selected, correct);

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG.scoring
            .correctAspect
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG.scoring
        .correctAspect
  };
}


/**
 * Scores the impact step.
 *
 * @param {*} selected
 * @param {*} correct
 * @returns {object}
 */
function scoreImpactSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(selected, correct);

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG.scoring
            .correctImpact
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG.scoring
        .correctImpact
  };
}


/**
 * Scores the control step.
 *
 * @param {*} selected
 * @param {*} correct
 * @returns {object}
 */
function scoreControlSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(selected, correct);

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG.scoring
            .correctControl
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG.scoring
        .correctControl
  };
}


/**
 * Scores the environmental rating step.
 *
 * @param {object} input
 * @returns {object}
 */
function scoreRatingSelection(input) {
  const comparison =
    comparePlayerImpactRating(input);

  const scoreConfig =
    EBM_IMPACT_MATRIX_CONFIG.scoring;

  const breakdown = {
    consequence:
      comparison.consequenceCorrect
        ? scoreConfig.correctConsequence
        : 0,

    occurrence:
      comparison.occurrenceCorrect
        ? scoreConfig.correctOccurrence
        : 0,

    overallRating:
      comparison.categoryCorrect
        ? scoreConfig.correctOverallRating
        : 0
  };

  const points = Object.values(
    breakdown
  ).reduce(
    (total, value) => total + value,
    0
  );

  return {
    ...comparison,

    points,

    maximumPoints:
      scoreConfig.correctConsequence +
      scoreConfig.correctOccurrence +
      scoreConfig.correctOverallRating,

    breakdown
  };
}


/* ============================================================
   15. SCENARIO METRIC CONTRIBUTION

   Each scenario in gameData.js contains metric weights:

   water, energy, waste, ghg, paper and nature.

   Example:
   metrics: {
     water: 60,
     energy: 10,
     waste: 20,
     ghg: 5,
     paper: 0,
     nature: 25
   }

   A player's scenario score is used to calculate the earned
   contribution for each metric.
============================================================ */

/**
 * Calculates the metric contribution from one completed scenario.
 *
 * @param {object} scenarioMetrics
 * @param {number} scenarioPercentage
 * @returns {object}
 */
function calculateScenarioMetricContribution(
  scenarioMetrics,
  scenarioPercentage
) {
  const safePercentage =
    normalizeEBMPercentage(
      scenarioPercentage
    );

  const result = {};

  Object.keys(EBM_METRIC_CONFIG).forEach(
    (metricId) => {
      const availableWeight =
        clampEBMNumber(
          scenarioMetrics?.[metricId],
          0,
          100
        );

      const earnedWeight =
        (
          availableWeight *
          safePercentage
        ) / 100;

      result[metricId] = {
        available:
          Number(
            availableWeight.toFixed(2)
          ),

        earned:
          Number(
            earnedWeight.toFixed(2)
          ),

        scenarioPercentage:
          safePercentage
      };
    }
  );

  return result;
}


/* ============================================================
   16. AGGREGATED METRIC SCORES
============================================================ */

/**
 * Calculates overall water, energy, waste, GHG, paper and nature
 * scores from completed scenario records.
 *
 * Expected scenario result format:
 *
 * {
 *   metrics: {
 *     water: 50,
 *     energy: 20,
 *     ...
 *   },
 *   percentage: 80
 * }
 *
 * @param {Array<object>} scenarioResults
 * @returns {object}
 */
function calculateEnvironmentalMetricScores(
  scenarioResults
) {
  const safeResults =
    Array.isArray(scenarioResults)
      ? scenarioResults
      : [];

  const totals = {};

  Object.keys(EBM_METRIC_CONFIG).forEach(
    (metricId) => {
      totals[metricId] = {
        available: 0,
        earned: 0
      };
    }
  );

  safeResults.forEach(
    (result) => {
      const contribution =
        calculateScenarioMetricContribution(
          result.metrics || {},
          result.percentage || 0
        );

      Object.keys(
        EBM_METRIC_CONFIG
      ).forEach(
        (metricId) => {
          totals[metricId].available +=
            contribution[metricId].available;

          totals[metricId].earned +=
            contribution[metricId].earned;
        }
      );
    }
  );

  const metricScores = {};

  Object.keys(EBM_METRIC_CONFIG).forEach(
    (metricId) => {
      const available =
        totals[metricId].available;

      const earned =
        totals[metricId].earned;

      const percentage =
        available > 0
          ? normalizeEBMPercentage(
              (earned / available) * 100
            )
          : 0;

      metricScores[metricId] = {
        id: metricId,

        name:
          EBM_METRIC_CONFIG[metricId].name,

        icon:
          EBM_METRIC_CONFIG[metricId].icon,

        available:
          Number(available.toFixed(2)),

        earned:
          Number(earned.toFixed(2)),

        percentage
      };
    }
  );

  return metricScores;
}


/* ============================================================
   17. AREA SCORE CALCULATION
============================================================ */

/**
 * Calculates the score for one completed area.
 *
 * Each scenario result should contain:
 *
 * {
 *   totalScore: 80,
 *   maximumScore: 100,
 *   percentage: 80,
 *   correctDecisionCount: 5,
 *   totalDecisionCount: 6
 * }
 *
 * @param {Array<object>} scenarioResults
 * @returns {object}
 */
function calculateAreaScore(
  scenarioResults
) {
  const safeResults =
    Array.isArray(scenarioResults)
      ? scenarioResults
      : [];

  if (safeResults.length === 0) {
    return {
      score: 0,
      maximumScore: 0,
      percentage: 0,
      scenariosCompleted: 0,
      correctDecisionCount: 0,
      totalDecisionCount: 0,
      correctDecisionPercentage: 0
    };
  }

  const totals = safeResults.reduce(
    (summary, result) => {
      summary.score +=
        Number(result.totalScore || 0);

      summary.maximumScore +=
        Number(result.maximumScore || 100);

      summary.correctDecisionCount +=
        Number(
          result.correctDecisionCount || 0
        );

      summary.totalDecisionCount +=
        Number(
          result.totalDecisionCount || 0
        );

      return summary;
    },
    {
      score: 0,
      maximumScore: 0,
      correctDecisionCount: 0,
      totalDecisionCount: 0
    }
  );

  const percentage =
    totals.maximumScore > 0
      ? normalizeEBMPercentage(
          (
            totals.score /
            totals.maximumScore
          ) * 100
        )
      : 0;

  const correctDecisionPercentage =
    totals.totalDecisionCount > 0
      ? normalizeEBMPercentage(
          (
            totals.correctDecisionCount /
            totals.totalDecisionCount
          ) * 100
        )
      : 0;

  return {
    score:
      Number(totals.score.toFixed(2)),

    maximumScore:
      Number(
        totals.maximumScore.toFixed(2)
      ),

    percentage,

    scenariosCompleted:
      safeResults.length,

    correctDecisionCount:
      totals.correctDecisionCount,

    totalDecisionCount:
      totals.totalDecisionCount,

    correctDecisionPercentage
  };
}


/* ============================================================
   18. OVERALL GAME SCORE
============================================================ */

/**
 * Calculates the overall Eco Score.
 *
 * The default overall score is based on the total points earned
 * across completed scenarios.
 *
 * @param {Array<object>} scenarioResults
 * @param {number} [totalAvailableScenarios]
 * @returns {object}
 */
function calculateOverallEcoScore(
  scenarioResults,
  totalAvailableScenarios
) {
  const safeResults =
    Array.isArray(scenarioResults)
      ? scenarioResults
      : [];

  const maximumPerScenario =
    EBM_IMPACT_MATRIX_CONFIG.scoring
      .maximumScenarioScore;

  const availableScenarioCount =
    Number.isInteger(
      Number(totalAvailableScenarios)
    ) &&
    Number(totalAvailableScenarios) > 0
      ? Number(totalAvailableScenarios)
      : safeResults.length;

  const totalEarnedPoints =
    safeResults.reduce(
      (total, result) =>
        total +
        Number(result.totalScore || 0),
      0
    );

  const totalAvailablePoints =
    availableScenarioCount *
    maximumPerScenario;

  const percentage =
    totalAvailablePoints > 0
      ? normalizeEBMPercentage(
          (
            totalEarnedPoints /
            totalAvailablePoints
          ) * 100
        )
      : 0;

  const completionPercentage =
    availableScenarioCount > 0
      ? normalizeEBMPercentage(
          (
            safeResults.length /
            availableScenarioCount
          ) * 100
        )
      : 0;

  return {
    totalEarnedPoints:
      Number(
        totalEarnedPoints.toFixed(2)
      ),

    totalAvailablePoints:
      Number(
        totalAvailablePoints.toFixed(2)
      ),

    completedScenarios:
      safeResults.length,

    totalAvailableScenarios:
      availableScenarioCount,

    completionPercentage,

    percentage,

    resultLevel:
      getFinalEcoResultLevel(
        percentage
      )
  };
}


/* ============================================================
   19. FINAL RESULT LEVEL
============================================================ */

/**
 * Returns the final Eco result level.
 *
 * @param {number} percentage
 * @returns {object}
 */
function getFinalEcoResultLevel(
  percentage
) {
  const safePercentage =
    normalizeEBMPercentage(
      percentage
    );

  const result =
    EBM_IMPACT_MATRIX_CONFIG
      .finalResultLevels
      .find(
        (level) =>
          safePercentage >=
            level.minimum &&
          safePercentage <=
            level.maximum
      );

  return result
    ? { ...result }
    : {
        ...EBM_IMPACT_MATRIX_CONFIG
          .finalResultLevels[0]
      };
}


/* ============================================================
   20. IMPACT CATEGORY COUNTS
============================================================ */

/**
 * Counts Low, Medium, High and compliance-priority scenarios.
 *
 * Expected result format:
 *
 * {
 *   expectedRating: {
 *     score: 12,
 *     level: "High"
 *   },
 *   complianceObligation: false
 * }
 *
 * @param {Array<object>} scenarioResults
 * @returns {object}
 */
function countEnvironmentalImpactCategories(
  scenarioResults
) {
  const counts = {
    low: 0,
    medium: 0,
    high: 0,
    compliancePriority: 0,
    significantTotal: 0
  };

  const safeResults =
    Array.isArray(scenarioResults)
      ? scenarioResults
      : [];

  safeResults.forEach(
    (result) => {
      const score =
        Number(
          result.expectedRating?.score ??
          result.rating?.expectedScore ??
          result.impactScore ??
          0
        );

      if (
        !Number.isFinite(score) ||
        score < 1
      ) {
        return;
      }

      const category =
        getEnvironmentalImpactCategory(
          score
        );

      if (category.level === "Low") {
        counts.low += 1;
      }

      if (category.level === "Medium") {
        counts.medium += 1;
      }

      if (category.level === "High") {
        counts.high += 1;
      }

      const compliance =
        result.complianceObligation === true;

      if (compliance) {
        counts.compliancePriority += 1;
      }

      if (
        category.level === "High" ||
        compliance
      ) {
        counts.significantTotal += 1;
      }
    }
  );

  return counts;
}


/* ============================================================
   21. SCENARIO FEEDBACK GENERATION
============================================================ */

/**
 * Generates learning-oriented feedback for a completed scenario.
 *
 * @param {object} input
 * @param {object} input.scenario
 * @param {object} input.scenarioScore
 * @returns {object}
 */
function generateScenarioFeedback(input) {
  if (
    !input ||
    typeof input !== "object" ||
    !input.scenario ||
    !input.scenarioScore
  ) {
    throw new TypeError(
      "Scenario feedback requires a scenario and scenario score."
    );
  }

  const scenario =
    input.scenario;

  const scenarioScore =
    input.scenarioScore;

  const percentage =
    normalizeEBMPercentage(
      scenarioScore.percentage
    );

  let title =
    "Environmental Situation Reviewed";

  let status =
    "learning";

  let icon =
    "💡";

  if (percentage >= 90) {
    title =
      "Excellent Environmental Decision";

    status =
      "excellent";

    icon =
      "✓";
  } else if (percentage >= 70) {
    title =
      "Good Environmental Decision";

    status =
      "good";

    icon =
      "✓";
  } else if (percentage >= 50) {
    title =
      "Good Progress — Review the Details";

    status =
      "partial";

    icon =
      "↻";
  } else {
    title =
      "Review This Environmental Situation";

    status =
      "review";

    icon =
      "!";
  }

  const expectedEvaluation =
    evaluateEnvironmentalImpact({
      consequence:
        scenario.rating.consequence,

      occurrence:
        scenario.rating.occurrence,

      complianceObligation:
        scenario.complianceObligation
    });

  return {
    title,
    status,
    icon,

    summary:
      `You earned ${scenarioScore.totalScore} out of ${scenarioScore.maximumScore} points in this situation.`,

    aspect:
      scenario.aspect.correct,

    impact:
      scenario.impact.correct,

    control:
      scenario.control.correct,

    rating:
      expectedEvaluation,

    pointsEarned:
      scenarioScore.totalScore,

    maximumPoints:
      scenarioScore.maximumScore,

    awarenessMessage:
      scenario.awarenessMessage,

    complianceAlert:
      scenario.complianceObligation === true,

    complianceMessage:
      scenario.complianceMessage ||
      expectedEvaluation.complianceMessage,

    learningPoints:
      Array.isArray(
        scenario.learningPoints
      )
        ? [...scenario.learningPoints]
        : []
  };
}


/* ============================================================
   22. AREA COMPLETION FEEDBACK
============================================================ */

/**
 * Generates feedback after all scenarios in an area are completed.
 *
 * @param {object} area
 * @param {Array<object>} scenarioResults
 * @returns {object}
 */
function generateAreaCompletionFeedback(
  area,
  scenarioResults
) {
  if (!area || typeof area !== "object") {
    throw new TypeError(
      "Area completion feedback requires an area object."
    );
  }

  const areaScore =
    calculateAreaScore(
      scenarioResults
    );

  let message =
    "You completed the environmental situations in this area.";

  if (areaScore.percentage >= 85) {
    message =
      "Excellent work. You demonstrated strong understanding of the environmental aspects and controls in this area.";
  } else if (areaScore.percentage >= 70) {
    message =
      "Good work. You identified most environmental issues and selected suitable controls.";
  } else if (areaScore.percentage >= 50) {
    message =
      "You completed the area. Review the awareness messages to improve your environmental decision-making.";
  } else {
    message =
      "You completed the area, but several important environmental controls require further review.";
  }

  const learningPoints =
    Array.isArray(
      area.learningObjectives
    )
      ? [...area.learningObjectives]
      : [];

  return {
    areaId: area.id,

    areaName: area.name,

    title:
      `${area.name} Restored`,

    message,

    score:
      areaScore.score,

    maximumScore:
      areaScore.maximumScore,

    percentage:
      areaScore.percentage,

    scenariosCompleted:
      areaScore.scenariosCompleted,

    correctDecisionCount:
      areaScore.correctDecisionCount,

    totalDecisionCount:
      areaScore.totalDecisionCount,

    correctDecisionPercentage:
      areaScore.correctDecisionPercentage,

    ecoImprovement:
      `+${areaScore.percentage}%`,

    learningPoints
  };
}


/* ============================================================
   23. FINAL GAME SUMMARY
============================================================ */

/**
 * Generates the complete final game summary.
 *
 * @param {object} input
 * @param {Array<object>} input.scenarioResults
 * @param {number} input.totalAvailableScenarios
 * @param {number} input.areasCompleted
 * @param {number} input.totalAvailableAreas
 * @param {Array<string>} [input.commitments]
 * @returns {object}
 */
function generateFinalGameSummary(input) {
  if (!input || typeof input !== "object") {
    throw new TypeError(
      "Final game summary requires an input object."
    );
  }

  const scenarioResults =
    Array.isArray(
      input.scenarioResults
    )
      ? input.scenarioResults
      : [];

  const overallScore =
    calculateOverallEcoScore(
      scenarioResults,
      input.totalAvailableScenarios
    );

  const metrics =
    calculateEnvironmentalMetricScores(
      scenarioResults
    );

  const impactCounts =
    countEnvironmentalImpactCategories(
      scenarioResults
    );

  const totalCorrectDecisions =
    scenarioResults.reduce(
      (total, result) =>
        total +
        Number(
          result.correctDecisionCount || 0
        ),
      0
    );

  const totalDecisions =
    scenarioResults.reduce(
      (total, result) =>
        total +
        Number(
          result.totalDecisionCount || 0
        ),
      0
    );

  const correctDecisionPercentage =
    totalDecisions > 0
      ? normalizeEBMPercentage(
          (
            totalCorrectDecisions /
            totalDecisions
          ) * 100
        )
      : 0;

  const areasCompleted =
    Math.max(
      0,
      Number(
        input.areasCompleted || 0
      )
    );

  const totalAvailableAreas =
    Math.max(
      0,
      Number(
        input.totalAvailableAreas || 0
      )
    );

  const areaCompletionPercentage =
    totalAvailableAreas > 0
      ? normalizeEBMPercentage(
          (
            areasCompleted /
            totalAvailableAreas
          ) * 100
        )
      : 0;

  return {
    ecoScore:
      overallScore.percentage,

    resultLevel:
      overallScore.resultLevel,

    totalEarnedPoints:
      overallScore.totalEarnedPoints,

    totalAvailablePoints:
      overallScore.totalAvailablePoints,

    areasCompleted,

    totalAvailableAreas,

    areaCompletionPercentage,

    scenariosCompleted:
      overallScore.completedScenarios,

    totalAvailableScenarios:
      overallScore.totalAvailableScenarios,

    scenarioCompletionPercentage:
      overallScore.completionPercentage,

    correctDecisions:
      totalCorrectDecisions,

    totalDecisions,

    correctDecisionPercentage,

    impactCounts,

    highImpactCount:
      impactCounts.high,

    compliancePriorityCount:
      impactCounts.compliancePriority,

    significantImpactCount:
      impactCounts.significantTotal,

    metrics,

    commitments:
      Array.isArray(
        input.commitments
      )
        ? [...input.commitments]
        : []
  };
}


/* ============================================================
   24. DASHBOARD DOM UPDATE HELPERS
============================================================ */

/**
 * Updates a progress bar safely.
 *
 * @param {HTMLElement|null} element
 * @param {number} percentage
 */
function updateEBMProgressBar(
  element,
  percentage
) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const safePercentage =
    normalizeEBMPercentage(
      percentage
    );

  element.style.width =
    `${safePercentage}%`;

  element.setAttribute(
    "aria-valuenow",
    String(safePercentage)
  );
}


/**
 * Updates all environmental metric cards.
 *
 * @param {object} metricScores
 */
function renderEnvironmentalMetricScores(
  metricScores
) {
  if (
    !metricScores ||
    typeof metricScores !== "object"
  ) {
    return;
  }

  Object.entries(
    EBM_METRIC_CONFIG
  ).forEach(
    ([metricId, config]) => {
      const metric =
        metricScores[metricId];

      const percentage =
        normalizeEBMPercentage(
          metric?.percentage || 0
        );

      const scoreElement =
        document.getElementById(
          config.scoreElementId
        );

      const barElement =
        document.getElementById(
          config.barElementId
        );

      if (scoreElement) {
        scoreElement.textContent =
          `${percentage}%`;
      }

      updateEBMProgressBar(
        barElement,
        percentage
      );
    }
  );
}


/**
 * Updates the Low, Medium and High count cards.
 *
 * @param {object} counts
 */
function renderEnvironmentalImpactCounts(
  counts
) {
  const safeCounts =
    counts &&
    typeof counts === "object"
      ? counts
      : {};

  const elementMap = {
    low:
      "lowImpactDecisionCount",

    medium:
      "mediumImpactDecisionCount",

    high:
      "highImpactDecisionCount"
  };

  Object.entries(
    elementMap
  ).forEach(
    ([key, elementId]) => {
      const element =
        document.getElementById(
          elementId
        );

      if (element) {
        element.textContent =
          String(
            Number(
              safeCounts[key] || 0
            )
          );
      }
    }
  );
}


/**
 * Updates the live environmental rating calculator.
 *
 * @param {number|null} consequence
 * @param {number|null} occurrence
 * @returns {object|null}
 */
function renderLiveEnvironmentalRating(
  consequence,
  occurrence
) {
  const consequenceElement =
    document.getElementById(
      "selectedImpactValue"
    );

  const occurrenceElement =
    document.getElementById(
      "selectedLikelihoodValue"
    );

  const scoreElement =
    document.getElementById(
      "calculatedRatingValue"
    );

  const categoryBox =
    document.getElementById(
      "calculatedImpactCategory"
    );

  const categoryBadge =
    document.getElementById(
      "calculatedImpactBadge"
    );

  const categoryMessage =
    document.getElementById(
      "calculatedImpactMessage"
    );

  if (consequenceElement) {
    consequenceElement.textContent =
      isValidEBMRatingValue(
        consequence
      )
        ? String(consequence)
        : "—";
  }

  if (occurrenceElement) {
    occurrenceElement.textContent =
      isValidEBMRatingValue(
        occurrence
      )
        ? String(occurrence)
        : "—";
  }

  if (
    !isValidEBMRatingValue(
      consequence
    ) ||
    !isValidEBMRatingValue(
      occurrence
    )
  ) {
    if (scoreElement) {
      scoreElement.textContent =
        "—";
    }

    if (categoryBox) {
      categoryBox.classList.add(
        "hidden"
      );
    }

    return null;
  }

  const evaluation =
    evaluateEnvironmentalImpact({
      consequence,
      occurrence,
      complianceObligation: false
    });

  if (scoreElement) {
    scoreElement.textContent =
      String(evaluation.score);
  }

  if (categoryBox) {
    categoryBox.classList.remove(
      "hidden",
      "low",
      "medium",
      "high"
    );

    categoryBox.classList.add(
      evaluation.colorClass
    );
  }

  if (categoryBadge) {
    categoryBadge.textContent =
      `${evaluation.finalLevel} — ${evaluation.finalClassification}`;
  }

  if (categoryMessage) {
    categoryMessage.textContent =
      evaluation.action;
  }

  return evaluation;
}


/* ============================================================
   25. SVG FINAL SCORE CIRCLE
============================================================ */

/**
 * Updates the final score circle in index.html.
 *
 * The SVG circle has:
 * radius = 58
 * circumference ≈ 364.42
 *
 * @param {number} percentage
 */
function renderFinalEcoScoreCircle(
  percentage
) {
  const safePercentage =
    normalizeEBMPercentage(
      percentage
    );

  const circle =
    document.getElementById(
      "finalScoreCircleProgress"
    );

  const scoreText =
    document.getElementById(
      "finalEcoScore"
    );

  const radius = 58;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (
      safePercentage /
      100
    ) *
    circumference;

  if (circle) {
    circle.style.strokeDasharray =
      String(circumference);

    circle.style.strokeDashoffset =
      String(offset);

    circle.setAttribute(
      "aria-valuenow",
      String(safePercentage)
    );
  }

  if (scoreText) {
    scoreText.textContent =
      `${safePercentage}%`;
  }
}


/* ============================================================
   26. MATRIX TABLE GENERATOR

   This is useful if script.js later displays a matrix modal.
============================================================ */

/**
 * Generates the complete 4 × 4 environmental matrix.
 *
 * @returns {Array<object>}
 */
function generateEnvironmentalImpactMatrix() {
  return EBM_CONSEQUENCE_CRITERIA.map(
    (consequence) => {
      return {
        consequenceValue:
          consequence.value,

        consequenceName:
          consequence.name,

        ratings:
          EBM_OCCURRENCE_CRITERIA.map(
            (occurrence) => {
              const score =
                calculateEnvironmentalImpactRating(
                  consequence.value,
                  occurrence.value
                );

              const category =
                getEnvironmentalImpactCategory(
                  score
                );

              return {
                occurrenceValue:
                  occurrence.value,

                occurrenceName:
                  occurrence.name,

                score,

                level:
                  category.level,

                classification:
                  category.classification,

                colorClass:
                  category.colorClass
              };
            }
          )
      };
    }
  );
}


/* ============================================================
   27. SCENARIO DATA VALIDATION
============================================================ */

/**
 * Validates a scenario rating and scoring structure.
 *
 * @param {object} scenario
 * @returns {{
 *   valid: boolean,
 *   errors: Array<string>,
 *   warnings: Array<string>
 * }}
 */
function validateEnvironmentalScenario(
  scenario
) {
  const errors = [];
  const warnings = [];

  if (
    !scenario ||
    typeof scenario !== "object"
  ) {
    return {
      valid: false,
      errors: [
        "Scenario must be an object."
      ],
      warnings
    };
  }

  if (!scenario.id) {
    errors.push(
      "Scenario ID is missing."
    );
  }

  if (!scenario.title) {
    errors.push(
      `Scenario ${scenario.id || "unknown"} does not have a title.`
    );
  }

  const consequence =
    scenario.rating?.consequence;

  const occurrence =
    scenario.rating?.occurrence;

  if (
    !isValidEBMRatingValue(
      consequence
    )
  ) {
    errors.push(
      `Scenario ${scenario.id || "unknown"} has an invalid consequence rating.`
    );
  }

  if (
    !isValidEBMRatingValue(
      occurrence
    )
  ) {
    errors.push(
      `Scenario ${scenario.id || "unknown"} has an invalid occurrence rating.`
    );
  }

  if (
    isValidEBMRatingValue(
      consequence
    ) &&
    isValidEBMRatingValue(
      occurrence
    )
  ) {
    const calculatedScore =
      calculateEnvironmentalImpactRating(
        consequence,
        occurrence
      );

    if (
      Number(
        scenario.rating?.score
      ) !== calculatedScore
    ) {
      errors.push(
        `Scenario ${scenario.id} rating mismatch: expected ${calculatedScore}, found ${scenario.rating?.score}.`
      );
    }

    const category =
      getEnvironmentalImpactCategory(
        calculatedScore
      );

    if (
      scenario.rating?.level &&
      scenario.rating.level !==
        category.level
    ) {
      errors.push(
        `Scenario ${scenario.id} category mismatch: expected ${category.level}, found ${scenario.rating.level}.`
      );
    }
  }

  const answerGroups = [
    {
      name: "aspect",
      data: scenario.aspect
    },
    {
      name: "impact",
      data: scenario.impact
    },
    {
      name: "control",
      data: scenario.control
    }
  ];

  answerGroups.forEach(
    (group) => {
      if (!group.data?.correct) {
        errors.push(
          `Scenario ${scenario.id || "unknown"} does not have a correct ${group.name} answer.`
        );

        return;
      }

      if (
        !Array.isArray(
          group.data.options
        )
      ) {
        errors.push(
          `Scenario ${scenario.id || "unknown"} does not contain ${group.name} options.`
        );

        return;
      }

      const containsCorrectAnswer =
        group.data.options.some(
          (option) =>
            isCorrectEBMAnswer(
              option,
              group.data.correct
            )
        );

      if (!containsCorrectAnswer) {
        errors.push(
          `Scenario ${scenario.id || "unknown"} is missing the correct ${group.name} answer in its options.`
        );
      }

      if (
        group.data.options.length < 3
      ) {
        warnings.push(
          `Scenario ${scenario.id || "unknown"} has fewer than three ${group.name} options.`
        );
      }
    }
  );

  Object.keys(
    EBM_METRIC_CONFIG
  ).forEach(
    (metricId) => {
      const value =
        scenario.metrics?.[metricId];

      if (
        value !== undefined &&
        (
          !isFiniteEBMNumber(value) ||
          Number(value) < 0 ||
          Number(value) > 100
        )
      ) {
        errors.push(
          `Scenario ${scenario.id || "unknown"} has an invalid ${metricId} metric value.`
        );
      }
    }
  );

  if (
    scenario.complianceObligation === true &&
    !scenario.complianceMessage
  ) {
    warnings.push(
      `Scenario ${scenario.id || "unknown"} has a compliance obligation but no specific compliance message.`
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,

    warnings
  };
}


/**
 * Validates all scenarios loaded from gameData.js.
 *
 * @returns {object}
 */
function validateAllEnvironmentalScenarios() {
  const areas =
    window.EBM_GAME_DATA?.areas;

  if (!Array.isArray(areas)) {
    return {
      valid: false,
      scenarioCount: 0,
      errors: [
        "EBM_GAME_DATA.areas is not available. Load gameData.js before impactMatrix.js."
      ],
      warnings: []
    };
  }

  const errors = [];
  const warnings = [];
  let scenarioCount = 0;

  areas.forEach(
    (area) => {
      if (
        !Array.isArray(
          area.scenarios
        )
      ) {
        errors.push(
          `Area ${area.id || "unknown"} does not contain a scenario array.`
        );

        return;
      }

      area.scenarios.forEach(
        (scenario) => {
          scenarioCount += 1;

          const validation =
            validateEnvironmentalScenario(
              scenario
            );

          validation.errors.forEach(
            (error) =>
              errors.push(error)
          );

          validation.warnings.forEach(
            (warning) =>
              warnings.push(warning)
          );
        }
      );
    }
  );

  return {
    valid:
      errors.length === 0,

    scenarioCount,

    errors,

    warnings
  };
}


/* ============================================================
   28. SCORING STATE FACTORY

   Creates a clean game scoring state for script.js.
============================================================ */

/**
 * Creates the initial game scoring state.
 *
 * @returns {object}
 */
function createInitialEnvironmentalScoreState() {
  const metricState = {};

  Object.keys(
    EBM_METRIC_CONFIG
  ).forEach(
    (metricId) => {
      metricState[metricId] = {
        available: 0,
        earned: 0,
        percentage: 0
      };
    }
  );

  return {
    totalScore: 0,

    maximumScore: 0,

    ecoScore: 0,

    completedAreaIds: [],

    completedScenarioIds: [],

    scenarioResults: [],

    areaResults: {},

    metrics: metricState,

    impactCounts: {
      low: 0,
      medium: 0,
      high: 0,
      compliancePriority: 0,
      significantTotal: 0
    },

    commitments: [],

    startedAt:
      new Date().toISOString(),

    completedAt: null
  };
}


/* ============================================================
   29. ADD OR REPLACE SCENARIO RESULT IN GAME STATE
============================================================ */

/**
 * Adds a completed scenario result or replaces an earlier result
 * for the same scenario.
 *
 * @param {object} scoreState
 * @param {object} scenarioRecord
 * @returns {object}
 */
function updateEnvironmentalScoreState(
  scoreState,
  scenarioRecord
) {
  const currentState =
    scoreState &&
    typeof scoreState === "object"
      ? structuredCloneSafe(
          scoreState
        )
      : createInitialEnvironmentalScoreState();

  if (
    !scenarioRecord ||
    typeof scenarioRecord !== "object" ||
    !scenarioRecord.scenarioId
  ) {
    throw new TypeError(
      "A valid scenario record with scenarioId is required."
    );
  }

  const existingIndex =
    currentState.scenarioResults
      .findIndex(
        (result) =>
          result.scenarioId ===
          scenarioRecord.scenarioId
      );

  if (existingIndex >= 0) {
    currentState.scenarioResults[
      existingIndex
    ] = {
      ...scenarioRecord
    };
  } else {
    currentState.scenarioResults.push({
      ...scenarioRecord
    });
  }

  currentState.completedScenarioIds =
    [
      ...new Set(
        currentState.scenarioResults.map(
          (result) =>
            result.scenarioId
        )
      )
    ];

  currentState.completedAreaIds =
    [
      ...new Set(
        currentState.scenarioResults
          .map(
            (result) =>
              result.areaId
          )
          .filter(Boolean)
      )
    ];

  const totalAvailableScenarios =
    window.getEBMTotalScenarioCount
      ? window.getEBMTotalScenarioCount()
      : currentState.scenarioResults.length;

  const overall =
    calculateOverallEcoScore(
      currentState.scenarioResults,
      totalAvailableScenarios
    );

  currentState.totalScore =
    overall.totalEarnedPoints;

  currentState.maximumScore =
    overall.totalAvailablePoints;

  currentState.ecoScore =
    overall.percentage;

  currentState.metrics =
    calculateEnvironmentalMetricScores(
      currentState.scenarioResults
    );

  currentState.impactCounts =
    countEnvironmentalImpactCategories(
      currentState.scenarioResults
    );

  return currentState;
}


/* ============================================================
   30. SAFE DEEP CLONE
============================================================ */

/**
 * Creates a safe deep clone.
 *
 * @param {*} value
 * @returns {*}
 */
function structuredCloneSafe(value) {
  if (
    typeof structuredClone ===
    "function"
  ) {
    return structuredClone(value);
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}


/* ============================================================
   31. PUBLIC API OBJECT
============================================================ */

const EBM_IMPACT_MATRIX = Object.freeze({
  config:
    EBM_IMPACT_MATRIX_CONFIG,

  validMatrixScores:
    EBM_VALID_MATRIX_SCORES,

  consequenceCriteria:
    EBM_CONSEQUENCE_CRITERIA,

  occurrenceCriteria:
    EBM_OCCURRENCE_CRITERIA,

  metricConfig:
    EBM_METRIC_CONFIG,

  calculateRating:
    calculateEnvironmentalImpactRating,

  tryCalculateRating:
    tryCalculateEnvironmentalImpactRating,

  getCategory:
    getEnvironmentalImpactCategory,

  evaluateSignificance:
    evaluateEnvironmentalSignificance,

  evaluateImpact:
    evaluateEnvironmentalImpact,

  comparePlayerRating:
    comparePlayerImpactRating,

  scoreScenario:
    calculateScenarioScore,

  scoreAspect:
    scoreAspectSelection,

  scoreImpact:
    scoreImpactSelection,

  scoreRating:
    scoreRatingSelection,

  scoreControl:
    scoreControlSelection,

  calculateScenarioMetricContribution,

  calculateMetricScores:
    calculateEnvironmentalMetricScores,

  calculateAreaScore,

  calculateOverallEcoScore,

  getFinalResultLevel:
    getFinalEcoResultLevel,

  countImpactCategories:
    countEnvironmentalImpactCategories,

  generateScenarioFeedback,

  generateAreaCompletionFeedback,

  generateFinalGameSummary,

  generateMatrix:
    generateEnvironmentalImpactMatrix,

  validateScenario:
    validateEnvironmentalScenario,

  validateAllScenarios:
    validateAllEnvironmentalScenarios,

  createInitialScoreState:
    createInitialEnvironmentalScoreState,

  updateScoreState:
    updateEnvironmentalScoreState,

  renderMetricScores:
    renderEnvironmentalMetricScores,

  renderImpactCounts:
    renderEnvironmentalImpactCounts,

  renderLiveRating:
    renderLiveEnvironmentalRating,

  renderFinalScoreCircle:
    renderFinalEcoScoreCircle
});


/* ============================================================
   32. EXPOSE FUNCTIONS TO SCRIPT.JS
============================================================ */

if (typeof window !== "undefined") {
  window.EBM_IMPACT_MATRIX =
    EBM_IMPACT_MATRIX;

  window.EBM_IMPACT_MATRIX_CONFIG =
    EBM_IMPACT_MATRIX_CONFIG;

  window.EBM_CONSEQUENCE_CRITERIA =
    EBM_CONSEQUENCE_CRITERIA;

  window.EBM_OCCURRENCE_CRITERIA =
    EBM_OCCURRENCE_CRITERIA;

  window.EBM_METRIC_CONFIG =
    EBM_METRIC_CONFIG;

  window.calculateEnvironmentalImpactRating =
    calculateEnvironmentalImpactRating;

  window.tryCalculateEnvironmentalImpactRating =
    tryCalculateEnvironmentalImpactRating;

  window.getEnvironmentalImpactCategory =
    getEnvironmentalImpactCategory;

  window.evaluateEnvironmentalSignificance =
    evaluateEnvironmentalSignificance;

  window.evaluateEnvironmentalImpact =
    evaluateEnvironmentalImpact;

  window.comparePlayerImpactRating =
    comparePlayerImpactRating;

  window.calculateScenarioScore =
    calculateScenarioScore;

  window.scoreAspectSelection =
    scoreAspectSelection;

  window.scoreImpactSelection =
    scoreImpactSelection;

  window.scoreRatingSelection =
    scoreRatingSelection;

  window.scoreControlSelection =
    scoreControlSelection;

  window.calculateScenarioMetricContribution =
    calculateScenarioMetricContribution;

  window.calculateEnvironmentalMetricScores =
    calculateEnvironmentalMetricScores;

  window.calculateAreaScore =
    calculateAreaScore;

  window.calculateOverallEcoScore =
    calculateOverallEcoScore;

  window.getFinalEcoResultLevel =
    getFinalEcoResultLevel;

  window.countEnvironmentalImpactCategories =
    countEnvironmentalImpactCategories;

  window.generateScenarioFeedback =
    generateScenarioFeedback;

  window.generateAreaCompletionFeedback =
    generateAreaCompletionFeedback;

  window.generateFinalGameSummary =
    generateFinalGameSummary;

  window.renderEnvironmentalMetricScores =
    renderEnvironmentalMetricScores;

  window.renderEnvironmentalImpactCounts =
    renderEnvironmentalImpactCounts;

  window.renderLiveEnvironmentalRating =
    renderLiveEnvironmentalRating;

  window.renderFinalEcoScoreCircle =
    renderFinalEcoScoreCircle;

  window.generateEnvironmentalImpactMatrix =
    generateEnvironmentalImpactMatrix;

  window.validateEnvironmentalScenario =
    validateEnvironmentalScenario;

  window.validateAllEnvironmentalScenarios =
    validateAllEnvironmentalScenarios;

  window.createInitialEnvironmentalScoreState =
    createInitialEnvironmentalScoreState;

  window.updateEnvironmentalScoreState =
    updateEnvironmentalScoreState;
}


/* ============================================================
   33. DEVELOPMENT VALIDATION
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const validation =
      validateAllEnvironmentalScenarios();

    if (!validation.valid) {
      console.error(
        "EBM environmental scoring validation failed:",
        validation.errors
      );
    } else {
      console.info(
        `EBM environmental scoring logic loaded successfully. ${validation.scenarioCount} scenarios validated.`
      );
    }

    if (
      validation.warnings.length > 0
    ) {
      console.warn(
        "EBM environmental scoring warnings:",
        validation.warnings
      );
    }
  }
);