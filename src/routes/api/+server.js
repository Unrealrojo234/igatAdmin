export function GET() {
	return new Response(
		JSON.stringify({
			name: 'Ryan',
			age: 20,
			isFit: true
		})
	);
}
