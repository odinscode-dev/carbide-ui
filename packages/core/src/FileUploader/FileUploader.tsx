import { useFieldsetContext } from "@ark-ui/react/fieldset";
import { FileUpload as Ark } from "@ark-ui/react/file-upload";
import { useState } from "react";
import { Button } from "../Button/Button.js";
import { formatBytes } from "../format/bytes.js";
import { t } from "../i18n/t.js";
import styles from "./FileUploader.module.css";

type FileRejection = Ark.FileRejection;

export interface FileUploaderProps {
  label: string;

  accept?: string | string[] | undefined;

  multiple?: boolean | undefined;

  maxSize?: number | undefined;
  files?: readonly File[] | undefined;
  onFilesChange?: ((files: File[]) => void) | undefined;
  disabled?: boolean | undefined;

  chooseText?: string | undefined;

  dropText?: string | undefined;

  removeLabel?: ((file: File) => string) | undefined;

  name?: string | undefined;

  id?: string | undefined;
}

export function FileUploader({
  label,
  accept,
  multiple = false,
  maxSize,
  files = [],
  onFilesChange,
  disabled = false,
  chooseText,
  dropText,
  removeLabel,
  name,
  id,
}: FileUploaderProps) {
  const fieldset = useFieldsetContext();
  const locked = disabled || fieldset?.disabled === true;
  const [rejected, setRejected] = useState<readonly FileRejection[]>([]);
  const removeText = removeLabel ?? ((file: File) => t("fileUploader.remove", { name: file.name }));

  const errorText = (rejection: FileRejection): string => {
    const [error] = rejection.errors;
    if (error === "FILE_TOO_LARGE" && maxSize !== undefined) {
      return t("fileUploader.error.size", { maxSize: formatBytes(maxSize) });
    }
    if (error === "FILE_INVALID_TYPE") {
      return t("fileUploader.error.type");
    }
    if (error === "TOO_MANY_FILES") {
      return t("fileUploader.error.count");
    }
    return t("fileUploader.error.invalid");
  };

  return (
    <Ark.Root
      accept={accept}
      acceptedFiles={[...files]}
      className={styles.root}
      data-empty={files.length === 0 && rejected.length === 0 ? "" : undefined}
      disabled={locked}
      ids={id === undefined ? undefined : { hiddenInput: id }}
      invalid={rejected.length > 0}
      maxFiles={multiple ? Number.POSITIVE_INFINITY : 1}
      maxFileSize={maxSize}
      name={name}
      onFileAccept={(details) => onFilesChange?.(details.files)}
      onFileReject={(details) => setRejected(details.files)}
      translations={{ deleteFile: removeText }}
    >
      <Ark.Label className={styles.label}>{label}</Ark.Label>
      <Ark.Dropzone className={styles.dropzone}>
        <Ark.Trigger asChild>
          <Button variant="secondary">{chooseText ?? t("fileUploader.choose")}</Button>
        </Ark.Trigger>
        <span className={styles.hint}>{dropText ?? t("fileUploader.drop")}</span>
      </Ark.Dropzone>
      <Ark.HiddenInput />
      {(files.length > 0 || rejected.length > 0) && (
        <Ark.ItemGroup className={styles.list}>
          {files.map((file) => (
            <Ark.Item className={styles.item} file={file} key={`${file.name}:${file.size}`}>
              <Ark.ItemName className={styles.name} />
              <Ark.ItemSizeText className={styles.size}>{formatBytes(file.size)}</Ark.ItemSizeText>
              <Ark.ItemDeleteTrigger className={styles.remove}>
                <Cross />
              </Ark.ItemDeleteTrigger>
            </Ark.Item>
          ))}
          {rejected.map((rejection) => (
            <li
              className={styles.item}
              data-invalid=""
              key={`${rejection.file.name}:${rejection.file.size}`}
            >
              <span className={styles.name}>{rejection.file.name}</span>
              <span className={styles.size}>{formatBytes(rejection.file.size)}</span>
              <button
                aria-label={removeText(rejection.file)}
                className={styles.remove}
                onClick={() =>
                  setRejected((previous) => previous.filter((r) => r.file !== rejection.file))
                }
                type="button"
              >
                <Cross />
              </button>
              <span className={styles.error}>{errorText(rejection)}</span>
            </li>
          ))}
        </Ark.ItemGroup>
      )}
    </Ark.Root>
  );
}

function Cross() {
  return (
    <svg aria-hidden="true" className={styles.glyph} viewBox="0 0 16 16">
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
