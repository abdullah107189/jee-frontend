import { DISTRICTS } from "./districts";
import { DIVISIONS } from "./divisions";
import type { BDAddress, District, Division, Upazilas } from "./types";
import { UPAZILAS } from "./upazilas";

/* -------------------------------------------------------------------------- */
/* Lookups — O(1) map                                                     */
/* -------------------------------------------------------------------------- */
export const divisionMap = new Map(DIVISIONS.map((d) => [d.id, d]));
export const districtMap = new Map(DISTRICTS.map((d) => [d.id, d]));
export const upazilaMap = new Map(UPAZILAS.map((u) => [u.id, u]));

/* -------------------------------------------------------------------------- */
/* Get children                                                               */
/* -------------------------------------------------------------------------- */
export function getDistrictsByDivision(divisionId: string): District[] {
  return DISTRICTS.filter((d) => d.division_id === divisionId);
}

export function getUpazilasByDistrict(districtId: string): Upazilas[] {
  return UPAZILAS.filter((u) => u.district_id === districtId);
}

/* -------------------------------------------------------------------------- */
/* Full address label                                                          */
/* -------------------------------------------------------------------------- */
export function formatBDAddress(addr: Partial<BDAddress>): string {
  return [addr.upazilaName, addr.districtName, addr.divisionName]
    .filter(Boolean)
    .join(", ");
}

/* -------------------------------------------------------------------------- */
/* Re-exports                                                                 */
/* -------------------------------------------------------------------------- */
export { DIVISIONS, DISTRICTS, UPAZILAS };
export type { BDAddress, District, Division, Upazilas };
