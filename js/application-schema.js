window.applicationSections = [
  {
    "title": "Member information",
    "note": "",
    "fields": [
      {
        "name": "membershipType",
        "label": "Membership type",
        "page": 3,
        "x": 193,
        "y": 633,
        "width": 160,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "choices": [
          "Firefighter",
          "Rehab",
          "Other"
        ]
      },
      {
        "name": "membershipOther",
        "label": "Other membership type (if applicable)",
        "page": 3,
        "x": 364,
        "y": 633,
        "width": 190,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "lastName",
        "label": "Last name",
        "page": 3,
        "x": 55,
        "y": 577,
        "width": 210,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "autocomplete": "family-name"
      },
      {
        "name": "firstName",
        "label": "First name",
        "page": 3,
        "x": 275,
        "y": 577,
        "width": 144,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "autocomplete": "given-name"
      },
      {
        "name": "middleName",
        "label": "Middle name",
        "page": 3,
        "x": 429,
        "y": 577,
        "width": 125,
        "height": 13,
        "maxLength": 100,
        "autocomplete": "additional-name"
      },
      {
        "name": "birthDate",
        "label": "Date of birth",
        "page": 3,
        "x": 55,
        "y": 550,
        "width": 210,
        "height": 13,
        "maxLength": 100,
        "type": "date",
        "required": true
      },
      {
        "name": "ssnLastFour",
        "label": "Last four digits of SSN",
        "page": 3,
        "x": 275,
        "y": 551,
        "width": 144,
        "height": 13,
        "maxLength": 4,
        "required": true,
        "pattern": "[0-9]{4}",
        "inputmode": "numeric"
      },
      {
        "name": "driverLicense",
        "label": "Texas driver license number",
        "page": 3,
        "x": 53,
        "y": 525,
        "width": 210,
        "height": 13,
        "maxLength": 30,
        "required": true
      },
      {
        "name": "licenseClass",
        "label": "Driver license class",
        "page": 3,
        "x": 320,
        "y": 529,
        "width": 99,
        "height": 13,
        "maxLength": 10,
        "required": true
      },
      {
        "name": "endorsements",
        "label": "Endorsements / restrictions (or N/A)",
        "page": 3,
        "x": 429,
        "y": 525,
        "width": 125,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "phone",
        "label": "Cell phone",
        "page": 3,
        "x": 55,
        "y": 492,
        "width": 210,
        "height": 13,
        "maxLength": 40,
        "type": "tel",
        "required": true,
        "autocomplete": "tel"
      },
      {
        "name": "email",
        "label": "Email",
        "page": 3,
        "x": 275,
        "y": 498,
        "width": 279,
        "height": 13,
        "maxLength": 254,
        "type": "email",
        "required": true,
        "autocomplete": "email"
      },
      {
        "name": "street",
        "label": "Street address",
        "page": 3,
        "x": 53,
        "y": 460,
        "width": 210,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "autocomplete": "street-address"
      },
      {
        "name": "city",
        "label": "City",
        "page": 3,
        "x": 275,
        "y": 460,
        "width": 144,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "autocomplete": "address-level2"
      },
      {
        "name": "state",
        "label": "State",
        "page": 3,
        "x": 459,
        "y": 465,
        "width": 25,
        "height": 13,
        "maxLength": 2,
        "required": true,
        "autocomplete": "address-level1"
      },
      {
        "name": "zip",
        "label": "ZIP code",
        "page": 3,
        "x": 508,
        "y": 465,
        "width": 46,
        "height": 13,
        "maxLength": 10,
        "required": true,
        "pattern": "[0-9]{5}(-[0-9]{4})?",
        "autocomplete": "postal-code"
      },
      {
        "name": "licenseMatches",
        "label": "Does your residence match your driver license?",
        "page": 3,
        "x": 211,
        "y": 444,
        "width": 52,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "choices": [
          "Yes",
          "No"
        ]
      },
      {
        "name": "licenseAddress",
        "label": "If no, driver license address, state and ZIP",
        "page": 3,
        "x": 389,
        "y": 444,
        "width": 165,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "employer",
        "label": "Employer (or N/A)",
        "page": 3,
        "x": 53,
        "y": 407,
        "width": 210,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "occupation",
        "label": "Occupation / position (or N/A)",
        "page": 3,
        "x": 275,
        "y": 401,
        "width": 144,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "workPhone",
        "label": "Work phone (if applicable)",
        "page": 3,
        "x": 429,
        "y": 401,
        "width": 125,
        "height": 13,
        "maxLength": 40,
        "type": "tel"
      },
      {
        "name": "workSchedule",
        "label": "Typical work schedule (or N/A)",
        "page": 3,
        "x": 53,
        "y": 367,
        "width": 355,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "transportation",
        "label": "Reliable transportation?",
        "page": 3,
        "x": 465,
        "y": 366,
        "width": 89,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "choices": [
          "Yes",
          "No"
        ]
      }
    ]
  },
  {
    "title": "Membership information",
    "note": "",
    "fields": [
      {
        "name": "heardFrom",
        "label": "How did you hear about us?",
        "page": 3,
        "x": 180,
        "y": 310,
        "width": 374,
        "height": 13,
        "maxLength": 100,
        "required": true,
        "choices": [
          "Current Member",
          "Social Media",
          "Community Event",
          "Website",
          "Friend/Family",
          "Other"
        ]
      },
      {
        "name": "heardOther",
        "label": "Member name or other referral details (if applicable)",
        "page": 3,
        "x": 142,
        "y": 296,
        "width": 412,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "motivation",
        "label": "Why do you want to join the Wills Point Fire Department?",
        "page": 3,
        "x": 53,
        "y": 219,
        "width": 501,
        "height": 40,
        "maxLength": 1000,
        "required": true,
        "multiline": true
      }
    ]
  },
  {
    "title": "Emergency contacts",
    "note": "A primary contact is required. Secondary contact information is optional.",
    "fields": [
      {
        "name": "primaryName",
        "label": "Primary contact name",
        "page": 3,
        "x": 53,
        "y": 130,
        "width": 255,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "primaryRelationship",
        "label": "Primary contact relationship",
        "page": 3,
        "x": 318,
        "y": 129,
        "width": 236,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "primaryPhone",
        "label": "Primary contact phone",
        "page": 3,
        "x": 53,
        "y": 103,
        "width": 255,
        "height": 13,
        "maxLength": 40,
        "required": true,
        "type": "tel"
      },
      {
        "name": "primaryAddress",
        "label": "Primary contact address",
        "page": 3,
        "x": 321,
        "y": 103,
        "width": 233,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "secondaryName",
        "label": "Secondary contact name",
        "page": 3,
        "x": 53,
        "y": 77,
        "width": 255,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "secondaryRelationship",
        "label": "Secondary contact relationship",
        "page": 3,
        "x": 318,
        "y": 76,
        "width": 236,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "secondaryPhone",
        "label": "Secondary contact phone",
        "page": 3,
        "x": 53,
        "y": 50,
        "width": 255,
        "height": 13,
        "maxLength": 40,
        "type": "tel"
      },
      {
        "name": "secondaryAddress",
        "label": "Secondary contact address",
        "page": 3,
        "x": 321,
        "y": 50,
        "width": 233,
        "height": 13,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Previous fire / EMS / public safety history",
    "note": "Complete applicable rows. Leave unused rows blank.",
    "fields": [
      {
        "name": "service1_0",
        "label": "1. Department / agency",
        "page": 4,
        "x": 53,
        "y": 639.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service1_1",
        "label": "1. Chief / supervisor",
        "page": 4,
        "x": 156,
        "y": 639.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service1_2",
        "label": "1. Phone / email",
        "page": 4,
        "x": 260,
        "y": 639.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service1_3",
        "label": "1. Dates served",
        "page": 4,
        "x": 363,
        "y": 639.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service1_4",
        "label": "1. Position / rank",
        "page": 4,
        "x": 467,
        "y": 639.5,
        "width": 91,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service2_0",
        "label": "2. Department / agency",
        "page": 4,
        "x": 53,
        "y": 624.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service2_1",
        "label": "2. Chief / supervisor",
        "page": 4,
        "x": 156,
        "y": 624.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service2_2",
        "label": "2. Phone / email",
        "page": 4,
        "x": 260,
        "y": 624.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service2_3",
        "label": "2. Dates served",
        "page": 4,
        "x": 363,
        "y": 624.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service2_4",
        "label": "2. Position / rank",
        "page": 4,
        "x": 467,
        "y": 624.5,
        "width": 91,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service3_0",
        "label": "3. Department / agency",
        "page": 4,
        "x": 53,
        "y": 609.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service3_1",
        "label": "3. Chief / supervisor",
        "page": 4,
        "x": 156,
        "y": 609.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service3_2",
        "label": "3. Phone / email",
        "page": 4,
        "x": 260,
        "y": 609.5,
        "width": 93,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service3_3",
        "label": "3. Dates served",
        "page": 4,
        "x": 363,
        "y": 609.5,
        "width": 94,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "service3_4",
        "label": "3. Position / rank",
        "page": 4,
        "x": 467,
        "y": 609.5,
        "width": 91,
        "height": 12,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Training / certification identification numbers",
    "note": "",
    "fields": [
      {
        "name": "sffma",
        "label": "SFFMA number",
        "page": 4,
        "x": 55,
        "y": 543,
        "width": 245,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "tcfp",
        "label": "TCFP PIN",
        "page": 4,
        "x": 312,
        "y": 543,
        "width": 242,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "fema",
        "label": "FEMA SID",
        "page": 4,
        "x": 53,
        "y": 512,
        "width": 247,
        "height": 13,
        "maxLength": 100
      },
      {
        "name": "teex",
        "label": "TEEX SID",
        "page": 4,
        "x": 312,
        "y": 512,
        "width": 242,
        "height": 13,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Licenses and certifications",
    "note": "Complete applicable rows. Leave unused rows blank.",
    "fields": [
      {
        "name": "certification1_0",
        "label": "1. License / certification",
        "page": 4,
        "x": 53,
        "y": 440,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification1_1",
        "label": "1. Issuing agency",
        "page": 4,
        "x": 182,
        "y": 440,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification1_2",
        "label": "1. Number",
        "page": 4,
        "x": 312,
        "y": 440,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification1_3",
        "label": "1. Expiration date",
        "page": 4,
        "x": 441,
        "y": 440,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification2_0",
        "label": "2. License / certification",
        "page": 4,
        "x": 53,
        "y": 425,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification2_1",
        "label": "2. Issuing agency",
        "page": 4,
        "x": 182,
        "y": 425,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification2_2",
        "label": "2. Number",
        "page": 4,
        "x": 312,
        "y": 425,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification2_3",
        "label": "2. Expiration date",
        "page": 4,
        "x": 441,
        "y": 425,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification3_0",
        "label": "3. License / certification",
        "page": 4,
        "x": 53,
        "y": 410,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification3_1",
        "label": "3. Issuing agency",
        "page": 4,
        "x": 182,
        "y": 410,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification3_2",
        "label": "3. Number",
        "page": 4,
        "x": 312,
        "y": 410,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification3_3",
        "label": "3. Expiration date",
        "page": 4,
        "x": 441,
        "y": 410,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification4_0",
        "label": "4. License / certification",
        "page": 4,
        "x": 53,
        "y": 395,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification4_1",
        "label": "4. Issuing agency",
        "page": 4,
        "x": 182,
        "y": 395,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification4_2",
        "label": "4. Number",
        "page": 4,
        "x": 312,
        "y": 395,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "certification4_3",
        "label": "4. Expiration date",
        "page": 4,
        "x": 441,
        "y": 395,
        "width": 117,
        "height": 12,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Organizations / community affiliations",
    "note": "Complete applicable rows. Leave unused rows blank.",
    "fields": [
      {
        "name": "organization1_0",
        "label": "1. Organization",
        "page": 4,
        "x": 53,
        "y": 327.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization1_1",
        "label": "1. Role / position",
        "page": 4,
        "x": 182,
        "y": 327.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization1_2",
        "label": "1. Contact person",
        "page": 4,
        "x": 312,
        "y": 327.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization1_3",
        "label": "1. Phone / email",
        "page": 4,
        "x": 441,
        "y": 327.4,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization2_0",
        "label": "2. Organization",
        "page": 4,
        "x": 53,
        "y": 312.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization2_1",
        "label": "2. Role / position",
        "page": 4,
        "x": 182,
        "y": 312.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization2_2",
        "label": "2. Contact person",
        "page": 4,
        "x": 312,
        "y": 312.4,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "organization2_3",
        "label": "2. Phone / email",
        "page": 4,
        "x": 441,
        "y": 312.4,
        "width": 117,
        "height": 12,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Personal references",
    "note": "Complete applicable rows. Leave unused rows blank.",
    "fields": [
      {
        "name": "reference1_0",
        "label": "1. Name",
        "page": 4,
        "x": 53,
        "y": 245,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference1_1",
        "label": "1. Relationship",
        "page": 4,
        "x": 182,
        "y": 245,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference1_2",
        "label": "1. Phone",
        "page": 4,
        "x": 312,
        "y": 245,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference1_3",
        "label": "1. Email",
        "page": 4,
        "x": 441,
        "y": 245,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference2_0",
        "label": "2. Name",
        "page": 4,
        "x": 53,
        "y": 230,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference2_1",
        "label": "2. Relationship",
        "page": 4,
        "x": 182,
        "y": 230,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference2_2",
        "label": "2. Phone",
        "page": 4,
        "x": 312,
        "y": 230,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference2_3",
        "label": "2. Email",
        "page": 4,
        "x": 441,
        "y": 230,
        "width": 117,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference3_0",
        "label": "3. Name",
        "page": 4,
        "x": 53,
        "y": 215,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference3_1",
        "label": "3. Relationship",
        "page": 4,
        "x": 182,
        "y": 215,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference3_2",
        "label": "3. Phone",
        "page": 4,
        "x": 312,
        "y": 215,
        "width": 119,
        "height": 12,
        "maxLength": 100
      },
      {
        "name": "reference3_3",
        "label": "3. Email",
        "page": 4,
        "x": 441,
        "y": 215,
        "width": 117,
        "height": 12,
        "maxLength": 100
      }
    ]
  },
  {
    "title": "Applicant signatures",
    "note": "Review pages 5–7 of the application packet before signing. Type your full name in each signature field to sign electronically.",
    "fields": [
      {
        "name": "applicationSignature",
        "label": "Membership application signature",
        "page": 4,
        "x": 145,
        "y": 124,
        "width": 245,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "applicationDate",
        "label": "Application signature date",
        "page": 4,
        "x": 424,
        "y": 124,
        "width": 130,
        "height": 13,
        "maxLength": 100,
        "type": "date",
        "required": true
      },
      {
        "name": "authorizationName",
        "label": "Certification / background authorization: printed name",
        "page": 6,
        "x": 167,
        "y": 486,
        "width": 260,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "authorizationSignature",
        "label": "Certification / background authorization: signature",
        "page": 6,
        "x": 148,
        "y": 465,
        "width": 279,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "authorizationDate",
        "label": "Certification / background authorization: date",
        "page": 6,
        "x": 76,
        "y": 444,
        "width": 180,
        "height": 13,
        "maxLength": 100,
        "type": "date",
        "required": true
      },
      {
        "name": "screeningName",
        "label": "Physical / drug screening consent: printed name",
        "page": 7,
        "x": 53,
        "y": 329,
        "width": 247,
        "height": 13,
        "maxLength": 100,
        "required": true
      },
      {
        "name": "screeningDate",
        "label": "Physical / drug screening consent: date",
        "page": 7,
        "x": 314,
        "y": 329,
        "width": 220,
        "height": 13,
        "maxLength": 100,
        "type": "date",
        "required": true
      },
      {
        "name": "screeningSignature",
        "label": "Physical / drug screening consent: signature",
        "page": 7,
        "x": 53,
        "y": 288,
        "width": 247,
        "height": 13,
        "maxLength": 100,
        "required": true
      }
    ]
  }
];
