<script>
	import { pb } from '$lib/pocketbase';

	import Swal from 'sweetalert2';

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 1500
		});
	}

	let gallery = $state([]);

	async function refresh() {
		const records = await pb.collection('gallery').getFullList({
			sort: '-created'
		});

		gallery = records;
	}

	$effect(() => {
		refresh();
	});

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

			if (record) {
				sweetAlert('success', 'Record Uploaded Successfully!');
				refresh();
			}
		} catch (error) {
			sweetAlert('error', 'An error occured');

			console.log(error);
		}
	};

	function handleFileInput(event) {
		image = event.target.files[0];
	}

	const getImageUrl = (record, filename) => {
		return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
	};

	const handleDelete = async (id) => {
		try {
			const record = await pb.collection('gallery').delete(id);

			console.log(record);

			if (record) {
				sweetAlert('success', 'Record Deleted Successfully!');

				refresh();
			}
		} catch (error) {
			sweetAlert('error', 'An error has occurred!');

			console.log(error);
		}
	};
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

	{#await gallery}
		<p>Loading...</p>
	{:then gallery}
		<div class="gallery-container">
			{#each gallery as data}
				<div class="imageDiv">
					<img src={getImageUrl(data, data.image)} alt={data.name} />
					<h3>{data.name}</h3>
					<p>{data.info}</p>
					<a href={data.link} target="_blank">View Project</a>
					<div class="p-2">
						<button class="btn btn-outline-danger" onclick={handleDelete(data.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</main>

<style>
	form {
		max-width: 32rem;
		margin: auto;
		padding: 1rem;
	}

	.gallery-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1.5rem;
		padding: 2rem;
		max-width: 1200px;
		margin: auto;
	}

	.imageDiv {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		background-color: #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.imageDiv:hover {
		transform: scale(1.03);
	}

	img {
		width: 100%;
		height: 9rem;
		display: block;
	}

	.imageDiv h3 {
		font-size: 1.1rem;
		margin: 0.5rem 0 0.25rem;
	}

	.imageDiv p {
		font-size: 0.9rem;
		color: #555;
		margin: 0 0 0.5rem;
	}

	.imageDiv a {
		margin-bottom: 1rem;
		color: #0d6efd;
		text-decoration: none;
	}

	.imageDiv a:hover {
		text-decoration: underline;
	}
</style>
