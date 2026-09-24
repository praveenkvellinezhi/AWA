"use client";

import React, { memo } from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";
import { motion } from "motion/react";

export interface AnimatedWorkflowEdgeData extends Record<string, unknown> {
  isDrawing?: boolean;
  isComplete?: boolean;
  accentColor?: string;
  duration?: number;
}

function AnimatedWorkflowEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isDrawing = Boolean(data?.isDrawing);
  const isComplete = Boolean(data?.isComplete);
  const accentColor = (data?.accentColor as string) || "#06b6d4";
  const duration = (data?.duration as number) || 0.7;

  return (
    <g className="workflow-edge group/edge pointer-events-none">
      {/* Background Track / Soft Glow Tube */}
      <path
        id={`${id}-bg`}
        d={edgePath}
        fill="none"
        stroke={isComplete ? "rgba(255, 255, 255, 0.08)" : isDrawing ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)"}
        strokeWidth={isComplete ? 3 : 2}
        strokeDasharray={!isComplete && !isDrawing ? "5 5" : undefined}
        strokeLinecap="round"
      />

      {/* When actively drawing: Smooth stroke path drawing animation with glow */}
      {isDrawing && (
        <motion.path
          id={`${id}-drawing`}
          d={edgePath}
          fill="none"
          stroke={accentColor}
          strokeWidth={2.8}
          strokeLinecap="round"
          markerEnd={markerEnd}
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration,
            ease: "easeInOut",
          }}
          style={{
            filter: `drop-shadow(0 0 8px ${accentColor}) drop-shadow(0 0 2px ${accentColor})`,
          }}
        />
      )}

      {/* When completed: Persistent subtle colored connection with ambient glow & directional arrow */}
      {isComplete && (
        <>
          <path
            id={`${id}-complete`}
            d={edgePath}
            fill="none"
            stroke={accentColor}
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={0.85}
            markerEnd={markerEnd}
            style={{
              filter: `drop-shadow(0 0 5px ${accentColor})`,
            }}
          />

          {/* Subtle gliding dot along the completed edge */}
          <circle r={3} fill="#ffffff">
            <animateMotion
              path={edgePath}
              dur="3s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>
        </>
      )}
    </g>
  );
}

export const AnimatedWorkflowEdge = memo(AnimatedWorkflowEdgeComponent);
