const Axis = {
    horizontal: 'horizontal',
    vertical: 'vertical',
  }
  
  const point = (x: number, y: number) => {
    return { x, y }
  }
  
  const getOffset = (dx: number, dy: number) => {
    return { dx, dy }
  }
  
  /// reference https://www.desmos.com/calculator/mcrxahzmm0
  const getZigZagAxisCoordinate = (triangleHeight: number, triangleBase: number, coordinate: any, { shift = 0 }) => {
    return Math.abs((coordinate + shift) / triangleBase - Math.floor((coordinate + shift) / triangleBase) - 0.5) * triangleHeight * 2
  }
  
  const getZigZagPointList = (triangleHeight: number, triangleBase: number, rect: any, axis: string, { offset, ending, shift = 0 }: any) => {
    // assert(!rect.isEmpty);
    // assert(ending == null || ending <= rect.right);
    // assert(!shift.isNegative);
  
    // offset ??= rect.topLeft;
  
    const pointList = []
  
    switch (axis) {
      case Axis.horizontal: {
        // ending ??= rect.bottom;
        let startX = getZigZagAxisCoordinate(triangleHeight, triangleBase, 0, { shift: shift })
        let startY = 0
  
        pointList.push(point(startX + offset.dx, startY + offset.dy))
        startY = startY + triangleBase / 2 - (shift % (triangleBase / 2))
        while (startY < rect.height) {
          const shiftX = getZigZagAxisCoordinate(triangleHeight, triangleBase, startY, { shift: shift })
          pointList.push(point(shiftX + offset.dx, startY + offset.dy))
          const nextStartY = startY + triangleBase / 2
          if (nextStartY >= rect.height) {
            const shiftX = getZigZagAxisCoordinate(triangleHeight, triangleBase, rect.height, { shift: shift })
            pointList.push(point(shiftX + offset.dx, ending))
            break
          }
          startY = nextStartY
        }
        break
      }
  
      case Axis.vertical:
        // ending ??= rect.right;
        let startX = 0
        let startY = getZigZagAxisCoordinate(triangleHeight, triangleBase, 0, { shift: shift })
        pointList.push(point(startX + offset.dx, startY + offset.dy))
        startX = startX + triangleBase / 2 - (shift % (triangleBase / 2))
        while (startX < rect.width) {
          const shiftY = getZigZagAxisCoordinate(triangleHeight, triangleBase, startX, { shift: shift })
          pointList.push(point(startX + offset.dx, shiftY + offset.dy))
          const nextStartX = startX + triangleBase / 2
          if (nextStartX >= rect.width) {
            const shiftY = getZigZagAxisCoordinate(triangleHeight, triangleBase, rect.width, { shift: shift })
            pointList.push(point(ending, shiftY + offset.dy))
            break
          }
          startX = nextStartX
        }
        break
      default:
    }
  
    return pointList
  }
  
  /// [start] bottom starting point of zigzag
  export const getZigZagPath = (triangleHeight: number, triangleBase: number, rect: any, axis: string, { offset, ending, shift = 0 }: any, ctx: any) => {
    // assert(!rect.isEmpty);
    // assert(ending == null || ending <= rect.right);
    // assert(!shift.isNegative);
    // const canvas = document.createElement('canvas');
    // const path = canvas.getContext("2d");
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    const pointList = getZigZagPointList(triangleHeight, triangleBase, rect, axis, { offset: offset, ending: ending, shift: shift })
    ctx.moveTo(pointList[0].x, pointList[0].y)
    for (const { x, y } of pointList.slice(1)) {
      ctx.lineTo(x, y)
    }
    // path.extendWithPath(topZigZagPath, getOffset(0,0));
    ctx.translate(offset.x || 0, offset.y || 0)
    ctx.stroke()
  }
  
  export const getZigZagRectPath = (triangleHeight: number, triangleBase: number, rect: any, axis: string, { offset, ending, shift = 0, clipStart = true, clipEnd = true, stroke=1 }: any, ctx: any) => {
    ctx.lineWidth = stroke
    const topPointList = getZigZagPointList(triangleHeight, triangleBase, rect, axis, { offset: offset, ending: ending, shift: shift})
    const bottomPointList = getZigZagPointList(triangleHeight, triangleBase, rect, axis, { offset: offset, ending: ending, shift: triangleBase / 2 })
    switch (axis) {
      case Axis.horizontal:
        if (clipStart) {
          ctx.moveTo(topPointList[0].x, topPointList[0].y)
          for (const point of topPointList.slice(1)) {
            ctx.lineTo(point.x, point.y)
          }
          // path.extendWithPath(topZigZagPath, getOffset(0, 0))
        } else {
          ctx.moveTo(rect.left, rect.top)
          ctx.lineTo(rect.left, rect.bottom)
        }
  
        // bottom zigzag path
        if (clipEnd) {
          const reversedPointList = bottomPointList.reverse()
          ctx.moveTo(reversedPointList[0].x, reversedPointList[0].y)
          for (const point of reversedPointList.slice(1)) {
            ctx.lineTo(point.x, point.y)
          }
  
          ctx.lineTo(rect.width - triangleHeight, 0)
          // path.extendWithPath(bottomZigZagPath, getOffset(rect.width - triangleHeight, 0))
  
        } else {
          ctx.lineTo(rect.right, rect.bottom)
          ctx.lineTo(rect.right, rect.top)
        }
        break
  
      case Axis.vertical:
        if (clipStart) {
          const reversedPointList = bottomPointList.reverse()
          ctx.moveTo(topPointList[0].x, topPointList[0].y)
          for (const point of topPointList.slice(1)) {
            ctx.lineTo(point.x, point.y)
          }
          // ctx.lineTo(rect.right, topPointList[topPointList.length-1].y)
          ctx.lineTo(topPointList[topPointList.length-1].x, reversedPointList[0].y+ (rect.height - triangleHeight))
          // path.extendWithPath(topZigZagPath, offset.zero)
        } else {
          ctx.moveTo(rect.left, rect.top)
          ctx.lineTo(rect.right, rect.top)
        }
  
        if (clipEnd) {
          const reversedPointList = bottomPointList //rever ver
          ctx.lineTo(reversedPointList[0].x, reversedPointList[0].y + (rect.height - triangleHeight))
          for (const point of reversedPointList.slice(1)) {
            ctx.lineTo(point.x, point.y + (rect.height - triangleHeight))
          }
          // ctx.lineTo(0, rect.height - triangleHeight)
          // path.extendWithPath(bottomZigZagPath, getOffset(0, rect.height - triangleHeight))
        } else {
          ctx.lineTo(rect.right, rect.bottom)
          ctx.lineTo(rect.left, rect.bottom)
        }
        break
      default:
    }
  
    ctx.closePath()
    ctx.stroke()
  }
  