"use strict";

/* ============================================================
   EBM ECO RESCUE
   GAME DATA — VERSION 2.0

   Final structure:
   - 6 fictional awareness areas
   - 2 scenarios per area
   - 12 scenarios total
   - Mission-hunt format
   - Realistic image paths
   - Issue → Impact → Action flow
   - Collectibles, badges, ranks and unlock progression

   Note:
   A small legacy "rating" object remains in every scenario only
   so the current script.js continues working until it is updated.
   The redesigned game will not show or ask the player to rate
   consequence and occurrence.
============================================================ */


/* ============================================================
   1. CAMPAIGN AND GAME CONFIGURATION
============================================================ */

const EBM_GAME_CONFIG = Object.freeze({
  gameId: "ebm-eco-rescue-2026-v2",
  version: "2.0.0",

  title: "EBM Eco Rescue",
  subtitle: "Find it. Fix it. Protect it.",

  campaignName:
    "World Nature Conservation Day & Water Awareness Campaign",

  organization:
    "English Biscuits Manufacturers (Pvt.) Limited",

  actualLayoutUsed: false,

  disclaimer:
    "All locations, scenes and environmental situations used in this game are fictional awareness content and do not represent the actual EBM factory layout.",

  missionMessage:
    "Find and fix environmental issues before the Eco Score drops.",

  totalAreas: 6,
  minimumAreasRequired: 6,
  totalScenarios: 12,
  scenariosPerArea: 2,

  commitmentsRequired: 3,

  maximumScorePerScenario: 100,

  points: {
    correctIssue: 30,
    correctAspect: 30,
    correctImpact: 30,
    correctAction: 30,
    correctControl: 30,
    scenarioCompletion: 10,
    completionBonus: 10,
    streakBonus: 10
  },

  gameModes: {
    normal: {
      id: "normal",
      name: "Normal Mode",
      icon: "🌿",
      timed: false,
      timeLimitSeconds: null,
      description:
        "Explore at your own pace and rescue all six areas."
    },

    timed: {
      id: "timed",
      name: "Timed Challenge",
      icon: "⏱️",
      timed: true,
      timeLimitSeconds: 480,
      description:
        "Rescue all six areas before the eight-minute timer ends."
    }
  },

  unlockRules: {
    initiallyUnlockedAreaIds: [
      "production",
      "offices"
    ],

    unlockAfterCompletedAreas: {
      utilities: 1,
      "canteen-kitchen": 2,
      "waste-yard": 3,
      "outdoor-area": 4
    }
  },

  metrics: [
    "water",
    "energy",
    "waste",
    "ghg",
    "paper",
    "nature"
  ],

  collectibleTypes: [
    "waterDrop",
    "greenLeaf",
    "recyclingToken",
    "energySpark"
  ],

  employmentTypes: [
    "Permanent",
    "3P"
  ],

  departments: [
    "EHS",
    "Production",
    "Engineering",
    "Utilities",
    "Quality Assurance",
    "Admin",
    "Material Management",
    "FGS and Logistics",
    "Human Resources",
    "Finance",
    "Information Technology",
    "Supply Chain",
    "Security",
    "Other"
  ]
});


/* ============================================================
   2. SHARED DEFINITIONS
============================================================ */

const EBM_ENVIRONMENTAL_DEFINITIONS = Object.freeze({
  issue:
    "A visible activity, condition or behaviour that can affect the environment.",

  environmentalAspect:
    "An element of an activity, product or service that interacts or can interact with the environment.",

  environmentalImpact:
    "A change to the environment resulting wholly or partly from an environmental aspect.",

  control:
    "A practical action that prevents, reduces or corrects an environmental impact.",

  complianceObligation:
    "A legal or other environmental requirement that the organization is required or chooses to comply with."
});


/* ============================================================
   3. FOCUS AREAS AND COLLECTIBLES
============================================================ */

const EBM_FOCUS_AREAS = Object.freeze({
  water: {
    name: "Water",
    icon: "💧",
    colorClass: "water",
    collectibleId: "waterDrop",
    description:
      "Water conservation, leakage prevention, wastewater and responsible cleaning."
  },

  energy: {
    name: "Energy",
    icon: "⚡",
    colorClass: "energy",
    collectibleId: "energySpark",
    description:
      "Electricity, compressed air, steam, fuel and unnecessary equipment operation."
  },

  waste: {
    name: "Waste",
    icon: "♻️",
    colorClass: "waste",
    collectibleId: "recyclingToken",
    description:
      "Waste prevention, segregation, recycling, reuse and responsible disposal."
  },

  ghg: {
    name: "GHG",
    icon: "☁️",
    colorClass: "ghg",
    collectibleId: "energySpark",
    description:
      "Direct and indirect greenhouse-gas emissions from energy and fuel use."
  },

  paper: {
    name: "Paper",
    icon: "📄",
    colorClass: "paper",
    collectibleId: "greenLeaf",
    description:
      "Paper reduction, digital processes and responsible printing."
  },

  nature: {
    name: "Nature",
    icon: "🌳",
    colorClass: "nature",
    collectibleId: "greenLeaf",
    description:
      "Protection of land, drains, trees, biodiversity and natural resources."
  }
});

const EBM_COLLECTIBLES = Object.freeze({
  waterDrop: {
    id: "waterDrop",
    name: "Water Drop",
    pluralName: "Water Drops",
    icon: "💧",
    metric: "water",
    message:
      "You protected a valuable water resource."
  },

  greenLeaf: {
    id: "greenLeaf",
    name: "Green Leaf",
    pluralName: "Green Leaves",
    icon: "🍃",
    metric: "nature",
    message:
      "You helped protect nature and natural resources."
  },

  recyclingToken: {
    id: "recyclingToken",
    name: "Recycling Token",
    pluralName: "Recycling Tokens",
    icon: "♻️",
    metric: "waste",
    message:
      "You prevented waste and improved resource recovery."
  },

  energySpark: {
    id: "energySpark",
    name: "Energy Spark",
    pluralName: "Energy Sparks",
    icon: "⚡",
    metric: "energy",
    message:
      "You prevented unnecessary energy use and emissions."
  }
});


/* ============================================================
   4. ACTIVITY AND LIFECYCLE INFORMATION
============================================================ */

const EBM_ACTIVITY_MODES = Object.freeze({
  routine: {
    name: "Routine",
    icon: "🔁"
  },

  nonRoutine: {
    name: "Non-Routine",
    icon: "🛠️"
  },

  emergency: {
    name: "Emergency",
    icon: "🚨"
  }
});

const EBM_LIFECYCLE_STAGES = Object.freeze({
  production: "Production and processing",
  packing: "Packaging",
  support: "Support activity",
  storage: "Storage and warehousing",
  transportation: "Transportation and delivery",
  endOfLife: "End-of-life treatment and disposal",
  outdoor: "Outdoor activity and surrounding environment"
});


/* ============================================================
   5. LEGACY RATING COMPATIBILITY

   The redesigned game does not ask the player to calculate an
   environmental rating. These values are temporary compatibility
   data for the existing impactMatrix.js and script.js.
============================================================ */

const EBM_IMPACT_LEVELS = Object.freeze([
  {
    value: 1,
    name: "Minor",
    shortDescription: "Minor environmental effect."
  },
  {
    value: 2,
    name: "Moderate",
    shortDescription: "Moderate environmental effect."
  },
  {
    value: 3,
    name: "Major",
    shortDescription: "Major environmental effect."
  },
  {
    value: 4,
    name: "Severe",
    shortDescription: "Severe environmental effect."
  }
]);

const EBM_OCCURRENCE_LEVELS = Object.freeze([
  {
    value: 1,
    name: "Rare",
    shortDescription: "Unlikely or occasional."
  },
  {
    value: 2,
    name: "Sometimes",
    shortDescription: "Occurs periodically."
  },
  {
    value: 3,
    name: "Intermittent",
    shortDescription: "Occurs several times."
  },
  {
    value: 4,
    name: "Continuous",
    shortDescription: "Occurs continuously."
  }
]);

const EBM_IMPACT_CATEGORIES = Object.freeze([
  {
    minimum: 1,
    maximum: 4,
    level: "Low",
    classification: "Acceptable",
    colorClass: "low",
    action: "Maintain controls."
  },
  {
    minimum: 5,
    maximum: 9,
    level: "Medium",
    classification: "Tolerable",
    colorClass: "medium",
    action: "Improve controls."
  },
  {
    minimum: 10,
    maximum: 16,
    level: "High",
    classification: "Significant",
    colorClass: "high",
    action: "Take prompt corrective action."
  }
]);


/* ============================================================
   6. SCENARIO HELPER
============================================================ */

function createEBMScenario(input) {
  const issue = {
    correct: input.issue.correct,
    options: [...input.issue.options],
    explanation: input.issue.explanation
  };

  return {
    id: input.id,
    title: input.title,
    category: input.category,
    categoryIcon: input.categoryIcon,

    activityMode: input.activityMode || "routine",
    lifecycleStage: input.lifecycleStage || "support",

    scene: {
      icon: input.scene.icon,
      image: input.scene.image,
      correctedImage: input.scene.correctedImage || "",
      alt: input.scene.alt,
      observation: input.scene.observation,

      hotspot: {
        xPercent: input.scene.hotspot.xPercent,
        yPercent: input.scene.hotspot.yPercent,
        radiusPercent:
          input.scene.hotspot.radiusPercent || 8,
        label: input.scene.hotspot.label
      }
    },

    issue,

    /*
     * "aspect" remains as an alias until script.js is updated.
     */
    aspect: {
      ...issue,
      options: [...issue.options]
    },

    impact: {
      correct: input.impact.correct,
      options: [...input.impact.options],
      explanation: input.impact.explanation
    },

    action: {
      correct: input.action.correct,
      options: [...input.action.options],
      explanation: input.action.explanation
    },

    /*
     * "control" remains as an alias until script.js is updated.
     */
    control: {
      correct: input.action.correct,
      options: [...input.action.options],
      explanation: input.action.explanation
    },

    reward: {
      collectibleId: input.reward.collectibleId,
      quantity: input.reward.quantity || 1,
      bonusMessage: input.reward.bonusMessage
    },

    resolution: {
      title: input.resolution.title,
      message: input.resolution.message,
      successLabel: input.resolution.successLabel
    },

    metrics: {
      water: input.metrics.water || 0,
      energy: input.metrics.energy || 0,
      waste: input.metrics.waste || 0,
      ghg: input.metrics.ghg || 0,
      paper: input.metrics.paper || 0,
      nature: input.metrics.nature || 0
    },

    /*
     * Temporary compatibility only. This is not shown in V2.
     */
    rating: {
      consequence: input.legacyRating?.consequence || 2,
      occurrence: input.legacyRating?.occurrence || 2,
      score:
        (input.legacyRating?.consequence || 2) *
        (input.legacyRating?.occurrence || 2),
      level:
        (
          (input.legacyRating?.consequence || 2) *
          (input.legacyRating?.occurrence || 2)
        ) >= 10
          ? "High"
          : (
              (
                (input.legacyRating?.consequence || 2) *
                (input.legacyRating?.occurrence || 2)
              ) >= 5
                ? "Medium"
                : "Low"
            ),
      classification: "Compatibility only",
      rationale:
        "Retained temporarily while the remaining game files are being updated."
    },

    complianceObligation:
      input.complianceObligation === true,

    complianceMessage:
      input.complianceMessage || "",

    awarenessMessage:
      input.awarenessMessage,

    learningPoints: [
      ...input.learningPoints
    ],

    keywords: [
      ...input.keywords
    ]
  };
}


/* ============================================================
   7. SIX AREAS AND TWELVE SCENARIOS
============================================================ */

const EBM_GAME_AREAS = [

  /* ----------------------------------------------------------
     AREA 1: PRODUCTION
  ---------------------------------------------------------- */

  {
    id: "production",
    legacyAreaIds: [
      "mixing-area",
      "cutting-area",
      "packing-area"
    ],

    mapOrder: 1,
    unlockOrder: 1,
    initiallyUnlocked: true,

    name: "Production",
    shortName: "Production",
    category: "Production Zone",
    icon: "🏭",

    badge: {
      id: "production-protected",
      name: "Production Protected",
      icon: "🛡️",
      message:
        "You prevented resource loss in the Production Zone."
    },

    description:
      "Rescue fictional production operations from water loss, material waste and poor segregation.",

    introduction:
      "Production uses valuable ingredients, water, energy and packaging. Find the hidden environmental issues and protect these resources.",

    estimatedTime: "2–3 minutes",

    focus: [
      "water",
      "waste"
    ],

    learningObjectives: [
      "Stop unnecessary water consumption.",
      "Prevent recyclable packaging from becoming general waste."
    ],

    scenarios: [

      createEBMScenario({
        id: "production-running-hose",
        title: "The Forgotten Cleaning Hose",
        category: "Water Rescue",
        categoryIcon: "💧",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "🚿",
          image:
            "images/scenarios/production-running-hose.jpg",
          correctedImage:
            "images/scenarios/production-running-hose-fixed.jpg",
          alt:
            "A realistic fictional production cleaning area with a hose left running while no one is using it.",
          observation:
            "Cleaning has paused, but water is still flowing continuously from a hose toward the drain.",
          hotspot: {
            xPercent: 72,
            yPercent: 68,
            radiusPercent: 9,
            label: "Running hose"
          }
        },

        issue: {
          correct:
            "The hose is left running while cleaning is paused",
          options: [
            "The hose is left running while cleaning is paused",
            "The floor has approved drainage",
            "The cleaning tools are stored together",
            "The production area has lighting"
          ],
          explanation:
            "The visible issue is uncontrolled water use when no cleaning activity is taking place."
        },

        impact: {
          correct:
            "Freshwater is wasted and unnecessary wastewater is generated",
          options: [
            "Freshwater is wasted and unnecessary wastewater is generated",
            "Water demand is reduced",
            "The drain becomes more efficient",
            "Product quality automatically improves"
          ],
          explanation:
            "Continuous flow wastes freshwater and increases the volume of wastewater requiring management."
        },

        action: {
          correct:
            "Close the hose immediately and use a controlled-flow nozzle when cleaning resumes",
          options: [
            "Close the hose immediately and use a controlled-flow nozzle when cleaning resumes",
            "Increase the water pressure",
            "Leave it running for the next employee",
            "Direct more water toward the drain"
          ],
          explanation:
            "Shutting off the flow prevents avoidable consumption without affecting necessary cleaning."
        },

        reward: {
          collectibleId: "waterDrop",
          quantity: 1,
          bonusMessage:
            "Water Drop collected!"
        },

        resolution: {
          title: "Water Flow Stopped",
          message:
            "The hose is closed and controlled cleaning can restart only when needed.",
          successLabel: "Leakage prevented"
        },

        metrics: {
          water: 70,
          energy: 5,
          waste: 5,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        legacyRating: {
          consequence: 2,
          occurrence: 4
        },

        awarenessMessage:
          "A few minutes of uncontrolled flow repeated across shifts can create substantial annual water loss.",

        learningPoints: [
          "Water should flow only while it is actively required.",
          "Controlled nozzles reduce unnecessary consumption.",
          "Every employee can stop visible water wastage."
        ],

        keywords: [
          "production",
          "hose",
          "water",
          "cleaning",
          "wastewater"
        ]
      }),

      createEBMScenario({
        id: "production-mixed-packaging-waste",
        title: "Recyclable Film in the Wrong Bin",
        category: "Waste Rescue",
        categoryIcon: "♻️",

        activityMode: "routine",
        lifecycleStage: "packing",

        scene: {
          icon: "📦",
          image:
            "images/scenarios/production-mixed-packaging-waste.jpg",
          correctedImage:
            "images/scenarios/production-mixed-packaging-waste-fixed.jpg",
          alt:
            "A realistic fictional packing area where clean plastic film is mixed with food-contaminated general waste.",
          observation:
            "Clean packaging film off-cuts have been placed in a bin containing food-contaminated general waste.",
          hotspot: {
            xPercent: 58,
            yPercent: 71,
            radiusPercent: 10,
            label: "Mixed waste bin"
          }
        },

        issue: {
          correct:
            "Clean recyclable packaging film is mixed with general waste",
          options: [
            "Clean recyclable packaging film is mixed with general waste",
            "The packing line has a conveyor",
            "Products are placed in cartons",
            "Employees are wearing work clothing"
          ],
          explanation:
            "The visible issue is incorrect segregation of recoverable packaging material."
        },

        impact: {
          correct:
            "Recyclable material is contaminated and more waste may go for disposal",
          options: [
            "Recyclable material is contaminated and more waste may go for disposal",
            "The recycling value increases",
            "Waste generation automatically decreases",
            "Plastic consumption is eliminated"
          ],
          explanation:
            "Contamination can remove the recovery value of otherwise recyclable material."
        },

        action: {
          correct:
            "Separate clean film at the point of generation and use the designated recycling container",
          options: [
            "Separate clean film at the point of generation and use the designated recycling container",
            "Burn the film to reduce its volume",
            "Mix all production waste together",
            "Leave the film beside the drain"
          ],
          explanation:
            "Segregation at source protects material quality and improves recovery."
        },

        reward: {
          collectibleId: "recyclingToken",
          quantity: 1,
          bonusMessage:
            "Recycling Token collected!"
        },

        resolution: {
          title: "Material Recovered",
          message:
            "The clean packaging film is now placed in the designated recycling stream.",
          successLabel: "Waste segregated"
        },

        metrics: {
          water: 0,
          energy: 5,
          waste: 75,
          ghg: 15,
          paper: 0,
          nature: 25
        },

        legacyRating: {
          consequence: 2,
          occurrence: 3
        },

        awarenessMessage:
          "Waste has greater recovery value when it is kept clean and segregated where it is generated.",

        learningPoints: [
          "Segregation should happen at the source.",
          "Clean recyclables should not be mixed with contaminated waste.",
          "Preventing contamination supports recycling."
        ],

        keywords: [
          "production",
          "packing",
          "plastic film",
          "waste",
          "segregation"
        ]
      })
    ]
  },


  /* ----------------------------------------------------------
     AREA 2: UTILITIES
  ---------------------------------------------------------- */

  {
    id: "utilities",
    legacyAreaIds: [
      "utilities"
    ],

    mapOrder: 2,
    unlockOrder: 3,
    initiallyUnlocked: false,

    name: "Utilities",
    shortName: "Utilities",
    category: "Utility Zone",
    icon: "⚙️",

    badge: {
      id: "utilities-stabilized",
      name: "Utilities Stabilized",
      icon: "🔧",
      message:
        "You stopped hidden utility losses."
    },

    description:
      "Find hidden electricity and compressed-air losses in a fictional utility environment.",

    introduction:
      "Utility losses may be difficult to see, but they can waste large amounts of energy every day.",

    estimatedTime: "2–3 minutes",

    focus: [
      "energy",
      "ghg"
    ],

    learningObjectives: [
      "Report compressed-air leakage.",
      "Stop unnecessary operation of idle equipment."
    ],

    scenarios: [

      createEBMScenario({
        id: "utilities-compressed-air-leak",
        title: "The Hissing Air Connection",
        category: "Energy Rescue",
        categoryIcon: "💨",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "💨",
          image:
            "images/scenarios/utilities-compressed-air-leak.jpg",
          correctedImage:
            "images/scenarios/utilities-compressed-air-leak-fixed.jpg",
          alt:
            "A realistic fictional utility area with a visibly leaking compressed-air hose connection.",
          observation:
            "A continuous hissing sound is coming from a damaged compressed-air connection.",
          hotspot: {
            xPercent: 64,
            yPercent: 48,
            radiusPercent: 8,
            label: "Air leak"
          }
        },

        issue: {
          correct:
            "Compressed air is leaking continuously from the connection",
          options: [
            "Compressed air is leaking continuously from the connection",
            "The pipe has an identification label",
            "The equipment is installed on a base",
            "The utility room has ventilation"
          ],
          explanation:
            "The environmental issue is the uncontrolled loss of an energy-intensive utility."
        },

        impact: {
          correct:
            "The compressor uses more electricity and indirect GHG emissions increase",
          options: [
            "The compressor uses more electricity and indirect GHG emissions increase",
            "Compressor demand decreases",
            "Energy efficiency improves",
            "Air pressure is created without energy"
          ],
          explanation:
            "The compressor must work harder to replace the air escaping through the leak."
        },

        action: {
          correct:
            "Report, isolate where authorized and arrange safe repair by the responsible team",
          options: [
            "Report, isolate where authorized and arrange safe repair by the responsible team",
            "Increase compressor pressure",
            "Cover the leak with paper",
            "Ignore it because equipment is still operating"
          ],
          explanation:
            "Prompt reporting and safe repair prevent continuous energy loss."
        },

        reward: {
          collectibleId: "energySpark",
          quantity: 1,
          bonusMessage:
            "Energy Spark collected!"
        },

        resolution: {
          title: "Air Loss Eliminated",
          message:
            "The leaking connection is safely repaired and compressor demand is reduced.",
          successLabel: "Air leak repaired"
        },

        metrics: {
          water: 0,
          energy: 80,
          waste: 5,
          ghg: 65,
          paper: 0,
          nature: 5
        },

        legacyRating: {
          consequence: 3,
          occurrence: 4
        },

        awarenessMessage:
          "A small continuous compressed-air leak can create considerable annual electricity loss.",

        learningPoints: [
          "Compressed air is an energy-intensive utility.",
          "A system can keep operating while still wasting energy.",
          "Reporting a leak is an immediate environmental action."
        ],

        keywords: [
          "utilities",
          "compressed air",
          "leak",
          "electricity",
          "GHG"
        ]
      }),

      createEBMScenario({
        id: "utilities-idle-pump",
        title: "Pump Running with No Demand",
        category: "Electricity Rescue",
        categoryIcon: "⚡",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "⚙️",
          image:
            "images/scenarios/utilities-idle-pump.jpg",
          correctedImage:
            "images/scenarios/utilities-idle-pump-fixed.jpg",
          alt:
            "A realistic fictional utility pump operating although there is no process demand.",
          observation:
            "The connected process is stopped, but a utility pump continues running without useful demand.",
          hotspot: {
            xPercent: 48,
            yPercent: 55,
            radiusPercent: 10,
            label: "Running pump"
          }
        },

        issue: {
          correct:
            "A utility pump is operating without process demand",
          options: [
            "A utility pump is operating without process demand",
            "The pump has a motor",
            "The pipework is secured",
            "The equipment has a nameplate"
          ],
          explanation:
            "The issue is unnecessary equipment operation during idle time."
        },

        impact: {
          correct:
            "Electricity is wasted and indirect emissions increase",
          options: [
            "Electricity is wasted and indirect emissions increase",
            "Energy use falls to zero",
            "The carbon footprint decreases automatically",
            "The pump produces energy"
          ],
          explanation:
            "Running equipment without useful output consumes avoidable electricity."
        },

        action: {
          correct:
            "Apply the approved standby or shutdown procedure when operationally permitted",
          options: [
            "Apply the approved standby or shutdown procedure when operationally permitted",
            "Keep all utility equipment running permanently",
            "Increase the motor speed",
            "Switch off unrelated safety systems"
          ],
          explanation:
            "Energy-saving shutdowns must always follow authorized operational and safety procedures."
        },

        reward: {
          collectibleId: "energySpark",
          quantity: 1,
          bonusMessage:
            "Energy Spark collected!"
        },

        resolution: {
          title: "Idle Energy Stopped",
          message:
            "The pump is placed in its approved standby condition until demand returns.",
          successLabel: "Energy saved"
        },

        metrics: {
          water: 5,
          energy: 75,
          waste: 0,
          ghg: 55,
          paper: 0,
          nature: 5
        },

        legacyRating: {
          consequence: 2,
          occurrence: 3
        },

        awarenessMessage:
          "Equipment should produce useful value whenever it consumes energy.",

        learningPoints: [
          "Idle operation is an environmental issue.",
          "Approved shutdown practices prevent energy loss.",
          "Energy conservation supports GHG reduction."
        ],

        keywords: [
          "utilities",
          "pump",
          "idle",
          "energy",
          "electricity"
        ]
      })
    ]
  },


  /* ----------------------------------------------------------
     AREA 3: OFFICES
  ---------------------------------------------------------- */

  {
    id: "offices",
    legacyAreaIds: [
      "offices",
      "laboratory"
    ],

    mapOrder: 3,
    unlockOrder: 2,
    initiallyUnlocked: true,

    name: "Offices",
    shortName: "Offices",
    category: "Administrative Zone",
    icon: "🏢",

    badge: {
      id: "smart-office-champion",
      name: "Smart Office Champion",
      icon: "💡",
      message:
        "You made the office smarter and more resource-efficient."
    },

    description:
      "Rescue a fictional office from unnecessary paper and electricity consumption.",

    introduction:
      "Small office habits can create large cumulative environmental impacts across the organization.",

    estimatedTime: "2–3 minutes",

    focus: [
      "paper",
      "energy",
      "ghg"
    ],

    learningObjectives: [
      "Use digital review instead of unnecessary printing.",
      "Switch off unused office equipment."
    ],

    scenarios: [

      createEBMScenario({
        id: "offices-draft-printing",
        title: "The Tower of Draft Printouts",
        category: "Paper Rescue",
        categoryIcon: "🖨️",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🖨️",
          image:
            "images/scenarios/offices-draft-printing.jpg",
          correctedImage:
            "images/scenarios/offices-draft-printing-fixed.jpg",
          alt:
            "A realistic fictional office printer surrounded by many unnecessary draft printouts.",
          observation:
            "Several draft versions of the same report have been printed even though digital review is available.",
          hotspot: {
            xPercent: 61,
            yPercent: 64,
            radiusPercent: 10,
            label: "Draft printouts"
          }
        },

        issue: {
          correct:
            "Draft documents are being printed unnecessarily",
          options: [
            "Draft documents are being printed unnecessarily",
            "A final approved record is being filed",
            "The printer contains paper",
            "Employees are reviewing a document"
          ],
          explanation:
            "The issue is unnecessary paper use for work that can be reviewed digitally."
        },

        impact: {
          correct:
            "Paper, energy and water are consumed and more office waste is generated",
          options: [
            "Paper, energy and water are consumed and more office waste is generated",
            "Forest resources are automatically protected",
            "Printer electricity use disappears",
            "Waste generation decreases"
          ],
          explanation:
            "Paper has lifecycle impacts involving raw materials, water, energy, transport and disposal."
        },

        action: {
          correct:
            "Review drafts digitally and print only the final required copy, preferably double-sided",
          options: [
            "Review drafts digitally and print only the final required copy, preferably double-sided",
            "Print every email and draft",
            "Print multiple copies in advance",
            "Discard single-sided paper immediately"
          ],
          explanation:
            "Digital review prevents unnecessary consumption while preserving required records."
        },

        reward: {
          collectibleId: "greenLeaf",
          quantity: 1,
          bonusMessage:
            "Green Leaf collected!"
        },

        resolution: {
          title: "Paper Use Reduced",
          message:
            "Draft review is moved online and only required final documents are printed responsibly.",
          successLabel: "Digital review adopted"
        },

        metrics: {
          water: 10,
          energy: 15,
          waste: 30,
          ghg: 15,
          paper: 80,
          nature: 40
        },

        legacyRating: {
          consequence: 2,
          occurrence: 3
        },

        awarenessMessage:
          "Paper reduction protects more than trees—it also reduces water, energy, transport and waste impacts.",

        learningPoints: [
          "Digital review is a preventive control.",
          "Print only when a genuine record is needed.",
          "Double-sided printing reduces paper use."
        ],

        keywords: [
          "office",
          "paper",
          "printing",
          "digital",
          "draft"
        ]
      }),

      createEBMScenario({
        id: "offices-empty-room-energy",
        title: "The Empty Meeting Room",
        category: "Energy Rescue",
        categoryIcon: "💡",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "💡",
          image:
            "images/scenarios/offices-empty-room-energy.jpg",
          correctedImage:
            "images/scenarios/offices-empty-room-energy-fixed.jpg",
          alt:
            "A realistic fictional empty meeting room with lights, display screen and air-conditioning still operating.",
          observation:
            "The meeting is over, but the lights, display screen and air-conditioning remain on in the empty room.",
          hotspot: {
            xPercent: 78,
            yPercent: 27,
            radiusPercent: 9,
            label: "Lights and AC controls"
          }
        },

        issue: {
          correct:
            "Lights, display equipment and air-conditioning are running in an empty room",
          options: [
            "Lights, display equipment and air-conditioning are running in an empty room",
            "The room has chairs",
            "A meeting agenda is on the table",
            "The room has a door"
          ],
          explanation:
            "The issue is unnecessary electricity consumption in an unoccupied space."
        },

        impact: {
          correct:
            "Energy is wasted and indirect greenhouse-gas emissions increase",
          options: [
            "Energy is wasted and indirect greenhouse-gas emissions increase",
            "Electricity demand decreases",
            "The room generates renewable energy",
            "The carbon footprint becomes zero"
          ],
          explanation:
            "Office equipment consumes electricity even when nobody is benefiting from it."
        },

        action: {
          correct:
            "Switch off unnecessary lights, display equipment and AC when leaving",
          options: [
            "Switch off unnecessary lights, display equipment and AC when leaving",
            "Leave everything on for the next meeting",
            "Lower the AC temperature further",
            "Open the door while cooling continues"
          ],
          explanation:
            "The last person leaving should take ownership of shared-area energy controls."
        },

        reward: {
          collectibleId: "energySpark",
          quantity: 1,
          bonusMessage:
            "Energy Spark collected!"
        },

        resolution: {
          title: "Meeting Room Powered Down",
          message:
            "The unused lights, display and cooling are switched off.",
          successLabel: "Energy saved"
        },

        metrics: {
          water: 0,
          energy: 80,
          waste: 0,
          ghg: 60,
          paper: 0,
          nature: 5
        },

        legacyRating: {
          consequence: 2,
          occurrence: 4
        },

        awarenessMessage:
          "The last person leaving a shared room can prevent hours of unnecessary electricity consumption.",

        learningPoints: [
          "Shared spaces require clear ownership.",
          "Air-conditioning is a major electricity load.",
          "Simple switch-off behaviour supports GHG reduction."
        ],

        keywords: [
          "office",
          "meeting room",
          "lights",
          "air conditioning",
          "energy"
        ]
      })
    ]
  },


  /* ----------------------------------------------------------
     AREA 4: CANTEEN AND KITCHEN
  ---------------------------------------------------------- */

  {
    id: "canteen-kitchen",
    legacyAreaIds: [
      "canteen",
      "kitchen",
      "washrooms"
    ],

    mapOrder: 4,
    unlockOrder: 4,
    initiallyUnlocked: false,

    name: "Canteen & Kitchen",
    shortName: "Canteen",
    category: "Employee Services Zone",
    icon: "🍽️",

    badge: {
      id: "canteen-conserved",
      name: "Canteen Conserved",
      icon: "🥗",
      message:
        "You reduced food and water waste in the Canteen & Kitchen."
    },

    description:
      "Prevent food waste and unnecessary water use in a fictional employee-service area.",

    introduction:
      "Food and water carry hidden environmental footprints. Better daily choices protect both resources.",

    estimatedTime: "2–3 minutes",

    focus: [
      "waste",
      "water",
      "nature"
    ],

    learningObjectives: [
      "Prevent avoidable food waste.",
      "Stop running water during washing pauses."
    ],

    scenarios: [

      createEBMScenario({
        id: "canteen-kitchen-food-waste",
        title: "The Uneaten Meal Pile",
        category: "Food Waste Rescue",
        categoryIcon: "🍛",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🍛",
          image:
            "images/scenarios/canteen-kitchen-food-waste.jpg",
          correctedImage:
            "images/scenarios/canteen-kitchen-food-waste-fixed.jpg",
          alt:
            "A realistic fictional canteen tray-return area with large amounts of edible food left on plates.",
          observation:
            "Many plates contain large portions of uneaten food at the tray-return station.",
          hotspot: {
            xPercent: 53,
            yPercent: 72,
            radiusPercent: 11,
            label: "Uneaten food"
          }
        },

        issue: {
          correct:
            "Large portions of edible food are being discarded",
          options: [
            "Large portions of edible food are being discarded",
            "Plates are being returned",
            "Employees are using a dining table",
            "Food is served in the canteen"
          ],
          explanation:
            "The issue is avoidable food waste caused by taking or serving more than is needed."
        },

        impact: {
          correct:
            "Food, water, energy and raw materials are wasted and disposal demand increases",
          options: [
            "Food, water, energy and raw materials are wasted and disposal demand increases",
            "Food production requires no resources",
            "Waste-disposal demand decreases",
            "Greenhouse-gas emissions are automatically eliminated"
          ],
          explanation:
            "Discarded food also wastes the resources used to grow, process, transport and prepare it."
        },

        action: {
          correct:
            "Take or serve appropriate portions and segregate unavoidable food waste correctly",
          options: [
            "Take or serve appropriate portions and segregate unavoidable food waste correctly",
            "Mix food waste with recyclable packaging",
            "Always take the largest portion",
            "Dispose of food near a drain"
          ],
          explanation:
            "Prevention comes first; unavoidable food waste should then follow the approved segregation route."
        },

        reward: {
          collectibleId: "recyclingToken",
          quantity: 1,
          bonusMessage:
            "Recycling Token collected!"
        },

        resolution: {
          title: "Food Waste Reduced",
          message:
            "Appropriate portions are encouraged and unavoidable food waste is segregated correctly.",
          successLabel: "Food saved"
        },

        metrics: {
          water: 25,
          energy: 20,
          waste: 80,
          ghg: 35,
          paper: 0,
          nature: 35
        },

        legacyRating: {
          consequence: 2,
          occurrence: 4
        },

        awarenessMessage:
          "Food waste also wastes the water, energy, fuel and labour used before the meal reached the plate.",

        learningPoints: [
          "Waste prevention is better than disposal.",
          "Appropriate portions reduce avoidable food waste.",
          "Food waste should be segregated from recyclables."
        ],

        keywords: [
          "canteen",
          "food waste",
          "portion",
          "segregation",
          "resources"
        ]
      }),

      createEBMScenario({
        id: "canteen-kitchen-running-tap",
        title: "The Tap That Never Stops",
        category: "Water Rescue",
        categoryIcon: "🚰",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🚰",
          image:
            "images/scenarios/canteen-kitchen-running-tap.jpg",
          correctedImage:
            "images/scenarios/canteen-kitchen-running-tap-fixed.jpg",
          alt:
            "A realistic fictional kitchen washing station with a tap left running while the employee is away.",
          observation:
            "The tap remains fully open while washing is paused and utensils are being arranged elsewhere.",
          hotspot: {
            xPercent: 68,
            yPercent: 46,
            radiusPercent: 9,
            label: "Running tap"
          }
        },

        issue: {
          correct:
            "The tap is left running while washing is paused",
          options: [
            "The tap is left running while washing is paused",
            "Utensils are placed near the sink",
            "The sink is made of metal",
            "The kitchen has cleaning supplies"
          ],
          explanation:
            "The issue is uncontrolled water use when no washing is taking place."
        },

        impact: {
          correct:
            "Freshwater is wasted and unnecessary wastewater is produced",
          options: [
            "Freshwater is wasted and unnecessary wastewater is produced",
            "Water consumption decreases",
            "The wastewater volume becomes zero",
            "The tap creates new water"
          ],
          explanation:
            "Running water without active use creates direct resource loss."
        },

        action: {
          correct:
            "Close the tap during pauses and use controlled flow only when washing",
          options: [
            "Close the tap during pauses and use controlled flow only when washing",
            "Increase the flow rate",
            "Allow water to overflow",
            "Keep the tap open for convenience"
          ],
          explanation:
            "Simple shutoff discipline can prevent substantial cumulative water loss."
        },

        reward: {
          collectibleId: "waterDrop",
          quantity: 1,
          bonusMessage:
            "Water Drop collected!"
        },

        resolution: {
          title: "Tap Closed",
          message:
            "Water now flows only while utensils are actively being washed.",
          successLabel: "Water protected"
        },

        metrics: {
          water: 85,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        legacyRating: {
          consequence: 2,
          occurrence: 4
        },

        awarenessMessage:
          "Water-saving behaviour becomes powerful when it is repeated during every routine task.",

        learningPoints: [
          "Water should flow only while needed.",
          "Routine behaviour controls resource consumption.",
          "Small losses repeated daily become large annual losses."
        ],

        keywords: [
          "kitchen",
          "tap",
          "water",
          "washing",
          "conservation"
        ]
      })
    ]
  },


  /* ----------------------------------------------------------
     AREA 5: WASTE YARD
  ---------------------------------------------------------- */

  {
    id: "waste-yard",
    legacyAreaIds: [
      "waste-yard"
    ],

    mapOrder: 5,
    unlockOrder: 5,
    initiallyUnlocked: false,

    name: "Waste Yard",
    shortName: "Waste Yard",
    category: "Waste Management Zone",
    icon: "♻️",

    badge: {
      id: "waste-yard-secured",
      name: "Waste Yard Secured",
      icon: "🔒",
      message:
        "You protected the waste yard from contamination and pollution."
    },

    description:
      "Correct mixed waste and protect drains in a fictional waste-storage area.",

    introduction:
      "Poor waste storage can turn a recoverable material into pollution. Find the issue before it spreads.",

    estimatedTime: "2–3 minutes",

    focus: [
      "waste",
      "water",
      "nature"
    ],

    learningObjectives: [
      "Separate incompatible waste streams.",
      "Protect drains and soil from waste contamination."
    ],

    scenarios: [

      createEBMScenario({
        id: "waste-yard-mixed-unlabelled-waste",
        title: "The Mystery Waste Containers",
        category: "Waste Control",
        categoryIcon: "🛢️",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🛢️",
          image:
            "images/scenarios/waste-yard-mixed-unlabelled-waste.jpg",
          correctedImage:
            "images/scenarios/waste-yard-mixed-unlabelled-waste-fixed.jpg",
          alt:
            "A realistic fictional waste yard with mixed, open and unlabelled waste containers.",
          observation:
            "Different waste materials are stored together in open containers without clear labels.",
          hotspot: {
            xPercent: 49,
            yPercent: 57,
            radiusPercent: 12,
            label: "Unlabelled mixed containers"
          }
        },

        issue: {
          correct:
            "Different waste streams are mixed and containers are not clearly labelled",
          options: [
            "Different waste streams are mixed and containers are not clearly labelled",
            "The yard has a boundary wall",
            "Waste containers are visible",
            "The area has daylight"
          ],
          explanation:
            "The issue is incorrect segregation and identification of stored waste."
        },

        impact: {
          correct:
            "Recycling is reduced and unsafe handling or contamination may occur",
          options: [
            "Recycling is reduced and unsafe handling or contamination may occur",
            "Waste automatically becomes recyclable",
            "Handling risks disappear",
            "Disposal requirements are eliminated"
          ],
          explanation:
            "Mixed and unidentified waste can be mishandled and may lose its recovery value."
        },

        action: {
          correct:
            "Segregate waste by approved category and use closed, clearly labelled containers",
          options: [
            "Segregate waste by approved category and use closed, clearly labelled containers",
            "Mix all waste to save space",
            "Remove all labels",
            "Leave containers open during rain"
          ],
          explanation:
            "Correct segregation, containment and labelling support safe handling and responsible disposal."
        },

        reward: {
          collectibleId: "recyclingToken",
          quantity: 1,
          bonusMessage:
            "Recycling Token collected!"
        },

        resolution: {
          title: "Waste Streams Secured",
          message:
            "Waste is separated, contained and clearly labelled for the correct recovery or disposal route.",
          successLabel: "Waste controlled"
        },

        metrics: {
          water: 15,
          energy: 0,
          waste: 90,
          ghg: 10,
          paper: 0,
          nature: 45
        },

        legacyRating: {
          consequence: 3,
          occurrence: 3
        },

        complianceObligation: true,

        complianceMessage:
          "Waste must be managed through approved storage, labelling and disposal controls.",

        awarenessMessage:
          "Clear labels and segregation protect people, recoverable materials and the environment.",

        learningPoints: [
          "Different waste streams require separate controls.",
          "Labels support correct handling and traceability.",
          "Closed containers prevent spreading and weather exposure."
        ],

        keywords: [
          "waste yard",
          "labels",
          "containers",
          "segregation",
          "storage"
        ]
      }),

      createEBMScenario({
        id: "waste-yard-waste-near-drain",
        title: "Waste Stored Beside the Drain",
        category: "Pollution Prevention",
        categoryIcon: "🌧️",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🌧️",
          image:
            "images/scenarios/waste-yard-waste-near-drain.jpg",
          correctedImage:
            "images/scenarios/waste-yard-waste-near-drain-fixed.jpg",
          alt:
            "A realistic fictional waste yard with loose waste and leaking containers positioned beside a stormwater drain.",
          observation:
            "Loose waste and a stained container are stored immediately beside an uncovered drain before rain.",
          hotspot: {
            xPercent: 73,
            yPercent: 73,
            radiusPercent: 11,
            label: "Waste beside drain"
          }
        },

        issue: {
          correct:
            "Waste and a potentially leaking container are stored beside an uncovered drain",
          options: [
            "Waste and a potentially leaking container are stored beside an uncovered drain",
            "The drain has a concrete edge",
            "The yard contains storage space",
            "Clouds are visible"
          ],
          explanation:
            "The issue is poor placement and containment that could allow pollution to enter the drainage system."
        },

        impact: {
          correct:
            "Contaminated runoff may enter the drain and pollute water or soil",
          options: [
            "Contaminated runoff may enter the drain and pollute water or soil",
            "Rainwater quality automatically improves",
            "The waste becomes harmless",
            "Drainage pollution is impossible"
          ],
          explanation:
            "Rain or leakage can carry contaminants into drains, soil and the wider environment."
        },

        action: {
          correct:
            "Move waste to a contained covered area, inspect leakage and protect the drain",
          options: [
            "Move waste to a contained covered area, inspect leakage and protect the drain",
            "Push the waste into the drain",
            "Leave it until after rainfall",
            "Add water to wash the stain away"
          ],
          explanation:
            "Source containment and drain protection prevent pollution before it can spread."
        },

        reward: {
          collectibleId: "greenLeaf",
          quantity: 1,
          bonusMessage:
            "Green Leaf collected!"
        },

        resolution: {
          title: "Drain Protected",
          message:
            "Waste is moved to secure covered storage and the drain is protected from contaminated runoff.",
          successLabel: "Drain protected"
        },

        metrics: {
          water: 65,
          energy: 0,
          waste: 70,
          ghg: 5,
          paper: 0,
          nature: 85
        },

        legacyRating: {
          consequence: 4,
          occurrence: 3
        },

        complianceObligation: true,

        complianceMessage:
          "Uncontrolled discharge to drains may involve applicable environmental compliance obligations.",

        awarenessMessage:
          "Keeping waste away from drains is a simple and powerful pollution-prevention measure.",

        learningPoints: [
          "Storage location is an environmental control.",
          "Stormwater drains must be protected from contamination.",
          "Prevent pollution before rain or leakage spreads it."
        ],

        keywords: [
          "waste yard",
          "drain",
          "runoff",
          "pollution",
          "containment"
        ]
      })
    ]
  },


  /* ----------------------------------------------------------
     AREA 6: OUTDOOR AREA
  ---------------------------------------------------------- */

  {
    id: "outdoor-area",
    legacyAreaIds: [
      "car-parking",
      "green-area"
    ],

    mapOrder: 6,
    unlockOrder: 6,
    initiallyUnlocked: false,

    name: "Outdoor Area",
    shortName: "Outdoor",
    category: "Outdoor & Nature Zone",
    icon: "🌳",

    badge: {
      id: "nature-zone-restored",
      name: "Nature Zone Restored",
      icon: "🌿",
      message:
        "You protected outdoor air, land and green spaces."
    },

    description:
      "Reduce vehicle emissions and protect fictional green areas from littering.",

    introduction:
      "Environmental responsibility continues outside buildings. Protect clean air, land and living green spaces.",

    estimatedTime: "2–3 minutes",

    focus: [
      "ghg",
      "nature",
      "waste"
    ],

    learningObjectives: [
      "Reduce unnecessary vehicle idling.",
      "Prevent littering and damage to green areas."
    ],

    scenarios: [

      createEBMScenario({
        id: "outdoor-area-vehicle-idling",
        title: "The Waiting Vehicle",
        category: "Clean Air Rescue",
        categoryIcon: "🚗",

        activityMode: "routine",
        lifecycleStage: "transportation",

        scene: {
          icon: "🚗",
          image:
            "images/scenarios/outdoor-area-vehicle-idling.jpg",
          correctedImage:
            "images/scenarios/outdoor-area-vehicle-idling-fixed.jpg",
          alt:
            "A realistic fictional parking area with a stationary vehicle idling and visible exhaust while waiting.",
          observation:
            "A stationary vehicle has been waiting for several minutes with its engine running.",
          hotspot: {
            xPercent: 39,
            yPercent: 59,
            radiusPercent: 11,
            label: "Idling vehicle"
          }
        },

        issue: {
          correct:
            "A stationary vehicle is idling unnecessarily",
          options: [
            "A stationary vehicle is idling unnecessarily",
            "The vehicle is parked in a marked area",
            "The vehicle has tyres",
            "A driver is waiting"
          ],
          explanation:
            "The issue is fuel consumption without useful vehicle movement."
        },

        impact: {
          correct:
            "Fuel is wasted and air pollutants and greenhouse-gas emissions increase",
          options: [
            "Fuel is wasted and air pollutants and greenhouse-gas emissions increase",
            "Fuel consumption stops",
            "Air quality improves",
            "The vehicle produces clean electricity"
          ],
          explanation:
            "Unnecessary idling burns fuel and releases emissions without providing transport value."
        },

        action: {
          correct:
            "Switch off the engine during extended waiting when safe and operationally appropriate",
          options: [
            "Switch off the engine during extended waiting when safe and operationally appropriate",
            "Increase engine speed while waiting",
            "Keep every parked vehicle running",
            "Block ventilation around the vehicle"
          ],
          explanation:
            "Anti-idling behaviour reduces fuel consumption, emissions and local air pollution."
        },

        reward: {
          collectibleId: "energySpark",
          quantity: 1,
          bonusMessage:
            "Energy Spark collected!"
        },

        resolution: {
          title: "Engine Switched Off",
          message:
            "The waiting vehicle is no longer consuming fuel or producing avoidable emissions.",
          successLabel: "Emissions reduced"
        },

        metrics: {
          water: 0,
          energy: 40,
          waste: 0,
          ghg: 90,
          paper: 0,
          nature: 35
        },

        legacyRating: {
          consequence: 3,
          occurrence: 3
        },

        awarenessMessage:
          "A parked vehicle can still consume fuel and affect air quality when its engine is left running.",

        learningPoints: [
          "Idling is fuel consumption without movement.",
          "Reducing idling supports clean air and GHG reduction.",
          "Shutdown decisions should remain safe and operationally appropriate."
        ],

        keywords: [
          "outdoor",
          "parking",
          "vehicle",
          "idling",
          "emissions"
        ]
      }),

      createEBMScenario({
        id: "outdoor-area-green-litter",
        title: "Litter in the Green Area",
        category: "Nature Rescue",
        categoryIcon: "🌳",

        activityMode: "routine",
        lifecycleStage: "outdoor",

        scene: {
          icon: "🌳",
          image:
            "images/scenarios/outdoor-area-green-litter.jpg",
          correctedImage:
            "images/scenarios/outdoor-area-green-litter-fixed.jpg",
          alt:
            "A realistic fictional green area with plastic wrappers and disposable cups scattered near plants.",
          observation:
            "Plastic wrappers and disposable cups are scattered around planted soil and near a rainwater path.",
          hotspot: {
            xPercent: 62,
            yPercent: 74,
            radiusPercent: 12,
            label: "Litter near plants"
          }
        },

        issue: {
          correct:
            "Plastic and disposable litter has been left in the green area",
          options: [
            "Plastic and disposable litter has been left in the green area",
            "Plants are growing in soil",
            "The area receives sunlight",
            "A walking path is nearby"
          ],
          explanation:
            "The issue is improper disposal of waste in a natural area."
        },

        impact: {
          correct:
            "Soil, drainage and wildlife may be harmed and the area becomes polluted",
          options: [
            "Soil, drainage and wildlife may be harmed and the area becomes polluted",
            "Biodiversity automatically improves",
            "Plastic turns into fertilizer",
            "Drainage becomes cleaner"
          ],
          explanation:
            "Litter can spread through wind and rain, block drainage and harm plants or animals."
        },

        action: {
          correct:
            "Collect and segregate the litter, use designated bins and prevent repeated littering",
          options: [
            "Collect and segregate the litter, use designated bins and prevent repeated littering",
            "Push litter into planted soil",
            "Burn litter beside the plants",
            "Leave it for rain to remove"
          ],
          explanation:
            "Prompt collection and correct disposal restore the area and prevent further pollution."
        },

        reward: {
          collectibleId: "greenLeaf",
          quantity: 1,
          bonusMessage:
            "Green Leaf collected!"
        },

        resolution: {
          title: "Green Area Restored",
          message:
            "The litter is collected and segregated, leaving the planted area clean and protected.",
          successLabel: "Nature restored"
        },

        metrics: {
          water: 20,
          energy: 0,
          waste: 75,
          ghg: 5,
          paper: 5,
          nature: 90
        },

        legacyRating: {
          consequence: 3,
          occurrence: 3
        },

        awarenessMessage:
          "A clean green area supports wellbeing, biodiversity and responsible environmental culture.",

        learningPoints: [
          "Litter can spread beyond the place where it is dropped.",
          "Waste can harm soil, drains, plants and animals.",
          "Every user of a shared space is responsible for protecting it."
        ],

        keywords: [
          "outdoor",
          "green area",
          "litter",
          "nature",
          "plastic"
        ]
      })
    ]
  }
];


/* ============================================================
   8. COMMITMENTS
============================================================ */

const EBM_ENVIRONMENTAL_COMMITMENTS = [
  {
    id: "commit-water",
    metric: "water",
    icon: "💧",
    title: "Protect Every Drop",
    statement:
      "I will stop and report unnecessary water loss."
  },

  {
    id: "commit-energy",
    metric: "energy",
    icon: "⚡",
    title: "Switch Off Waste",
    statement:
      "I will avoid unnecessary electricity and fuel consumption."
  },

  {
    id: "commit-waste",
    metric: "waste",
    icon: "♻️",
    title: "Segregate at Source",
    statement:
      "I will place waste in the correct designated stream."
  },

  {
    id: "commit-paper",
    metric: "paper",
    icon: "📄",
    title: "Think Before Printing",
    statement:
      "I will use digital review and print only when necessary."
  },

  {
    id: "commit-nature",
    metric: "nature",
    icon: "🌳",
    title: "Protect Shared Spaces",
    statement:
      "I will keep drains, soil and green areas free from pollution."
  },

  {
    id: "commit-report",
    metric: "energy",
    icon: "🔎",
    title: "See It, Own It",
    statement:
      "I will report environmental leaks, losses and unsafe waste practices."
  }
];


/* ============================================================
   9. FINAL RANKS
============================================================ */

const EBM_RESULT_LEVELS = [
  {
    minimum: 0,
    maximum: 39,
    title: "Eco Beginner",
    icon: "🌱",
    description:
      "You have started your environmental rescue journey."
  },

  {
    minimum: 40,
    maximum: 54,
    title: "Eco Observer",
    icon: "👀",
    description:
      "You can spot several environmental issues."
  },

  {
    minimum: 55,
    maximum: 69,
    title: "Eco Protector",
    icon: "🛡️",
    description:
      "You make practical choices that protect resources."
  },

  {
    minimum: 70,
    maximum: 84,
    title: "Eco Champion",
    icon: "🏅",
    description:
      "You consistently identify and control environmental impacts."
  },

  {
    minimum: 85,
    maximum: 94,
    title: "Eco Guardian",
    icon: "🌍",
    description:
      "You demonstrate excellent environmental awareness."
  },

  {
    minimum: 95,
    maximum: 100,
    title: "Nature Rescue Hero",
    icon: "🏆",
    description:
      "You rescued the Eco Campus with outstanding environmental decisions."
  }
];

const EBM_AWARENESS_MESSAGES = [
  "Find it. Fix it. Protect it.",
  "Every area, every action and every drop matters.",
  "Environmental improvement begins when someone notices and acts.",
  "Preventing waste is better than managing waste after it is created.",
  "The cleanest energy is the energy that does not need to be used."
];


/* ============================================================
   10. DATA ACCESS HELPERS
============================================================ */

function getEBMAreaById(areaId) {
  if (typeof areaId !== "string") {
    return null;
  }

  return (
    EBM_GAME_AREAS.find(
      (area) =>
        area.id === areaId ||
        area.legacyAreaIds?.includes(areaId)
    ) || null
  );
}

function getEBMScenarioById(scenarioId) {
  if (typeof scenarioId !== "string") {
    return null;
  }

  return (
    getAllEBMScenarios().find(
      (scenario) =>
        scenario.id === scenarioId
    ) || null
  );
}

function getEBMTotalAreaCount() {
  return EBM_GAME_AREAS.length;
}

function getEBMTotalScenarioCount() {
  return EBM_GAME_AREAS.reduce(
    (total, area) =>
      total + area.scenarios.length,
    0
  );
}

function calculateEBMImpactRating(
  consequence,
  occurrence
) {
  const first = Number(consequence) || 0;
  const second = Number(occurrence) || 0;

  return first * second;
}

function getEBMImpactCategory(score) {
  const safeScore = Number(score) || 0;

  return (
    EBM_IMPACT_CATEGORIES.find(
      (category) =>
        safeScore >= category.minimum &&
        safeScore <= category.maximum
    ) || EBM_IMPACT_CATEGORIES[0]
  );
}

function getEBMResultLevel(percentage) {
  const safePercentage = Math.max(
    0,
    Math.min(
      100,
      Number(percentage) || 0
    )
  );

  return (
    EBM_RESULT_LEVELS.find(
      (result) =>
        safePercentage >= result.minimum &&
        safePercentage <= result.maximum
    ) || EBM_RESULT_LEVELS[0]
  );
}

function getAllEBMScenarios() {
  return EBM_GAME_AREAS.flatMap(
    (area) =>
      area.scenarios.map(
        (scenario) => ({
          ...scenario,
          areaId: area.id,
          areaName: area.name,
          areaBadge: area.badge
        })
      )
  );
}

function getEBMScenariosByMetric(metric) {
  if (
    typeof metric !== "string" ||
    !EBM_GAME_CONFIG.metrics.includes(metric)
  ) {
    return [];
  }

  return getAllEBMScenarios().filter(
    (scenario) =>
      Number(
        scenario.metrics?.[metric] || 0
      ) > 0
  );
}

function getEBMComplianceScenarios() {
  return getAllEBMScenarios().filter(
    (scenario) =>
      scenario.complianceObligation === true
  );
}

function getEBMCollectibleById(
  collectibleId
) {
  return (
    EBM_COLLECTIBLES[collectibleId] ||
    null
  );
}

function getEBMAreaUnlockState(
  areaId,
  completedAreaCount = 0
) {
  const area =
    getEBMAreaById(areaId);

  if (!area) {
    return {
      unlocked: false,
      requiredCompletedAreas: null
    };
  }

  if (
    area.initiallyUnlocked === true ||
    EBM_GAME_CONFIG.unlockRules
      .initiallyUnlockedAreaIds
      .includes(area.id)
  ) {
    return {
      unlocked: true,
      requiredCompletedAreas: 0
    };
  }

  const requiredCompletedAreas =
    Number(
      EBM_GAME_CONFIG.unlockRules
        .unlockAfterCompletedAreas[
          area.id
        ] || 0
    );

  return {
    unlocked:
      Number(completedAreaCount) >=
      requiredCompletedAreas,

    requiredCompletedAreas
  };
}

function shuffleEBMOptions(options) {
  if (!Array.isArray(options)) {
    return [];
  }

  const shuffled = [...options];

  for (
    let currentIndex =
      shuffled.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
        (currentIndex + 1)
      );

    [
      shuffled[currentIndex],
      shuffled[randomIndex]
    ] = [
      shuffled[randomIndex],
      shuffled[currentIndex]
    ];
  }

  return shuffled;
}


/* ============================================================
   11. DATA VALIDATION
============================================================ */

function validateEBMGameData() {
  const errors = [];
  const areaIds = new Set();
  const scenarioIds = new Set();

  if (
    EBM_GAME_AREAS.length !==
    EBM_GAME_CONFIG.totalAreas
  ) {
    errors.push(
      `Expected ${EBM_GAME_CONFIG.totalAreas} areas but found ${EBM_GAME_AREAS.length}.`
    );
  }

  EBM_GAME_AREAS.forEach(
    (area, areaIndex) => {
      if (!area.id) {
        errors.push(
          `Area at index ${areaIndex} does not have an ID.`
        );
      }

      if (areaIds.has(area.id)) {
        errors.push(
          `Duplicate area ID found: ${area.id}`
        );
      }

      areaIds.add(area.id);

      if (
        !Array.isArray(area.scenarios) ||
        area.scenarios.length !==
          EBM_GAME_CONFIG.scenariosPerArea
      ) {
        errors.push(
          `Area ${area.id} must contain exactly ${EBM_GAME_CONFIG.scenariosPerArea} scenarios.`
        );

        return;
      }

      area.scenarios.forEach(
        (scenario) => {
          if (!scenario.id) {
            errors.push(
              `Scenario in ${area.id} does not have an ID.`
            );
          }

          if (scenarioIds.has(scenario.id)) {
            errors.push(
              `Duplicate scenario ID found: ${scenario.id}`
            );
          }

          scenarioIds.add(scenario.id);

          [
            ["issue", scenario.issue],
            ["impact", scenario.impact],
            ["action", scenario.action]
          ].forEach(
            ([sectionName, section]) => {
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
                  `Correct ${sectionName} is missing from options in ${scenario.id}.`
                );
              }
            }
          );

          if (!scenario.scene?.image) {
            errors.push(
              `Scenario ${scenario.id} does not have an image path.`
            );
          }

          if (
            !scenario.scene?.hotspot ||
            !Number.isFinite(
              scenario.scene.hotspot
                .xPercent
            ) ||
            !Number.isFinite(
              scenario.scene.hotspot
                .yPercent
            )
          ) {
            errors.push(
              `Scenario ${scenario.id} does not have a valid issue hotspot.`
            );
          }

          if (
            !getEBMCollectibleById(
              scenario.reward
                ?.collectibleId
            )
          ) {
            errors.push(
              `Scenario ${scenario.id} has an invalid collectible.`
            );
          }
        }
      );
    }
  );

  if (
    scenarioIds.size !==
    EBM_GAME_CONFIG.totalScenarios
  ) {
    errors.push(
      `Expected ${EBM_GAME_CONFIG.totalScenarios} scenarios but found ${scenarioIds.size}.`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/* ============================================================
   12. MAIN DATA OBJECT
============================================================ */

const EBM_GAME_DATA = {
  config: EBM_GAME_CONFIG,

  definitions:
    EBM_ENVIRONMENTAL_DEFINITIONS,

  focusAreas:
    EBM_FOCUS_AREAS,

  collectibles:
    EBM_COLLECTIBLES,

  activityModes:
    EBM_ACTIVITY_MODES,

  lifecycleStages:
    EBM_LIFECYCLE_STAGES,

  impactLevels:
    EBM_IMPACT_LEVELS,

  occurrenceLevels:
    EBM_OCCURRENCE_LEVELS,

  impactCategories:
    EBM_IMPACT_CATEGORIES,

  areas:
    EBM_GAME_AREAS,

  commitments:
    EBM_ENVIRONMENTAL_COMMITMENTS,

  resultLevels:
    EBM_RESULT_LEVELS,

  awarenessMessages:
    EBM_AWARENESS_MESSAGES
};


/* ============================================================
   13. EXPOSE DATA TO THE BROWSER
============================================================ */

if (typeof window !== "undefined") {
  window.EBM_GAME_DATA =
    EBM_GAME_DATA;

  window.getEBMAreaById =
    getEBMAreaById;

  window.getEBMScenarioById =
    getEBMScenarioById;

  window.getEBMTotalAreaCount =
    getEBMTotalAreaCount;

  window.getEBMTotalScenarioCount =
    getEBMTotalScenarioCount;

  window.calculateEBMImpactRating =
    calculateEBMImpactRating;

  window.getEBMImpactCategory =
    getEBMImpactCategory;

  window.getEBMResultLevel =
    getEBMResultLevel;

  window.getAllEBMScenarios =
    getAllEBMScenarios;

  window.getEBMScenariosByMetric =
    getEBMScenariosByMetric;

  window.getEBMComplianceScenarios =
    getEBMComplianceScenarios;

  window.getEBMCollectibleById =
    getEBMCollectibleById;

  window.getEBMAreaUnlockState =
    getEBMAreaUnlockState;

  window.shuffleEBMOptions =
    shuffleEBMOptions;

  window.validateEBMGameData =
    validateEBMGameData;
}


/* ============================================================
   14. DEVELOPMENT VALIDATION
============================================================ */

const EBM_DATA_VALIDATION =
  validateEBMGameData();

if (!EBM_DATA_VALIDATION.valid) {
  console.error(
    "EBM game data validation failed:",
    EBM_DATA_VALIDATION.errors
  );
} else {
  console.info(
    `EBM Eco Rescue V2 data loaded successfully: ${getEBMTotalAreaCount()} areas and ${getEBMTotalScenarioCount()} scenarios.`
  );
}
