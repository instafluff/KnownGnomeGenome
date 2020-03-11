const fs = require( "fs" );

const genomeLines = fs.readFileSync( "sequences.fasta" ).toString().split( "\n" );

let viruses = {};

let currentVirus = null;
for( let i = 0; i < genomeLines.length; i++ ) {
	if( genomeLines[ i ].startsWith( ">" ) ) {
		let parts = genomeLines[ i ].replace( ">", "" ).split( "|" );
		let id = parts[ 0 ];
		let name = parts[ 1 ];
		currentVirus = id;
		viruses[ id ] = {
			id: id,
			name: name,
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
		coord: genomeToCoord( viruses[ v ].genome )
	};
});
fs.writeFileSync( "web/viruses.json", JSON.stringify( output ) );
console.log( output );
// console.log( viruses );

function genomeToCoord( genome ) {
	let x = 0, y = 0;
	let a = 0, g = 0, c = 0, t = 0;
	genome.split( "" ).forEach( ( n, i ) => {
		// let interval = 1 / ( genome.length + 1 - i );
		let interval = 1 / ( i + 1 );
		switch( n ) {
			case "A":
				x += interval;//1 / ( i + 1 );
				a += interval;
				break;
			case "G":
				// x -= interval;//1 / ( i + 1 );
				y -= interval;//1 / ( i + 1 );
				g += interval;
				break;
			case "C":
				y += interval;//1 / ( i + 1 );
				c += interval;
				break;
			case "T":
				// y -= interval;//1 / ( i + 1 );
				x -= interval;//1 / ( i + 1 );
				t += interval;
				break;
		}
	});
	return { x, y, a, g, c, t };
}
