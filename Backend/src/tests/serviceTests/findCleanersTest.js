import { findEligibleCleaners } from "../../services/cleanerService.js";



(async () => {
  const eligible = await findEligibleCleaners("B1 1AA", 15, 1);
  console.log("Eligible cleaners:", eligible);
})();
