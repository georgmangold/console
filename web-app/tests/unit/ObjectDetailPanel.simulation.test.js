
// Simulation of the variables and logic
const checkLogic = () => {
  // Test case 1: Versioning Enabled, No versions, No Version ID
  let versioningInfo = { status: "Enabled" };
  let versions = [];
  let actualInfo = { version_id: undefined };

  let isVersioningEnabled = versioningInfo?.status === "Enabled";
  let hasVersions = versions.length > 1 || !!actualInfo.version_id;
  
  console.log("Test 1 (Enabled, No Versions):");
  console.log("isVersioningEnabled:", isVersioningEnabled); // Expected: true
  console.log("hasVersions:", hasVersions); // Expected: false
  console.log("Button Enabled (ObjectDetailPanel):", isVersioningEnabled || hasVersions); // Expected: true

  // Test case 2: Versioning Suspended, Multiple Versions
  versioningInfo = { status: "Suspended" };
  versions = [{ version_id: "v1" }, { version_id: "v2" }];
  actualInfo = { version_id: "v1" };

  isVersioningEnabled = versioningInfo?.status === "Enabled";
  hasVersions = versions.length > 1 || !!actualInfo.version_id;

  console.log("\nTest 2 (Suspended, Versions):");
  console.log("isVersioningEnabled:", isVersioningEnabled); // Expected: false
  console.log("hasVersions:", hasVersions); // Expected: true
  console.log("Button Enabled (ObjectDetailPanel):", isVersioningEnabled || hasVersions); // Expected: true

  // Test case 3: Versioning Suspended, Single Version (null)
  versioningInfo = { status: "Suspended" };
  versions = [{ version_id: "null" }];
  actualInfo = { version_id: "null" };

  isVersioningEnabled = versioningInfo?.status === "Enabled";
  hasVersions = versions.length > 1 || !!actualInfo.version_id;

  console.log("\nTest 3 (Suspended, Null Version):");
  console.log("isVersioningEnabled:", isVersioningEnabled); // Expected: false
  console.log("hasVersions:", hasVersions); // Expected: true ("null" is truthy)
  console.log("Button Enabled (ObjectDetailPanel):", isVersioningEnabled || hasVersions); // Expected: true

  // Test case 4: VersionsNavigator logic
  actualInfo = { version_id: "null" };
  let hasVersionID = !!actualInfo?.version_id;
  console.log("\nTest 4 (VersionsNavigator - Null Version):");
  console.log("hasVersionID:", hasVersionID); // Expected: true

  actualInfo = { version_id: undefined };
  hasVersionID = !!actualInfo?.version_id;
  console.log("hasVersionID (undefined):", hasVersionID); // Expected: false
  
  actualInfo = { version_id: "" };
  hasVersionID = !!actualInfo?.version_id;
  console.log("hasVersionID (empty string):", hasVersionID); // Expected: false (NOTE: Empty string is falsy)
}

checkLogic();
