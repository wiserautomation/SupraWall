import { suprawall } from "@suprawall/core";
import { db } from "./firebase";

// Configure SupraWall Core to use the Firebase abstraction
// We tell it to use "firebase" adapter, but also pass the existing initialized `db` explicitly 
// so it shares the same connection as the rest of the application.
suprawall.config({
    adapter: "firebase"
});

// Since we are already initializing firebase in lib/firebase.ts for Auth and other parts,
// we just pass the db object down into the adapter to reuse it!
if (typeof window !== "undefined") {
    suprawall.__interop_setAdapterDb(db);
}

export { suprawall };
