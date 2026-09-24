import { Position } from "@xyflow/react";
import { GuideStep } from "./types";

export interface WorkflowLayoutNode {
  id: string;
  step: GuideStep;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
  sourcePosition: Position;
  targetPosition: Position;
  isFirst: boolean;
  isLast: boolean;
}

export interface WorkflowLayoutResult {
  nodes: WorkflowLayoutNode[];
  columns: number;
  rows: number;
  workflowWidth: number;
  workflowHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  offsetX: number;
  offsetY: number;
  nodeWidth: number;
  gapX: number;
  gapY: number;
  isMobile: boolean;
  isTablet: boolean;
}

export interface WorkflowLayoutOptions {
  isMobileOverride?: boolean;
  measuredHeights?: Record<number, number>;
  minNodeWidth?: number;
  maxNodeWidth?: number;
  minGapX?: number;
  maxGapX?: number;
  minGapY?: number;
  maxGapY?: number;
}

/**
 * Estimates the vertical content height for a given guide step card.
 * Accounts for padding, multi-line titles, long descriptions, screenshot previews, and tip boxes.
 * Handles both standard GuideStep fields and UsageStep field aliases (instruction, imageUrl).
 */
export function estimateStepHeight(step: GuideStep, cardWidth: number = 320): number {
  const stepObj = step as unknown as Record<string, unknown>;
  const desc = step.description || (stepObj.instruction as string) || "";
  const img = step.image || (stepObj.imageUrl as string);
  const tip = step.tip || "";
  const title = step.title || "";

  // Base card outer padding (p-4 / p-5: 40px) + border (2px)
  let h = 42;

  // Header section: Step circular button (36px + 12px gap) + Title + Status badges
  // Text area width: cardWidth - padding (40px) - badge/gap (48px)
  const textWidth = Math.max(180, cardWidth - 88);
  const charsPerTitleLine = Math.floor(textWidth / 8.5);
  const titleLines = Math.max(1, Math.ceil(title.length / charsPerTitleLine));
  h += titleLines * 24 + 8;

  // Description section: text-xs leading-relaxed (~19.5px line height)
  if (desc.length > 0) {
    const charsPerDescLine = Math.floor(textWidth / 6.8);
    const descLines = Math.max(1, Math.ceil(desc.length / charsPerDescLine));
    h += descLines * 20 + 10;
  }

  // Preview image container: mt-3.5 (14px) + h-28 / h-32 (128px) + borders/caption
  if (img) {
    h += 14 + 130 + 6;
  }

  // Helpful tip callout: mt-3 (12px) + py-2 px-3 (16px) + icon + text lines
  if (tip.length > 0) {
    const tipTextWidth = Math.max(160, cardWidth - 76);
    const charsPerTipLine = Math.floor(tipTextWidth / 6.5);
    const tipLines = Math.max(1, Math.ceil(tip.length / charsPerTipLine));
    h += 12 + 16 + tipLines * 18 + 6;
  }

  // Action bar: mt-4 (16px) + pt-3 (12px) + button (36px)
  h += 64;

  // Safety buffer to ensure baseline estimates never clip content before DOM measurements
  return h + 24;
}

/**
 * Reusable dynamic auto-layout engine for responsive serpentine and vertical workflows.
 * Calculates exact node coordinates, row/column indices, handle anchor directions,
 * canvas bounding box, and centering offsets.
 */
export function calculateWorkflowLayout(
  steps: GuideStep[],
  containerWidth: number,
  options?: WorkflowLayoutOptions
): WorkflowLayoutResult {
  const count = steps.length;

  if (count === 0) {
    return {
      nodes: [],
      columns: 1,
      rows: 0,
      workflowWidth: 0,
      workflowHeight: 0,
      canvasWidth: containerWidth,
      canvasHeight: 520,
      offsetX: 0,
      offsetY: 0,
      nodeWidth: 320,
      gapX: 80,
      gapY: 80,
      isMobile: false,
      isTablet: false,
    };
  }

  const isMobile = options?.isMobileOverride ?? (containerWidth < 680);
  const isTablet = !isMobile && containerWidth < 1050;

  let columns = 1;
  let nodeWidth = 320;
  let gapX = 80;
  let gapY = isMobile ? 60 : 90;
  const paddingX = isMobile ? 16 : 40;
  const availWidth = Math.max(containerWidth - 2 * paddingX, 280);

  if (isMobile) {
    // ------------------------------------------------------------------------
    // Mobile Mode: Clean, single-column vertical pipeline
    // ------------------------------------------------------------------------
    columns = 1;
    nodeWidth = Math.max(280, Math.min(availWidth, 340));
    gapX = 0;
    gapY = 60;
  } else if (isTablet) {
    // ------------------------------------------------------------------------
    // Tablet Mode: 2 columns max (or 1 if single step)
    // ------------------------------------------------------------------------
    columns = Math.min(2, count);
    if (columns === 1) {
      nodeWidth = Math.min(availWidth, 360);
      gapX = 0;
    } else {
      gapX = Math.min(85, Math.max(60, Math.floor((availWidth - 2 * 310) / 2)));
      nodeWidth = Math.min(345, Math.max(280, Math.floor((availWidth - gapX) / 2)));
      gapY = 85;
    }
  } else {
    // ------------------------------------------------------------------------
    // Desktop Mode: Multi-column serpentine layout (3-4 columns on large screens)
    // ------------------------------------------------------------------------
    const maxColsByWidth = Math.max(1, Math.min(4, Math.floor((availWidth + 60) / (295 + 60))));

    if (count <= 2) {
      columns = count;
    } else if (count === 3) {
      columns = Math.min(3, maxColsByWidth);
    } else if (count === 4) {
      columns = maxColsByWidth >= 4 ? 4 : 2;
    } else if (count === 5) {
      columns = Math.min(3, maxColsByWidth);
    } else if (count === 6) {
      columns = Math.min(3, maxColsByWidth);
    } else if (count >= 7 && count <= 8) {
      columns = Math.min(4, maxColsByWidth);
    } else {
      columns = Math.min(4, maxColsByWidth);
    }

    columns = Math.max(1, Math.min(columns, count));

    if (columns === 1) {
      nodeWidth = Math.min(availWidth, 360);
      gapX = 0;
    } else {
      const idealGap = Math.min(95, Math.max(65, Math.floor((availWidth - columns * 315) / (columns + 1))));
      gapX = idealGap;
      nodeWidth = Math.min(345, Math.max(285, Math.floor((availWidth - (columns - 1) * gapX) / columns)));
      gapY = 90;
    }
  }

  const rows = Math.ceil(count / columns);
  const workflowWidth = columns === 1 ? nodeWidth : columns * nodeWidth + (columns - 1) * gapX;

  // Calculate row heights using measured heights from DOM if available, otherwise accurate baseline formula
  const rowHeights: number[] = [];
  for (let r = 0; r < rows; r++) {
    const stepsInRow: { step: GuideStep; idx: number }[] = [];
    for (let c = 0; c < columns; c++) {
      const idx = r * columns + c;
      if (idx < count) {
        stepsInRow.push({ step: steps[idx], idx });
      }
    }

    const maxH = Math.max(
      ...stepsInRow.map(({ step, idx }) => {
        if (options?.measuredHeights && typeof options.measuredHeights[idx] === "number") {
          return options.measuredHeights[idx];
        }
        return estimateStepHeight(step, nodeWidth);
      }),
      220
    );

    rowHeights.push(maxH);
  }

  // Row Y positions
  const rowY: number[] = [];
  let currentY = 0;
  for (let r = 0; r < rows; r++) {
    rowY.push(currentY);
    currentY += rowHeights[r] + gapY;
  }
  const workflowHeight = currentY - gapY;

  // Canvas bounds & top-left aligned offsets
  // Steps consistently start from the top-left corner with comfortable padding
  const offsetX = paddingX;
  const offsetY = isMobile ? 20 : 32;
  const minCanvasHeight = isMobile ? 380 : 420;
  const canvasHeight = Math.max(minCanvasHeight, workflowHeight + offsetY + (isMobile ? 28 : 40));

  // Generate nodes with coordinates and exact handle directions
  const nodes: WorkflowLayoutNode[] = steps.map((step, idx) => {
    const row = Math.floor(idx / columns);
    const isEvenRow = row % 2 === 0;
    const colInRow = idx % columns;
    // Serpentine alternating direction: Even rows flow L->R, Odd rows flow R->L
    const col = isEvenRow ? colInRow : (columns - 1) - colInRow;

    const x = offsetX + col * (nodeWidth + gapX);
    const y = offsetY + rowY[row];
    const height = rowHeights[row];

    const isFirst = idx === 0;
    const isLast = idx === count - 1;

    // Incoming handle direction (connected from idx - 1)
    let targetPos = Position.Left;
    if (isFirst) {
      targetPos = isMobile ? Position.Top : Position.Left;
    } else {
      const prevRow = Math.floor((idx - 1) / columns);
      const prevIsEven = prevRow % 2 === 0;
      const prevColInRow = (idx - 1) % columns;
      const prevCol = prevIsEven ? prevColInRow : (columns - 1) - prevColInRow;

      if (row > prevRow) {
        // Vertical transition between rows (always top handle in serpentine layout)
        targetPos = Position.Top;
      } else if (col > prevCol) {
        // Moving Left to Right -> enters from Left
        targetPos = Position.Left;
      } else {
        // Moving Right to Left -> enters from Right
        targetPos = Position.Right;
      }
    }

    // Outgoing handle direction (connected to idx + 1)
    let sourcePos = Position.Right;
    if (isLast) {
      sourcePos = isMobile ? Position.Bottom : Position.Right;
    } else {
      const nextRow = Math.floor((idx + 1) / columns);
      const nextIsEven = nextRow % 2 === 0;
      const nextColInRow = (idx + 1) % columns;
      const nextCol = nextIsEven ? nextColInRow : (columns - 1) - nextColInRow;

      if (nextRow > row) {
        // Vertical transition to next row (always exits from bottom)
        sourcePos = Position.Bottom;
      } else if (nextCol > col) {
        // Moving Left to Right -> exits to Right
        sourcePos = Position.Right;
      } else {
        // Moving Right to Left -> exits to Left
        sourcePos = Position.Left;
      }
    }

    return {
      id: `node-${step.step}`,
      step,
      x,
      y,
      width: nodeWidth,
      height,
      row,
      col,
      sourcePosition: sourcePos,
      targetPosition: targetPos,
      isFirst,
      isLast,
    };
  });

  return {
    nodes,
    columns,
    rows,
    workflowWidth,
    workflowHeight,
    canvasWidth: containerWidth,
    canvasHeight,
    offsetX,
    offsetY,
    nodeWidth,
    gapX,
    gapY,
    isMobile,
    isTablet,
  };
}
