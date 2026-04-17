const PSGC_API_BASE_URL = "https://psgc.gitlab.io/api";

export type PSGCRegion = {
  code: string;
  name: string;
};

export type PSGCProvince = {
  code: string;
  name: string;
};

export type PSGCLocalityType = "city" | "municipality";

export type PSGCLocality = {
  code: string;
  name: string;
  oldName?: string;
  type?: PSGCLocalityType | string;
  zip_code?: string | null;
};

export type PSGCBarangay = {
  code: string;
  name: string;
  oldName?: string;
};

async function psgcRequest<T>(path: string) {
  const response = await fetch(`${PSGC_API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("Unable to load Philippine address data right now.");
  }

  return (await response.json()) as T;
}

type PaginatedResponse<T> = {
  data?: T[];
  meta?: {
    current_page?: number;
    total_pages?: number;
  };
  next_page_url?: string | null;
};

async function psgcRequestAll<T>(path: string) {
  const firstPage = await psgcRequest<T[] | PaginatedResponse<T>>(path);

  if (Array.isArray(firstPage)) {
    return firstPage;
  }

  const items = [...(firstPage.data ?? [])];
  const totalPages = firstPage.meta?.total_pages ?? firstPage.meta?.current_page ?? 1;

  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await psgcRequest<T[] | PaginatedResponse<T>>(
      `${path}${path.includes("?") ? "&" : "?"}page=${page}`,
    );

    if (Array.isArray(nextPage)) {
      items.push(...nextPage);
      break;
    }

    items.push(...(nextPage.data ?? []));
  }

  return items;
}

export async function fetchRegions() {
  const regions = await psgcRequestAll<PSGCRegion>("/regions/");
  return sortByName(regions);
}

export function fetchProvincesByRegion(regionCode: string) {
  return psgcRequest<PSGCProvince[]>(`/regions/${regionCode}/provinces/`);
}

async function fetchRegionCities(regionCode: string) {
  return psgcRequest<PSGCLocality[]>(`/regions/${regionCode}/cities/`);
}

async function fetchRegionMunicipalities(regionCode: string) {
  return psgcRequest<PSGCLocality[]>(`/regions/${regionCode}/municipalities/`);
}

async function fetchProvinceCities(provinceCode: string) {
  return psgcRequest<PSGCLocality[]>(`/provinces/${provinceCode}/cities/`);
}

async function fetchProvinceMunicipalities(provinceCode: string) {
  return psgcRequest<PSGCLocality[]>(`/provinces/${provinceCode}/municipalities/`);
}

function normalizeLocalityType(locality: PSGCLocality): PSGCLocality {
  if (locality.type === "municipality" || locality.type === "city") {
    return locality;
  }

  return {
    ...locality,
    type: locality.name.toLowerCase().startsWith("city of") ? "city" : "municipality",
  };
}

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

export async function fetchCitiesMunicipalitiesByRegion(regionCode: string) {
  try {
    const items = await psgcRequest<PSGCLocality[]>(
      `/regions/${regionCode}/cities-municipalities/`,
    );

    return sortByName(items.map(normalizeLocalityType));
  } catch {
    const [cities, municipalities] = await Promise.all([
      fetchRegionCities(regionCode).catch(() => []),
      fetchRegionMunicipalities(regionCode).catch(() => []),
    ]);

    return sortByName(
      [...cities, ...municipalities].map(normalizeLocalityType),
    );
  }
}

export async function fetchCitiesMunicipalitiesByProvince(provinceCode: string) {
  try {
    const items = await psgcRequest<PSGCLocality[]>(
      `/provinces/${provinceCode}/cities-municipalities/`,
    );

    return sortByName(items.map(normalizeLocalityType));
  } catch {
    const [cities, municipalities] = await Promise.all([
      fetchProvinceCities(provinceCode).catch(() => []),
      fetchProvinceMunicipalities(provinceCode).catch(() => []),
    ]);

    return sortByName(
      [...cities, ...municipalities].map(normalizeLocalityType),
    );
  }
}

export function fetchBarangaysByLocality(
  localityCode: string,
  localityType?: PSGCLocalityType | string,
) {
  const normalizedType = localityType === "city" ? "cities" : "municipalities";

  return psgcRequest<PSGCBarangay[]>(
    `/${normalizedType}/${localityCode}/barangays/`,
  );
}
