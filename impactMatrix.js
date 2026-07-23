"use strict";

/* ============================================================
   EBM ECO RESCUE
   SCORING, REWARDS AND PROGRESSION — VERSION 2.0

   Final game flow:
   1. Spot / identify the environmental issue
   2. Identify the environmental impact
   3. Choose the best corrective action

   The consequence × occurrence rating step is no longer part of
   the player score.

   Compatibility aliases are retained temporarily so the existing
   script.js can continue loading while the remaining files are
   updated one by one.
============================================================ */


/* ============================================================
   1. SCORING CONFIGURATION
============================================================ */

const EBM_IMPACT_MATRIX_CONFIG = Object.freeze({
  version: "2.0.0",

  scoring: Object.freeze({
    correctIssue: 30,
    correctAspect: 30,

    correctImpact: 30,

    correctAction: 30,
    correctControl: 30,

    completionBonus: 10,

    maximumScenarioScore: 100,

    streakThreshold: 3,
    streakBonus: 10,
    maximumStreakBonusPerScenario: 10
  }),

  gameModes: Object.freeze({
    normal: Object.freeze({
      id: "normal",
      timed: false,
      timeLimitSeconds: null
    }),

    timed: Object.freeze({
      id: "timed",
      timed: true,
      timeLimitSeconds: 480
    })
  }),

  finalResultLevels: Object.freeze([
    Object.freeze({
      minimum: 0,
      maximum: 39,
      level: "Eco Beginner",
      title: "Eco Beginner",
      icon: "🌱",
      className: "eco-beginner",
      description:
        "You have started your environmental rescue journey."
    }),

    Object.freeze({
      minimum: 40,
      maximum: 54,
      level: "Eco Observer",
      title: "Eco Observer",
      icon: "👀",
      className: "eco-observer",
      description:
        "You can spot several environmental issues."
    }),

    Object.freeze({
      minimum: 55,
      maximum: 69,
      level: "Eco Protector",
      title: "Eco Protector",
      icon: "🛡️",
      className: "eco-protector",
      description:
        "You make practical choices that protect resources."
    }),

    Object.freeze({
      minimum: 70,
      maximum: 84,
      level: "Eco Champion",
      title: "Eco Champion",
      icon: "🏅",
      className: "eco-champion",
      description:
        "You consistently identify and control environmental impacts."
    }),

    Object.freeze({
      minimum: 85,
      maximum: 94,
      level: "Eco Guardian",
      title: "Eco Guardian",
      icon: "🌍",
      className: "eco-guardian",
      description:
        "You demonstrate excellent environmental awareness."
    }),

    Object.freeze({
      minimum: 95,
      maximum: 100,
      level: "Nature Rescue Hero",
      title: "Nature Rescue Hero",
      icon: "🏆",
      className: "nature-rescue-hero",
      description:
        "You rescued the Eco Campus with outstanding environmental decisions."
    })
  ])
});


/* ============================================================
   2. METRIC CONFIGURATION
============================================================ */

const EBM_METRIC_CONFIG = Object.freeze({
  water: Object.freeze({
    id: "water",
    name: "Water Efficiency",
    icon: "💧",
    scoreElementId: "waterMetricScore",
    barElementId: "waterMetricBar"
  }),

  energy: Object.freeze({
    id: "energy",
    name: "Energy Efficiency",
    icon: "⚡",
    scoreElementId: "energyMetricScore",
    barElementId: "energyMetricBar"
  }),

  waste: Object.freeze({
    id: "waste",
    name: "Waste Management",
    icon: "♻️",
    scoreElementId: "wasteMetricScore",
    barElementId: "wasteMetricBar"
  }),

  ghg: Object.freeze({
    id: "ghg",
    name: "GHG Awareness",
    icon: "☁️",
    scoreElementId: "ghgMetricScore",
    barElementId: "ghgMetricBar"
  }),

  paper: Object.freeze({
    id: "paper",
    name: "Paper Reduction",
    icon: "📄",
    scoreElementId: "paperMetricScore",
    barElementId: "paperMetricBar"
  }),

  nature: Object.freeze({
    id: "nature",
    name: "Nature Protection",
    icon: "🌳",
    scoreElementId: "natureMetricScore",
    barElementId: "natureMetricBar"
  })
});


/* ============================================================
   3. COLLECTIBLE CONFIGURATION
============================================================ */

const EBM_COLLECTIBLE_CONFIG = Object.freeze({
  waterDrop: Object.freeze({
    id: "waterDrop",
    name: "Water Drop",
    pluralName: "Water Drops",
    icon: "💧",
    metric: "water"
  }),

  greenLeaf: Object.freeze({
    id: "greenLeaf",
    name: "Green Leaf",
    pluralName: "Green Leaves",
    icon: "🍃",
    metric: "nature"
  }),

  recyclingToken: Object.freeze({
    id: "recyclingToken",
    name: "Recycling Token",
    pluralName: "Recycling Tokens",
    icon: "♻️",
    metric: "waste"
  }),

  energySpark: Object.freeze({
    id: "energySpark",
    name: "Energy Spark",
    pluralName: "Energy Sparks",
    icon: "⚡",
    metric: "energy"
  })
});


/* ============================================================
   4. BASIC HELPERS
============================================================ */

function clampEBMNumber(
  value,
  minimum,
  maximum
) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(
      minimum,
      numericValue
    )
  );
}

function normalizeEBMPercentage(value) {
  return Math.round(
    clampEBMNumber(
      value,
      0,
      100
    )
  );
}

function normalizeEBMAnswerText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function isCorrectEBMAnswer(
  selectedAnswer,
  correctAnswer
) {
  return (
    normalizeEBMAnswerText(
      selectedAnswer
    ) ===
    normalizeEBMAnswerText(
      correctAnswer
    )
  );
}

function cloneEBMObject(value) {
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
   5. SIMPLE STEP SCORING
============================================================ */

function scoreIssueSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(
      selected,
      correct
    );

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG
            .scoring.correctIssue
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG
        .scoring.correctIssue
  };
}

/*
 * Compatibility name used by the current script.js.
 */
function scoreAspectSelection(
  selected,
  correct
) {
  return scoreIssueSelection(
    selected,
    correct
  );
}

function scoreImpactSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(
      selected,
      correct
    );

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG
            .scoring.correctImpact
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG
        .scoring.correctImpact
  };
}

function scoreActionSelection(
  selected,
  correct
) {
  const isCorrect =
    isCorrectEBMAnswer(
      selected,
      correct
    );

  return {
    isCorrect,

    points:
      isCorrect
        ? EBM_IMPACT_MATRIX_CONFIG
            .scoring.correctAction
        : 0,

    maximumPoints:
      EBM_IMPACT_MATRIX_CONFIG
        .scoring.correctAction
  };
}

/*
 * Compatibility name used by the current script.js.
 */
function scoreControlSelection(
  selected,
  correct
) {
  return scoreActionSelection(
    selected,
    correct
  );
}


/* ============================================================
   6. COMPLETE SCENARIO SCORE
============================================================ */

function calculateScenarioScore(input) {
  if (
    !input ||
    typeof input !== "object"
  ) {
    throw new TypeError(
      "Scenario scoring requires an input object."
    );
  }

  const selectedIssue =
    input.selectedIssue ??
    input.selectedAspect;

  const correctIssue =
    input.correctIssue ??
    input.correctAspect;

  const selectedAction =
    input.selectedAction ??
    input.selectedControl;

  const correctAction =
    input.correctAction ??
    input.correctControl;

  const issueResult =
    scoreIssueSelection(
      selectedIssue,
      correctIssue
    );

  const impactResult =
    scoreImpactSelection(
      input.selectedImpact,
      input.correctImpact
    );

  const actionResult =
    scoreActionSelection(
      selectedAction,
      correctAction
    );

  const completionBonus =
    input.completed !== false
      ? EBM_IMPACT_MATRIX_CONFIG
          .scoring.completionBonus
      : 0;

  const breakdown = {
    issue: issueResult.points,

    /*
     * Compatibility alias.
     */
    aspect: issueResult.points,

    impact: impactResult.points,

    action: actionResult.points,

    /*
     * Compatibility alias.
     */
    control: actionResult.points,

    completionBonus
  };

  const totalScore =
    clampEBMNumber(
      issueResult.points +
      impactResult.points +
      actionResult.points +
      completionBonus,
      0,
      EBM_IMPACT_MATRIX_CONFIG
        .scoring.maximumScenarioScore
    );

  const maximumScore =
    EBM_IMPACT_MATRIX_CONFIG
      .scoring.maximumScenarioScore;

  const percentage =
    normalizeEBMPercentage(
      (
        totalScore /
        maximumScore
      ) *
      100
    );

  const correctDecisionCount = [
    issueResult.isCorrect,
    impactResult.isCorrect,
    actionResult.isCorrect
  ].filter(Boolean).length;

  return {
    totalScore,
    maximumScore,
    percentage,
    breakdown,

    answers: {
      issueCorrect:
        issueResult.isCorrect,

      aspectCorrect:
        issueResult.isCorrect,

      impactCorrect:
        impactResult.isCorrect,

      actionCorrect:
        actionResult.isCorrect,

      controlCorrect:
        actionResult.isCorrect
    },

    correctDecisionCount,
    totalDecisionCount: 3,

    allCoreAnswersCorrect:
      issueResult.isCorrect &&
      impactResult.isCorrect &&
      actionResult.isCorrect
  };
}


/* ============================================================
   7. STREAK SCORING
============================================================ */

function calculateEcoStreak(input) {
  const previousStreak =
    Math.max(
      0,
      Number(
        input?.previousStreak || 0
      )
    );

  const scenarioWasPerfect =
    input?.scenarioWasPerfect ===
    true;

  const currentStreak =
    scenarioWasPerfect
      ? previousStreak + 1
      : 0;

  const threshold =
    EBM_IMPACT_MATRIX_CONFIG
      .scoring.streakThreshold;

  const earnedBonus =
    currentStreak > 0 &&
    currentStreak % threshold === 0;

  return {
    previousStreak,
    currentStreak,
    threshold,
    earnedBonus,

    bonusPoints:
      earnedBonus
        ? EBM_IMPACT_MATRIX_CONFIG
            .scoring.streakBonus
        : 0,

    message:
      earnedBonus
        ? `Eco Streak ×${currentStreak}! Bonus earned.`
        : (
            currentStreak > 1
              ? `Eco Streak ×${currentStreak}`
              : ""
          )
  };
}


/* ============================================================
   8. COLLECTIBLES
============================================================ */

function createEmptyCollectibleState() {
  return {
    waterDrop: 0,
    greenLeaf: 0,
    recyclingToken: 0,
    energySpark: 0
  };
}

function awardScenarioCollectible(
  collectibleState,
  scenario,
  eligible = true
) {
  const currentState = {
    ...createEmptyCollectibleState(),
    ...(
      collectibleState &&
      typeof collectibleState ===
      "object"
        ? collectibleState
        : {}
    )
  };

  const collectibleId =
    scenario?.reward
      ?.collectibleId;

  const quantity =
    Math.max(
      1,
      Number(
        scenario?.reward?.quantity ||
        1
      )
    );

  if (
    eligible !== true ||
    !EBM_COLLECTIBLE_CONFIG[
      collectibleId
    ]
  ) {
    return {
      collectibles: currentState,
      awarded: false,
      collectible: null,
      quantity: 0,
      message: ""
    };
  }

  currentState[collectibleId] =
    Number(
      currentState[
        collectibleId
      ] || 0
    ) + quantity;

  const collectible =
    EBM_COLLECTIBLE_CONFIG[
      collectibleId
    ];

  return {
    collectibles: currentState,
    awarded: true,
    collectible: {
      ...collectible
    },
    quantity,

    message:
      scenario?.reward
        ?.bonusMessage ||
      `${collectible.icon} ${collectible.name} collected!`
  };
}

function calculateCollectibleTotal(
  collectibleState
) {
  const safeState =
    collectibleState &&
    typeof collectibleState ===
    "object"
      ? collectibleState
      : {};

  return Object.keys(
    EBM_COLLECTIBLE_CONFIG
  ).reduce(
    (total, collectibleId) =>
      total +
      Number(
        safeState[
          collectibleId
        ] || 0
      ),
    0
  );
}


/* ============================================================
   9. ENVIRONMENTAL METRICS
============================================================ */

function calculateScenarioMetricContribution(
  scenarioMetrics,
  scenarioPercentage
) {
  const safePercentage =
    normalizeEBMPercentage(
      scenarioPercentage
    );

  const result = {};

  Object.keys(
    EBM_METRIC_CONFIG
  ).forEach(
    (metricId) => {
      const available =
        clampEBMNumber(
          scenarioMetrics?.[
            metricId
          ],
          0,
          100
        );

      const earned =
        (
          available *
          safePercentage
        ) /
        100;

      result[metricId] = {
        available:
          Number(
            available.toFixed(2)
          ),

        earned:
          Number(
            earned.toFixed(2)
          ),

        scenarioPercentage:
          safePercentage
      };
    }
  );

  return result;
}

function calculateEnvironmentalMetricScores(
  scenarioResults
) {
  const safeResults =
    Array.isArray(
      scenarioResults
    )
      ? scenarioResults
      : [];

  const totals = {};

  Object.keys(
    EBM_METRIC_CONFIG
  ).forEach(
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
          totals[metricId]
            .available +=
            contribution[
              metricId
            ].available;

          totals[metricId]
            .earned +=
            contribution[
              metricId
            ].earned;
        }
      );
    }
  );

  const metricScores = {};

  Object.keys(
    EBM_METRIC_CONFIG
  ).forEach(
    (metricId) => {
      const available =
        totals[
          metricId
        ].available;

      const earned =
        totals[
          metricId
        ].earned;

      const percentage =
        available > 0
          ? normalizeEBMPercentage(
              (
                earned /
                available
              ) *
              100
            )
          : 0;

      metricScores[metricId] = {
        ...EBM_METRIC_CONFIG[
          metricId
        ],

        available:
          Number(
            available.toFixed(2)
          ),

        earned:
          Number(
            earned.toFixed(2)
          ),

        percentage
      };
    }
  );

  return metricScores;
}


/* ============================================================
   10. AREA AND OVERALL SCORES
============================================================ */

function calculateAreaScore(
  scenarioResults
) {
  const safeResults =
    Array.isArray(
      scenarioResults
    )
      ? scenarioResults
      : [];

  const totals =
    safeResults.reduce(
      (summary, result) => {
        summary.score +=
          Number(
            result.totalScore || 0
          );

        summary.maximumScore +=
          Number(
            result.maximumScore || 100
          );

        summary.correctDecisionCount +=
          Number(
            result.correctDecisionCount ||
            0
          );

        summary.totalDecisionCount +=
          Number(
            result.totalDecisionCount ||
            0
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
          ) *
          100
        )
      : 0;

  const correctDecisionPercentage =
    totals.totalDecisionCount > 0
      ? normalizeEBMPercentage(
          (
            totals.correctDecisionCount /
            totals.totalDecisionCount
          ) *
          100
        )
      : 0;

  return {
    score:
      Number(
        totals.score.toFixed(2)
      ),

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

function calculateOverallEcoScore(
  scenarioResults,
  totalAvailableScenarios
) {
  const safeResults =
    Array.isArray(
      scenarioResults
    )
      ? scenarioResults
      : [];

  const availableScenarioCount =
    Number(
      totalAvailableScenarios
    ) > 0
      ? Number(
          totalAvailableScenarios
        )
      : safeResults.length;

  const maximumPerScenario =
    EBM_IMPACT_MATRIX_CONFIG
      .scoring.maximumScenarioScore;

  const totalEarnedPoints =
    safeResults.reduce(
      (total, result) =>
        total +
        Number(
          result.totalScore || 0
        ),
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
          ) *
          100
        )
      : 0;

  const completionPercentage =
    availableScenarioCount > 0
      ? normalizeEBMPercentage(
          (
            safeResults.length /
            availableScenarioCount
          ) *
          100
        )
      : 0;

  return {
    totalEarnedPoints:
      Number(
        totalEarnedPoints.toFixed(2)
      ),

    totalAvailablePoints,
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

function getFinalEcoResultLevel(
  percentage
) {
  const safePercentage =
    normalizeEBMPercentage(
      percentage
    );

  const gameDataResult =
    typeof window !== "undefined" &&
    typeof window.getEBMResultLevel ===
      "function"
      ? window.getEBMResultLevel(
          safePercentage
        )
      : null;

  if (gameDataResult) {
    return {
      ...gameDataResult,
      level:
        gameDataResult.level ||
        gameDataResult.title,
      title:
        gameDataResult.title ||
        gameDataResult.level
    };
  }

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

  return {
    ...(
      result ||
      EBM_IMPACT_MATRIX_CONFIG
        .finalResultLevels[0]
    )
  };
}


/* ============================================================
   11. AREA BADGES AND UNLOCKING
============================================================ */

function getAreaCompletionBadge(
  area,
  completed = true
) {
  if (
    !area ||
    typeof area !== "object" ||
    completed !== true
  ) {
    return null;
  }

  return area.badge
    ? {
        ...area.badge
      }
    : {
        id:
          `${area.id}-restored`,

        name:
          `${area.name} Restored`,

        icon:
          area.icon || "✅",

        message:
          `You restored ${area.name}.`
      };
}

function getAreaUnlockState(
  areaId,
  completedAreaIds = []
) {
  const completedIds =
    Array.isArray(
      completedAreaIds
    )
      ? completedAreaIds
      : [];

  if (
    typeof window !== "undefined" &&
    typeof window.getEBMAreaUnlockState ===
      "function"
  ) {
    return window.getEBMAreaUnlockState(
      areaId,
      completedIds.length
    );
  }

  return {
    unlocked: true,
    requiredCompletedAreas: 0
  };
}

function calculateNewlyUnlockedAreas(
  completedAreaIds = []
) {
  const areas =
    Array.isArray(
      window.EBM_GAME_DATA?.areas
    )
      ? window.EBM_GAME_DATA.areas
      : [];

  return areas.filter(
    (area) => {
      const state =
        getAreaUnlockState(
          area.id,
          completedAreaIds
        );

      return (
        state.unlocked &&
        !completedAreaIds.includes(
          area.id
        )
      );
    }
  );
}


/* ============================================================
   12. FEEDBACK
============================================================ */

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

  let status = "learning";
  let icon = "💡";

  if (percentage >= 90) {
    title =
      "Excellent Rescue Decision";
    status = "excellent";
    icon = "✓";
  } else if (percentage >= 70) {
    title =
      "Good Rescue Decision";
    status = "good";
    icon = "✓";
  } else if (percentage >= 40) {
    title =
      "Good Attempt — Review the Fix";
    status = "partial";
    icon = "↻";
  } else {
    title =
      "Review This Environmental Issue";
    status = "review";
    icon = "!";
  }

  return {
    title,
    status,
    icon,

    summary:
      `You earned ${scenarioScore.totalScore} out of ${scenarioScore.maximumScore} points.`,

    issue:
      scenario.issue?.correct ||
      scenario.aspect?.correct ||
      "",

    /*
     * Compatibility alias.
     */
    aspect:
      scenario.issue?.correct ||
      scenario.aspect?.correct ||
      "",

    impact:
      scenario.impact?.correct ||
      "",

    action:
      scenario.action?.correct ||
      scenario.control?.correct ||
      "",

    /*
     * Compatibility alias.
     */
    control:
      scenario.action?.correct ||
      scenario.control?.correct ||
      "",

    resolution:
      scenario.resolution
        ? {
            ...scenario.resolution
          }
        : null,

    correctedImage:
      scenario.scene
        ?.correctedImage ||
      "",

    reward:
      scenario.reward
        ? {
            ...scenario.reward
          }
        : null,

    pointsEarned:
      scenarioScore.totalScore,

    maximumPoints:
      scenarioScore.maximumScore,

    awarenessMessage:
      scenario.awarenessMessage ||
      "",

    complianceAlert:
      scenario.complianceObligation ===
      true,

    complianceMessage:
      scenario.complianceMessage ||
      "",

    learningPoints:
      Array.isArray(
        scenario.learningPoints
      )
        ? [
            ...scenario.learningPoints
          ]
        : [],

    /*
     * Compatibility object. Rating is no longer scored.
     */
    rating: {
      score: 0,
      numericalScore: 0,
      finalLevel: "Removed",
      finalClassification:
        "Not part of Version 2",
      colorClass: "low",
      action:
        "The player now identifies the issue, impact and best action."
    }
  };
}

function generateAreaCompletionFeedback(
  area,
  scenarioResults
) {
  if (
    !area ||
    typeof area !== "object"
  ) {
    throw new TypeError(
      "Area completion feedback requires an area object."
    );
  }

  const areaScore =
    calculateAreaScore(
      scenarioResults
    );

  const badge =
    getAreaCompletionBadge(
      area,
      true
    );

  let message =
    `You completed both rescue situations in ${area.name}.`;

  if (areaScore.percentage >= 90) {
    message =
      `Excellent rescue work. ${badge?.name || area.name} earned!`;
  } else if (
    areaScore.percentage >= 70
  ) {
    message =
      `Good work. You restored ${area.name} and earned its completion badge.`;
  } else {
    message =
      `You restored ${area.name}. Review the fixes to strengthen your environmental decisions.`;
  }

  return {
    areaId: area.id,
    areaName: area.name,

    title:
      badge?.name ||
      `${area.name} Restored`,

    message,

    badge,

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
      areaScore
        .correctDecisionPercentage,

    ecoImprovement:
      `+${areaScore.percentage}%`,

    learningPoints:
      Array.isArray(
        area.learningObjectives
      )
        ? [
            ...area.learningObjectives
          ]
        : []
  };
}


/* ============================================================
   13. LEGACY IMPACT COUNTS

   Rating categories are no longer part of gameplay. These fields
   remain at zero so the existing dashboard does not break before
   index.html and script.js are updated.
============================================================ */

function countEnvironmentalImpactCategories() {
  return {
    low: 0,
    medium: 0,
    high: 0,
    compliancePriority: 0,
    significantTotal: 0
  };
}


/* ============================================================
   14. FINAL GAME SUMMARY
============================================================ */

function generateFinalGameSummary(input) {
  if (
    !input ||
    typeof input !== "object"
  ) {
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

  const correctDecisions =
    scenarioResults.reduce(
      (total, result) =>
        total +
        Number(
          result.correctDecisionCount ||
          0
        ),
      0
    );

  const totalDecisions =
    scenarioResults.reduce(
      (total, result) =>
        total +
        Number(
          result.totalDecisionCount ||
          0
        ),
      0
    );

  const correctDecisionPercentage =
    totalDecisions > 0
      ? normalizeEBMPercentage(
          (
            correctDecisions /
            totalDecisions
          ) *
          100
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
          ) *
          100
        )
      : 0;

  const collectibles = {
    ...createEmptyCollectibleState(),
    ...(
      input.collectibles &&
      typeof input.collectibles ===
      "object"
        ? input.collectibles
        : {}
    )
  };

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
      overallScore
        .totalAvailableScenarios,

    scenarioCompletionPercentage:
      overallScore
        .completionPercentage,

    correctDecisions,
    totalDecisions,
    correctDecisionPercentage,

    metrics,

    collectibles,

    totalCollectibles:
      calculateCollectibleTotal(
        collectibles
      ),

    badges:
      Array.isArray(
        input.badges
      )
        ? [
            ...input.badges
          ]
        : [],

    currentStreak:
      Math.max(
        0,
        Number(
          input.currentStreak || 0
        )
      ),

    bestStreak:
      Math.max(
        0,
        Number(
          input.bestStreak || 0
        )
      ),

    gameMode:
      input.gameMode ||
      "normal",

    remainingSeconds:
      Number.isFinite(
        Number(
          input.remainingSeconds
        )
      )
        ? Math.max(
            0,
            Number(
              input.remainingSeconds
            )
          )
        : null,

    commitments:
      Array.isArray(
        input.commitments
      )
        ? [
            ...input.commitments
          ]
        : [],

    /*
     * Compatibility fields for the current final screen.
     */
    impactCounts:
      countEnvironmentalImpactCategories(),

    highImpactCount: 0,
    compliancePriorityCount: 0,
    significantImpactCount: 0
  };
}


/* ============================================================
   15. GAME TIMER
============================================================ */

function createGameTimerState(
  mode = "normal"
) {
  const modeConfig =
    EBM_IMPACT_MATRIX_CONFIG
      .gameModes[mode] ||
    EBM_IMPACT_MATRIX_CONFIG
      .gameModes.normal;

  return {
    mode: modeConfig.id,
    timed: modeConfig.timed,

    totalSeconds:
      modeConfig.timeLimitSeconds,

    remainingSeconds:
      modeConfig.timeLimitSeconds,

    startedAt: null,
    completedAt: null,
    expired: false
  };
}

function calculateRemainingGameTime(
  timerState,
  now = Date.now()
) {
  if (
    !timerState ||
    timerState.timed !== true ||
    !timerState.startedAt
  ) {
    return {
      remainingSeconds:
        timerState?.remainingSeconds ??
        null,

      expired: false
    };
  }

  const startTime =
    new Date(
      timerState.startedAt
    ).getTime();

  const elapsedSeconds =
    Math.max(
      0,
      Math.floor(
        (
          Number(now) -
          startTime
        ) /
        1000
      )
    );

  const remainingSeconds =
    Math.max(
      0,
      Number(
        timerState.totalSeconds ||
        0
      ) -
      elapsedSeconds
    );

  return {
    remainingSeconds,
    expired:
      remainingSeconds <= 0
  };
}

function formatGameTime(seconds) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        Number(seconds) || 0
      )
    );

  const minutes =
    Math.floor(
      safeSeconds / 60
    );

  const remaining =
    safeSeconds % 60;

  return (
    `${String(minutes).padStart(2, "0")}:` +
    `${String(remaining).padStart(2, "0")}`
  );
}


/* ============================================================
   16. SCORE STATE
============================================================ */

function createInitialEnvironmentalScoreState() {
  return {
    totalScore: 0,
    maximumScore: 0,
    ecoScore: 0,

    completedAreaIds: [],
    completedScenarioIds: [],
    scenarioResults: [],
    areaResults: {},

    metrics:
      calculateEnvironmentalMetricScores(
        []
      ),

    /*
     * Compatibility field.
     */
    impactCounts:
      countEnvironmentalImpactCategories(),

    collectibles:
      createEmptyCollectibleState(),

    badges: [],

    currentStreak: 0,
    bestStreak: 0,
    streakBonusPoints: 0,

    unlockedAreaIds: [
      "production",
      "offices"
    ],

    gameMode: "normal",

    timer:
      createGameTimerState(
        "normal"
      ),

    commitments: [],

    startedAt: null,
    completedAt: null
  };
}

function updateEnvironmentalScoreState(
  currentState,
  scenarioResult
) {
  const nextState = {
    ...createInitialEnvironmentalScoreState(),
    ...(
      currentState &&
      typeof currentState ===
      "object"
        ? cloneEBMObject(
            currentState
          )
        : {}
    )
  };

  if (
    !scenarioResult ||
    typeof scenarioResult !==
    "object"
  ) {
    return nextState;
  }

  const resultId =
    scenarioResult.scenarioId ||
    scenarioResult.id;

  if (resultId) {
    nextState.scenarioResults =
      nextState.scenarioResults
        .filter(
          (result) =>
            (
              result.scenarioId ||
              result.id
            ) !== resultId
        );

    nextState.scenarioResults.push(
      cloneEBMObject(
        scenarioResult
      )
    );

    nextState.completedScenarioIds =
      Array.from(
        new Set([
          ...nextState
            .completedScenarioIds,
          resultId
        ])
      );
  }

  const totalAvailableScenarios =
    typeof window !== "undefined" &&
    typeof window.getEBMTotalScenarioCount ===
      "function"
      ? window.getEBMTotalScenarioCount()
      : nextState.scenarioResults.length;

  const overall =
    calculateOverallEcoScore(
      nextState.scenarioResults,
      totalAvailableScenarios
    );

  nextState.totalScore =
    overall.totalEarnedPoints;

  nextState.maximumScore =
    overall.totalAvailablePoints;

  nextState.ecoScore =
    overall.percentage;

  nextState.metrics =
    calculateEnvironmentalMetricScores(
      nextState.scenarioResults
    );

  nextState.impactCounts =
    countEnvironmentalImpactCategories();

  return nextState;
}


/* ============================================================
   17. DASHBOARD RENDERING HELPERS
============================================================ */

function updateEBMProgressBar(
  element,
  percentage
) {
  if (
    !(element instanceof HTMLElement)
  ) {
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
      const percentage =
        normalizeEBMPercentage(
          metricScores[
            metricId
          ]?.percentage || 0
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

function renderCollectibleCounts(
  collectibleState
) {
  const safeState = {
    ...createEmptyCollectibleState(),
    ...(
      collectibleState &&
      typeof collectibleState ===
      "object"
        ? collectibleState
        : {}
    )
  };

  Object.keys(
    EBM_COLLECTIBLE_CONFIG
  ).forEach(
    (collectibleId) => {
      const element =
        document.querySelector(
          `[data-collectible-count="${collectibleId}"]`
        );

      if (element) {
        element.textContent =
          String(
            safeState[
              collectibleId
            ]
          );
      }
    }
  );
}

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
  }

  if (scoreText) {
    scoreText.textContent =
      `${safePercentage}%`;
  }
}


/* ============================================================
   18. REMOVED RATING COMPATIBILITY

   These functions prevent errors while the old script.js and
   index.html are still present. They do not add rating points.
============================================================ */

function calculateEnvironmentalImpactRating(
  consequence,
  occurrence
) {
  return (
    Number(consequence || 0) *
    Number(occurrence || 0)
  );
}

function tryCalculateEnvironmentalImpactRating(
  consequence,
  occurrence
) {
  return {
    valid: true,
    score:
      calculateEnvironmentalImpactRating(
        consequence,
        occurrence
      ),
    error: null
  };
}

function getEnvironmentalImpactCategory() {
  return {
    minimum: 0,
    maximum: 0,
    level: "Removed",
    classification:
      "Not part of Version 2",
    priority: 0,
    colorClass: "low",
    badgeClass: "impact-low",
    action:
      "Identify the issue, impact and best corrective action."
  };
}

function evaluateEnvironmentalSignificance(
  score,
  hasComplianceObligation = false
) {
  return {
    numericalScore:
      Number(score) || 0,

    baseLevel: "Removed",
    baseClassification:
      "Not part of Version 2",

    finalLevel:
      hasComplianceObligation
        ? "Compliance Priority"
        : "Removed",

    finalClassification:
      hasComplianceObligation
        ? "Significant"
        : "Not part of Version 2",

    priority:
      hasComplianceObligation
        ? 3
        : 0,

    isSignificant:
      hasComplianceObligation,

    isComplianceSignificant:
      hasComplianceObligation,

    colorClass:
      hasComplianceObligation
        ? "high"
        : "low",

    badgeClass:
      hasComplianceObligation
        ? "impact-compliance"
        : "impact-low",

    action:
      hasComplianceObligation
        ? "Apply the approved compliance control."
        : "Choose the best corrective action.",

    complianceMessage:
      hasComplianceObligation
        ? "Compliance obligation identified."
        : null
  };
}

function evaluateEnvironmentalImpact(input) {
  const score =
    calculateEnvironmentalImpactRating(
      input?.consequence,
      input?.occurrence
    );

  return {
    consequence:
      Number(
        input?.consequence || 0
      ),

    occurrence:
      Number(
        input?.occurrence || 0
      ),

    score,

    formula:
      "Rating removed in Version 2",

    consequenceDetails: null,
    occurrenceDetails: null,

    ...evaluateEnvironmentalSignificance(
      score,
      input?.complianceObligation ===
        true
    )
  };
}

function comparePlayerImpactRating() {
  return {
    playerConsequence: null,
    playerOccurrence: null,
    playerScore: 0,
    playerCategory:
      getEnvironmentalImpactCategory(),

    expectedConsequence: null,
    expectedOccurrence: null,
    expectedScore: 0,
    expectedCategory:
      getEnvironmentalImpactCategory(),

    consequenceCorrect: true,
    occurrenceCorrect: true,
    exactScoreCorrect: true,
    categoryCorrect: true,
    scoreDifference: 0,
    accuracyLevel: "Removed",
    fullyCorrect: true
  };
}

function scoreRatingSelection() {
  return {
    ...comparePlayerImpactRating(),

    points: 0,
    maximumPoints: 0,

    breakdown: {
      consequence: 0,
      occurrence: 0,
      overallRating: 0
    }
  };
}

function renderLiveEnvironmentalRating() {
  const categoryBox =
    document.getElementById(
      "calculatedImpactCategory"
    );

  categoryBox?.classList.add(
    "hidden"
  );

  return null;
}


/* ============================================================
   19. VALIDATION
============================================================ */

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
      "Scenario ID is required."
    );
  }

  const issue =
    scenario.issue ||
    scenario.aspect;

  const action =
    scenario.action ||
    scenario.control;

  [
    ["issue", issue],
    ["impact", scenario.impact],
    ["action", action]
  ].forEach(
    ([name, section]) => {
      if (
        !section ||
        !Array.isArray(
          section.options
        ) ||
        !section.options.includes(
          section.correct
        )
      ) {
        errors.push(
          `${scenario.id || "Scenario"} has invalid ${name} options.`
        );
      }
    }
  );

  if (!scenario.scene?.image) {
    warnings.push(
      `${scenario.id || "Scenario"} does not have a scene image path.`
    );
  }

  if (
    !scenario.reward
      ?.collectibleId
  ) {
    warnings.push(
      `${scenario.id || "Scenario"} does not have a collectible reward.`
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,
    warnings
  };
}

function validateAllEnvironmentalScenarios() {
  const scenarios =
    typeof window !== "undefined" &&
    typeof window.getAllEBMScenarios ===
      "function"
      ? window.getAllEBMScenarios()
      : [];

  const errors = [];
  const warnings = [];

  scenarios.forEach(
    (scenario) => {
      const result =
        validateEnvironmentalScenario(
          scenario
        );

      errors.push(
        ...result.errors
      );

      warnings.push(
        ...result.warnings
      );
    }
  );

  return {
    valid:
      errors.length === 0,

    scenarioCount:
      scenarios.length,

    errors,
    warnings
  };
}


/* ============================================================
   20. PUBLIC API
============================================================ */

const EBM_IMPACT_MATRIX = Object.freeze({
  config:
    EBM_IMPACT_MATRIX_CONFIG,

  metricConfig:
    EBM_METRIC_CONFIG,

  collectibleConfig:
    EBM_COLLECTIBLE_CONFIG,

  scoreIssue:
    scoreIssueSelection,

  scoreAspect:
    scoreAspectSelection,

  scoreImpact:
    scoreImpactSelection,

  scoreAction:
    scoreActionSelection,

  scoreControl:
    scoreControlSelection,

  scoreScenario:
    calculateScenarioScore,

  calculateStreak:
    calculateEcoStreak,

  createCollectibles:
    createEmptyCollectibleState,

  awardCollectible:
    awardScenarioCollectible,

  calculateCollectibleTotal,

  calculateScenarioMetricContribution,

  calculateMetricScores:
    calculateEnvironmentalMetricScores,

  calculateAreaScore,

  calculateOverallEcoScore,

  getFinalResultLevel:
    getFinalEcoResultLevel,

  getAreaBadge:
    getAreaCompletionBadge,

  getAreaUnlockState,

  calculateNewlyUnlockedAreas,

  generateScenarioFeedback,

  generateAreaCompletionFeedback,

  generateFinalGameSummary,

  createTimerState:
    createGameTimerState,

  calculateRemainingTime:
    calculateRemainingGameTime,

  formatTime:
    formatGameTime,

  createInitialScoreState:
    createInitialEnvironmentalScoreState,

  updateScoreState:
    updateEnvironmentalScoreState,

  renderMetricScores:
    renderEnvironmentalMetricScores,

  renderCollectibles:
    renderCollectibleCounts,

  renderFinalScoreCircle:
    renderFinalEcoScoreCircle,

  validateScenario:
    validateEnvironmentalScenario,

  validateAllScenarios:
    validateAllEnvironmentalScenarios
});


/* ============================================================
   21. EXPOSE FUNCTIONS TO SCRIPT.JS
============================================================ */

if (typeof window !== "undefined") {
  window.EBM_IMPACT_MATRIX =
    EBM_IMPACT_MATRIX;

  window.EBM_IMPACT_MATRIX_CONFIG =
    EBM_IMPACT_MATRIX_CONFIG;

  window.EBM_METRIC_CONFIG =
    EBM_METRIC_CONFIG;

  window.EBM_COLLECTIBLE_CONFIG =
    EBM_COLLECTIBLE_CONFIG;

  window.normalizeEBMAnswerText =
    normalizeEBMAnswerText;

  window.isCorrectEBMAnswer =
    isCorrectEBMAnswer;

  window.scoreIssueSelection =
    scoreIssueSelection;

  window.scoreAspectSelection =
    scoreAspectSelection;

  window.scoreImpactSelection =
    scoreImpactSelection;

  window.scoreActionSelection =
    scoreActionSelection;

  window.scoreControlSelection =
    scoreControlSelection;

  window.calculateScenarioScore =
    calculateScenarioScore;

  window.calculateEcoStreak =
    calculateEcoStreak;

  window.createEmptyCollectibleState =
    createEmptyCollectibleState;

  window.awardScenarioCollectible =
    awardScenarioCollectible;

  window.calculateCollectibleTotal =
    calculateCollectibleTotal;

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

  window.getAreaCompletionBadge =
    getAreaCompletionBadge;

  window.getAreaUnlockState =
    getAreaUnlockState;

  window.calculateNewlyUnlockedAreas =
    calculateNewlyUnlockedAreas;

  window.generateScenarioFeedback =
    generateScenarioFeedback;

  window.generateAreaCompletionFeedback =
    generateAreaCompletionFeedback;

  window.generateFinalGameSummary =
    generateFinalGameSummary;

  window.createGameTimerState =
    createGameTimerState;

  window.calculateRemainingGameTime =
    calculateRemainingGameTime;

  window.formatGameTime =
    formatGameTime;

  window.createInitialEnvironmentalScoreState =
    createInitialEnvironmentalScoreState;

  window.updateEnvironmentalScoreState =
    updateEnvironmentalScoreState;

  window.renderEnvironmentalMetricScores =
    renderEnvironmentalMetricScores;

  window.renderEnvironmentalImpactCounts =
    renderEnvironmentalImpactCounts;

  window.renderCollectibleCounts =
    renderCollectibleCounts;

  window.renderFinalEcoScoreCircle =
    renderFinalEcoScoreCircle;

  window.validateEnvironmentalScenario =
    validateEnvironmentalScenario;

  window.validateAllEnvironmentalScenarios =
    validateAllEnvironmentalScenarios;

  /*
   * Temporary compatibility exports.
   */
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

  window.scoreRatingSelection =
    scoreRatingSelection;

  window.countEnvironmentalImpactCategories =
    countEnvironmentalImpactCategories;

  window.renderLiveEnvironmentalRating =
    renderLiveEnvironmentalRating;
}


/* ============================================================
   22. DEVELOPMENT VALIDATION
============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const validation =
      validateAllEnvironmentalScenarios();

    if (!validation.valid) {
      console.error(
        "EBM V2 scoring validation failed:",
        validation.errors
      );
    } else {
      console.info(
        `EBM Eco Rescue V2 scoring loaded: ${validation.scenarioCount} scenarios using Issue → Impact → Action.`
      );
    }

    if (
      validation.warnings.length > 0
    ) {
      console.warn(
        "EBM V2 scoring warnings:",
        validation.warnings
      );
    }
  }
);
