import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { Slider as Ark } from "@ark-ui/react/slider";
import { formatNumber } from "../format/number.js";
import styles from "./Slider.module.css";

export type SliderVariant = "default" | "error" | "warning" | "success";

interface SliderBaseProps {
  label: string;
  min?: number | undefined;
  max?: number | undefined;
  step?: number | undefined;

  ticks?: readonly number[] | undefined;

  unit?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;

  name?: string | undefined;
  id?: string | undefined;
  variant?: SliderVariant | undefined;
}

export interface SingleSliderProps extends SliderBaseProps {
  value: number;
  onValueChange?: ((value: number) => void) | undefined;
}

export interface RangeSliderProps extends SliderBaseProps {
  value: readonly [number, number];
  onValueChange?: ((value: [number, number]) => void) | undefined;
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

const NBSP = " ";

const RANGE_SEPARATOR = " – ";

function isRange(props: SliderProps): props is RangeSliderProps {
  return Array.isArray(props.value);
}

export function Slider(props: SliderProps) {
  const {
    label,
    min = 0,
    max = 100,
    step = 1,
    ticks,
    unit,
    disabled = false,
    invalid = false,
    name,
    id,
    variant = "default",
  } = props;
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;
  const isRangeValue = isRange(props);
  const values: number[] = isRangeValue ? [...props.value] : [props.value];

  const display = values
    .map((value) => formatNumber(value) + (unit === undefined ? "" : NBSP + unit))
    .join(RANGE_SEPARATOR);

  const markers =
    ticks === undefined ? [] : [...new Set([min, ...ticks, max])].sort((a, b) => a - b);

  return (
    <Ark.Root
      className={styles.root}
      data-range={isRangeValue ? "" : undefined}
      data-ticks={markers.length > 0 ? "" : undefined}
      data-variant={variant}
      disabled={locked}
      ids={id === undefined ? undefined : { root: id }}
      invalid={invalid}
      max={max}
      min={min}
      name={name}
      onValueChange={(details) => {
        const [first = min, second = max] = details.value;
        if (isRange(props)) {
          props.onValueChange?.([first, second]);
        } else {
          props.onValueChange?.(first);
        }
      }}
      step={step}
      thumbAlignment="center"
      value={values}
    >
      <div className={styles.head}>
        <Ark.Label className={styles.label}>{label}</Ark.Label>
        <Ark.ValueText className={styles.value}>{display}</Ark.ValueText>
      </div>
      <Ark.Control className={styles.control}>
        <Ark.Track className={styles.track}>
          <Ark.Range className={styles.range} />
        </Ark.Track>
        <Ark.Thumb className={styles.thumb} index={0}>
          <Ark.HiddenInput />
        </Ark.Thumb>
        {isRangeValue && (
          <Ark.Thumb className={styles.thumb} index={1}>
            <Ark.HiddenInput />
          </Ark.Thumb>
        )}
      </Ark.Control>
      {markers.length > 0 && (
        <Ark.MarkerGroup className={styles.markers}>
          {markers.map((marker) => (
            <Ark.Marker className={styles.marker} key={marker} value={marker}>
              {formatNumber(marker)}
            </Ark.Marker>
          ))}
        </Ark.MarkerGroup>
      )}
    </Ark.Root>
  );
}
