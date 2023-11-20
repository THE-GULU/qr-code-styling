import cornerSquareTypes from "../../../constants/cornerSquareTypes";
import { CornerSquareType, RotateFigureArgsCanvas, BasicFigureDrawArgsCanvas, DrawArgsCanvas } from "../../../types";
import { getZigZagRectPath } from "../../../tools/zigZagPath";

export default class QRCornerSquare {
  _context: CanvasRenderingContext2D;
  _type: CornerSquareType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: CornerSquareType }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.zigZag:
        drawFunction = this._drawZigZag;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, context, rotation });
  }

  _rotateFigure({ x, y, size, context, rotation = 0, draw }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    draw();
    context.closePath();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
        context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
        context.rect(-size / 2 + dotSize, -size / 2 + dotSize, size - 2 * dotSize, size - 2 * dotSize);
      }
    });
  }

  _basicZigZag(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.scale(0.9, 0.9);
        getZigZagRectPath(
          size / 12,
          size / 3,
          { right: -size / 2, left: 0, top: 0, bottom: -size / 2, width: size, height: size },
          "vertical",
          { offset: { dx: -size / 2, dy: -size / 2 }, ending: size / 2, stroke: dotSize },
          context
        );
        context.scale(1.1111, 1.1111);
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -3.5 * dotSize);
        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, -dotSize);
        context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 3.5 * dotSize);
        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-3.5 * dotSize, -dotSize);

        context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -2.5 * dotSize);
        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, -dotSize);
        context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 2.5 * dotSize);
        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-2.5 * dotSize, -dotSize);
      }
    });
  }

  _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDot({ x, y, size, context, rotation });
  }

  _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicSquare({ x, y, size, context, rotation });
  }

  _drawExtraRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicExtraRounded({ x, y, size, context, rotation });
  }

  _drawZigZag({ x, y, size, context }: DrawArgsCanvas): void {
    this._basicZigZag({ x, y, size, context, rotation: 0 });
  }
}
