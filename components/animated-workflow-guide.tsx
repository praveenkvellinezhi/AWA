"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Edge,
  MarkerType,
  useReactFlow,
  useUpdateNodeInternals,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Workflow,
  Eye,
  Plus,
  Minus,
} from "lucide-react";
import { GuideStep } from "@/lib/types";
import { GuideStepNode, GuideStepNodeType } from "./guide-step-node";
import { AnimatedWorkflowEdge } from "./animated-workflow-edge";
import { calculateWorkflowLayout } from "@/lib/workflow-layout";
import { StepDetailModal } from "./step-detail-modal";

export interface AnimatedWorkflowGuideProps {
  steps: GuideStep[];
  category?: string;
  tool?: string;
  completedSteps?: number[];
  onToggleStep?: (stepNumber: number) => void;
  onImageClick?: (img: { url: string; title: string; caption?: string }) => void;
  accentColor?: string;
  autoplay?: boolean;
}

// Color-coded connections matching AWA theme palette (clean modern cyans, blues, and emeralds)
const CONNECTION_COLORS = [
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#10b981", // Emerald
  "#3b82f6", // Blue
  "#14b8a6", // Teal
  "#2563eb", // Royal Blue
  "#059669", // Dark Emerald
  "#0891b2", // Deep Cyan
];

const nodeTypes = {
  guideStep: GuideStepNode,
};

const edgeTypes = {
  animatedWorkflow: AnimatedWorkflowEdge,
};

function WorkflowFlowInner({
  steps,
  category = "image",
  tool = "AI Tool",
  completedSteps = [],
  onToggleStep,
  onImageClick,
  autoplay = false,
}: AnimatedWorkflowGuideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 1200;
  });

  const [measuredHeights, setMeasuredHeights] = useState<Record<number, number>>({});
  const [modalStepIndex, setModalStepIndex] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentRevealedIndex, setCurrentRevealedIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [drawingEdgeIndex, setDrawingEdgeIndex] = useState<number | null>(null);
  const [activeOutputNodeIndex, setActiveOutputNodeIndex] = useState<number | null>(0);
  const [activeInputNodeIndex, setActiveInputNodeIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { setViewport, zoomIn, zoomOut } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Responsive container width tracking via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const initialWidth = containerRef.current.clientWidth;
    if (initialWidth > 0) {
      setContainerWidth(initialWidth);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(containerRef.current);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setCurrentRevealedIndex(steps.length - 1);
      setActiveStepIndex(0);
      setIsPlaying(false);
    }

    return () => observer.disconnect();
  }, [steps.length]);

  // Handler to receive accurate rendered heights from node card ResizeObservers
  const handleNodeHeightMeasured = useCallback((idx: number, height: number) => {
    setMeasuredHeights((prev) => {
      const existing = prev[idx];
      if (existing && Math.abs(existing - height) <= 3) {
        return prev;
      }
      return { ...prev, [idx]: height };
    });
  }, []);

  // Viewport intersection observer to auto-start when in view (only if autoplay is enabled)
  useEffect(() => {
    if (!autoplay || hasStarted || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          setIsPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoplay, hasStarted, prefersReducedMotion]);

  // Sequential Reveal State Machine (for auto-play when user clicks Play)
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || !hasStarted) return;
    if (currentRevealedIndex >= steps.length - 1 && drawingEdgeIndex === null) {
      setIsPlaying(false);
      return;
    }

    const OUTPUT_HIGHLIGHT_DURATION = 350; // ms
    const EDGE_DRAW_DURATION = 650; // ms
    const INPUT_HIGHLIGHT_DURATION = 200; // ms

    let timer: NodeJS.Timeout;

    // Current step output activates
    setActiveOutputNodeIndex(currentRevealedIndex);

    // After output activates, begin drawing edge
    timer = setTimeout(() => {
      setDrawingEdgeIndex(currentRevealedIndex);

      // Edge travels towards next input node
      timer = setTimeout(() => {
        const nextIndex = currentRevealedIndex + 1;
        setActiveInputNodeIndex(nextIndex);

        // Next input activates, reveal next card
        timer = setTimeout(() => {
          setDrawingEdgeIndex(null);
          setActiveInputNodeIndex(null);
          setCurrentRevealedIndex(nextIndex);
          setActiveStepIndex(nextIndex);
          setActiveOutputNodeIndex(nextIndex);
        }, INPUT_HIGHLIGHT_DURATION);
      }, EDGE_DRAW_DURATION);
    }, OUTPUT_HIGHLIGHT_DURATION);

    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentRevealedIndex,
    steps.length,
    prefersReducedMotion,
    hasStarted,
    drawingEdgeIndex,
  ]);

  // Interactive Done & Connect Action Handler
  const handleCompleteAndConnect = useCallback(
    (idx: number) => {
      // 1. Mark this step as completed
      const stepNumber = steps[idx].step;
      if (!completedSteps.includes(stepNumber)) {
        onToggleStep?.(stepNumber);
      }

      // If it's the last step, mark active and finish
      if (idx >= steps.length - 1) {
        setActiveStepIndex(idx);
        return;
      }

      const nextIndex = idx + 1;

      // 2. Activate current node's output handle
      setActiveOutputNodeIndex(idx);

      // 3. Animate edge connector drawing towards next card
      const OUTPUT_PULSE_DURATION = 150; // ms
      const EDGE_TRAVEL_DURATION = 600; // ms
      const INPUT_PULSE_DURATION = 200; // ms

      setTimeout(() => {
        setDrawingEdgeIndex(idx);

        // 4. Edge reaches next node's input handle
        setTimeout(() => {
          setActiveInputNodeIndex(nextIndex);

          // 5. Reveal and activate next card
          setTimeout(() => {
            setDrawingEdgeIndex(null);
            setActiveInputNodeIndex(null);
            setCurrentRevealedIndex((prev) => Math.max(prev, nextIndex));
            setActiveStepIndex(nextIndex);
            setActiveOutputNodeIndex(nextIndex);
          }, INPUT_PULSE_DURATION);
        }, EDGE_TRAVEL_DURATION);
      }, OUTPUT_PULSE_DURATION);
    },
    [steps, completedSteps, onToggleStep]
  );

  // Dynamic Auto Layout Engine with measured DOM heights
  const layout = useMemo(() => {
    return calculateWorkflowLayout(steps, containerWidth, { measuredHeights });
  }, [steps, containerWidth, measuredHeights]);

  // Generate Node Data and Coordinates
  const nodes: GuideStepNodeType[] = useMemo(() => {
    return layout.nodes.map((layoutNode, idx) => {
      const step = layoutNode.step;
      const isRevealed = idx <= currentRevealedIndex;
      const isActive = idx === activeStepIndex;
      const isCompleted = completedSteps.includes(step.step);
      const isOutputActive = activeOutputNodeIndex === idx;
      const isInputActive = activeInputNodeIndex === idx;
      const accent = CONNECTION_COLORS[idx % CONNECTION_COLORS.length];

      return {
        id: layoutNode.id,
        type: "guideStep",
        position: { x: layoutNode.x, y: layoutNode.y },
        draggable: false,
        selectable: true,
        data: {
          step,
          isFirst: layoutNode.isFirst,
          isLast: layoutNode.isLast,
          isActive,
          isRevealed,
          isCompleted,
          isOutputActive,
          isInputActive,
          accentColor: accent,
          onToggleComplete: onToggleStep,
          onSelectStep: (sIdx: number) => {
            setActiveStepIndex(sIdx);
            if (sIdx > currentRevealedIndex) {
              setCurrentRevealedIndex(sIdx);
            }
            setModalStepIndex(sIdx);
          },
          onCompleteAndConnect: handleCompleteAndConnect,
          onImageClick,
          onHeightMeasured: handleNodeHeightMeasured,
          sourcePosition: layoutNode.sourcePosition,
          targetPosition: layoutNode.targetPosition,
          stepIndex: idx,
          nodeWidth: layout.nodeWidth,
        },
      };
    });
  }, [
    layout,
    currentRevealedIndex,
    activeStepIndex,
    completedSteps,
    activeOutputNodeIndex,
    activeInputNodeIndex,
    onToggleStep,
    onImageClick,
    handleNodeHeightMeasured,
    handleCompleteAndConnect,
  ]);

  // Generate Edges Connecting Steps with directional arrows
  const edges: Edge[] = useMemo(() => {
    const result: Edge[] = [];

    for (let i = 0; i < steps.length - 1; i++) {
      const sourceId = `node-${steps[i].step}`;
      const targetId = `node-${steps[i + 1].step}`;
      const isDrawing = drawingEdgeIndex === i;
      const isComplete = i < currentRevealedIndex;
      const accent = CONNECTION_COLORS[i % CONNECTION_COLORS.length];

      result.push({
        id: `edge-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        sourceHandle: "source",
        targetHandle: "target",
        type: "animatedWorkflow",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: accent,
        },
        data: {
          isDrawing,
          isComplete,
          accentColor: accent,
          duration: 0.65,
        },
      });
    }

    return result;
  }, [steps, drawingEdgeIndex, currentRevealedIndex]);

  // Sync React Flow node internals when column count, node positions, or heights change
  useEffect(() => {
    nodes.forEach((n) => updateNodeInternals(n.id));
  }, [layout.columns, layout.nodeWidth, layout.nodes, nodes, updateNodeInternals]);

  // Top-left viewport alignment callback ensuring steps start from the top-left
  const alignToTopLeft = useCallback(
    (animate = false) => {
      const paddingLeft = layout.isMobile ? 16 : 36;
      const paddingTop = layout.isMobile ? 20 : 32;

      const availWidth = containerWidth - paddingLeft * 2;
      let targetZoom = 1;
      if (layout.workflowWidth > availWidth && availWidth > 0) {
        targetZoom = Math.max(0.65, Math.min(1, availWidth / layout.workflowWidth));
      }

      const firstX = layout.nodes[0]?.x ?? paddingLeft;
      const firstY = layout.nodes[0]?.y ?? paddingTop;

      const targetX = paddingLeft - firstX * targetZoom;
      const targetY = paddingTop - firstY * targetZoom;

      setViewport(
        { x: targetX, y: targetY, zoom: targetZoom },
        animate ? { duration: 300 } : undefined
      );
    },
    [containerWidth, layout, setViewport]
  );

  // Position at top-left whenever layout or column count adjusts
  useEffect(() => {
    const timer = setTimeout(() => {
      alignToTopLeft(false);
    }, 60);

    return () => clearTimeout(timer);
  }, [layout.columns, layout.rows, steps.length, alignToTopLeft]);

  // Controls Handlers
  const handleReplay = useCallback(() => {
    setCurrentRevealedIndex(0);
    setActiveStepIndex(0);
    setDrawingEdgeIndex(null);
    setActiveOutputNodeIndex(0);
    setActiveInputNodeIndex(null);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (!isPlaying) {
      setHasStarted(true);
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleNext = useCallback(() => {
    if (currentRevealedIndex < steps.length - 1) {
      const next = currentRevealedIndex + 1;
      setCurrentRevealedIndex(next);
      setActiveStepIndex(next);
      setDrawingEdgeIndex(null);
      setActiveOutputNodeIndex(next);
    }
  }, [currentRevealedIndex, steps.length]);

  const handlePrev = useCallback(() => {
    if (activeStepIndex > 0) {
      const prev = activeStepIndex - 1;
      setActiveStepIndex(prev);
    }
  }, [activeStepIndex]);

  const handleShowAll = useCallback(() => {
    setCurrentRevealedIndex(steps.length - 1);
    setIsPlaying(false);
    setDrawingEdgeIndex(null);
  }, [steps.length]);

  const handleFitView = useCallback(() => {
    alignToTopLeft(true);
  }, [alignToTopLeft]);

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 });
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 });
  }, [zoomOut]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#080b11] overflow-hidden shadow-2xl flex flex-col"
    >
      {/* Workflow Navigation & Control Toolbar */}
      <div className="px-4 py-3 bg-white dark:bg-[#0d121c] border-b border-slate-200 dark:border-slate-800/90 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-wide uppercase">
              AI Workflow Canvas
            </span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Step {activeStepIndex + 1} of {steps.length}
          </span>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 dark:bg-slate-800/70 dark:border-slate-700/60 text-[10px] font-mono text-cyan-700 dark:text-cyan-300">
            {layout.isMobile
              ? "Vertical Flow"
              : `${layout.columns} Columns • Serpentine Flow`}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/80 transition-colors"
            title="Zoom out"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/80 transition-colors"
            title="Zoom in"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          {/* Fit View / Center Canvas */}
          <button
            type="button"
            onClick={handleFitView}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/80 transition-colors"
            title="Fit workflow to canvas"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

          {/* Replay Guide */}
          <button
            type="button"
            onClick={handleReplay}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white dark:border-slate-700/80 flex items-center gap-1.5 transition-colors shadow-xs"
            title="Replay sequence from Step 1"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-950 border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white dark:border-slate-700/80 flex items-center gap-1.5 transition-colors shadow-xs"
            title={isPlaying ? "Pause workflow animation" : "Resume workflow animation"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Auto-play</span>
              </>
            )}
          </button>

          {/* Prev Step */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 disabled:opacity-40 disabled:pointer-events-none border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/80 transition-colors"
            title="Previous step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentRevealedIndex === steps.length - 1}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 disabled:opacity-40 disabled:pointer-events-none border border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/80 transition-colors"
            title="Next step"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Show All Steps */}
          {currentRevealedIndex < steps.length - 1 && (
            <button
              type="button"
              onClick={handleShowAll}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-xs font-semibold text-cyan-800 border border-cyan-200 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800/60 flex items-center gap-1 transition-colors"
              title="Reveal all steps immediately"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reveal All</span>
            </button>
          )}
        </div>
      </div>

      {/* React Flow Canvas Window */}
      <div
        className="w-full relative overflow-hidden select-none"
        style={{ height: `${layout.canvasHeight}px` }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={true}
          preventScrolling={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.5}
          maxZoom={1.2}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        >
          {/* Subtle Ambient Dot Grid Canvas */}
          <Background color="#94a3b8" gap={24} size={1.2} />
        </ReactFlow>
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-[#0a0d14] border-t border-slate-200 dark:border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
          <Workflow className="h-3 w-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>Click any card to view detailed explanation • Click Done to connect next • Drag to pan</span>
        </span>

        <span className="text-slate-500 hidden sm:inline">
          {tool} Sequential Pipeline ({steps.length} Steps)
        </span>
      </div>

      {/* Detailed Step Explanation Modal */}
      <StepDetailModal
        isOpen={modalStepIndex !== null}
        step={modalStepIndex !== null && steps[modalStepIndex] ? steps[modalStepIndex] : null}
        stepIndex={modalStepIndex ?? 0}
        totalSteps={steps.length}
        isCompleted={
          modalStepIndex !== null && steps[modalStepIndex]
            ? completedSteps.includes(steps[modalStepIndex].step)
            : false
        }
        toolName={tool}
        hasPrev={modalStepIndex !== null && modalStepIndex > 0}
        hasNext={modalStepIndex !== null && modalStepIndex < steps.length - 1}
        onClose={() => setModalStepIndex(null)}
        onPrevStep={() => {
          if (modalStepIndex !== null && modalStepIndex > 0) {
            const prevIdx = modalStepIndex - 1;
            setModalStepIndex(prevIdx);
            setActiveStepIndex(prevIdx);
          }
        }}
        onNextStep={() => {
          if (modalStepIndex !== null && modalStepIndex < steps.length - 1) {
            const nextIdx = modalStepIndex + 1;
            setModalStepIndex(nextIdx);
            setActiveStepIndex(nextIdx);
            if (nextIdx > currentRevealedIndex) {
              setCurrentRevealedIndex(nextIdx);
            }
          }
        }}
        onToggleComplete={onToggleStep}
        onDoneAndConnect={handleCompleteAndConnect}
        onImageClick={onImageClick}
      />
    </div>
  );
}

export function AnimatedWorkflowGuide(props: AnimatedWorkflowGuideProps) {
  return (
    <ReactFlowProvider>
      <WorkflowFlowInner {...props} />
    </ReactFlowProvider>
  );
}
