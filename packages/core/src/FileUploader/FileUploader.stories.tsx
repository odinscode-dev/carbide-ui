import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { matrix } from "../../../../.storybook/matrix.js";
import { FileUploader, type FileUploaderProps } from "./FileUploader.js";

function file(name: string, size: number, type = "application/pdf"): File {
  return new File([new Uint8Array(size)], name, { type });
}

const FILES = [file("inspection-report.pdf", 1_234_000), file("valve-3.png", 480_000, "image/png")];

function ControlledUploader(props: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([...(props.files ?? [])]);
  return <FileUploader {...props} files={files} onFilesChange={setFiles} />;
}

const meta: Meta<typeof FileUploader> = {
  title: "Core/FileUploader",
  component: FileUploader,
  args: { label: "Attachments", multiple: true },
  argTypes: {
    onFilesChange: { control: false },
    files: { control: false },
    removeLabel: { control: false },
  },
  render: (args) => <ControlledUploader {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: "24rem" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {};

export const WithFiles: Story = { args: { files: FILES } };

export const SingleAndAccept: Story = {
  args: { accept: "application/pdf", label: "Report (PDF)", multiple: false },
};

export const MaxSize: Story = {
  args: { label: "Attachments, up to 1 MB", maxSize: 1_000_000 },
};

export const Disabled: Story = { args: { disabled: true, files: FILES } };

export const LongFileName: Story = {
  args: {
    files: [
      file(
        "2026-09-10_inspection-report_cooling-circuit_district-2_final-version-signed.pdf",
        2_345_678,
      ),
    ],
  },
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-5)", width: "20rem", maxWidth: "100%" }}>
      <FileUploader label="Empty" multiple />
      <FileUploader files={FILES} label="With files" multiple />
      <FileUploader disabled files={FILES.slice(0, 1)} label="Disabled" />
    </div>
  ),
};
