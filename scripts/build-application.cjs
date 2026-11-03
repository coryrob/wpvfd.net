// Run with Node.js after installing api dependencies: node scripts/build-application.cjs
const fs = require('node:fs');
const path = require('node:path');
const { PDFDocument, StandardFonts, rgb } = process.env.PDF_LIB_PATH
  ? require(process.env.PDF_LIB_PATH) : require('../api/node_modules/pdf-lib');
const sections = [];
let current;
function section(title, note = '') { current = { title, note, fields: [] }; sections.push(current); }
function field(name, label, page, x, y, width, options = {}) {
  current.fields.push({ name, label, page, x, y, width, height: 13, maxLength: 100, ...options });
}
section('Member information');
field('membershipType', 'Membership type', 3, 193, 633, 160, { required: true, choices: ['Firefighter', 'Rehab', 'Other'] });
field('membershipOther', 'Other membership type (if applicable)', 3, 364, 633, 190);
field('lastName', 'Last name', 3, 55, 577, 210, { required: true, autocomplete: 'family-name' });
field('firstName', 'First name', 3, 275, 577, 144, { required: true, autocomplete: 'given-name' });
field('middleName', 'Middle name', 3, 429, 577, 125, { autocomplete: 'additional-name' });
field('birthDate', 'Date of birth', 3, 55, 550, 210, { type: 'date', required: true });
field('ssnLastFour', 'Last four digits of SSN', 3, 275, 551, 144, { required: true, pattern: '[0-9]{4}', maxLength: 4, inputmode: 'numeric' });
field('driverLicense', 'Texas driver license number', 3, 53, 525, 210, { required: true, maxLength: 30 });
field('licenseClass', 'Driver license class', 3, 320, 529, 99, { required: true, maxLength: 10 });
field('endorsements', 'Endorsements / restrictions (or N/A)', 3, 429, 525, 125, { required: true });
field('phone', 'Cell phone', 3, 55, 492, 210, { type: 'tel', required: true, autocomplete: 'tel', maxLength: 40 });
field('email', 'Email', 3, 275, 498, 279, { type: 'email', required: true, autocomplete: 'email', maxLength: 254 });
field('street', 'Street address', 3, 53, 460, 210, { required: true, autocomplete: 'street-address' });
field('city', 'City', 3, 275, 460, 144, { required: true, autocomplete: 'address-level2' });
field('state', 'State', 3, 459, 465, 25, { required: true, maxLength: 2, autocomplete: 'address-level1' });
field('zip', 'ZIP code', 3, 508, 465, 46, { required: true, pattern: '[0-9]{5}(-[0-9]{4})?', maxLength: 10, autocomplete: 'postal-code' });
field('licenseMatches', 'Does your residence match your driver license?', 3, 211, 444, 52, { required: true, choices: ['Yes', 'No'] });
field('licenseAddress', 'If no, driver license address, state and ZIP', 3, 389, 444, 165);
field('employer', 'Employer (or N/A)', 3, 53, 407, 210, { required: true });
field('occupation', 'Occupation / position (or N/A)', 3, 275, 401, 144, { required: true });
field('workPhone', 'Work phone (if applicable)', 3, 429, 401, 125, { type: 'tel', maxLength: 40 });
field('workSchedule', 'Typical work schedule (or N/A)', 3, 53, 367, 355, { required: true });
field('transportation', 'Reliable transportation?', 3, 465, 366, 89, { required: true, choices: ['Yes', 'No'] });
section('Membership information');
field('heardFrom', 'How did you hear about us?', 3, 180, 310, 374, { required: true, choices: ['Current Member', 'Social Media', 'Community Event', 'Website', 'Friend/Family', 'Other'] });
field('heardOther', 'Member name or other referral details (if applicable)', 3, 142, 296, 412);
field('motivation', 'Why do you want to join the Wills Point Fire Department?', 3, 53, 219, 501, { required: true, multiline: true, height: 40, maxLength: 1000 });
section('Emergency contacts', 'A primary contact is required. Secondary contact information is optional.');
field('primaryName', 'Primary contact name', 3, 53, 130, 255, { required: true });
field('primaryRelationship', 'Primary contact relationship', 3, 318, 129, 236, { required: true });
field('primaryPhone', 'Primary contact phone', 3, 53, 103, 255, { required: true, type: 'tel', maxLength: 40 });
field('primaryAddress', 'Primary contact address', 3, 321, 103, 233, { required: true });
field('secondaryName', 'Secondary contact name', 3, 53, 77, 255);
field('secondaryRelationship', 'Secondary contact relationship', 3, 318, 76, 236);
field('secondaryPhone', 'Secondary contact phone', 3, 53, 50, 255, { type: 'tel', maxLength: 40 });
field('secondaryAddress', 'Secondary contact address', 3, 321, 50, 233);
function table(title, prefix, labels, xs, widths, ys) {
  section(title, 'Complete applicable rows. Leave unused rows blank.');
  ys.forEach((y, index) => labels.forEach((label, col) => field(`${prefix}${index + 1}_${col}`, `${index + 1}. ${label}`, 4, xs[col], y, widths[col], { maxLength: 100, height: 12 })));
}
table('Previous fire / EMS / public safety history', 'service', ['Department / agency', 'Chief / supervisor', 'Phone / email', 'Dates served', 'Position / rank'], [53,156,260,363,467], [93,94,93,94,91], [639.5,624.5,609.5]);
section('Training / certification identification numbers');
field('sffma', 'SFFMA number', 4, 55, 543, 245);
field('tcfp', 'TCFP PIN', 4, 312, 543, 242);
field('fema', 'FEMA SID', 4, 53, 512, 247);
field('teex', 'TEEX SID', 4, 312, 512, 242);
table('Licenses and certifications', 'certification', ['License / certification', 'Issuing agency', 'Number', 'Expiration date'], [53,182,312,441], [119,119,119,117], [440,425,410,395]);
table('Organizations / community affiliations', 'organization', ['Organization', 'Role / position', 'Contact person', 'Phone / email'], [53,182,312,441], [119,119,119,117], [327.4,312.4]);
table('Personal references', 'reference', ['Name', 'Relationship', 'Phone', 'Email'], [53,182,312,441], [119,119,119,117], [245,230,215]);
section('Applicant signatures', 'Review pages 5–7 of the application packet before signing. Type your full name in each signature field to sign electronically.');
field('applicationSignature', 'Membership application signature', 4, 145, 124, 245, { required: true });
field('applicationDate', 'Application signature date', 4, 424, 124, 130, { type: 'date', required: true });
field('authorizationName', 'Certification / background authorization: printed name', 6, 167, 486, 260, { required: true });
field('authorizationSignature', 'Certification / background authorization: signature', 6, 148, 465, 279, { required: true });
field('authorizationDate', 'Certification / background authorization: date', 6, 76, 444, 180, { type: 'date', required: true });
field('screeningName', 'Physical / drug screening consent: printed name', 7, 53, 329, 247, { required: true });
field('screeningDate', 'Physical / drug screening consent: date', 7, 314, 329, 220, { type: 'date', required: true });
field('screeningSignature', 'Physical / drug screening consent: signature', 7, 53, 288, 247, { required: true });

(async () => {
  const root = path.join(__dirname, '..');
  const doc = await PDFDocument.load(fs.readFileSync(path.join(root, 'Documents/WPFD_Fire_Department_Application_082026.pdf')));
  const form = doc.getForm();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  // Replace printed checkbox options with dropdowns in the same spaces. Retain
  // the question labels and avoid covering the surrounding table headings.
  const membershipPage = doc.getPage(2);
  for (const [x, y, width, height] of [[193,632,363,18], [178,309,380,15], [140,295,414,14], [210,443,61,14], [53,432,20,12], [531,379,30,15], [429,365,42,15]]) {
    membershipPage.drawRectangle({ x, y, width, height, color: rgb(1,1,1) });
  }
  for (const f of sections.flatMap(s => s.fields)) {
    const control = f.choices ? form.createDropdown(f.name) : form.createTextField(f.name);
    if (f.choices) control.addOptions(f.choices);
    else {
      control.setMaxLength(f.maxLength);
      if (f.multiline) control.enableMultiline();
    }
    if (f.required) control.enableRequired();
    control.addToPage(doc.getPage(f.page - 1), { x: f.x, y: f.y, width: f.width, height: f.height, font, borderWidth: 0, backgroundColor: rgb(0.95,0.97,1), textColor: rgb(0,0,0) });
    control.setFontSize(f.multiline ? 10 : 8);
  }
  form.updateFieldAppearances(font);
  const bytes = await doc.save();
  fs.writeFileSync(path.join(root, 'Documents/WPFD_Application_Fillable.pdf'), bytes);
  fs.writeFileSync(path.join(root, 'api/templates/application.pdf'), bytes);
  fs.writeFileSync(path.join(root, 'api/shared/schema.json'), JSON.stringify(sections, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'js/application-schema.js'), 'window.applicationSections = ' + JSON.stringify(sections, null, 2) + ';\n');
  console.log(`Created fillable packet with ${form.getFields().length} fields.`);
})();
