import { opendir } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * @param { string } rootPath
 * @param { RegExp } pattern
 */
export async function* walk( rootPath, pattern )
{
	/** @type { Array<string> } */
	const paths = [rootPath];
	/** @type { string | undefined } */
	let currentPath;
	
	while ( (currentPath = paths.pop()) )
	{
		const entries = await opendir( currentPath );
		
		for await ( const entry of entries )
		{
			const path = resolve( currentPath, entry.name );
			
			if ( entry.isDirectory() )
			{
				paths.push( path );
				
				continue;
			}
			
			if ( entry.isFile() && pattern.test( entry.name ) )
			{
				yield path;
			}
		}
	}
}
