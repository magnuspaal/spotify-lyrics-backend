export interface ISong {
	artists: IArtist[];
	name: string;
	album: { images: IImage[] };
}

interface IArtist {
	id: number;
	name: string;
	type: string;
}

interface IImage {
	height: number;
	url: string;
	width: number;
}
