const fs = require( "fs" );

const referenceLines = fs.readFileSync( "sequences.csv" ).toString().split( "\n" ).filter( x => !!x );
let virusData = {};
let virusColumns = referenceLines[ 0 ].split( "," );
for( let i = 1; i < referenceLines.length; i++ ) {
	let columns = referenceLines[ i ].split( "," );
	virusData[ columns[ 0 ] ] = {};
	for( let j = 0; j < virusColumns.length; j++ ) {
		virusData[ columns[ 0 ] ][ virusColumns[ j ] ] = columns[ j ].trim();
	}
}

// console.log( virusData );

const genomeLines = fs.readFileSync( "sequences.fasta" ).toString().split( "\n" );
let viruses = {};

let currentVirus = null;
for( let i = 0; i < genomeLines.length; i++ ) {
	if( genomeLines[ i ].startsWith( ">" ) ) {
		let parts = genomeLines[ i ].replace( ">", "" ).split( "|" );
		let id = parts[ 0 ].trim();
		let name = parts[ 1 ];
		currentVirus = id;
		viruses[ id ] = {
			id: id,
			name: name,
			species: virusData[ id ].Species,
			genus: virusData[ id ].Genus,
			family: virusData[ id ].Family,
			location: virusData[ id ].Geo_Location,
			host: virusData[ id ].Host,
			genome: ""
		};
	}
	else {
		viruses[ currentVirus ].genome += genomeLines[ i ];
	}
}

let output = {};
// let selected = Object.keys( viruses ).sort( () => 0.5 - Math.random() );
// Object.keys( viruses ).slice( 300, 400 ).forEach( v => {
Object.keys( viruses ).forEach( v => {
	// console.log( viruses[ v ] );
	// console.log( viruses[ v ].name, genomeToCoord( viruses[ v ].genome ) );
	output[ v ] = {
		name: viruses[ v ].name,
		species: viruses[ v ].species,
		genus: viruses[ v ].genus,
		family: viruses[ v ].family,
		location: viruses[ v ].location,
		host: viruses[ v ].host,
		coord: genomeToCoord( viruses[ v ].genome )
	};
});
fs.writeFileSync( "web/viruses.json", JSON.stringify( output ) );
console.log( output );

function genomeToCoord( genome ) {
	const coordScale = 10;
	let x = 0, y = 0;
	let a = 0, g = 0, c = 0, t = 0;
	genome.split( "" ).forEach( ( n, i ) => {
		// let interval = 1 / ( genome.length + 1 - i );
		let interval = 1 / ( i + 1 );
		switch( n ) {
			case "A":
				x += interval;
				a += interval;
				break;
			case "G":
				y -= interval;
				g += interval;
				break;
			case "C":
				y += interval;
				c += interval;
				break;
			case "T":
				x -= interval;
				t += interval;
				break;
		}
	});
	return { x, y, a: a / coordScale, g: g / coordScale, c: c / coordScale, t: t / coordScale };
}
