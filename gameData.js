"use strict";

/* ============================================================
   EBM ECO RESCUE
   GAME DATA FILE

   File: gameData.js

   Purpose:
   - Stores all fictional EBM environmental awareness areas.
   - Stores environmental aspects, impacts, controls and ratings.
   - Provides scenario content to script.js.
   - Does not contain the actual physical layout of EBM.

   Environmental rating method:
   Impact Rating = Consequence × Occurrence

   Rating categories:
   1–4   = Low / Acceptable
   6–9   = Medium / Tolerable
   12–16 = High / Significant
============================================================ */


/* ============================================================
   1. CAMPAIGN CONFIGURATION
============================================================ */

const EBM_GAME_CONFIG = {
  gameId: "ebm-eco-rescue-2026",

  title: "EBM Eco Rescue",

  subtitle: "Every Area. Every Action. Every Drop.",

  campaignName:
    "World Nature Conservation Day & Water Awareness Campaign",

  organization:
    "English Biscuits Manufacturers (Pvt.) Limited",

  version: "1.0.0",

  actualLayoutUsed: false,

  disclaimer:
    "All areas and scenes used in this game are fictional environmental awareness zones. They do not represent the actual EBM factory layout.",

  minimumAreasRequired: 12,

  commitmentsRequired: 3,

  maximumScorePerScenario: 100,

  points: {
    correctAspect: 20,
    correctImpact: 20,
    correctRating: 25,
    correctControl: 25,
    completionBonus: 10
  },

  metrics: [
    "water",
    "energy",
    "waste",
    "ghg",
    "paper",
    "nature"
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
};


/* ============================================================
   2. SHARED ENVIRONMENTAL DEFINITIONS
============================================================ */

const EBM_ENVIRONMENTAL_DEFINITIONS = {
  environmentalAspect:
    "An element of an activity, product or service that interacts or can interact with the environment.",

  environmentalImpact:
    "A change to the environment, whether adverse or beneficial, resulting wholly or partly from an environmental aspect.",

  routineActivity:
    "An activity performed regularly as part of normal operations.",

  nonRoutineActivity:
    "An activity performed irregularly, during special work, start-up, shutdown, maintenance or change.",

  emergencySituation:
    "An unplanned or unexpected event that may cause an adverse environmental impact.",

  complianceObligation:
    "A legal or other environmental requirement that the organization is required or chooses to comply with.",

  lifecyclePerspective:
    "Consideration of environmental impacts from raw-material acquisition through production, transportation, use and final disposal."
};


/* ============================================================
   3. IMPACT AND OCCURRENCE LEVELS
============================================================ */

const EBM_IMPACT_LEVELS = [
  {
    value: 1,
    name: "Minor",
    shortDescription:
      "Minor or negligible environmental effect.",
    examples: [
      "Small amount of resource wastage",
      "Minor waste generation",
      "Minor short-duration environmental effect"
    ]
  },
  {
    value: 2,
    name: "Moderate",
    shortDescription:
      "Moderate or short-term environmental effect.",
    examples: [
      "Medium resource wastage",
      "Moderate harm to the environment",
      "Controlled but recurring environmental loss"
    ]
  },
  {
    value: 3,
    name: "Major",
    shortDescription:
      "Major, significant or long-term environmental effect.",
    examples: [
      "High resource wastage",
      "Major pollution potential",
      "Significant environmental or health effect"
    ]
  },
  {
    value: 4,
    name: "Severe",
    shortDescription:
      "Severe, widespread or potentially irreversible environmental effect.",
    examples: [
      "Severe environmental damage",
      "Groundwater contamination",
      "Large uncontrolled environmental release"
    ]
  }
];


const EBM_OCCURRENCE_LEVELS = [
  {
    value: 1,
    name: "Rare",
    shortDescription:
      "Unlikely or occurring only a few times in a year."
  },
  {
    value: 2,
    name: "Sometimes",
    shortDescription:
      "Occurs periodically or a few times in a week."
  },
  {
    value: 3,
    name: "Intermittent",
    shortDescription:
      "Occurs several times in a day."
  },
  {
    value: 4,
    name: "Continuous",
    shortDescription:
      "Occurs continuously during a shift or day."
  }
];


/* ============================================================
   4. IMPACT CATEGORIES
============================================================ */

const EBM_IMPACT_CATEGORIES = [
  {
    minimum: 1,
    maximum: 4,
    level: "Low",
    classification: "Acceptable",
    action:
      "Maintain current controls. No additional controls are normally required.",
    colorClass: "low"
  },
  {
    minimum: 6,
    maximum: 9,
    level: "Medium",
    classification: "Tolerable",
    action:
      "Action is required within a reasonable timeframe to reduce the impact.",
    colorClass: "medium"
  },
  {
    minimum: 12,
    maximum: 16,
    level: "High",
    classification: "Significant",
    action:
      "Prompt action is required to reduce the impact to an acceptable level.",
    colorClass: "high"
  }
];


/* ============================================================
   5. FOCUS AREA INFORMATION
============================================================ */

const EBM_FOCUS_AREAS = {
  water: {
    name: "Water",
    icon: "💧",
    colorClass: "water",
    description:
      "Water consumption, leakage, overflow, effluent and water-reuse opportunities."
  },

  energy: {
    name: "Energy",
    icon: "⚡",
    colorClass: "energy",
    description:
      "Electricity, steam, compressed air, fuel and unnecessary equipment operation."
  },

  waste: {
    name: "Waste",
    icon: "♻️",
    colorClass: "waste",
    description:
      "Waste prevention, segregation, reuse, recycling and responsible disposal."
  },

  ghg: {
    name: "GHG",
    icon: "☁️",
    colorClass: "ghg",
    description:
      "Direct and indirect greenhouse-gas emissions from energy and fuel consumption."
  },

  paper: {
    name: "Paper",
    icon: "📄",
    colorClass: "paper",
    description:
      "Paper reduction, digital records and responsible printing."
  },

  nature: {
    name: "Nature",
    icon: "🌳",
    colorClass: "nature",
    description:
      "Protection of air, land, water, flora, fauna and natural resources."
  }
};


/* ============================================================
   6. REUSABLE HELPER DATA
============================================================ */

const EBM_ACTIVITY_MODES = {
  routine: {
    name: "Routine",
    icon: "🔁",
    description:
      "A normal activity performed regularly."
  },

  nonRoutine: {
    name: "Non-Routine",
    icon: "🛠️",
    description:
      "An activity performed irregularly, during maintenance, shutdown or change."
  },

  emergency: {
    name: "Emergency",
    icon: "🚨",
    description:
      "An unplanned environmental event requiring immediate control."
  }
};


const EBM_LIFECYCLE_STAGES = {
  rawMaterial: "Raw-material acquisition and receipt",
  production: "Production and processing",
  packing: "Packaging",
  storage: "Storage and warehousing",
  transportation: "Transportation and delivery",
  use: "Product use",
  endOfLife: "End-of-life treatment and disposal",
  support: "Support activity"
};


/* ============================================================
   7. COMPLETE GAME AREA AND SCENARIO DATA
============================================================ */

const EBM_GAME_AREAS = [

  /* ==========================================================
     AREA 1: MIXING AREA
  ========================================================== */

  {
    id: "mixing-area",
    name: "Mixing Area",
    shortName: "Mixing",
    category: "Production Zone",
    icon: "🥣",

    description:
      "Explore fictional mixing operations and identify environmental issues related to raw-material loss, cleaning water and energy consumption.",

    introduction:
      "Ingredients, water and energy are valuable resources. Responsible handling during mixing can reduce waste, wastewater and avoidable environmental impact.",

    estimatedTime: "4–5 minutes",

    focus: [
      "water",
      "energy",
      "waste"
    ],

    learningObjectives: [
      "Prevent raw-material spillage.",
      "Avoid washing dry waste into drains.",
      "Reduce unnecessary mixer operation."
    ],

    scenarios: [

      {
        id: "mixing-raw-material-spillage",
        title: "Flour Spillage Near the Mixer",

        category: "Waste and Raw-Material Consumption",
        categoryIcon: "🌾",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "🥣",
          image: "",
          alt:
            "A fictional mixing area with flour spilled beside a mixer.",
          observation:
            "A quantity of flour has spilled beside the mixer. A worker is preparing to wash the material toward a nearby drain."
        },

        metrics: {
          water: 15,
          energy: 0,
          waste: 45,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Raw-material spillage during mixing operations",
          options: [
            "Raw-material spillage during mixing operations",
            "Use of a production schedule",
            "Routine employee attendance",
            "Storage of approved cleaning tools"
          ],
          explanation:
            "The environmental aspect is the activity or condition that interacts with the environment. Here, the aspect is the spillage of raw material."
        },

        impact: {
          correct:
            "Raw-material loss, solid-waste generation and increased cleaning-water use",
          options: [
            "Improved production efficiency",
            "Raw-material loss, solid-waste generation and increased cleaning-water use",
            "Reduced waste-disposal requirement",
            "Improved biodiversity"
          ],
          explanation:
            "The spilled ingredient becomes waste and may also increase water consumption and effluent loading if washed into a drain."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The loss is moderate and the activity may occur intermittently during production."
        },

        control: {
          correct:
            "Stop the spread, recover material where permitted, use dry cleaning first and segregate the remaining waste correctly.",
          options: [
            "Wash all spilled flour directly into the drain.",
            "Leave the spill for the next shift.",
            "Stop the spread, recover material where permitted, use dry cleaning first and segregate the remaining waste correctly.",
            "Add more water so the material disappears quickly."
          ],
          explanation:
            "Dry collection prevents unnecessary water use and reduces the quantity of material entering the effluent system."
        },

        complianceObligation: false,

        awarenessMessage:
          "Preventing ingredient loss conserves raw materials and also reduces cleaning water, waste generation and disposal requirements.",

        learningPoints: [
          "The aspect is the spillage; the impact is the resulting waste and resource loss.",
          "Dry cleaning should be considered before wet cleaning.",
          "Waste should never be washed into a drain."
        ],

        keywords: [
          "flour",
          "spillage",
          "raw material",
          "drain",
          "dry cleaning"
        ]
      },


      {
        id: "mixing-continuous-hose-use",
        title: "Continuous Hose Use During Cleaning",

        category: "Water Consumption",
        categoryIcon: "💧",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "🚿",
          image: "",
          alt:
            "A fictional mixing area where a hose is running continuously.",
          observation:
            "A hose is left running continuously while the operator pauses cleaning to move equipment."
        },

        metrics: {
          water: 55,
          energy: 5,
          waste: 5,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Uncontrolled use of water during area cleaning",
          options: [
            "Uncontrolled use of water during area cleaning",
            "Use of approved ingredients",
            "Employee communication",
            "Normal mixer operation"
          ],
          explanation:
            "The aspect is the uncontrolled consumption of water."
        },

        impact: {
          correct:
            "Unnecessary water consumption and increased wastewater generation",
          options: [
            "Reduced water demand",
            "Improved product quality",
            "Unnecessary water consumption and increased wastewater generation",
            "Reduced need for wastewater management"
          ],
          explanation:
            "Continuous flow wastes freshwater and increases the quantity of wastewater requiring management."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The environmental consequence is moderate, but the consumption may continue throughout the cleaning activity."
        },

        control: {
          correct:
            "Close the hose when not in use and use a controlled-flow nozzle or approved cleaning method.",
          options: [
            "Keep the hose running so cleaning can restart quickly.",
            "Increase the water pressure.",
            "Close the hose when not in use and use a controlled-flow nozzle or approved cleaning method.",
            "Direct the unused water toward the drain."
          ],
          explanation:
            "Flow control prevents avoidable water consumption without stopping necessary cleaning."
        },

        complianceObligation: false,

        awarenessMessage:
          "Water should be used only when needed. A few minutes of uncontrolled flow repeated across shifts can create substantial annual water loss.",

        learningPoints: [
          "Resource consumption is an environmental aspect.",
          "Continuous occurrence can increase the significance rating.",
          "Controlled nozzles and disciplined shutoff practices reduce water loss."
        ],

        keywords: [
          "water",
          "hose",
          "cleaning",
          "consumption",
          "wastewater"
        ]
      },


      {
        id: "mixing-idle-mixer",
        title: "Mixer Running During an Extended Delay",

        category: "Electricity and GHG",
        categoryIcon: "⚡",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "⚙️",
          image: "",
          alt:
            "A fictional mixer operating while production is delayed.",
          observation:
            "Production has been delayed, but the mixer and related equipment remain operating without material processing."
        },

        metrics: {
          water: 0,
          energy: 55,
          waste: 5,
          ghg: 35,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Unnecessary operation of mixing equipment during idle time",
          options: [
            "Unnecessary operation of mixing equipment during idle time",
            "Proper production planning",
            "Use of reusable tools",
            "Correct storage of ingredients"
          ],
          explanation:
            "The aspect is the unnecessary consumption of electricity by idle equipment."
        },

        impact: {
          correct:
            "Electricity wastage and increased indirect greenhouse-gas emissions",
          options: [
            "Electricity wastage and increased indirect greenhouse-gas emissions",
            "Reduced electricity demand",
            "Improved air quality",
            "Reduced carbon footprint"
          ],
          explanation:
            "Electricity consumption can contribute to indirect GHG emissions depending on the energy source."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The environmental consequence is moderate and may occur intermittently during delays."
        },

        control: {
          correct:
            "Switch off or place equipment in the approved energy-saving condition when operationally permitted.",
          options: [
            "Keep all equipment running during every delay.",
            "Switch off or place equipment in the approved energy-saving condition when operationally permitted.",
            "Increase equipment speed after the delay.",
            "Ignore energy use because production will eventually restart."
          ],
          explanation:
            "Energy-saving actions must follow approved operational and safety requirements."
        },

        complianceObligation: false,

        awarenessMessage:
          "Avoidable equipment operation consumes energy and indirectly increases the environmental footprint of production.",

        learningPoints: [
          "Energy consumption is linked with indirect GHG emissions.",
          "Operationally approved shutdown practices support environmental performance.",
          "Repeated short periods of idle operation can accumulate into major energy loss."
        ],

        keywords: [
          "mixer",
          "idle",
          "electricity",
          "energy",
          "GHG"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 2: CUTTING AREA
  ========================================================== */

  {
    id: "cutting-area",
    name: "Cutting Area",
    shortName: "Cutting",
    category: "Production Zone",
    icon: "🍪",

    description:
      "Identify environmental aspects connected with biscuit waste, compressed air and unnecessary conveyor operation.",

    introduction:
      "Environmental performance in cutting operations depends on preventing product loss, controlling utilities and reporting energy leaks.",

    estimatedTime: "4–5 minutes",

    focus: [
      "energy",
      "waste",
      "ghg"
    ],

    learningObjectives: [
      "Reduce product waste.",
      "Report compressed-air leaks.",
      "Control equipment operation during stoppages."
    ],

    scenarios: [

      {
        id: "cutting-product-waste",
        title: "Biscuit Waste Below the Conveyor",

        category: "Food and Product Waste",
        categoryIcon: "🍪",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "🍪",
          image: "",
          alt:
            "A fictional cutting line with biscuit material accumulating below a conveyor.",
          observation:
            "Biscuit material is accumulating below the conveyor and is not being collected through the approved process."
        },

        metrics: {
          water: 5,
          energy: 5,
          waste: 55,
          ghg: 5,
          paper: 0,
          nature: 10
        },

        aspect: {
          correct:
            "Product loss and accumulation beneath the cutting conveyor",
          options: [
            "Product loss and accumulation beneath the cutting conveyor",
            "Correct machine guarding",
            "Employee shift scheduling",
            "Approved product inspection"
          ],
          explanation:
            "The aspect is the generation and accumulation of product waste."
        },

        impact: {
          correct:
            "Food waste generation, resource loss and increased pest-attraction potential",
          options: [
            "Improved raw-material efficiency",
            "Food waste generation, resource loss and increased pest-attraction potential",
            "Reduced cleaning requirement",
            "Improved waste segregation"
          ],
          explanation:
            "Discarded product represents wasted ingredients, energy and water used throughout production."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The waste is moderate and may accumulate several times during production."
        },

        control: {
          correct:
            "Stop the source where practicable, collect waste promptly and place it in the approved food or by-product waste route.",
          options: [
            "Push the waste under the machine.",
            "Wash the product into the drain.",
            "Stop the source where practicable, collect waste promptly and place it in the approved food or by-product waste route.",
            "Mix it with packaging waste."
          ],
          explanation:
            "Timely collection and correct segregation prevent contamination and improve waste recovery."
        },

        complianceObligation: false,

        awarenessMessage:
          "Food waste also contains the hidden footprint of the water, energy and raw materials used to manufacture the product.",

        learningPoints: [
          "Preventing waste is better than managing waste after generation.",
          "Food waste must not be mixed with recyclable packaging.",
          "Product loss affects both environmental and operational performance."
        ],

        keywords: [
          "biscuit waste",
          "food waste",
          "conveyor",
          "segregation",
          "resource loss"
        ]
      },


      {
        id: "cutting-compressed-air-leak",
        title: "Compressed-Air Leak at the Cutting Line",

        category: "Energy Loss",
        categoryIcon: "💨",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "💨",
          image: "",
          alt:
            "A fictional compressed-air connection leaking near a cutting machine.",
          observation:
            "A continuous hissing sound can be heard from a compressed-air connection while the line is operating."
        },

        metrics: {
          water: 0,
          energy: 60,
          waste: 5,
          ghg: 45,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Continuous leakage of compressed air",
          options: [
            "Continuous leakage of compressed air",
            "Use of electrical lighting",
            "Correct equipment inspection",
            "Normal product movement"
          ],
          explanation:
            "The environmental aspect is the uncontrolled loss of compressed air."
        },

        impact: {
          correct:
            "Increased electricity consumption and indirect greenhouse-gas emissions",
          options: [
            "Reduced compressor demand",
            "Improved energy efficiency",
            "Increased electricity consumption and indirect greenhouse-gas emissions",
            "Reduced maintenance requirement"
          ],
          explanation:
            "The compressor must work more to maintain pressure, increasing energy consumption."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "Energy loss is major and continues throughout the shift."
        },

        control: {
          correct:
            "Report the leak immediately and arrange safe repair through the responsible department.",
          options: [
            "Increase compressor pressure.",
            "Ignore the leak because the line is still operating.",
            "Report the leak immediately and arrange safe repair through the responsible department.",
            "Cover the leaking point with cloth."
          ],
          explanation:
            "Prompt reporting and repair reduce continuous energy loss."
        },

        complianceObligation: false,

        awarenessMessage:
          "Compressed air is an energy-intensive utility. Even a small continuous leak can create considerable annual electricity loss.",

        learningPoints: [
          "Continuous occurrence can produce a high environmental rating.",
          "Energy leakage contributes to indirect GHG emissions.",
          "Employees should report utility leaks rather than accepting them as normal."
        ],

        keywords: [
          "compressed air",
          "leak",
          "energy",
          "electricity",
          "GHG"
        ]
      },


      {
        id: "cutting-conveyor-idling",
        title: "Conveyor Running During Line Stoppage",

        category: "Electricity Consumption",
        categoryIcon: "🔌",

        activityMode: "routine",
        lifecycleStage: "production",

        scene: {
          icon: "🔌",
          image: "",
          alt:
            "A fictional conveyor running while the production line is stopped.",
          observation:
            "The line has stopped for an extended adjustment, but the conveyor continues to operate without product."
        },

        metrics: {
          water: 0,
          energy: 50,
          waste: 0,
          ghg: 30,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Operation of a conveyor without production demand",
          options: [
            "Operation of a conveyor without production demand",
            "Correct product alignment",
            "Use of approved tools",
            "Routine employee supervision"
          ],
          explanation:
            "The environmental aspect is unnecessary electricity use."
        },

        impact: {
          correct:
            "Avoidable electricity consumption and associated indirect emissions",
          options: [
            "Avoidable electricity consumption and associated indirect emissions",
            "Improved production output",
            "Reduced carbon emissions",
            "Reduced equipment wear"
          ],
          explanation:
            "Running equipment without demand consumes energy without creating useful output."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The impact is moderate and may happen intermittently during stoppages."
        },

        control: {
          correct:
            "Apply the approved standby or shutdown practice when the stoppage duration justifies it.",
          options: [
            "Keep the conveyor running during all stoppages.",
            "Apply the approved standby or shutdown practice when the stoppage duration justifies it.",
            "Increase conveyor speed.",
            "Switch off unrelated safety systems."
          ],
          explanation:
            "Shutdown decisions must follow approved production and safety requirements."
        },

        complianceObligation: false,

        awarenessMessage:
          "Equipment should produce value when consuming energy. Approved standby controls reduce avoidable consumption.",

        learningPoints: [
          "Idle equipment is an environmental aspect.",
          "Energy-saving controls must remain compatible with operational safety.",
          "Small repeated losses create measurable annual impacts."
        ],

        keywords: [
          "conveyor",
          "idle",
          "stoppage",
          "electricity",
          "standby"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 3: PACKING AREA
  ========================================================== */

  {
    id: "packing-area",
    name: "Packing Area",
    shortName: "Packing",
    category: "Production Zone",
    icon: "📦",

    description:
      "Manage packaging material, recyclable waste and energy consumption in a fictional packing operation.",

    introduction:
      "Packaging protects products, but unnecessary consumption and poor segregation increase the environmental footprint.",

    estimatedTime: "4–5 minutes",

    focus: [
      "waste",
      "energy",
      "ghg"
    ],

    learningObjectives: [
      "Prevent packaging-material waste.",
      "Segregate BOPP and cardboard correctly.",
      "Report packing-line utility losses."
    ],

    scenarios: [

      {
        id: "packing-bopp-mixed-waste",
        title: "BOPP Film Mixed with General Waste",

        category: "Waste Segregation",
        categoryIcon: "♻️",

        activityMode: "routine",
        lifecycleStage: "packing",

        scene: {
          icon: "🧻",
          image: "",
          alt:
            "A fictional packing area where clean packaging film is mixed with general waste.",
          observation:
            "Clean BOPP film off-cuts have been placed in a general-waste container with food-contaminated waste."
        },

        metrics: {
          water: 0,
          energy: 5,
          waste: 60,
          ghg: 10,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Incorrect segregation of clean BOPP film",
          options: [
            "Incorrect segregation of clean BOPP film",
            "Approved packing-machine operation",
            "Correct product coding",
            "Normal employee movement"
          ],
          explanation:
            "The aspect is the incorrect handling and segregation of packaging waste."
        },

        impact: {
          correct:
            "Loss of recyclable material and increased waste sent for disposal",
          options: [
            "Improved recycling performance",
            "Loss of recyclable material and increased waste sent for disposal",
            "Reduced waste generation",
            "Reduced environmental footprint"
          ],
          explanation:
            "Mixing clean recyclable material with contaminated waste can prevent recovery."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The impact is moderate and segregation errors may occur several times during the day."
        },

        control: {
          correct:
            "Separate clean BOPP film at the point of generation and place it in the approved designated container.",
          options: [
            "Continue mixing all packing waste.",
            "Burn the film to reduce volume.",
            "Separate clean BOPP film at the point of generation and place it in the approved designated container.",
            "Place it near the drain for later collection."
          ],
          explanation:
            "Segregation at source preserves the possibility of recovery or approved recycling."
        },

        complianceObligation: false,

        awarenessMessage:
          "Waste has greater recovery value when it is kept clean and correctly segregated at the point of generation.",

        learningPoints: [
          "Incorrect segregation is an environmental aspect.",
          "Contamination can remove the recycling value of material.",
          "Segregation must occur where waste is generated."
        ],

        keywords: [
          "BOPP",
          "film",
          "plastic",
          "recycling",
          "segregation"
        ]
      },


      {
        id: "packing-excessive-stretch-film",
        title: "Excessive Stretch-Film Consumption",

        category: "Resource Consumption",
        categoryIcon: "📦",

        activityMode: "routine",
        lifecycleStage: "packing",

        scene: {
          icon: "📦",
          image: "",
          alt:
            "A fictional pallet wrapped with an excessive quantity of stretch film.",
          observation:
            "A pallet has been wrapped with substantially more stretch film than the approved quantity needed for load stability."
        },

        metrics: {
          water: 0,
          energy: 5,
          waste: 50,
          ghg: 15,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Excessive consumption of plastic stretch film",
          options: [
            "Excessive consumption of plastic stretch film",
            "Correct pallet arrangement",
            "Product traceability",
            "Routine quality inspection"
          ],
          explanation:
            "The aspect is the unnecessary use of packaging material."
        },

        impact: {
          correct:
            "Increased plastic consumption, waste generation and lifecycle environmental burden",
          options: [
            "Reduced plastic use",
            "Increased plastic consumption, waste generation and lifecycle environmental burden",
            "Improved recycling rate automatically",
            "Reduced raw-material demand"
          ],
          explanation:
            "Excess packaging consumes additional natural resources and creates more end-of-life waste."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The environmental effect is moderate but may occur repeatedly across pallet preparation."
        },

        control: {
          correct:
            "Use the approved minimum quantity that maintains product and load protection.",
          options: [
            "Use as much film as possible.",
            "Stop using load protection completely.",
            "Use the approved minimum quantity that maintains product and load protection.",
            "Dispose of unused film with food waste."
          ],
          explanation:
            "Environmental reduction must not compromise product integrity or transport safety."
        },

        complianceObligation: false,

        awarenessMessage:
          "Responsible packaging means using enough material to protect the product without unnecessary consumption.",

        learningPoints: [
          "Packaging consumption should be optimized, not simply eliminated.",
          "Lifecycle impacts continue through disposal.",
          "Standardization can reduce unnecessary material use."
        ],

        keywords: [
          "stretch film",
          "plastic",
          "packaging",
          "pallet",
          "resource consumption"
        ]
      },


      {
        id: "packing-machine-air-leak",
        title: "Air Leak at a Packing Machine",

        category: "Energy and GHG",
        categoryIcon: "💨",

        activityMode: "routine",
        lifecycleStage: "packing",

        scene: {
          icon: "💨",
          image: "",
          alt:
            "A fictional packing machine with a compressed-air leak.",
          observation:
            "A compressed-air tube is leaking continuously, but the issue has not been reported because the machine is still operating."
        },

        metrics: {
          water: 0,
          energy: 60,
          waste: 0,
          ghg: 45,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Continuous compressed-air leakage from packing equipment",
          options: [
            "Continuous compressed-air leakage from packing equipment",
            "Correct wrapper installation",
            "Product labelling",
            "Routine machine cleaning"
          ],
          explanation:
            "The aspect is the uncontrolled loss of an energy-intensive utility."
        },

        impact: {
          correct:
            "Increased compressor electricity demand and indirect GHG emissions",
          options: [
            "Reduced energy demand",
            "Increased compressor electricity demand and indirect GHG emissions",
            "Improved machine efficiency",
            "Reduced maintenance cost"
          ],
          explanation:
            "The compressor consumes additional electricity to compensate for lost air."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The loss is continuous and can create major energy wastage."
        },

        control: {
          correct:
            "Report the leak immediately and arrange safe corrective maintenance.",
          options: [
            "Ignore the leak until the annual shutdown.",
            "Increase system pressure.",
            "Report the leak immediately and arrange safe corrective maintenance.",
            "Wrap the tube with paper."
          ],
          explanation:
            "Prompt repair prevents continuous energy and cost loss."
        },

        complianceObligation: false,

        awarenessMessage:
          "A machine may continue operating while still wasting significant energy. Environmental issues should not be ignored merely because production continues.",

        learningPoints: [
          "Environmental performance includes hidden utility losses.",
          "Continuous leaks can be significant.",
          "Reporting is the first control available to every employee."
        ],

        keywords: [
          "packing",
          "compressed air",
          "leak",
          "energy",
          "emissions"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 4: LABORATORY
  ========================================================== */

  {
    id: "laboratory",
    name: "Laboratory",
    shortName: "Lab",
    category: "Quality and Testing Zone",
    icon: "🧪",

    description:
      "Control chemical waste, laboratory water use and electricity consumption in a fictional testing laboratory.",

    introduction:
      "Laboratory quantities may be small, but improper chemical disposal can create significant environmental and compliance consequences.",

    estimatedTime: "4–5 minutes",

    focus: [
      "water",
      "waste",
      "energy",
      "nature"
    ],

    learningObjectives: [
      "Prevent chemicals from entering drains.",
      "Control water during equipment washing.",
      "Switch off laboratory equipment when not required."
    ],

    scenarios: [

      {
        id: "lab-chemical-drain-disposal",
        title: "Expired Chemical Near the Sink",

        category: "Chemical and Effluent Management",
        categoryIcon: "🧪",

        activityMode: "nonRoutine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🧪",
          image: "",
          alt:
            "A fictional laboratory where an expired chemical is being considered for sink disposal.",
          observation:
            "A small container of expired laboratory chemical has been placed beside the sink for disposal."
        },

        metrics: {
          water: 35,
          energy: 0,
          waste: 45,
          ghg: 0,
          paper: 0,
          nature: 60
        },

        aspect: {
          correct:
            "Potential discharge of laboratory chemical into the drain",
          options: [
            "Potential discharge of laboratory chemical into the drain",
            "Correct sample identification",
            "Routine use of a laboratory bench",
            "Employee attendance"
          ],
          explanation:
            "The aspect is the potential chemical discharge into the wastewater system."
        },

        impact: {
          correct:
            "Effluent contamination and potential harm to water, treatment systems and the environment",
          options: [
            "Improved wastewater quality",
            "Effluent contamination and potential harm to water, treatment systems and the environment",
            "Reduced hazardous-waste generation",
            "Improved biodiversity"
          ],
          explanation:
            "Chemicals may create toxic or non-compliant wastewater conditions."
        },

        rating: {
          consequence: 4,
          occurrence: 2,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The potential consequence is severe, although the event may occur only sometimes."
        },

        control: {
          correct:
            "Label, contain and dispose of the chemical through the approved hazardous-waste process.",
          options: [
            "Pour it into the sink with additional water.",
            "Mix it with general waste.",
            "Label, contain and dispose of the chemical through the approved hazardous-waste process.",
            "Leave it unlabelled indefinitely."
          ],
          explanation:
            "Chemical waste must follow the approved hazardous-waste route."
        },

        complianceObligation: true,

        complianceMessage:
          "Chemical discharge may involve applicable environmental compliance obligations. It must be controlled regardless of its numerical score.",

        awarenessMessage:
          "A small chemical quantity can still create a serious impact if it enters a drain, soil or water system.",

        learningPoints: [
          "Low quantity does not always mean low significance.",
          "Compliance obligations can make an aspect significant regardless of score.",
          "Hazardous waste requires controlled storage, labelling and disposal."
        ],

        keywords: [
          "chemical",
          "laboratory",
          "drain",
          "effluent",
          "hazardous waste"
        ]
      },


      {
        id: "lab-running-tap",
        title: "Tap Running During Equipment Washing",

        category: "Water Conservation",
        categoryIcon: "🚰",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🚰",
          image: "",
          alt:
            "A fictional laboratory tap running while glassware is being arranged.",
          observation:
            "The tap remains fully open while the employee pauses washing to arrange laboratory equipment."
        },

        metrics: {
          water: 60,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 15
        },

        aspect: {
          correct:
            "Uncontrolled water use during laboratory washing",
          options: [
            "Uncontrolled water use during laboratory washing",
            "Correct use of glassware",
            "Approved sample testing",
            "Storage of laboratory records"
          ],
          explanation:
            "The aspect is unnecessary consumption of water."
        },

        impact: {
          correct:
            "Freshwater wastage and increased wastewater generation",
          options: [
            "Freshwater wastage and increased wastewater generation",
            "Improved water efficiency",
            "Reduced effluent volume",
            "Reduced demand on water resources"
          ],
          explanation:
            "Running water without active use creates avoidable consumption."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence is moderate and the flow may continue throughout routine washing."
        },

        control: {
          correct:
            "Close the tap while arranging equipment and use controlled water flow only when required.",
          options: [
            "Keep the tap open.",
            "Increase the flow.",
            "Close the tap while arranging equipment and use controlled water flow only when required.",
            "Allow water to overflow before starting."
          ],
          explanation:
            "Simple shutoff discipline directly reduces water consumption."
        },

        complianceObligation: false,

        awarenessMessage:
          "Water-saving behaviour is effective when it becomes part of every routine task, including small laboratory activities.",

        learningPoints: [
          "Routine activities can create significant cumulative consumption.",
          "Water should flow only while performing the required task.",
          "Employee behaviour is an important operational control."
        ],

        keywords: [
          "tap",
          "water",
          "laboratory",
          "washing",
          "conservation"
        ]
      },


      {
        id: "lab-equipment-left-on",
        title: "Laboratory Equipment Left Operating",

        category: "Electricity Consumption",
        categoryIcon: "🔬",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🔬",
          image: "",
          alt:
            "Fictional laboratory equipment operating with no active testing.",
          observation:
            "Testing is complete, but electrical laboratory equipment and task lighting remain switched on."
        },

        metrics: {
          water: 0,
          energy: 50,
          waste: 0,
          ghg: 30,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Laboratory equipment operating without testing demand",
          options: [
            "Laboratory equipment operating without testing demand",
            "Correct sample retention",
            "Approved test procedure",
            "Routine record review"
          ],
          explanation:
            "The aspect is unnecessary electricity consumption."
        },

        impact: {
          correct:
            "Electricity wastage and increased indirect GHG emissions",
          options: [
            "Electricity wastage and increased indirect GHG emissions",
            "Reduced electricity demand",
            "Improved environmental performance",
            "Reduced equipment wear"
          ],
          explanation:
            "Unnecessary operation consumes electricity and may also reduce equipment life."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "Moderate energy loss may occur intermittently after testing."
        },

        control: {
          correct:
            "Switch off equipment and lighting when no longer required, following approved procedures.",
          options: [
            "Leave all equipment operating overnight.",
            "Switch off equipment and lighting when no longer required, following approved procedures.",
            "Increase the operating temperature.",
            "Disconnect critical equipment without authorization."
          ],
          explanation:
            "Energy-saving actions must consider equipment requirements and authorized shutdown practices."
        },

        complianceObligation: false,

        awarenessMessage:
          "The cleanest unit of energy is the energy that does not need to be consumed.",

        learningPoints: [
          "Support areas also contribute to environmental performance.",
          "Switch-off practices should be clearly defined.",
          "Energy conservation reduces indirect emissions."
        ],

        keywords: [
          "laboratory",
          "equipment",
          "electricity",
          "switch off",
          "GHG"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 5: OFFICES
  ========================================================== */

  {
    id: "offices",
    name: "Offices",
    shortName: "Offices",
    category: "Administrative Zone",
    icon: "🏢",

    description:
      "Improve paper, electricity and air-conditioning practices in a fictional EBM office environment.",

    introduction:
      "Administrative decisions influence paper use, electricity demand and the environmental culture of the organization.",

    estimatedTime: "4–5 minutes",

    focus: [
      "paper",
      "energy",
      "ghg",
      "waste"
    ],

    learningObjectives: [
      "Reduce unnecessary printing.",
      "Control office electricity use.",
      "Promote reusable items and digital processes."
    ],

    scenarios: [

      {
        id: "office-unnecessary-printing",
        title: "Repeated Printing of Draft Documents",

        category: "Paper Consumption",
        categoryIcon: "🖨️",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🖨️",
          image: "",
          alt:
            "A fictional office printer producing multiple draft copies.",
          observation:
            "Several draft versions of the same report have been printed for internal review, although digital review is available."
        },

        metrics: {
          water: 5,
          energy: 10,
          waste: 20,
          ghg: 10,
          paper: 60,
          nature: 20
        },

        aspect: {
          correct:
            "Unnecessary printing of draft documents",
          options: [
            "Unnecessary printing of draft documents",
            "Digital document review",
            "Correct filing of approved records",
            "Use of an email subject line"
          ],
          explanation:
            "The aspect is excessive paper consumption."
        },

        impact: {
          correct:
            "Increased paper consumption, waste generation and lifecycle resource use",
          options: [
            "Reduced paper consumption",
            "Increased paper consumption, waste generation and lifecycle resource use",
            "Improved forest conservation",
            "Reduced printer electricity demand"
          ],
          explanation:
            "Paper has lifecycle impacts involving raw materials, water, energy, transportation and disposal."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The impact is moderate and can recur regularly across departments."
        },

        control: {
          correct:
            "Review drafts digitally and print only the final required document using double-sided printing where suitable.",
          options: [
            "Print every email and draft.",
            "Review drafts digitally and print only the final required document using double-sided printing where suitable.",
            "Print multiple copies in advance.",
            "Discard single-sided paper immediately."
          ],
          explanation:
            "Digital review prevents unnecessary paper use while maintaining required records."
        },

        complianceObligation: false,

        awarenessMessage:
          "Paper reduction is not only about trees. It also reduces water, energy, transport and waste impacts across the paper lifecycle.",

        learningPoints: [
          "Paper has upstream and downstream environmental impacts.",
          "Digital review is a preventive control.",
          "Final required records can still be printed responsibly."
        ],

        keywords: [
          "paper",
          "printing",
          "office",
          "digital",
          "double sided"
        ]
      },


      {
        id: "office-empty-room-energy",
        title: "Empty Meeting Room with AC and Lights On",

        category: "Electricity and GHG",
        categoryIcon: "💡",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "💡",
          image: "",
          alt:
            "A fictional empty meeting room with lights and air-conditioning operating.",
          observation:
            "A meeting has ended, but lights, display equipment and air-conditioning remain switched on in the empty room."
        },

        metrics: {
          water: 0,
          energy: 60,
          waste: 0,
          ghg: 40,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Electricity consumption in an unoccupied room",
          options: [
            "Electricity consumption in an unoccupied room",
            "Use of a meeting agenda",
            "Correct room booking",
            "Employee collaboration"
          ],
          explanation:
            "The aspect is unnecessary electricity consumption."
        },

        impact: {
          correct:
            "Energy wastage and increased indirect greenhouse-gas emissions",
          options: [
            "Energy wastage and increased indirect greenhouse-gas emissions",
            "Reduced electricity consumption",
            "Improved air quality",
            "Reduced carbon footprint"
          ],
          explanation:
            "Lights and cooling systems use electricity even when the space is empty."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The environmental consequence is moderate and may continue for extended periods."
        },

        control: {
          correct:
            "Switch off unnecessary lights, display equipment and air-conditioning when leaving the room.",
          options: [
            "Leave everything on for the next meeting.",
            "Switch off unnecessary lights, display equipment and air-conditioning when leaving the room.",
            "Lower the AC temperature further.",
            "Open the door while cooling continues."
          ],
          explanation:
            "The last person leaving should ensure unnecessary equipment is switched off."
        },

        complianceObligation: false,

        awarenessMessage:
          "Environmental responsibility includes shared spaces. The last person leaving can prevent hours of unnecessary energy consumption.",

        learningPoints: [
          "Shared-area energy control requires ownership.",
          "Air-conditioning is often a major office electricity load.",
          "Energy conservation supports GHG reduction."
        ],

        keywords: [
          "office",
          "meeting room",
          "air conditioning",
          "lights",
          "energy"
        ]
      },


      {
        id: "office-disposable-cups",
        title: "Daily Use of Disposable Cups",

        category: "Waste Prevention",
        categoryIcon: "☕",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "☕",
          image: "",
          alt:
            "A fictional office bin containing many disposable cups.",
          observation:
            "Employees use new disposable cups for several drinks during the day, creating a large volume of avoidable waste."
        },

        metrics: {
          water: 5,
          energy: 5,
          waste: 50,
          ghg: 10,
          paper: 15,
          nature: 20
        },

        aspect: {
          correct:
            "Repeated use of single-use disposable cups",
          options: [
            "Repeated use of single-use disposable cups",
            "Use of a reusable mug",
            "Correct waste collection",
            "Routine refreshment break"
          ],
          explanation:
            "The aspect is consumption of single-use material."
        },

        impact: {
          correct:
            "Increased waste generation and consumption of disposable materials",
          options: [
            "Reduced waste generation",
            "Increased waste generation and consumption of disposable materials",
            "Improved reuse performance",
            "Reduced raw-material demand"
          ],
          explanation:
            "Single-use products require materials and energy to manufacture and create waste after a very short use period."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The individual impact is moderate but the activity occurs repeatedly every day."
        },

        control: {
          correct:
            "Use a reusable cup or mug and maintain appropriate hygiene practices.",
          options: [
            "Use a new disposable cup for every drink.",
            "Use a reusable cup or mug and maintain appropriate hygiene practices.",
            "Mix all used cups with hazardous waste.",
            "Burn used cups."
          ],
          explanation:
            "Reuse prevents waste generation at source."
        },

        complianceObligation: false,

        awarenessMessage:
          "A reusable item can prevent hundreds of disposable items from becoming waste over time.",

        learningPoints: [
          "Prevention and reuse are preferable to disposal.",
          "Frequent small actions can create a significant cumulative impact.",
          "Personal habits influence organizational environmental performance."
        ],

        keywords: [
          "cups",
          "single use",
          "office waste",
          "reuse",
          "disposable"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 6: CANTEEN
  ========================================================== */

  {
    id: "canteen",
    name: "Canteen",
    shortName: "Canteen",
    category: "Employee Services Zone",
    icon: "🍽️",

    description:
      "Reduce food waste, disposable materials and incorrect segregation in a fictional canteen.",

    introduction:
      "Food waste also wastes the water, energy, fuel, labour and raw materials used to produce and deliver food.",

    estimatedTime: "4–5 minutes",

    focus: [
      "waste",
      "water",
      "nature",
      "ghg"
    ],

    learningObjectives: [
      "Prevent avoidable food waste.",
      "Use reusable dining items.",
      "Segregate food and recyclable waste correctly."
    ],

    scenarios: [

      {
        id: "canteen-food-waste",
        title: "Large Quantity of Uneaten Food",

        category: "Food Waste",
        categoryIcon: "🍛",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🍛",
          image: "",
          alt:
            "A fictional canteen where large quantities of uneaten food remain on plates.",
          observation:
            "Many plates contain large portions of uneaten food that will be discarded."
        },

        metrics: {
          water: 15,
          energy: 10,
          waste: 60,
          ghg: 20,
          paper: 0,
          nature: 25
        },

        aspect: {
          correct:
            "Avoidable generation of food waste",
          options: [
            "Avoidable generation of food waste",
            "Use of a dining table",
            "Correct food storage",
            "Employee lunch timing"
          ],
          explanation:
            "The aspect is food being taken but not consumed."
        },

        impact: {
          correct:
            "Food waste generation and loss of embedded water, energy and raw materials",
          options: [
            "Reduced waste generation",
            "Food waste generation and loss of embedded water, energy and raw materials",
            "Improved resource efficiency",
            "Reduced disposal requirement"
          ],
          explanation:
            "Food carries an environmental footprint from agriculture through processing and transportation."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "Food waste is moderate but occurs daily."
        },

        control: {
          correct:
            "Take an appropriate portion first and return for more food only if required.",
          options: [
            "Take the largest possible portion.",
            "Mix food waste with recyclables.",
            "Take an appropriate portion first and return for more food only if required.",
            "Leave food on the table."
          ],
          explanation:
            "Appropriate portion selection prevents waste at source."
        },

        complianceObligation: false,

        awarenessMessage:
          "Reducing food waste conserves far more than food—it also conserves the resources used to produce it.",

        learningPoints: [
          "Waste prevention begins before disposal.",
          "Food contains an embedded water and carbon footprint.",
          "Appropriate portions support both sustainability and cleanliness."
        ],

        keywords: [
          "canteen",
          "food waste",
          "portion",
          "water footprint",
          "resources"
        ]
      },


      {
        id: "canteen-disposable-items",
        title: "Single-Use Plates and Cups",

        category: "Single-Use Waste",
        categoryIcon: "🥤",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🥤",
          image: "",
          alt:
            "A fictional canteen using disposable cups and plates where reusable items are available.",
          observation:
            "Disposable cups and plates are being used even though clean reusable alternatives are available."
        },

        metrics: {
          water: 5,
          energy: 5,
          waste: 55,
          ghg: 15,
          paper: 10,
          nature: 25
        },

        aspect: {
          correct:
            "Unnecessary use of single-use dining items",
          options: [
            "Unnecessary use of single-use dining items",
            "Use of washable plates",
            "Correct canteen cleaning",
            "Employee meal scheduling"
          ],
          explanation:
            "The aspect is consumption of disposable material."
        },

        impact: {
          correct:
            "Increased material consumption and solid-waste generation",
          options: [
            "Increased material consumption and solid-waste generation",
            "Reduced waste generation",
            "Improved reuse rate",
            "Reduced lifecycle impact"
          ],
          explanation:
            "Single-use items are discarded after a very short service life."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence is moderate and occurs repeatedly."
        },

        control: {
          correct:
            "Use clean reusable plates, glasses and cutlery wherever practicable.",
          options: [
            "Use multiple disposable items per meal.",
            "Use clean reusable plates, glasses and cutlery wherever practicable.",
            "Mix disposable waste with food waste.",
            "Burn disposable material after lunch."
          ],
          explanation:
            "Reusable items prevent waste generation, provided hygiene is maintained."
        },

        complianceObligation: false,

        awarenessMessage:
          "Reusable service items reduce the number of products manufactured, transported and discarded.",

        learningPoints: [
          "Reuse is generally preferable to single use.",
          "Waste prevention is part of resource conservation.",
          "Hygiene and environmental performance can be managed together."
        ],

        keywords: [
          "canteen",
          "disposable",
          "cups",
          "plates",
          "reuse"
        ]
      },


      {
        id: "canteen-mixed-waste",
        title: "Food Waste Mixed with Recyclables",

        category: "Waste Segregation",
        categoryIcon: "🗑️",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🗑️",
          image: "",
          alt:
            "A fictional canteen bin containing mixed food waste, bottles and cardboard.",
          observation:
            "Food waste, plastic bottles and clean cardboard have been placed in the same container."
        },

        metrics: {
          water: 0,
          energy: 0,
          waste: 60,
          ghg: 10,
          paper: 10,
          nature: 25
        },

        aspect: {
          correct:
            "Mixing food waste with recyclable material",
          options: [
            "Mixing food waste with recyclable material",
            "Correct bin labelling",
            "Use of reusable bottles",
            "Routine table cleaning"
          ],
          explanation:
            "The aspect is incorrect waste segregation."
        },

        impact: {
          correct:
            "Contamination of recyclables and increased disposal burden",
          options: [
            "Improved recycling quality",
            "Contamination of recyclables and increased disposal burden",
            "Reduced waste volume",
            "Reduced collection requirements"
          ],
          explanation:
            "Food contamination can make otherwise recyclable materials unsuitable for recovery."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence is moderate and mixing may occur several times each day."
        },

        control: {
          correct:
            "Place food, recyclable and general waste in their designated labelled containers.",
          options: [
            "Continue using one bin for everything.",
            "Place food, recyclable and general waste in their designated labelled containers.",
            "Place food waste in the paper container.",
            "Hide mixed waste below other bags."
          ],
          explanation:
            "Clear segregation at source protects the value of recoverable material."
        },

        complianceObligation: false,

        awarenessMessage:
          "Waste separation takes seconds, but incorrect segregation can prevent an entire container from being recycled.",

        learningPoints: [
          "Correct bin use is an employee responsibility.",
          "Contamination reduces recycling performance.",
          "Labels and awareness support correct segregation."
        ],

        keywords: [
          "canteen",
          "mixed waste",
          "food",
          "recycling",
          "bins"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 7: KITCHEN
  ========================================================== */

  {
    id: "kitchen",
    name: "Kitchen",
    shortName: "Kitchen",
    category: "Food Preparation Zone",
    icon: "👨‍🍳",

    description:
      "Control kitchen water use, used cooking oil and unnecessary appliance energy consumption.",

    introduction:
      "Kitchen activities interact with water, wastewater, energy and waste every day. Good controls protect resources and drainage systems.",

    estimatedTime: "4–5 minutes",

    focus: [
      "water",
      "energy",
      "waste",
      "nature"
    ],

    learningObjectives: [
      "Reduce water during dishwashing.",
      "Prevent oil from entering drains.",
      "Control energy use by kitchen equipment."
    ],

    scenarios: [

      {
        id: "kitchen-running-water",
        title: "Continuous Water Flow During Dishwashing",

        category: "Water Consumption",
        categoryIcon: "🚿",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🚿",
          image: "",
          alt:
            "A fictional kitchen sink with water running continuously.",
          observation:
            "The tap remains fully open while dishes are being scrubbed away from the water stream."
        },

        metrics: {
          water: 65,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Continuous water use during dishwashing",
          options: [
            "Continuous water use during dishwashing",
            "Correct use of detergent",
            "Storage of clean dishes",
            "Employee handwashing"
          ],
          explanation:
            "The aspect is uncontrolled freshwater consumption."
        },

        impact: {
          correct:
            "Water wastage and increased wastewater volume",
          options: [
            "Water wastage and increased wastewater volume",
            "Reduced water consumption",
            "Improved water availability",
            "Reduced effluent generation"
          ],
          explanation:
            "Water continues to be consumed even when it is not actively required."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The environmental impact is moderate and the usage may continue throughout washing."
        },

        control: {
          correct:
            "Remove food residue first and use controlled water only for required washing and rinsing.",
          options: [
            "Leave the tap open continuously.",
            "Increase water pressure.",
            "Remove food residue first and use controlled water only for required washing and rinsing.",
            "Allow dishes to overflow the sink."
          ],
          explanation:
            "Dry removal and controlled flow reduce both water use and drain loading."
        },

        complianceObligation: false,

        awarenessMessage:
          "Efficient dishwashing begins before the tap is opened. Remove solids first and control the water flow.",

        learningPoints: [
          "Water and effluent impacts are connected.",
          "Food residue should not be washed into drains.",
          "Controlled washing reduces resource consumption."
        ],

        keywords: [
          "kitchen",
          "dishwashing",
          "water",
          "tap",
          "wastewater"
        ]
      },


      {
        id: "kitchen-used-oil-drain",
        title: "Used Cooking Oil Near the Drain",

        category: "Oil and Drain Protection",
        categoryIcon: "🛢️",

        activityMode: "nonRoutine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🛢️",
          image: "",
          alt:
            "A fictional kitchen container of used cooking oil placed near a drain.",
          observation:
            "Used cooking oil is being transferred near a drain without secondary containment."
        },

        metrics: {
          water: 35,
          energy: 0,
          waste: 45,
          ghg: 0,
          paper: 0,
          nature: 60
        },

        aspect: {
          correct:
            "Potential release of used cooking oil into the drainage system",
          options: [
            "Potential release of used cooking oil into the drainage system",
            "Correct food preparation",
            "Use of approved cooking equipment",
            "Routine kitchen inspection"
          ],
          explanation:
            "The aspect is the potential release or incorrect disposal of oil."
        },

        impact: {
          correct:
            "Drain blockage, wastewater contamination and environmental pollution",
          options: [
            "Improved wastewater quality",
            "Drain blockage, wastewater contamination and environmental pollution",
            "Reduced waste generation",
            "Improved treatment efficiency"
          ],
          explanation:
            "Oil can obstruct drainage and adversely affect wastewater systems."
        },

        rating: {
          consequence: 3,
          occurrence: 2,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The possible impact is major, although transfer may occur only sometimes."
        },

        control: {
          correct:
            "Collect used oil in a labelled closed container with suitable containment and send it through the approved disposal or recovery route.",
          options: [
            "Pour used oil into the drain with hot water.",
            "Mix used oil with food waste.",
            "Collect used oil in a labelled closed container with suitable containment and send it through the approved disposal or recovery route.",
            "Leave the open container beside the drain."
          ],
          explanation:
            "Controlled collection prevents wastewater and land contamination."
        },

        complianceObligation: true,

        complianceMessage:
          "Improper disposal of oil may breach applicable environmental and waste-management requirements.",

        awarenessMessage:
          "Oil must never be treated like ordinary liquid waste. A small release can create significant drainage and pollution problems.",

        learningPoints: [
          "Oil disposal may involve compliance obligations.",
          "Containment is essential during transfer and storage.",
          "Drains must be protected from oil and food residue."
        ],

        keywords: [
          "used oil",
          "kitchen",
          "drain",
          "wastewater",
          "containment"
        ]
      },


      {
        id: "kitchen-appliance-idling",
        title: "Kitchen Equipment Operating Without Demand",

        category: "Energy and GHG",
        categoryIcon: "🔥",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🔥",
          image: "",
          alt:
            "Fictional kitchen heating equipment operating while no food is being prepared.",
          observation:
            "Heating and ventilation equipment remains running during an extended period with no food preparation."
        },

        metrics: {
          water: 0,
          energy: 60,
          waste: 0,
          ghg: 45,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Unnecessary operation of kitchen heating and ventilation equipment",
          options: [
            "Unnecessary operation of kitchen heating and ventilation equipment",
            "Correct food storage",
            "Employee meal preparation",
            "Use of approved utensils"
          ],
          explanation:
            "The aspect is unnecessary fuel or electricity consumption."
        },

        impact: {
          correct:
            "Energy wastage and increased greenhouse-gas emissions",
          options: [
            "Reduced fuel consumption",
            "Energy wastage and increased greenhouse-gas emissions",
            "Reduced environmental footprint",
            "Improved energy efficiency"
          ],
          explanation:
            "Heating and ventilation may consume significant energy while not providing useful output."
        },

        rating: {
          consequence: 3,
          occurrence: 3,
          score: 9,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "Energy use is substantial and may occur intermittently."
        },

        control: {
          correct:
            "Use approved start-up, standby and shutdown timings based on actual demand.",
          options: [
            "Run all equipment throughout the day.",
            "Use approved start-up, standby and shutdown timings based on actual demand.",
            "Increase temperature during idle periods.",
            "Disable necessary safety controls."
          ],
          explanation:
            "Operating schedules should match service demand while maintaining food safety and ventilation requirements."
        },

        complianceObligation: false,

        awarenessMessage:
          "Good operating schedules reduce energy use without compromising food service, hygiene or safety.",

        learningPoints: [
          "Energy controls should match real operational demand.",
          "Fuel and electricity use contribute to GHG emissions.",
          "Environmental controls must remain compatible with hygiene and safety requirements."
        ],

        keywords: [
          "kitchen",
          "energy",
          "heating",
          "ventilation",
          "GHG"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 8: CAR PARKING
  ========================================================== */

  {
    id: "car-parking",
    name: "Car Parking",
    shortName: "Parking",
    category: "Transport Zone",
    icon: "🚗",

    description:
      "Address vehicle idling, oil leakage and protection of green areas in a fictional parking zone.",

    introduction:
      "Transportation and vehicle behaviour influence fuel consumption, air emissions, land contamination and GHG performance.",

    estimatedTime: "4–5 minutes",

    focus: [
      "ghg",
      "energy",
      "nature",
      "waste"
    ],

    learningObjectives: [
      "Avoid unnecessary vehicle idling.",
      "Respond to vehicle oil leakage.",
      "Protect green areas from vehicle movement."
    ],

    scenarios: [

      {
        id: "parking-vehicle-idling",
        title: "Vehicle Idling While Waiting",

        category: "Fuel and GHG Emissions",
        categoryIcon: "🚗",

        activityMode: "routine",
        lifecycleStage: "transportation",

        scene: {
          icon: "🚗",
          image: "",
          alt:
            "A fictional parked vehicle with its engine running while waiting.",
          observation:
            "A vehicle has been stationary for an extended period while its engine and air-conditioning remain running."
        },

        metrics: {
          water: 0,
          energy: 45,
          waste: 0,
          ghg: 65,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Unnecessary vehicle-engine idling",
          options: [
            "Unnecessary vehicle-engine idling",
            "Correct vehicle parking",
            "Driver attendance",
            "Use of a parking permit"
          ],
          explanation:
            "The aspect is unnecessary fuel combustion."
        },

        impact: {
          correct:
            "Fuel wastage, air emissions and increased greenhouse-gas emissions",
          options: [
            "Reduced fuel consumption",
            "Fuel wastage, air emissions and increased greenhouse-gas emissions",
            "Improved air quality",
            "Reduced carbon footprint"
          ],
          explanation:
            "An idling engine consumes fuel and releases emissions without moving the vehicle."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "Emissions are moderate but may continue throughout the waiting period."
        },

        control: {
          correct:
            "Switch off the engine during prolonged waiting where operationally and safely appropriate.",
          options: [
            "Keep the engine running throughout the waiting period.",
            "Increase engine speed.",
            "Switch off the engine during prolonged waiting where operationally and safely appropriate.",
            "Move the vehicle continuously around the parking area."
          ],
          explanation:
            "Reducing idling conserves fuel and lowers emissions."
        },

        complianceObligation: false,

        awarenessMessage:
          "A stationary vehicle does not need to create continuous emissions. Avoidable idling wastes fuel and affects air quality.",

        learningPoints: [
          "Fuel use is both a resource and GHG aspect.",
          "Driver behaviour affects environmental performance.",
          "Operational exceptions should be managed appropriately."
        ],

        keywords: [
          "vehicle",
          "idling",
          "fuel",
          "air emissions",
          "GHG"
        ]
      },


      {
        id: "parking-oil-leak",
        title: "Oil Leakage from a Parked Vehicle",

        category: "Land Contamination",
        categoryIcon: "🛢️",

        activityMode: "emergency",
        lifecycleStage: "transportation",

        scene: {
          icon: "🛢️",
          image: "",
          alt:
            "A fictional vehicle leaking oil onto the parking surface near a drain.",
          observation:
            "Oil is leaking beneath a parked vehicle and is spreading toward a stormwater drain."
        },

        metrics: {
          water: 40,
          energy: 0,
          waste: 35,
          ghg: 0,
          paper: 0,
          nature: 70
        },

        aspect: {
          correct:
            "Uncontrolled release of vehicle oil",
          options: [
            "Uncontrolled release of vehicle oil",
            "Correct vehicle inspection",
            "Use of a parking line",
            "Routine gate entry"
          ],
          explanation:
            "The aspect is an uncontrolled oil spill."
        },

        impact: {
          correct:
            "Land contamination and potential pollution of stormwater or drainage systems",
          options: [
            "Improved soil quality",
            "Land contamination and potential pollution of stormwater or drainage systems",
            "Reduced environmental risk",
            "Improved water quality"
          ],
          explanation:
            "Oil can contaminate paved surfaces, soil and water systems."
        },

        rating: {
          consequence: 3,
          occurrence: 2,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence can be major, although such releases occur only sometimes."
        },

        control: {
          correct:
            "Stop the spread, protect the drain, report the spill and use the approved spill-response process.",
          options: [
            "Wash the oil into the drain.",
            "Cover the spill with water.",
            "Stop the spread, protect the drain, report the spill and use the approved spill-response process.",
            "Allow vehicles to drive through the spill."
          ],
          explanation:
            "The priority is to prevent migration and manage contaminated absorbent material correctly."
        },

        complianceObligation: true,

        complianceMessage:
          "Oil releases may create land and water pollution and may involve applicable compliance obligations.",

        awarenessMessage:
          "During a spill, preventing the material from reaching a drain is often the most important immediate environmental action.",

        learningPoints: [
          "Spills are emergency environmental aspects.",
          "Drain protection is a priority.",
          "Used absorbent material may require controlled disposal."
        ],

        keywords: [
          "oil spill",
          "vehicle",
          "parking",
          "land contamination",
          "drain"
        ]
      },


      {
        id: "parking-green-area-damage",
        title: "Vehicle Parked on a Green Area",

        category: "Nature and Land Protection",
        categoryIcon: "🌱",

        activityMode: "routine",
        lifecycleStage: "transportation",

        scene: {
          icon: "🌱",
          image: "",
          alt:
            "A fictional vehicle parked partly on a planted green area.",
          observation:
            "A vehicle has been parked outside the designated space and is damaging plants and compacting the soil."
        },

        metrics: {
          water: 0,
          energy: 0,
          waste: 5,
          ghg: 0,
          paper: 0,
          nature: 65
        },

        aspect: {
          correct:
            "Vehicle movement and parking on a planted area",
          options: [
            "Vehicle movement and parking on a planted area",
            "Correct parking within a marked bay",
            "Routine security patrol",
            "Use of a vehicle pass"
          ],
          explanation:
            "The aspect is physical disturbance of the green area."
        },

        impact: {
          correct:
            "Damage to plants, soil compaction and reduction of green-area quality",
          options: [
            "Improved plant growth",
            "Damage to plants, soil compaction and reduction of green-area quality",
            "Improved biodiversity",
            "Reduced land disturbance"
          ],
          explanation:
            "Repeated vehicle pressure can damage roots and alter soil condition."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The impact is moderate and may recur without clear controls."
        },

        control: {
          correct:
            "Move the vehicle to a designated parking space and protect the green boundary from future encroachment.",
          options: [
            "Continue parking on the planted area.",
            "Remove the plants permanently.",
            "Move the vehicle to a designated parking space and protect the green boundary from future encroachment.",
            "Cover the plants with waste."
          ],
          explanation:
            "Defined parking and physical protection preserve planted areas."
        },

        complianceObligation: false,

        awarenessMessage:
          "Green areas are environmental assets, not unused parking space.",

        learningPoints: [
          "Physical damage can be an environmental aspect.",
          "Green areas support biodiversity, shade and visual quality.",
          "Prevention may require both awareness and physical controls."
        ],

        keywords: [
          "parking",
          "green area",
          "plants",
          "soil",
          "nature"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 9: UTILITIES
  ========================================================== */

  {
    id: "utilities",
    name: "Utilities",
    shortName: "Utilities",
    category: "Energy and Resource Zone",
    icon: "⚙️",

    description:
      "Find significant losses involving steam, compressed air, water and equipment operation in a fictional utility area.",

    introduction:
      "Utility losses may be less visible than production waste, but they can have some of the largest impacts on energy, water and GHG performance.",

    estimatedTime: "5 minutes",

    focus: [
      "water",
      "energy",
      "ghg",
      "nature"
    ],

    learningObjectives: [
      "Report steam and compressed-air leaks.",
      "Prevent continuous water loss.",
      "Match equipment operation to actual demand."
    ],

    scenarios: [

      {
        id: "utilities-steam-leak",
        title: "Continuous Steam Leakage",

        category: "Energy, Water and GHG",
        categoryIcon: "♨️",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "♨️",
          image: "",
          alt:
            "A fictional utility pipe releasing steam continuously.",
          observation:
            "Steam is escaping continuously from a pipe connection and condensate is collecting below."
        },

        metrics: {
          water: 45,
          energy: 70,
          waste: 0,
          ghg: 60,
          paper: 0,
          nature: 10
        },

        aspect: {
          correct:
            "Continuous loss of steam and condensate",
          options: [
            "Continuous loss of steam and condensate",
            "Correct utility monitoring",
            "Normal insulation condition",
            "Routine operator attendance"
          ],
          explanation:
            "The aspect is uncontrolled resource and energy loss."
        },

        impact: {
          correct:
            "Water and energy wastage, increased fuel demand and higher GHG emissions",
          options: [
            "Reduced fuel demand",
            "Water and energy wastage, increased fuel demand and higher GHG emissions",
            "Improved boiler efficiency",
            "Reduced environmental impact"
          ],
          explanation:
            "Steam contains treated water and thermal energy created through fuel consumption."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The resource loss is major and continuous."
        },

        control: {
          correct:
            "Report the leak immediately, control the area safely and arrange repair through the approved maintenance process.",
          options: [
            "Ignore the leak because steam is invisible after dispersion.",
            "Increase boiler firing.",
            "Report the leak immediately, control the area safely and arrange repair through the approved maintenance process.",
            "Direct condensate into an uncontrolled drain."
          ],
          explanation:
            "Prompt repair prevents major energy, water and fuel loss."
        },

        complianceObligation: false,

        awarenessMessage:
          "A steam leak wastes water, treatment chemicals, fuel and energy at the same time.",

        learningPoints: [
          "One aspect can create several environmental impacts.",
          "Continuous utility leaks are often significant.",
          "Prompt reporting is essential."
        ],

        keywords: [
          "steam",
          "leak",
          "water",
          "energy",
          "fuel"
        ]
      },


      {
        id: "utilities-water-overflow",
        title: "Water Tank Overflow",

        category: "Water Conservation",
        categoryIcon: "💦",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "💦",
          image: "",
          alt:
            "A fictional water tank overflowing continuously.",
          observation:
            "A water tank continues filling after reaching capacity, and water is flowing across the surrounding surface."
        },

        metrics: {
          water: 75,
          energy: 15,
          waste: 0,
          ghg: 10,
          paper: 0,
          nature: 25
        },

        aspect: {
          correct:
            "Continuous overflow from a water tank",
          options: [
            "Continuous overflow from a water tank",
            "Correct water-level monitoring",
            "Normal tank inspection",
            "Use of an approved water line"
          ],
          explanation:
            "The aspect is uncontrolled water loss."
        },

        impact: {
          correct:
            "Freshwater wastage, pumping-energy loss and possible waterlogging",
          options: [
            "Reduced water consumption",
            "Freshwater wastage, pumping-energy loss and possible waterlogging",
            "Improved tank efficiency",
            "Reduced environmental risk"
          ],
          explanation:
            "Overflow wastes water and the energy used to pump or treat it."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "A major quantity of water may be lost continuously."
        },

        control: {
          correct:
            "Stop or control the inflow, report the malfunction and restore reliable level control.",
          options: [
            "Allow the tank to overflow.",
            "Increase pumping rate.",
            "Stop or control the inflow, report the malfunction and restore reliable level control.",
            "Direct overflow toward electrical equipment."
          ],
          explanation:
            "Immediate flow control stops the loss; permanent level control prevents recurrence."
        },

        complianceObligation: false,

        awarenessMessage:
          "Water overflow is both a direct water loss and an indirect energy loss.",

        learningPoints: [
          "Water conservation includes monitoring and automation reliability.",
          "Immediate and permanent controls are both required.",
          "Overflow can also create secondary safety and infrastructure issues."
        ],

        keywords: [
          "water tank",
          "overflow",
          "level control",
          "pumping",
          "water loss"
        ]
      },


      {
        id: "utilities-idle-pump",
        title: "Pump Running Without Demand",

        category: "Electricity Consumption",
        categoryIcon: "🔄",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🔄",
          image: "",
          alt:
            "A fictional utility pump operating although there is no system demand.",
          observation:
            "A pump is operating continuously even though the connected process currently has no demand."
        },

        metrics: {
          water: 5,
          energy: 65,
          waste: 0,
          ghg: 45,
          paper: 0,
          nature: 5
        },

        aspect: {
          correct:
            "Operation of a utility pump without process demand",
          options: [
            "Operation of a utility pump without process demand",
            "Correct preventive maintenance",
            "Routine pressure monitoring",
            "Normal operator communication"
          ],
          explanation:
            "The aspect is unnecessary electricity consumption by rotating equipment."
        },

        impact: {
          correct:
            "Electricity wastage, unnecessary equipment wear and increased indirect emissions",
          options: [
            "Electricity wastage, unnecessary equipment wear and increased indirect emissions",
            "Reduced electricity demand",
            "Improved pump efficiency",
            "Reduced carbon footprint"
          ],
          explanation:
            "The pump consumes energy and experiences wear without delivering useful service."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The energy demand is major and continuous."
        },

        control: {
          correct:
            "Verify operating requirements and stop or place the pump in approved automatic control when demand is absent.",
          options: [
            "Keep the pump running continuously.",
            "Increase motor speed.",
            "Verify operating requirements and stop or place the pump in approved automatic control when demand is absent.",
            "Disable all protective controls."
          ],
          explanation:
            "Automatic or demand-based operation reduces unnecessary energy use."
        },

        complianceObligation: false,

        awarenessMessage:
          "Utility equipment should respond to actual process demand rather than operate continuously without purpose.",

        learningPoints: [
          "Demand-based control improves energy efficiency.",
          "Energy waste also increases equipment wear.",
          "Automatic control systems should be monitored for effectiveness."
        ],

        keywords: [
          "pump",
          "idle",
          "utility",
          "electricity",
          "automatic control"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 10: WASTE YARD
  ========================================================== */

  {
    id: "waste-yard",
    name: "Waste Yard",
    shortName: "Waste Yard",
    category: "Waste Management Zone",
    icon: "♻️",

    description:
      "Control hazardous waste, waste segregation, labelling and pollution risks in a fictional waste-management area.",

    introduction:
      "The waste yard is the final internal control point before waste leaves the site. Segregation, containment and labelling are essential.",

    estimatedTime: "5 minutes",

    focus: [
      "waste",
      "nature",
      "water"
    ],

    learningObjectives: [
      "Separate hazardous and non-hazardous waste.",
      "Protect drains and soil.",
      "Maintain labels, containment and stable storage."
    ],

    scenarios: [

      {
        id: "waste-yard-hazardous-near-drain",
        title: "Hazardous Waste Stored Near a Drain",

        category: "Hazardous Waste and Water Protection",
        categoryIcon: "☣️",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "☣️",
          image: "",
          alt:
            "A fictional hazardous-waste container stored beside an open drain without containment.",
          observation:
            "A container of contaminated waste is stored beside a drain without secondary containment."
        },

        metrics: {
          water: 60,
          energy: 0,
          waste: 55,
          ghg: 0,
          paper: 0,
          nature: 75
        },

        aspect: {
          correct:
            "Improper storage of hazardous waste near a drain",
          options: [
            "Improper storage of hazardous waste near a drain",
            "Correct hazardous-waste labelling",
            "Use of approved secondary containment",
            "Routine waste inspection"
          ],
          explanation:
            "The aspect is inappropriate hazardous-waste storage."
        },

        impact: {
          correct:
            "Potential soil, drain and water contamination from leakage or spill",
          options: [
            "Improved water quality",
            "Potential soil, drain and water contamination from leakage or spill",
            "Reduced environmental risk",
            "Improved waste recovery"
          ],
          explanation:
            "A damaged container could release contamination directly into the drainage system."
        },

        rating: {
          consequence: 4,
          occurrence: 3,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The possible consequence is severe and exposure may occur intermittently."
        },

        control: {
          correct:
            "Move the container to the designated labelled area with compatible secondary containment and drain protection.",
          options: [
            "Leave the container beside the drain.",
            "Open the container to reduce pressure.",
            "Move the container to the designated labelled area with compatible secondary containment and drain protection.",
            "Mix the contents with general waste."
          ],
          explanation:
            "Containment and separation prevent uncontrolled releases."
        },

        complianceObligation: true,

        complianceMessage:
          "Hazardous-waste storage and disposal may be subject to applicable environmental compliance obligations.",

        awarenessMessage:
          "Hazardous waste requires control from the point of generation until final approved disposal.",

        learningPoints: [
          "Hazardous waste near a drain is a significant environmental risk.",
          "Secondary containment limits spill migration.",
          "Compatibility and clear labelling are essential."
        ],

        keywords: [
          "hazardous waste",
          "drain",
          "containment",
          "pollution",
          "waste yard"
        ]
      },


      {
        id: "waste-yard-mixed-waste",
        title: "Mixed Waste in an Unlabelled Container",

        category: "Segregation and Labelling",
        categoryIcon: "🗑️",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🗑️",
          image: "",
          alt:
            "A fictional unlabelled container holding cardboard, food waste and contaminated gloves.",
          observation:
            "Cardboard, food waste and potentially contaminated gloves have been placed together in an unlabelled container."
        },

        metrics: {
          water: 5,
          energy: 0,
          waste: 65,
          ghg: 5,
          paper: 10,
          nature: 30
        },

        aspect: {
          correct:
            "Mixing incompatible waste categories in an unlabelled container",
          options: [
            "Mixing incompatible waste categories in an unlabelled container",
            "Correct waste segregation",
            "Use of visible labels",
            "Routine housekeeping"
          ],
          explanation:
            "The aspect is incorrect segregation and absence of identification."
        },

        impact: {
          correct:
            "Cross-contamination, loss of recyclable value and unsafe disposal decisions",
          options: [
            "Improved recycling",
            "Cross-contamination, loss of recyclable value and unsafe disposal decisions",
            "Reduced waste volume automatically",
            "Improved waste traceability"
          ],
          explanation:
            "Without segregation and labels, waste may be handled or disposed of incorrectly."
        },

        rating: {
          consequence: 3,
          occurrence: 3,
          score: 9,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The potential impact is major and may occur intermittently."
        },

        control: {
          correct:
            "Stop adding waste, identify the contents safely, segregate into approved categories and apply clear labels.",
          options: [
            "Continue filling the mixed container.",
            "Remove all labels from nearby containers.",
            "Stop adding waste, identify the contents safely, segregate into approved categories and apply clear labels.",
            "Burn the mixed waste."
          ],
          explanation:
            "Waste must be identifiable and segregated to support safe storage and disposal."
        },

        complianceObligation: true,

        complianceMessage:
          "Incorrect hazardous or contaminated-waste segregation may involve legal and other compliance requirements.",

        awarenessMessage:
          "A label is not decoration—it communicates what the waste is, how it should be handled and where it should go.",

        learningPoints: [
          "Waste identity determines handling and disposal.",
          "Contamination can eliminate recycling opportunities.",
          "Segregation should begin at the original point of generation."
        ],

        keywords: [
          "mixed waste",
          "labelling",
          "segregation",
          "recycling",
          "contamination"
        ]
      },


      {
        id: "waste-yard-open-burning",
        title: "Open Burning of Waste",

        category: "Air Emissions",
        categoryIcon: "🔥",

        activityMode: "emergency",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🔥",
          image: "",
          alt:
            "A fictional waste area where waste is being openly burned.",
          observation:
            "Smoke is rising from waste being openly burned to reduce its volume."
        },

        metrics: {
          water: 5,
          energy: 0,
          waste: 45,
          ghg: 55,
          paper: 0,
          nature: 80
        },

        aspect: {
          correct:
            "Open burning of waste",
          options: [
            "Open burning of waste",
            "Approved waste recycling",
            "Correct use of waste containers",
            "Routine waste inspection"
          ],
          explanation:
            "The aspect is uncontrolled combustion of waste."
        },

        impact: {
          correct:
            "Air pollution, GHG emissions, toxic smoke and potential harm to people and the environment",
          options: [
            "Improved air quality",
            "Air pollution, GHG emissions, toxic smoke and potential harm to people and the environment",
            "Reduced environmental impact",
            "Improved recycling performance"
          ],
          explanation:
            "Burning mixed waste can release harmful smoke and destroy recoverable material."
        },

        rating: {
          consequence: 4,
          occurrence: 3,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The possible environmental and health consequence is severe."
        },

        control: {
          correct:
            "Stop the activity safely, report it immediately and manage the waste through an approved recovery or disposal route.",
          options: [
            "Add more waste to complete the fire.",
            "Move the burning waste closer to buildings.",
            "Stop the activity safely, report it immediately and manage the waste through an approved recovery or disposal route.",
            "Cover the smoke with plastic."
          ],
          explanation:
            "Waste must be managed through approved disposal or recovery methods."
        },

        complianceObligation: true,

        complianceMessage:
          "Open burning may breach applicable environmental and air-emission requirements.",

        awarenessMessage:
          "Waste does not disappear when burned. It is transformed into smoke, emissions and contaminated residue.",

        learningPoints: [
          "Open burning is both an air-emission and compliance issue.",
          "Burning can release toxic substances.",
          "Approved waste routes must be used."
        ],

        keywords: [
          "open burning",
          "air emissions",
          "waste",
          "smoke",
          "compliance"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 11: WASHROOMS
  ========================================================== */

  {
    id: "washrooms",
    name: "Washrooms",
    shortName: "Washrooms",
    category: "Water-Use Zone",
    icon: "🚻",

    description:
      "Find and control tap leakage, faulty flushing and unnecessary tissue consumption in a fictional washroom.",

    introduction:
      "Washrooms contain many small water-use points. Undetected leaks can create continuous loss throughout the day.",

    estimatedTime: "4–5 minutes",

    focus: [
      "water",
      "paper",
      "waste"
    ],

    learningObjectives: [
      "Report tap and flush leakage.",
      "Prevent continuous water loss.",
      "Use tissue responsibly."
    ],

    scenarios: [

      {
        id: "washroom-leaking-tap",
        title: "Continuous Tap Leakage",

        category: "Water Conservation",
        categoryIcon: "🚰",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🚰",
          image: "",
          alt:
            "A fictional washroom tap dripping continuously.",
          observation:
            "A tap continues to drip after being closed, and no maintenance report has been raised."
        },

        metrics: {
          water: 70,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Continuous leakage from a washroom tap",
          options: [
            "Continuous leakage from a washroom tap",
            "Correct handwashing",
            "Routine washroom cleaning",
            "Use of a mirror"
          ],
          explanation:
            "The aspect is uncontrolled water loss."
        },

        impact: {
          correct:
            "Continuous freshwater wastage and avoidable demand on water supply",
          options: [
            "Continuous freshwater wastage and avoidable demand on water supply",
            "Reduced water consumption",
            "Improved water availability",
            "Reduced utility cost"
          ],
          explanation:
            "A small drip can continue all day and accumulate into substantial water loss."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence is moderate but the leakage is continuous."
        },

        control: {
          correct:
            "Report the leaking tap immediately and arrange repair while preventing unnecessary flow where practicable.",
          options: [
            "Ignore the drip.",
            "Open the tap fully.",
            "Report the leaking tap immediately and arrange repair while preventing unnecessary flow where practicable.",
            "Place tissue under the tap."
          ],
          explanation:
            "Timely reporting allows the loss to be stopped."
        },

        complianceObligation: false,

        awarenessMessage:
          "A leak becomes expensive because it does not take breaks. It continues every minute until repaired.",

        learningPoints: [
          "Continuous occurrence increases environmental significance.",
          "Every employee can report resource loss.",
          "Small defects should not be normalized."
        ],

        keywords: [
          "tap",
          "leak",
          "washroom",
          "water",
          "reporting"
        ]
      },


      {
        id: "washroom-faulty-flush",
        title: "Faulty Flush Running Continuously",

        category: "Water Loss",
        categoryIcon: "💧",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "💧",
          image: "",
          alt:
            "A fictional toilet flush continuing to release water after use.",
          observation:
            "The flush valve has not closed correctly, and water continues flowing into the fixture."
        },

        metrics: {
          water: 75,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 20
        },

        aspect: {
          correct:
            "Continuous water discharge from a faulty flush system",
          options: [
            "Continuous water discharge from a faulty flush system",
            "Correct use of the washroom",
            "Routine handwashing",
            "Use of cleaning material"
          ],
          explanation:
            "The aspect is continuous uncontrolled water consumption."
        },

        impact: {
          correct:
            "Major cumulative water loss and increased wastewater generation",
          options: [
            "Major cumulative water loss and increased wastewater generation",
            "Reduced water use",
            "Improved flush performance",
            "Reduced wastewater volume"
          ],
          explanation:
            "A faulty flush can release a much larger continuous flow than a dripping tap."
        },

        rating: {
          consequence: 3,
          occurrence: 4,
          score: 12,
          level: "High",
          classification: "Significant",
          rationale:
            "The water loss can be major and continuous."
        },

        control: {
          correct:
            "Report and isolate or control the flow where authorized, then arrange prompt repair.",
          options: [
            "Leave the flush running.",
            "Use the fixture repeatedly.",
            "Report and isolate or control the flow where authorized, then arrange prompt repair.",
            "Block the overflow path."
          ],
          explanation:
            "Immediate control stops the loss while permanent repair prevents recurrence."
        },

        complianceObligation: false,

        awarenessMessage:
          "A continuously running flush can waste a substantial quantity of water before anyone notices.",

        learningPoints: [
          "Not all water leaks are visually obvious.",
          "High-flow defects require prompt action.",
          "Reporting and repair data can support water-conservation monitoring."
        ],

        keywords: [
          "flush",
          "water loss",
          "washroom",
          "leak",
          "repair"
        ]
      },


      {
        id: "washroom-tissue-waste",
        title: "Excessive Tissue Consumption",

        category: "Paper and Waste",
        categoryIcon: "🧻",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🧻",
          image: "",
          alt:
            "A fictional washroom bin filled with excessive unused tissue.",
          observation:
            "Large quantities of unused or lightly used tissue are being discarded."
        },

        metrics: {
          water: 5,
          energy: 5,
          waste: 40,
          ghg: 5,
          paper: 55,
          nature: 25
        },

        aspect: {
          correct:
            "Excessive consumption and disposal of tissue paper",
          options: [
            "Excessive consumption and disposal of tissue paper",
            "Correct hand hygiene",
            "Use of a waste bin",
            "Routine washroom inspection"
          ],
          explanation:
            "The aspect is unnecessary paper consumption."
        },

        impact: {
          correct:
            "Increased paper consumption, waste generation and lifecycle resource demand",
          options: [
            "Reduced paper consumption",
            "Increased paper consumption, waste generation and lifecycle resource demand",
            "Improved forest conservation",
            "Reduced disposal requirement"
          ],
          explanation:
            "Paper products require raw materials, energy and water during production."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The individual consequence is moderate but use occurs continuously."
        },

        control: {
          correct:
            "Use only the quantity required and maintain suitable dispensing controls and awareness.",
          options: [
            "Use as much tissue as possible.",
            "Use only the quantity required and maintain suitable dispensing controls and awareness.",
            "Place unused tissue in the sink.",
            "Burn used tissue in the washroom."
          ],
          explanation:
            "Responsible use and suitable dispensers help prevent unnecessary consumption."
        },

        complianceObligation: false,

        awarenessMessage:
          "Responsible paper use applies to every paper product, not only office printing.",

        learningPoints: [
          "Paper reduction includes tissue consumption.",
          "Dispensing design can support behaviour change.",
          "Waste prevention should not compromise hygiene."
        ],

        keywords: [
          "tissue",
          "paper",
          "washroom",
          "waste",
          "consumption"
        ]
      }

    ]
  },


  /* ==========================================================
     AREA 12: GREEN AREA
  ========================================================== */

  {
    id: "green-area",
    name: "Green Area",
    shortName: "Green Area",
    category: "Nature Conservation Zone",
    icon: "🌳",

    description:
      "Restore a fictional green area by preventing litter, controlling water use and protecting plants and biodiversity.",

    introduction:
      "Green areas support shade, soil quality, visual wellbeing and biodiversity. They require protection and responsible maintenance.",

    estimatedTime: "4–5 minutes",

    focus: [
      "nature",
      "water",
      "waste"
    ],

    learningObjectives: [
      "Prevent littering.",
      "Use controlled watering.",
      "Protect trees, plants and soil."
    ],

    scenarios: [

      {
        id: "green-area-plastic-litter",
        title: "Plastic Litter Around Trees",

        category: "Nature and Waste",
        categoryIcon: "🌳",

        activityMode: "routine",
        lifecycleStage: "endOfLife",

        scene: {
          icon: "🌳",
          image: "",
          alt:
            "A fictional green area with plastic bottles and wrappers around trees.",
          observation:
            "Plastic bottles, wrappers and disposable cups have been left around trees and planted areas."
        },

        metrics: {
          water: 5,
          energy: 0,
          waste: 55,
          ghg: 5,
          paper: 5,
          nature: 65
        },

        aspect: {
          correct:
            "Littering and uncontrolled disposal of waste in a green area",
          options: [
            "Littering and uncontrolled disposal of waste in a green area",
            "Correct waste collection",
            "Tree maintenance",
            "Use of designated pathways"
          ],
          explanation:
            "The aspect is uncontrolled waste disposal."
        },

        impact: {
          correct:
            "Soil and visual pollution, harm to wildlife and degradation of the green area",
          options: [
            "Improved biodiversity",
            "Soil and visual pollution, harm to wildlife and degradation of the green area",
            "Improved plant growth",
            "Reduced waste generation"
          ],
          explanation:
            "Litter can persist in the environment and affect animals, drainage and soil quality."
        },

        rating: {
          consequence: 2,
          occurrence: 3,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The impact is moderate and littering may recur."
        },

        control: {
          correct:
            "Collect and segregate the waste, maintain suitable bins and reinforce no-littering behaviour.",
          options: [
            "Hide the waste under plants.",
            "Burn the waste beside the trees.",
            "Collect and segregate the waste, maintain suitable bins and reinforce no-littering behaviour.",
            "Push the waste into a drain."
          ],
          explanation:
            "Removal addresses the immediate issue, while bins and awareness prevent recurrence."
        },

        complianceObligation: false,

        awarenessMessage:
          "Nature conservation begins with keeping natural and planted areas free from waste.",

        learningPoints: [
          "Litter can harm land, water and wildlife.",
          "Correct bin availability supports behaviour.",
          "Green areas require shared ownership."
        ],

        keywords: [
          "litter",
          "plastic",
          "trees",
          "green area",
          "nature"
        ]
      },


      {
        id: "green-area-overwatering",
        title: "Uncontrolled Watering of Plants",

        category: "Water and Nature",
        categoryIcon: "🌿",

        activityMode: "routine",
        lifecycleStage: "support",

        scene: {
          icon: "🌿",
          image: "",
          alt:
            "A fictional green area being overwatered with water flowing onto pavement.",
          observation:
            "A hose is watering the same area continuously, and water is flowing away from the plants onto the pavement."
        },

        metrics: {
          water: 65,
          energy: 5,
          waste: 0,
          ghg: 5,
          paper: 0,
          nature: 30
        },

        aspect: {
          correct:
            "Excessive and uncontrolled irrigation",
          options: [
            "Excessive and uncontrolled irrigation",
            "Use of suitable plants",
            "Correct soil maintenance",
            "Routine inspection of trees"
          ],
          explanation:
            "The aspect is excessive water consumption during irrigation."
        },

        impact: {
          correct:
            "Water wastage, soil waterlogging and inefficient plant maintenance",
          options: [
            "Water wastage, soil waterlogging and inefficient plant maintenance",
            "Reduced water consumption",
            "Improved irrigation efficiency",
            "Reduced soil disturbance"
          ],
          explanation:
            "More water does not always mean healthier plants. Excess can be wasted or damage soil conditions."
        },

        rating: {
          consequence: 2,
          occurrence: 4,
          score: 8,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The consequence is moderate and watering may continue for an extended period."
        },

        control: {
          correct:
            "Use scheduled, controlled watering based on plant and soil needs and prevent runoff.",
          options: [
            "Leave the hose running continuously.",
            "Water paved areas.",
            "Use scheduled, controlled watering based on plant and soil needs and prevent runoff.",
            "Increase water pressure."
          ],
          explanation:
            "Planned irrigation supports plant health while conserving water."
        },

        complianceObligation: false,

        awarenessMessage:
          "Effective watering delivers the right amount of water to the plant—not the largest possible amount.",

        learningPoints: [
          "Nature protection and water conservation should work together.",
          "Irrigation should respond to actual plant and soil needs.",
          "Runoff is evidence that water is not being used effectively."
        ],

        keywords: [
          "irrigation",
          "watering",
          "plants",
          "water",
          "runoff"
        ]
      },


      {
        id: "green-area-tree-damage",
        title: "Materials Stored Against a Tree",

        category: "Biodiversity and Plant Protection",
        categoryIcon: "🌲",

        activityMode: "nonRoutine",
        lifecycleStage: "storage",

        scene: {
          icon: "🌲",
          image: "",
          alt:
            "A fictional green area where heavy material is stored against a tree.",
          observation:
            "Temporary materials have been stacked against a tree, damaging the bark and compacting soil around the roots."
        },

        metrics: {
          water: 0,
          energy: 0,
          waste: 10,
          ghg: 0,
          paper: 0,
          nature: 70
        },

        aspect: {
          correct:
            "Improper storage of material within the tree-protection area",
          options: [
            "Improper storage of material within the tree-protection area",
            "Correct storage in a designated area",
            "Routine tree inspection",
            "Use of a walkway"
          ],
          explanation:
            "The aspect is physical disturbance caused by inappropriate storage."
        },

        impact: {
          correct:
            "Damage to bark and roots, soil compaction and possible loss of the tree",
          options: [
            "Improved tree health",
            "Damage to bark and roots, soil compaction and possible loss of the tree",
            "Improved soil aeration",
            "Reduced disturbance"
          ],
          explanation:
            "Trees can be damaged by pressure, impact and compaction even when branches remain intact."
        },

        rating: {
          consequence: 3,
          occurrence: 2,
          score: 6,
          level: "Medium",
          classification: "Tolerable",
          rationale:
            "The potential impact is major but temporary storage occurs only sometimes."
        },

        control: {
          correct:
            "Move the material to an approved storage area and maintain a protected clearance around trees and planted zones.",
          options: [
            "Add more material against the tree.",
            "Remove the tree.",
            "Move the material to an approved storage area and maintain a protected clearance around trees and planted zones.",
            "Cover the damaged bark with waste."
          ],
          explanation:
            "Defined storage and protected boundaries prevent physical damage."
        },

        complianceObligation: false,

        awarenessMessage:
          "Trees can be damaged from the ground up. Root zones and surrounding soil require protection as well as branches and trunks.",

        learningPoints: [
          "Non-routine storage can create environmental aspects.",
          "Tree roots may extend beyond the visible trunk area.",
          "Physical boundaries help protect green assets."
        ],

        keywords: [
          "tree",
          "storage",
          "roots",
          "soil compaction",
          "nature"
        ]
      }

    ]
  }

];


/* ============================================================
   8. PERSONAL COMMITMENTS
============================================================ */

const EBM_ENVIRONMENTAL_COMMITMENTS = [
  {
    id: "commitment-report-water-leaks",
    metric: "water",
    icon: "💧",
    title:
      "Report water leakage immediately",
    description:
      "Report leaking taps, pipes, tanks, flush systems and overflow without delay."
  },

  {
    id: "commitment-controlled-cleaning",
    metric: "water",
    icon: "🚿",
    title:
      "Use water carefully during cleaning",
    description:
      "Close hoses when not in use and follow approved controlled-cleaning methods."
  },

  {
    id: "commitment-energy-switch-off",
    metric: "energy",
    icon: "⚡",
    title:
      "Switch off unnecessary equipment",
    description:
      "Use approved standby or shutdown practices when equipment is not required."
  },

  {
    id: "commitment-report-utility-leaks",
    metric: "energy",
    icon: "🔧",
    title:
      "Report compressed-air and steam leaks",
    description:
      "Raise timely reports for utility losses and support prompt repair."
  },

  {
    id: "commitment-waste-segregation",
    metric: "waste",
    icon: "♻️",
    title:
      "Segregate waste correctly",
    description:
      "Use the approved waste category and labelled container at the point of generation."
  },

  {
    id: "commitment-reduce-paper",
    metric: "paper",
    icon: "📄",
    title:
      "Reduce unnecessary printing",
    description:
      "Review digitally and use double-sided printing where appropriate."
  },

  {
    id: "commitment-no-idling",
    metric: "ghg",
    icon: "🚗",
    title:
      "Avoid unnecessary vehicle idling",
    description:
      "Switch off engines during prolonged waiting where safe and operationally appropriate."
  },

  {
    id: "commitment-protect-green-areas",
    metric: "nature",
    icon: "🌳",
    title:
      "Protect trees and green areas",
    description:
      "Prevent littering, vehicle encroachment, uncontrolled storage and damage."
  },

  {
    id: "commitment-protect-drains",
    metric: "nature",
    icon: "🧪",
    title:
      "Protect drains from contamination",
    description:
      "Never dispose of chemicals, oil, product waste or other pollutants into drains."
  },

  {
    id: "commitment-prevent-food-waste",
    metric: "waste",
    icon: "🍽️",
    title:
      "Prevent avoidable food waste",
    description:
      "Take an appropriate food portion and segregate unavoidable food waste correctly."
  },

  {
    id: "commitment-use-reusables",
    metric: "waste",
    icon: "☕",
    title:
      "Use reusable items",
    description:
      "Choose reusable cups, bottles, plates and containers where practicable."
  },

  {
    id: "commitment-report-environmental-issues",
    metric: "nature",
    icon: "📢",
    title:
      "Report environmental issues",
    description:
      "Report spills, leaks, waste issues and pollution risks through the approved reporting process."
  }
];


/* ============================================================
   9. FINAL RESULT LEVELS
============================================================ */

const EBM_RESULT_LEVELS = [
  {
    minimum: 0,
    maximum: 49,
    level: "Eco Learner",
    icon: "🌱",
    description:
      "You have started your environmental awareness journey. Review the learning messages and replay the missions to improve your understanding."
  },

  {
    minimum: 50,
    maximum: 69,
    level: "Eco Supporter",
    icon: "🌿",
    description:
      "You understand several important environmental practices. Continue improving how you identify impacts and select controls."
  },

  {
    minimum: 70,
    maximum: 84,
    level: "Eco Champion",
    icon: "🌳",
    description:
      "You demonstrated strong environmental awareness across EBM work areas and selected effective controls in most situations."
  },

  {
    minimum: 85,
    maximum: 100,
    level: "Eco Guardian",
    icon: "🌍",
    description:
      "You demonstrated excellent understanding of environmental aspects, impacts, significance and operational controls."
  }
];


/* ============================================================
   10. CAMPAIGN AWARENESS MESSAGES
============================================================ */

const EBM_AWARENESS_MESSAGES = [
  {
    metric: "water",
    icon: "💧",
    message:
      "Every leak continues until someone reports it."
  },

  {
    metric: "energy",
    icon: "⚡",
    message:
      "Energy used without purpose creates cost and environmental impact without value."
  },

  {
    metric: "waste",
    icon: "♻️",
    message:
      "The best waste is the waste that is never generated."
  },

  {
    metric: "ghg",
    icon: "☁️",
    message:
      "Fuel and electricity decisions influence greenhouse-gas emissions."
  },

  {
    metric: "paper",
    icon: "📄",
    message:
      "Paper carries a water, energy and natural-resource footprint."
  },

  {
    metric: "nature",
    icon: "🌳",
    message:
      "Nature conservation begins with everyday decisions in every work area."
  }
];


/* ============================================================
   11. UTILITY FUNCTIONS AVAILABLE TO SCRIPT.JS
============================================================ */

/**
 * Returns an area object using its ID.
 *
 * @param {string} areaId
 * @returns {object|null}
 */
function getEBMAreaById(areaId) {
  if (typeof areaId !== "string") {
    return null;
  }

  return (
    EBM_GAME_AREAS.find(
      (area) => area.id === areaId
    ) || null
  );
}


/**
 * Returns a scenario object using the area and scenario IDs.
 *
 * @param {string} areaId
 * @param {string} scenarioId
 * @returns {object|null}
 */
function getEBMScenarioById(areaId, scenarioId) {
  const area = getEBMAreaById(areaId);

  if (!area || typeof scenarioId !== "string") {
    return null;
  }

  return (
    area.scenarios.find(
      (scenario) => scenario.id === scenarioId
    ) || null
  );
}


/**
 * Returns the total number of areas.
 *
 * @returns {number}
 */
function getEBMTotalAreaCount() {
  return EBM_GAME_AREAS.length;
}


/**
 * Returns the total number of scenarios across all areas.
 *
 * @returns {number}
 */
function getEBMTotalScenarioCount() {
  return EBM_GAME_AREAS.reduce(
    (total, area) => total + area.scenarios.length,
    0
  );
}


/**
 * Calculates the impact rating.
 *
 * @param {number} consequence
 * @param {number} occurrence
 * @returns {number}
 */
function calculateEBMImpactRating(
  consequence,
  occurrence
) {
  const consequenceValue = Number(consequence);
  const occurrenceValue = Number(occurrence);

  if (
    !Number.isInteger(consequenceValue) ||
    !Number.isInteger(occurrenceValue) ||
    consequenceValue < 1 ||
    consequenceValue > 4 ||
    occurrenceValue < 1 ||
    occurrenceValue > 4
  ) {
    throw new Error(
      "Consequence and occurrence must be whole numbers from 1 to 4."
    );
  }

  return consequenceValue * occurrenceValue;
}


/**
 * Returns the impact category for a rating.
 *
 * Valid matrix results include:
 * 1, 2, 3, 4, 6, 8, 9, 12 and 16.
 *
 * @param {number} score
 * @returns {object}
 */
function getEBMImpactCategory(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    throw new Error(
      "Impact score must be a valid number."
    );
  }

  if (numericScore >= 12) {
    return EBM_IMPACT_CATEGORIES.find(
      (category) => category.level === "High"
    );
  }

  if (numericScore >= 6) {
    return EBM_IMPACT_CATEGORIES.find(
      (category) => category.level === "Medium"
    );
  }

  return EBM_IMPACT_CATEGORIES.find(
    (category) => category.level === "Low"
  );
}


/**
 * Returns the result level for a final percentage.
 *
 * @param {number} percentage
 * @returns {object}
 */
function getEBMResultLevel(percentage) {
  const safePercentage = Math.max(
    0,
    Math.min(100, Number(percentage) || 0)
  );

  return (
    EBM_RESULT_LEVELS.find(
      (result) =>
        safePercentage >= result.minimum &&
        safePercentage <= result.maximum
    ) || EBM_RESULT_LEVELS[0]
  );
}


/**
 * Returns all scenarios as a flat array.
 *
 * @returns {Array<object>}
 */
function getAllEBMScenarios() {
  return EBM_GAME_AREAS.flatMap(
    (area) =>
      area.scenarios.map(
        (scenario) => ({
          ...scenario,
          areaId: area.id,
          areaName: area.name
        })
      )
  );
}


/**
 * Returns scenarios linked with a selected environmental metric.
 *
 * @param {string} metric
 * @returns {Array<object>}
 */
function getEBMScenariosByMetric(metric) {
  if (
    typeof metric !== "string" ||
    !EBM_GAME_CONFIG.metrics.includes(metric)
  ) {
    return [];
  }

  return getAllEBMScenarios().filter(
    (scenario) =>
      Number(scenario.metrics?.[metric] || 0) > 0
  );
}


/**
 * Returns scenarios with compliance obligations.
 *
 * @returns {Array<object>}
 */
function getEBMComplianceScenarios() {
  return getAllEBMScenarios().filter(
    (scenario) =>
      scenario.complianceObligation === true
  );
}


/**
 * Returns a randomized copy of an option array.
 *
 * @param {Array<string>} options
 * @returns {Array<string>}
 */
function shuffleEBMOptions(options) {
  if (!Array.isArray(options)) {
    return [];
  }

  const shuffled = [...options];

  for (
    let currentIndex = shuffled.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (currentIndex + 1)
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


/**
 * Validates the major data structure.
 *
 * This is useful during development.
 *
 * @returns {{valid: boolean, errors: Array<string>}}
 */
function validateEBMGameData() {
  const errors = [];
  const areaIds = new Set();
  const scenarioIds = new Set();

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
        area.scenarios.length === 0
      ) {
        errors.push(
          `Area ${area.id} does not contain scenarios.`
        );

        return;
      }

      area.scenarios.forEach(
        (scenario, scenarioIndex) => {
          if (!scenario.id) {
            errors.push(
              `Scenario ${scenarioIndex} in ${area.id} does not have an ID.`
            );
          }

          if (scenarioIds.has(scenario.id)) {
            errors.push(
              `Duplicate scenario ID found: ${scenario.id}`
            );
          }

          scenarioIds.add(scenario.id);

          const calculatedScore =
            Number(scenario.rating.consequence) *
            Number(scenario.rating.occurrence);

          if (
            calculatedScore !==
            Number(scenario.rating.score)
          ) {
            errors.push(
              `Rating mismatch in ${scenario.id}. Expected ${calculatedScore}, found ${scenario.rating.score}.`
            );
          }

          const expectedCategory =
            getEBMImpactCategory(calculatedScore);

          if (
            expectedCategory.level !==
            scenario.rating.level
          ) {
            errors.push(
              `Impact level mismatch in ${scenario.id}. Expected ${expectedCategory.level}, found ${scenario.rating.level}.`
            );
          }

          if (
            !scenario.aspect.options.includes(
              scenario.aspect.correct
            )
          ) {
            errors.push(
              `Correct aspect is missing from options in ${scenario.id}.`
            );
          }

          if (
            !scenario.impact.options.includes(
              scenario.impact.correct
            )
          ) {
            errors.push(
              `Correct impact is missing from options in ${scenario.id}.`
            );
          }

          if (
            !scenario.control.options.includes(
              scenario.control.correct
            )
          ) {
            errors.push(
              `Correct control is missing from options in ${scenario.id}.`
            );
          }
        }
      );
    }
  );

  return {
    valid: errors.length === 0,
    errors
  };
}


/* ============================================================
   12. MAIN GAME DATA OBJECT
============================================================ */

const EBM_GAME_DATA = {
  config: EBM_GAME_CONFIG,

  definitions: EBM_ENVIRONMENTAL_DEFINITIONS,

  focusAreas: EBM_FOCUS_AREAS,

  activityModes: EBM_ACTIVITY_MODES,

  lifecycleStages: EBM_LIFECYCLE_STAGES,

  impactLevels: EBM_IMPACT_LEVELS,

  occurrenceLevels: EBM_OCCURRENCE_LEVELS,

  impactCategories: EBM_IMPACT_CATEGORIES,

  areas: EBM_GAME_AREAS,

  commitments: EBM_ENVIRONMENTAL_COMMITMENTS,

  resultLevels: EBM_RESULT_LEVELS,

  awarenessMessages: EBM_AWARENESS_MESSAGES
};


/* ============================================================
   13. EXPOSE DATA TO THE BROWSER

   This allows script.js to access:
   window.EBM_GAME_DATA
   window.getEBMAreaById(...)
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

  window.shuffleEBMOptions =
    shuffleEBMOptions;

  window.validateEBMGameData =
    validateEBMGameData;
}


/* ============================================================
   14. DEVELOPMENT VALIDATION

   Open the browser developer console.
   This validation confirms whether:
   - IDs are unique.
   - Correct answers exist in the options.
   - Rating calculations are correct.
   - Impact categories match the scores.
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
    `EBM Eco Rescue data loaded successfully: ${getEBMTotalAreaCount()} areas and ${getEBMTotalScenarioCount()} scenarios.`
  );
}