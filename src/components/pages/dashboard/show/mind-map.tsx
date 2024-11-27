'use client';

import type {
  NodeProps,
} from '@xyflow/react';
import {
  Background,
  Handle,
  Position,
  ReactFlow,
} from '@xyflow/react';

import { BaseNode } from '@/components/base-node';

const defaultNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    type: 'customNode',
    data: {
      label: 'Custom Node',
    },
  },
];

const nodeTypes = {
  customNode: CustomNode,
};

function CustomNode({ data }: NodeProps) {
  return (
    <BaseNode>
      <>
        {data.label}
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </>
    </BaseNode>
  );
}

export default function MindMap() {
  return (
    <div className="size-full">
      <ReactFlow defaultNodes={defaultNodes} nodeTypes={nodeTypes} fitView>
        <Background />
      </ReactFlow>
    </div>
  );
}
