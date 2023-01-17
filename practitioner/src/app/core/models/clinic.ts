import { TypeaheadResult } from '@core/models/typeahead';

export interface Clinic {
  id: number;
  vatId: string;
  name: string;
  addressLine1: string;
  addressLine2: string | null;
  description: string | null;
  logoUrl: string | null;
}

export type TypeaheadClinic = Clinic & TypeaheadResult;
