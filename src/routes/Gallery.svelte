<script>
	import { pb } from '$lib/pocketbase';

	let name = $state('');
	let details = $state('');
	let image = $state('');
	let link = $state('');

	const handleUpload = async (e) => {
		e.preventDefault();

		try {
			let data = new FormData();

			data.append('name', name);
			data.append('info', details);
			data.append('link', link);
			data.append('image', image);

			const record = await pb.collection('gallery').create(data);

			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};

	function handleFileInput(event) {
		image = event.target.files[0];
	}
</script>

<main>
	<h1 class="text-center">Gallery</h1>
	<hr />
	<form action="submit" onsubmit={handleUpload} class="form-control">
		<label for="name" class="form-label">Name: </label>
		<input bind:value={name} type="text" class="form-control" required />
		<br />
		<label for="name" class="form-label">Details: </label>
		<input type="text" bind:value={details} class="form-control" required />
		<br />
		<label for="name" class="form-label">Image: </label>
		<input
			type="file"
			alt="image"
			oninput={handleFileInput}
			accept="image/*"
			required
			class="form-control"
		/>
		<br />
		<label for="link" class="form-label">Link: </label>
		<input bind:value={link} type="url" class="form-control" required />
		<br />
		<div class="text-center">
			<button type="submit" class="btn btn-lg btn-outline-dark">Upload</button>
		</div>
	</form>
</main>

<style>
	form {
		max-width: 32rem;
	}
</style>
