import type { TreeCollection } from "@ark-ui/react/tree-view";
import { createTreeCollection, TreeView } from "@ark-ui/react/tree-view";
import type { HTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import styles from "./Tree.module.css";

export interface TreeNode {
  id: string;
  label: string;

  icon?: ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  nodes: TreeNode[];

  expanded?: string[];
  onExpandedChange?: (ids: string[]) => void;

  selected?: string | undefined;
  onSelectedChange?: (id: string | undefined) => void;

  emptyText?: string;
}

const ROOT = " root";

export function Tree({
  nodes,
  expanded,
  onExpandedChange,
  selected,
  onSelectedChange,
  emptyText,
  id,
  className,
  ...rest
}: TreeProps) {
  const collection = useMemo(
    () =>
      createTreeCollection<TreeNode>({
        rootNode: { id: ROOT, label: "", children: nodes },
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.label,
        nodeToChildren: (node) => node.children ?? [],
        isNodeDisabled: (node) => node.disabled === true,
      }),
    [nodes],
  );
  const empty = nodes.length === 0;

  return (
    <TreeView.Root
      {...rest}
      className={joinClassNames(styles.root, className)}
      collection={collection}
      data-empty={empty ? "" : undefined}
      expandedValue={expanded}
      ids={id === undefined ? undefined : { root: id }}
      onExpandedChange={(details) => onExpandedChange?.(details.expandedValue)}
      onSelectionChange={(details) => onSelectedChange?.(details.selectedValue[0])}
      selectedValue={selected === undefined ? undefined : [selected]}
      selectionMode="single"
    >
      {empty ? (
        <p className={styles.empty}>{emptyText ?? t("tree.empty")}</p>
      ) : (
        <TreeView.Tree>
          {nodes.map((node, index) => (
            <TreeItem collection={collection} indexPath={[index]} key={node.id} node={node} />
          ))}
        </TreeView.Tree>
      )}
    </TreeView.Root>
  );
}

interface TreeItemProps {
  node: TreeNode;
  indexPath: number[];
  collection: TreeCollection<TreeNode>;
}

function TreeItem({ node, indexPath, collection }: TreeItemProps) {
  const icon =
    node.icon === undefined ? undefined : (
      <span aria-hidden="true" className={styles.icon}>
        {node.icon}
      </span>
    );

  if (!collection.isBranchNode(node)) {
    return (
      <TreeView.NodeProvider indexPath={indexPath} node={node}>
        <TreeView.Item className={styles.row}>
          {}
          <span className={styles.indicator} />
          {icon}
          <TreeView.ItemText className={styles.label}>{node.label}</TreeView.ItemText>
        </TreeView.Item>
      </TreeView.NodeProvider>
    );
  }

  return (
    <TreeView.NodeProvider indexPath={indexPath} node={node}>
      <TreeView.Branch>
        <TreeView.BranchControl className={styles.row}>
          <TreeView.BranchIndicator className={styles.indicator}>
            <svg aria-hidden="true" className={styles.chevron} viewBox="0 0 16 16">
              <path
                d="M6 4l4 4-4 4"
                fill="none"
                stroke="currentcolor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </TreeView.BranchIndicator>
          {icon}
          <TreeView.BranchText className={styles.label}>{node.label}</TreeView.BranchText>
        </TreeView.BranchControl>
        <TreeView.BranchContent>
          {collection.getNodeChildren(node).map((child, index) => (
            <TreeItem
              collection={collection}
              indexPath={[...indexPath, index]}
              key={child.id}
              node={child}
            />
          ))}
        </TreeView.BranchContent>
      </TreeView.Branch>
    </TreeView.NodeProvider>
  );
}
