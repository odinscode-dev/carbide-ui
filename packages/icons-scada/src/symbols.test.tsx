import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as scada from "./index.js";

/** One instance of every symbol, by export name. */
const SYMBOLS: Record<string, React.JSX.Element> = {
  ConicalTank: <scada.ConicalTank />,
  CylindricalTank: <scada.CylindricalTank />,
  Ibc: <scada.Ibc />,
  CurrentDisplay: <scada.CurrentDisplay />,
  EcDisplay: <scada.EcDisplay />,
  FlowDisplay: <scada.FlowDisplay />,
  LevelDisplay: <scada.LevelDisplay />,
  PhDisplay: <scada.PhDisplay />,
  PressureDisplay: <scada.PressureDisplay />,
  Filter: <scada.Filter />,
  HeatExchanger: <scada.HeatExchanger />,
  StaticMixer: <scada.StaticMixer />,
  CrossPipe: <scada.CrossPipe />,
  Drain: <scada.Drain />,
  Dripper: <scada.Dripper />,
  ElbowPipe: <scada.ElbowPipe />,
  Manifold2: <scada.Manifold2 />,
  Manifold4: <scada.Manifold4 />,
  Manifold6: <scada.Manifold6 />,
  Manifold8: <scada.Manifold8 />,
  Nozzle: <scada.Nozzle />,
  StraightPipe: <scada.StraightPipe />,
  TeePipe: <scada.TeePipe />,
  CentrifugalPump: <scada.CentrifugalPump />,
  DiaphragmPump: <scada.DiaphragmPump />,
  DosingPump: <scada.DosingPump />,
  SwitchHandwheel: <scada.SwitchHandwheel />,
  SwitchMotor: <scada.SwitchMotor />,
  BallValveHandwheel: <scada.BallValveHandwheel />,
  BallValveMotor: <scada.BallValveMotor />,
  CheckValve: <scada.CheckValve />,
  ReliefValve: <scada.ReliefValve />,
};

describe("the symbol set", () => {
  it("exports exactly the components under test", () => {
    const exported = Object.keys(scada).sort();
    expect(exported).toEqual(Object.keys(SYMBOLS).sort());
  });

  it.each(Object.entries(SYMBOLS))("%s is a 96 x 96 module with a label", (_name, symbol) => {
    const markup = renderToStaticMarkup(symbol);
    expect(markup).toContain('viewBox="0 0 96 96"');
    expect(markup).toContain('role="img"');
    expect(markup).toMatch(/aria-label="[^"]+"/);
  });

  it.each(Object.entries(SYMBOLS))("%s keeps every colour in the stylesheet", (_name, symbol) => {
    expect(renderToStaticMarkup(symbol)).not.toMatch(/#[0-9a-fA-F]{3,8}\b|oklch\(|rgb\(/);
  });
});

describe("state", () => {
  it("is carried as data-state", () => {
    expect(renderToStaticMarkup(<scada.CentrifugalPump state="alarm" />)).toContain(
      'data-state="alarm"',
    );
    expect(renderToStaticMarkup(<scada.ConicalTank state="overfilled" />)).toContain(
      'data-state="overfilled"',
    );
  });

  it.each(["Filter", "CheckValve", "BallValveHandwheel"])(
    "is absent on %s, which has no drive",
    (name) => {
      const symbol = SYMBOLS[name];
      expect(symbol).toBeDefined();
      expect(renderToStaticMarkup(symbol)).not.toContain("data-state");
    },
  );

  it("shows a stopped drive as a hollow ring", () => {
    const stopped = renderToStaticMarkup(<scada.BallValveMotor state="stopped" />);
    const open = renderToStaticMarkup(<scada.BallValveMotor state="open" />);
    expect(stopped).toMatch(/class="[^"]*ring[^"]*" cx="86"/);
    expect(open).not.toMatch(/class="[^"]*ring[^"]*" cx="86"/);
  });
});

describe("fill level", () => {
  const rect = (markup: string) =>
    /<rect class="[^"]*level[^"]*" height="([\d.]+)"[^>]* y="([\d.]+)"/.exec(markup);

  it("grows from the bottom of the vessel", () => {
    const full = rect(renderToStaticMarkup(<scada.CylindricalTank fillLevel={100} />));
    const half = rect(renderToStaticMarkup(<scada.CylindricalTank fillLevel={50} />));
    expect(full?.slice(1)).toEqual(["60", "18"]);
    expect(half?.slice(1)).toEqual(["30", "48"]);
  });

  it("is held to 0..100", () => {
    const over = rect(renderToStaticMarkup(<scada.CylindricalTank fillLevel={250} />));
    const under = rect(renderToStaticMarkup(<scada.CylindricalTank fillLevel={-5} />));
    expect(over?.slice(1)).toEqual(["60", "18"]);
    expect(under?.slice(1)).toEqual(["0", "78"]);
  });
});

describe("three-way valve", () => {
  it("blocks S when the medium goes straight and E when it branches", () => {
    const straight = renderToStaticMarkup(<scada.SwitchHandwheel position="straight" />);
    const branch = renderToStaticMarkup(<scada.SwitchHandwheel position="branch" />);
    expect(straight).toMatch(/class="[^"]*solid[^"]*" d="M38,66/);
    expect(branch).toMatch(/class="[^"]*solid[^"]*" d="M66,38/);
  });

  it("asserts no position by default", () => {
    const markup = renderToStaticMarkup(<scada.SwitchHandwheel />);
    expect(markup).not.toMatch(/passage/);
    expect(markup).not.toMatch(/class="[^"]*solid[^"]*" d="M(30,38|66,38|38,66)/);
  });
});

describe("diaphragm pump", () => {
  it("springs the diaphragm from the height the pipes enter at", () => {
    const markup = renderToStaticMarkup(<scada.DiaphragmPump />);
    expect(markup).toContain('d="M0,48 H30"');
    expect(markup).toContain('d="M30,48 Q');
  });
});

describe("manifold", () => {
  it.each([
    ["Manifold2", 2],
    ["Manifold4", 4],
    ["Manifold6", 6],
    ["Manifold8", 8],
  ])("%s has %i outlets down to the module's edge", (name, outlets) => {
    const symbol = SYMBOLS[name];
    expect(symbol).toBeDefined();
    expect(renderToStaticMarkup(symbol).match(/ V96"/g)).toHaveLength(outlets);
  });

  it.each(["Manifold2", "Manifold4", "Manifold6", "Manifold8"])(
    "%s takes its inlet from N on the centre line, at full length",
    (name) => {
      const symbol = SYMBOLS[name];
      expect(symbol).toBeDefined();
      const markup = renderToStaticMarkup(symbol);
      expect(markup).toContain('d="M48,0 V40"');
      expect(markup).not.toContain('d="M0,48');
    },
  );
});
