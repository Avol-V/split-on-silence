import { formatTime } from './format-time.js';

/**
 * @typedef { import( './types.js' ).SegmentTimes } SegmentTimes
 */

/**
 * @param { SegmentTimes } segment
 */
export function formatSegment( segment )
{
	return `${formatTime( segment.start )} - ${formatTime( segment.end )}`;
}
