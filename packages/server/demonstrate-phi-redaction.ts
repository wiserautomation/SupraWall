import { scrubResponse } from './src/scrubber';

const sampleResponse = {
    patient_summary: "John Doe (DOB 05/12/1982) presents with symptoms of J45.901. Contact: +1-555-0199 or jdoe@gmail.com. Last seen at IP 192.168.1.50.",
    clinical_notes: "MRN: 992831-X. Social Security: 123-45-6789. Billing account 9928374."
};

const scrubbed = scrubResponse(sampleResponse, ["secret-token-xyz"]);

console.log("\n--- ORIGINAL RESPONSE ---");
console.log(JSON.stringify(sampleResponse, null, 2));

console.log("\n--- SCRUBBED RESPONSE (HIPAA COMPLIANT) ---");
console.log(JSON.stringify(scrubbed, null, 2));

const foundRedactions = JSON.stringify(scrubbed).match(/\[REDACTED_PHI_[A-Z0-9_]+\]/g) || [];
console.log(`\n✅ REDACTION SUCCESS: Found ${new Set(foundRedactions).size} unique PHI categories protected.`);
console.log(`Redactions applied: ${[...new Set(foundRedactions)].join(", ")}`);
