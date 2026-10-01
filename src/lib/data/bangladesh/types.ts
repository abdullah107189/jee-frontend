/* -------------------------------------------------------------------------- */
/* BD Location Types                                                          */
/* -------------------------------------------------------------------------- */
export interface Division {
  id: string;
  name: string;
  bn_name: string;
  url: string;
}

export interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  url: string;
  lat: number | string;
  lon: number | string;
}

export interface Upazilas {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  url: string;
}

/* -------------------------------------------------------------------------- */
/* Selected address shape                                                     */
/* -------------------------------------------------------------------------- */
export interface BDAddress {
  divisionId: string;
  divisionName: string;
  districtId: string;
  districtName: string;
  upazilaId: string;
  upazilaName: string;
}
