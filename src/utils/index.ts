export const generateRandomString = () => {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < possible.length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

export const formatSongTitleAndArtist = (artist: string, name: string) => {
	let track = artist + " " + name;

	const encoded = encodeURIComponent(track)
		.replace("(", "%28")
		.replace(")", "%29");

	return encoded;
};
