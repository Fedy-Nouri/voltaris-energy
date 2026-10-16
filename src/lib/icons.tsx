import {
  Activity,
  AirVent,
  BarChart3,
  Bell,
  Building2,
  Cable,
  CircuitBoard,
  Cpu,
  Database,
  Factory,
  Gauge,
  GraduationCap,
  LineChart,
  Lock,
  Plug,
  Radio,
  Server,
  ShieldCheck,
  Snowflake,
  Thermometer,
  ToggleRight,
  TrendingDown,
  Truck,
  Workflow,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Icon registry.
 *
 * Content modules reference icons by key instead of importing the component
 * directly, which keeps those modules serialisable so they can be handed from
 * a Server Component to a Client Component. The `as const` plus the derived
 * `IconKey` type means a typo in a content file is a compile error, not a
 * blank space on the page at runtime.
 */
export const icons = {
  activity: Activity,
  airVent: AirVent,
  barChart: BarChart3,
  bell: Bell,
  building: Building2,
  cable: Cable,
  circuitBoard: CircuitBoard,
  cpu: Cpu,
  database: Database,
  factory: Factory,
  gauge: Gauge,
  graduationCap: GraduationCap,
  lineChart: LineChart,
  lock: Lock,
  plug: Plug,
  radio: Radio,
  server: Server,
  shieldCheck: ShieldCheck,
  snowflake: Snowflake,
  thermometer: Thermometer,
  toggleRight: ToggleRight,
  trendingDown: TrendingDown,
  truck: Truck,
  workflow: Workflow,
  zap: Zap,
} as const;

export type IconKey = keyof typeof icons;

type IconProps = {
  name: IconKey;
  className?: string;
};

/**
 * Renders a registered icon.
 *
 * Always `aria-hidden`: every icon in this project sits next to a text label,
 * so announcing it would just duplicate what is already read out.
 */
export function Icon({ name, className }: IconProps) {
  const Glyph = icons[name];
  return <Glyph className={cn('size-5', className)} aria-hidden strokeWidth={1.75} />;
}
