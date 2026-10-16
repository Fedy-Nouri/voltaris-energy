import {
  Activity,
  AirVent,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Cable,
  CircuitBoard,
  Cpu,
  Database,
  Download,
  Factory,
  Gauge,
  GraduationCap,
  LineChart,
  Lock,
  Mail,
  PhoneCall,
  PlayCircle,
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
 * Icons are referenced by string key rather than by importing the component at
 * the call site. This is not stylistic — a Lucide icon is a function component,
 * and React Server Components cannot pass a function across the boundary into a
 * Client Component. Keying them means content modules and props like
 * `<Button icon="arrowRight">` stay serialisable and work identically from a
 * server or a client component.
 *
 * The `as const` plus the derived `IconKey` type turns a typo into a compile
 * error rather than a blank space on the page at runtime.
 *
 * Icons used *inside* a single client component and never passed as a prop —
 * the menu and close glyphs in `MobileNav`, for instance — are imported
 * directly there, since they never cross a boundary.
 */
export const icons = {
  activity: Activity,
  airVent: AirVent,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  barChart: BarChart3,
  bell: Bell,
  building: Building2,
  cable: Cable,
  circuitBoard: CircuitBoard,
  cpu: Cpu,
  database: Database,
  download: Download,
  factory: Factory,
  gauge: Gauge,
  graduationCap: GraduationCap,
  lineChart: LineChart,
  lock: Lock,
  mail: Mail,
  phoneCall: PhoneCall,
  playCircle: PlayCircle,
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
