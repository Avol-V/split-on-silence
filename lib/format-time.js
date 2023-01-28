/**
 * @param { number } num
 */
function padTime( num )
{
	return num.toFixed().padStart( 2, '0' );
}

/**
 * @param { number } num
 */
function getFraction( num )
{
	const str = String( num );
	
	return str.substring( str.indexOf( '.' ) );
}

/**
 * @param { number } timeInSeconds
 */
export function formatTime( timeInSeconds )
{
	let minutes = Math.floor( timeInSeconds / 60 );
	let seconds = timeInSeconds - minutes * 60;
	let hours = Math.floor( minutes / 60 );
	
	minutes -= hours * 60;
	
	return `${padTime( hours )}:${padTime( minutes )}:${padTime( seconds )}${getFraction( timeInSeconds )}`;
}
