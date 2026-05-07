// Shared server-side PII utilities used by proxy.mjs and api/*.js
// Keep this in sync with any schema changes to the upstream candidate search API.

export const PII_FIELDS = new Set([
  "phone", "phoneNumber", "phone_number", "mobile", "mobile_number", "mobileNumber",
  "email", "emailAddress", "email_address",
  "fullname", "fullName", "full_name", "firstName", "first_name", "lastName", "last_name",
  "nric", "ic", "identityCard", "identity_card",
  "birthdate", "dateOfBirth", "date_of_birth", "dob", "birthDate", "birth_date",
  "age",
  "picture", "avatar", "photo", "profilePicture", "profile_picture",
  "address", "homeAddress", "home_address", "currentAddress",
  "salary", "currentSalary", "current_salary", "expectedSalary", "expected_salary",
  "expectedSalaryCurrency",
  "gender", "maritalStatus",
  "nationality",
  "passport", "passportNumber", "passport_number",
  "userid",
  // Not PII but unnecessary for the client
  "resumes", "portfolios", "socialMedias", "endorsements", "parsedResume",
  "channels", "subscribe", "invitations", "employerApplicantSource",
]);

export function stripPiiFields(obj) {
  if (Array.isArray(obj)) return obj.map(stripPiiFields);
  if (obj !== null && typeof obj === "object") {
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!PII_FIELDS.has(key)) {
        clean[key] = stripPiiFields(value);
      }
    }
    return clean;
  }
  return obj;
}
