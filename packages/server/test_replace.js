// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

const dbUrl = "postgresql://postgres:PASSWORD_REDACTED@db.ilgyjtpxvuebtcuojnyz.supabase.co:5432/postgres";
const projectRef = "ilgyjtpxvuebtcuojnyz";
const newUrl = dbUrl
    .replace("db.ilgyjtpxvuebtcuojnyz.supabase.co", "aws-0-eu-central-1.pooler.supabase.com")
    .replace(":5432", ":6543")
    .replace(/(postgresql?:\/\/)([^:]+)(:)/, `$1$2.${projectRef}$3`);
console.log(newUrl);
