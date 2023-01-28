#!/usr/bin/env node

import { walk } from './lib/walk.js';
import { detectSilence } from './lib/detect-silince.js';
import { splitOnSilence } from './lib/split-on-silence.js';
import { confirmSplit } from './lib/confirm-split.js';

const defaultPattern = /.\.(?:mp3|ogg|m4a|aac|flac)$/i;

async function main()
{
	const pattern = (
		process.env['SPLIT_ON_SILENCE_PATTERN']
		? new RegExp( process.env['SPLIT_ON_SILENCE_PATTERN'], 'i' )
		: defaultPattern
	);
	const duration = process.env['SPLIT_ON_SILENCE_DURATION'] || 10;
	const noise = process.env['SPLIT_ON_SILENCE_NOISE'] || '-60dB';
	
	for await ( const path of walk( process.cwd(), pattern ) )
	{
		const {
			silenceSegments,
			totalDuration,
		} = await detectSilence( path, duration, noise );
		
		if (
			( silenceSegments.length !== 0 )
			&& await confirmSplit( path, totalDuration, silenceSegments )
		)
		{
			const outputLines = await splitOnSilence( path, silenceSegments );
			
			console.log( outputLines.join( '\n' ) );
		}
	}
}

main()
	.catch(
		( error ) =>
		{
			console.error( error );
			process.exit( 1 );
		},
	);
