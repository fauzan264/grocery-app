"use client";

import React from "react";

export type CategoryNode = {
  id: string;
  name: string;
  children?: CategoryNode[];
};

type Props = {
  tree: CategoryNode[] | null;
  onSelect?: (id: string, name: string) => void;
  className?: string;
};

export default function CategoryTree({ tree, onSelect, className }: Props) {
  if (!tree || tree.length === 0) {
    return <div className="text-sm text-slate-500">Tidak ada kategori.</div>;
  }

  const renderNode = (node: CategoryNode) => {
    return (
      <li key={node.id} className="mb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect?.(node.id, node.name)}
            className="text-sm text-left hover:underline"
          >
            {node.name}
          </button>
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="pl-4 mt-2 border-l border-slate-100">
            {node.children.map((c) => renderNode(c))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={className}>
      <ul className="space-y-2">{tree.map((n) => renderNode(n))}</ul>
    </div>
  );
}