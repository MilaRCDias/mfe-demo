export interface CarbonIntensityData {
  from: string;
  to: string;
  intensity: {
    forecast: number;
    actual: number;
    index: string;
  };
}

interface CarbonIntensityResponse {
  data: CarbonIntensityData[];
}

export async function fetchCarbonIntensity(
  from: string,
  to: string,
): Promise<CarbonIntensityResponse | null> {
  try {
    const res = await fetch(`/api/dash/get-intensity?from=${from}&to=${to}`);

    if (!res.ok) {
      throw new Error('Failed to fetch carbon intensity data');
    }

    const data: CarbonIntensityResponse = await res.json();

    return data;
  } catch (error) {
    console.error((error as Error).message);
    return null;
  }
}
