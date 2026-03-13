const projectRef = "ilgyjtpxvuebtcuojnyz";
const dbUrl = "postgresql://postgres:PASSWORD_REDACTED@db.ilgyjtpxvuebtcuojnyz.supabase.co:5432/postgres";
const transformed = dbUrl
    .replace(`db.ilgyjtpxvuebtcuojnyz.supabase.co`, "aws-0-eu-central-1.pooler.supabase.com")
    .replace(":5432", ":6543")
    .replace(/(postgresql?:\/\/)([^:]+)(:)/, `$1$2.${projectRef}$3`);
console.log("Transformed:", transformed);
const masked = transformed.replace(/:[^:@]+@/, ":****@");
console.log("Masked:", masked);
