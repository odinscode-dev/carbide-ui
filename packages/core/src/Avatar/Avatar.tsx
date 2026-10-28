import { Avatar as Ark } from "@ark-ui/react/avatar";
import styles from "./Avatar.module.css";

export type AvatarRole = "admin" | "client";

export interface AvatarProps {
  name: string;

  src?: string | undefined;
  accountRole?: AvatarRole | undefined;
}

export function Avatar({ name, src, accountRole }: AvatarProps) {
  return (
    <Ark.Root
      aria-label={name}
      className={styles.root}
      data-image={src === undefined ? undefined : ""}
      data-role={accountRole}
    >
      {src !== undefined && <Ark.Image alt="" className={styles.image} src={src} />}
      <Ark.Fallback aria-hidden="true" className={styles.fallback}>
        <span className={styles.name}>{name}</span>
      </Ark.Fallback>
    </Ark.Root>
  );
}
