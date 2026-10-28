#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["fonttools>=4.50", "brotli>=1.1"]
# ///
"""Builds Carbide Sans and Carbide Display from Red Hat, Carbide Mono from JetBrains Mono.

- Carbide Sans: built from Red Hat Text (until 2026-09-11 from IBM Plex
  Sans), the variable font (wght 300-700) upright and italic, renamed
  (trademark protection, see below), subset to Latin. Red Hat Text has NO
  wdth axis, so density never runs through font-stretch: it changes only
  font-size, line-height and letter-spacing.
- Carbide Display: since 2026-09-11, exclusively for headings and large
  figures, built from Red Hat Display (wght 300-900), same release as
  Carbide Sans -- one source, one license text for both.
- Carbide Mono: seven static cuts from JetBrains Mono NL (No Ligatures --
  Odin wants no ligatures for code/values, see Ticket #82), 100 to 600 plus
  800 instead of 700 (Odin: easier to tell apart from 600).
  U+0030 points at the slashed zero, renamed, same subset.
- One license file per source: fonts/OFL.txt for Red Hat Text AND Red Hat
  Display (same author, same license text, one release),
  fonts/OFL-JetBrainsMono.txt for JetBrains Mono -- different copyright
  line, so not merged.

Usage:
    python3 scripts/build-fonts.py --sans-source <redhatfont-dir> --mono-source <jetbrains-mono-dir>
    uv run scripts/build-fonts.py ...                              (fetches fontTools + Brotli itself)
    python3 scripts/build-fonts.py --check-only                    (only runs the check)

Both sources are optional, but at least one is needed unless --check-only is
given -- this lets Carbide Mono be rebuilt independently of Carbide
Sans/Display. --sans-source covers both Carbide Sans AND Carbide Display,
both live in the same RedHatFont release. Source directories are searched
recursively for the source files; the folder structure of the respective
release doesn't matter.
"""

from __future__ import annotations

import argparse
import shutil
import sys
import tempfile
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent
DEFAULT_TARGET = HERE.parent / "fonts"

# Character set: ASCII, Latin-1 and Latin Extended-A, plus punctuation and
# special characters. List from the howto; do not add anything.
UNICODES = (
    list(range(0x20, 0x7F))
    + list(range(0xA0, 0x180))
    + [
        0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E,
        0x2022, 0x2026, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193,
        0x2264, 0x2265, 0x2260, 0x2030, 0x2032, 0x2033, 0xB0, 0xD7, 0x2212,
    ]
)

# JetBrains Mono NL v2.304 doesn't cover two codepoints from this list:
# U+0132/U+0133 (Ĳ/ĳ, Dutch ligature letters). No known need in the project,
# but deliberately noted here instead of silently dropping -- checked
# 2026-09-11, Ticket #82.
#
# Red Hat Text 5.0.0 doesn't cover nine codepoints from this list:
# U+00AD (Soft Hyphen), U+013F/U+0140/U+0149/U+017F (rare Latin Extended-A
# characters: Ĺ·, ŀ, ʼn, ſ), U+2190/U+2192 (arrows), U+2264/U+2265 (<=, >=).
# As of 2026-09-11 no component in the code uses these characters as text
# (arrows/comparisons go through icons), but deliberately noted here instead
# of silently dropping -- checked 2026-09-11, Ticket #83. Red Hat Display has
# the same nine gaps, same source, same character set -- checked
# 2026-09-11, Ticket #84.

SANS = {
    "RedHatText-VF.ttf": "CarbideSans-Var.woff2",
    "RedHatText-Italic-VF.ttf": "CarbideSans-Italic-Var.woff2",
}
# 'lnum' is dropped: Red Hat Text doesn't offer oldstyle figures, the
# default figures are already lining figures -- nothing to switch, checked
# 2026-09-11. 'kern' stays: sits in GPOS, not GSUB, for Red Hat Text, so it's
# still caught by the same feature filter.
SANS_FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "tnum", "zero", "frac", "sups", "subs"]

DISPLAY = {
    "RedHatDisplay-VF.ttf": "CarbideDisplay-Var.woff2",
    "RedHatDisplay-Italic-VF.ttf": "CarbideDisplay-Italic-Var.woff2",
}
# Same situation as Sans: no oldstyle figures, no 'lnum'. Checked
# 2026-09-11, Ticket #84.
DISPLAY_FEATURES = SANS_FEATURES

# ExtraBold(800) instead of Bold(700): Odin, 2026-09-11, easier to tell
# apart from SemiBold(600) than Bold(700) was.
MONO_WEIGHTS = {
    "Thin": 100, "ExtraLight": 200, "Light": 300, "Regular": 400,
    "Medium": 500, "SemiBold": 600, "ExtraBold": 800,
}
# No liga/calt: JetBrains Mono NL is deliberately the ligature-free variant
# (Odin, 2026-09-11 -- "=>" should stay "=" and ">", no arrow glyph, because
# Carbide shows code/values, it isn't an editor). The NL cuts don't carry
# any GSUB anyway, liga/calt would have no effect.
MONO_FEATURES = ["kern", "ccmp", "tnum", "zero"]

# Fallback for slashed_zero_glyph(), see there.
MONO_ZERO_FALLBACK = "zero.zero"

# wght only now: Red Hat Text has no wdth axis, see the module docstring.
EXPECTED_AXES_SANS = [("wght", 300.0, 700.0)]
EXPECTED_AXES_DISPLAY = [("wght", 300.0, 900.0)]

# Name entries that make up the font name. Only these must no longer carry
# the source's name. Not checked are ID 0 (Copyright) and ID 7 (Trademark,
# if present): both are statements about the author and stay per OFL 1.1.
# Red Hat Text carries neither a Reserved Font Name clause nor a trademark
# notice in ID 7 (unlike Plex or JetBrains Mono) -- renamed anyway, for
# consistency with the other sources.
NAME_IDS = (1, 2, 3, 4, 6, 16, 17)

# The slashed zero is verified through geometry, not through the glyph
# name: WOFF2 carries post format 3.0 and therefore no glyph names anymore,
# fontTools then calls the glyph 'zero' again. Both Plex Mono and JetBrains
# Mono ship with a *dotted* zero by default -- their smallest inner contour
# is a dot at roughly 15-16% of the glyph height. For the slashed one, the
# stroke splits the inner oval into two crescents from 44% to 73%,
# depending on weight and source.
DOT_THRESHOLD = 0.35


def find(source: Path, filename: str) -> Path:
    matches = sorted(source.rglob(filename))
    if not matches:
        raise SystemExit(f"{filename} not found under {source}")
    if len(matches) > 1:
        raise SystemExit(f"{filename} exists more than once under {source}: {matches}")
    return matches[0]


def rename(font: TTFont, old_long: str, new_long: str, old_short: str, new_short: str) -> None:
    """Replaces the Reserved Font Name in every name entry, including the STAT table's."""
    for rec in font["name"].names:
        try:
            s = rec.toUnicode()
        except UnicodeDecodeError:
            continue
        if old_long in s:
            rec.string = s.replace(old_long, new_long)
        elif old_short in s:
            rec.string = s.replace(old_short, new_short)


def do_subset(input_path: Path, output_path: Path, features: list[str]) -> None:
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = features
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    font = subset.load_font(str(input_path), opts)
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)
    subset.save_font(font, str(output_path), opts)


def slashed_zero_glyph(font: TTFont) -> str:
    """Determines the glyph of the slashed zero.

    Prefers the GSUB feature `zero`, as with Plex Mono. JetBrains Mono NL,
    however, carries no GSUB at all -- that's the point of the NL variant,
    it has no layout tables for ligatures. The glyph is still in the font,
    just unbound; MONO_ZERO_FALLBACK then applies and is afterwards
    confirmed geometrically by is_slashed() in check(), not accepted blindly.
    """
    if "GSUB" in font:
        gsub = font["GSUB"].table
        for fr in gsub.FeatureList.FeatureRecord:
            if fr.FeatureTag != "zero":
                continue
            for li in fr.Feature.LookupListIndex:
                for st in gsub.LookupList.Lookup[li].SubTable:
                    mapping = getattr(st, "mapping", None)
                    if mapping and "zero" in mapping:
                        return mapping["zero"]
    if MONO_ZERO_FALLBACK in font.getGlyphOrder():
        return MONO_ZERO_FALLBACK
    raise SystemExit("no zero feature and no fallback glyph found for the slashed zero")


def build_sans(source: Path, target: Path, work: Path) -> None:
    for source_file, target_file in SANS.items():
        font = TTFont(find(source, source_file))
        rename(font, "Red Hat Text", "Carbide Sans", "RedHatText", "CarbideSans")
        intermediate = work / f"{target_file}.ttf"
        font.save(intermediate)
        do_subset(intermediate, target / target_file, SANS_FEATURES)
        print(f"  {target_file}: {(target / target_file).stat().st_size // 1024} KB")


def build_display(source: Path, target: Path, work: Path) -> None:
    for source_file, target_file in DISPLAY.items():
        font = TTFont(find(source, source_file))
        rename(font, "Red Hat Display", "Carbide Display", "RedHatDisplay", "CarbideDisplay")
        intermediate = work / f"{target_file}.ttf"
        font.save(intermediate)
        do_subset(intermediate, target / target_file, DISPLAY_FEATURES)
        print(f"  {target_file}: {(target / target_file).stat().st_size // 1024} KB")


def build_mono(source: Path, target: Path, work: Path) -> None:
    for name, weight in MONO_WEIGHTS.items():
        font = TTFont(find(source, f"JetBrainsMonoNL-{name}.ttf"))
        slashed = slashed_zero_glyph(font)
        for table in font["cmap"].tables:
            if 0x30 in table.cmap:
                table.cmap[0x30] = slashed
        rename(font, "JetBrains Mono NL", "Carbide Mono", "JetBrainsMonoNL", "CarbideMono")
        target_file = f"CarbideMono-{weight}.woff2"
        intermediate = work / f"{target_file}.ttf"
        font.save(intermediate)
        do_subset(intermediate, target / target_file, MONO_FEATURES)
        print(f"  {target_file}: {(target / target_file).stat().st_size // 1024} KB")


def license_file(source: Path, target: Path, filename: str) -> None:
    files = sorted(source.rglob("OFL.txt"))
    if not files:
        raise SystemExit(f"no OFL.txt found under {source}")
    texts = {d.read_bytes() for d in files}
    if len(texts) > 1:
        raise SystemExit(f"the OFL.txt files under {source} differ: {files}")
    shutil.copyfile(files[0], target / filename)
    print(f"  {filename} from {files[0]}")


def contours(font: TTFont, glyph_name: str) -> list[tuple[float, float, float, float]]:
    """The outlines of a glyph as rectangles, smallest first."""
    pen = RecordingPen()
    font.getGlyphSet()[glyph_name].draw(pen)
    edges: list[list[tuple[float, float]]] = [[]]
    for command, args in pen.value:
        if command in ("closePath", "endPath"):
            edges.append([])
            continue
        for arg in args:
            edges[-1].extend(arg if isinstance(arg, list) else [arg])
    boxes = [
        (min(x for x, _ in e), min(y for _, y in e), max(x for x, _ in e), max(y for _, y in e))
        for e in edges
        if e
    ]
    return sorted(boxes, key=lambda r: (r[2] - r[0]) * (r[3] - r[1]))


def is_slashed(font: TTFont) -> tuple[bool, float]:
    """Checks whether U+0030 carries the slashed zero. See DOT_THRESHOLD."""
    boxes = contours(font, font.getBestCmap()[0x30])
    if len(boxes) < 3:
        return False, 0.0
    height = max(r[3] for r in boxes) - min(r[1] for r in boxes)
    share = (boxes[0][3] - boxes[0][1]) / height
    return share >= DOT_THRESHOLD, share


def check(target: Path) -> bool:
    """The check from the howto. Returns True if everything checks out."""
    ok = True

    def report(condition: bool, text: str) -> None:
        nonlocal ok
        ok = ok and condition
        print(f"  {'ok    ' if condition else 'FAILED'} {text}")

    for file, expected_family, expected_axes in (
        *((d, "Carbide Sans", EXPECTED_AXES_SANS) for d in SANS.values()),
        *((d, "Carbide Display", EXPECTED_AXES_DISPLAY) for d in DISPLAY.values()),
    ):
        path = target / file
        if not path.exists():
            report(False, f"{file} is missing")
            continue
        s = TTFont(path)
        axes = [(a.axisTag, a.minValue, a.maxValue) for a in s["fvar"].axes]
        report(axes == expected_axes, f"{file} axes {axes}")
        family = s["name"].getDebugName(16) or s["name"].getDebugName(1)
        report(family == expected_family, f"{file} family {family!r}")
        rest = [r.toUnicode() for r in s["name"].names if r.nameID in NAME_IDS and "Red Hat" in r.toUnicode()]
        report(not rest, f"{file} names free of the source name {rest if rest else ''}")

    for weight in MONO_WEIGHTS.values():
        file = f"CarbideMono-{weight}.woff2"
        path = target / file
        if not path.exists():
            report(False, f"{file} is missing")
            continue
        m = TTFont(path)
        family = m["name"].getDebugName(16) or m["name"].getDebugName(1)
        weight_class = m["OS/2"].usWeightClass
        slashed, share = is_slashed(m)
        report(
            slashed and family == "Carbide Mono" and weight_class == weight,
            f"{file} family {family!r}, usWeightClass {weight_class}, "
            f"U+0030 slashed (smallest inner contour {share:.0%} of glyph height)",
        )

    report((target / "OFL.txt").exists(), "OFL.txt (Carbide Sans + Display / Red Hat) is present")
    report((target / "OFL-JetBrainsMono.txt").exists(), "OFL-JetBrainsMono.txt (Carbide Mono) is present")
    return ok


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sans-source", type=Path, default=None, help="directory with the RedHatFont release (for Carbide Sans and Carbide Display)")
    parser.add_argument("--mono-source", type=Path, default=None, help="directory with the JetBrains Mono release (for Carbide Mono)")
    parser.add_argument("--target", type=Path, default=DEFAULT_TARGET, help=f"output directory (default: {DEFAULT_TARGET})")
    parser.add_argument("--check-only", action="store_true", help="build nothing, only check the output directory")
    args = parser.parse_args()

    if not args.check_only:
        if args.sans_source is None and args.mono_source is None:
            parser.error("at least one source needed: --sans-source or --mono-source")
        for source, name in ((args.sans_source, "--sans-source"), (args.mono_source, "--mono-source")):
            if source is not None and not source.is_dir():
                parser.error(f"{source} ({name}) is not a directory")
        args.target.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix="carbide-fonts-") as work:
            if args.sans_source is not None:
                print(f"Carbide Sans from {args.sans_source}")
                build_sans(args.sans_source, args.target, Path(work))
                print(f"Carbide Display from {args.sans_source}")
                build_display(args.sans_source, args.target, Path(work))
                print("License (Carbide Sans + Display)")
                license_file(args.sans_source, args.target, "OFL.txt")
            if args.mono_source is not None:
                print(f"Carbide Mono with slashed zero from {args.mono_source}")
                build_mono(args.mono_source, args.target, Path(work))
                print("License (Carbide Mono)")
                license_file(args.mono_source, args.target, "OFL-JetBrainsMono.txt")

    print(f"Checking {args.target}")
    return 0 if check(args.target) else 1


if __name__ == "__main__":
    sys.exit(main())
