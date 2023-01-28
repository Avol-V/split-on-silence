import { execFile as execFileCb } from 'node:child_process';
import { promisify } from 'node:util';

/**
 * @typedef { import( './types.js' ).SegmentTimes } SegmentTimes
 */

const execFile = promisify( execFileCb );

/**
 * @param { string } filePath
 * @param { string | number } [duration]
 * @param { string | number } [noise]
 */
export async function detectSilence( filePath, duration, noise )
{
	let filter = 'silencedetect';
	
	if ( noise !== undefined )
	{
		filter += '=n=' + noise;
	}
	
	if ( duration !== undefined )
	{
		filter += ( filter.includes( '=' ) ? ':' : '=' ) + 'd=' + duration;
	}
	
	const { stderr: output } = await execFile(
		'ffmpeg',
		[
			'-hide_banner',
			'-nostats',
			'-loglevel',
			'info',
			'-i',
			filePath,
			'-af',
			filter,
			'-f',
			'null',
			'-',
		],
	);
	
	/** @type { Array<SegmentTimes> } */
	const silenceSegments = [];
	/** @type { SegmentTimes | undefined } */
	let currentSegment;
	let totalDuration = '';
	
	for ( const line of output.trim().split( '\n' ) )
	{
		const durationMatches = /Duration: ([\d:.]+)/.exec( line );
		
		if ( durationMatches !== null )
		{
			totalDuration = durationMatches[1] || '';
		}
		
		const matches = /silencedetect.+? (silence_start|silence_end): ([\d.]+)/.exec( line );
		
		if ( matches === null )
		{
			continue;
		}
		
		if ( matches[1] === 'silence_start' )
		{
			currentSegment = {
				start: Number( matches[2] ),
				end: 0,
			};
			
			continue;
		}
		
		if ( !currentSegment )
		{
			continue;
		}
		
		currentSegment.end = Number( matches[2] );
		
		silenceSegments.push( currentSegment );
	}
	
	return {
		silenceSegments,
		totalDuration,
	};
}
