
export enum CropStatus {
  HEALTHY = 'Healthy',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
}

export type PlanTier = 'Boutique Estate' | 'Industrial Apex' | 'Sovereign Protocol' | 'Master';

export interface SensorData {
  id: string;
  type: 'soil' | 'water' | 'crop' | 'soil pH' | 'nutrient';
  value: number;
  unit: string;
  timestamp: string;
  location: [number, number];
  battery: number;
  signal: number;
  status: 'online' | 'low-power' | 'offline';
  verified: boolean;
}

export interface YieldPrediction {
  period: string;
  expected: number;
  potential: number;
  unit: string;
}

export interface AIAnalysisResult {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  sustainabilityImpact: string;
}

export interface SustainabilityMetric {
  label: string;
  value: string;
  change: number;
  icon: string;
}
