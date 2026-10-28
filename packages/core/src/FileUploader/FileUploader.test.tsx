import { describe, expect, it } from "vitest";
import { Fieldset } from "../Fieldset/Fieldset.js";
import { formatBytes } from "../format/bytes.js";
import { renderRoot } from "../test/render.js";
import { FileUploader } from "./FileUploader.js";

function file(name: string, size: number, type = "application/pdf"): File {
  return new File([new Uint8Array(size)], name, { type });
}

function triggerButton(markup: string): string {
  const match = /<button[^>]*data-part="trigger"[^>]*>[^<]*</.exec(markup);
  if (match === null) {
    throw new Error(`No button in the markup: ${markup}`);
  }
  return match[0];
}

function fileInput(markup: string): string {
  const match = /<input[^>]*type="file"[^>]*>/.exec(markup);
  if (match === null) {
    throw new Error(`No file field in the markup: ${markup}`);
  }
  return match[0];
}

describe("FileUploader", () => {
  it("renders label, drop area, button and hint from the catalog", () => {
    const { tag, attrs, markup } = renderRoot(<FileUploader label="Report" />);
    expect(tag).toBe("div");
    expect(attrs["data-empty"]).toBe("");
    expect(markup).toMatch(/data-part="label"[^>]*>Report</);
    expect(markup).toMatch(/data-part="dropzone"/);
    expect(triggerButton(markup)).toMatch(/>Choose files</);
    expect(markup).toContain("or drop files here");
    expect(fileInput(markup)).toContain('type="file"');
  });

  it("lets the texts be overridden", () => {
    const { markup } = renderRoot(
      <FileUploader chooseText="Pick a file" dropText="or release it here" label="R" />,
    );
    expect(markup).toContain("Pick a file");
    expect(markup).toContain("or release it here");
  });

  it("passes accept, multiple and name to the file input", () => {
    const multiple = fileInput(
      renderRoot(
        <FileUploader accept={["image/png", "image/jpeg"]} label="R" multiple name="scan" />,
      ).markup,
    );
    expect(multiple).toContain('accept="image/png,image/jpeg"');
    expect(multiple).toContain("multiple");
    expect(multiple).toContain('name="scan"');
    expect(fileInput(renderRoot(<FileUploader label="R" />).markup)).not.toContain("multiple");
  });

  it("lists the files with name, size and a remove button", () => {
    const { attrs, markup } = renderRoot(
      <FileUploader files={[file("report.pdf", 1234), file("scan.png", 4800000)]} label="R" />,
    );
    expect(attrs).not.toHaveProperty("data-empty");
    expect(markup.match(/data-part="item"/g)).toHaveLength(2);
    expect(markup).toContain("report.pdf");
    expect(markup).toContain(formatBytes(1234));
    expect(markup).toContain(formatBytes(4800000));
    expect(markup).toMatch(/data-part="item-delete-trigger"[^>]*aria-label="Remove report.pdf"/);
  });

  it("lets the remove button's name be overridden", () => {
    const { markup } = renderRoot(
      <FileUploader
        files={[file("report.pdf", 10)]}
        label="R"
        removeLabel={(f) => `Remove ${f.name}`}
      />,
    );
    expect(markup).toContain('aria-label="Remove report.pdf"');
  });

  it("writes disabled on the root element and locks the field and button", () => {
    const { attrs, markup } = renderRoot(<FileUploader disabled label="R" />);
    expect(attrs["data-disabled"]).toBe("");
    expect(fileInput(markup)).toContain("disabled");
    expect(triggerButton(markup)).toContain("disabled");
    expect(renderRoot(<FileUploader label="R" />).attrs).not.toHaveProperty("data-disabled");
  });

  it("connects label and file input via id", () => {
    const { markup } = renderRoot(<FileUploader id="report" label="R" />);
    expect(fileInput(markup)).toContain('id="report"');
    expect(markup).toMatch(/data-part="label"[^>]*for="report"/);
  });

  it("is itself locked inside a disabled fieldset", () => {
    const { markup } = renderRoot(
      <Fieldset disabled legend="Attachments">
        <FileUploader label="R" />
      </Fieldset>,
    );
    expect(fileInput(markup)).toContain("disabled");
  });
});
