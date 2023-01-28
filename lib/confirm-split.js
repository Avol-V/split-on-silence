import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { formatSegment } from './format-segment.js';

/**
 * @typedef { import( './types.js' ).SegmentTimes } SegmentTimes
 */

/**
 * @param { string } filePath
 * @param { string } totalDuration
 * @param { Array<SegmentTimes> } silenceSegments
 */
export async function confirmSplit( filePath, totalDuration, silenceSegments )
{
	const readLine = createInterface( stdin, stdout );
	const question = 'Split file? [Y/N] ';
	const message = `File:\n${filePath}\nDuration: ${totalDuration}\nSilence segments: ${
		silenceSegments.map( ( segment ) => formatSegment( segment ) ).join( ', ' )
	}\n${question}`;
	
	/** @type { boolean | undefined } */
	let result;
	let repeat = false;
	
	do
	{
		const answer = await readLine.question( repeat ? question : message );
		
		switch ( answer.trim().toLowerCase() )
		{
			case 'y':
				result = true;
				break;
			
			case 'n':
				result = false;
				break;
			
			default:
				break;
		}
		
		repeat = true;
	}
	while ( result === undefined );
	
	readLine.close();
	
	return result;
}
