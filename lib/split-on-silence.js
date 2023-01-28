import { execFile as execFileCb } from 'node:child_process';
import { promisify } from 'node:util';
import { parse, resolve } from 'node:path';

/**
 * @typedef { import( './types.js' ).SegmentTimes } SegmentTimes
 */

const execFile = promisify( execFileCb );

/**
 * @param { import( 'node:path' ).ParsedPath } parsedPath
 * @param { number } segmentIndex
 */
function getOutputPath( parsedPath, segmentIndex )
{
	return resolve(
		parsedPath.dir,
		`${parsedPath.name}-${segmentIndex.toFixed().padStart( 2, '0' )}${parsedPath.ext}`,
	);
}

/**
 * @param { string } filePath
 * @param { Array<SegmentTimes> } silenceSegments
 */
export async function splitOnSilence( filePath, silenceSegments )
{
	const parsedPath = parse( filePath );
	/** @type { Array<string> } */
	const segments = [];
	let segmentIndex = 0;
	let prevEnd = 0;
	
	for ( const { start, end } of silenceSegments )
	{
		if ( prevEnd )
		{
			segments.push( '-ss', String( prevEnd ) );
		}
		
		segments.push(
			'-to',
			String( start ),
			'-c',
			'copy',
			getOutputPath( parsedPath, segmentIndex ),
		);
		
		prevEnd = end;
		segmentIndex++;
	}
	
	if ( prevEnd )
	{
		segments.push(
			'-ss',
			String( prevEnd ),
			'-c',
			'copy',
			getOutputPath( parsedPath, segmentIndex ),
		);
	}
	
	const { stderr } = await execFile(
		'ffmpeg',
		[
			'-hide_banner',
			'-nostats',
			'-loglevel',
			'info',
			'-i',
			filePath,
			'-movflags',
			'use_metadata_tags',
			...segments,
		],
	);
	
	return stderr.split( '\n' )
		.filter( ( line ) => line.startsWith( 'Output #' ) );
}
