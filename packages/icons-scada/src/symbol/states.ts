/** A pump runs, stops, warns, alarms or is faulty. */
export type EquipmentState = "stopped" | "running" | "warning" | "alarm" | "fault";

/**
 * A container neither runs nor stops; its state says whether it can take more
 * (`fillable`), is short (`empty`), holds enough (`full`), must not take more
 * (`overfilled`, a process alarm) or is out of service (`locked`).
 */
export type ContainerState = "fillable" | "empty" | "full" | "overfilled" | "locked";

/**
 * A display measures: within range (`ok`), past a warning or alarm threshold,
 * or the sensor itself is faulty.
 */
export type DisplayState = "ok" | "warning" | "alarm" | "fault";

/**
 * A driven fitting reports the position of its drive: `closed` (0 %), `open`
 * (from 0.1 %), `moving`, `fault` (device fault, orange; red stays reserved
 * for process alarms) or `stopped` (drive idle, position not asserted, shown
 * as a hollow ring).
 */
export type ActuatorState = "closed" | "open" | "moving" | "fault" | "stopped";

/** A relief valve either sits (`ok`) or has blown (`alarm`). */
export type ReliefValveState = "ok" | "alarm";
