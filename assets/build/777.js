(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[777],{

/***/ 7198:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "arrow": () => (/* binding */ floating_ui_dom_esm_arrow),
  "autoPlacement": () => (/* binding */ floating_ui_dom_esm_autoPlacement),
  "autoUpdate": () => (/* binding */ autoUpdate),
  "computePosition": () => (/* binding */ floating_ui_dom_esm_computePosition),
  "detectOverflow": () => (/* reexport */ detectOverflow),
  "flip": () => (/* binding */ floating_ui_dom_esm_flip),
  "getOverflowAncestors": () => (/* reexport */ floating_ui_utils_dom/* getOverflowAncestors */.Kx),
  "hide": () => (/* binding */ floating_ui_dom_esm_hide),
  "inline": () => (/* binding */ floating_ui_dom_esm_inline),
  "limitShift": () => (/* binding */ floating_ui_dom_esm_limitShift),
  "offset": () => (/* reexport */ offset),
  "platform": () => (/* binding */ platform),
  "shift": () => (/* binding */ floating_ui_dom_esm_shift),
  "size": () => (/* binding */ floating_ui_dom_esm_size)
});

// EXTERNAL MODULE: ./node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var floating_ui_utils = __webpack_require__(2507);
;// CONCATENATED MODULE: ./node_modules/@floating-ui/core/dist/floating-ui.core.mjs



function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = (0,floating_ui_utils/* getSideAxis */.Qq)(placement);
  const alignmentAxis = (0,floating_ui_utils/* getAlignmentAxis */.Wh)(placement);
  const alignLength = (0,floating_ui_utils/* getAxisLength */.I4)(alignmentAxis);
  const side = (0,floating_ui_utils/* getSide */.k3)(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch ((0,floating_ui_utils/* getAlignment */.hp)(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
  const paddingObject = (0,floating_ui_utils/* getPaddingObject */.yd)(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = (0,floating_ui_utils/* rectToClientRect */.JB)(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = (0,floating_ui_utils/* rectToClientRect */.JB)(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = (0,floating_ui_utils/* evaluate */.ku)(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = (0,floating_ui_utils/* getPaddingObject */.yd)(padding);
    const coords = {
      x,
      y
    };
    const axis = (0,floating_ui_utils/* getAlignmentAxis */.Wh)(placement);
    const length = (0,floating_ui_utils/* getAxisLength */.I4)(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = (0,floating_ui_utils/* min */.VV)(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = (0,floating_ui_utils/* min */.VV)(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = (0,floating_ui_utils/* clamp */.uZ)(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && (0,floating_ui_utils/* getAlignment */.hp)(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => (0,floating_ui_utils/* getAlignment */.hp)(placement) === alignment), ...allowedPlacements.filter(placement => (0,floating_ui_utils/* getAlignment */.hp)(placement) !== alignment)] : allowedPlacements.filter(placement => (0,floating_ui_utils/* getSide */.k3)(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return (0,floating_ui_utils/* getAlignment */.hp)(placement) === alignment || (autoAlignment ? (0,floating_ui_utils/* getOppositeAlignmentPlacement */.Go)(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'autoPlacement',
    options,
    async fn(state) {
      var _middlewareData$autoP, _middlewareData$autoP2, _placementsThatFitOnE;
      const {
        rects,
        middlewareData,
        placement,
        platform,
        elements
      } = state;
      const {
        crossAxis = false,
        alignment,
        allowedPlacements = floating_ui_utils/* placements */.Ct,
        autoAlignment = true,
        ...detectOverflowOptions
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      const placements$1 = alignment !== undefined || allowedPlacements === floating_ui_utils/* placements */.Ct ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP.index) || 0;
      const currentPlacement = placements$1[currentIndex];
      if (currentPlacement == null) {
        return {};
      }
      const alignmentSides = (0,floating_ui_utils/* getAlignmentSides */.i8)(currentPlacement, rects, await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating)));

      // Make `computeCoords` start from the right place.
      if (placement !== currentPlacement) {
        return {
          reset: {
            placement: placements$1[0]
          }
        };
      }
      const currentOverflows = [overflow[(0,floating_ui_utils/* getSide */.k3)(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
      const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) == null ? void 0 : _middlewareData$autoP2.overflows) || []), {
        placement: currentPlacement,
        overflows: currentOverflows
      }];
      const nextPlacement = placements$1[currentIndex + 1];

      // There are more placements to check.
      if (nextPlacement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: nextPlacement
          }
        };
      }
      const placementsSortedByMostSpace = allOverflows.map(d => {
        const alignment = (0,floating_ui_utils/* getAlignment */.hp)(d.placement);
        return [d.placement, alignment && crossAxis ?
        // Check along the mainAxis and main crossAxis side.
        d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
        // Check only the mainAxis.
        d.overflows[0], d.overflows];
      }).sort((a, b) => a[1] - b[1]);
      const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
      // Aligned placements should not check their opposite crossAxis
      // side.
      (0,floating_ui_utils/* getAlignment */.hp)(d[0]) ? 2 : 3).every(v => v <= 0));
      const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) == null ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
      if (resetPlacement !== placement) {
        return {
          data: {
            index: currentIndex + 1,
            overflows: allOverflows
          },
          reset: {
            placement: resetPlacement
          }
        };
      }
      return {};
    }
  };
};

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = (0,floating_ui_utils/* getSide */.k3)(placement);
      const isBasePlacement = (0,floating_ui_utils/* getSide */.k3)(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [(0,floating_ui_utils/* getOppositePlacement */.pw)(initialPlacement)] : (0,floating_ui_utils/* getExpandedPlacements */.gy)(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== 'none') {
        fallbackPlacements.push(...(0,floating_ui_utils/* getOppositeAxisPlacements */.KX)(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = (0,floating_ui_utils/* getAlignmentSides */.i8)(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$map$so;
                const placement = (_overflowsData$map$so = overflowsData.map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return floating_ui_utils/* sides.some */.mA.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

function getBoundingRect(rects) {
  const minX = (0,floating_ui_utils/* min */.VV)(...rects.map(rect => rect.left));
  const minY = (0,floating_ui_utils/* min */.VV)(...rects.map(rect => rect.top));
  const maxX = (0,floating_ui_utils/* max */.Fp)(...rects.map(rect => rect.right));
  const maxY = (0,floating_ui_utils/* max */.Fp)(...rects.map(rect => rect.bottom));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function getRectsByLine(rects) {
  const sortedRects = rects.slice().sort((a, b) => a.y - b.y);
  const groups = [];
  let prevRect = null;
  for (let i = 0; i < sortedRects.length; i++) {
    const rect = sortedRects[i];
    if (!prevRect || rect.y - prevRect.y > prevRect.height / 2) {
      groups.push([rect]);
    } else {
      groups[groups.length - 1].push(rect);
    }
    prevRect = rect;
  }
  return groups.map(rect => (0,floating_ui_utils/* rectToClientRect */.JB)(getBoundingRect(rect)));
}
/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const inline = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'inline',
    options,
    async fn(state) {
      const {
        placement,
        elements,
        rects,
        platform,
        strategy
      } = state;
      // A MouseEvent's client{X,Y} coords can be up to 2 pixels off a
      // ClientRect's bounds, despite the event listener being triggered. A
      // padding of 2 seems to handle this issue.
      const {
        padding = 2,
        x,
        y
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      const nativeClientRects = Array.from((await (platform.getClientRects == null ? void 0 : platform.getClientRects(elements.reference))) || []);
      const clientRects = getRectsByLine(nativeClientRects);
      const fallback = (0,floating_ui_utils/* rectToClientRect */.JB)(getBoundingRect(nativeClientRects));
      const paddingObject = (0,floating_ui_utils/* getPaddingObject */.yd)(padding);
      function getBoundingClientRect() {
        // There are two rects and they are disjoined.
        if (clientRects.length === 2 && clientRects[0].left > clientRects[1].right && x != null && y != null) {
          // Find the first rect in which the point is fully inside.
          return clientRects.find(rect => x > rect.left - paddingObject.left && x < rect.right + paddingObject.right && y > rect.top - paddingObject.top && y < rect.bottom + paddingObject.bottom) || fallback;
        }

        // There are 2 or more connected rects.
        if (clientRects.length >= 2) {
          if ((0,floating_ui_utils/* getSideAxis */.Qq)(placement) === 'y') {
            const firstRect = clientRects[0];
            const lastRect = clientRects[clientRects.length - 1];
            const isTop = (0,floating_ui_utils/* getSide */.k3)(placement) === 'top';
            const top = firstRect.top;
            const bottom = lastRect.bottom;
            const left = isTop ? firstRect.left : lastRect.left;
            const right = isTop ? firstRect.right : lastRect.right;
            const width = right - left;
            const height = bottom - top;
            return {
              top,
              bottom,
              left,
              right,
              width,
              height,
              x: left,
              y: top
            };
          }
          const isLeftSide = (0,floating_ui_utils/* getSide */.k3)(placement) === 'left';
          const maxRight = (0,floating_ui_utils/* max */.Fp)(...clientRects.map(rect => rect.right));
          const minLeft = (0,floating_ui_utils/* min */.VV)(...clientRects.map(rect => rect.left));
          const measureRects = clientRects.filter(rect => isLeftSide ? rect.left === minLeft : rect.right === maxRight);
          const top = measureRects[0].top;
          const bottom = measureRects[measureRects.length - 1].bottom;
          const left = minLeft;
          const right = maxRight;
          const width = right - left;
          const height = bottom - top;
          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top
          };
        }
        return fallback;
      }
      const resetRects = await platform.getElementRects({
        reference: {
          getBoundingClientRect
        },
        floating: elements.floating,
        strategy
      });
      if (rects.reference.x !== resetRects.reference.x || rects.reference.y !== resetRects.reference.y || rects.reference.width !== resetRects.reference.width || rects.reference.height !== resetRects.reference.height) {
        return {
          reset: {
            rects: resetRects
          }
        };
      }
      return {};
    }
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = (0,floating_ui_utils/* getSide */.k3)(placement);
  const alignment = (0,floating_ui_utils/* getAlignment */.hp)(placement);
  const isVertical = (0,floating_ui_utils/* getSideAxis */.Qq)(placement) === 'y';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = (0,floating_ui_utils/* evaluate */.ku)(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = (0,floating_ui_utils/* getSideAxis */.Qq)((0,floating_ui_utils/* getSide */.k3)(placement));
      const mainAxis = (0,floating_ui_utils/* getOppositeAxis */.Rn)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = (0,floating_ui_utils/* clamp */.uZ)(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = (0,floating_ui_utils/* clamp */.uZ)(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = (0,floating_ui_utils/* getSideAxis */.Qq)(placement);
      const mainAxis = (0,floating_ui_utils/* getOppositeAxis */.Rn)(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = (0,floating_ui_utils/* evaluate */.ku)(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = ['top', 'left'].includes((0,floating_ui_utils/* getSide */.k3)(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = (0,floating_ui_utils/* evaluate */.ku)(options, state);
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = (0,floating_ui_utils/* getSide */.k3)(placement);
      const alignment = (0,floating_ui_utils/* getAlignment */.hp)(placement);
      const isYAxis = (0,floating_ui_utils/* getSideAxis */.Qq)(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const overflowAvailableHeight = height - overflow[heightSide];
      const overflowAvailableWidth = width - overflow[widthSide];
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        const maximumClippingWidth = width - overflow.left - overflow.right;
        availableWidth = alignment || noShift ? (0,floating_ui_utils/* min */.VV)(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
      } else {
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        availableHeight = alignment || noShift ? (0,floating_ui_utils/* min */.VV)(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = (0,floating_ui_utils/* max */.Fp)(overflow.left, 0);
        const xMax = (0,floating_ui_utils/* max */.Fp)(overflow.right, 0);
        const yMin = (0,floating_ui_utils/* max */.Fp)(overflow.top, 0);
        const yMax = (0,floating_ui_utils/* max */.Fp)(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : (0,floating_ui_utils/* max */.Fp)(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : (0,floating_ui_utils/* max */.Fp)(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};



// EXTERNAL MODULE: ./node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
var floating_ui_utils_dom = __webpack_require__(790);
;// CONCATENATED MODULE: ./node_modules/@floating-ui/dom/dist/floating-ui.dom.esm.js






function getCssDimensions(element) {
  const css = (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = (0,floating_ui_utils_dom/* isHTMLElement */.Re)(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = (0,floating_ui_utils/* round */.NM)(width) !== offsetWidth || (0,floating_ui_utils/* round */.NM)(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !(0,floating_ui_utils_dom/* isElement */.kK)(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!(0,floating_ui_utils_dom/* isHTMLElement */.Re)(domElement)) {
    return (0,floating_ui_utils/* createCoords */.ze)(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? (0,floating_ui_utils/* round */.NM)(rect.width) : rect.width) / width;
  let y = ($ ? (0,floating_ui_utils/* round */.NM)(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/(0,floating_ui_utils/* createCoords */.ze)(0);
function getVisualOffsets(element) {
  const win = (0,floating_ui_utils_dom/* getWindow */.Jj)(element);
  if (!(0,floating_ui_utils_dom/* isWebKit */.Pf)() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== (0,floating_ui_utils_dom/* getWindow */.Jj)(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = (0,floating_ui_utils/* createCoords */.ze)(1);
  if (includeScale) {
    if (offsetParent) {
      if ((0,floating_ui_utils_dom/* isElement */.kK)(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : (0,floating_ui_utils/* createCoords */.ze)(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = (0,floating_ui_utils_dom/* getWindow */.Jj)(domElement);
    const offsetWin = offsetParent && (0,floating_ui_utils_dom/* isElement */.kK)(offsetParent) ? (0,floating_ui_utils_dom/* getWindow */.Jj)(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = (0,floating_ui_utils_dom/* getWindow */.Jj)(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return (0,floating_ui_utils/* rectToClientRect */.JB)({
    width,
    height,
    x,
    y
  });
}

const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(floating) {
  return topLayerSelectors.some(selector => {
    try {
      return floating.matches(selector);
    } catch (e) {
      return false;
    }
  });
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = (0,floating_ui_utils_dom/* getDocumentElement */.tF)(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = (0,floating_ui_utils/* createCoords */.ze)(1);
  const offsets = (0,floating_ui_utils/* createCoords */.ze)(0);
  const isOffsetParentAnElement = (0,floating_ui_utils_dom/* isHTMLElement */.Re)(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,floating_ui_utils_dom/* getNodeName */.wk)(offsetParent) !== 'body' || (0,floating_ui_utils_dom/* isOverflowElement */.ao)(documentElement)) {
      scroll = (0,floating_ui_utils_dom/* getNodeScroll */.Lw)(offsetParent);
    }
    if ((0,floating_ui_utils_dom/* isHTMLElement */.Re)(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return getBoundingClientRect((0,floating_ui_utils_dom/* getDocumentElement */.tF)(element)).left + (0,floating_ui_utils_dom/* getNodeScroll */.Lw)(element).scrollLeft;
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = (0,floating_ui_utils_dom/* getDocumentElement */.tF)(element);
  const scroll = (0,floating_ui_utils_dom/* getNodeScroll */.Lw)(element);
  const body = element.ownerDocument.body;
  const width = (0,floating_ui_utils/* max */.Fp)(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = (0,floating_ui_utils/* max */.Fp)(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if ((0,floating_ui_utils_dom/* getComputedStyle */.Dx)(body).direction === 'rtl') {
    x += (0,floating_ui_utils/* max */.Fp)(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

function getViewportRect(element, strategy) {
  const win = (0,floating_ui_utils_dom/* getWindow */.Jj)(element);
  const html = (0,floating_ui_utils_dom/* getDocumentElement */.tF)(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = (0,floating_ui_utils_dom/* isWebKit */.Pf)();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = (0,floating_ui_utils_dom/* isHTMLElement */.Re)(element) ? getScale(element) : (0,floating_ui_utils/* createCoords */.ze)(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect((0,floating_ui_utils_dom/* getDocumentElement */.tF)(element));
  } else if ((0,floating_ui_utils_dom/* isElement */.kK)(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y
    };
  }
  return (0,floating_ui_utils/* rectToClientRect */.JB)(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = (0,floating_ui_utils_dom/* getParentNode */.Ow)(element);
  if (parentNode === stopNode || !(0,floating_ui_utils_dom/* isElement */.kK)(parentNode) || (0,floating_ui_utils_dom/* isLastTraversableNode */.Py)(parentNode)) {
    return false;
  }
  return (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = (0,floating_ui_utils_dom/* getOverflowAncestors */.Kx)(element, [], false).filter(el => (0,floating_ui_utils_dom/* isElement */.kK)(el) && (0,floating_ui_utils_dom/* getNodeName */.wk)(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(element).position === 'fixed';
  let currentNode = elementIsFixed ? (0,floating_ui_utils_dom/* getParentNode */.Ow)(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while ((0,floating_ui_utils_dom/* isElement */.kK)(currentNode) && !(0,floating_ui_utils_dom/* isLastTraversableNode */.Py)(currentNode)) {
    const computedStyle = (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(currentNode);
    const currentNodeIsContaining = (0,floating_ui_utils_dom/* isContainingBlock */.hT)(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || (0,floating_ui_utils_dom/* isOverflowElement */.ao)(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = (0,floating_ui_utils_dom/* getParentNode */.Ow)(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = (0,floating_ui_utils/* max */.Fp)(rect.top, accRect.top);
    accRect.right = (0,floating_ui_utils/* min */.VV)(rect.right, accRect.right);
    accRect.bottom = (0,floating_ui_utils/* min */.VV)(rect.bottom, accRect.bottom);
    accRect.left = (0,floating_ui_utils/* max */.Fp)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = (0,floating_ui_utils_dom/* isHTMLElement */.Re)(offsetParent);
  const documentElement = (0,floating_ui_utils_dom/* getDocumentElement */.tF)(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = (0,floating_ui_utils/* createCoords */.ze)(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,floating_ui_utils_dom/* getNodeName */.wk)(offsetParent) !== 'body' || (0,floating_ui_utils_dom/* isOverflowElement */.ao)(documentElement)) {
      scroll = (0,floating_ui_utils_dom/* getNodeScroll */.Lw)(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function getTrueOffsetParent(element, polyfill) {
  if (!(0,floating_ui_utils_dom/* isHTMLElement */.Re)(element) || (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const window = (0,floating_ui_utils_dom/* getWindow */.Jj)(element);
  if (!(0,floating_ui_utils_dom/* isHTMLElement */.Re)(element) || isTopLayer(element)) {
    return window;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && (0,floating_ui_utils_dom/* isTableElement */.Ze)(offsetParent) && (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && ((0,floating_ui_utils_dom/* getNodeName */.wk)(offsetParent) === 'html' || (0,floating_ui_utils_dom/* getNodeName */.wk)(offsetParent) === 'body' && (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(offsetParent).position === 'static' && !(0,floating_ui_utils_dom/* isContainingBlock */.hT)(offsetParent))) {
    return window;
  }
  return offsetParent || (0,floating_ui_utils_dom/* getContainingBlock */.gQ)(element) || window;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      ...(await getDimensionsFn(data.floating))
    }
  };
};

function isRTL(element) {
  return (0,floating_ui_utils_dom/* getComputedStyle */.Dx)(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement: floating_ui_utils_dom/* getDocumentElement */.tF,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: floating_ui_utils_dom/* isElement */.kK,
  isRTL
};

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = (0,floating_ui_utils_dom/* getDocumentElement */.tF)(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = (0,floating_ui_utils/* floor */.GW)(top);
    const insetRight = (0,floating_ui_utils/* floor */.GW)(root.clientWidth - (left + width));
    const insetBottom = (0,floating_ui_utils/* floor */.GW)(root.clientHeight - (top + height));
    const insetLeft = (0,floating_ui_utils/* floor */.GW)(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: (0,floating_ui_utils/* max */.Fp)(0, (0,floating_ui_utils/* min */.VV)(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 100);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? (0,floating_ui_utils_dom/* getOverflowAncestors */.Kx)(referenceEl) : []), ...(0,floating_ui_utils_dom/* getOverflowAncestors */.Kx)(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const floating_ui_dom_esm_autoPlacement = autoPlacement;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const floating_ui_dom_esm_shift = shift;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const floating_ui_dom_esm_flip = flip;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const floating_ui_dom_esm_size = size;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const floating_ui_dom_esm_hide = hide;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const floating_ui_dom_esm_arrow = arrow;

/**
 * Provides improved positioning for inline reference elements that can span
 * over multiple lines, such as hyperlinks or range selections.
 * @see https://floating-ui.com/docs/inline
 */
const floating_ui_dom_esm_inline = inline;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const floating_ui_dom_esm_limitShift = limitShift;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const floating_ui_dom_esm_computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};




/***/ }),

/***/ 790:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dx": () => (/* binding */ getComputedStyle),
/* harmony export */   "gQ": () => (/* binding */ getContainingBlock),
/* harmony export */   "tF": () => (/* binding */ getDocumentElement),
/* harmony export */   "wk": () => (/* binding */ getNodeName),
/* harmony export */   "Lw": () => (/* binding */ getNodeScroll),
/* harmony export */   "Kx": () => (/* binding */ getOverflowAncestors),
/* harmony export */   "Ow": () => (/* binding */ getParentNode),
/* harmony export */   "Jj": () => (/* binding */ getWindow),
/* harmony export */   "hT": () => (/* binding */ isContainingBlock),
/* harmony export */   "kK": () => (/* binding */ isElement),
/* harmony export */   "Re": () => (/* binding */ isHTMLElement),
/* harmony export */   "Py": () => (/* binding */ isLastTraversableNode),
/* harmony export */   "ao": () => (/* binding */ isOverflowElement),
/* harmony export */   "Ze": () => (/* binding */ isTableElement),
/* harmony export */   "Pf": () => (/* binding */ isWebKit)
/* harmony export */ });
/* unused harmony exports getNearestOverflowAncestor, isNode, isShadowRoot */
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
}
function isTableElement(element) {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
function isLastTraversableNode(node) {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}




/***/ }),

/***/ 2507:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "uZ": () => (/* binding */ clamp),
/* harmony export */   "ze": () => (/* binding */ createCoords),
/* harmony export */   "ku": () => (/* binding */ evaluate),
/* harmony export */   "GW": () => (/* binding */ floor),
/* harmony export */   "hp": () => (/* binding */ getAlignment),
/* harmony export */   "Wh": () => (/* binding */ getAlignmentAxis),
/* harmony export */   "i8": () => (/* binding */ getAlignmentSides),
/* harmony export */   "I4": () => (/* binding */ getAxisLength),
/* harmony export */   "gy": () => (/* binding */ getExpandedPlacements),
/* harmony export */   "Go": () => (/* binding */ getOppositeAlignmentPlacement),
/* harmony export */   "Rn": () => (/* binding */ getOppositeAxis),
/* harmony export */   "KX": () => (/* binding */ getOppositeAxisPlacements),
/* harmony export */   "pw": () => (/* binding */ getOppositePlacement),
/* harmony export */   "yd": () => (/* binding */ getPaddingObject),
/* harmony export */   "k3": () => (/* binding */ getSide),
/* harmony export */   "Qq": () => (/* binding */ getSideAxis),
/* harmony export */   "Fp": () => (/* binding */ max),
/* harmony export */   "VV": () => (/* binding */ min),
/* harmony export */   "Ct": () => (/* binding */ placements),
/* harmony export */   "JB": () => (/* binding */ rectToClientRect),
/* harmony export */   "NM": () => (/* binding */ round),
/* harmony export */   "mA": () => (/* binding */ sides)
/* harmony export */ });
/* unused harmony exports alignments, expandPaddingObject */
/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements = /*#__PURE__*/sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ['left', 'right'];
  const rl = ['right', 'left'];
  const tb = ['top', 'bottom'];
  const bt = ['bottom', 'top'];
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case 'left':
    case 'right':
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}




/***/ }),

/***/ 4595:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 461:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*
* React Tooltip
* {@link https://github.com/ReactTooltip/react-tooltip}
* @copyright ReactTooltip Team
* @license MIT
*/
Object.defineProperty(exports, "__esModule", ({value:!0}));var e=__webpack_require__(7294),t=__webpack_require__(7198),o=__webpack_require__(590);function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var l=r(e),n=r(o);const c="react-tooltip-core-styles",s="react-tooltip-base-styles",i={core:!1,base:!1};function a({css:e,id:t=s,type:o="base",ref:r}){var l,n;if(!e||"undefined"==typeof document||i[o])return;if("core"===o&&"undefined"!=typeof process&&(null===(l=null===process||void 0===process?void 0:({"NODE_ENV":"production"}))||void 0===l?void 0:l.REACT_TOOLTIP_DISABLE_CORE_STYLES))return;if("base"!==o&&"undefined"!=typeof process&&(null===(n=null===process||void 0===process?void 0:({"NODE_ENV":"production"}))||void 0===n?void 0:n.REACT_TOOLTIP_DISABLE_BASE_STYLES))return;"core"===o&&(t=c),r||(r={});const{insertAt:a}=r;if(document.getElementById(t))return void console.warn(`[react-tooltip] Element with id '${t}' already exists. Call \`removeStyle()\` first`);const u=document.head||document.getElementsByTagName("head")[0],d=document.createElement("style");d.id=t,d.type="text/css","top"===a&&u.firstChild?u.insertBefore(d,u.firstChild):u.appendChild(d),d.styleSheet?d.styleSheet.cssText=e:d.appendChild(document.createTextNode(e)),i[o]=!0}const u=async({elementReference:e=null,tooltipReference:o=null,tooltipArrowReference:r=null,place:l="top",offset:n=10,strategy:c="absolute",middlewares:s=[t.offset(Number(n)),t.flip({fallbackAxisSideDirection:"start"}),t.shift({padding:5})],border:i})=>{if(!e)return{tooltipStyles:{},tooltipArrowStyles:{},place:l};if(null===o)return{tooltipStyles:{},tooltipArrowStyles:{},place:l};const a=s;return r?(a.push(t.arrow({element:r,padding:5})),t.computePosition(e,o,{placement:l,strategy:c,middleware:a}).then((({x:e,y:t,placement:o,middlewareData:r})=>{var l,n;const c={left:`${e}px`,top:`${t}px`,border:i},{x:s,y:a}=null!==(l=r.arrow)&&void 0!==l?l:{x:0,y:0},u=null!==(n={top:"bottom",right:"left",bottom:"top",left:"right"}[o.split("-")[0]])&&void 0!==n?n:"bottom",d=i&&{borderBottom:i,borderRight:i};let p=0;if(i){const e=`${i}`.match(/(\d+)px/);p=(null==e?void 0:e[1])?Number(e[1]):1}return{tooltipStyles:c,tooltipArrowStyles:{left:null!=s?`${s}px`:"",top:null!=a?`${a}px`:"",right:"",bottom:"",...d,[u]:`-${4+p}px`},place:o}}))):t.computePosition(e,o,{placement:"bottom",strategy:c,middleware:a}).then((({x:e,y:t,placement:o})=>({tooltipStyles:{left:`${e}px`,top:`${t}px`},tooltipArrowStyles:{},place:o})))},d=(e,t)=>!("CSS"in window&&"supports"in window.CSS)||window.CSS.supports(e,t),p=(e,t,o)=>{let r=null;const l=function(...l){const n=()=>{r=null,o||e.apply(this,l)};o&&!r&&(e.apply(this,l),r=setTimeout(n,t)),o||(r&&clearTimeout(r),r=setTimeout(n,t))};return l.cancel=()=>{r&&(clearTimeout(r),r=null)},l},f=e=>null!==e&&!Array.isArray(e)&&"object"==typeof e,v=(e,t)=>{if(e===t)return!0;if(Array.isArray(e)&&Array.isArray(t))return e.length===t.length&&e.every(((e,o)=>v(e,t[o])));if(Array.isArray(e)!==Array.isArray(t))return!1;if(!f(e)||!f(t))return e===t;const o=Object.keys(e),r=Object.keys(t);return o.length===r.length&&o.every((o=>v(e[o],t[o])))},m=e=>{if(!(e instanceof HTMLElement||e instanceof SVGElement))return!1;const t=getComputedStyle(e);return["overflow","overflow-x","overflow-y"].some((e=>{const o=t.getPropertyValue(e);return"auto"===o||"scroll"===o}))},y=e=>{if(!e)return null;let t=e.parentElement;for(;t;){if(m(t))return t;t=t.parentElement}return document.scrollingElement||document.documentElement},h="undefined"!=typeof window?e.useLayoutEffect:e.useEffect,w="DEFAULT_TOOLTIP_ID",S={anchorRefs:new Set,activeAnchor:{current:null},attach:()=>{},detach:()=>{},setActiveAnchor:()=>{}},E={getTooltipData:()=>S},b=e.createContext(E);function g(t=w){return e.useContext(b).getTooltipData(t)}var A={tooltip:"core-styles-module_tooltip__3vRRp",fixed:"core-styles-module_fixed__pcSol",arrow:"core-styles-module_arrow__cvMwQ",noArrow:"core-styles-module_noArrow__xock6",clickable:"core-styles-module_clickable__ZuTTB",show:"core-styles-module_show__Nt9eE",closing:"core-styles-module_closing__sGnxF"},_={tooltip:"styles-module_tooltip__mnnfp",arrow:"styles-module_arrow__K0L3T",dark:"styles-module_dark__xNqje",light:"styles-module_light__Z6W-X",success:"styles-module_success__A2AKt",warning:"styles-module_warning__SCK0X",error:"styles-module_error__JvumD",info:"styles-module_info__BWdHW"};const O=({forwardRef:o,id:r,className:c,classNameArrow:s,variant:i="dark",anchorId:a,anchorSelect:d,place:f="top",offset:m=10,events:w=["hover"],openOnClick:S=!1,positionStrategy:E="absolute",middlewares:b,wrapper:O,delayShow:T=0,delayHide:k=0,float:R=!1,hidden:C=!1,noArrow:x=!1,clickable:L=!1,closeOnEsc:N=!1,closeOnScroll:$=!1,closeOnResize:I=!1,openEvents:j,closeEvents:B,globalCloseEvents:q,imperativeModeOnly:z,style:D,position:M,afterShow:H,afterHide:P,content:W,contentWrapperRef:V,isOpen:F,defaultIsOpen:U=!1,setIsOpen:K,activeAnchor:X,setActiveAnchor:Y,border:G,opacity:Z,arrowColor:J,role:Q="tooltip"})=>{var ee;const te=e.useRef(null),oe=e.useRef(null),re=e.useRef(null),le=e.useRef(null),ne=e.useRef(null),[ce,se]=e.useState({tooltipStyles:{},tooltipArrowStyles:{},place:f}),[ie,ae]=e.useState(!1),[ue,de]=e.useState(!1),[pe,fe]=e.useState(null),ve=e.useRef(!1),me=e.useRef(null),{anchorRefs:ye,setActiveAnchor:he}=g(r),we=e.useRef(!1),[Se,Ee]=e.useState([]),be=e.useRef(!1),ge=S||w.includes("click"),Ae=ge||(null==j?void 0:j.click)||(null==j?void 0:j.dblclick)||(null==j?void 0:j.mousedown),_e=j?{...j}:{mouseenter:!0,focus:!0,click:!1,dblclick:!1,mousedown:!1};!j&&ge&&Object.assign(_e,{mouseenter:!1,focus:!1,click:!0});const Oe=B?{...B}:{mouseleave:!0,blur:!0,click:!1,dblclick:!1,mouseup:!1};!B&&ge&&Object.assign(Oe,{mouseleave:!1,blur:!1});const Te=q?{...q}:{escape:N||!1,scroll:$||!1,resize:I||!1,clickOutsideAnchor:Ae||!1};z&&(Object.assign(_e,{mouseenter:!1,focus:!1,click:!1,dblclick:!1,mousedown:!1}),Object.assign(Oe,{mouseleave:!1,blur:!1,click:!1,dblclick:!1,mouseup:!1}),Object.assign(Te,{escape:!1,scroll:!1,resize:!1,clickOutsideAnchor:!1})),h((()=>(be.current=!0,()=>{be.current=!1})),[]);const ke=e=>{be.current&&(e&&de(!0),setTimeout((()=>{be.current&&(null==K||K(e),void 0===F&&ae(e))}),10))};e.useEffect((()=>{if(void 0===F)return()=>null;F&&de(!0);const e=setTimeout((()=>{ae(F)}),10);return()=>{clearTimeout(e)}}),[F]),e.useEffect((()=>{if(ie!==ve.current)if(ne.current&&clearTimeout(ne.current),ve.current=ie,ie)null==H||H();else{const e=(e=>{const t=e.match(/^([\d.]+)(ms|s)$/);if(!t)return 0;const[,o,r]=t;return Number(o)*("ms"===r?1:1e3)})(getComputedStyle(document.body).getPropertyValue("--rt-transition-show-delay"));ne.current=setTimeout((()=>{de(!1),fe(null),null==P||P()}),e+25)}}),[ie]);const Re=e=>{se((t=>v(t,e)?t:e))},Ce=(e=T)=>{re.current&&clearTimeout(re.current),ue?ke(!0):re.current=setTimeout((()=>{ke(!0)}),e)},xe=(e=k)=>{le.current&&clearTimeout(le.current),le.current=setTimeout((()=>{we.current||ke(!1)}),e)},Le=e=>{var t;if(!e)return;const o=null!==(t=e.currentTarget)&&void 0!==t?t:e.target;if(!(null==o?void 0:o.isConnected))return Y(null),void he({current:null});T?Ce():ke(!0),Y(o),he({current:o}),le.current&&clearTimeout(le.current)},Ne=()=>{L?xe(k||100):k?xe():ke(!1),re.current&&clearTimeout(re.current)},$e=({x:e,y:t})=>{var o;const r={getBoundingClientRect:()=>({x:e,y:t,width:0,height:0,top:t,left:e,right:e,bottom:t})};u({place:null!==(o=null==pe?void 0:pe.place)&&void 0!==o?o:f,offset:m,elementReference:r,tooltipReference:te.current,tooltipArrowReference:oe.current,strategy:E,middlewares:b,border:G}).then((e=>{Re(e)}))},Ie=e=>{if(!e)return;const t=e,o={x:t.clientX,y:t.clientY};$e(o),me.current=o},je=e=>{var t;if(!ie)return;const o=e.target;if(!o.isConnected)return;if(null===(t=te.current)||void 0===t?void 0:t.contains(o))return;[document.querySelector(`[id='${a}']`),...Se].some((e=>null==e?void 0:e.contains(o)))||(ke(!1),re.current&&clearTimeout(re.current))},Be=p(Le,50,!0),qe=p(Ne,50,!0),ze=e=>{qe.cancel(),Be(e)},De=()=>{Be.cancel(),qe()},Me=e.useCallback((()=>{var e,t;const o=null!==(e=null==pe?void 0:pe.position)&&void 0!==e?e:M;o?$e(o):R?me.current&&$e(me.current):(null==X?void 0:X.isConnected)&&u({place:null!==(t=null==pe?void 0:pe.place)&&void 0!==t?t:f,offset:m,elementReference:X,tooltipReference:te.current,tooltipArrowReference:oe.current,strategy:E,middlewares:b,border:G}).then((e=>{be.current&&Re(e)}))}),[ie,X,W,D,f,null==pe?void 0:pe.place,m,E,M,null==pe?void 0:pe.position,R]);e.useEffect((()=>{var e,o;const r=new Set(ye);Se.forEach((e=>{r.add({current:e})}));const l=document.querySelector(`[id='${a}']`);l&&r.add({current:l});const n=()=>{ke(!1)},c=y(X),s=y(te.current);Te.scroll&&(window.addEventListener("scroll",n),null==c||c.addEventListener("scroll",n),null==s||s.addEventListener("scroll",n));let i=null;Te.resize?window.addEventListener("resize",n):X&&te.current&&(i=t.autoUpdate(X,te.current,Me,{ancestorResize:!0,elementResize:!0,layoutShift:!0}));const u=e=>{"Escape"===e.key&&ke(!1)};Te.escape&&window.addEventListener("keydown",u),Te.clickOutsideAnchor&&window.addEventListener("click",je);const d=[],p=e=>{ie&&(null==e?void 0:e.target)===X||Le(e)},f=e=>{ie&&(null==e?void 0:e.target)===X&&Ne()},v=["mouseenter","mouseleave","focus","blur"],m=["click","dblclick","mousedown","mouseup"];Object.entries(_e).forEach((([e,t])=>{t&&(v.includes(e)?d.push({event:e,listener:ze}):m.includes(e)&&d.push({event:e,listener:p}))})),Object.entries(Oe).forEach((([e,t])=>{t&&(v.includes(e)?d.push({event:e,listener:De}):m.includes(e)&&d.push({event:e,listener:f}))})),R&&d.push({event:"pointermove",listener:Ie});const h=()=>{we.current=!0},w=()=>{we.current=!1,Ne()};return L&&!Ae&&(null===(e=te.current)||void 0===e||e.addEventListener("mouseenter",h),null===(o=te.current)||void 0===o||o.addEventListener("mouseleave",w)),d.forEach((({event:e,listener:t})=>{r.forEach((o=>{var r;null===(r=o.current)||void 0===r||r.addEventListener(e,t)}))})),()=>{var e,t;Te.scroll&&(window.removeEventListener("scroll",n),null==c||c.removeEventListener("scroll",n),null==s||s.removeEventListener("scroll",n)),Te.resize?window.removeEventListener("resize",n):null==i||i(),Te.clickOutsideAnchor&&window.removeEventListener("click",je),Te.escape&&window.removeEventListener("keydown",u),L&&!Ae&&(null===(e=te.current)||void 0===e||e.removeEventListener("mouseenter",h),null===(t=te.current)||void 0===t||t.removeEventListener("mouseleave",w)),d.forEach((({event:e,listener:t})=>{r.forEach((o=>{var r;null===(r=o.current)||void 0===r||r.removeEventListener(e,t)}))}))}}),[X,Me,ue,ye,Se,j,B,q,ge,T,k]),e.useEffect((()=>{var e,t;let o=null!==(t=null!==(e=null==pe?void 0:pe.anchorSelect)&&void 0!==e?e:d)&&void 0!==t?t:"";!o&&r&&(o=`[data-tooltip-id='${r}']`);const l=new MutationObserver((e=>{const t=[],l=[];e.forEach((e=>{if("attributes"===e.type&&"data-tooltip-id"===e.attributeName){e.target.getAttribute("data-tooltip-id")===r?t.push(e.target):e.oldValue===r&&l.push(e.target)}if("childList"===e.type){if(X){const t=[...e.removedNodes].filter((e=>1===e.nodeType));if(o)try{l.push(...t.filter((e=>e.matches(o)))),l.push(...t.flatMap((e=>[...e.querySelectorAll(o)])))}catch(e){}t.some((e=>{var t;return!!(null===(t=null==e?void 0:e.contains)||void 0===t?void 0:t.call(e,X))&&(de(!1),ke(!1),Y(null),re.current&&clearTimeout(re.current),le.current&&clearTimeout(le.current),!0)}))}if(o)try{const r=[...e.addedNodes].filter((e=>1===e.nodeType));t.push(...r.filter((e=>e.matches(o)))),t.push(...r.flatMap((e=>[...e.querySelectorAll(o)])))}catch(e){}}})),(t.length||l.length)&&Ee((e=>[...e.filter((e=>!l.includes(e))),...t]))}));return l.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["data-tooltip-id"],attributeOldValue:!0}),()=>{l.disconnect()}}),[r,d,null==pe?void 0:pe.anchorSelect,X]),e.useEffect((()=>{Me()}),[Me]),e.useEffect((()=>{if(!(null==V?void 0:V.current))return()=>null;const e=new ResizeObserver((()=>{setTimeout((()=>Me()))}));return e.observe(V.current),()=>{e.disconnect()}}),[W,null==V?void 0:V.current]),e.useEffect((()=>{var e;const t=document.querySelector(`[id='${a}']`),o=[...Se,t];X&&o.includes(X)||Y(null!==(e=Se[0])&&void 0!==e?e:t)}),[a,Se,X]),e.useEffect((()=>(U&&ke(!0),()=>{re.current&&clearTimeout(re.current),le.current&&clearTimeout(le.current)})),[]),e.useEffect((()=>{var e;let t=null!==(e=null==pe?void 0:pe.anchorSelect)&&void 0!==e?e:d;if(!t&&r&&(t=`[data-tooltip-id='${r}']`),t)try{const e=Array.from(document.querySelectorAll(t));Ee(e)}catch(e){Ee([])}}),[r,d,null==pe?void 0:pe.anchorSelect]),e.useEffect((()=>{re.current&&(clearTimeout(re.current),Ce(T))}),[T]);const He=null!==(ee=null==pe?void 0:pe.content)&&void 0!==ee?ee:W,Pe=ie&&Object.keys(ce.tooltipStyles).length>0;return e.useImperativeHandle(o,(()=>({open:e=>{if(null==e?void 0:e.anchorSelect)try{document.querySelector(e.anchorSelect)}catch(t){return void console.warn(`[react-tooltip] "${e.anchorSelect}" is not a valid CSS selector`)}fe(null!=e?e:null),(null==e?void 0:e.delay)?Ce(e.delay):ke(!0)},close:e=>{(null==e?void 0:e.delay)?xe(e.delay):ke(!1)},activeAnchor:X,place:ce.place,isOpen:Boolean(ue&&!C&&He&&Pe)}))),ue&&!C&&He?l.default.createElement(O,{id:r,role:Q,className:n.default("react-tooltip",A.tooltip,_.tooltip,_[i],c,`react-tooltip__place-${ce.place}`,A[Pe?"show":"closing"],Pe?"react-tooltip__show":"react-tooltip__closing","fixed"===E&&A.fixed,L&&A.clickable),onTransitionEnd:e=>{ne.current&&clearTimeout(ne.current),ie||"opacity"!==e.propertyName||(de(!1),fe(null),null==P||P())},style:{...D,...ce.tooltipStyles,opacity:void 0!==Z&&Pe?Z:void 0},ref:te},He,l.default.createElement(O,{className:n.default("react-tooltip-arrow",A.arrow,_.arrow,s,x&&A.noArrow),style:{...ce.tooltipArrowStyles,background:J?`linear-gradient(to right bottom, transparent 50%, ${J} 50%)`:void 0},ref:oe})):null},T=({content:e})=>l.default.createElement("span",{dangerouslySetInnerHTML:{__html:e}}),k=l.default.forwardRef((({id:t,anchorId:o,anchorSelect:r,content:c,html:s,render:i,className:a,classNameArrow:u,variant:p="dark",place:f="top",offset:v=10,wrapper:m="div",children:y=null,events:h=["hover"],openOnClick:w=!1,positionStrategy:S="absolute",middlewares:E,delayShow:b=0,delayHide:A=0,float:_=!1,hidden:k=!1,noArrow:R=!1,clickable:C=!1,closeOnEsc:x=!1,closeOnScroll:L=!1,closeOnResize:N=!1,openEvents:$,closeEvents:I,globalCloseEvents:j,imperativeModeOnly:B=!1,style:q,position:z,isOpen:D,defaultIsOpen:M=!1,disableStyleInjection:H=!1,border:P,opacity:W,arrowColor:V,setIsOpen:F,afterShow:U,afterHide:K,role:X="tooltip"},Y)=>{const[G,Z]=e.useState(c),[J,Q]=e.useState(s),[ee,te]=e.useState(f),[oe,re]=e.useState(p),[le,ne]=e.useState(v),[ce,se]=e.useState(b),[ie,ae]=e.useState(A),[ue,de]=e.useState(_),[pe,fe]=e.useState(k),[ve,me]=e.useState(m),[ye,he]=e.useState(h),[we,Se]=e.useState(S),[Ee,be]=e.useState(null),[ge,Ae]=e.useState(null),_e=e.useRef(H),{anchorRefs:Oe,activeAnchor:Te}=g(t),ke=e=>null==e?void 0:e.getAttributeNames().reduce(((t,o)=>{var r;if(o.startsWith("data-tooltip-")){t[o.replace(/^data-tooltip-/,"")]=null!==(r=null==e?void 0:e.getAttribute(o))&&void 0!==r?r:null}return t}),{}),Re=e=>{const t={place:e=>{var t;te(null!==(t=e)&&void 0!==t?t:f)},content:e=>{Z(null!=e?e:c)},html:e=>{Q(null!=e?e:s)},variant:e=>{var t;re(null!==(t=e)&&void 0!==t?t:p)},offset:e=>{ne(null===e?v:Number(e))},wrapper:e=>{var t;me(null!==(t=e)&&void 0!==t?t:m)},events:e=>{const t=null==e?void 0:e.split(" ");he(null!=t?t:h)},"position-strategy":e=>{var t;Se(null!==(t=e)&&void 0!==t?t:S)},"delay-show":e=>{se(null===e?b:Number(e))},"delay-hide":e=>{ae(null===e?A:Number(e))},float:e=>{de(null===e?_:"true"===e)},hidden:e=>{fe(null===e?k:"true"===e)},"class-name":e=>{be(e)}};Object.values(t).forEach((e=>e(null))),Object.entries(e).forEach((([e,o])=>{var r;null===(r=t[e])||void 0===r||r.call(t,o)}))};e.useEffect((()=>{Z(c)}),[c]),e.useEffect((()=>{Q(s)}),[s]),e.useEffect((()=>{te(f)}),[f]),e.useEffect((()=>{re(p)}),[p]),e.useEffect((()=>{ne(v)}),[v]),e.useEffect((()=>{se(b)}),[b]),e.useEffect((()=>{ae(A)}),[A]),e.useEffect((()=>{de(_)}),[_]),e.useEffect((()=>{fe(k)}),[k]),e.useEffect((()=>{Se(S)}),[S]),e.useEffect((()=>{_e.current!==H&&console.warn("[react-tooltip] Do not change `disableStyleInjection` dynamically.")}),[H]),e.useEffect((()=>{"undefined"!=typeof window&&window.dispatchEvent(new CustomEvent("react-tooltip-inject-styles",{detail:{disableCore:"core"===H,disableBase:H}}))}),[]),e.useEffect((()=>{var e;const l=new Set(Oe);let n=r;if(!n&&t&&(n=`[data-tooltip-id='${t}']`),n)try{document.querySelectorAll(n).forEach((e=>{l.add({current:e})}))}catch(e){console.warn(`[react-tooltip] "${n}" is not a valid CSS selector`)}const c=document.querySelector(`[id='${o}']`);if(c&&l.add({current:c}),!l.size)return()=>null;const s=null!==(e=null!=ge?ge:c)&&void 0!==e?e:Te.current,i=new MutationObserver((e=>{e.forEach((e=>{var t;if(!s||"attributes"!==e.type||!(null===(t=e.attributeName)||void 0===t?void 0:t.startsWith("data-tooltip-")))return;const o=ke(s);Re(o)}))})),a={attributes:!0,childList:!1,subtree:!1};if(s){const e=ke(s);Re(e),i.observe(s,a)}return()=>{i.disconnect()}}),[Oe,Te,ge,o,r]),e.useEffect((()=>{(null==q?void 0:q.border)&&console.warn("[react-tooltip] Do not set `style.border`. Use `border` prop instead."),P&&!d("border",`${P}`)&&console.warn(`[react-tooltip] "${P}" is not a valid \`border\`.`),(null==q?void 0:q.opacity)&&console.warn("[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead."),W&&!d("opacity",`${W}`)&&console.warn(`[react-tooltip] "${W}" is not a valid \`opacity\`.`)}),[]);let Ce=y;const xe=e.useRef(null);if(i){const e=i({content:(null==ge?void 0:ge.getAttribute("data-tooltip-content"))||G||null,activeAnchor:ge});Ce=e?l.default.createElement("div",{ref:xe,className:"react-tooltip-content-wrapper"},e):null}else G&&(Ce=G);J&&(Ce=l.default.createElement(T,{content:J}));const Le={forwardRef:Y,id:t,anchorId:o,anchorSelect:r,className:n.default(a,Ee),classNameArrow:u,content:Ce,contentWrapperRef:xe,place:ee,variant:oe,offset:le,wrapper:ve,events:ye,openOnClick:w,positionStrategy:we,middlewares:E,delayShow:ce,delayHide:ie,float:ue,hidden:pe,noArrow:R,clickable:C,closeOnEsc:x,closeOnScroll:L,closeOnResize:N,openEvents:$,closeEvents:I,globalCloseEvents:j,imperativeModeOnly:B,style:q,position:z,isOpen:D,defaultIsOpen:M,border:P,opacity:W,arrowColor:V,setIsOpen:F,afterShow:U,afterHide:K,activeAnchor:ge,setActiveAnchor:e=>Ae(e),role:X};return l.default.createElement(O,{...Le})}));"undefined"!=typeof window&&window.addEventListener("react-tooltip-inject-styles",(e=>{e.detail.disableCore||a({css:`:root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9;--rt-transition-show-delay:0.15s;--rt-transition-closing-delay:0.15s}.core-styles-module_tooltip__3vRRp{position:absolute;top:0;left:0;pointer-events:none;opacity:0;will-change:opacity}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{opacity:var(--rt-opacity);transition:opacity var(--rt-transition-show-delay)ease-out}.core-styles-module_closing__sGnxF{opacity:0;transition:opacity var(--rt-transition-closing-delay)ease-in}`,type:"core"}),e.detail.disableBase||a({css:`
.styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px}[class*='react-tooltip__place-top']>.styles-module_arrow__K0L3T{transform:rotate(45deg)}[class*='react-tooltip__place-right']>.styles-module_arrow__K0L3T{transform:rotate(135deg)}[class*='react-tooltip__place-bottom']>.styles-module_arrow__K0L3T{transform:rotate(225deg)}[class*='react-tooltip__place-left']>.styles-module_arrow__K0L3T{transform:rotate(315deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}`,type:"base"})})),exports.Tooltip=k,exports.TooltipProvider=({children:t})=>{const[o,r]=e.useState({[w]:new Set}),[n,c]=e.useState({[w]:{current:null}}),s=(e,...t)=>{r((o=>{var r;const l=null!==(r=o[e])&&void 0!==r?r:new Set;return t.forEach((e=>l.add(e))),{...o,[e]:new Set(l)}}))},i=(e,...t)=>{r((o=>{const r=o[e];return r?(t.forEach((e=>r.delete(e))),{...o}):o}))},a=e.useCallback(((e=w)=>{var t,r;return{anchorRefs:null!==(t=o[e])&&void 0!==t?t:new Set,activeAnchor:null!==(r=n[e])&&void 0!==r?r:{current:null},attach:(...t)=>s(e,...t),detach:(...t)=>i(e,...t),setActiveAnchor:t=>((e,t)=>{c((o=>{var r;return(null===(r=o[e])||void 0===r?void 0:r.current)===t.current?o:{...o,[e]:t}}))})(e,t)}}),[o,n,s,i]),u=e.useMemo((()=>({getTooltipData:a})),[a]);return l.default.createElement(b.Provider,{value:u},t)},exports.TooltipWrapper=({tooltipId:t,children:o,className:r,place:c,content:s,html:i,variant:a,offset:u,wrapper:d,events:p,positionStrategy:f,delayShow:v,delayHide:m})=>{const{attach:y,detach:h}=g(t),w=e.useRef(null);return e.useEffect((()=>(y(w),()=>{h(w)})),[]),l.default.createElement("span",{ref:w,className:n.default("react-tooltip-wrapper",r),"data-tooltip-place":c,"data-tooltip-content":s,"data-tooltip-html":i,"data-tooltip-variant":a,"data-tooltip-offset":u,"data-tooltip-wrapper":d,"data-tooltip-events":p,"data-tooltip-position-strategy":f,"data-tooltip-delay-show":v,"data-tooltip-delay-hide":m},o)},exports.removeStyle=function({type:e="base",id:t=s}={}){if(!i[e])return;"core"===e&&(t=c);const o=document.getElementById(t);"style"===(null==o?void 0:o.tagName)?null==o||o.remove():console.warn(`[react-tooltip] Failed to remove 'style' element with id '${t}'. Call \`injectStyle()\` first`),i[e]=!1};


/***/ }),

/***/ 590:
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ })

}]);
//# sourceMappingURL=777.js.map